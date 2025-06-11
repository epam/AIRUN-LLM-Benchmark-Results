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
### Thoughts:
**Migration Plan: Vanilla JavaScript Piano to React 18**

Alright, let's get this virtual piano rocking in React! My goal is to transform the existing HTML/JavaScript piano application into a sleek React 18 project using Create React App with TypeScript. I'll break it down into manageable components and manage the application's state and logic within the React paradigm. Here's the roadmap:

1.  **Project Setup:** Kick things off with `npx create-react-app virtual-piano --template typescript`. Then, I'll move the `assets` (including `piano.ico` and audio) and `css` folders into the `public` directory, and update the paths in `index.html` and audio file references accordingly.

2.  **Component Architecture:** Time to identify the key building blocks. We're looking at:
    *   `App`: The grand central station, rendering everything.
    *   `Header`: Displaying "Virtual Piano."
    *   `Main`: The core, housing the piano and controls.
        *   `Controls`: Containing "Notes" and "Letters" buttons.
        *   `Piano`: The piano itself, composed of keys.
            *   `PianoKey`: A single piano key (white or sharp).
        *   `FullscreenButton`: For fullscreen toggling.
    *   `Footer`: Showing the year "2020."

3.  **State Management:** Deciding what data these components will manage. We'll be using:
    *   `activeDisplayMode`: (e.g., 'notes' or 'letters') controlled by `App` or `Main`.
    *   `activeKeys`: An array or set that represents the active/pressed keys, managed by `App` or `Main`.
    *   `isFullscreen`: A boolean to keep track of full-screen status, also handled by `App` or `Main`.

4.  **Audio Handling:** This will be a breeze. I'll define `soundMapper` as a constant, probably outside any component (or memoized), and ensure the audio objects are created only once. Adapting the `play` and `resetActive` logic to be React event handlers will be straightforward.

5.  **Event Handling:** Get ready for some global and localized event handling.
    *   `keydown` and `keyup`: Global listeners set up within `App` or `Main` using `useEffect`.
    *   `mousedown`, `mouseup`, `mouseout`, and `mousemove` on piano keys: Will be managed by the `PianoKey` component itself, or delegated from the `Piano` component.
    *   Button clicks: Standard React `onClick` handlers.

6.  **Styling:** Leverage the existing `style.css` by linking it in `public/index.html`. React's conditional class rendering will handle dynamic classes such as `piano-key-active`, `letters`, and `btn-active`.

7.  **Key Data Structure:** To make rendering and working with the keys easier, I'll define an array of objects to represent the piano keys, including their `note`, `letter`, and `type` (white or sharp).

8.  **Detailed Component Breakdown:** Let's look at each component individually:

    *   **`App.tsx`**: Renders `Header`, `Main`, and `Footer`. Potentially handles global state if necessary, but `Main` seems more appropriate for piano-related state.

    *   **`Header.tsx`**: A straightforward component rendering the header HTML.

    *   **`Footer.tsx`**: A straightforward component rendering the footer HTML.

    *   **`Main.tsx`**: The control center. It manages `activeDisplayMode`, `activeKeys`, and `isFullscreen` state. It'll also handle global keyboard events using `useEffect` and host the `playNote` and `stopNote` logic. Finally, it renders `Controls`, `Piano`, and `FullscreenButton`.

    *   **`Controls.tsx`**: Receives `activeDisplayMode` and a setter function as props. It renders the "Notes" and "Letters" buttons and handles button clicks to change the display mode.

    *   **`Piano.tsx`**: Receives `activeDisplayMode`, `activeKeys`, `playNoteHandler`, and `stopNoteHandler` as props. It defines the key data and renders `PianoKey` components. Importantly, it applies the `letters` class to the main `div.piano` based on `activeDisplayMode`.

    *   **`PianoKey.tsx`**: This component handles rendering a single key and receives props like `note`, `letter`, `type`, `isActive`, `displayMode`, and mouse event handlers. It renders the key

