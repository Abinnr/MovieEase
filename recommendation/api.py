from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load dataset
DF_PATH = 'dataset.csv'
df = pd.read_csv(DF_PATH)

# Preprocess genres into list for each movie
def parse_genres(genre_str):
    if pd.isna(genre_str):
        return []
    # genres are stored like "Drama,Crime"
    return [g.strip() for g in str(genre_str).split(',') if g.strip()]

df['genres_list'] = df['genre'].apply(parse_genres)

def find_movie_by_id(mid):
    row = df[df['id'] == int(mid)]
    if row.empty:
        return None
    return row.iloc[0].to_dict()

def recommend_by_genre(mid, n=10):
    movie = find_movie_by_id(mid)
    if movie is None:
        return []
    target_genres = set(movie.get('genres_list', []))
    if not target_genres:
        return []

    # Score other movies by number of shared genres, then by popularity
    candidates = []
    for _, r in df.iterrows():
        if int(r['id']) == int(mid):
            continue
        other_genres = set(r['genres_list'])
        shared = len(target_genres & other_genres)
        if shared > 0:
            # use popularity as tiebreaker
            candidates.append((shared, float(r.get('popularity') or 0), r.to_dict()))

    # sort by shared desc, popularity desc
    candidates.sort(key=lambda x: (x[0], x[1]), reverse=True)
    # return top n movie dicts
    return [c[2] for c in candidates[:n]]


@app.route('/')
def index():
    return jsonify({'status': 'ok', 'message': 'Recommendation API running'})


@app.route('/movie/<int:mid>')
def movie(mid):
    movie = find_movie_by_id(mid)
    if movie is None:
        return jsonify({'error': 'movie not found'}), 404
    recs = recommend_by_genre(mid, n=12)
from flask import Flask, jsonify
from flask_cors import CORS
import os
import requests
import time

app = Flask(__name__)
CORS(app)

# TMDB API configuration
TMDB_API_KEY = "754f863301d50dc2b124f76f8721b4b8"  # from Constants.js
TMDB_BASE = "https://api.themoviedb.org/3"

# Configure requests session with retries
session = requests.Session()
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)

def fetch_tmdb_movie(mid, retries=3):
    """Fetch a single movie from TMDB by id with retry logic."""
    url = f"{TMDB_BASE}/movie/{mid}?api_key={TMDB_API_KEY}&language=en-US"
    
    for attempt in range(retries):
        try:
            r = session.get(url, timeout=10)
            if r.status_code == 200:
                data = r.json()
                genres = [g.get('name') for g in data.get('genres', []) if g.get('name')]
                return {
                    'id': data.get('id'),
                    'title': data.get('title') or data.get('name'),
                    'genre': ','.join(genres),
                    'genres_list': genres,
                    'overview': data.get('overview'),
                    'popularity': data.get('popularity'),
                    'release_date': data.get('release_date'),
                    'vote_average': data.get('vote_average'),
                    'poster_path': data.get('poster_path')
                }
            elif r.status_code == 404:
                print(f"Movie {mid} not found on TMDB (404)")
                return None
            else:
                print(f"TMDB returned {r.status_code} for movie {mid}, retrying... (attempt {attempt+1}/{retries})")
        except requests.exceptions.Timeout:
            print(f"Timeout fetching movie {mid}, retrying... (attempt {attempt+1}/{retries})")
        except requests.exceptions.ConnectionError as e:
            print(f"Connection error fetching movie {mid}: {e}, retrying... (attempt {attempt+1}/{retries})")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # exponential backoff
        except Exception as e:
            print(f"Error fetching movie {mid}: {e}")
            return None
    
    print(f"Failed to fetch movie {mid} after {retries} retries")
    return None


def fetch_recommendations_by_genres(genres_list, exclude_id=None, n=12):
    """
    Fetch recommendations from TMDB by genres using discover endpoint.
    genres_list: list of genre names (e.g., ['Drama', 'Crime'])
    exclude_id: movie id to exclude from results
    n: number of recommendations to return
    """
    if not genres_list:
        return []
    
    # Convert genre names to TMDB genre ids (with retry)
    all_genres_url = f"{TMDB_BASE}/genre/movie/list?api_key={TMDB_API_KEY}&language=en-US"
    try:
        for attempt in range(3):
            try:
                r = session.get(all_genres_url, timeout=10)
                if r.status_code == 200:
                    genre_data = r.json()
                    tmdb_genres = {g['name']: g['id'] for g in genre_data.get('genres', [])}
                    break
            except (requests.exceptions.Timeout, requests.exceptions.ConnectionError):
                if attempt < 2:
                    time.sleep(2)
                    continue
                return []
        else:
            return []
        
        # Map our genre names to TMDB ids
        genre_ids = [tmdb_genres[g] for g in genres_list if g in tmdb_genres]
        if not genre_ids:
            return []
        
        # Use discover endpoint to find similar movies
        genre_ids_str = ','.join(map(str, genre_ids))
        discover_url = (
            f"{TMDB_BASE}/discover/movie?"
            f"api_key={TMDB_API_KEY}&language=en-US"
            f"&with_genres={genre_ids_str}"
            f"&sort_by=popularity.desc"
            f"&page=1"
        )
        
        for attempt in range(3):
            try:
                r = session.get(discover_url, timeout=10)
                if r.status_code == 200:
                    data = r.json()
                    results = []
                    for movie in data.get('results', []):
                        if len(results) >= n:
                            break
                        if exclude_id and movie.get('id') == int(exclude_id):
                            continue
                        genres = [g.get('name', '') for g in movie.get('genres', []) if g.get('name')]
                        results.append({
                            'id': movie.get('id'),
                            'title': movie.get('title'),
                            'genre': ','.join(genres),
                            'overview': movie.get('overview'),
                            'popularity': movie.get('popularity'),
                            'release_date': movie.get('release_date'),
                            'vote_average': movie.get('vote_average'),
                            'poster_path': movie.get('poster_path')
                        })
                    return results
            except (requests.exceptions.Timeout, requests.exceptions.ConnectionError):
                if attempt < 2:
                    time.sleep(2)
                    continue
                return []
    except Exception as e:
        print(f"Error fetching recommendations: {e}")
    
    return []


@app.route('/')
def index():
    return jsonify({'status': 'ok', 'message': 'Recommendation API running'})


@app.route('/movie/<int:mid>')
def movie(mid):
    """Get movie details and genre-based recommendations."""
    print(f"Fetching movie {mid}...")
    movie_data = fetch_tmdb_movie(mid)
    
    if movie_data is None:
        print(f"Failed to fetch movie {mid}")
        return jsonify({'error': f'Movie {mid} not found on TMDB or connection error'}), 404
    
    print(f"Successfully fetched movie {mid}: {movie_data.get('title')}")
    genres_list = movie_data.get('genres_list', [])
    
    print(f"Fetching recommendations for genres: {genres_list}...")
    recs = fetch_recommendations_by_genres(genres_list, exclude_id=mid, n=12)
    print(f"Found {len(recs)} recommendations")
    
    return jsonify({'movie': movie_data, 'recommendations': recs})


if __name__ == '__main__':
    # Runs on port 5000 by default. Start with: python api.py
    print("Starting MovieEase Recommendation API...")
    print(f"TMDB API Key configured: {TMDB_API_KEY[:10]}...")
    app.run(host='0.0.0.0', port=5000, debug=True)