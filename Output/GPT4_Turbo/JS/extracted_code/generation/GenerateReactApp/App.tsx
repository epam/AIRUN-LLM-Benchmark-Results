import React from 'react';
import './App.css';
import CharactersList from './CharactersList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SWAPI Characters</h1>
        <CharactersList />
      </header>
    </div>
  );
}

export default App;