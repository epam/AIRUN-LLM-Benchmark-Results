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
### index.tsx

```tsx
import React, { useState } from 'react';
import './css/style.css';

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
  const [isLetters, setIsLetters] = useState(false);

  const handlePlay = (event: React.MouseEvent | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const key = isKeyboard ? event.key.toUpperCase() : (event.target as HTMLElement).dataset.letter;
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`);
    if (!pianoEl || played.includes(pianoEl.dataset.note!)) return;

    pianoEl.classList.add('piano-key-active');
    const sound = soundMapper[pianoEl.dataset.note!];
    sound.currentTime = 0;
    sound.play();
    setPlayed([...played, pianoEl.dataset.note!]);
  };

  const handleResetActive = (event: React.MouseEvent | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const key = isKeyboard ? event.key.toUpperCase() : (event.target as HTMLElement).dataset.letter;
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`);
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active');
    setPlayed(played.filter(note => note !== pianoEl.dataset.note));
  };

  const handleChangeMode = () => {
    setIsLetters(!isLetters);
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
          <button className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`} onClick={handleChangeMode}>
            Notes
          </button>
          <button className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`} onClick={handleChangeMode}>
            Letters
          </button>
        </div>
        <div className={`piano ${isLetters ? 'letters' : ''}`}>
          <div className="piano-key" data-letter="D" data-note="c" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="F" data-note="d" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="G" data-note="e" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="H" data-note="f" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="J" data-note="g" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="K" data-note="a" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="piano-key" data-letter="L" data-note="b" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          <div className="keys-sharp">
            <div className="piano-key sharp" data-letter="R" data-note="c♯" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
            <div className="piano-key sharp" data-letter="T" data-note="d♯" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
            <div className="piano-key sharp none"></div>
            <div className="piano-key sharp" data-letter="U" data-note="f♯" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
            <div className="piano-key sharp" data-letter="I" data-note="g♯" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
            <div className="piano-key sharp" data-letter="O" data-note="a♯" onMouseDown={handlePlay} onMouseUp={handleResetActive}></div>
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
      </main>
      <footer className="footer">
        <div className="footer-container">
          2020
        </div>
      </footer>
    </>
  );
};

export default App;
```

### index.css

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
  background-color: #f0f0f0;
}

.header {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
}

.header-title {
  margin: 0;
  font-family: 'Open Sans Condensed', sans-serif;
  font-size: 2.5rem;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.btn-container {
  display: flex;
  margin-bottom: 2rem;
}

.btn {
  background-color: #4CAF50;
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
  background-color: #008CBA;
}

.piano {
  display: flex;
  width: 600px;
  height: 200px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
}

.piano-key {
  position: relative;
  width: calc(100% / 7);
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #ccc;
  cursor: pointer;
}

.piano-key:last-child {
  border-right: none;
}

.piano-key.sharp {
  position: absolute;
  top: 0;
  width: calc(100% / 14);
  height: 60%;
  background-color: #000;
  color: #fff;
  z-index: 1;
}

.piano-key.sharp.none {
  background-color: transparent;
  cursor: default;
}

.piano-key-active {
  background-color: #ddd;
}

.keys-sharp {
  display: flex;
  width: 100%;
  height: 100%;
}

.letters .piano-key::after {
  content: attr(data-letter);
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
}

.fullscreen {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: #4CAF50;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-image: url('./assets/fullscreen.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
}

.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.footer-container {
  font-size: 0.8rem;
}
``` 


### Tokens: {'input_tokens': 1596, 'output_tokens': 2277}
### Execution time: 66.64607787132263
