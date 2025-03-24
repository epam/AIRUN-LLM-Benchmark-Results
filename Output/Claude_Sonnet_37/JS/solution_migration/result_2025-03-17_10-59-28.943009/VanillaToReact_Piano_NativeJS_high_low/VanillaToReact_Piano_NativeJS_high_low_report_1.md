I have the following application code that needs to migrate:

<source_code>
```html
// index.html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="./assets/piano.ico" rel="shortcut icon">

  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
    rel="stylesheet">
  <link href="./css/style.css" rel="stylesheet">

  <title>virtual-piano</title>
</head>

<body>
  <header class="header">
    <h1 class="header-title">Virtual Piano</h1>
  </header>
  <main class="main">
    <div class="btn-container">
      <button class="btn btn-notes btn-active">Notes</button>
      <button class="btn btn-letters">Letters</button>
    </div>
    <div class="piano">
      <div class="piano-key" data-letter="D" data-note="c"></div>
      <div class="piano-key" data-letter="F" data-note="d"></div>
      <div class="piano-key" data-letter="G" data-note="e"></div>
      <div class="piano-key" data-letter="H" data-note="f"></div>
      <div class="piano-key" data-letter="J" data-note="g"></div>
      <div class="piano-key" data-letter="K" data-note="a"></div>
      <div class="piano-key" data-letter="L" data-note="b"></div>
      <div class="keys-sharp">
        <div class="piano-key sharp" data-letter="R" data-note="c♯"></div>
        <div class="piano-key sharp" data-letter="T" data-note="d♯"></div>
        <div class="piano-key sharp none"></div>
        <div class="piano-key sharp" data-letter="U" data-note="f♯"></div>
        <div class="piano-key sharp" data-letter="I" data-note="g♯"></div>
        <div class="piano-key sharp" data-letter="O" data-note="a♯"></div>
      </div>
    </div>
    <button class="fullscreen openfullscreen"></button>
  </main>
  <footer class="footer">
    <div class="footer-container">
        2020
    </div>
  </footer>
  <script src="./script.js"></script>
</body>

</html>
```

```js
// script.js
const soundMapper = {
    c: new Audio(`./assets/audio/a.mp3`),
    d: new Audio(`./assets/audio/d.mp3`),
    e: new Audio(`./assets/audio/e.mp3`),
    f: new Audio(`./assets/audio/f.mp3`),
    g: new Audio(`./assets/audio/g.mp3`),
    a: new Audio(`./assets/audio/a.mp3`),
    b: new Audio(`./assets/audio/b.mp3`),
    'c♯': new Audio(`./assets/audio/c♯.mp3`),
    'd♯': new Audio(`./assets/audio/d♯.mp3`),
    'f♯': new Audio(`./assets/audio/f♯.mp3`),
    'g♯': new Audio(`./assets/audio/g♯.mp3`),
    'a♯': new Audio(`./assets/audio/a♯.mp3`),
}

let played = [];

function play(event) {
    const isKeyboard = event instanceof KeyboardEvent;

    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) : event.target;
    if (!pianoEl) return;

    const note = pianoEl.dataset.note;
    if (!note || played.includes(note)) return;

    pianoEl.classList.add('piano-key-active')
    const sound = soundMapper[note]
    sound.currentTime = 0
    sound.play()
    played.push(note);
}

function resetActive(event) {
    const isKeyboard = event instanceof KeyboardEvent;

    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) : event.target;
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active')
    played = played.filter(note => note !== (pianoEl.dataset.note))
}

const btnContainer = document.querySelector(`.btn-container`)

btnContainer.addEventListener('click', change)

const piano = document.querySelector(`.piano`)

function change(event) {
    document.querySelector('.btn-active').classList.remove('btn-active')
    event.target.classList.add('btn-active')
    if (event.target.classList.contains('btn-letters')) {
        piano.classList.add('letters')
    } else {
        piano.classList.remove('letters')
    }
}

document.addEventListener('keydown', play)
document.addEventListener('keyup', resetActive)
piano.addEventListener('mousedown', play)
piano.addEventListener('mouseup', resetActive)
piano.addEventListener('mouseout', resetActive)
piano.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        play(event)
    }
})

function fullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen();
    }
}

const fullscreenButton = document.querySelector('.fullscreen');
fullscreenButton.addEventListener('click', fullscreen);
```

</source_code>

Please follow these steps:

1. Migrate the provided vanilla JavaScript application to React 18:
   - Use Create React App with TypeScript configuration
   - Implement strict TypeScript typing throughout the application
   - Preserve all existing functionality and behavior

