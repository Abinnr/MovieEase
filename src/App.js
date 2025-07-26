import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';
import RowPost from './Components/RowPost/RowPost';



function App() {
  return (
    <div className="Natflix App">
      <NavBar />
      <Banner />
      <RowPost />
    </div>
  );
}

export default App;
