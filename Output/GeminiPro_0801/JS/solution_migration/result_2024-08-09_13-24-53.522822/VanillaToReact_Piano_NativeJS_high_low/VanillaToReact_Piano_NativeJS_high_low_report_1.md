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
```typescript
// src/App.tsx
import React, { useEffect, useState } from 'react';
import './App.css';

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

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [showLetters, setShowLetters] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    play(event.key.toUpperCase());
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    resetActive(event.key.toUpperCase());
  };

  const handleClick = (note: string) => {
    play(note);
    resetActive(note);
  };

  const toggleLetters = () => {
    setShowLetters(!showLetters);
  };

  const play = (note: string) => {
    if (played.includes(note)) return;

    setPlayed([...played, note]);
    soundMapper[note].currentTime = 0;
    soundMapper[note].play();
  };

  const resetActive = (note: string) => {
    setPlayed(played.filter((n) => n !== note));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button
            className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
            onClick={() => toggleLetters()}
          >
            Notes
          </button>
          <button
            className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
            onClick={() => toggleLetters()}
          >
            Letters
          </button>
        </div>
        <div className={`piano ${showLetters ? 'letters' : ''}`}>
          {['D', 'F', 'G', 'H', 'J', 'K', 'L'].map((letter) => (
            <div
              key={letter}
              className={`piano-key ${
                played.includes(
                  document
                    .querySelector(`.piano-key[data-letter="${letter}"]`)
                    ?.getAttribute('data-note') || ''
                )
                  ? 'piano-key-active'
                  : ''
              }`}
              data-letter={letter}
              data-note={
                document
                  .querySelector(`.piano-key[data-letter="${letter}"]`)
                  ?.getAttribute('data-note') || ''
              }
              onMouseDown={() => handleClick(letter)}
            ></div>
          ))}
          <div className="keys-sharp">
            {['R', 'T', '', 'U', 'I', 'O'].map((letter, index) => (
              <div
                key={index}
                className={`piano-key sharp ${letter === '' ? 'none' : ''} ${
                  played.includes(
                    document
                      .querySelector(`.piano-key[data-letter="${letter}"]`)
                      ?.getAttribute('data-note') || ''
                  )
                    ? 'piano-key-active'
                    : ''
                }`}
                data-letter={letter}
                data-note={
                  document
                    .querySelector(`.piano-key[data-letter="${letter}"]`)
                    ?.getAttribute('data-note') || ''
                }
                onMouseDown={() => handleClick(letter)}
              ></div>
            ))}
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={handleFullscreen}>
        </button>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Open Sans', sans-serif;
  background-color: #f0f0f0;
  overflow: hidden;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 1rem 0;
  text-align: center;
}

.header-title {
  font-size: 2rem;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
}

.btn-container {
  display: flex;
  margin-bottom: 20px;
}

.btn {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

.btn-active {
  background-color: #3e8e41;
}

.piano {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.piano-key {
  height: 150px;
  width: 40px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  margin-right: 2px;
  cursor: pointer;
  border-radius: 0 0 5px 5px;
  transition: background-color 0.1s ease;
}

.piano-key:last-child {
  margin-right: 0;
}

.piano-key-active {
  background-color: #ddd;
}

.keys-sharp {
  display: flex;
  position: relative;
  top: -130px;
  left: 20px;
}

.sharp {
  height: 100px;
  width: 30px;
  background-color: #333;
  border: 1px solid #ccc;
  margin-right: 2px;
  cursor: pointer;
  border-radius: 0 0 5px 5px;
  z-index: 1;
  transition: background-color 0.1s ease;
}

.sharp.none {
  background-color: transparent;
  border: none;
  cursor: default;
}

.sharp:last-child {
  margin-right: 0;
}

.letters {
  font-size: 10px;
}

.letters .piano-key {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.letters .sharp {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.fullscreen {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.fullscreen:hover {
  opacity: 1;
}

.fullscreen::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 2px;
  background-color: #fff;
  transform: rotate(45deg);
}

.fullscreen::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 2px;
  background-color: #fff;
  transform: rotate(-45deg);
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 1rem 0;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
```

```
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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

```
// public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/piano.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
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

### Tokens: {'input_tokens': 1596, 'output_tokens': 2706}
### Execution time: 73.62821292877197
