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

## Run 2:
### Answer:
```typescript
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="./assets/piano.ico" rel="shortcut icon">
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap" rel="stylesheet">
  <link href="./css/style.css" rel="stylesheet">
  <title>virtual-piano</title>
</head>
<body>
  <div id="root"></div>
  <script src="./index.tsx"></script>
</body>
</html>
```

```typescript
// index.tsx
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

```typescript
// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Piano from './Piano';

const App: React.FC = () => {
  const [showNotes, setShowNotes] = useState(true);

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn btn-notes ${showNotes ? 'btn-active' : ''}`} onClick={() => setShowNotes(true)}>Notes</button>
          <button className={`btn btn-letters ${!showNotes ? 'btn-active' : ''}`} onClick={() => setShowNotes(false)}>Letters</button>
        </div>
        <Piano showNotes={showNotes} />
        <button className="fullscreen openfullscreen" onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}></button>
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

```typescript
// Piano.tsx
import React, { useState, useEffect } from 'react';

const soundMapper: { [key: string]: HTMLAudioElement } = {
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

interface PianoProps {
  showNotes: boolean;
}

const Piano: React.FC<PianoProps> = ({ showNotes }) => {
  const [played, setPlayed] = useState<string[]>([]);

  const play = (event: KeyboardEvent | React.MouseEvent<HTMLDivElement>) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) : event.target as HTMLElement;
    if (!pianoEl) return;

    const note = pianoEl.getAttribute('data-note');
    if (!note || played.includes(note)) return;

    pianoEl.classList.add('piano-key-active');
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed([...played, note]);
  };

  const resetActive = (event: KeyboardEvent | React.MouseEvent<HTMLDivElement>) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`) : event.target as HTMLElement;
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active');
    const note = pianoEl.getAttribute('data-note');
    if (note) {
      setPlayed(played.filter(n => n !== note));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => play(event);
    const handleKeyUp = (event: KeyboardEvent) => resetActive(event);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [played]);

  return (
    <div className={`piano ${showNotes ? '' : 'letters'}`} onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive} onMouseMove={(event) => {
      if (event.buttons === 1) {
        play(event);
      }
    }}>
      <div className="piano-key" data-letter="D" data-note="c"></div>
      <div className="piano-key" data-letter="F" data-note="d"></div>
      <div className="piano-key" data-letter="G" data-note="e"></div>
      <div className="piano-key" data-letter="H" data-note="f"></div>
      <div className="piano-key" data-letter="J" data-note="g"></div>
      <div className="piano-key" data-letter="K" data-note="a"></div>
      <div className="piano-key" data-letter="L" data-note="b"></div>
      <div className="keys-sharp">
        <div className="piano-key sharp" data-letter="R" data-note="c♯"></div>
        <div className="piano-key sharp" data-letter="T" data-note="d♯"></div>
        <div className="piano-key sharp none"></div>
        <div className="piano-key sharp" data-letter="U" data-note="f♯"></div>
        <div className="piano-key sharp" data-letter="I" data-note="g♯"></div>
        <div className="piano-key sharp" data-letter="O" data-note="a♯"></div>
      </div>
    </div>
  );
};

export default Piano;
```

```css
/* index.css */
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

.header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  text-align: center;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
  background-color: #61dafb;
}

.piano {
  display: flex;
  flex-direction: row;
}

.piano-key {
  width: 40px;
  height: 200px;
  background-color: white;
  border: 1px solid black;
  position: relative;
}

.piano-key.sharp {
  width: 30px;
  height: 120px;
  background-color: black;
  position: absolute;
  margin-left: -15px;
  z-index: 1;
}

.piano-key-active {
  background-color: #61dafb;
}

.fullscreen {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

.footer {
  background-color: #282c34;
  padding: 20px;
  color: white;
  text-align: center;
}
```

```typescript
// react-app-env.d.ts
/// <reference types="react-scripts" />
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 1938}
### Execution time: 27.361845016479492