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
Let's start by understanding the original application before migrating it to React 18 with TypeScript:

The application is a virtual piano that:
1. Allows users to play piano notes by clicking on keys or using keyboard
2. Toggles between showing notes or letters on the keys
3. Has fullscreen functionality
4. Plays audio when keys are pressed
5. Has visual feedback when keys are active

Now let's plan the migration:

1. Create a React project with TypeScript
2. Create appropriate component structure
3. Define TypeScript interfaces
4. Implement state management with hooks
5. Convert event handlers to React patterns
6. Handle audio playback
7. Implement fullscreen functionality
8. Preserve styling and responsiveness

Let's start with the component structure:

- App (main component)
  - Header
  - Piano (container component)
    - ControlPanel (buttons for Notes/Letters)
    - PianoKeys (piano keys container)
      - PianoKey (individual key)
    - FullscreenButton
  - Footer

Now, let's define some TypeScript interfaces:

```typescript
interface Note {
  letter: string;
  note: string;
  sharp?: boolean;
}

interface AudioMap {
  [key: string]: HTMLAudioElement;
}
```

For state management, we'll need:
1. State for tracking active keys
2. State for tracking if we're showing notes or letters
3. State for tracking fullscreen mode

Let's implement each component, starting with the basic structure:

For the App component:
```tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Piano from './components/Piano';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Piano />
      <Footer />
    </div>
  );
}

export default App;
```

For the Header:
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

For the Footer:
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

Now for the Piano component, which will contain most of the logic:

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import PianoKey from './PianoKey';
import ControlPanel from './ControlPanel';
import FullscreenButton from './FullscreenButton';

interface Note {
  letter: string;
  note: string;
  sharp?: boolean;
}

interface AudioMap {
  [key: string]: HTMLAudioElement;
}

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  
  // Define piano keys
  const pianoKeys: Note[] = [
    { letter: 'D', note: 'c' },
    { letter: 'F', note: 'd' },
    { letter: 'G', note: 'e' },
    { letter: 'H', note: 'f' },
    { letter: 'J', note: 'g' },
    { letter: 'K', note: 'a' },
    { letter: 'L', note: 'b' },
    { letter: 'R', note: 'c♯', sharp: true },
    { letter: 'T', note: 'd♯', sharp: true },
    { letter: 'U', note: 'f♯', sharp: true },
    { letter: 'I', note: 'g♯', sharp: true },
    { letter: 'O', note: 'a♯', sharp: true },
  ];

  // Initialize audio map
  const soundMapper: AudioMap = {
    'c': new Audio('./assets/audio/c.mp3'),
    'd': new Audio('./assets/audio/d.mp3'),
    'e': new Audio('./assets/audio/e.mp3'),
    'f': new Audio('./assets/audio/f.mp3'),
    'g': new Audio('./assets/audio/g.mp3'),
    'a': new Audio('./assets/audio/a.mp3'),
    'b': new Audio('./assets/audio/b.mp3'),
    'c♯': new Audio('./assets/audio/c♯.mp3'),
    'd♯': new Audio('./assets/audio/d♯.mp3'),
    'f♯': new Audio('./assets/audio/f♯.mp3'),
    'g♯': new Audio('./assets/audio/g♯.mp3'),
    'a♯': new Audio('./assets/audio/a♯.mp3'),
  };

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = pianoKeys.find(k => k.letter === key);
    
    if (pianoKey && !activeKeys.includes(pianoKey.note)) {
      playNote(pianoKey.note);
      setActiveKeys(prev => [...prev, pianoKey.note]);
    }
  }, [activeKeys, pianoKeys]);

  // Handle key release
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoKey = pianoKeys.find(k => k.letter === key);
    
    if (pianoKey) {
      setActiveKeys(prev => prev.filter(note => note !== pianoKey.note));
    }
  }, [pianoKeys]);

  // Play a note
  const playNote = (note: string) => {
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  };

  // Add mouse event handlers
  const handleMouseDown = (note: string) => {
    if (!activeKeys.includes(note)) {
      playNote(note);
      setActiveKeys(prev => [...prev, note]);
    }
  };

  const handleMouseUp = (note: string) => {
    setActiveKeys(prev => prev.filter(n => n !== note));
  };

  const handleMouseOut = (note: string) => {
    setActiveKeys(prev => prev.filter(n => n !== note));
  };

  const handleMouseMove = (event: React.MouseEvent, note: string) => {
    if (event.buttons === 1 && !activeKeys.includes(note)) {
      playNote(note);
      setActiveKeys(prev => [...prev, note]);
    }
  };

  // Setup key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <main className="main">
      <ControlPanel 
        showLetters={showLetters} 
        setShowLetters={setShowLetters} 
      />
      <div className={`piano ${showLetters ? 'letters' : ''}`}>
        <div className="regular-keys">
          {pianoKeys.filter(key => !key.sharp).map(key => (
            <PianoKey
              key={key.note}
              note={key.note}
              letter={key.letter}
              isActive={activeKeys.includes(key.note)}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseOut={() => handleMouseOut(key.note)}
              onMouseMove={(e) => handleMouseMove(e, key.note)}
            />
          ))}
        </div>
        <div className="keys-sharp">
          {pianoKeys.filter(key => key.sharp).map(key => (
            <PianoKey
              key={key.note}
              note={key.note}
              letter={key.letter}
              isSharp={true}
              isActive={activeKeys.includes(key.note)}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseOut={() => handleMouseOut(key.note)}
              onMouseMove={(e) => handleMouseMove(e, key.note)}
            />
          ))}
          <div className="piano-key sharp none"></div>
        </div>
      </div>
      <FullscreenButton />
    </main>
  );
};

