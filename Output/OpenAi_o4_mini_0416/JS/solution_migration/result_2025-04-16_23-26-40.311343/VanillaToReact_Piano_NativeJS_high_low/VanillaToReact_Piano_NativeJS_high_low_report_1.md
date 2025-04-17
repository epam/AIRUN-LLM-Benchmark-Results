I have the following application code that needs to migrate:

<source_code>
```html
// index.html
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

```js
// script.js
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

</source_code>

Please follow these steps:

1. Migrate the provided vanilla JavaScript application to React 18:
   - Use Create React App with TypeScript configuration
   - Implement strict TypeScript typing throughout the application
   - Preserve all existing functionality and behavior

2. Component Structure:
   - Create appropriate functional components with React hooks
   - Implement proper state management for UI interactions
   - Ensure event handling follows React patterns

3. Audio Implementation:
   - Properly handle audio resources in the React environment
   - Implement audio playback with appropriate React lifecycle considerations
   - Maintain the existing audio mapping structure with TypeScript interfaces

4. Event Handling:
   - Convert DOM event listeners to React synthetic events
   - Implement keyboard event handling at appropriate component levels
   - Ensure mouse interactions work identically to the original implementation

5. UI State Management:
   - Implement state for active keys and button selections
   - Ensure proper class toggling for visual feedback
   - Maintain the Notes/Letters toggle functionality

6. Fullscreen Functionality:
   - Implement the fullscreen toggle using React patterns
   - Handle browser compatibility for fullscreen API

7. Styling Requirements:
   - Preserve all CSS classes and styling behavior
   - Implement conditional class application using React patterns
   - Maintain responsive design aspects

8. Optimization:
   - Implement performance optimizations where appropriate
   - Use React.memo or other techniques to prevent unnecessary re-renders
   - Ensure efficient event handling for piano key interactions

9. Code Quality:
   - Follow React best practices and patterns
   - Ensure code is clean, readable, and maintainable
   - No TODOs should be present in the final code

## Run 1:
### Answer:
Below is a complete “drop‐in” React 18 + TypeScript version of your vanilla‐JS piano. It was bootstrapped with:

```
npx create-react-app virtual-piano --template typescript
```

– Audio files and piano.ico go into public/assets/…  
– Your existing CSS (style.css) can be copied into src/css/style.css and imported once in index.tsx.  

---

⏹ public/index.html  
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/assets/piano.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>virtual-piano</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

⏹ src/index.tsx  
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/style.css';        // your original CSS
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

⏹ src/types.ts  
```ts
// strict TS types
export type Note =
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'a'
  | 'b'
  | 'c♯'
  | 'd♯'
  | 'f♯'
  | 'g♯'
  | 'a♯';

export interface KeyData {
  letter?: string;
  note?: Note;
  none?: boolean;
}
```

⏹ src/utils.ts  
```ts
import { Note, KeyData } from './types';

// Base URL so that Vite/CRA/public folder works
const BASE = process.env.PUBLIC_URL || '';

export const SOUND_MAP: Record<Note, HTMLAudioElement> = {
  c: new Audio(`${BASE}/assets/audio/a.mp3`),
  d: new Audio(`${BASE}/assets/audio/d.mp3`),
  e: new Audio(`${BASE}/assets/audio/e.mp3`),
  f: new Audio(`${BASE}/assets/audio/f.mp3`),
  g: new Audio(`${BASE}/assets/audio/g.mp3`),
  a: new Audio(`${BASE}/assets/audio/a.mp3`),
  b: new Audio(`${BASE}/assets/audio/b.mp3`),
  'c♯': new Audio(`${BASE}/assets/audio/c♯.mp3`),
  'd♯': new Audio(`${BASE}/assets/audio/d♯.mp3`),
  'f♯': new Audio(`${BASE}/assets/audio/f♯.mp3`),
  'g♯': new Audio(`${BASE}/assets/audio/g♯.mp3`),
  'a♯': new Audio(`${BASE}/assets/audio/a♯.mp3`),
};

// white keys in left‑to‑right order
export const WHITE_KEYS: KeyData[] = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

// black keys (note the "none" placeholder)
export const BLACK_KEYS: KeyData[] = [
  { letter: 'R', note: 'c♯' },
  { letter: 'T', note: 'd♯' },
  { none: true },
  { letter: 'U', note: 'f♯' },
  { letter: 'I', note: 'g♯' },
  { letter: 'O', note: 'a♯' },
];

// quick lookup for keyboard letters → Note
export const LETTER_TO_NOTE: Record<string, Note> = {
  D: 'c',
  F: 'd',
  G: 'e',
  H: 'f',
  J: 'g',
  K: 'a',
  L: 'b',
  R: 'c♯',
  T: 'd♯',
  U: 'f♯',
  I: 'g♯',
  O: 'a♯',
};
```

