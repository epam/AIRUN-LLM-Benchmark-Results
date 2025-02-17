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
<think>
Okay, I need to convert the given HTML and JavaScript code into React using TypeScript. Let me start by understanding the original code structure and functionality.

First, the HTML has a header, main, and footer. The main section includes buttons to switch between notes and letters, a piano with keys, and a fullscreen button. The JavaScript handles playing sounds on key presses (both keyboard and mouse), toggling the active state of keys, switching between note/letter displays, and fullscreen functionality.

In React, I'll need to create functional components. Let's start with the main App component. I'll use useState hooks for managing the active mode (notes or letters) and the currently played notes. useEffect might be needed for adding event listeners, but maybe I can handle keyboard events with onKeyDown and onKeyUp directly.

The piano keys are structured with both white and sharp keys. Each key has data attributes for note and letter. In React, I'll map through an array of keys to render them dynamically. The sharp keys have a 'none' class for spacing, so I'll need to handle that conditionally.

The original code uses event listeners for keydown, keyup, mouse events. In React, I'll convert these to onKeyDown, onKeyUp, onMouseDown, onMouseUp, onMouseLeave, and onMouseMove events. The play and resetActive functions will need to be adjusted to use React's synthetic events and state management.

For the sound handling, the original uses an object soundMapper. I'll create a similar object in React, but ensure that the Audio objects are initialized correctly, possibly using useMemo to prevent reinitialization on every render.

The fullscreen functionality can be handled with a function that checks the current fullscreen state and toggles it. The buttons for notes/letters will update the state, which in turn adds or removes the 'letters' class on the piano container.

I should also consider optimizing the code. For example, using useCallback for event handlers to prevent unnecessary re-renders, and memoizing the sound objects. However, since the user mentioned using Create React App and TypeScript, I'll need to set up the project with the correct types.

Let me outline the components:

1. App Component: Manages state for mode (notes/letters) and played notes.
2. PianoKey Component: Renders individual keys, handling their active state and sound playback.
3. The main structure includes Header, Main (with buttons and piano), and Footer.

Wait, maybe the PianoKey can be a separate component, but given the structure, it might be easier to map through the keys in the main component. Let me see the original HTML. The piano has a mix of white and sharp keys, with sharps placed in a separate div with class 'keys-sharp'. So in React, I'll need to structure the piano similarly, rendering white keys and sharp keys in their respective containers.

I'll create two arrays: one for white keys and one for sharp keys. Each key will have properties like note, letter, and whether it's a sharp or has the 'none' class. For example, the third sharp key has 'none', so I'll include a property like isSpacer: true.

In the React component, I'll map over these arrays to generate the keys. For sharp keys, some might be spacers, so they won't have data attributes or event handlers.

Handling the play function: When a key is pressed (via mouse or keyboard), check if it's a valid key (not a spacer), then play the sound and add the active class. The played notes are tracked in state to prevent replaying while active.

For the CSS, the original uses classes like 'piano-key', 'sharp', 'letters', etc. These will need to be imported as a CSS module or included in the global styles. Assuming the React app has a global CSS file, I'll import it in the component.

TypeScript interfaces: Define types for the Key data, including note, letter, isSharp, isSpacer, etc.

Fullscreen button: The function toggles fullscreen using the standard document methods.

Testing the event handlers: Ensure that mouse events (mousedown, mouseup, mouseleave) and keyboard events (keydown, keyup) are correctly handled. Also, the mousemove event with button pressed (event.buttons === 1) to simulate dragging over keys.

Now, putting it all together:

- Use useState for isLettersMode (instead of checking the class) and playedNotes.
- Create a keys configuration array for white and sharp keys.
- Render the piano keys by mapping through the configuration.
- Handle the playNote function, which triggers on valid events, checks if the note is already playing, and updates the state.
- Reset the active state when the key is released or mouse leaves.
- Toggle between letters and notes mode using state, which adds the 'letters' class to the piano container.

I also need to ensure that the Audio objects are correctly referenced and played. Since the sound files are in the public folder, the paths should be relative to the public directory in a Create React App setup.

Finally, the fullscreen button's class is 'fullscreen openfullscreen' in the original. In React, this becomes className="fullscreen openfullscreen".

Testing for any possible issues, like event propagation, state updates, and correct class toggling. Also, ensure that TypeScript types are correctly applied to avoid any errors.
</think>