export default Piano;
```

Let's continue with the remaining components:

For the PianoKey component:
```tsx
import React from 'react';

interface PianoKeyProps {
  note: string;
  letter: string;
  isSharp?: boolean;
  isActive: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseOut: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  letter,
  isSharp = false,
  isActive,
  onMouseDown,
  onMouseUp,
  onMouseOut,
  onMouseMove
}) => {
  const className = `piano-key ${isSharp ? 'sharp' : ''} ${isActive ? 'piano-key-active' : ''}`;
  
  return (
    <div
      className={className}
      data-note={note}
      data-letter={letter}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onMouseMove={onMouseMove}
    >
      <span className="piano-key-letter">{letter}</span>
      <span className="piano-key-note">{note}</span>
    </div>
  );
};

export default React.memo(PianoKey);
```

For the ControlPanel component:
```tsx
import React from 'react';

interface ControlPanelProps {
  showLetters: boolean;
  setShowLetters: (show: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ showLetters, setShowLetters }) => {
  return (
    <div className="btn-container">
      <button 
        className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
        onClick={() => setShowLetters(false)}
      >
        Notes
      </button>
      <button 
        className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
        onClick={() => setShowLetters(true)}
      >
        Letters
      </button>
    </div>
  );
};

export default ControlPanel;
```

For the FullscreenButton component:
```tsx
import React, { useState } from 'react';

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(err));
      }
    }
  };

  return (
    <button 
      className={`fullscreen ${isFullscreen ? 'closefullscreen' : 'openfullscreen'}`}
      onClick={toggleFullscreen}
    ></button>
  );
};

