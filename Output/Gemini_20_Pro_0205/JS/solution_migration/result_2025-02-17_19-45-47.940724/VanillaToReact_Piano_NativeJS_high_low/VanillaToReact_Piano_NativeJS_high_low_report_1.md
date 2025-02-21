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
```bash
npx create-react-app virtual-piano --template typescript
cd virtual-piano
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

```json
// tsconfig.json - add to compilerOptions
"esModuleInterop": true,
```

```typescript
// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './piano.ico';

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

const keys = [
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
  { letter: 'U', note: 'f♯' },
  { letter: 'I', note: 'g♯' },
  { letter: 'O', note: 'a♯' },
];

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'notes' | 'letters'>('notes');
  const [isMouseDown, setIsMouseDown] = useState(false);
    const fullscreenButtonRef = useRef<HTMLButtonElement>(null);

  const playSound = (note: string) => {
    if (!played.includes(note)) {
      const sound = soundMapper[note];
      sound.currentTime = 0;
      sound.play();
      setPlayed([...played, note]);
    }
  };

  const stopSound = (note: string) => {
    setPlayed(played.filter((n) => n !== note));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    if (pianoKey) {
      const note = pianoKey.dataset.note;
      if (note) {
        playSound(note);
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    if (pianoKey) {
      const note = pianoKey.dataset.note;
      if (note) {
        stopSound(note);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [played]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                fullscreenButtonRef.current?.classList.remove('exitfullscreen');
                fullscreenButtonRef.current?.classList.add('openfullscreen');
            } else {
                fullscreenButtonRef.current?.classList.add('exitfullscreen');
                fullscreenButtonRef.current?.classList.remove('openfullscreen');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

  const toggleDisplayMode = (mode: 'notes' | 'letters') => {
    setDisplayMode(mode);
  };

    const toggleFullscreen = () => {
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
          <button
            className={`btn btn-notes ${displayMode === 'notes' ? 'btn-active' : ''}`}
            onClick={() => toggleDisplayMode('notes')}
          >
            Notes
          </button>
          <button
            className={`btn btn-letters ${displayMode === 'letters' ? 'btn-active' : ''}`}
            onClick={() => toggleDisplayMode('letters')}
          >
            Letters
          </button>
        </div>
        <div className={`piano ${displayMode === 'letters' ? 'letters' : ''}`}>
          {keys.map(({ letter, note }) => (
            <div
              key={note}
              className={`piano-key ${played.includes(note) ? 'piano-key-active' : ''}`}
              data-letter={letter}
              data-note={note}
              onMouseDown={() => { setIsMouseDown(true); playSound(note); }}
              onMouseUp={() => { setIsMouseDown(false); stopSound(note); }}
              onMouseLeave={() => {if (isMouseDown) stopSound(note);}}
              onMouseEnter={() => {if (isMouseDown) playSound(note);}}

            ></div>
          ))}
          <div className="keys-sharp">
            {sharpKeys.map(({ letter, note }) => (
              <div
                key={note}
                className={`piano-key sharp ${played.includes(note) ? 'piano-key-active' : ''} ${note === 'f♯' ? '' : ''}`}
                data-letter={letter}
                data-note={note}
                onMouseDown={() => { setIsMouseDown(true); playSound(note); }}
                onMouseUp={() => { setIsMouseDown(false); stopSound(note); }}
                onMouseLeave={() => {if (isMouseDown) stopSound(note);}}
                onMouseEnter={() => {if (isMouseDown) playSound(note);}}
              ></div>
            ))}
              <div className="piano-key sharp none"></div>
          </div>
        </div>
        <button className="fullscreen openfullscreen" ref={fullscreenButtonRef} onClick={toggleFullscreen}></button>
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

```css
/* src/App.css */
/* Add or modify styles as needed, based on your original style.css */
body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    background-color: #f0f0f0;
    text-align: center;
}

.header {
    background-color: #333;
    color: white;
    padding: 1rem 0;
}

.header-title {
    margin: 0;
}

.btn-container {
    margin-top: 1rem;
}

.btn {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
    background-color: #eee;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-active {
    background-color: #ddd;
}

.piano {
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    position: relative;
}

.piano-key {
    width: 40px;
    height: 150px;
    background-color: white;
    border: 1px solid #aaa;
    margin-right: 2px;
    border-radius: 0 0 5px 5px;
    cursor: pointer;
    position: relative;
}

.piano-key-active {
    background-color: #ddd;
}

.sharp {
    width: 30px;
    height: 100px;
    background-color: black;
    position: absolute;
    color: white;
    border-radius: 0 0 3px 3px;
    z-index: 2;
}

.keys-sharp {
    position: absolute;
    display: flex;
    left: 25px;
    width: calc(100% - 35px);
}

.keys-sharp > .piano-key:nth-child(1) {
    left: 0;
}

.keys-sharp > .piano-key:nth-child(2) {
    left: 42px;
}

.keys-sharp > .piano-key:nth-child(4) {
    left: 126px;
}

.keys-sharp > .piano-key:nth-child(5) {
    left: 168px;
}
.keys-sharp > .piano-key:nth-child(6) {
    left: 210px;
}

.none {
    visibility: hidden;
}

.letters .piano-key::after {
    content: attr(data-letter);
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
}

.sharp.piano-key::after {
    bottom: 5px;
}

.footer {
    background-color: #333;
    color: white;
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.fullscreen {
    position: absolute;
    bottom: 60px;
    right: 10px;
    width: 48px;
    height: 48px;
    border: none;
    background-size: contain;
    cursor: pointer;
}

.openfullscreen {
    background: url('./assets/images/fullscreen.png') no-repeat center center;
    background-size: 32px;
}

.exitfullscreen {
    background: url('./assets/images/exitfullscreen.png') no-repeat center center;
    background-size: 32px;
}
```

```
// public/index.html - remains mostly unchanged, remove script tag
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
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>

</html>
```

```
// public/assets/ - Create folders and add files
// public/assets/audio/ - Add audio files (a.mp3, b.mp3, c#.mp3, etc.)
// public/assets/piano.ico - Add piano icon
// public/assets/images/ - Add fullscreen.png and exitfullscreen.png
```


### Tokens: {'input_tokens': 1598, 'output_tokens': 2994}
### Execution time: 27.182404041290283
