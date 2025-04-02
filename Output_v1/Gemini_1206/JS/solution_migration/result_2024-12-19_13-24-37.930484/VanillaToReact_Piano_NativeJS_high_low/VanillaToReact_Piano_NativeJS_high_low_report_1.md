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
```typescript
// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
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

```typescript
// components/Header.tsx
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

```typescript
// components/Main.tsx
import React, { useState, useEffect, useRef } from 'react';
import Piano from './Piano';

const Main: React.FC = () => {
  const [isNotes, setIsNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    <main className="main">
      <div className="btn-container">
        <button
          className={`btn btn-notes ${isNotes ? 'btn-active' : ''}`}
          onClick={() => setIsNotes(true)}
        >
          Notes
        </button>
        <button
          className={`btn btn-letters ${!isNotes ? 'btn-active' : ''}`}
          onClick={() => setIsNotes(false)}
        >
          Letters
        </button>
      </div>
      <Piano isNotes={isNotes} />
      <button
        className={`fullscreen ${isFullscreen ? 'exitfullscreen' : 'openfullscreen'}`}
        onClick={toggleFullscreen}
      ></button>
    </main>
  );
};

export default Main;
```

```typescript
// components/Piano.tsx
import React, { useState, useEffect, useRef } from 'react';
import { soundMapper } from '../utils/soundMapper';

interface PianoProps {
  isNotes: boolean;
}

const Piano: React.FC<PianoProps> = ({ isNotes }) => {
  const [played, setPlayed] = useState<string[]>([]);
  const pianoRef = useRef<HTMLDivElement>(null);

  const play = (event: React.MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    let pianoEl: HTMLDivElement | null = null;

    if (isKeyboard) {
      pianoEl = pianoRef.current?.querySelector(
        `.piano-key[data-letter=${(event as KeyboardEvent).key.toUpperCase()}]`
      ) ?? null;
    } else {
      pianoEl = event.target as HTMLDivElement;
    }

    if (!pianoEl || !pianoEl.dataset.note) return;

    const note = pianoEl.dataset.note;
    if (played.includes(note)) return;

    pianoEl.classList.add('piano-key-active');
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed([...played, note]);
  };

  const resetActive = (event: React.MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    const isKeyboard = event instanceof KeyboardEvent;
    let pianoEl: HTMLDivElement | null = null;

    if (isKeyboard) {
      pianoEl = pianoRef.current?.querySelector(
        `.piano-key[data-letter=${(event as KeyboardEvent).key.toUpperCase()}]`
      ) ?? null;
    } else {
      pianoEl = event.target as HTMLDivElement;
    }

    if (!pianoEl || !pianoEl.dataset.note) return;

    pianoEl.classList.remove('piano-key-active');
    setPlayed(played.filter((n) => n !== pianoEl?.dataset.note));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      play(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      resetActive(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [played]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      play(event);
    }
  };

  return (
    <div className={`piano ${!isNotes ? '' : 'letters'}`} ref={pianoRef} onMouseUp={resetActive} onMouseOut={resetActive} onMouseMove={handleMouseMove}>
      <div className="piano-key" data-letter="D" data-note="c" onMouseDown={play}></div>
      <div className="piano-key" data-letter="F" data-note="d" onMouseDown={play}></div>
      <div className="piano-key" data-letter="G" data-note="e" onMouseDown={play}></div>
      <div className="piano-key" data-letter="H" data-note="f" onMouseDown={play}></div>
      <div className="piano-key" data-letter="J" data-note="g" onMouseDown={play}></div>
      <div className="piano-key" data-letter="K" data-note="a" onMouseDown={play}></div>
      <div className="piano-key" data-letter="L" data-note="b" onMouseDown={play}></div>
      <div className="keys-sharp">
        <div className="piano-key sharp" data-letter="R" data-note="c♯" onMouseDown={play}></div>
        <div className="piano-key sharp" data-letter="T" data-note="d♯" onMouseDown={play}></div>
        <div className="piano-key sharp none"></div>
        <div className="piano-key sharp" data-letter="U" data-note="f♯" onMouseDown={play}></div>
        <div className="piano-key sharp" data-letter="I" data-note="g♯" onMouseDown={play}></div>
        <div className="piano-key sharp" data-letter="O" data-note="a♯" onMouseDown={play}></div>
      </div>
    </div>
  );
};

export default Piano;
```

```typescript
// components/Footer.tsx
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

```typescript
// utils/soundMapper.ts
export const soundMapper: { [key: string]: HTMLAudioElement } = {
  c: new Audio(`./assets/audio/c.mp3`),
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
```

```css
/* App.css */
body {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  background-color: #e2e2e2;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.header-title {
  font-family: 'Open Sans Condensed', sans-serif;
  font-weight: 300;
  font-size: 2.5rem;
  margin: 0;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.btn-container {
  display: flex;
  margin-bottom: 20px;
}

.btn {
  background-color: #fff;
  border: none;
  color: #333;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #ddd;
}

.btn-active {
  background-color: #ddd;
}

.piano {
  display: flex;
  position: relative;
  width: 600px;
  height: 250px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 10px;
}

.piano-key {
  position: relative;
  width: 85px;
  height: 100%;
  background-color: #fff;
  border: 1px solid #333;
  border-radius: 0 0 5px 5px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;
}

.piano-key:hover {
  background-color: #f0f0f0;
}

.piano-key-active {
  background-color: #f0f0f0;
}

.piano-key::before {
  content: attr(data-note);
  font-size: 1.2rem;
  color: #333;
}

.piano.letters .piano-key::after {
  content: attr(data-letter);
  font-size: 1.2rem;
  color: #333;
  position: absolute;
  top: 10px;
}

.keys-sharp {
  position: absolute;
  top: 0;
  left: 57px;
  display: flex;
  width: 510px;
  height: 60%;
}

.sharp {
  width: 57px;
  background-color: #333;
  color: #fff;
  z-index: 1;
}

.sharp::before {
  color: #fff;
}

.sharp:hover {
  background-color: #555;
}

.sharp.piano-key-active {
  background-color: #555;
}

.none {
  visibility: hidden;
}

.fullscreen {
  background-color: #fff;
  border: none;
  color: #333;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  background-repeat: no-repeat;
  background-position: center;
  width: 48px;
  height: 48px;
}

.openfullscreen {
  background-image: url(./assets/fullscreen.svg);
}

.exitfullscreen {
  background-image: url(./assets/exitfullscreen.svg);
}

.fullscreen:hover {
  background-color: #ddd;
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.footer-container {
  font-size: 1rem;
}
```

```
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&family=Open+Sans:wght@300;400;800&display=swap"
      rel="stylesheet"
    />
    <title>virtual-piano</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### Tokens: {'input_tokens': 1598, 'output_tokens': 3328}
### Execution time: 78.94059419631958