App.tsx:
```tsx
import { useState, useMemo, useCallback } from 'react';
import './App.css';

interface KeyData {
  note: string;
  letter: string;
  isSharp?: boolean;
  isSpacer?: boolean;
}

const whiteKeys: KeyData[] = [
  { note: 'c', letter: 'D' },
  { note: 'd', letter: 'F' },
  { note: 'e', letter: 'G' },
  { note: 'f', letter: 'H' },
  { note: 'g', letter: 'J' },
  { note: 'a', letter: 'K' },
  { note: 'b', letter: 'L' },
];

const sharpKeys: KeyData[] = [
  { note: 'c♯', letter: 'R', isSharp: true },
  { note: 'd♯', letter: 'T', isSharp: true },
  { isSpacer: true, note: '', letter: '' },
  { note: 'f♯', letter: 'U', isSharp: true },
  { note: 'g♯', letter: 'I', isSharp: true },
  { note: 'a♯', letter: 'O', isSharp: true },
];

const soundMapper = Object.fromEntries(
  Object.entries({
    c: 'a.mp3',
    d: 'd.mp3',
    e: 'e.mp3',
    f: 'f.mp3',
    g: 'g.mp3',
    a: 'a.mp3',
    b: 'b.mp3',
    'c♯': 'c♯.mp3',
    'd♯': 'd♯.mp3',
    'f♯': 'f♯.mp3',
    'g♯': 'g♯.mp3',
    'a♯': 'a♯.mp3',
  }).map(([note, file]) => [note, new Audio(`/assets/audio/${file}`)])
);

const App = () => {
  const [isLettersMode, setIsLettersMode] = useState(false);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);

  const playNote = useCallback((note: string) => {
    if (!note || playedNotes.includes(note)) return;
    
    setPlayedNotes(prev => [...prev, note]);
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
  }, [playedNotes]);

  const resetNote = useCallback((note: string) => {
    setPlayedNotes(prev => prev.filter(n => n !== note));
  }, []);

  const handleKeyInteraction = (event: React.KeyboardEvent | React.MouseEvent, note: string) => {
    if (event.type === 'keydown') {
      playNote(note);
    } else if (event.type === 'keyup') {
      resetNote(note);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      
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

        <div className={`piano ${isLettersMode ? 'letters' : ''}`}>
          <div className="piano-keys">
            {whiteKeys.map(({ note, letter }) => (
              <div
                key={note}
                className={`piano-key ${playedNotes.includes(note) ? 'piano-key-active' : ''}`}
                data-letter={letter}
                data-note={note}
                onMouseDown={(e) => playNote(note)}
                onMouseUp={(e) => resetNote(note)}
                onMouseLeave={(e) => resetNote(note)}
                onKeyDown={(e) => handleKeyInteraction(e, note)}
                onKeyUp={(e) => handleKeyInteraction(e, note)}
                tabIndex={0}
              />
            ))}
          </div>
          
          <div className="keys-sharp">
            {sharpKeys.map(({ note, letter, isSharp, isSpacer }, index) => (
              isSpacer ? (
                <div key={`spacer-${index}`} className="piano-key sharp none" />
              ) : (
                <div
                  key={note}
                  className={`piano-key sharp ${playedNotes.includes(note) ? 'piano-key-active' : ''}`}
                  data-letter={letter}
                  data-note={note}
                  onMouseDown={(e) => isSharp && playNote(note)}
                  onMouseUp={(e) => isSharp && resetNote(note)}
                  onMouseLeave={(e) => isSharp && resetNote(note)}
                  onKeyDown={(e) => isSharp && handleKeyInteraction(e, note)}
                  onKeyUp={(e) => isSharp && handleKeyInteraction(e, note)}
                  tabIndex={isSharp ? 0 : -1}
                />
              )
            ))}
          </div>
        </div>

        <button 
          className="fullscreen openfullscreen" 
          onClick={handleFullscreen}
        />
      </main>

      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
};

export default App;
```

App.css:
```css
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.btn-container {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #e0e0e0;
}

.btn-active {
  background-color: #a0a0a0;
}

.piano {
  position: relative;
  display: inline-block;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
}

.piano-key {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 200px;
  margin: 0 2px;
  background: white;
  border-radius: 0 0 5px 5px;
  cursor: pointer;
  transition: background-color 0.1s;
}

.piano-key.sharp {
  position: absolute;
  background: black;
  width: 30px;
  height: 120px;
  margin: 0 -15px;
  z-index: 1;
}

.keys-sharp {
  position: absolute;
  top: 0;
  left: 35px;
  right: 35px;
  height: 200px;
}

.piano-key-active {
  background-color: #c0c0c0;
}

.piano-key.sharp.piano-key-active {
  background-color: #404040;
}

.piano.letters .piano-key:not(.sharp)::after,
.piano.letters .piano-key.sharp:not(.none)::after {
  content: attr(data-letter);
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  color: #666;
}

.fullscreen {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  cursor: pointer;
  background: url('./assets/fullscreen-icon.png') no-repeat center;
}

.footer {
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 1423, 'output_tokens': 3008}
### Execution time: 167.99476790428162