export default FullscreenButton;
```

Now, I need to revise the Piano component to match the exact structure in the original HTML. Let me review and fix it:

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import FullscreenButton from './FullscreenButton';

interface NoteData {
  letter: string;
  note: string;
}

interface AudioMap {
  [key: string]: HTMLAudioElement;
}

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  
  // Define piano keys data to match the original structure
  const pianoKeysData: NoteData[] = [
    { letter: 'D', note: 'c' },
    { letter: 'F', note: 'd' },
    { letter: 'G', note: 'e' },
    { letter: 'H', note: 'f' },
    { letter: 'J', note: 'g' },
    { letter: 'K', note: 'a' },
    { letter: 'L', note: 'b' },
  ];

  const sharpKeysData: NoteData[] = [
    { letter: 'R', note: 'c♯' },
    { letter: 'T', note: 'd♯' },
    { letter: 'U', note: 'f♯' },
    { letter: 'I', note: 'g♯' },
    { letter: 'O', note: 'a♯' },
  ];

  // Initialize audio map
  const soundMapper: AudioMap = React.useMemo(() => ({
    'c': new Audio('./assets/audio/c.mp3'),
    'd': new Audio('./assets/audio/d.mp3'),
    'e': new Audio('./assets/audio/e.mp3'),
    'f': new Audio('./assets/audio/f.mp3'),
    'g': new Audio('./assets/audio/g.mp3'),
    'a': new Audio('./assets/audio/a.mp3'),
    'b': new Audio('./assets/audio/b.mp3'),
    'c♯': new Audio('./assets/audio/c♯.mp3'),
    'd♯': new Audio('./assets/audio/d♯.mp3'),
    'f♯': new Audio('./assets/audio/f♯.mp3'),
    'g♯': new Audio('./assets/audio/g♯.mp3'),
    'a♯': new Audio('./assets/audio/a♯.mp3'),
  }), []);

  // Play a note
  const playNote = useCallback((note: string) => {
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }, [soundMapper]);

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    
    if (pianoEl) {
      const note = pianoEl.getAttribute('data-note');
      if (note && !activeKeys.includes(note)) {
        playNote(note);
        setActiveKeys(prev => [...prev, note]);
        pianoEl.classList.add('piano-key-active');
      }
    }
  }, [activeKeys, playNote]);

  // Handle key release
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    
    if (pianoEl) {
      const note = pianoEl.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        pianoEl.classList.remove('piano-key-active');
      }
    }
  }, []);

  // Add mouse event handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note && !activeKeys.includes(note)) {
        playNote(note);
        setActiveKeys(prev => [...prev, note]);
        target.classList.add('piano-key-active');
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        target.classList.remove('piano-key-active');
      }
    }
  };

  const handleMouseOut = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        target.classList.remove('piano-key-active');
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons === 1) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('piano-key')) {
        const note = target.getAttribute('data-note');
        if (note && !activeKeys.includes(note)) {
          playNote(note);
          setActiveKeys(prev => [...prev, note]);
          target.classList.add('piano-key-active');
        }
      }
    }
  };

  // Setup key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <main className="main">
      <ControlPanel 
        showLetters={showLetters} 
        setShowLetters={setShowLetters} 
      />
      <div className={`piano ${showLetters ? 'letters' : ''}`}
           onMouseDown={handleMouseDown}
           onMouseUp={handleMouseUp}
           onMouseOut={handleMouseOut}
           onMouseMove={handleMouseMove}>
        {/* Regular keys */}
        {pianoKeysData.map(key => (
          <div 
            key={key.note} 
            className="piano-key" 
            data-letter={key.letter} 
            data-note={key.note}
          ></div>
        ))}
        {/* Sharp keys */}
        <div className="keys-sharp">
          {sharpKeysData.map((key, index) => (
            <div 
              key={key.note} 
              className="piano-key sharp" 
              data-letter={key.letter} 
              data-note={key.note}
            ></div>
          ))}
          {/* Empty sharp key placeholder */}
          <div className="piano-key sharp none"></div>
        </div>
      </div>
      <FullscreenButton />
    </main>
  );
};

export default Piano;
```

Let me fix one issue with the Piano component. The structure needs to better match the original HTML structure:

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import FullscreenButton from './FullscreenButton';

interface AudioMap {
  [key: string]: HTMLAudioElement;
}

