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
```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

```tsx
// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import './css/style.css';

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

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [showLetters, setShowLetters] = useState(false);
  const pianoRef = useRef<HTMLDivElement>(null);

  const play = (note: string) => {
    if (played.includes(note)) return;

    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed([...played, note]);
  };

  const resetActive = (note: string) => {
    setPlayed(played.filter((n) => n !== note));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = document.querySelector(`.piano-key[data-letter=${key}]`) as HTMLElement;
    if (!pianoKey) return;

    const note = pianoKey.dataset.note;
    if (!note) return;

    pianoKey.classList.add('piano-key-active');
    play(note);
  };

  const handleKeyRelease = (event: React.KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = document.querySelector(`.piano-key[data-letter=${key}]`) as HTMLElement;
    if (!pianoKey) return;

    const note = pianoKey.dataset.note;
    if (!note) return;

    pianoKey.classList.remove('piano-key-active');
    resetActive(note);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;

    const note = target.dataset.note;
    if (!note) return;

    target.classList.add('piano-key-active');
    play(note);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;

    const note = target.dataset.note;
    if (!note) return;

    target.classList.remove('piano-key-active');
    resetActive(note);
  };

  const handleMouseOut = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;

    target.classList.remove('piano-key-active');
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons !== 1) return;

    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;

    const note = target.dataset.note;
    if (!note) return;

    target.classList.add('piano-key-active');
    play(note);
  };

  const toggleView = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('btn')) return;

    document.querySelector('.btn-active')?.classList.remove('btn-active');
    target.classList.add('btn-active');
    setShowLetters(target.classList.contains('btn-letters'));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const piano = pianoRef.current;
    if (!piano) return;

    const handleKeyDown = (event: KeyboardEvent) => handleKeyPress(event as unknown as React.KeyboardEvent);
    const handleKeyUp = (event: KeyboardEvent) => handleKeyRelease(event as unknown as React.KeyboardEvent);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div>
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`} onClick={toggleView}>
            Notes
          </button>
          <button className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`} onClick={toggleView}>
            Letters
          </button>
        </div>
        <div className={`piano ${showLetters ? 'letters' : ''}`} ref={pianoRef}>
          <div className="piano-key" data-letter="D" data-note="c" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="F" data-note="d" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="G" data-note="e" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="H" data-note="f" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="J" data-note="g" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="K" data-note="a" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="piano-key" data-letter="L" data-note="b" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
          <div className="keys-sharp">
            <div className="piano-key sharp" data-letter="R" data-note="c♯" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
            <div className="piano-key sharp" data-letter="T" data-note="d♯" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
            <div className="piano-key sharp none"></div>
            <div className="piano-key sharp" data-letter="U" data-note="f♯" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
            <div className="piano-key sharp" data-letter="I" data-note="g♯" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
            <div className="piano-key sharp" data-letter="O" data-note="a♯" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}></div>
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
```

### Tokens: {'input_tokens': 1351, 'output_tokens': 1866}
### Execution time: 19.81461787223816
