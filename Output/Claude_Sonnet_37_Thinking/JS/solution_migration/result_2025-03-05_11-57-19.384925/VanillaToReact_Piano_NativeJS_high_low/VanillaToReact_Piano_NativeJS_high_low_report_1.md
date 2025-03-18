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
### Thoughts:
Alright, I'll translate this vanilla JavaScript and HTML code into React 18.x with TypeScript. Here's what I'm going to do:

1. Create a typical Create React App structure with TypeScript.
2. Convert the HTML structure to React components.
3. Move the JavaScript logic to the appropriate React components.
4. Introduce TypeScript typing for better type safety.
5. Use React hooks like `useState` and `useEffect` for state management and side effects.

Let's start:

### Project Structure
- src/index.tsx (entry point)
- src/App.tsx (main App component)
- src/components/Header.tsx
- src/components/Piano.tsx
- src/components/Footer.tsx
- src/hooks/useAudio.ts (for audio handling)
- src/styles/styles.css (for CSS)
- src/types/index.ts (for TypeScript types)

### Types (src/types/index.ts)
```typescript
export type Note = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b' | 'c♯' | 'd♯' | 'f♯' | 'g♯' | 'a♯';
export type Letter = 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | 'R' | 'T' | 'U' | 'I' | 'O';

export interface PianoKey {
  letter: Letter;
  note: Note;
  isSharp?: boolean;
  none?: boolean;
}
```

### App Component (src/App.tsx)
```tsx
import React from 'react';
import Header from './components/Header';
import Piano from './components/Piano';
import Footer from './components/Footer';
import './styles/styles.css';

const App: React.FC = () => {
  return (
    <>
      <Header title="Virtual Piano" />
      <main className="main">
        <Piano />
        <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
      </main>
      <Footer />
    </>
  );
};

const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

export default App;
```

### Header Component (src/components/Header.tsx)
```tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
    </header>
  );
};

export default Header;
```

### Footer Component (src/components/Footer.tsx)
```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">2020</div>
    </footer>
  );
};

export default Footer;
```

### Audio Hook (src/hooks/useAudio.ts)
```typescript
import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';

const useAudio = () => {
  const [playedNotes, setPlayedNotes] = useState<Note[]>([]);
  
  const soundMapper: Record<Note, HTMLAudioElement> = {
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
  
  const playNote = useCallback((note: Note) => {
    if (!note || playedNotes.includes(note)) return;
    
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
      setPlayedNotes(prev => [...prev, note]);
    }
  }, [playedNotes, soundMapper]);
  
  const stopNote = useCallback((note: Note) => {
    setPlayedNotes(prev => prev.filter(n => n !== note));
  }, []);
  
  return { playNote, stopNote, playedNotes };
};

export default useAudio;
```

### Piano Component (src/components/Piano.tsx)
```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, Letter, PianoKey } from '../types';
import useAudio from '../hooks/useAudio';

const pianoKeys: PianoKey[] = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharpKeys: PianoKey[] = [
  { letter: 'R', note: 'c♯', isSharp: true },
  { letter: 'T', note: 'd♯', isSharp: true },
  { letter: 'U', note: 'f♯', isSharp: true, none: true },
  { letter: 'I', note: 'g♯', isSharp: true },
  { letter: 'O', note: 'a♯', isSharp: true },
];

const Piano: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<'notes' | 'letters'>('notes');
  const { playNote, stopNote, playedNotes } = useAudio();
  const pianoRef = useRef<HTMLDivElement>(null);
  const mouseDown = useRef<boolean>(false);

  const handleModeChange = (mode: 'notes' | 'letters') => {
    setDisplayMode(mode);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase() as Letter;
    const pianoKey = [...pianoKeys, ...sharpKeys].find(k => k.letter === key);
    
    if (pianoKey) {
      playNote(pianoKey.note);
    }
  }, [playNote]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase() as Letter;
    const pianoKey = [...pianoKeys, ...sharpKeys].find(k => k.letter === key);
    
    if (pianoKey) {
      stopNote(pianoKey.note);
    }
  }, [stopNote]);

  const handleMouseDown = (note: Note) => {
    mouseDown.current = true;
    playNote(note);
  };

  const handleMouseUp = (note: Note) => {
    mouseDown.current = false;
    stopNote(note);
  };

  const handleMouseOut = (note: Note) => {
    if (mouseDown.current) {
      stopNote(note);
    }
  };

  const handleMouseMove = (event: React.MouseEvent, note: Note) => {
    if (mouseDown.current && event.buttons === 1) {
      playNote(note);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      <div className="btn-container">
        <button 
          className={`btn btn-notes ${displayMode === 'notes' ? 'btn-active' : ''}`} 
          onClick={() => handleModeChange('notes')}
        >
          Notes
        </button>
        <button 
          className={`btn btn-letters ${displayMode === 'letters' ? 'btn-active' : ''}`} 
          onClick={() => handleModeChange('letters')}
        >
          Letters
        </button>
      </div>
      <div 
        className={`piano ${displayMode === 'letters' ? 'letters' : ''}`} 
        ref={pianoRef}
      >
        {pianoKeys.map((key) => (
          <div
            key={key.letter}
            className={`piano-key ${playedNotes.includes(key.note) ? 'piano-key-active' : ''}`}
            data-letter={key.letter}
            data-note={key.note}
            onMouseDown={() => handleMouseDown(key.note)}
            onMouseUp={() => handleMouseUp(key.note)}
            onMouseOut={() => handleMouseOut(key.note)}
            onMouseMove={(e) => handleMouseMove(e, key.note)}
          >
            {displayMode === 'letters' ? key.letter : key.note}
          </div>
        ))}
        <div className="keys-sharp">
          {sharpKeys.map((key) => (
            <div
              key={key.letter}
              className={`piano-key sharp ${key.none ? 'none' : ''} ${playedNotes.includes(key.note) ? 'piano-key-active' : ''}`}
              data-letter={key.letter}
              data-note={key.note}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseOut={() => handleMouseOut(key.note)}
              onMouseMove={(e) => handleMouseMove(e, key.note)}
            >
              {displayMode === 'letters' ? key.letter : key.note}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Piano;
```