2. Component Structure:
   - Create appropriate functional components with React hooks
   - Implement proper state management for UI interactions
   - Ensure event handling follows React patterns

3. Audio Implementation:
   - Properly handle audio resources in the React environment
   - Implement audio playback with appropriate React lifecycle considerations
   - Maintain the existing audio mapping structure with TypeScript interfaces

4. Event Handling:
   - Convert DOM event listeners to React synthetic events
   - Implement keyboard event handling at appropriate component levels
   - Ensure mouse interactions work identically to the original implementation

5. UI State Management:
   - Implement state for active keys and button selections
   - Ensure proper class toggling for visual feedback
   - Maintain the Notes/Letters toggle functionality

6. Fullscreen Functionality:
   - Implement the fullscreen toggle using React patterns
   - Handle browser compatibility for fullscreen API

7. Styling Requirements:
   - Preserve all CSS classes and styling behavior
   - Implement conditional class application using React patterns
   - Maintain responsive design aspects

8. Optimization:
   - Implement performance optimizations where appropriate
   - Use React.memo or other techniques to prevent unnecessary re-renders
   - Ensure efficient event handling for piano key interactions

9. Code Quality:
   - Follow React best practices and patterns
   - Ensure code is clean, readable, and maintainable
   - No TODOs should be present in the final code

## Run 1:
### Answer:
# React Migration of Virtual Piano Application

I'll migrate the vanilla JavaScript piano application to React 18 with TypeScript. Let's start by setting up the project structure and implementing the components.

## Project Setup

First, let's create a new React application with TypeScript:

```bash
npx create-react-app virtual-piano-react --template typescript
```

## Project Structure

Here's how I'll organize the code:

```
src/
  components/
    Header.tsx
    Piano.tsx
    PianoKey.tsx
    ButtonContainer.tsx
    FullscreenButton.tsx
    Footer.tsx
  hooks/
    useAudio.ts
    useFullscreen.ts
  types/
    index.ts
  assets/
    audio/
      a.mp3
      b.mp3
      c.mp3
      ...
    piano.ico
  App.tsx
  index.tsx
  styles.css
```

## Implementation

### 1. Types Definition

Let's start by defining our TypeScript interfaces:

```tsx
// src/types/index.ts
export interface Note {
  letter: string;
  note: string;
  isSharp?: boolean;
}

export interface AudioMap {
  [key: string]: HTMLAudioElement;
}

export interface PianoKeyProps {
  note: Note;
  isActive: boolean;
  onMouseDown: (note: string) => void;
  onMouseUp: (note: string) => void;
  onMouseOver: (note: string) => void;
  showLetters: boolean;
}

export interface ButtonContainerProps {
  showLetters: boolean;
  setShowLetters: (show: boolean) => void;
}
```

### 2. Custom Hooks

```tsx
// src/hooks/useAudio.ts
import { useRef, useEffect } from 'react';
import { AudioMap } from '../types';

export const useAudio = (): AudioMap => {
  const audioMap = useRef<AudioMap>({});

  useEffect(() => {
    // Initialize audio elements
    const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c♯', 'd♯', 'f♯', 'g♯', 'a♯'];
    
    notes.forEach(note => {
      audioMap.current[note] = new Audio(`${process.env.PUBLIC_URL}/assets/audio/${note}.mp3`);
    });
    
    // Cleanup function
    return () => {
      Object.values(audioMap.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  return audioMap.current;
};

// src/hooks/useFullscreen.ts
import { useState, useCallback, useEffect } from 'react';

export const useFullscreen = (): [boolean, () => void] => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return [isFullscreen, toggleFullscreen];
};
```

### 3. Components

