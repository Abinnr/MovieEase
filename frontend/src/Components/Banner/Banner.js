import React, { useEffect, useState } from 'react'
import './Banner.css';

import { API_KEY ,imageUrl } from '../../Constants/Constants';
import axios from '../../axios';

const Banner = () => {
  const [movie, setMovie] = useState()
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    axios.get(`trending/all/week?api_key=${API_KEY}&language=en-US`).then((response) => {
      console.log('Trending movies:', response.data.results)
      setMovies(response.data.results)
      setMovie(response.data.results[0])
    })
  }, [])

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [movies.length])

  // Update movie when currentIndex changes
  useEffect(() => {
    if (movies.length > 0) {
      setMovie(movies[currentIndex])
    }
  }, [currentIndex, movies])
    
  return (
    <div style={{backgroundImage:`url(${movie? imageUrl+movie.backdrop_path:""})`}} className='banner'>
        <div className='content'>
            <h1 className='movie-name'>{movie? movie.title || movie.name:""}</h1>
            <div className='banner-buttons'>
                <button className='button'>Play</button>
                <button className='button'>My List</button>
            </div>
            <h1 className='description'>{movie? movie.overview:""}</h1>
        </div>
        <div className='fade-bottom'></div>
    </div>
  )
}

export default Banner