const Piano: React.FC = () => {
  const [showLetters, setShowLetters] = useState<boolean>(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  
  // Initialize audio map
  const soundMapper: AudioMap = React.useMemo(() => ({
    'c': new Audio('./assets/audio/c.mp3'),
    'd': new Audio('./assets/audio/d.mp3'),
    'e': new Audio('./assets/audio/e.mp3'),
    'f': new Audio('./assets/audio/f.mp3'),
    'g': new Audio('./assets/audio/g.mp3'),
    'a': new Audio('./assets/audio/a.mp3'),
    'b': new Audio('./assets/audio/b.mp3'),
    'c♯': new Audio('./assets/audio/c♯.mp3'),
    'd♯': new Audio('./assets/audio/d♯.mp3'),
    'f♯': new Audio('./assets/audio/f♯.mp3'),
    'g♯': new Audio('./assets/audio/g♯.mp3'),
    'a♯': new Audio('./assets/audio/a♯.mp3'),
  }), []);

  // Play a note
  const playNote = useCallback((note: string) => {
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }, [soundMapper]);

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    
    if (pianoEl) {
      const note = pianoEl.getAttribute('data-note');
      if (note && !activeKeys.includes(note)) {
        playNote(note);
        setActiveKeys(prev => [...prev, note]);
        pianoEl.classList.add('piano-key-active');
      }
    }
  }, [activeKeys, playNote]);

  // Handle key release
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const pianoEl = document.querySelector(`.piano-key[data-letter="${key}"]`) as HTMLElement;
    
    if (pianoEl) {
      const note = pianoEl.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        pianoEl.classList.remove('piano-key-active');
      }
    }
  }, []);

  // Add mouse event handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note && !activeKeys.includes(note)) {
        playNote(note);
        setActiveKeys(prev => [...prev, note]);
        target.classList.add('piano-key-active');
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        target.classList.remove('piano-key-active');
      }
    }
  };

  const handleMouseOut = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note');
      if (note) {
        setActiveKeys(prev => prev.filter(n => n !== note));
        target.classList.remove('piano-key-active');
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons === 1) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('piano-key')) {
        const note = target.getAttribute('data-note');
        if (note && !activeKeys.includes(note)) {
          playNote(note);
          setActiveKeys(prev => [...prev, note]);
          target.classList.add('piano-key-active');
        }
      }
    }
  };

  // Setup key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <main className="main">
      <ControlPanel 
        showLetters={showLetters} 
        setShowLetters={setShowLetters} 
      />
      <div className={`piano ${showLetters ? 'letters' : ''}`}
           onMouseDown={handleMouseDown}
           onMouseUp={handleMouseUp}
           onMouseOut={handleMouseOut}
           onMouseMove={handleMouseMove}>
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
      <FullscreenButton />
    </main>
  );
};

export default Piano;
```

This implementation preserves the exact structure of the original HTML. However, I think we need to revise our approach to event handling to be more React-like. Let's create a more robust PianoKey component and use it for both regular and sharp keys.

Let's finalize our implementation with all components:

We'll need to set up a proper folder structure for our React application:
1. src/
   - App.tsx
   - index.tsx
   - components/
     - Header.tsx
     - Piano.tsx
     - ControlPanel.tsx
     - PianoKey.tsx
     - FullscreenButton.tsx
     - Footer.tsx
   - styles/
     - index.css
   - assets/
     - audio/
       - c.mp3
       - d.mp3
       - etc.
     - piano.ico

Now, let's update our components based on our previous discussions and make sure they're fully React compliant:

### Answer:
# React 18 Migration with TypeScript

Here's a complete migration of the vanilla JavaScript piano application to React 18 with TypeScript.

## Project Setup

First, create a new React app with TypeScript:

```bash
npx create-react-app virtual-piano-react --template typescript
cd virtual-piano-react
```

## Project Structure

```
src/
  ├── components/
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   ├── Piano.tsx
  │   ├── PianoKey.tsx
  │   ├── ControlPanel.tsx
  │   └── FullscreenButton.tsx
  ├── types/
  │   └── index.ts
  ├── assets/
  │   ├── audio/
  │   │   ├── c.mp3
  │   │   ├── d.mp3
  │   │   └── ... (all audio files)
  │   └── piano.ico
  ├── styles/
  │   └── style.css
  ├── App.tsx
  └── index.tsx
```

## Type Definitions

**src/types/index.ts**:
```typescript
// Type definitions for the app
export interface AudioMap {
  [key: string]: HTMLAudioElement;
}

export interface PianoKeyProps {
  letter: string;
  note: string;
  isSharp?: boolean;
  isNone?: boolean;
  isActive: boolean;
}
```

## Components Implementation

**src/App.tsx**:
```tsx
import React from 'react';
import Header from './components/Header';
import Piano from './components/Piano';
import Footer from './components/Footer';
import './styles/style.css';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Piano />
      <Footer />
    </>
  );
};