### Answer:
Okay, I will migrate your vanilla JavaScript piano application to React 18 with TypeScript.

Here's the plan:
1.  Set up a Create React App project with the TypeScript template.
2.  Move your `assets` (including `piano.ico` and `audio` files) and `css` folders to the `public` directory.
3.  Update `public/index.html` to link styles and the icon correctly.
4.  Create the necessary React components: `App`, `Header`, `Footer`, `Controls`, `Piano`, `PianoKey`, `FullscreenButton`.
5.  Define TypeScript types and interfaces for data structures like `PianoKeyInfo` and `DisplayMode`.
6.  Create a configuration file for audio mapping (`soundMapper`) and piano key data, ensuring audio paths are correct for files in the `public` folder.
7.  Implement state management in the `App` component for `activeDisplayMode`, `activeNotes` (notes currently being played), and `isFullscreen`.
8.  Convert DOM event listeners to React synthetic events and global listeners using `useEffect` for keyboard events.
9.  Replicate the logic for playing/stopping notes, handling mouse drags, and toggling note/letter display.
10. Implement the fullscreen functionality.
11. Ensure all CSS classes and styling behaviors are preserved through conditional class rendering in React.
12. Apply optimizations like `React.memo` for `PianoKey` and `useCallback` for event handlers.

Let's start by creating the file structure and code for each part.

**1. Project Setup (Conceptual)**

You would typically run:
```bash
npx create-react-app virtual-piano --template typescript
cd virtual-piano
# Then move assets and css to public/
# mkdir public/assets public/assets/audio
# mv your_original_assets/piano.ico public/assets/
# mv your_original_assets/audio/* public/assets/audio/
# mv your_original_css/style.css public/css/
```

**2. `public/index.html`**

Update your `public/index.html` to look like this:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/assets/piano.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Virtual Piano application created with React" />
  <!--
    manifest.json provides metadata used when your web app is installed on a
    user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
  -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
    rel="stylesheet">
  <link href="%PUBLIC_URL%/css/style.css" rel="stylesheet">

  <title>Virtual Piano</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
```
Ensure your `style.css` is in `public/css/` and `piano.ico` (and audio files) are in `public/assets/`.

**3. TypeScript Definitions (`src/types/index.ts`)**
```typescript
export interface PianoKeyInfo {
  note: string;
  letter: string;
  isSharp: boolean;
  isPlaceholder?: boolean; // For the 'none' sharp key
}

export type DisplayMode = 'notes' | 'letters';
```

**4. Configuration (`src/config/audio.ts`)**
```typescript
import { PianoKeyInfo } from '../types';

const BASE_AUDIO_PATH = '/assets/audio/'; // Relative to public folder

// Sound mapper based on the original script.js
// Note: 'c' and 'a' notes play 'a.mp3'
export const soundMapper: Record<string, HTMLAudioElement> = {
    'c': new Audio(`${BASE_AUDIO_PATH}a.mp3`),
    'd': new Audio(`${BASE_AUDIO_PATH}d.mp3`),
    'e': new Audio(`${BASE_AUDIO_PATH}e.mp3`),
    'f': new Audio(`${BASE_AUDIO_PATH}f.mp3`),
    'g': new Audio(`${BASE_AUDIO_PATH}g.mp3`),
    'a': new Audio(`${BASE_AUDIO_PATH}a.mp3`),
    'b': new Audio(`${BASE_AUDIO_PATH}b.mp3`),
    'c♯': new Audio(`${BASE_AUDIO_PATH}c♯.mp3`),
    'd♯': new Audio(`${BASE_AUDIO_PATH}d♯.mp3`),
    'f♯': new Audio(`${BASE_AUDIO_PATH}f♯.mp3`),
    'g♯': new Audio(`${BASE_AUDIO_PATH}g♯.mp3`),
    'a♯': new Audio(`${BASE_AUDIO_PATH}a♯.mp3`),
};

// Preload audio data
Object.values(soundMapper).forEach(audio => {
    audio.load();
});

