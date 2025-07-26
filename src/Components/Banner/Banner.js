import React from 'react'
import './Banner.css';

const Banner = () => {
  return (
    <div className='banner'>
        <div className='content'>
            <h1 className='title'>Welcome to MoviEase</h1>
            <div className='banner-buttons'>
                <button className='button'>Play</button>
                <button className='button'>My List</button>
            </div>
            <h1 className='description'>lalalalalalalalalllalalallalalalala</h1>
        </div>
        <div className='fade-bottom'></div>
    </div>
  )
}

export default Banner