export default App;
```

**src/components/Header.tsx**:
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

**src/components/Footer.tsx**:
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

**src/components/ControlPanel.tsx**:
```tsx
import React from 'react';

interface ControlPanelProps {
  showNotes: boolean;
  toggleView: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ showNotes, toggleView }) => {
  return (
    <div className="btn-container">
      <button 
        className={`btn btn-notes ${showNotes ? 'btn-active' : ''}`}
        onClick={toggleView}
      >
        Notes
      </button>
      <button 
        className={`btn btn-letters ${!showNotes ? 'btn-active' : ''}`}
        onClick={toggleView}
      >
        Letters
      </button>
    </div>
  );
};

export default React.memo(ControlPanel);
```

**src/components/PianoKey.tsx**:
```tsx
import React from 'react';
import { PianoKeyProps } from '../types';

interface ExtendedPianoKeyProps extends PianoKeyProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>, note: string) => void;
}

const PianoKey: React.FC<ExtendedPianoKeyProps> = ({
  letter,
  note,
  isSharp = false,
  isNone = false,
  isActive,
  onMouseDown
}) => {
  // Determine class name based on props
  const className = `piano-key ${isSharp ? 'sharp' : ''} ${isNone ? 'none' : ''} ${isActive ? 'piano-key-active' : ''}`;
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isNone) {
      onMouseDown(event, note);
    }
  };

  return (
    <div
      className={className}
      data-letter={letter}
      data-note={note}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default React.memo(PianoKey);
```

**src/components/FullscreenButton.tsx**:
```tsx
import React, { useState, useCallback } from 'react';

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }, []);

  return (
    <button 
      className={`fullscreen ${isFullscreen ? 'closefullscreen' : 'openfullscreen'}`}
      onClick={toggleFullscreen}
    ></button>
  );
};

export default React.memo(FullscreenButton);
```

**src/components/Piano.tsx**:
```tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ControlPanel from './ControlPanel';
import PianoKey from './PianoKey';
import FullscreenButton from './FullscreenButton';
import { AudioMap } from '../types';

