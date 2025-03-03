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
```typescript
// src/components/Header.tsx
import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Virtual Piano</h1>
    </header>
  );
};

export default Header;
```

```typescript
// src/components/Header.module.css
.header {
  text-align: center;
  padding: 20px 0;
  background-color: #f0f0f0;
}

.header-title {
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: 300;
  font-size: 2.5em;
  color: #333;
}
```

```typescript
// src/components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        2020
      </div>
    </footer>
  );
};

export default Footer;
```

```typescript
// src/components/Footer.module.css
.footer {
  background-color: #333;
  color: #fff;
  padding: 10px 0;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.footer-container {
  font-size: 0.9em;
}
```

```typescript
// src/components/ButtonContainer.tsx
import React from 'react';
import styles from './ButtonContainer.module.css';

interface ButtonContainerProps {
  showLetters: boolean;
  setShowLetters: (show: boolean) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ showLetters, setShowLetters }) => {
  const handleNotesClick = () => {
    setShowLetters(false);
  };

  const handleLettersClick = () => {
    setShowLetters(true);
  };

  return (
    <div className={styles.btnContainer}>
      <button
        className={`${styles.btn} ${styles.btnNotes} ${!showLetters ? styles.btnActive : ''}`}
        onClick={handleNotesClick}
      >
        Notes
      </button>
      <button
        className={`${styles.btn} ${styles.btnLetters} ${showLetters ? styles.btnActive : ''}`}
        onClick={handleLettersClick}
      >
        Letters
      </button>
    </div>
  );
};

export default ButtonContainer;
```

```typescript
// src/components/ButtonContainer.module.css
.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #eee;
  color: #333;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #ddd;
}

.btnActive {
  background-color: #ddd;
  font-weight: bold;
}

.btnNotes {
  margin-right: 5px;
}

.btnLetters {
  margin-left: 5px;
}
```

```typescript
// src/components/PianoKey.tsx
import React, { useCallback, useState } from 'react';
import styles from './PianoKey.module.css';

interface PianoKeyProps {
  note: string;
  letter: string;
  sharp?: boolean;
  showLetters: boolean;
  playSound: (note: string) => void;
  stopSound: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, letter, sharp = false, showLetters, playSound, stopSound }) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsActive(true);
    playSound(note);
  }, [note, playSound]);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
    stopSound(note);
  }, [note, stopSound]);

  const handleMouseOut = useCallback(() => {
    setIsActive(false);
    stopSound(note);
  }, [note, stopSound]);


  return (
    <div
      className={`${styles.pianoKey} ${sharp ? styles.sharp : ''} ${isActive ? styles.pianoKeyActive : ''}`}
      data-note={note}
      data-letter={letter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
    >
      {showLetters && <div className={styles.keyLetter}>{letter}</div>}
    </div>
  );
};

export default PianoKey;
```

```typescript
// src/components/PianoKey.module.css
.pianoKey {
  height: 150px;
  width: 50px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  user-select: none;
}

.pianoKey.sharp {
  position: relative;
  background-color: black;
  color: white;
  height: 100px;
  width: 30px;
  margin-left: -15px;
  margin-right: -15px;
  z-index: 1;
  border: 1px solid #555;
}

.pianoKeyActive {
  background-color: #ddd;
}

.pianoKeyActive.sharp {
  background-color: #333;
}

.keyLetter {
  font-size: 1.2em;
  font-weight: bold;
  color: black;
  position: absolute;
  top: 10px;
}

.pianoKey.sharp > .keyLetter {
    color: white;
}
```