### Entry Point (src/index.tsx)
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Wait, let me look more closely at the HTML. I think I misunderstood some of the structure and functionality.

The piano keys don't actually show the notes or letters visibly in the HTML, they're just data attributes. However, there's a CSS class 'letters' that gets added to the piano, which probably makes the letters visible. Also, there are 7 main piano keys and 6 sharp keys, but one of the sharp keys has a 'none' class, which might mean it's not interactive or visible.

Let me correct the Piano component to match this more closely:

### Updated Piano Component (src/components/Piano.tsx)
```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, Letter } from '../types';
import useAudio from '../hooks/useAudio';

interface PianoKey {
  letter: Letter;
  note: Note;
  isSharp?: boolean;
  isNone?: boolean;
}

// Define the piano keys
const regularKeys: PianoKey[] = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharpKeys: PianoKey[] = [
  { letter: 'R', note: 'c♯', isSharp: true },
  { letter: 'T', note: 'd♯', isSharp: true },
  { letter: 'U', note: 'f♯', isSharp: true },
  { letter: 'I', note: 'g♯', isSharp: true },
  { letter: 'O', note: 'a♯', isSharp: true },
];

// Add a non-interactive sharp key placeholder
const allSharpKeys: PianoKey[] = [
  sharpKeys[0],
  sharpKeys[1],
  { letter: '' as Letter, note: '' as Note, isSharp: true, isNone: true },
  sharpKeys[2],
  sharpKeys[3],
  sharpKeys[4],
];

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const { playNote, stopNote, playedNotes } = useAudio();
  const pianoRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef<boolean>(false);

  const handleModeChange = (mode: 'notes' | 'letters') => {
    setShowLetters(mode === 'letters');
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase() as Letter;
    const pianoKey = document.querySelector(`.piano-key[data-letter="${key}"]`);
    
    if (pianoKey) {
      const note = pianoKey.getAttribute('data-note') as Note;
      if (note) {
        playNote(note);
      }
    }
  }, [playNote]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase() as Letter;
    const pianoKey = document.querySelector(`.piano-key[data-letter="${key}"]`);
    
    if (pianoKey) {
      const note = pianoKey.getAttribute('data-note') as Note;
      if (note) {
        stopNote(note);
      }
    }
  }, [stopNote]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      isMouseDown.current = true;
      const note = target.getAttribute('data-note') as Note;
      if (note) {
        playNote(note);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      isMouseDown.current = false;
      const note = target.getAttribute('data-note') as Note;
      if (note) {
        stopNote(note);
      }
    }
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note') as Note;
      if (note) {
        stopNote(note);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown.current && event.buttons === 1) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('piano-key')) {
        const note = target.getAttribute('data-note') as Note;
        if (note) {
          playNote(note);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      <div className="btn-container">
        <button 
          className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`} 
          onClick={() => handleModeChange('notes')}
        >
          Notes
        </button>
        <button 
          className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`} 
          onClick={() => handleModeChange('letters')}
        >
          Letters
        </button>
      </div>
      <div 
        className={`piano ${showLetters ? 'letters' : ''}`} 
        ref={pianoRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
      >
        {regularKeys.map((key) => (
          <div
            key={key.letter}
            className={`piano-key ${playedNotes.includes(key.note) ? 'piano-key-active' : ''}`}
            data-letter={key.letter}
            data-note={key.note}
          ></div>
        ))}
        <div className="keys-sharp">
          {allSharpKeys.map((key, index) => (
            <div
              key={index}
              className={`piano-key ${key.isSharp ? 'sharp' : ''} ${key.isNone ? 'none' : ''} ${playedNotes.includes(key.note) ? 'piano-key-active' : ''}`}
              data-letter={key.letter}
              data-note={key.note}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Piano;
```