```tsx
// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Virtual Piano</h1>
    </header>
  );
};

export default React.memo(Header);

// src/components/ButtonContainer.tsx
import React from 'react';
import { ButtonContainerProps } from '../types';

const ButtonContainer: React.FC<ButtonContainerProps> = ({ showLetters, setShowLetters }) => {
  return (
    <div className="btn-container">
      <button 
        className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
        onClick={() => setShowLetters(false)}
      >
        Notes
      </button>
      <button 
        className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
        onClick={() => setShowLetters(true)}
      >
        Letters
      </button>
    </div>
  );
};

export default React.memo(ButtonContainer);

// src/components/PianoKey.tsx
import React from 'react';
import { PianoKeyProps } from '../types';

const PianoKey: React.FC<PianoKeyProps> = ({ 
  note, 
  isActive, 
  onMouseDown, 
  onMouseUp, 
  onMouseOver,
  showLetters 
}) => {
  const { letter, note: noteName, isSharp } = note;
  
  const handleMouseDown = () => onMouseDown(noteName);
  const handleMouseUp = () => onMouseUp(noteName);
  const handleMouseOver = () => onMouseOver(noteName);

  const className = `piano-key ${isSharp ? 'sharp' : ''} ${isActive ? 'piano-key-active' : ''} ${noteName === '' ? 'none' : ''}`;

  return (
    <div 
      className={className}
      data-letter={letter}
      data-note={noteName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleMouseOver}
    >
      {showLetters && letter && <span className="piano-key-letter">{letter}</span>}
      {!showLetters && noteName && <span className="piano-key-note">{noteName}</span>}
    </div>
  );
};

export default React.memo(PianoKey);

// src/components/Piano.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PianoKey from './PianoKey';
import { Note } from '../types';
import { useAudio } from '../hooks/useAudio';

interface PianoProps {
  showLetters: boolean;
}

const Piano: React.FC<PianoProps> = ({ showLetters }) => {
  const audioMap = useAudio();
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const isMouseDownRef = useRef<boolean>(false);

  // Define piano keys
  const whiteKeys: Note[] = [
    { letter: 'D', note: 'c' },
    { letter: 'F', note: 'd' },
    { letter: 'G', note: 'e' },
    { letter: 'H', note: 'f' },
    { letter: 'J', note: 'g' },
    { letter: 'K', note: 'a' },
    { letter: 'L', note: 'b' }
  ];

  const blackKeys: Note[] = [
    { letter: 'R', note: 'c♯', isSharp: true },
    { letter: 'T', note: 'd♯', isSharp: true },
    { letter: '', note: '', isSharp: true }, // Empty space
    { letter: 'U', note: 'f♯', isSharp: true },
    { letter: 'I', note: 'g♯', isSharp: true },
    { letter: 'O', note: 'a♯', isSharp: true }
  ];

  // Map of keyboard keys to notes
  const keyToNoteMap = useRef<Record<string, string>>({});
  
  useEffect(() => {
    // Initialize key to note mapping
    [...whiteKeys, ...blackKeys].forEach(key => {
      if (key.letter && key.note) {
        keyToNoteMap.current[key.letter.toLowerCase()] = key.note;
      }
    });
  }, []);

  const playNote = useCallback((note: string) => {
    if (!note || activeNotes.includes(note)) return;
    
    const audio = audioMap[note];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Audio playback error:", err));
      setActiveNotes(prev => [...prev, note]);
    }
  }, [audioMap, activeNotes]);

  const stopNote = useCallback((note: string) => {
    if (!note) return;
    setActiveNotes(prev => prev.filter(n => n !== note));
  }, []);

  const handleMouseDown = useCallback((note: string) => {
    isMouseDownRef.current = true;
    playNote(note);
  }, [playNote]);

  const handleMouseUp = useCallback((note: string) => {
    isMouseDownRef.current = false;
    stopNote(note);
  }, [stopNote]);

  const handleMouseOver = useCallback((note: string) => {
    if (isMouseDownRef.current) {
      playNote(note);
    }
  }, [isMouseDownRef, playNote]);

  const handleMouseOut = useCallback((note: string) => {
    stopNote(note);
  }, [stopNote]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = keyToNoteMap.current[e.key.toLowerCase()];
      if (note) {
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyToNoteMap.current[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  // Handle mouse up outside the piano
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={`piano ${showLetters ? 'letters' : ''}`} onMouseLeave={() => setActiveNotes([])}>
      {whiteKeys.map((key, index) => (
        <PianoKey
          key={`white-${index}`}
          note={key}
          isActive={activeNotes.includes(key.note)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseOver={handleMouseOver}
          showLetters={showLetters}
        />
      ))}
      <div className="keys-sharp">
        {blackKeys.map((key, index) => (
          <PianoKey
            key={`black-${index}`}
            note={key}
            isActive={activeNotes.includes(key.note)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOver={handleMouseOver}
            showLetters={showLetters}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Piano);

// src/components/FullscreenButton.tsx
import React from 'react';
import { useFullscreen } from '../hooks/useFullscreen';

const FullscreenButton: React.FC = () => {
  const [isFullscreen, toggleFullscreen] = useFullscreen();
  
  return (
    <button 
      className={`fullscreen ${isFullscreen ? 'closefullscreen' : 'openfullscreen'}`}
      onClick={toggleFullscreen}
    />
  );
};

export default React.memo(FullscreenButton);

// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        {currentYear}
      </div>
    </footer>
  );
};

export default React.memo(Footer);
```

### 4. Main App Component

