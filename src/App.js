import logo from './logo.svg';
import './App.css';
import React from 'react';
import {originals, action,comedy} from './urls';
import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';
import RowPost from './Components/RowPost/RowPost';
// import RowPost2 from './Components/RowPost/RowPost2';


function App() {
  return (
    <div className="Netflix App">
      <NavBar />
      <Banner />
      <RowPost title='Netflix Originals' url={originals} />
      <RowPost title='Actions' isSmall url={action} />
      <RowPost title='Comedy' isSmall url={comedy} />
    </div>
  );
}

export default App;