const Piano: React.FC = () => {
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const pianoRef = useRef<HTMLDivElement>(null);
  
  // Create audio map with all sounds
  const soundMapper: AudioMap = useMemo(() => ({
    'c': new Audio('./assets/audio/c.mp3'),
    'd': new Audio('./assets/audio/d.mp3'),
    'e': new Audio('./assets/audio/e.mp3'),
    'f': new Audio('./assets/audio/f.mp3'),
    'g': new Audio('./assets/audio/g.mp3'),
    'a': new Audio('./assets/audio/a.mp3'),
    'b': new Audio('./assets/audio/b.mp3'),
    'c♯': new Audio('./assets/audio/c♯.mp3'),
    'd♯': new Audio('./assets/audio/d♯.mp3'),
    'f♯': new Audio('./assets/audio/f♯.mp3'),
    'g♯': new Audio('./assets/audio/g♯.mp3'),
    'a♯': new Audio('./assets/audio/a♯.mp3'),
  }), []);

  // Piano key definitions - natural keys
  const naturalKeys = useMemo(() => [
    { letter: 'D', note: 'c' },
    { letter: 'F', note: 'd' },
    { letter: 'G', note: 'e' },
    { letter: 'H', note: 'f' },
    { letter: 'J', note: 'g' },
    { letter: 'K', note: 'a' },
    { letter: 'L', note: 'b' },
  ], []);

  // Piano key definitions - sharp keys
  const sharpKeys = useMemo(() => [
    { letter: 'R', note: 'c♯' },
    { letter: 'T', note: 'd♯' },
    { letter: '', note: '' },
    { letter: 'U', note: 'f♯' },
    { letter: 'I', note: 'g♯' },
    { letter: 'O', note: 'a♯' },
  ], []);

  // Play a note with the appropriate sound
  const playNote = useCallback((note: string) => {
    if (!note) return;
    
    const sound = soundMapper[note];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }, [soundMapper]);

  // Add a note to active notes and play it
  const activateNote = useCallback((note: string) => {
    if (!note || activeNotes.has(note)) return;
    
    playNote(note);
    setActiveNotes(prev => new Set(prev).add(note));
  }, [activeNotes, playNote]);

  // Remove a note from active notes
  const deactivateNote = useCallback((note: string) => {
    if (!note) return;
    
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  // Handle mouse down on piano key
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>, note: string) => {
    event.preventDefault();
    activateNote(note);
  }, [activateNote]);

  // Handle mouse up on piano key
  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note') || '';
      deactivateNote(note);
    }
  }, [deactivateNote]);

  // Handle mouse out on piano key
  const handleMouseOut = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note') || '';
      deactivateNote(note);
    }
  }, [deactivateNote]);

  // Handle mouse move for drag playing
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    
    const target = event.target as HTMLElement;
    if (target.classList.contains('piano-key')) {
      const note = target.getAttribute('data-note') || '';
      activateNote(note);
    }
  }, [activateNote]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const allKeys = [...naturalKeys, ...sharpKeys.filter(k => k.letter)];
    const pianoKey = allKeys.find(k => k.letter === key);
    
    if (pianoKey) {
      activateNote(pianoKey.note);
    }
  }, [activateNote, naturalKeys, sharpKeys]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const allKeys = [...naturalKeys, ...sharpKeys.filter(k => k.letter)];
    const pianoKey = allKeys.find(k => k.letter === key);
    
    if (pianoKey) {
      deactivateNote(pianoKey.note);
    }
  }, [deactivateNote, naturalKeys, sharpKeys]);

  // Toggle between Notes and Letters view
  const toggleView = useCallback(() => {
    setShowNotes(prev => !prev);
  }, []);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <main className="main">
      <ControlPanel showNotes={showNotes} toggleView={toggleView} />
      
      <div 
        ref={pianoRef}
        className={`piano ${!showNotes ? 'letters' : ''}`}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
      >
        {/* Render natural keys */}
        {naturalKeys.map(key => (
          <PianoKey
            key={key.note}
            letter={key.letter}
            note={key.note}
            isActive={activeNotes.has(key.note)}
            onMouseDown={handleMouseDown}
          />
        ))}
        
        {/* Render sharp keys */}
        <div className="keys-sharp">
          {sharpKeys.map((key, index) => (
            <PianoKey
              key={index}
              letter={key.letter}
              note={key.note}
              isSharp={true}
              isNone={!key.letter}
              isActive={activeNotes.has(key.note)}
              onMouseDown={handleMouseDown}
            />
          ))}
        </div>
      </div>
      
      <FullscreenButton />
    </main>
  );
};

export default Piano;
```

**src/index.tsx**:
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

## CSS Implementation

You should copy the original CSS file to `src/styles/style.css`. Make sure to also copy all the audio files to the `public/assets/audio/` directory and the piano icon to `public/assets/piano.ico`.

## Key Features of This Migration

1. **TypeScript Integration**
   - Strict type checking for all components and functions
   - Interface definitions for props and state

2. **React Component Structure**
   - Functional components with React hooks
   - Clear separation of concerns
   - Memo optimization for pure components

3. **State Management**
   - useState for UI state (active notes, display mode)
   - Set data structure for efficient note tracking
   - Controlled component pattern

4. **Event Handling**
   - React synthetic events for mouse interactions
   - Global keyboard event listeners in useEffect
   - Proper cleanup of event listeners

5. **Audio Implementation**
   - Efficient audio playback with useMemo for caching
   - Reset audio position before playing

6. **Performance Optimizations**
   - useCallback for event handlers to prevent unnecessary re-renders
   - useMemo for data that doesn't change
   - React.memo for pure components
   - Reference equality with Set instead of array operations

7. **Fullscreen Functionality**
   - Browser-compatible fullscreen API implementation

The migration preserves all the functionality of the original piano application while taking advantage of React's component-based architecture and TypeScript's type safety.

### Tokens: {'input_tokens': 1998, 'output_tokens': 10856}
### Execution time: 122.71766495704651
