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
```tsx
// src/index.tsx
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

```tsx
// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const soundMapper: Record<string, HTMLAudioElement> = {
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
};

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [isLettersMode, setIsLettersMode] = useState(false);
  const pianoRef = useRef<HTMLDivElement>(null);

  const play = (note: string | null, pianoEl: HTMLElement | null) => {
    if (!note || played.includes(note)) return;

    if (pianoEl) {
      pianoEl.classList.add('piano-key-active');
    }

    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  };

  const resetActive = (note: string | null, pianoEl: HTMLElement | null) => {
    if (!note) return;

    if (pianoEl) {
      pianoEl.classList.remove('piano-key-active');
    }

    setPlayed((prev) => prev.filter((n) => n !== note));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter="${event.key.toUpperCase()}"]`) as HTMLElement | null;
    const note = pianoEl?.dataset.note || null;
    play(note, pianoEl);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter="${event.key.toUpperCase()}"]`) as HTMLElement | null;
    const note = pianoEl?.dataset.note || null;
    resetActive(note, pianoEl);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLElement;
    const note = pianoEl.dataset.note || null;
    play(note, pianoEl);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLElement;
    const note = pianoEl.dataset.note || null;
    resetActive(note, pianoEl);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      const pianoEl = event.target as HTMLElement;
      const note = pianoEl.dataset.note || null;
      play(note, pianoEl);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleMode = (mode: 'notes' | 'letters') => {
    setIsLettersMode(mode === 'letters');
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [played]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button
            className={`btn btn-notes ${!isLettersMode ? 'btn-active' : ''}`}
            onClick={() => toggleMode('notes')}
          >
            Notes
          </button>
          <button
            className={`btn btn-letters ${isLettersMode ? 'btn-active' : ''}`}
            onClick={() => toggleMode('letters')}
          >
            Letters
          </button>
        </div>
        <div
          className={`piano ${isLettersMode ? 'letters' : ''}`}
          ref={pianoRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {['c', 'd', 'e', 'f', 'g', 'a', 'b'].map((note, index) => (
            <div
              key={index}
              className="piano-key"
              data-note={note}
              data-letter={String.fromCharCode(68 + index)}
            ></div>
          ))}
          <div className="keys-sharp">
            {['c♯', 'd♯', '', 'f♯', 'g♯', 'a♯'].map((note, index) => (
              <div
                key={index}
                className={`piano-key sharp ${note === '' ? 'none' : ''}`}
                data-note={note}
                data-letter={['R', 'T', '', 'U', 'I', 'O'][index]}
              ></div>
            ))}
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={toggleFullscreen}></button>
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
};

export default App;
```

```css
/* src/App.css */
.app {
  font-family: 'Open Sans', sans-serif;
}

.header {
  text-align: center;
}

.header-title {
  font-size: 2rem;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-container {
  margin-bottom: 1rem;
}

.btn {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.btn-active {
  background-color: #007bff;
  color: white;
}

.piano {
  display: flex;
  position: relative;
}

.piano-key {
  width: 50px;
  height: 200px;
  background-color: white;
  border: 1px solid black;
  position: relative;
  cursor: pointer;
}

.piano-key-active {
  background-color: #007bff;
}

.keys-sharp {
  display: flex;
  position: absolute;
  top: 0;
  left: 25px;
}

.piano-key.sharp {
  width: 30px;
  height: 120px;
  background-color: black;
  margin-left: 20px;
  z-index: 1;
}

.piano-key.sharp.none {
  visibility: hidden;
}

.fullscreen {
  margin-top: 1rem;
  cursor: pointer;
}

.footer {
  text-align: center;
  margin-top: 2rem;
}
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 1724, 'reasoning_tokens': 0}
### Execution time: 12.48201298713684
