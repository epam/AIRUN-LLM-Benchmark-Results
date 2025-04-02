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
# package.json
```json
{
  "name": "virtual-piano-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^28.1.1",
    "@types/node": "^16.18.3",
    "@types/react": "^18.0.26",
    "@types/react-dom": "^18.0.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.8.4",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

```markdown
# tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

```markdown
# public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="./piano.ico" />
    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
      rel="stylesheet"
    />
    <title>virtual-piano</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```markdown
# public/piano.ico
```
(Place your piano.ico file here)

```markdown
# src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```markdown
# src/index.css
```css
html,
body,
#root {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
}
```

```markdown
# src/App.css
```css
.header {
  text-align: center;
  margin: 20px;
}
.header-title {
  font-size: 2rem;
  margin: 0;
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
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-family: 'Open Sans Condensed', sans-serif;
  font-size: 1rem;
}

.btn-active {
  background-color: #bbb;
}

.piano {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 50px);
  grid-template-rows: 180px;
  grid-gap: 1px;
}

.piano.letters .piano-key::before {
  content: attr(data-letter);
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #444;
}

.keys-sharp {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 50px);
  grid-column-gap: 1px;
  margin-top: 0;
  pointer-events: none;
}

.piano-key {
  background-color: #fff;
  border: 1px solid #000;
  position: relative;
  pointer-events: auto;
}

.sharp {
  background-color: #000;
  width: 30px !important;
  margin-left: -15px;
  z-index: 2;
  color: #fff;
}

.none {
  visibility: hidden;
}

.piano-key-active {
  background-color: #f0f062 !important;
}

.fullscreen {
  border: none;
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-size: cover;
  margin-top: 20px;
}

.openfullscreen {
  background: url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjUxMiIgdmlld..." ) no-repeat center;
}

.footer {
  text-align: center;
  margin-top: 20px;
}
```

```markdown
# src/App.tsx
```tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  'a♯': new Audio(`./assets/audio/a♯.mp3`)
};

function App() {
  const [played, setPlayed] = useState<string[]>([]);
  const [isLetters, setIsLetters] = useState(false);

  const playAudio = useCallback((note: string) => {
    const sound = soundMapper[note];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play();
  }, []);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter='${event.key.toUpperCase()}']`) as HTMLElement | null;
    if (!pianoEl) return;
    const note = pianoEl.getAttribute('data-note');
    if (!note) return;
    if (played.includes(note)) return;
    pianoEl.classList.add('piano-key-active');
    setPlayed(prev => [...prev, note]);
    playAudio(note);
  }, [playAudio, played]);

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter='${event.key.toUpperCase()}']`) as HTMLElement | null;
    if (!pianoEl) return;
    const note = pianoEl.getAttribute('data-note');
    if (!note) return;
    pianoEl.classList.remove('piano-key-active');
    setPlayed(prev => prev.filter(item => item !== note));
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    const note = target.dataset.note;
    if (!note) return;
    if (played.includes(note)) return;
    target.classList.add('piano-key-active');
    setPlayed(prev => [...prev, note]);
    playAudio(note);
  };

  const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    const note = target.dataset.note;
    if (!note) return;
    target.classList.remove('piano-key-active');
    setPlayed(prev => prev.filter(item => item !== note));
  };

  const onMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    const note = target.dataset.note;
    if (!note) return;
    target.classList.remove('piano-key-active');
    setPlayed(prev => prev.filter(item => item !== note));
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('piano-key')) return;
      const note = target.dataset.note;
      if (!note) return;
      if (played.includes(note)) return;
      target.classList.add('piano-key-active');
      setPlayed(prev => [...prev, note]);
      playAudio(note);
    }
  };

  const toggleView = (view: 'letters' | 'notes') => {
    setIsLetters(view === 'letters');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button
            className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`}
            onClick={() => toggleView('notes')}
          >
            Notes
          </button>
          <button
            className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`}
            onClick={() => toggleView('letters')}
          >
            Letters
          </button>
        </div>
        <div
          className={`piano ${isLetters ? 'letters' : ''}`}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseOut={onMouseOut}
          onMouseMove={onMouseMove}
        >
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
        <button className="fullscreen openfullscreen" onClick={toggleFullscreen}></button>
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
}

export default App;
```

```markdown
# Place your audio files
```
(Place all audio files referenced by soundMapper under public/assets/audio or another suitable location, ensuring the paths match the code.)

### Tokens: {'input_tokens': 1401, 'output_tokens': 5583, 'reasoning_tokens': 2688}
### Execution time: 149.3962960243225
