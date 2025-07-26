import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';

function App() {
  return (
    <div className="Natflix App">
      <NavBar />
      <Banner />
    </div>
  );
}

export default App;