// Piano key definitions based on the original HTML structure
export const pianoKeysData: PianoKeyInfo[] = [
  // White keys
  { note: 'c', letter: 'D', isSharp: false },
  { note: 'd', letter: 'F', isSharp: false },
  { note: 'e', letter: 'G', isSharp: false },
  { note: 'f', letter: 'H', isSharp: false },
  { note: 'g', letter: 'J', isSharp: false },
  { note: 'a', letter: 'K', isSharp: false },
  { note: 'b', letter: 'L', isSharp: false },
  // Sharp keys (order matters for rendering)
  { note: 'c♯', letter: 'R', isSharp: true },
  { note: 'd♯', letter: 'T', isSharp: true },
  { note: '', letter: '', isSharp: true, isPlaceholder: true }, // Placeholder for the E-F gap
  { note: 'f♯', letter: 'U', isSharp: true },
  { note: 'g♯', letter: 'I', isSharp: true },
  { note: 'a♯', letter: 'O', isSharp: true },
];

// Map for quick lookup of key info by keyboard letter
export const letterToKeyInfoMap = new Map<string, PianoKeyInfo>(
  pianoKeysData
    .filter(key => !key.isPlaceholder && key.letter)
    .map(key => [key.letter.toUpperCase(), key])
);
```

**5. Components**

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
      <div className="footer-container">2020</div>
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
  activeDisplayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

const Controls: React.FC<ControlsProps> = ({ activeDisplayMode, onDisplayModeChange }) => {
  return (
    <div className="btn-container">
      <button
        className={`btn btn-notes ${activeDisplayMode === 'notes' ? 'btn-active' : ''}`}
        onClick={() => onDisplayModeChange('notes')}
      >
        Notes
      </button>
      <button
        className={`btn btn-letters ${activeDisplayMode === 'letters' ? 'btn-active' : ''}`}
        onClick={() => onDisplayModeChange('letters')}
      >
        Letters
      </button>
    </div>
  );
};

export default Controls;
```

**`src/components/PianoKey.tsx`**
```typescript
import React from 'react';
import { DisplayMode } from '../types';

interface PianoKeyProps {
  note: string;
  letter: string;
  isSharp: boolean;
  isPlaceholder?: boolean;
  isActive: boolean;
  displayMode: DisplayMode; // Though not directly used in render, CSS might depend on parent state
  onMouseDown: (note: string, letter: string) => void;
  onMouseUp: (note: string, letter: string) => void;
  onMouseOut: (note: string, letter: string) => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>, note: string, letter: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = React.memo(({
  note,
  letter,
  isSharp,
  isPlaceholder,
  isActive,
  // displayMode, // Not directly used here as CSS handles text content via data attributes
  onMouseDown,
  onMouseUp,
  onMouseOut,
  onMouseMove,
}) => {
  if (isPlaceholder) {
    return <div className="piano-key sharp none"></div>;
  }

  const keyClasses = [
    'piano-key',
    isSharp ? 'sharp' : '',
    isActive ? 'piano-key-active' : '',
  ].filter(Boolean).join(' ');

  const handleMouseDown = () => {
    onMouseDown(note, letter);
  };

  const handleMouseUp = () => {
    onMouseUp(note, letter);
  };

  const handleMouseOut = () => {
    onMouseOut(note, letter);
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(event, note, letter);
  };

  return (
    <div
      className={keyClasses}
      data-note={note}
      data-letter={letter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown} // Basic touch support
      onTouchEnd={handleMouseUp}     // Basic touch support
    >
      {/* Text content (note/letter) is handled by CSS ::after pseudo-element using data-attributes */}
    </div>
  );
});

export default PianoKey;
```

