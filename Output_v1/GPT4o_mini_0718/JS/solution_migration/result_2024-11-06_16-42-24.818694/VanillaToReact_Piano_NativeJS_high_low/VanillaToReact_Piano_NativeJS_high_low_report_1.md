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
```tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const soundMapper: { [key: string]: HTMLAudioElement } = {
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

const App: React.FC = () => {
    const [played, setPlayed] = useState<string[]>([]);
    const pianoRef = useRef<HTMLDivElement>(null);

    const play = (event: KeyboardEvent | React.MouseEvent) => {
        const isKeyboard = event instanceof KeyboardEvent;
        const key = isKeyboard ? event.key.toUpperCase() : (event.target as HTMLElement)?.dataset.letter;

        const pianoEl = pianoRef.current?.querySelector(`.piano-key[data-letter="${key}"]`);
        if (!pianoEl) return;

        const note = pianoEl.dataset.note;
        if (!note || played.includes(note)) return;

        pianoEl.classList.add('piano-key-active');
        const sound = soundMapper[note];
        sound.currentTime = 0;
        sound.play();
        setPlayed((prev) => [...prev, note]);
    };

    const resetActive = (event: KeyboardEvent | React.MouseEvent) => {
        const isKeyboard = event instanceof KeyboardEvent;
        const key = isKeyboard ? event.key.toUpperCase() : (event.target as HTMLElement)?.dataset.letter;

        const pianoEl = pianoRef.current?.querySelector(`.piano-key[data-letter="${key}"]`);
        if (!pianoEl) return;

        pianoEl.classList.remove('piano-key-active');
        setPlayed((prev) => prev.filter(note => note !== pianoEl.dataset.note));
    };

    const change = (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => button.classList.remove('btn-active'));
        event.currentTarget.classList.add('btn-active');

        if (event.currentTarget.classList.contains('btn-letters')) {
            pianoRef.current?.classList.add('letters');
        } else {
            pianoRef.current?.classList.remove('letters');
        }
    };

    const fullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', play);
        document.addEventListener('keyup', resetActive);
        pianoRef.current?.addEventListener('mousedown', play);
        pianoRef.current?.addEventListener('mouseup', resetActive);
        pianoRef.current?.addEventListener('mouseout', resetActive);
        pianoRef.current?.addEventListener('mousemove', (event: MouseEvent) => {
            if (event.buttons === 1) {
                play(event);
            }
        });

        return () => {
            document.removeEventListener('keydown', play);
            document.removeEventListener('keyup', resetActive);
        };
    }, [played]);

    return (
        <div>
            <header className="header">
                <h1 className="header-title">Virtual Piano</h1>
            </header>
            <main className="main">
                <div className="btn-container">
                    <button className="btn btn-notes btn-active" onClick={change}>Notes</button>
                    <button className="btn btn-letters" onClick={change}>Letters</button>
                </div>
                <div className="piano" ref={pianoRef}>
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
                <button className="fullscreen openfullscreen" onClick={fullscreen}></button>
            </main>
            <footer className="footer">
                <div className="footer-container">2020</div>
            </footer>
        </div>
    );
}

export default App;
```

```css
/* index.css */
body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
}

.header {
    text-align: center;
    background-color: #f8f8f8;
    padding: 20px 0;
}

.main {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn-container {
    margin-bottom: 20px;
}

.btn {
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;
}

.piano {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.piano-key {
    width: 40px;
    height: 200px;
    background: white;
    border: 1px solid #aaa;
    position: relative;
    margin: 0 1px;
}

.piano-key.sharp {
    width: 30px;
    background: black;
    height: 120px;
    margin-left: -15px; /* Overlap sharp keys */
    z-index: 1;
}

.piano-key-active {
    background-color: #ddd;
}

.footer {
    text-align: center;
    padding: 20px 0;
}
```

```json
// package.json (only relevant parts)
{
  "name": "virtual-piano",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-scripts": "5.0.0",
    "typescript": "^4.4.4"
  }
}
```

### Tokens: {'input_tokens': 1402, 'output_tokens': 1732, 'reasoning_tokens': 0}
### Execution time: 30.198575973510742
