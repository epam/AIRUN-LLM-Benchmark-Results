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

## Run 4:
### Answer:
```tsx
// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';

const soundMapper: { [key: string]: string } = {
  c: `./assets/audio/a.mp3`,
  d: `./assets/audio/d.mp3`,
  e: `./assets/audio/e.mp3`,
  f: `./assets/audio/f.mp3`,
  g: `./assets/audio/g.mp3`,
  a: `./assets/audio/a.mp3`,
  b: `./assets/audio/b.mp3`,
  'c♯': `./assets/audio/c♯.mp3`,
  'd♯': `./assets/audio/d♯.mp3`,
  'f♯': `./assets/audio/f♯.mp3`,
  'g♯': `./assets/audio/g♯.mp3`,
  'a♯': `./assets/audio/a♯.mp3`,
};

const keys = [
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
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [showLetters, setShowLetters] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = keys.find(k => k.letter === event.key.toUpperCase());
      if (key && !activeNotes.includes(key.note)) {
        setActiveNotes(prev => [...prev, key.note]);
        playSound(key.note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = keys.find(k => k.letter === event.key.toUpperCase());
      if (key) {
        setActiveNotes(prev => prev.filter(note => note !== key.note));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const playSound = (note: string) => {
    const audio = new Audio(soundMapper[note]);
    audio.currentTime = 0;
    audio.play();
  };

  const handleNoteClick = (note: string) => {
    if (!activeNotes.includes(note)) {
      setActiveNotes([...activeNotes, note]);
      playSound(note);
    }
  };

  const toggleLetters = () => setShowLetters(!showLetters);

  const requestFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn ${!showLetters ? 'btn-active' : ''}`} onClick={toggleLetters}>Notes</button>
          <button className={`btn ${showLetters ? 'btn-active' : ''}`} onClick={toggleLetters}>Letters</button>
        </div>
        <div className="piano">
          {keys.map(key => (
            <div
              key={key.letter}
              className={`piano-key ${key.sharp ? 'sharp' : ''} ${activeNotes.includes(key.note) ? 'piano-key-active' : ''} ${showLetters ? 'letters' : ''}`}
              data-letter={key.letter}
              data-note={key.note}
              onMouseDown={() => handleNoteClick(key.note)}
              onMouseUp={() => setActiveNotes(prev => prev.filter(note => note !== key.note))}
              onMouseOut={() => setActiveNotes(prev => prev.filter(note => note !== key.note))}
            >
              {showLetters ? key.letter : ''}
            </div>
          ))}
        </div>
        <button className="fullscreen" onClick={requestFullscreen}></button>
      </main>
    </div>
  );
}

export default App;
```

```css
/* App.css */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
}

.header {
  text-align: center;
  background-color: #333;
  color: white;
  padding: 20px 0;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.btn-container {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}

.btn-active {
  background-color: #333;
  color: white;
}

.piano {
  display: flex;
  flex-wrap: wrap;
  width: 700px;
  border: 1px solid #333;
}

.piano-key {
  width: 100px;
  height: 200px;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20px;
  cursor: pointer;
}

.piano-key-active {
  background-color: #ccc;
}

.sharp {
  background-color: #333;
  color: white;
  width: 60px;
  height: 120px;
  margin: 0 -30px;
  z-index: 1;
}

.letters .piano-key, .letters .sharp {
  justify-content: center;
  align-items: center;
  padding: 0;
}

.fullscreen {
  margin-top: 20px;
  cursor: pointer;
}
```

Ensure you have the `public/assets/audio` directory with the corresponding audio files and the `public/assets/piano.ico` for the favicon in your Create React App project.
### Tokens: {'prompt_tokens': 1351, 'completion_tokens': 1385, 'total_tokens': 2736}
### Execution time: 86.95745706558228
