



https://github.com/user-attachments/assets/bd6c1c70-d5b6-49c2-b3fa-77d309a02f70




# MovieEase

A lightweight React frontend that browses movies and TV shows using TMDB, with a small Flask-based recommendations helper. This repository contains:

- `frontend/` — React app (UI, routing, components)
- `recommendation/` — small Flask service that can fetch movie details / recommendations (uses TMDB API)

Quick overview
- Frontend uses TMDB (The Movie Database) for all movie data and images.
- The app supports movies and TV shows and shows recommendations by genre.

Prerequisites
- Node.js (for frontend)
- npm or yarn
- Python 3.8+ (for the optional recommendation API)
- A TMDB API key (https://www.themoviedb.org/settings/api)

Environment variables
- TMDB API key should be available to both frontend and backend. Common variable name used in code: `API_KEY`.
  - Frontend: the project references the TMDB key where appropriate (see `frontend/src/Constants/Constants.js`).
  - Backend (recommendation): set `TMDB_API_KEY` or `API_KEY` depending on how you run it (see `recommendation/api.py`).

Running the frontend (Windows cmd)
1. Open a cmd prompt and navigate into the frontend folder:

```cmd
cd c:\Users\USER\Desktop\MovieEase\frontend
```

2. Install dependencies (first time):

```cmd
npm install
```

3. Start the dev server:

```cmd
npm start
```

- The React app will usually run on http://localhost:3000

Running the recommendation API (optional)
1. Create / activate a virtual environment (recommended):

```cmd
cd c:\Users\USER\Desktop\MovieEase\recommendation
python -m venv env
env\Scripts\activate
```

2. Install Python dependencies:

```cmd
pip install -r requirements.txt
```

3. Set your TMDB API key and run the Flask app (example using environment variable):

```cmd
set TMDB_API_KEY=your_tmdb_key_here
python api.py
```

- The API typically listens on port 5000 (see `api.py` for exact details). The frontend calls TMDB directly but the recommendation API is provided as a helper.

Important files and components
- `frontend/src/Components/Banner/` — top banner component (auto-rotates, shows current trending movie)
- `frontend/src/Components/RowPost/` — rows of posters, navigation to details
- `frontend/src/Components/MovieDetails/` — details page with recommendations
- `frontend/src/Constants/Constants.js` — base URL, image base and API key references
- `recommendation/api.py` — Flask code that can fetch from TMDB and return recommendations (if used)

Notes & Troubleshooting
- If posters look stretched or sized inconsistently, check the CSS in `frontend/src/Components/RowPost/RowPost.css` and ensure `object-fit: cover` is applied to images.
- If data doesn't match (IDs or titles), both frontend and API should consistently use TMDB as the single source of truth.
- For CORS or network issues, ensure the backend (Flask) has CORS enabled (`Flask-CORS`) and the frontend is allowed to call it.

License
- Pick a license for your project (e.g., MIT) or leave as private.

Contact
- For development notes, check `recommendation/README.md` or `frontend/README.md` (if present).

Enjoy building MovieEase!
