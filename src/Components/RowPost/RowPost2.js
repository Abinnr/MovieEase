import React,{useEffect,useState} from 'react'
import './RowPost2.css';
import { API_KEY ,comedyUrl } from '../../Constants/Constants';
import axios from '../../axios'
const RowPost = () => {
  const [movies,setMovies]=useState([])
  useEffect(()=>{
    axios.get(`discover/movie?api_key=${API_KEY}&with_genres=35`).then(responce=>{
      console.log(responce.data)
      setMovies(responce.data.results)
    }).catch(err=>{
      //alert('Network error')
    })
  },[])
  return (
    <>

    <div className='row'>
        <h2>Featured</h2>
        <div className='posters'>
          {movies.map((obj)=>
          <img src={`${comedyUrl+obj.backdrop_path}`}alt='Comedy' className='post1' />
          )}

        </div>
    </div>
    </>
    

    
  )
}

export default RowPost