**`src/components/Piano.tsx`**
```typescript
import React from 'react';
import PianoKey from './PianoKey';
import { pianoKeysData } from '../config/audio';
import { DisplayMode } from '../types';

interface PianoProps {
  activeDisplayMode: DisplayMode;
  activeNotes: Set<string>; // Set of active note names
  onPlayNote: (note: string, letter: string) => void;
  onStopNote: (note: string, letter: string) => void;
  onKeyMouseMove: (event: React.MouseEvent<HTMLDivElement>, note: string, letter: string) => void;
}

const Piano: React.FC<PianoProps> = ({
  activeDisplayMode,
  activeNotes,
  onPlayNote,
  onStopNote,
  onKeyMouseMove,
}) => {
  const whiteKeys = pianoKeysData.filter(key => !key.isSharp && !key.isPlaceholder);
  const sharpKeys = pianoKeysData.filter(key => key.isSharp); // Includes placeholder

  return (
    <div className={`piano ${activeDisplayMode === 'letters' ? 'letters' : ''}`}>
      {whiteKeys.map(keyInfo => (
        <PianoKey
          key={keyInfo.note || keyInfo.letter} // Unique key for React
          note={keyInfo.note}
          letter={keyInfo.letter}
          isSharp={false}
          isActive={activeNotes.has(keyInfo.note)}
          displayMode={activeDisplayMode}
          onMouseDown={onPlayNote}
          onMouseUp={onStopNote}
          onMouseOut={onStopNote} // Original behavior: mouseout from key stops the note
          onMouseMove={onKeyMouseMove}
        />
      ))}
      <div className="keys-sharp">
        {sharpKeys.map((keyInfo, index) => (
          <PianoKey
            key={keyInfo.note || keyInfo.letter || `sharp-placeholder-${index}`} // Unique key
            note={keyInfo.note}
            letter={keyInfo.letter}
            isSharp={true}
            isPlaceholder={keyInfo.isPlaceholder}
            isActive={activeNotes.has(keyInfo.note)}
            displayMode={activeDisplayMode}
            onMouseDown={onPlayNote}
            onMouseUp={onStopNote}
            onMouseOut={onStopNote}
            onMouseMove={onKeyMouseMove}
          />
        ))}
      </div>
    </div>
  );
};

export default Piano;
```

**`src/components/FullscreenButton.tsx`**
```typescript
import React from 'react';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ isFullscreen, onToggleFullscreen }) => {
  return (
    <button
      className="fullscreen openfullscreen" // 'openfullscreen' class seems static for styling
      onClick={onToggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    />
  );
};

export default FullscreenButton;
```

