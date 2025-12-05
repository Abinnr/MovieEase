# MovieEase - Setup Instructions

This document explains how to run the complete MovieEase application with the recommendation engine.

## Architecture

- **Frontend** (`frontend/`): React app that displays movies from TMDB API
- **Recommendation API** (`recommendation/`): Flask backend that provides movie details and genre-based recommendations
- **Both use TMDB API**: So all movie IDs are aligned and consistent

## Prerequisites

- Node.js (v14+) and npm installed
- Python 3.7+ installed
- TMDB API key (already included in `frontend/src/Constants/Constants.js`)

## Step 1: Setup Recommendation API

Open Command Prompt and navigate to the recommendation folder:

```cmd
cd c:\Users\USER\Desktop\MovieEase\recommendation
```

Install dependencies:

```cmd
pip install -r requirements.txt
```

Start the Flask API server:

```cmd
python api.py
```

You should see output like:
```
* Running on http://127.0.0.1:5000
```

**Keep this terminal open!** The API needs to be running for the frontend to fetch recommendations.

## Step 2: Setup Frontend

Open a **new** Command Prompt and navigate to the frontend folder:

```cmd
cd c:\Users\USER\Desktop\MovieEase\frontend
```

Install dependencies (first time only):

```cmd
npm install
```

Start the React dev server:

```cmd
npm start
```

This will automatically open `http://localhost:3000` in your browser.

## Step 3: Test the Feature

1. On the home page, you'll see rows of movies
2. **Click on any movie poster** → You should be navigated to that movie's details page
3. The details page will show:
   - Movie title, poster image, rating, and overview
   - "Back" button to return to home page
   - List of recommended movies based on the movie's genres

Click on any recommended movie to see its details and recommendations.

## Troubleshooting

### Movies not visible when clicked

**Make sure the Flask API is running:**
- Check that you see the `http://127.0.0.1:5000` message in the recommendation terminal
- If not, restart it: `python api.py`

**Check browser console for errors:**
- Open DevTools (F12) → Console tab
- Look for error messages that mention API calls
- Common issue: "Failed to fetch from http://localhost:5000" means the API server isn't running

### Page is blank after clicking a movie

1. Check that the API is running (see above)
2. Check browser console for errors
3. Try opening `http://localhost:5000/movie/278` in browser to verify API is working
   - You should see JSON data with movie details

### "Cannot GET /movie/:id" error

Make sure you're running `python api.py` in the recommendation folder, not from somewhere else.

## API Endpoints

Once the API is running, you can test it directly:

```
GET http://localhost:5000/
```
Returns: `{"status": "ok", "message": "Recommendation API running"}`

```
GET http://localhost:5000/movie/278
```
Returns: Movie details and 12 recommended movies based on genres

## File Structure

```
MovieEase/
├── frontend/
│   ├── package.json          (dependencies)
│   ├── public/
│   └── src/
│       ├── App.js            (routing: home page + movie details)
│       ├── Components/
│       │   ├── MovieDetails/  (NEW: details page component)
│       │   ├── RowPost/       (updated: clickable posters)
│       │   ├── Banner/
│       │   └── NavBar/
│       └── Constants/
│           └── Constants.js   (TMDB API key)
│
└── recommendation/
    ├── api.py                (NEW: Flask API)
    ├── requirements.txt      (Python dependencies)
    ├── dataset.csv
    └── main.py
```

## Notes

- The recommendation engine uses TMDB's `/discover/movie` endpoint with genres
- Recommendations are sorted by popularity
- The API fetches fresh data from TMDB on each request (no local caching)
- For production, consider adding caching and a reverse proxy

## Stopping the Servers

- **Frontend**: Press `Ctrl+C` in the npm terminal
- **API**: Press `Ctrl+C` in the Flask terminal

Both will stop running.

Enjoy MovieEase! 🎬
