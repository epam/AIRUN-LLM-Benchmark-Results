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
Okay, I will migrate your vanilla JavaScript piano application to React 18 with TypeScript.

Here's a breakdown of the steps and the resulting code:

**1. Project Setup (Manual Steps):**

*   Use Create React App with TypeScript:
    ```bash
    npx create-react-app virtual-piano-react --template typescript
    cd virtual-piano-react
    ```
*   **Public Assets:**
    *   Create `public/assets/` folder.
    *   Copy `piano.ico` into `public/assets/`.
    *   Create `public/assets/audio/` folder.
    *   Copy all your `.mp3` audio files (e.g., `a.mp3`, `d.mp3`, `c♯.mp3`, etc.) into `public/assets/audio/`.
*   **CSS:**
    *   Copy the content of your existing `style.css` into `src/App.css`.
*   **Update `public/index.html`:**
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/assets/piano.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Virtual Piano application created with React"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        
        <link href="https://fonts.gstatic.com" rel="preconnect">
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
          rel="stylesheet">
        
        <title>Virtual Piano</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
      </body>
    </html>
    ```

**2. Code Implementation:**

Create the following files with the specified content:

**`src/types.ts`**
```typescript
export type Note = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b' | 'c♯' | 'd♯' | 'f♯' | 'g♯' | 'a♯';
export type Letter = 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | 'R' | 'T' | 'U' | 'I' | 'O';
export type DisplayMode = 'notes' | 'letters';

export interface PianoKeyConfig {
  note: Note;
  letter: Letter;
  isSharp?: boolean;
}

export interface PianoKeyConfigOptional {
  note?: Note;
  letter?: Letter;
  isSharp?: boolean;
  isNone?: boolean; // For the placeholder sharp key
}
```

**`src/pianoConfig.ts`**
```typescript
import { PianoKeyConfig, PianoKeyConfigOptional, Note, Letter } from './types';

export const whiteKeysConfig: PianoKeyConfig[] = [
  { note: 'c' as Note, letter: 'D' as Letter },
  { note: 'd' as Note, letter: 'F' as Letter },
  { note: 'e' as Note, letter: 'G' as Letter },
  { note: 'f' as Note, letter: 'H' as Letter },
  { note: 'g' as Note, letter: 'J' as Letter },
  { note: 'a' as Note, letter: 'K' as Letter },
  { note: 'b' as Note, letter: 'L' as Letter },
];

export const sharpKeysConfig: PianoKeyConfigOptional[] = [
  { note: 'c♯' as Note, letter: 'R' as Letter, isSharp: true },
  { note: 'd♯' as Note, letter: 'T' as Letter, isSharp: true },
  { isNone: true, isSharp: true }, // Placeholder for styling
  { note: 'f♯' as Note, letter: 'U' as Letter, isSharp: true },
  { note: 'g♯' as Note, letter: 'I' as Letter, isSharp: true },
  { note: 'a♯' as Note, letter: 'O' as Letter, isSharp: true },
];

// For keyboard event mapping
const allPlayableKeys = [
    ...whiteKeysConfig,
    ...sharpKeysConfig.filter(key => !key.isNone) as PianoKeyConfig[]
];

export const letterToNoteMap = new Map<Letter, Note>();
allPlayableKeys.forEach(key => {
  letterToNoteMap.set(key.letter, key.note);
});
```

**`src/useAudio.ts`**
```typescript
import { Note } from './types';

// Paths are relative to the public folder.
// IMPORTANT: This mapping is taken directly from your original script.js.
// Note 'c' and 'a' both map to 'a.mp3'. If this is a typo and you have 'c.mp3',
// update the path for 'c' accordingly.
const audioFiles: Record<Note, string> = {
    c: '/assets/audio/a.mp3', // Original: maps to a.mp3
    d: '/assets/audio/d.mp3',
    e: '/assets/audio/e.mp3',
    f: '/assets/audio/f.mp3',
    g: '/assets/audio/g.mp3',
    a: '/assets/audio/a.mp3', // Original: maps to a.mp3
    b: '/assets/audio/b.mp3',
    'c♯': '/assets/audio/c♯.mp3',
    'd♯': '/assets/audio/d♯.mp3',
    'f♯': '/assets/audio/f♯.mp3',
    'g♯': '/assets/audio/g♯.mp3',
    'a♯': '/assets/audio/a♯.mp3',
};

