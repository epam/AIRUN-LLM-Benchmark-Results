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
**index.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

**App.tsx**
```typescript
import React, { useState, useEffect } from 'react';
import './App.css';

const soundMapper = {
  c: new Audio('./assets/audio/c.mp3'),
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

interface PianoKey {
  letter: string;
  note: string;
  sharp?: boolean;
}

const pianoKeys: PianoKey[] = [
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
  const [played, setPlayed] = useState<string[]>([]);
  const [isLetters, setIsLetters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', handlePlay);
    document.addEventListener('keyup', handleResetActive);
    return () => {
      document.removeEventListener('keydown', handlePlay);
      document.removeEventListener('keyup', handleResetActive);
    };
  }, []);

  const handlePlay = (event: KeyboardEvent) => {
    const pianoEl = pianoKeys.find((key) => key.letter === event.key.toUpperCase());
    if (!pianoEl) return;

    const note = pianoEl.note;
    if (!note || played.includes(note)) return;

    setPlayed((prevPlayed) => [...prevPlayed, note]);
    soundMapper[note].currentTime = 0;
    soundMapper[note].play();
  };

  const handleResetActive = (event: KeyboardEvent) => {
    const pianoEl = pianoKeys.find((key) => key.letter === event.key.toUpperCase());
    if (!pianoEl) return;

    setPlayed((prevPlayed) => prevPlayed.filter((note) => note !== pianoEl.note));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, note: string) => {
    if (!note || played.includes(note)) return;

    setPlayed((prevPlayed) => [...prevPlayed, note]);
    soundMapper[note].currentTime = 0;
    soundMapper[note].play();
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>, note: string) => {
    setPlayed((prevPlayed) => prevPlayed.filter((prevNote) => prevNote !== note));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, note: string) => {
    if (event.buttons === 1) {
      handleMouseDown(event, note);
    }
  };

  const handleFullscreen = () => {
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
          <button
            className={`btn ${isLetters ? 'btn-letters' : 'btn-notes'} ${isLetters ? '' : 'btn-active'}`}
            onClick={() => setIsLetters(false)}
          >
            Notes
          </button>
          <button
            className={`btn ${isLetters ? 'btn-letters' : 'btn-notes'} ${isLetters ? 'btn-active' : ''}`}
            onClick={() => setIsLetters(true)}
          >
            Letters
          </button>
        </div>
        <div className={`piano ${isLetters ? 'letters' : ''}`}>
          {pianoKeys.map((key, index) => (
            <div
              key={index}
              className={`piano-key ${key.sharp ? 'sharp' : ''} ${played.includes(key.note) ? 'piano-key-active' : ''}`}
              onMouseDown={(event) => handleMouseDown(event, key.note)}
              onMouseUp={(event) => handleMouseUp(event, key.note)}
              onMouseMove={(event) => handleMouseMove(event, key.note)}
            >
              {key.letter}
            </div>
          ))}
        </div>
        <button className="fullscreen" onClick={handleFullscreen}>
          Fullscreen
        </button>
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
}

export default App;
```

**App.css**
```css
.App {
  text-align: center;
}

.header {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
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
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.btn-active {
  background-color: #3e8e41;
}

.piano {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.piano-key {
  width: 40px;
  height: 120px;
  margin: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.piano-key.sharp {
  width: 20px;
  height: 60px;
  margin: 10px;
  background-color: #000;
  color: #fff;
}

.piano-key-active {
  background-color: #4caf50;
  color: #fff;
}

.letters {
  font-size: 18px;
}

.fullscreen {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.footer {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
  clear: both;
}

.footer-container {
  font-size: 14px;
  color: #666;
}
```

### Tokens: {'input_tokens': 1355, 'output_tokens': 1727}
### Execution time: 32.06361222267151
