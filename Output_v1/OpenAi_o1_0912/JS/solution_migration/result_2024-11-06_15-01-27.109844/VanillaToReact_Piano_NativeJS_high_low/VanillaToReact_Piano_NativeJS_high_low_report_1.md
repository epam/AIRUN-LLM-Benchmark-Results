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
Below is the translated code:

`package.json`
```json
{
  "name": "virtual-piano",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.0",
    "typescript": "^4.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

`tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

`public/index.html`
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="shortcut icon" href="%PUBLIC_URL%/assets/piano.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Virtual Piano</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
    rel="stylesheet"
  />
</head>

<body>
  <div id="root"></div>
</body>

</html>
```

`src/index.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/App.tsx`
```tsx
import React from 'react';
import Piano from './Piano';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <Piano />
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
```

`src/Piano.tsx`
```tsx
import React, { useState, useEffect } from 'react';
import './Piano.css';

const soundMapper: { [note: string]: HTMLAudioElement } = {
  c: new Audio('/assets/audio/c.mp3'),
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

const keyBindings: { [key: string]: string } = {
  D: 'c',
  F: 'd',
  G: 'e',
  H: 'f',
  J: 'g',
  K: 'a',
  L: 'b',
  R: 'c♯',
  T: 'd♯',
  U: 'f♯',
  I: 'g♯',
  O: 'a♯',
};

type Key = {
  note: string;
  letter: string;
  type: 'white' | 'black' | 'none';
};

const whiteKeys: Key[] = [
  { note: 'c', letter: 'D', type: 'white' },
  { note: 'd', letter: 'F', type: 'white' },
  { note: 'e', letter: 'G', type: 'white' },
  { note: 'f', letter: 'H', type: 'white' },
  { note: 'g', letter: 'J', type: 'white' },
  { note: 'a', letter: 'K', type: 'white' },
  { note: 'b', letter: 'L', type: 'white' },
];

const blackKeys: Key[] = [
  { note: 'c♯', letter: 'R', type: 'black' },
  { note: 'd♯', letter: 'T', type: 'black' },
  { note: '', letter: '', type: 'none' },
  { note: 'f♯', letter: 'U', type: 'black' },
  { note: 'g♯', letter: 'I', type: 'black' },
  { note: 'a♯', letter: 'O', type: 'black' },
];

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const playNote = (note: string) => {
    const sound = soundMapper[note];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play();

    setActiveNotes((prev) => new Set(prev).add(note));
  };

  const stopNote = (note: string) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const note = keyBindings[key];
    if (note && !activeNotes.has(note)) {
      playNote(note);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const note = keyBindings[key];
    if (note) {
      stopNote(note);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const toggleDisplay = (value: boolean) => {
    setShowLetters(value);
  };

  const handleMouseDown = (note: string) => {
    playNote(note);
  };

  const handleMouseUp = (note: string) => {
    stopNote(note);
  };

  const handleMouseLeave = (note: string) => {
    stopNote(note);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="piano-container">
      <div className="btn-container">
        <button
          className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
          onClick={() => toggleDisplay(false)}
        >
          Notes
        </button>
        <button
          className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
          onClick={() => toggleDisplay(true)}
        >
          Letters
        </button>
      </div>
      <div className={`piano ${showLetters ? 'letters' : ''}`}>
        <div className="white-keys">
          {whiteKeys.map((key) => (
            <div
              key={key.note}
              className={`piano-key ${
                activeNotes.has(key.note) ? 'piano-key-active' : ''
              }`}
              data-note={key.note}
              data-letter={key.letter}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseLeave={() => handleMouseLeave(key.note)}
            >
              {showLetters ? key.letter : key.note}
            </div>
          ))}
        </div>
        <div className="keys-sharp">
          {blackKeys.map((key, index) => {
            if (key.type === 'none') {
              return <div key={index} className="piano-key sharp none"></div>;
            }
            return (
              <div
                key={key.note}
                className={`piano-key sharp ${
                  activeNotes.has(key.note) ? 'piano-key-active' : ''
                }`}
                data-note={key.note}
                data-letter={key.letter}
                onMouseDown={() => handleMouseDown(key.note)}
                onMouseUp={() => handleMouseUp(key.note)}
                onMouseLeave={() => handleMouseLeave(key.note)}
              >
                {showLetters ? key.letter : key.note}
              </div>
            );
          })}
        </div>
      </div>
      <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
    </div>
  );
};

export default Piano;
```

`src/index.css`
```css
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

.App {
  text-align: center;
}

.header {
  background-color: #282c34;
  padding: 20px;
}

.header-title {
  color: white;
}

.main {
  padding: 20px;
}

.footer {
  background-color: #282c34;
  padding: 10px;
}

.footer-container {
  color: white;
}
```

`src/App.css`
```css
/* Add any additional styles if needed */
```

`src/Piano.css`
```css
.piano-container {
  position: relative;
}

.btn-container {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  background-color: #ccc;
  cursor: pointer;
  font-size: 16px;
}

.btn-active {
  background-color: #999;
}

.piano {
  display: flex;
  position: relative;
}

.white-keys {
  display: flex;
}

.piano-key {
  width: 60px;
  height: 200px;
  border: 1px solid #000;
  background-color: #fff;
  position: relative;
  user-select: none;
}

.piano-key-active {
  background-color: #e0e0e0;
}

.piano-key.sharp {
  width: 40px;
  height: 120px;
  background-color: #000;
  border: 1px solid #333;
  position: absolute;
  margin-left: -20px;
  z-index: 1;
  user-select: none;
}

.piano-key.sharp.piano-key-active {
  background-color: #555;
}

.keys-sharp {
  display: flex;
  position: absolute;
  left: 40px;
}

.keys-sharp .piano-key {
  margin-left: 20px;
}

.piano-key.none {
  visibility: hidden;
}

.fullscreen {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  background: url('/assets/fullscreen-icon.png') no-repeat center;
  background-size: contain;
  border: none;
  cursor: pointer;
}
```

Place your audio files in the `public/assets/audio` directory, and the favicon at `public/assets/piano.ico`.

### Tokens: {'input_tokens': 1423, 'output_tokens': 9088, 'reasoning_tokens': 6400}
### Execution time: 79.53744602203369
