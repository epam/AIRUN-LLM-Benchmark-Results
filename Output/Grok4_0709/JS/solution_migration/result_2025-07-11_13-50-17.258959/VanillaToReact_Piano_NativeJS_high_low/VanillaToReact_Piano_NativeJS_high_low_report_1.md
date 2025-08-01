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
```tsx
// src/App.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import './css/style.css'; // Assuming style.css is placed in src/css

interface KeyConfig {
  note: string;
  letter: string;
  isSharp?: boolean;
  isNone?: boolean;
}

const whiteKeys: KeyConfig[] = [
  { note: 'c', letter: 'D' },
  { note: 'd', letter: 'F' },
  { note: 'e', letter: 'G' },
  { note: 'f', letter: 'H' },
  { note: 'g', letter: 'J' },
  { note: 'a', letter: 'K' },
  { note: 'b', letter: 'L' },
];

const blackKeys: KeyConfig[] = [
  { note: 'c♯', letter: 'R' },
  { note: 'd♯', letter: 'T' },
  { note: '', letter: '', isNone: true },
  { note: 'f♯', letter: 'U' },
  { note: 'g♯', letter: 'I' },
  { note: 'a♯', letter: 'O' },
];

const letterToNote: Record<string, string> = {};
[...whiteKeys, ...blackKeys].forEach((k) => {
  if (k.note && k.letter) {
    letterToNote[k.letter] = k.note;
  }
});

const soundMapper: Record<string, HTMLAudioElement> = {
  c: new Audio('/assets/audio/a.mp3'),
  d: new Audio('/assets/audio/d.mp3'),
  e: new Audio('/assets/audio/e.mp3'),
  f: new Audio('/assets/audio/f.mp3'),
  g: new Audio('/assets/audio/g.mp3'),
  a: new Audio('/assets/audio/a.mp3'),
  b: new Audio('/assets/audio/b.mp3'),
  'c♯': new Audio('/assets/audio/c♯.mp3'),
  'd♯': new Audio('/assets/audio/d♯.mp3'),
  'f♯': new Audio('/assets/audio/f♯.mp3'),
  'g♯': new Audio('/assets/audio/g♯.mp3'),
  'a♯': new Audio('/assets/audio/a♯.mp3'),
};

function App() {
  const [isLetters, setIsLetters] = useState<boolean>(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const activeNotesRef = useRef<Set<string>>(activeNotes);
  const pianoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeNotesRef.current = activeNotes;
  }, [activeNotes]);

  const playSound = useCallback((note: string) => {
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }, []);

  const activateNote = useCallback((note: string) => {
    setActiveNotes((prev) => new Set([...prev, note]));
  }, []);

  const deactivateNote = useCallback((note: string) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const letter = e.key.toUpperCase();
    const note = letterToNote[letter];
    if (!note || activeNotesRef.current.has(note)) return;
    playSound(note);
    activateNote(note);
  }, [playSound, activateNote]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const letter = e.key.toUpperCase();
    const note = letterToNote[letter];
    if (!note) return;
    deactivateNote(note);
  }, [deactivateNote]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getNoteFromEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('.piano-key')) {
      return target.dataset.note || '';
    }
    return '';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const note = getNoteFromEvent(e);
    if (!note || activeNotesRef.current.has(note)) return;
    playSound(note);
    activateNote(note);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const note = getNoteFromEvent(e);
    if (note) deactivateNote(note);
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('.piano-key')) {
      const note = target.dataset.note || '';
      if (note) deactivateNote(note);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
    const note = getNoteFromEvent(e);
    if (!note || activeNotesRef.current.has(note)) return;
    playSound(note);
    activateNote(note);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button
            className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`}
            onClick={() => setIsLetters(false)}
          >
            Notes
          </button>
          <button
            className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`}
            onClick={() => setIsLetters(true)}
          >
            Letters
          </button>
        </div>
        <div
          className={`piano ${isLetters ? 'letters' : ''}`}
          ref={pianoRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          onMouseMove={handleMouseMove}
        >
          {whiteKeys.map((k, i) => (
            <div
              key={i}
              className={`piano-key ${activeNotes.has(k.note) ? 'piano-key-active' : ''}`}
              data-letter={k.letter}
              data-note={k.note}
            />
          ))}
          <div className="keys-sharp">
            {blackKeys.map((k, i) => (
              <div
                key={i}
                className={`piano-key sharp ${k.isNone ? 'none' : ''} ${
                  activeNotes.has(k.note) ? 'piano-key-active' : ''
                }`}
                data-letter={k.letter}
                data-note={k.note}
              />
            ))}
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </>
  );
}

export default App;
```

```tsx
// src/index.tsx (default from CRA with TypeScript, adjusted if needed)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

```html
<!-- public/index.html (adjusted from CRA template) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/assets/piano.ico" rel="shortcut icon" />

    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
      rel="stylesheet"
    />

    <title>virtual-piano</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

**Notes on Migration:**
- The application is migrated to React 18 using functional components and hooks.
- Strict TypeScript typing is used throughout.
- All original functionality (audio playback, event handling, toggle, fullscreen) is preserved.
- Audio objects are created once outside components for efficiency.
- State management uses `useState` for toggle and active notes.
- Event handlers use React synthetic events and mirror original behavior.
- Keyboard events are handled at document level via `useEffect`.
- Mouse events are delegated at the piano level.
- Used `useRef` for active notes to avoid stale closures in event handlers without excessive re-creation.
- No optimizations like `React.memo` were necessary due to the small scale, but code is efficient.
- Assume audio files are in `public/assets/audio/` and CSS in `src/css/`. Adjust paths if needed.

### Tokens: {'input_tokens': 1639, 'output_tokens': 2101, 'reasoning_tokens': 7144}
### Execution time: 318.9216802120209
