import React, { useState, useEffect } from 'react';
import './App.css';

const soundMapper: { [key: string]: string } = {
  c: './assets/audio/a.mp3',
  d: './assets/audio/d.mp3',
  e: './assets/audio/e.mp3',
  f: './assets/audio/f.mp3',
  g: './assets/audio/g.mp3',
  a: './assets/audio/a.mp3',
  b: './assets/audio/b.mp3',
  'c♯': './assets/audio/c♯.mp3',
  'd♯': './assets/audio/d♯.mp3',
  'f♯': './assets/audio/f♯.mp3',
  'g♯': './assets/audio/g♯.mp3',
  'a♯': './assets/audio/a♯.mp3',
};

const keys = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
  { letter: 'R', note: 'c♯', sharp: true },
  { letter: 'T', note: 'd♯', sharp: true },
  { letter: 'U', note: 'f♯', sharp: true },
  { letter: 'I', note: 'g♯', sharp: true },
  { letter: 'O', note: 'a♯', sharp: true },
];

function App() {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [showLetters, setShowLetters] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = keys.find(key => key.letter === event.key.toUpperCase())?.note;
      if (note && !activeNotes.includes(note)) {
        setActiveNotes(prev => [...prev, note]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = keys.find(key => key.letter === event.key.toUpperCase())?.note;
      if (note) {
        setActiveNotes(prev => prev.filter(n => n !== note));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const playSound = (note: string) => {
    const audio = new Audio(soundMapper[note]);
    audio.currentTime = 0;
    audio.play();
  };

  const handleNoteClick = (note: string) => {
    if (!activeNotes.includes(note)) {
      setActiveNotes([...activeNotes, note]);
      playSound(note);
    }
  };

  const toggleLetters = () => setShowLetters(!showLetters);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`} onClick={toggleLetters}>Notes</button>
          <button className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`} onClick={toggleLetters}>Letters</button>
        </div>
        <div className={`piano ${showLetters ? 'letters' : ''}`}>
          {keys.map(({ letter, note, sharp }) => (
            <div
              key={note}
              className={`piano-key ${sharp ? 'sharp' : ''} ${activeNotes.includes(note) ? 'piano-key-active' : ''}`}
              data-letter={letter}
              data-note={note}
              onMouseDown={() => handleNoteClick(note)}
              onMouseUp={() => setActiveNotes(prev => prev.filter(n => n !== note))}
              onMouseOut={() => setActiveNotes(prev => prev.filter(n => n !== note))}
            >
              {showLetters ? letter : ''}
            </div>
          ))}
        </div>
        <button className="fullscreen openfullscreen" onClick={toggleFullscreen}></button>
      </main>
      <footer className="footer">
        <div className="footer-container">
          2020
        </div>
      </footer>
    </div>
  );
}

export default App;