```tsx
// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import ButtonContainer from './components/ButtonContainer';
import Piano from './components/Piano';
import FullscreenButton from './components/FullscreenButton';
import Footer from './components/Footer';
import './styles.css';

const App: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);

  return (
    <>
      <Header />
      <main className="main">
        <ButtonContainer 
          showLetters={showLetters} 
          setShowLetters={setShowLetters} 
        />
        <Piano showLetters={showLetters} />
        <FullscreenButton />
      </main>
      <Footer />
    </>
  );
};

export default App;
```

### 5. CSS Styles

```css
/* src/styles.css */
/* Copy the original CSS here */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  user-select: none;
}

a:focus {
  outline: 0;
}

html {
  background: #313940;
}

body {
  min-height: 100vh;
  background-color: #313940;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  background: #313940;
  overflow-x: hidden;
}

.header {
  text-align: center;
  width: 100%;
  border-bottom: 1px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, #38495a, #a2abb3, #38495a);
}

.header-title {
  line-height: 60px;
  font-weight: 300;
  color: #fff;
}

.main {
  min-height: calc(100vh - 110px);
  padding: 60px 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  width: 306px;
  height: 40px;
  margin: 0 auto;
  margin-bottom: 80px;
}

.btn {
  width: 150px;
  height: 40px;
  padding: 0 10px;
  background-color: #454c53;
  border: 0;
  border-radius: 2px;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: #fff;
  outline: 0;
  cursor: pointer;
  transition: 0.3s;
}

.btn:not(.btn-active):hover {
  background-color: #515961;
}

.btn-active {
  background-color: #00b4a4;
}

.btn-active:hover {
  background-color: #00c2b1;
}

.piano {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 270px;
  max-width: 560px;
  margin: 0 auto 60px;
}

.piano-key {
  position: relative;
  width: 80px;
  height: 270px;
  background-color: rgba(255, 255, 255, 0.85);
  border: 4px solid #313940;
  border-radius: 0px 0px 12px 12px;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 8px;
  font-weight: 600;
}

.piano-key:hover {
  background-color: #fff;
}

.keys-sharp {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.piano-key.sharp {
  width: 54px;
  height: 170px;
  background-color: #313940;
  border: 0;
  border-radius: 0px 0px 9px 9px;
  top: 0;
  z-index: 3;
  pointer-events: auto;
  transform-origin: center top;
}

.piano-key.sharp:hover {
  background-color: #000;
}

.piano-key.sharp:active {
  background-color: #000;
  transform: scale(0.95);
}

.piano-key.none {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  pointer-events: none;
}

.piano-key::before,
.piano-key::after {
  content: attr(data-note);
  position: absolute;
  width: 40px;
  height: 40px;
  font-size: 26px;
  line-height: 40px;
  text-align: center;
  color: #a2abb3;
  bottom: 0px;
  left: 20px;
  transition: 0.3s;
}

.piano-key::after {
  display: none;
  content: attr(data-letter);
}

.piano.letters .piano-key::before {
  display: none;
}

.piano.letters .piano-key::after {
  display: block;
}

.sharp:active {
  transform: scale(0.95);
}

.piano-key.sharp::before,
.piano-key.sharp::after {
  bottom: 25px;
  left: 7px;
}

.piano-key.sharp::after {
  display: none;
}

.piano.letters .piano-key.sharp::before {
  display: none;
}

.piano.letters .piano-key.sharp::after {
  display: block;
}

.piano-key.active {
  transform: scale(0.98);
}

.piano-key.piano-key-active {
  background-color: #00b4a4;
}

.piano-key.sharp.piano-key-active {
  background-color: #00b4a4;
}

.piano-key-letter {
  font-size: 26px;
  color: #a2abb3;
}

.piano-key-note {
  font-size: 26px;
  color: #a2abb3;
}

.piano-key.sharp .piano-key-letter,
.piano-key.sharp .piano-key-note {
  color: #fff;
}

.fullscreen {
  position: fixed;
  top: 120px;
  right: 40px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 0;
  outline: 0;
  background-size: contain;
  transition: 0.3s;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 5.5H10.5V4H4C3.44772 4 3 4.44772 3 5V11.5H4.5V5.5ZM19.5 5.5H13.5V4H20C20.5523 4 21 4.44772 21 5V11.5H19.5V5.5ZM19.5 18.5H13.5V20H20C20.5523 20 21 19.5523 21 19V12.5H19.5V18.5ZM4.5 18.5H10.5V20H4C3.44772 20 3 19.5523 3 19V12.5H4.5V18.5Z' fill='white' fill-rule='evenodd'/></svg>");
}

.fullscreen:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

:-webkit-full-screen .fullscreen {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 14.5v4h4v1.5h-5c-.27614 0-.5-.2239-.5-.5v-5h1.5zm15 0v4h-4v1.5h5c.2761 0 .5-.2239.5-.5v-5h-1.5zm-15-5v-4h4v-1.5h-5c-.27614 0-.5.22386-.5.5v5h1.5zm15 0v-4h-4v-1.5h5c.2761 0 .5.22386.5.5v5h-1.5z' fill='white' fill-rule='evenodd'/></svg>");
}

:-moz-full-screen .fullscreen {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 14.5v4h4v1.5h-5c-.27614 0-.5-.2239-.5-.5v-5h1.5zm15 0v4h-4v1.5h5c.2761 0 .5-.2239.5-.5v-5h-1.5zm-15-5v-4h4v-1.5h-5c-.27614 0-.5.22386-.5.5v5h1.5zm15 0v-4h-4v-1.5h5c.2761 0 .5.22386.5.5v5h-1.5z' fill='white' fill-rule='evenodd'/></svg>");
}

:fullscreen .fullscreen {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 14.5v4h4v1.5h-5c-.27614 0-.5-.2239-.5-.5v-5h1.5zm15 0v4h-4v1.5h5c.2761 0 .5-.2239.5-.5v-5h-1.5zm-15-5v-4h4v-1.5h-5c-.27614 0-.5.22386-.5.5v5h1.5zm15 0v-4h-4v-1.5h5c.2761 0 .5.22386.5.5v5h-1.5z' fill='white' fill-rule='evenodd'/></svg>");
}

.openfullscreen {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 5.5H10.5V4H4C3.44772 4 3 4.44772 3 5V11.5H4.5V5.5ZM19.5 5.5H13.5V4H20C20.5523 4 21 4.44772 21 5V11.5H19.5V5.5ZM19.5 18.5H13.5V20H20C20.5523 20 21 19.5523 21 19V12.5H19.5V18.5ZM4.5 18.5H10.5V20H4C3.44772 20 3 19.5523 3 19V12.5H4.5V18.5Z' fill='white' fill-rule='evenodd'/></svg>");
}

.closefullscreen {
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='M4.5 14.5v4h4v1.5h-5c-.27614 0-.5-.2239-.5-.5v-5h1.5zm15 0v4h-4v1.5h5c.2761 0 .5-.2239.5-.5v-5h-1.5zm-15-5v-4h4v-1.5h-5c-.27614 0-.5.22386-.5.5v5h1.5zm15 0v-4h-4v-1.5h5c.2761 0 .5.22386.5.5v5h-1.5z' fill='white' fill-rule='evenodd'/></svg>");
}

.footer {
  border-top: 1px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, #38495a, #a2abb3, #38495a);
}

.footer-container {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  height: 50px;
  color: #a2abb3;
}

.github {
  display: block;
  width: 120px;
  height: 45px;
  padding-left: 45px;
  background-image: url("data:image/svg+xml;utf8,<svg enable-background='new 0 0 24 24' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path clip-rule='evenodd' d='m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z' fill='%23a2abb3' fill-rule='evenodd'/></svg>");
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: left center;
  line-height: 45px;
  color: #a2abb3;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.3s;
}

.github:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .main {
    padding-top: 40px;
  }

  .piano {
    width: 310px;
    height: 160px;
  }

  .piano-key {
    width: 44px;
    height: 160px;
    border-radius: 0px 0px 8px 8px;
    border: 2px solid #313940;
  }

  .keys-sharp {
    left: 26px;
    right: 26px;
  }

  .piano-key.sharp {
    width: 36px;
    height: 100px;
    border-radius: 0px 0px 6px 6px;
  }

  .piano-key::before,
  .piano-key::after {
    width: 30px;
    height: 30px;
    font-size: 22px;
    bottom: 5px;
    left: 7px;
    line-height: 30px;
  }

  .piano-key.sharp::before,
  .piano-key.sharp::after {
    bottom: 15px;
    left: 3px;
  }

  .btn-container {
    width: 244px;
    height: 40px;
    margin-bottom: 40px;
  }

  .btn {
    width: 120px;
    height: 40px;
  }
}

@media (max-width: 600px) {
  .piano {
    width: 310px;
    height: 160px;
  }
}

@media (max-width: 500px) {
  .piano {
    margin-bottom: 40px;
  }

  .footer-container {
    height: 120px;
    flex-direction: column;
  }
}

@media (max-height: 500px) {
  .piano {
    margin-bottom: 0;
  }
}
```

### 6. Entry Point

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7. Public

### Tokens: {'input_tokens': 1969, 'output_tokens': 8192}
### Execution time: 96.46401119232178
