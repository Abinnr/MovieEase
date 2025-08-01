import React,{useEffect,useState} from 'react'
import YouTube from 'react-youtube';
import './RowPost.css';
import { API_KEY, imageUrl } from '../../Constants/Constants';
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
      height: '590',
      width: '1200',
      playerVars: {
        autoplay: 1,
      },
    };

    const handleMovie=(id)=>{
      console.log(id)
      axios.get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`).then(responce=>{
        if(responce.data.results.length!==0){
            setUrlId(responce.data.results[0])
        }else{
          console.log('Arry empty')
        }
      })
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

      { urlid &&
          <YouTube videoId={urlid.key} opts={opts}  />
      }  
    </div>

    
    </>
    

    
  )
}

export default RowPost