⏹ src/App.tsx  
```tsx
import React, { useState, useEffect, useCallback } from 'react';
import ToggleButtons from './ToggleButtons';
import Piano from './Piano';
import FullscreenButton from './FullscreenButton';
import { Note } from './types';
import { SOUND_MAP, LETTER_TO_NOTE } from './utils';

const App: React.FC = () => {
  // toggle labels vs. notes
  const [showLetters, setShowLetters] = useState(false);
  // currently pressed notes
  const [activeNotes, setActiveNotes] = useState<Note[]>([]);

  // play a note (if not already playing)
  const handlePlay = useCallback((note: Note) => {
    setActiveNotes(prev => {
      if (prev.includes(note)) return prev;
      const snd = SOUND_MAP[note];
      snd.currentTime = 0;
      snd.play();
      return [...prev, note];
    });
  }, []);

  // release a note
  const handleReset = useCallback((note: Note) => {
    setActiveNotes(prev => prev.filter(n => n !== note));
  }, []);

  // handle keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const note = LETTER_TO_NOTE[key];
      if (note) handlePlay(note);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const note = LETTER_TO_NOTE[key];
      if (note) handleReset(note);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handlePlay, handleReset]);

  return (
    <>
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <ToggleButtons
          showLetters={showLetters}
          onToggle={letters => setShowLetters(letters)}
        />
        <Piano
          showLetters={showLetters}
          activeNotes={activeNotes}
          onPlay={handlePlay}
          onReset={handleReset}
        />
        <FullscreenButton />
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </>
  );
};

export default App;
```

⏹ src/ToggleButtons.tsx  
```tsx
import React from 'react';

interface ToggleButtonsProps {
  showLetters: boolean;
  onToggle: (letters: boolean) => void;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = React.memo(
  ({ showLetters, onToggle }) => (
    <div className="btn-container">
      <button
        type="button"
        className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
        onClick={() => onToggle(false)}
      >
        Notes
      </button>
      <button
        type="button"
        className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
        onClick={() => onToggle(true)}
      >
        Letters
      </button>
    </div>
  )
);

export default ToggleButtons;
```

⏹ src/Piano.tsx  
```tsx
import React from 'react';
import Key from './Key';
import { Note } from './types';
import { WHITE_KEYS, BLACK_KEYS } from './utils';

interface PianoProps {
  showLetters: boolean;
  activeNotes: Note[];
  onPlay: (note: Note) => void;
  onReset: (note: Note) => void;
}

const Piano: React.FC<PianoProps> = React.memo(
  ({ showLetters, activeNotes, onPlay, onReset }) => (
    <div className={`piano ${showLetters ? 'letters' : ''}`}>
      {WHITE_KEYS.map((k, i) => (
        <Key
          key={`w${i}`}
          letter={k.letter}
          note={k.note!}
          active={activeNotes.includes(k.note!)}
          onPlay={onPlay}
          onReset={onReset}
          sharp={false}
          none={false}
        />
      ))}
      <div className="keys-sharp">
        {BLACK_KEYS.map((k, i) => (
          <Key
            key={`b${i}`}
            letter={k.letter}
            note={k.note!}
            active={k.note ? activeNotes.includes(k.note) : false}
            onPlay={onPlay}
            onReset={onReset}
            sharp
            none={!!k.none}
          />
        ))}
      </div>
    </div>
  )
);

export default Piano;
```

⏹ src/Key.tsx  
```tsx
import React from 'react';
import { Note } from './types';

interface KeyProps {
  letter?: string;
  note?: Note;
  active: boolean;
  onPlay: (note: Note) => void;
  onReset: (note: Note) => void;
  sharp: boolean;
  none: boolean;
}

const Key: React.FC<KeyProps> = React.memo(
  ({ letter, note, active, onPlay, onReset, sharp, none }) => {
    const classList = ['piano-key'];
    if (sharp) classList.push('sharp');
    if (none) classList.push('none');
    if (active) classList.push('piano-key-active');

    const handleMouseDown = () => note && onPlay(note);
    const handleMouseUp = () => note && onReset(note);
    const handleMouseLeave = () => note && onReset(note);
    const handleMouseEnter = (e: React.MouseEvent) => {
      if (note && e.buttons === 1) onPlay(note);
    };

    return (
      <div
        className={classList.join(' ')}
        data-letter={letter}
        data-note={note}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      />
    );
  }
);

export default Key;
```

⏹ src/FullscreenButton.tsx  
```tsx
import React from 'react';

const FullscreenButton: React.FC = React.memo(() => {
  const toggleFS = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <button
      type="button"
      className="fullscreen openfullscreen"
      onClick={toggleFS}
    />
  );
});

export default FullscreenButton;
```

---

Highlights & notes:

• We kept all your CSS class‑names exactly the same – styling is untouched.  
• Audio objects are instantiated once (in utils.ts) and re‑used.  
• State is fully typed with TypeScript, with no `any`.  
• Keyboard listeners are installed/uninstalled in a `useEffect`.  
• Mouse events on each key faithfully replicate down/up/out/drag behavior.  
• We use `React.memo` on leaf components to avoid needless re‑renders.  
• Fullscreen API is invoked via standard browser calls, with error‐catches.  

You should now have a drop‑in TSX application with identical functionality to your original vanilla JS.

### Tokens: {'input_tokens': 1669, 'output_tokens': 10896, 'reasoning_tokens': 8256}
### Execution time: 84.39077091217041
