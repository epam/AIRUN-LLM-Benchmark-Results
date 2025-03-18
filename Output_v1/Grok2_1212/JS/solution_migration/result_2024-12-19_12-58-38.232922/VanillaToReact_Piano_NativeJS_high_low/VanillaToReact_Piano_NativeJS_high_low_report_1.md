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
Here's the translated code to React 18.x using Create React App and TypeScript:

**package.json**
```json
{
  "name": "virtual-piano",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

**public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/piano.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
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

**src/index.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**src/App.tsx**
```typescript
import React, { useState, useCallback } from 'react';
import Piano from './components/Piano';
import ButtonContainer from './components/ButtonContainer';
import FullscreenButton from './components/FullscreenButton';
import './styles/App.css';

const App: React.FC = () => {
  const [isLettersMode, setIsLettersMode] = useState(false);

  const handleModeChange = useCallback((mode: boolean) => {
    setIsLettersMode(mode);
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <ButtonContainer onModeChange={handleModeChange} />
        <Piano isLettersMode={isLettersMode} />
        <FullscreenButton />
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

**src/components/Piano.tsx**
```typescript
import React, { useState, useCallback } from 'react';
import '../styles/Piano.css';

interface PianoProps {
  isLettersMode: boolean;
}

const Piano: React.FC<PianoProps> = ({ isLettersMode }) => {
  const [played, setPlayed] = useState<string[]>([]);

  const soundMapper: { [key: string]: HTMLAudioElement } = {
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

  const play = useCallback((note: string) => {
    if (!note || played.includes(note)) return;

    setPlayed(prevPlayed => [...prevPlayed, note]);
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
  }, [played]);

  const resetActive = useCallback((note: string) => {
    setPlayed(prevPlayed => prevPlayed.filter(n => n !== note));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`);
    if (!pianoEl) return;

    const note = pianoEl.getAttribute('data-note');
    if (note) {
      play(note);
    }
  }, [play]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`);
    if (!pianoEl) return;

    const note = pianoEl.getAttribute('data-note');
    if (note) {
      resetActive(note);
    }
  }, [resetActive]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    const note = pianoEl.getAttribute('data-note');
    if (note) {
      play(note);
    }
  }, [play]);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    const note = pianoEl.getAttribute('data-note');
    if (note) {
      resetActive(note);
    }
  }, [resetActive]);

  const handleMouseOut = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    const note = pianoEl.getAttribute('data-note');
    if (note) {
      resetActive(note);
    }
  }, [resetActive]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      const pianoEl = event.target as HTMLDivElement;
      const note = pianoEl.getAttribute('data-note');
      if (note) {
        play(note);
      }
    }
  }, [play]);

  return (
    <div 
      className={`piano ${isLettersMode ? 'letters' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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
      <div 
        className="piano-keys"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
      >
        {played.map(note => (
          <div 
            key={note} 
            className="piano-key-active" 
            data-note={note}
          />
        ))}
      </div>
    </div>
  );
};

export default Piano;
```

**src/components/ButtonContainer.tsx**
```typescript
import React from 'react';
import '../styles/ButtonContainer.css';

interface ButtonContainerProps {
  onModeChange: (mode: boolean) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ onModeChange }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => btn.classList.remove('btn-active'));
    event.currentTarget.classList.add('btn-active');

    onModeChange(event.currentTarget.classList.contains('btn-letters'));
  };

  return (
    <div className="btn-container">
      <button className="btn btn-notes btn-active" onClick={handleClick}>Notes</button>
      <button className="btn btn-letters" onClick={handleClick}>Letters</button>
    </div>
  );
};

export default ButtonContainer;
```

**src/components/FullscreenButton.tsx**
```typescript
import React from 'react';
import '../styles/FullscreenButton.css';

const FullscreenButton: React.FC = () => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
  );
};

export default FullscreenButton;
```

**src/styles/index.css**
```css
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

**src/styles/App.css**
```css
.App {
  text-align: center;
}

.header {
  background-color: #282c34;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.main {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.footer {
  background-color: #282c34;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
```

**src/styles/Piano.css**
```css
.piano {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 200px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.piano-key {
  width: 50px;
  height: 150px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  display: inline-block;
  margin: 0 2px;
  cursor: pointer;
}

.piano-key-active {
  background-color: #ccc;
}

.keys-sharp {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.sharp {
  width: 30px;
  height: 100px;
  background-color: black;
  border: 1px solid #333;
  border-radius: 0 0 5px 5px;
  display: inline-block;
  margin: 0 2px;
  z-index: 1;
  cursor: pointer;
}

.none {
  visibility: hidden;
}

.letters .piano-key::after {
  content: attr(data-letter);
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
}

.letters .sharp::after {
  content: attr(data-letter);
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: white;
}
```

**src/styles/ButtonContainer.css**
```css
.btn-container {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-active {
  background-color: #ccc;
}
```

**src/styles/FullscreenButton.css**
```css
.fullscreen {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  background-image: url('../assets/fullscreen.png');
  background-size: cover;
  border: none;
  cursor: pointer;
}
```

### Tokens: {'input_tokens': 1365, 'output_tokens': 3210}
### Execution time: 50.25042104721069
