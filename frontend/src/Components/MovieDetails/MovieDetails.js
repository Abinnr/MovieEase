import React, { useEffect, useState } from 'react'
import './MovieDetails.css'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { imageUrl, API_KEY, baseUrl } from '../../Constants/Constants'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'movie'  // Default to 'movie', can be 'tv'
  
  const [item, setItem] = useState(null)
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log(`=== MovieDetails: Fetching ${type}`, id)
    if (!id) {
      setError('No ID provided')
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    const fetchData = async () => {
      try {
        // Fetch details directly from TMDB (TV or Movie)
        const itemUrl = `${baseUrl}/${type}/${id}?api_key=${API_KEY}&language=en-US`
        console.log('Fetching from:', itemUrl)
        
        const itemRes = await fetch(itemUrl)
        if (!itemRes.ok) {
          throw new Error(`Failed to fetch ${type}: ${itemRes.status}`)
        }
        
        const itemData = await itemRes.json()
        console.log(`${type} data received:`, itemData)
        
        // Format data
        const genres = itemData.genres?.map(g => g.name).join(', ') || ''
        const title = itemData.title || itemData.name
        const releaseDate = itemData.release_date || itemData.first_air_date
        
        const formattedItem = {
          id: itemData.id,
          title: title,
          genre: genres,
          overview: itemData.overview,
          popularity: itemData.popularity,
          release_date: releaseDate,
          vote_average: itemData.vote_average,
          poster_path: itemData.poster_path,
          type: type
        }
        
        setItem(formattedItem)
        console.log('Formatted item:', formattedItem)
        
        // Fetch recommendations based on genres
        if (itemData.genres && itemData.genres.length > 0) {
          const genreIds = itemData.genres.map(g => g.id).join(',')
          // For TV shows, recommend other TV shows; for movies, recommend movies
          const discoverUrl = `${baseUrl}/discover/${type}?api_key=${API_KEY}&language=en-US&with_genres=${genreIds}&sort_by=popularity.desc&page=1`
          console.log('Fetching recommendations from:', discoverUrl)
          
          const discoverRes = await fetch(discoverUrl)
          if (discoverRes.ok) {
            const discoverData = await discoverRes.json()
            const recsList = discoverData.results
              ?.filter(m => m.id !== parseInt(id))
              .slice(0, 12)
              .map(m => ({
                id: m.id,
                title: m.title || m.name,
                genre: m.genres?.map(g => g.name).join(', ') || '',
                overview: m.overview,
                popularity: m.popularity,
                release_date: m.release_date || m.first_air_date,
                vote_average: m.vote_average,
                poster_path: m.poster_path,
                type: type
              })) || []
            console.log('Recommendations:', recsList)
            setRecs(recsList)
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${type} details:`, err)
        setError(err.message || `Failed to fetch ${type} details`)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, type])

  if (loading) return <div className="movie-details loading">Loading {type} {id}...</div>
  if (error) return <div className="movie-details error">Error: {error}</div>
  if (!item) return <div className="movie-details error">{type} not found (ID: {id})</div>

  const posterUrl = item.poster_path
    ? `${imageUrl}${item.poster_path}`
    : null

  return (
    <div className="movie-details container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      {/* Debug info */}
      <div style={{fontSize: '12px', color: '#999', marginBottom: '10px', padding: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px'}}>
        {type.toUpperCase()} ID: {id} | Title: {item?.title} | Poster: {item?.poster_path ? '✓' : '✗'}
      </div>
      
      <div className="details-main">
        <div className="poster">
          {posterUrl ? (
            <img src={posterUrl} alt={item.title} className="poster-img" />
          ) : (
            <div className="poster-placeholder">{item.title}</div>
          )}
        </div>
        <div className="meta">
          <h1>{item.title}</h1>
          <p className="sub">
            {item.genre} • {item.release_date} • ⭐ {item.vote_average}
          </p>
          <p className="overview">{item.overview}</p>
        </div>
      </div>

      <h3>Recommended {type === 'tv' ? 'TV shows' : 'movies'} based on genres</h3>
      <div className="recommendations">
        {recs && recs.length > 0 ? (
          recs.map((r) => (
            <div
              key={r.id}
              className="rec-card"
              onClick={() => navigate(`/movie/${r.id}?type=${r.type}`)}
            >
              {r.poster_path ? (
                <img
                  src={`${imageUrl}${r.poster_path}`}
                  alt={r.title}
                  className="rec-poster"
                />
              ) : (
                <div className="rec-poster-placeholder">{r.title}</div>
              )}
              <div className="rec-title">{r.title}</div>
              <div className="rec-sub">{r.genre}</div>
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
