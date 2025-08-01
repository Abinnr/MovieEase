import logo from './logo.svg';
import './App.css';
import React from 'react';
import {originals, action,comedy,horror,romance,documentary} from './urls';
import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';
import RowPost from './Components/RowPost/RowPost';
// import RowPost2 from './Components/RowPost/RowPost2';


function App() {
  return (
    <div className="MovieEase App">
      <NavBar />
      <Banner />
      <RowPost title='MovieEase Originals' url={originals} />
      <RowPost title='Actions' isSmall url={action} />
      <RowPost title='Comedy' isSmall url={comedy} />
      <RowPost title='Horror' isSmall url={horror} />
      <RowPost title='Romance' isSmall url={romance} />
      <RowPost title='Documentaries ' isSmall url={documentary} />

    </div>
  );
}

export default App;
