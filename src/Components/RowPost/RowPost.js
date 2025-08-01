import React,{useEffect,useState} from 'react'
import YouTube from 'react-youtube';
import './RowPost.css';
import { imageUrl } from '../../Constants/Constants';
import axios from '../../axios'
const RowPost = (props) => {
  const [movies,setMovies]=useState([])
  useEffect(()=>{
    axios.get(props.url).then(responce=>{
      console.log(responce.data)
      setMovies(responce.data.results)
    }).catch(err=>{
      //alert('Network error')
    })
  },[])


  const [urlid,setUrlId]=useState('')
  const opts = {
      height: '390',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

    const handleMovie=(id)=>{
      console.log(id)
      axios.get()
    }
  return (
    <>
    <div className='row'>
        <h2>{props.title}</h2>
        <div className='posters'>
          {movies.map((obj)=>
          <img onClick={()=>handleMovie(obj.id)} src={`${imageUrl+obj.backdrop_path}`}alt='MovieEase movies' className={props.isSmall?'smallpost1':'post1'} />
          )}

        </div>

        <YouTube videoId="2g811Eo7K8U" opts={opts}  />
    </div>

    
    </>
    

    
  )
}

export default RowPost