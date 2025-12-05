import logo from './logo.svg';
import './App.css';
import React from 'react';
import {originals, action,comedy,horror,romance,documentary} from './urls';
import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';
import RowPost from './Components/RowPost/RowPost';
import MovieDetails from './Components/MovieDetails/MovieDetails'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'


function App() {
  return (
    <Router>
      <div className="MovieEase App">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <RowPost title='MovieEase Originals' url={originals} />
              <RowPost title='Actions' isSmall url={action} />
              <RowPost title='Comedy' isSmall url={comedy} />
              <RowPost title='Horror' isSmall url={horror} />
              <RowPost title='Romance' isSmall url={romance} />
              <RowPost title='Documentaries ' isSmall url={documentary} />
            </>
          } />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