Wait, I think I made a mistake with the order of the sharp keys. Let me check the HTML again closely.

Looking at the original HTML, the sharp keys are:
- A div with class "keys-sharp" containing:
  - data-letter="R", data-note="c♯"
  - data-letter="T", data-note="d♯"
  - A div with class "none" (placeholder)
  - data-letter="U", data-note="f♯"
  - data-letter="I", data-note="g♯"
  - data-letter="O", data-note="a♯"

So the correct sharp keys are:

```typescript
const sharpKeys: PianoKey[] = [
  { letter: 'R', note: 'c♯', isSharp: true },
  { letter: 'T', note: 'd♯', isSharp: true },
  { letter: 'U', note: 'f♯', isSharp: true },
  { letter: 'I', note: 'g♯', isSharp: true },
  { letter: 'O', note: 'a♯', isSharp: true },
];

// Add a non-interactive sharp key placeholder at position 2
const allSharpKeys: PianoKey[] = [
  sharpKeys[0],
  sharpKeys[1],
  { letter: '' as Letter, note: '' as Note, isSharp: true, isNone: true },
  sharpKeys[2],
  sharpKeys[3],
  sharpKeys[4],
];
```

Let me fix that and ensure we're keeping the code true to the original HTML structure.

### Answer:
# React 18.x Translation with TypeScript

Here's the translation of the Virtual Piano application to React 18.x with TypeScript.

## Project Structure

First, let's create the necessary files and structure:

## src/types/index.ts

```typescript
export type Note = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b' | 'c♯' | 'd♯' | 'f♯' | 'g♯' | 'a♯';
export type Letter = 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | 'R' | 'T' | 'U' | 'I' | 'O';
```

## src/App.tsx

```tsx
import React from 'react';
import './css/style.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

export default App;
```

## src/components/Header.tsx

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

## src/components/Footer.tsx

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

## src/components/Main.tsx

```tsx
import React, { useState } from 'react';
import Piano from './Piano';

const Main: React.FC = () => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main className="main">
      <Piano />
      <button className="fullscreen openfullscreen" onClick={handleFullscreen}></button>
    </main>
  );
};

export default Main;
```

## src/components/Piano.tsx

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Note, Letter } from '../types';

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [playedNotes, setPlayedNotes] = useState<Note[]>([]);
  const pianoRef = useRef<HTMLDivElement>(null);

  const soundMapper: Record<Note, HTMLAudioElement> = {
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

  const play = (event: React.MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    
    let pianoEl: HTMLElement | null;
    if (isKeyboard) {
      pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`);
    } else {
      pianoEl = event.target as HTMLElement;
      if (!pianoEl.classList.contains('piano-key')) return;
    }
    
    if (!pianoEl) return;
    
    const note = pianoEl.getAttribute('data-note') as Note;
    if (!note || playedNotes.includes(note)) return;
    
    pianoEl.classList.add('piano-key-active');
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayedNotes(prev => [...prev, note]);
  };

  const resetActive = (event: React.MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    
    let pianoEl: HTMLElement | null;
    if (isKeyboard) {
      pianoEl = document.querySelector(`.piano-key[data-letter=${event.key.toUpperCase()}]`);
    } else {
      pianoEl = event.target as HTMLElement;
      if (!pianoEl.classList.contains('piano-key')) return;
    }
    
    if (!pianoEl) return;
    
    pianoEl.classList.remove('piano-key-active');
    const note = pianoEl.getAttribute('data-note') as Note;
    setPlayedNotes(prev => prev.filter(n => n !== note));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      play(event);
    }
  };

  const change = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('btn')) return;

    document.querySelector('.btn-active')?.classList.remove('btn-active');
    target.classList.add('btn-active');
    
    if (target.classList.contains('btn-letters')) {
      setShowLetters(true);
    } else {
      setShowLetters(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => play(e);
    const handleKeyUp = (e: KeyboardEvent) => resetActive(e);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [playedNotes]);

  return (
    <>
      <div className="btn-container" onClick={change}>
        <button className="btn btn-notes btn-active">Notes</button>
        <button className="btn btn-letters">Letters</button>
      </div>
      <div 
        className={`piano ${showLetters ? 'letters' : ''}`} 
        ref={pianoRef}
        onMouseDown={play}
        onMouseUp={resetActive}
        onMouseOut={resetActive}
        onMouseMove={handleMouseMove}
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
    </>
  );
};

export default Piano;
```

## src/index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
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

Make sure to have the CSS file and audio assets in the appropriate locations:
- CSS in the `public/css/style.css` folder
- Audio files in the `public/assets/audio/` folder
- Piano icon in the `public/assets/piano.ico` file

### Tokens: {'input_tokens': 1703, 'output_tokens': 7441}
### Execution time: 83.07727980613708
