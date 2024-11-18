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
```markdown
### `public/index.html`
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="%PUBLIC_URL%/assets/piano.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
    rel="stylesheet"
  />
  <title>Virtual Piano</title>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>

</html>
```

### `src/index.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
```

### `src/App.tsx`
```tsx
import React, { useEffect, useState } from 'react';
import './App.css';

const soundMapper: { [key: string]: HTMLAudioElement } = {
  c: new Audio(`${process.env.PUBLIC_URL}/assets/audio/a.mp3`),
  d: new Audio(`${process.env.PUBLIC_URL}/assets/audio/d.mp3`),
  e: new Audio(`${process.env.PUBLIC_URL}/assets/audio/e.mp3`),
  f: new Audio(`${process.env.PUBLIC_URL}/assets/audio/f.mp3`),
  g: new Audio(`${process.env.PUBLIC_URL}/assets/audio/g.mp3`),
  a: new Audio(`${process.env.PUBLIC_URL}/assets/audio/a.mp3`),
  b: new Audio(`${process.env.PUBLIC_URL}/assets/audio/b.mp3`),
  'c♯': new Audio(`${process.env.PUBLIC_URL}/assets/audio/c♯.mp3`),
  'd♯': new Audio(`${process.env.PUBLIC_URL}/assets/audio/d♯.mp3`),
  'f♯': new Audio(`${process.env.PUBLIC_URL}/assets/audio/f♯.mp3`),
  'g♯': new Audio(`${process.env.PUBLIC_URL}/assets/audio/g♯.mp3`),
  'a♯': new Audio(`${process.env.PUBLIC_URL}/assets/audio/a♯.mp3`),
};

const pianoKeys = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharpKeys = [
  { letter: 'R', note: 'c♯' },
  { letter: 'T', note: 'd♯' },
  null,
  { letter: 'U', note: 'f♯' },
  { letter: 'I', note: 'g♯' },
  { letter: 'O', note: 'a♯' },
];

const App: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<'notes' | 'letters'>('notes');

  const playNote = (note: string) => {
    if (!note || activeNotes.includes(note)) return;
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
      setActiveNotes(prev => [...prev, note]);
    }
  };

  const resetNote = (note: string) => {
    setActiveNotes(prev => prev.filter(n => n !== note));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const keyObj = [...pianoKeys, ...sharpKeys].find(k => k && k.letter === key);
    if (keyObj) {
      playNote(keyObj.note);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const keyObj = [...pianoKeys, ...sharpKeys].find(k => k && k.letter === key);
    if (keyObj) {
      resetNote(keyObj.note);
    }
  };

  const handleMouseDown = (note: string) => {
    playNote(note);
  };

  const handleMouseUp = (note: string) => {
    resetNote(note);
  };

  const handleMouseOut = (note: string) => {
    resetNote(note);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, note: string) => {
    if (event.buttons === 1) {
      playNote(note);
    }
  };

  const toggleMode = (mode: 'notes' | 'letters') => {
    setActiveMode(mode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button
            className={`btn ${activeMode === 'notes' ? 'btn-active' : ''}`}
            onClick={() => toggleMode('notes')}
          >
            Notes
          </button>
          <button
            className={`btn ${activeMode === 'letters' ? 'btn-active' : ''}`}
            onClick={() => toggleMode('letters')}
          >
            Letters
          </button>
        </div>
        <div className="piano">
          {pianoKeys.map(({ letter, note }) => (
            <div
              key={note}
              className={`piano-key ${activeNotes.includes(note) ? 'piano-key-active' : ''}`}
              data-letter={letter}
              data-note={note}
              onMouseDown={() => handleMouseDown(note)}
              onMouseUp={() => handleMouseUp(note)}
              onMouseOut={() => handleMouseOut(note)}
              onMouseMove={(e) => handleMouseMove(e, note)}
            ></div>
          ))}
          <div className="keys-sharp">
            {sharpKeys.map((key, index) =>
              key ? (
                <div
                  key={key.note}
                  className={`piano-key sharp ${activeNotes.includes(key.note) ? 'piano-key-active' : ''}`}
                  data-letter={key.letter}
                  data-note={key.note}
                  onMouseDown={() => handleMouseDown(key.note)}
                  onMouseUp={() => handleMouseUp(key.note)}
                  onMouseOut={() => handleMouseOut(key.note)}
                  onMouseMove={(e) => handleMouseMove(e, key.note)}
                ></div>
              ) : (
                <div key={`sharp-none-${index}`} className="piano-key sharp none"></div>
              )
            )}
          </div>
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
};

export default App;
```

### `src/index.css`
```css
/* Add your global styles here */
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}
```

### `src/App.css`
```css
.header {
  background-color: #282c34;
  padding: 20px;
  text-align: center;
  color: white;
}

.header-title {
  margin: 0;
  font-size: 2rem;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.btn-container {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
}

.btn-active {
  background-color: #61dafb;
  border: none;
}

.piano {
  position: relative;
  display: flex;
}

.piano-key {
  width: 40px;
  height: 200px;
  margin: 1px;
  background: white;
  border: 1px solid #000;
  cursor: pointer;
  position: relative;
}

.piano-key.sharp {
  width: 30px;
  height: 120px;
  background: black;
  position: absolute;
  top: 0;
  z-index: 1;
  margin-left: -15px;
}

.piano-key.none {
  background: transparent;
  border: none;
  cursor: default;
}

.piano-key-active {
  background-color: #ff0;
}

.fullscreen {
  margin-top: 20px;
  padding: 10px;
  cursor: pointer;
}

.footer {
  background-color: #f1f1f1;
  text-align: center;
  padding: 10px;
}
```
```

### Tokens: {'input_tokens': 1423, 'output_tokens': 6743, 'reasoning_tokens': 4608}
### Execution time: 34.30147624015808
