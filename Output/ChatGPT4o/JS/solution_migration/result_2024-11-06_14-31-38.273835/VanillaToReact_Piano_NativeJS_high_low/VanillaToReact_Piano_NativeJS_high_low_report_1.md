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
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { soundMapper } from './soundMapper';

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [isLettersMode, setIsLettersMode] = useState(false);

  const play = useCallback((note: string) => {
    if (!note || played.includes(note)) return;

    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  }, [played]);

  const resetActive = useCallback((note: string) => {
    setPlayed((prev) => prev.filter((n) => n !== note));
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) as HTMLElement;
    if (pianoEl) {
      const note = pianoEl.dataset.note!;
      play(note);
      pianoEl.classList.add('piano-key-active');
    }
  }, [play]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) as HTMLElement;
    if (pianoEl) {
      const note = pianoEl.dataset.note!;
      resetActive(note);
      pianoEl.classList.remove('piano-key-active');
    }
  }, [resetActive]);

  const handleMouseDown = (note: string, el: HTMLElement) => {
    play(note);
    el.classList.add('piano-key-active');
  };

  const handleMouseUp = (note: string, el: HTMLElement) => {
    resetActive(note);
    el.classList.remove('piano-key-active');
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.buttons === 1) {
      const pianoEl = event.target as HTMLElement;
      const note = pianoEl.dataset.note!;
      play(note);
    }
  };

  const toggleMode = (mode: 'notes' | 'letters') => {
    setIsLettersMode(mode === 'letters');
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
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn btn-notes ${!isLettersMode ? 'btn-active' : ''}`} onClick={() => toggleMode('notes')}>
            Notes
          </button>
          <button className={`btn btn-letters ${isLettersMode ? 'btn-active' : ''}`} onClick={() => toggleMode('letters')}>
            Letters
          </button>
        </div>
        <div className={`piano ${isLettersMode ? 'letters' : ''}`} onMouseMove={handleMouseMove}>
          {Object.keys(soundMapper).map((note) => (
            <div
              key={note}
              className={`piano-key ${note.includes('♯') ? 'sharp' : ''}`}
              data-note={note}
              data-letter={note[0].toUpperCase()}
              onMouseDown={(e) => handleMouseDown(note, e.currentTarget)}
              onMouseUp={(e) => handleMouseUp(note, e.currentTarget)}
              onMouseOut={(e) => handleMouseUp(note, e.currentTarget)}
            />
          ))}
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

```ts
// src/soundMapper.ts
export const soundMapper: Record<string, HTMLAudioElement> = {
  c: new Audio(require('./assets/audio/c.mp3')),
  d: new Audio(require('./assets/audio/d.mp3')),
  e: new Audio(require('./assets/audio/e.mp3')),
  f: new Audio(require('./assets/audio/f.mp3')),
  g: new Audio(require('./assets/audio/g.mp3')),
  a: new Audio(require('./assets/audio/a.mp3')),
  b: new Audio(require('./assets/audio/b.mp3')),
  'c♯': new Audio(require('./assets/audio/c♯.mp3')),
  'd♯': new Audio(require('./assets/audio/d♯.mp3')),
  'f♯': new Audio(require('./assets/audio/f♯.mp3')),
  'g♯': new Audio(require('./assets/audio/g♯.mp3')),
  'a♯': new Audio(require('./assets/audio/a♯.mp3')),
};
```

```css
/* src/App.css */
body {
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  text-align: center;
  padding: 20px;
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
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
}

.btn-active {
  background-color: #ccc;
}

.piano {
  display: flex;
  position: relative;
}

.piano-key {
  width: 40px;
  height: 150px;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
}

.piano-key.sharp {
  width: 30px;
  height: 100px;
  background-color: black;
  position: absolute;
  margin-left: -15px;
}

.piano-key-active {
  background-color: yellow;
}

.fullscreen {
  margin-top: 20px;
  padding: 10px;
  cursor: pointer;
}

.footer {
  text-align: center;
  padding: 20px;
}
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 1528, 'reasoning_tokens': 0}
### Execution time: 14.924352884292603
