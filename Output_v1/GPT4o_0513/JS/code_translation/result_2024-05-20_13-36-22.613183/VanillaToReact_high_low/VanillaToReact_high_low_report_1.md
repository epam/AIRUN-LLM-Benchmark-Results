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
npm install
```

```tsx
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

```tsx
// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import a from './assets/audio/a.mp3';
import d from './assets/audio/d.mp3';
import e from './assets/audio/e.mp3';
import f from './assets/audio/f.mp3';
import g from './assets/audio/g.mp3';
import b from './assets/audio/b.mp3';
import cSharp from './assets/audio/c♯.mp3';
import dSharp from './assets/audio/d♯.mp3';
import fSharp from './assets/audio/f♯.mp3';
import gSharp from './assets/audio/g♯.mp3';
import aSharp from './assets/audio/a♯.mp3';

const soundMapper: { [key: string]: HTMLAudioElement } = {
  c: new Audio(a),
  d: new Audio(d),
  e: new Audio(e),
  f: new Audio(f),
  g: new Audio(g),
  a: new Audio(a),
  b: new Audio(b),
  'c♯': new Audio(cSharp),
  'd♯': new Audio(dSharp),
  'f♯': new Audio(fSharp),
  'g♯': new Audio(gSharp),
  'a♯': new Audio(aSharp),
};

const App: React.FC = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [isLetters, setIsLetters] = useState<boolean>(false);

  const play = (event: KeyboardEvent | React.MouseEvent<HTMLDivElement>) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const pianoEl = isKeyboard
      ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`)
      : (event.target as HTMLDivElement);
    if (!pianoEl) return;

    const note = pianoEl.getAttribute('data-note');
    if (!note || played.includes(note)) return;

    pianoEl.classList.add('piano-key-active');
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  };

  const resetActive = (event: KeyboardEvent | React.MouseEvent<HTMLDivElement>) => {
    const isKeyboard = event instanceof KeyboardEvent;
    const pianoEl = isKeyboard
      ? document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`)
      : (event.target as HTMLDivElement);
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active');
    const note = pianoEl.getAttribute('data-note');
    if (note) {
      setPlayed((prev) => prev.filter((n) => n !== note));
    }
  };

  const change = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLetters(event.currentTarget.classList.contains('btn-letters'));
  };

  const fullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
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
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`} onClick={change}>Notes</button>
          <button className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`} onClick={change}>Letters</button>
        </div>
        <div className={`piano ${isLetters ? 'letters' : ''}`}>
          <div className="piano-key" data-letter="D" data-note="c" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="F" data-note="d" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="G" data-note="e" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="H" data-note="f" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="J" data-note="g" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="K" data-note="a" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="piano-key" data-letter="L" data-note="b" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          <div className="keys-sharp">
            <div className="piano-key sharp" data-letter="R" data-note="c♯" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
            <div className="piano-key sharp" data-letter="T" data-note="d♯" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
            <div className="piano-key sharp none"></div>
            <div className="piano-key sharp" data-letter="U" data-note="f♯" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
            <div className="piano-key sharp" data-letter="I" data-note="g♯" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
            <div className="piano-key sharp" data-letter="O" data-note="a♯" onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}></div>
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={fullscreen}></button>
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

```css
/* src/App.css */
body {
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

.header-title {
  margin: 0;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.btn-container {
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
}

.btn-active {
  background-color: #333;
  color: white;
}

.piano {
  display: flex;
  position: relative;
}

.piano-key {
  width: 40px;
  height: 200px;
  background-color: white;
  border: 1px solid #333;
  cursor: pointer;
}

.piano-key-active {
  background-color: #ccc;
}

.keys-sharp {
  display: flex;
  position: absolute;
  top: 0;
  left: 20px;
}

.piano-key.sharp {
  width: 30px;
  height: 120px;
  background-color: black;
  margin-left: 10px;
  margin-right: 10px;
  z-index: 1;
}

.piano-key.sharp.none {
  visibility: hidden;
}

.letters .piano-key::after {
  content: attr(data-letter);
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  color: #333;
}

.fullscreen {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.footer {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

.footer-container {
  margin: 0;
}
```

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

```json
// public/manifest.json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

```json
// public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Virtual Piano</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
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

```json
// package.json
{
  "name": "virtual-piano",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.11.56",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
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
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

```tsx
// src/react-app-env.d.ts
/// <reference types="react-scripts" />
```

```tsx
// src/reportWebVitals.ts
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

```tsx
// src/setupTests.ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 3140}
### Execution time: 43.17301392555237
