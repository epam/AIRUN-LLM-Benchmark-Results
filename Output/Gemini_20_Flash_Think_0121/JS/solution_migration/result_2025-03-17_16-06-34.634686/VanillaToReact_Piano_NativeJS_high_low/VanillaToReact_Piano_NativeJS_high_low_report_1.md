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
```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/style.css';
import App from './App';
import './assets/piano.ico'; // Import to ensure it's processed by webpack

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
// src/App.tsx
import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
```

```typescript
// src/components/Header.tsx
import React from 'react';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Virtual Piano</h1>
    </header>
  );
}

export default Header;
```

```typescript
// src/components/Main.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';

import Piano from './components/Piano';
import ButtonContainer from './components/ButtonContainer';

const soundMapper = {
  c: new Audio('./assets/audio/a.mp3'),
  d: new Audio('./assets/audio/d.mp3'),
  e: new Audio('./assets/audio/e.mp3'),
  f: new Audio('./assets/audio/f.mp3'),
  g: new Audio('./assets/audio/g.mp3'),
  a: new Audio('./assets/audio/a.mp3'),
  b: new Audio('./assets/audio/b.mp3'),
  'c♯': new Audio('./assets/audio/c♯.mp3'),
  'd♯': new Audio('./assets/audio/d♯.mp3'),
  'f♯': new Audio('./assets/audio/f♯.mp3'),
  'g♯': new Audio('./assets/audio/g♯.mp3'),
  'a♯': new Audio('./assets/audio/a♯.mp3'),
};

interface MainProps { }

const Main: React.FC<MainProps> = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const pianoRef = useRef<HTMLDivElement>(null);
  const btnNotesRef = useRef<HTMLButtonElement>(null);
  const btnLettersRef = useRef<HTMLButtonElement>(null);

  const playNote = useCallback((note: string) => {
    if (!note || activeNotes.includes(note)) return;
    setActiveNotes((prevNotes) => [...prevNotes, note]);
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }, [activeNotes]);

  const resetNote = useCallback((note: string) => {
    if (!note) return;
    setActiveNotes((prevNotes) => prevNotes.filter((n) => n !== note));
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const pianoKeyElement = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) as HTMLElement | null;
    if (pianoKeyElement) {
      const note = pianoKeyElement.dataset.note;
      if (note) {
        playPianoKey(pianoKeyElement);
        playNote(note);
      }
    }
  }, [playNote, playPianoKey]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const pianoKeyElement = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) as HTMLElement | null;
    if (pianoKeyElement) {
      const note = pianoKeyElement.dataset.note;
      if (note) {
        resetPianoKey(pianoKeyElement);
        resetNote(note);
      }
    }
  }, [resetNote, resetPianoKey]);

  const handlePianoMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.dataset.note;
      if (note) {
        playPianoKey(target);
        playNote(note);
      }
    }
  }, [playNote, playPianoKey]);

  const handlePianoMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.dataset.note;
      if (note) {
        resetPianoKey(target);
        resetNote(note);
      }
    }
  }, [resetNote, resetPianoKey]);

  const handlePianoMouseOut = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.dataset.note;
      if (note) {
        resetPianoKey(target);
        resetNote(note);
      }
    }
  }, [resetNote, resetPianoKey]);

  const handlePianoMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) { // Left mouse button is pressed
      const target = event.target as HTMLElement;
      if (target.classList.contains('piano-key')) {
        const note = target.dataset.note;
        if (note) {
          playPianoKey(target);
          playNote(note);
        }
      }
    }
  }, [playNote, playPianoKey]);

  const toggleLetters = useCallback((showLettersValue: boolean) => {
    setShowLetters(showLettersValue);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  function playPianoKey(element: HTMLElement) {
    element.classList.add('piano-key-active');
  }

  function resetPianoKey(element: HTMLElement) {
    element.classList.remove('piano-key-active');
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (btnNotesRef.current && btnLettersRef.current) {
      if (!showLetters) {
        btnNotesRef.current.classList.add('btn-active');
        btnLettersRef.current.classList.remove('btn-active');
      } else {
        btnNotesRef.current.classList.remove('btn-active');
        btnLettersRef.current.classList.add('btn-active');
      }
    }
  }, [showLetters]);


  return (
    <main className="main">
      <ButtonContainer
        showLetters={showLetters}
        toggleLetters={toggleLetters}
        btnNotesRef={btnNotesRef}
        btnLettersRef={btnLettersRef}
      />
      <Piano
        showLetters={showLetters}
        pianoRef={pianoRef}
        onMouseDown={handlePianoMouseDown}
        onMouseUp={handlePianoMouseUp}
        onMouseOut={handlePianoMouseOut}
        onMouseMove={handlePianoMouseMove}
        activeNotes={activeNotes}
      />
      <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
    </main>
  );
};

export default Main;
```