// Create Audio objects once, globally
const globalSoundMapper: Record<Note, HTMLAudioElement> = (() => {
  const mapper: Partial<Record<Note, HTMLAudioElement>> = {};
  for (const noteKey in audioFiles) {
    const note = noteKey as Note;
    if (Object.prototype.hasOwnProperty.call(audioFiles, note)) {
      const audio = new Audio(audioFiles[note]);
      audio.preload = 'auto'; // Preload audio files
      mapper[note] = audio;
    }
  }
  return mapper as Record<Note, HTMLAudioElement>;
})();

export const useAudio = () => {
  const playSound = (note: Note) => {
    const sound = globalSoundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error(`Error playing sound for note ${note}:`, error));
    } else {
      console.warn(`Audio for note ${note} not found.`);
    }
  };

  return { playSound };
};
```

**`src/components/Header.tsx`**
```typescript
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

**`src/components/Footer.tsx`**
```typescript
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

**`src/components/Controls.tsx`**
```typescript
import React from 'react';
import { DisplayMode } from '../types';

interface ControlsProps {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

const Controls: React.FC<ControlsProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="btn-container">
      <button
        className={`btn btn-notes ${currentMode === 'notes' ? 'btn-active' : ''}`}
        onClick={() => onModeChange('notes')}
      >
        Notes
      </button>
      <button
        className={`btn btn-letters ${currentMode === 'letters' ? 'btn-active' : ''}`}
        onClick={() => onModeChange('letters')}
      >
        Letters
      </button>
    </div>
  );
};

export default Controls;
```

**`src/components/FullscreenButton.tsx`**
```typescript
import React from 'react';

interface FullscreenButtonProps {
  isFullscreen: boolean; // This prop can be used to change styles if needed
  onClick: () => void;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ isFullscreen, onClick }) => {
  return (
    <button
      className="fullscreen openfullscreen" // Matches original static class
      onClick={onClick}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    />
  );
};

export default FullscreenButton;
```

**`src/components/PianoKey.tsx`**
```typescript
import React from 'react';
import { Note, Letter } from '../types';

interface PianoKeyProps {
  note?: Note;
  letter?: Letter;
  isSharp?: boolean;
  isNone?: boolean;
  isActive: boolean;
  onPlay: (note: Note) => void;
  onRelease: (note: Note) => void;
  isMousePressedRef: React.RefObject<boolean>;
}

const PianoKey: React.FC<PianoKeyProps> = React.memo(({
  note,
  letter,
  isSharp = false,
  isNone = false,
  isActive,
  onPlay,
  onRelease,
  isMousePressedRef,
}) => {
  if (isNone) {
    return <div className="piano-key sharp none"></div>;
  }

  // Should not happen for playable keys if config is correct
  if (!note || !letter) return null; 

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    onPlay(note);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    onRelease(note);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    if (isMousePressedRef.current && isActive) {
       onRelease(note);
    }
  };
  
  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isMousePressedRef.current) {
      onPlay(note);
    }
  };

  const keyClasses = [
    'piano-key',
    isSharp ? 'sharp' : '',
    isActive ? 'piano-key-active' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={keyClasses}
      data-note={note} // Used by CSS for displaying text
      data-letter={letter} // Used by CSS for displaying text
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    />
  );
});

export default PianoKey;
```

**`src/components/Piano.tsx`**
```typescript
import React from 'react';
import { Note, DisplayMode } from '../types';
import { whiteKeysConfig, sharpKeysConfig } from '../pianoConfig';
import PianoKey from './PianoKey';

interface PianoProps {
  activeNotes: Set<Note>;
  displayMode: DisplayMode;
  onPlayNote: (note: Note) => void;
  onReleaseNote: (note: Note) => void;
  isMousePressedRef: React.RefObject<boolean>;
}

const Piano: React.FC<PianoProps> = ({
  activeNotes,
  displayMode,
  onPlayNote,
  onReleaseNote,
  isMousePressedRef,
}) => {

  const handlePianoMouseLeave = () => {
    // If mouse leaves the entire piano area while a button is pressed, release all active notes.
    // This replicates the behavior of mouseout on the main piano div if it were to release active notes.
    if (isMousePressedRef.current) {
      activeNotes.forEach(note => onReleaseNote(note));
    }
  };

  return (
    <div
      className={`piano ${displayMode === 'letters' ? 'letters' : ''}`}
      onMouseLeave={handlePianoMouseLeave} 
      // onMouseDown, onMouseUp on the piano div itself are not strictly needed
      // as PianoKey handles its own events, and App handles global mouse state.
    >
      {whiteKeysConfig.map(keyConfig => (
        <PianoKey
          key={keyConfig.note}
          note={keyConfig.note}
          letter={keyConfig.letter}
          isActive={activeNotes.has(keyConfig.note)}
          onPlay={onPlayNote}
          onRelease={onReleaseNote}
          isMousePressedRef={isMousePressedRef}
        />
      ))}
      <div className="keys-sharp">
        {sharpKeysConfig.map((keyConfig, index) => (
          <PianoKey
            key={keyConfig.note || `sharp-none-${index}`}
            note={keyConfig.note}
            letter={keyConfig.letter}
            isSharp={keyConfig.isSharp}
            isNone={keyConfig.isNone}
            isActive={!!keyConfig.note && activeNotes.has(keyConfig.note)}
            onPlay={onPlayNote}
            onRelease={onReleaseNote}
            isMousePressedRef={isMousePressedRef}
          />
        ))}
      </div>
    </div>
  );
};