```typescript
// src/components/Piano.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PianoKey from './PianoKey';
import styles from './Piano.module.css';

const soundMapper: { [key: string]: HTMLAudioElement } = {
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

interface PianoProps {
  showLetters: boolean;
}

const Piano: React.FC<PianoProps> = ({ showLetters }) => {
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const pianoRef = useRef<HTMLDivElement>(null);

  const playSound = useCallback((note: string) => {
    if (playedNotes.includes(note)) return;
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
      setPlayedNotes(prevNotes => [...prevNotes, note]);
    }
  }, [playedNotes]);

  const stopSound = useCallback((note: string) => {
    setPlayedNotes(prevNotes => prevNotes.filter(n => n !== note));
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKeyElement = pianoRef.current?.querySelector(`[data-letter="${key}"]`);
    if (pianoKeyElement) {
      const note = pianoKeyElement.getAttribute('data-note');
      if (note) {
        playSound(note);
        pianoKeyElement.classList.add(styles.pianoKeyActive); // Programmatically add active class
        if (pianoKeyElement.classList.contains(styles.sharp)) {
          pianoKeyElement.classList.add(styles.pianoKeyActiveSharp);
        }
      }
    }
  }, [playSound]);


  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKeyElement = pianoRef.current?.querySelector(`[data-letter="${key}"]`);
    if (pianoKeyElement) {
      const note = pianoKeyElement.getAttribute('data-note');
      if (note) {
        stopSound(note);
        pianoKeyElement.classList.remove(styles.pianoKeyActive); // Programmatically remove active class
        if (pianoKeyElement.classList.contains(styles.sharp)) {
          pianoKeyElement.classList.remove(styles.pianoKeyActiveSharp);
        }
      }
    }
  }, [stopSound]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      const target = event.target as HTMLElement;
      if (target.classList.contains(styles.pianoKey) || target.classList.contains(styles.sharp)) {
        const note = target.dataset.note;
        if (note) {
          playSound(note);
          target.classList.add(styles.pianoKeyActive);
          if (target.classList.contains(styles.sharp)) {
            target.classList.add(styles.pianoKeyActiveSharp);
          }
        }
      }
    }
  }, [playSound]);


  const handleMouseUpPiano = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
     if (target.classList.contains(styles.pianoKey) || target.classList.contains(styles.sharp)) {
        const note = target.dataset.note;
        if (note) {
          stopSound(note);
          target.classList.remove(styles.pianoKeyActive);
          if (target.classList.contains(styles.sharp)) {
            target.classList.remove(styles.pianoKeyActiveSharp);
          }
        }
      }
  }, [stopSound]);

    const handleMouseOutPiano = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
     if (target.classList.contains(styles.pianoKey) || target.classList.contains(styles.sharp)) {
        const note = target.dataset.note;
        if (note) {
          stopSound(note);
          target.classList.remove(styles.pianoKeyActive);
          if (target.classList.contains(styles.sharp)) {
            target.classList.remove(styles.pianoKeyActiveSharp);
          }
        }
      }
  }, [stopSound]);


  return (
    <div
      className={styles.piano}
      ref={pianoRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpPiano}
      onMouseOut={handleMouseOutPiano}
    >
      <PianoKey note="c" letter="D" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="d" letter="F" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="e" letter="G" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="f" letter="H" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="g" letter="J" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="a" letter="K" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <PianoKey note="b" letter="L" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      <div className={styles.keysSharp}>
        <PianoKey sharp note="c♯" letter="R" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
        <PianoKey sharp note="d♯" letter="T" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
        <div className={`${styles.pianoKey} ${styles.sharp} ${styles.none}`}></div>
        <PianoKey sharp note="f♯" letter="U" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
        <PianoKey sharp note="g♯" letter="I" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
        <PianoKey sharp note="a♯" letter="O" showLetters={showLetters} playSound={playSound} stopSound={stopSound} />
      </div>
    </div>
  );
};

export default Piano;
```

```typescript
// src/components/Piano.module.css
.piano {
  display: flex;
  padding-bottom: 20px;
  user-select: none;
}

.keysSharp {
  position: relative;
  display: flex;
  top: 0px;
  left: 27px;
}

.none {
  background-color: transparent !important;
  border: none !important;
  cursor: default !important;
  width: 30px !important;
  margin-left: -15px !important;
  margin-right: -15px !important;
}

.pianoKeyActive {
  background-color: #ddd;
}

.pianoKeyActiveSharp {
    background-color: #333;
}
```

```typescript
// src/components/Main.tsx
import React, { useState, useCallback } from 'react';
import ButtonContainer from './ButtonContainer';
import Piano from './Piano';
import styles from './Main.module.css';

const Main: React.FC = () => {
  const [showLetters, setShowLetters] = useState(false);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);


  return (
    <main className={styles.main}>
      <ButtonContainer showLetters={showLetters} setShowLetters={setShowLetters} />
      <Piano showLetters={showLetters} />
      <button className={`${styles.fullscreen} ${styles.openfullscreen}`} onClick={handleFullscreen}></button>
    </main>
  );
};

export default Main;
```

```typescript
// src/components/Main.module.css
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.fullscreen {
  position: relative;
  display: block;
  margin: 20px auto;
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-image: url('./assets/fullscreen.svg');
  background-repeat: no-repeat;
  background-size: contain;
}

.fullscreen:focus {
  outline: none;
}
```

```typescript
// src/assets/fullscreen.svg
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <g id="Слой_1-2" data-name="Слой 1">
    <path d="m0,0v16h16V0H0Zm8,8h-6v-6h6v6Zm0,0"/>
    <path d="m0,32v16h16V32H0Zm8,8h-6v-6h6v6Zm0,0"/>
    <path d="m32,0v16h16V0H32Zm8,8h-6v-6h6v6Zm0,0"/>
    <path d="m32,32v16h16V32H32Zm8,8h-6v-6h6v6Zm0,0"/>
  </g>
</svg>
```

```typescript
// src/App.tsx
import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
```

```typescript
// src/App.css
body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

```typescript
// src/index.tsx
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
// src/index.css
/* Reset and general styles would go here, if needed beyond App.css */
```

```typescript
// public/assets/audio/a.mp3
// public/assets/audio/b.mp3
// public/assets/audio/c♯.mp3
// public/assets/audio/d.mp3
// public/assets/audio/d♯.mp3
// public/assets/audio/e.mp3
// public/assets/audio/f.mp3
// public/assets/audio/f♯.mp3
// public/assets/audio/g.mp3
// public/assets/audio/g♯.mp3
// public/assets/audio/a♯.mp3
// public/assets/piano.ico
```

```typescript
// package.json
{
  "name": "virtual-piano-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.38",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
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
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
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
  "include": [
    "src"
  ]
}
```

### Tokens: {'input_tokens': 1598, 'output_tokens': 5238}
### Execution time: 23.650238037109375
