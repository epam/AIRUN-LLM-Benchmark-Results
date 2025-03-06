I have the following HTML and JS app code:

index.html
```html
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

script.js
```js
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


Your task is to translate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use the following libraries: Create React App, TypeScript.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
### Project Structure:
```
src/
├── assets/
│   ├── audio/
│   │   ├── a.mp3
│   │   ├── b.mp3
│   │   ├── c♯.mp3
│   │   ├── d.mp3
│   │   ├── d♯.mp3
│   │   ├── e.mp3
│   │   ├── f.mp3
│   │   ├── f♯.mp3
│   │   ├── g.mp3
│   │   ├── g♯.mp3
│   │   └── a♯.mp3
│   └── piano.ico
├── components/
│   ├── Piano.tsx
│   └── PianoKey.tsx
├── App.tsx
├── index.tsx
├── index.css
└── react-app-env.d.ts
```

---

### src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### src/App.tsx
```tsx
import React from 'react';
import Piano from './components/Piano';

const App: React.FC = () => (
  <div className="app">
    <header className="header">
      <h1 className="header-title">Virtual Piano</h1>
    </header>
    <main className="main">
      <Piano />
    </main>
    <footer className="footer">
      <div className="footer-container">2020</div>
    </footer>
  </div>
);

export default App;
```

---

### src/components/Piano.tsx
```tsx
import React, { useCallback, useEffect, useState } from 'react';
import PianoKey from './PianoKey';

const notes = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharps = [
  { letter: 'R', note: 'c♯' },
  { letter: 'T', note: 'd♯' },
  { letter: '', note: '' },
  { letter: 'U', note: 'f♯' },
  { letter: 'I', note: 'g♯' },
  { letter: 'O', note: 'a♯' },
];

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

const Piano: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [showLetters, setShowLetters] = useState(false);

  const playNote = useCallback((note: string) => {
    if (!note || activeNotes.includes(note)) return;
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setActiveNotes((prev) => [...prev, note]);
  }, [activeNotes]);

  const stopNote = useCallback((note: string) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    const note = [...notes, ...sharps].find((n) => n.letter === key)?.note;
    if (note) playNote(note);
  }, [playNote]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    const note = [...notes, ...sharps].find((n) => n.letter === key)?.note;
    if (note) stopNote(note);
  }, [stopNote]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div className="btn-container">
        <button
          className={`btn ${!showLetters ? 'btn-active' : ''}`}
          onClick={() => setShowLetters(false)}
        >
          Notes
        </button>
        <button
          className={`btn ${showLetters ? 'btn-active' : ''}`}
          onClick={() => setShowLetters(true)}
        >
          Letters
        </button>
      </div>
      <div className={`piano ${showLetters ? 'letters' : ''}`}>
        {notes.map(({ letter, note }) => (
          <PianoKey
            key={note}
            letter={letter}
            note={note}
            active={activeNotes.includes(note)}
            playNote={playNote}
            stopNote={stopNote}
          />
        ))}
        <div className="keys-sharp">
          {sharps.map(({ letter, note }, idx) => (
            <PianoKey
              key={idx}
              letter={letter}
              note={note}
              active={activeNotes.includes(note)}
              playNote={playNote}
              stopNote={stopNote}
              sharp
            />
          ))}
        </div>
      </div>
      <button className="fullscreen openfullscreen" onClick={toggleFullscreen}></button>
    </>
  );
};

export default Piano;
```

---

### src/components/PianoKey.tsx
```tsx
import React from 'react';

interface PianoKeyProps {
  letter: string;
  note: string;
  active: boolean;
  sharp?: boolean;
  playNote: (note: string) => void;
  stopNote: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ letter, note, active, sharp, playNote, stopNote }) => {
  const handleMouseDown = () => playNote(note);
  const handleMouseUp = () => stopNote(note);
  const handleMouseLeave = () => stopNote(note);

  return (
    <div
      className={`piano-key ${sharp ? 'sharp' : ''} ${active ? 'piano-key-active' : ''}`}
      data-letter={letter}
      data-note={note}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => e.buttons === 1 && playNote(note)}
    />
  );
};

export default PianoKey;
```

---

### public/index.html (head section)
```html
<link href="%PUBLIC_URL%/assets/piano.ico" rel="shortcut icon">
<link href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap" rel="stylesheet">
```

---

### src/react-app-env.d.ts
```ts
/// <reference types="react-scripts" />
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 1844, 'reasoning_tokens': 0}
### Execution time: 44.228078842163086
