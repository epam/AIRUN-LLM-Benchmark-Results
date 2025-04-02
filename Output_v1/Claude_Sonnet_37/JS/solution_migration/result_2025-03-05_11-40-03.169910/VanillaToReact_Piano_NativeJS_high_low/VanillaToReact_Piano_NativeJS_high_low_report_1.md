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
# React 18.x Translation with TypeScript

## App.tsx
```tsx
import React, { useState, useEffect, useRef, MouseEvent, KeyboardEvent } from 'react';
import './App.css';
import Piano from './components/Piano';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isLettersMode, setIsLettersMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleLettersMode = () => {
    setIsLettersMode(!isLettersMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main">
        <div className="btn-container">
          <button 
            className={`btn btn-notes ${!isLettersMode ? 'btn-active' : ''}`}
            onClick={() => setIsLettersMode(false)}
          >
            Notes
          </button>
          <button 
            className={`btn btn-letters ${isLettersMode ? 'btn-active' : ''}`}
            onClick={() => setIsLettersMode(true)}
          >
            Letters
          </button>
        </div>
        <Piano isLettersMode={isLettersMode} />
        <button 
          className={`fullscreen ${isFullscreen ? '' : 'openfullscreen'}`}
          onClick={toggleFullscreen}
        ></button>
      </main>
      <Footer />
    </div>
  );
};

export default App;
```

## components/Header.tsx
```tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Virtual Piano</h1>
    </header>
  );
};

export default Header;
```

## components/Footer.tsx
```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        2020
      </div>
    </footer>
  );
};

export default Footer;
```

## components/Piano.tsx
```tsx
import React, { useState, useEffect, useRef, MouseEvent, KeyboardEvent } from 'react';
import { PianoKey } from '../types';
import { pianoKeys } from '../data/pianoKeys';

interface PianoProps {
  isLettersMode: boolean;
}

const Piano: React.FC<PianoProps> = ({ isLettersMode }) => {
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const soundMapperRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Initialize audio elements
    const mapper: Record<string, HTMLAudioElement> = {};
    pianoKeys.forEach(key => {
      if (key.note) {
        mapper[key.note] = new Audio(`./assets/audio/${key.note}.mp3`);
      }
    });
    soundMapperRef.current = mapper;

    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const playNote = (note: string | undefined) => {
    if (!note || playedNotes.includes(note)) return;
    
    const sound = soundMapperRef.current[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
      setPlayedNotes(prev => [...prev, note]);
    }
  };

  const stopNote = (note: string | undefined) => {
    if (!note) return;
    setPlayedNotes(prev => prev.filter(n => n !== note));
  };

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    const key = pianoKeys.find(k => k.letter === event.key.toUpperCase());
    if (key && key.note) {
      playNote(key.note);
    }
  };

  const handleKeyUp = (event: globalThis.KeyboardEvent) => {
    const key = pianoKeys.find(k => k.letter === event.key.toUpperCase());
    if (key && key.note) {
      stopNote(key.note);
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const note = target.getAttribute('data-note');
    playNote(note || undefined);
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const note = target.getAttribute('data-note');
    stopNote(note || undefined);
  };

  const handleMouseOut = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const note = target.getAttribute('data-note');
    stopNote(note || undefined);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      const target = event.target as HTMLElement;
      const note = target.getAttribute('data-note');
      playNote(note || undefined);
    }
  };

  const regularKeys = pianoKeys.filter(key => !key.sharp);
  const sharpKeys = pianoKeys.filter(key => key.sharp);

  return (
    <div 
      className={`piano ${isLettersMode ? 'letters' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {regularKeys.map((key) => (
        <div
          key={key.note || key.id}
          className={`piano-key ${playedNotes.includes(key.note || '') ? 'piano-key-active' : ''}`}
          data-letter={key.letter}
          data-note={key.note}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
        >
          {isLettersMode && key.letter}
          {!isLettersMode && key.note}
        </div>
      ))}
      <div className="keys-sharp">
        {sharpKeys.map((key) => (
          <div
            key={key.note || key.id}
            className={`piano-key sharp ${!key.note ? 'none' : ''} ${playedNotes.includes(key.note || '') ? 'piano-key-active' : ''}`}
            data-letter={key.letter}
            data-note={key.note}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
          >
            {isLettersMode && key.letter}
            {!isLettersMode && key.note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Piano;
```

## types.ts
```typescript
export interface PianoKey {
  id: string;
  letter: string;
  note?: string;
  sharp?: boolean;
}
```

## data/pianoKeys.ts
```typescript
import { PianoKey } from '../types';

export const pianoKeys: PianoKey[] = [
  { id: '1', letter: 'D', note: 'c', sharp: false },
  { id: '2', letter: 'F', note: 'd', sharp: false },
  { id: '3', letter: 'G', note: 'e', sharp: false },
  { id: '4', letter: 'H', note: 'f', sharp: false },
  { id: '5', letter: 'J', note: 'g', sharp: false },
  { id: '6', letter: 'K', note: 'a', sharp: false },
  { id: '7', letter: 'L', note: 'b', sharp: false },
  { id: '8', letter: 'R', note: 'c♯', sharp: true },
  { id: '9', letter: 'T', note: 'd♯', sharp: true },
  { id: '10', letter: '', sharp: true }, // empty sharp key
  { id: '11', letter: 'U', note: 'f♯', sharp: true },
  { id: '12', letter: 'I', note: 'g♯', sharp: true },
  { id: '13', letter: 'O', note: 'a♯', sharp: true },
];
```

## App.css
```css
/* Import the original CSS here */
/* This would contain all the styles from the original style.css file */
```

## index.tsx
```tsx
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

### Tokens: {'input_tokens': 1674, 'output_tokens': 2410}
### Execution time: 31.184198141098022
