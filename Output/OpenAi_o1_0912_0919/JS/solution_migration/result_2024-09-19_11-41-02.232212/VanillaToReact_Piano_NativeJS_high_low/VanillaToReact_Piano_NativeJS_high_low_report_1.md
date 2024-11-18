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
// File: public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/assets/piano.ico" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>virtual-piano</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

// File: src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/style.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
```

// File: src/App.tsx
```tsx
import React from 'react';
import Header from './components/Header';
import Piano from './components/Piano';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Piano />
      <Footer />
    </>
  );
}

export default App;
```

// File: src/components/Header.tsx
```tsx
import React from 'react';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Virtual Piano</h1>
    </header>
  );
}

export default Header;
```

// File: src/components/Footer.tsx
```tsx
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">2020</div>
    </footer>
  );
}

export default Footer;
```

// File: src/components/Piano.tsx
```tsx
import React, { useState, useEffect } from 'react';
import PianoKey from './PianoKey';

function Piano() {
  const [isLetters, setIsLetters] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [mouseDown, setMouseDown] = useState(false);

  const whiteKeys = [
    { note: 'c', letter: 'D' },
    { note: 'd', letter: 'F' },
    { note: 'e', letter: 'G' },
    { note: 'f', letter: 'H' },
    { note: 'g', letter: 'J' },
    { note: 'a', letter: 'K' },
    { note: 'b', letter: 'L' },
  ];

  const blackKeys = [
    { note: 'c♯', letter: 'R' },
    { note: 'd♯', letter: 'T' },
    null,
    { note: 'f♯', letter: 'U' },
    { note: 'g♯', letter: 'I' },
    { note: 'a♯', letter: 'O' },
  ];

  const playNote = (note: string) => {
    if (activeKeys.includes(note)) return;
    const sound = new Audio(`${process.env.PUBLIC_URL}/assets/audio/${note}.mp3`);
    sound.currentTime = 0;
    sound.play();
    setActiveKeys((prev) => [...prev, note]);
  };

  const stopNote = (note: string) => {
    setActiveKeys((prev) => prev.filter((n) => n !== note));
  };

  const handleMouseDownOnKey = (note: string) => {
    setMouseDown(true);
    playNote(note);
  };

  const handleMouseUpOnKey = (note: string) => {
    setMouseDown(false);
    stopNote(note);
  };

  const handleMouseEnterOnKey = (note: string) => {
    if (mouseDown) {
      playNote(note);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const keyData = [...whiteKeys, ...blackKeys].find((k) => k && k.letter === key);
    if (keyData) {
      playNote(keyData.note);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const keyData = [...whiteKeys, ...blackKeys].find((k) => k && k.letter === key);
    if (keyData) {
      stopNote(keyData.note);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', () => setMouseDown(false));
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', () => setMouseDown(false));
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <main className="main">
      <div className="btn-container">
        <button
          className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`}
          onClick={() => setIsLetters(false)}
        >
          Notes
        </button>
        <button
          className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`}
          onClick={() => setIsLetters(true)}
        >
          Letters
        </button>
      </div>
      <div
        className={`piano ${isLetters ? 'letters' : ''}`}
        onMouseLeave={() => setMouseDown(false)}
      >
        {whiteKeys.map((key) => (
          <PianoKey
            key={key.note}
            note={key.note}
            letter={key.letter}
            isActive={activeKeys.includes(key.note)}
            isSharp={false}
            onMouseDown={() => handleMouseDownOnKey(key.note)}
            onMouseUp={() => handleMouseUpOnKey(key.note)}
            onMouseOut={() => handleMouseUpOnKey(key.note)}
            onMouseEnter={() => handleMouseEnterOnKey(key.note)}
          />
        ))}
        <div className="keys-sharp">
          {blackKeys.map((key, index) =>
            key ? (
              <PianoKey
                key={key.note}
                note={key.note}
                letter={key.letter}
                isActive={activeKeys.includes(key.note)}
                isSharp={true}
                onMouseDown={() => handleMouseDownOnKey(key.note)}
                onMouseUp={() => handleMouseUpOnKey(key.note)}
                onMouseOut={() => handleMouseUpOnKey(key.note)}
                onMouseEnter={() => handleMouseEnterOnKey(key.note)}
              />
            ) : (
              <div key={index} className="piano-key sharp none"></div>
            )
          )}
        </div>
      </div>
      <button className="fullscreen openfullscreen" onClick={toggleFullscreen}></button>
    </main>
  );
}

export default Piano;
```

// File: src/components/PianoKey.tsx
```tsx
import React from 'react';

interface PianoKeyProps {
  note: string;
  letter: string;
  isActive: boolean;
  isSharp: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseOut: () => void;
  onMouseEnter: () => void;
}

function PianoKey({
  note,
  letter,
  isActive,
  isSharp,
  onMouseDown,
  onMouseUp,
  onMouseOut,
  onMouseEnter,
}: PianoKeyProps) {
  const classNames = ['piano-key', isSharp ? 'sharp' : '', isActive ? 'piano-key-active' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      data-note={note}
      data-letter={letter}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onMouseEnter={onMouseEnter}
    ></div>
  );
}

export default PianoKey;
```

// File: src/css/style.css
```css
/* Include your CSS styles here */
```

```

### Tokens: {'input_tokens': 1423, 'output_tokens': 10489, 'reasoning_tokens': 8576}
### Execution time: 105.6457028388977