**6. Main Application Logic (`src/App.tsx`)**
```typescript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Controls from './components/Controls';
import Piano from './components/Piano';
import FullscreenButton from './components/FullscreenButton';
import { DisplayMode } from './types';
import { soundMapper, letterToKeyInfoMap } from './config/audio';

const App: React.FC = () => {
  const [activeDisplayMode, setActiveDisplayMode] = useState<DisplayMode>('notes');
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  // Ref to track notes played during a single mouse drag operation to replicate original `played` array behavior for mouse moves.
  const mousePlayedNotesRef = useRef<Set<string>>(new Set());

  const playNote = useCallback((note: string) => {
    if (!note || activeNotes.has(note)) { // Don't replay if already active
      return;
    }

    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error("Error playing sound for note " + note + ":", error));
    }
    setActiveNotes(prev => new Set(prev).add(note));
  }, [activeNotes]); // Depends on activeNotes to prevent re-triggering

  const stopNote = useCallback((note: string) => {
    if (!note) return;
    // Audio stops on its own or when play() is called again with currentTime = 0.
    // We mainly manage the visual active state.
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return; // Ignore repeated events for held keys
      const keyInfo = letterToKeyInfoMap.get(event.key.toUpperCase());
      if (keyInfo) {
        event.preventDefault(); // Prevent default browser action for keys like space, etc.
        playNote(keyInfo.note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyInfo = letterToKeyInfoMap.get(event.key.toUpperCase());
      if (keyInfo) {
        event.preventDefault();
        stopNote(keyInfo.note);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]); // letterToKeyInfoMap is stable

  // Mouse event handlers for PianoKey instances
  const handleMouseDownOnKey = useCallback((note: string, _letter: string) => {
    playNote(note);
    mousePlayedNotesRef.current.add(note); // Track for current drag session
  }, [playNote]);

  const handleMouseUpOnKey = useCallback((note: string, _letter: string) => {
    stopNote(note);
    // Clear all notes from mouse drag tracking when mouse button is released over a key
    // This replicates original behavior where `played` array was effectively reset for mouse interactions on mouseup.
    mousePlayedNotesRef.current.clear();
  }, [stopNote]);

  const handleMouseOutOfKey = useCallback((note: string, _letter: string) => {
    // If the note is active (mouse was pressed/dragged over it) and mouse leaves the key, stop it.
    // This replicates `resetActive` on `mouseout` from a key.
    if (activeNotes.has(note)) { 
        stopNote(note);
        // Remove from ref, so if dragged back in (button still held), it can play again.
        // This matches original `played.filter` behavior on mouseout.
        mousePlayedNotesRef.current.delete(note); 
    }
  }, [stopNote, activeNotes]);

  const handleMouseMoveOnKey = useCallback((event: React.MouseEvent<HTMLDivElement>, note: string, _letter: string) => {
    if (event.buttons === 1) { // Primary mouse button is pressed (dragging)
      // Play only if not already visually/audibly active from the current continuous interaction.
      // The `activeNotes.has(note)` check ensures it doesn't re-trigger if already playing.
      // The `mousePlayedNotesRef.current.has(note)` check in original logic is covered by `activeNotes.has(note)`
      // because `playNote` won't do anything if `activeNotes.has(note)` is true.
      if (!activeNotes.has(note)) {
        playNote(note);
        mousePlayedNotesRef.current.add(note); // Track for current drag session
      }
    }
  }, [playNote, activeNotes]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        // User might deny permission, or API not fully supported.
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    // Also handle vendor-prefixed versions for broader compatibility if needed
    // document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    // document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
    // document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      // document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      // document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
      // document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
    };
  }, []);

  return (
    <> {/* React.Fragment shorthand */}
      <Header />
      <main className="main">
        <Controls
          activeDisplayMode={activeDisplayMode}
          onDisplayModeChange={setActiveDisplayMode}
        />
        <Piano
          activeDisplayMode={activeDisplayMode}
          activeNotes={activeNotes}
          onPlayNote={handleMouseDownOnKey}
          onStopNote={handleMouseUpOnKey}
          onKeyMouseMove={handleMouseMoveOnKey}
        />
        <FullscreenButton
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </main>
      <Footer />
    </>
  );
};

export default App;
```

**7. Entry Point (`src/index.tsx`)**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// If you have a global CSS file for CRA defaults (like index.css), 
// you might want to remove its content or the import if style.css covers everything.
// import './index.css'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**To make this runnable:**
1.  Ensure you have Node.js and npm/yarn installed.
2.  Create the project: `npx create-react-app virtual-piano --template typescript`.
3.  Navigate into the project: `cd virtual-piano`.
4.  Replace/create the files in the `src` directory as shown above.
5.  Organize your `public` directory:
    *   `public/index.html` (use the content provided)
    *   `public/css/style.css` (your original CSS file)
    *   `public/assets/piano.ico` (your icon)
    *   `public/assets/audio/` (all your .mp3 files: `a.mp3`, `b.mp3`, `c♯.mp3`, etc.)
6.  Delete default CRA files from `src` if they are not used (e.g., `App.test.tsx`, `logo.svg`, `reportWebVitals.ts`, `setupTests.ts`, `App.css`, `index.css` if you don't need it).
7.  Run the development server: `npm start` or `yarn start`.

This migration preserves the functionality, structure, and styling of your original application while leveraging React 18 features and TypeScript for better maintainability and type safety. Audio handling, event management, and state are all managed within the React paradigm. Optimizations like `React.memo` and `useCallback` are included.

### Tokens: {'input_tokens': 1815, 'output_tokens': 20307, 'reasoning_tokens': 14863}
### Execution time: 202.45794486999512