export default Piano;
```

**`src/App.tsx`**
```typescript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css'; // Your styles

import Header from './components/Header';
import Footer from './components/Footer';
import Controls from './components/Controls';
import Piano from './components/Piano';
import FullscreenButton from './components/FullscreenButton';

import { useAudio } from './useAudio';
import { DisplayMode, Note, Letter } from './types';
import { letterToNoteMap } from './pianoConfig';

const App: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('notes');
  const [activeNotes, setActiveNotes] = useState<Set<Note>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!document.fullscreenElement);
  
  const { playSound } = useAudio();
  const isMousePressedRef = useRef<boolean>(false);
  const activeNotesRef = useRef<Set<Note>>(activeNotes);

  useEffect(() => {
    activeNotesRef.current = activeNotes;
  }, [activeNotes]);

  const handlePlayNote = useCallback((note: Note) => {
    if (!activeNotesRef.current.has(note)) {
      playSound(note);
      setActiveNotes(prev => new Set(prev).add(note));
    }
  }, [playSound]); // setActiveNotes is stable

  const handleReleaseNote = useCallback((note: Note) => {
    if (activeNotesRef.current.has(note)) {
      setActiveNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }
  }, []); // setActiveNotes is stable

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = letterToNoteMap.get(event.key.toUpperCase() as Letter);
      if (note) {
        event.preventDefault();
        handlePlayNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = letterToNoteMap.get(event.key.toUpperCase() as Letter);
      if (note) {
        event.preventDefault();
        handleReleaseNote(note);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePlayNote, handleReleaseNote]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);    // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);     // IE/Edge
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const setMousePressed = () => { isMousePressedRef.current = true; };
    const setMouseReleased = () => { 
      isMousePressedRef.current = false;
      // Optional: If any notes are stuck active from mouse drag after mouse up globally, release them.
      // This can happen if mouseup occurs outside the window or an iframe.
      // activeNotesRef.current.forEach(note => handleReleaseNote(note)); // This might be too aggressive. Test behavior.
    };

    window.addEventListener('mousedown', setMousePressed);
    window.addEventListener('mouseup', setMouseReleased);

    return () => {
      window.removeEventListener('mousedown', setMousePressed);
      window.removeEventListener('mouseup', setMouseReleased);
    };
  }, []); // handleReleaseNote could be a dependency if used in setMouseReleased

  return (
    <>
      <Header />
      <main className="main">
        <Controls
          currentMode={displayMode}
          onModeChange={setDisplayMode}
        />
        <Piano
          activeNotes={activeNotes}
          displayMode={displayMode}
          onPlayNote={handlePlayNote}
          onReleaseNote={handleReleaseNote}
          isMousePressedRef={isMousePressedRef}
        />
        <FullscreenButton
          isFullscreen={isFullscreen}
          onClick={toggleFullscreen}
        />
      </main>
      <Footer />
    </>
  );
};

export default App;
```

**`src/index.tsx` (ensure App.css is imported if not in App.tsx)**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
// If App.css is not imported in App.tsx, import it here:
// import './App.css'; 
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

**3. Final Steps:**

*   Ensure your `src/App.css` contains all the styles from the original `style.css`. The component structure and class names are designed to match the original HTML, so the styles should apply correctly.
*   Place all audio files (e.g., `a.mp3`, `c♯.mp3`) in `public/assets/audio/`.
*   Place `piano.ico` in `public/assets/`.
*   Run the application: `npm start` or `yarn start`.

This migration preserves the functionality and structure of your original application while leveraging React 18 features, TypeScript for type safety, and React best practices for component design and state management. The audio handling is optimized to create `Audio` objects once, and event handling is translated to React's synthetic events and hooks. Performance optimizations like `React.memo` and careful `useCallback` usage are included.

### Tokens: {'input_tokens': 1815, 'output_tokens': 4927}
### Execution time: 185.70910620689392