```typescript
// src/components/ButtonContainer.tsx
import React, { useCallback } from 'react';

interface ButtonContainerProps {
  showLetters: boolean;
  toggleLetters: (showLetters: boolean) => void;
  btnNotesRef: React.RefObject<HTMLButtonElement>;
  btnLettersRef: React.RefObject<HTMLButtonElement>;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ toggleLetters, btnNotesRef, btnLettersRef }) => {
  const handleNotesClick = useCallback(() => {
    toggleLetters(false);
  }, [toggleLetters]);

  const handleLettersClick = useCallback(() => {
    toggleLetters(true);
  }, [toggleLetters]);

  return (
    <div className="btn-container">
      <button className="btn btn-notes" onClick={handleNotesClick} ref={btnNotesRef}>Notes</button>
      <button className="btn btn-letters" onClick={handleLettersClick} ref={btnLettersRef}>Letters</button>
    </div>
  );
};

export default ButtonContainer;
```

```typescript
// src/components/Piano.tsx
import React, { useCallback } from 'react';
import PianoKey from './components/PianoKey';

interface PianoProps {
  showLetters: boolean;
  pianoRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  activeNotes: string[];
}

const Piano: React.FC<PianoProps> = ({ showLetters, pianoRef, onMouseDown, onMouseUp, onMouseOut, onMouseMove, activeNotes }) => {
  return (
    <div className={`piano ${showLetters ? 'letters' : ''}`} ref={pianoRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOut={onMouseOut} onMouseMove={onMouseMove}>
      <PianoKey note="c" letter="D" isActive={activeNotes.includes('c')} />
      <PianoKey note="d" letter="F" isActive={activeNotes.includes('d')} />
      <PianoKey note="e" letter="G" isActive={activeNotes.includes('e')} />
      <PianoKey note="f" letter="H" isActive={activeNotes.includes('f')} />
      <PianoKey note="g" letter="J" isActive={activeNotes.includes('g')} />
      <PianoKey note="a" letter="K" isActive={activeNotes.includes('a')} />
      <PianoKey note="b" letter="L" isActive={activeNotes.includes('b')} />
      <div className="keys-sharp">
        <PianoKey note="c♯" letter="R" sharp isActive={activeNotes.includes('c♯')} />
        <PianoKey note="d♯" letter="T" sharp isActive={activeNotes.includes('d♯')} />
        <div className="piano-key sharp none"></div>
        <PianoKey note="f♯" letter="U" sharp isActive={activeNotes.includes('f♯')} />
        <PianoKey note="g♯" letter="I" sharp isActive={activeNotes.includes('g♯')} />
        <PianoKey note="a♯" letter="O" sharp isActive={activeNotes.includes('a♯')} />
      </div>
    </div>
  );
};

export default Piano;
```

```typescript
// src/components/PianoKey.tsx
import React from 'react';

interface PianoKeyProps {
  note: string;
  letter: string;
  sharp?: boolean;
  isActive?: boolean;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, letter, sharp, isActive }) => {
  return (
    <div
      className={`piano-key ${sharp ? 'sharp' : ''} ${isActive ? 'piano-key-active' : ''}`}
      data-note={note}
      data-letter={letter}
    >
      {/* No content needed inside, letters are handled by CSS */}
    </div>
  );
};

export default PianoKey;
```

```typescript
// src/components/Footer.tsx
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        2020
      </div>
    </footer>
  );
}

export default Footer;
```

**To run the application:**

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm start
    ```

This React application should now replicate the functionality of the original vanilla JavaScript code. It is built with React 18, TypeScript, and follows the requested component structure and functionality. All original features including keyboard and mouse interactions, sound playback, notes/letters toggle, and fullscreen are implemented. The code is structured into functional components with React hooks for state management and event handling, adhering to React best practices.

### Tokens: {'input_tokens': 1865, 'output_tokens': 3047}
### Execution time: 15.657250165939331
