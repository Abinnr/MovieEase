import React,{useEffect,useState} from 'react'
import YouTube from 'react-youtube';
import './RowPost.css';
import { API_KEY, imageUrl } from '../../Constants/Constants';
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'

const RowPost = (props) => {
  const [movies,setMovies]=useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get(props.url).then(responce=>{
      console.log('RowPost data:', responce.data)
      setMovies(responce.data.results)
    }).catch(err=>{
      console.error('Error fetching RowPost movies:', err)
    })
  },[props.url])

  // Determine if this is TV or Movie based on the URL
  const isTV = props.url?.includes('discover/tv')

  const [urlid,setUrlId]=useState('')
  const opts = {
      height: '590',
      width: '1200',
      playerVars: {
        autoplay: 1,
      },
    };

    const handleMovie=(id)=>{
      console.log('Playing trailer for:', isTV ? 'TV show' : 'movie', id)
      const endpoint = isTV ? `tv/${id}/videos` : `movie/${id}/videos`
      axios.get(`/${endpoint}?api_key=${API_KEY}&language=en-US`).then(responce=>{
        if(responce.data.results.length!==0){
            setUrlId(responce.data.results[0])
        }else{
          console.log('No trailers available')
        }
      }).catch(err=>{
        console.error('Error fetching trailer:', err)
      })
    }

    const handleMovieClick = (item) => {
      // Pass both ID and type for TV/Movie distinction
      const itemType = isTV ? 'tv' : 'movie'
      console.log(`Navigating to ${itemType} details:`, item.id, item.title || item.name)
      navigate(`/movie/${item.id}?type=${itemType}`)
    }

  return (
    <>
    <div className='row'>
        <h2>{props.title}</h2>
        <div className='posters'>
          {movies.map((obj)=>
          <div key={obj.id} className='poster-wrap' onClick={()=>handleMovieClick(obj)}>
            <img 
              src={`${imageUrl}${obj.backdrop_path || obj.poster_path}`} 
              alt={obj.title || obj.name || 'Movie'} 
              className='poster-img' 
              onError={(e) => {
                e.target.src = `${imageUrl}/default-poster.jpg`;
                e.target.style.backgroundColor = '#333';
              }}
            />
            <div className='poster-overlay'>
              <div className='overlay-content'>
                <h4>{obj.title || obj.name}</h4>
                <p className='rating'>⭐ {obj.vote_average?.toFixed(1)}</p>
              </div>
            </div>
            <button className='play-btn' onClick={(e)=>{e.stopPropagation(); handleMovie(obj.id)}}>▶</button>
          </div>
          )}

        </div>

      { urlid &&
          <YouTube videoId={urlid.key} opts={opts}  />
      }  
    </div>

    
    </>


  )
}

export default RowPost