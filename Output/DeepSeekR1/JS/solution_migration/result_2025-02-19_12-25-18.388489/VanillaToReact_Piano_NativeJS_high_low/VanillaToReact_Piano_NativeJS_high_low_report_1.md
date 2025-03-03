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

First, the HTML has a piano with keys that can be clicked or triggered by keyboard. The script.js handles events for playing sounds, toggling between notes and letters, and fullscreen mode. The React version should use functional components and hooks.

I'll start by setting up the project with Create React App and TypeScript. The main component will be App.tsx. I need to translate the HTML structure into JSX. The CSS classes will remain the same, so I'll import the existing CSS files.

Next, the state management. The original code uses a class to toggle between notes and letters. In React, I'll use useState to track whether letters are shown. The buttons for toggling can update this state.

For the piano keys, I'll map through an array of key data to generate the elements. The original has white and black (sharp) keys. I'll create two arrays: one for the white keys and another for the sharps. Each key will have data attributes for note and letter, which will be used in event handling.

Handling sounds: The original uses an object soundMapper with Audio elements. In React, I'll create a useRef to store these Audio objects to prevent reinitializing them on each render. The played array tracks which notes are playing; this can be a state variable, but in the original code, it's an array that's modified directly. However, since React state updates are asynchronous, maybe using a ref for played would be better to avoid stale closures in event handlers.

Event handlers for mouse and keyboard: The original has play and resetActive functions. In React, these will be wrapped into callbacks, using useCallback to memoize them. The keydown and keyup events need to be attached to the document, so I'll use useEffect to add and remove event listeners when the component mounts and unmounts.

The mousedown, mouseup, mouseout, and mousemove events on the piano keys will be handled in React's JSX with onMouseDown, onMouseUp, onMouseLeave, and onMouseMove props. The mousemove event checks if the button is pressed (event.buttons === 1), which should be translated correctly.

The fullscreen functionality uses the Fullscreen API. The original function is straightforward, and in React, it can be a regular function called by the button's onClick handler.

I also need to handle the active state of the piano keys. When a key is pressed, it adds a class 'piano-key-active'. In React, this can be managed by a state that tracks active notes, but since multiple keys can be active (e.g., during a mouse drag), perhaps using a Set stored in a ref would be more efficient. However, the original code uses a classList.add/remove, which directly manipulates the DOM. In React, it's better to control this via state. So each key's className can be conditionally set based on whether it's active.

Wait, but in the original code, the played array tracks notes that are currently playing. So in React, I can have a state variable activeNotes which is a Set of note strings. When a note is played, add it to the set; when released, remove it. Then, each key's className includes 'piano-key-active' if the note is in activeNotes.

But using state for this might cause re-renders for each key press, which could be okay. Alternatively, using refs to track active notes and then force update, but that's not ideal. Probably better to use state.

So, the play function will add the note to activeNotes, and resetActive will remove it. However, in the original code, the played array is used to prevent playing the same note multiple times if it's already in the array. Wait, looking at the play function: if the note is already in played, it returns early. So in React, the played array is tracked to prevent overlapping sounds. But in React, using state for played might not be efficient because state updates are asynchronous. So perhaps using a ref to track played notes would be better, since the play and resetActive functions need immediate access to the current played notes without waiting for a re-render.

So, I'll create a playedRef using useRef, which is an array of strings. When a note is played, it's added to playedRef.current, and when released, it's filtered out. This way, the checks and updates are synchronous.

Similarly, the soundMapper can be a ref that holds the Audio objects, initialized once.

Putting this together:

- Use useState for isLetters (toggled by the buttons) and activeNotes (to track which keys are visually active).
- Use useRef for soundMapper and played array.
- Event handlers for keyboard and mouse events.
- useEffect for adding/removing document event listeners.

Now, structuring the component:

The piano keys are generated from data. I'll create an array of white keys and sharp keys. Each key will have data attributes, and in React, these can be passed as props or data- attributes.

For the JSX structure, the main piano div has the white keys and the sharp keys positioned absolutely. The original CSS likely positions the sharps over the whites, so the structure should remain similar.

The buttons for Notes/Letters toggle the 'letters' class on the piano div. In React, this is controlled by the isLetters state, which adds the 'letters' class conditionally.

The fullscreen button's onClick handler calls the fullscreen function, same as before.

Testing for event handlers: The original handles both keyboard and mouse events. In React, the keyboard events are attached to the document, so useEffect with addEventListener is needed. The mouse events are attached to the piano keys via JSX props.

Wait, in the original code, the piano element has event listeners for mousedown, mouseup, etc. But in React, these events would be on individual keys. However, the original code uses event delegation, checking the target. In React, it's more efficient to attach handlers to each key, but that might require mapping each key with individual props. Alternatively, use event delegation by attaching the handlers to the piano container and using event.target, similar to the original.

But in React's synthetic event system, event.target is the actual DOM element, so it should work similarly. So, for the piano container, onMouseDown, onMouseUp, etc., can be handled, and then we check if the target is a piano-key.

But in the original code, the play function checks if the event target is a piano key. So in React, when handling onMouseDown on the piano container, we can check if the target element (via event.target) has the piano-key class. However, in React, event.target is a generic EventTarget, so we need to cast it to HTMLElement and check the class.

Alternatively, in React, each piano key can have its own onMouseDown and onMouseUp handlers, which might be cleaner. But that would require generating each key with individual handlers. Let's see: the white keys and sharp keys are generated from arrays, so when mapping, each key can have onClick (but for mouse down/up, perhaps onMouseDown and onMouseUp).

But the original code also handles the mousemove event when the mouse is dragged over keys while holding the button. So, attaching the onMouseDown to the piano container and then handling moves might be better, similar to the original.

Hmm, this is a bit tricky. Let me think: in the original, the piano element has a mousemove listener that checks if the mouse is moving with the button pressed (event.buttons === 1). When that happens, it triggers play(event). So in React, the onMouseMove event on the piano container can check if the button is pressed, and if so, trigger the play function.

But in React's onMouseMove, the event is a synthetic event. So the code would be similar.

So, the plan is:

- The piano container (div with class 'piano') will have onMouseDown, onMouseUp, onMouseLeave, and onMouseMove handlers.
- The play and resetActive functions will check if the event target is a piano key, similar to the original code.
- For keyboard events, useEffect will add event listeners to the document for 'keydown' and 'keyup', calling play and resetActive.

But in React, directly accessing the DOM via document.querySelector might not be the best approach. Instead, when handling keyboard events, we can find the corresponding key based on the data-letter attribute.

Wait, in the original code, when a keyboard event occurs, it queries the DOM for a piano key with data-letter matching the event key. In React, since the keys are rendered based on the data array, we can create a map from letter to note, and then find the corresponding key data.

Alternatively, in the play function for keyboard events, we can search the keys array to find the one with the matching data-letter, then proceed as before.

But perhaps it's better to have a map that associates letters to notes, so that when a key is pressed, we can quickly find the corresponding note and sound.

So, let's create a list of all keys (white and sharp) with their data-letter and data-note. Then, when a keyboard event occurs, we can find the key in this list that matches the event's key, and proceed.

But in React, the keys are rendered based on the data, so we can have a keys array that includes all the keys (white and sharp), and use that to generate the JSX and also for lookups.

So, first, define the keys data:

const whiteKeys = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharpKeys = [
  { letter: 'R', note: 'c♯' },
  { letter: 'T', note: 'd♯' },
  { letter: null, note: null }, // none
  { letter: 'U', note: 'f♯' },
  { letter: 'I', note: 'g♯' },
  { letter: 'O', note: 'a♯' },
];

Then, when rendering, loop through whiteKeys and sharpKeys to create the elements.

For the keyboard event handling, when a key is pressed (e.g., 'D'), we find the corresponding key in the whiteKeys or sharpKeys array, check if it exists, and then trigger the play function.

But in the original code, the play function uses the data-note to get the sound from soundMapper. So, in React, the process is similar: when a keyboard event occurs, find the key data by letter, then proceed.

Now, handling the active state: when a key is pressed, add the 'piano-key-active' class. In React, this can be managed by tracking active notes in a state variable, which is a Set. So, when a note is played, add it to the Set, and when released, remove it. Then, each key's className is conditionally set based on whether the note is in the active Set.

But using a Set in state can be tricky because updates are asynchronous. Alternatively, use a state array and update it with add/remove functions.

Wait, but the original code allows multiple notes to be played at once (if you press multiple keys). So the activeNotes should be a collection of currently active notes. Using a state array for activeNotes, and when a note is played, add it to the array if not already present, and remove it when released.

But in React's state updates, we need to ensure that we're updating the state correctly. For example, when playing a note:

setActiveNotes(prev => [...prev, note]);

But to prevent duplicates, we can check if the note is already in the array before adding.

Alternatively, use a Set and convert it to an array for state updates, but since React state should be immutable, we can create a new Set each time.

But perhaps using an array is simpler. So, in the play function, if the note is not in activeNotes, add it. In the resetActive function, remove it.

But the original code also checks if the note is already in the played array to prevent re-triggering the sound. So, in React, we need to track which notes are currently being played to avoid restarting the audio.

Wait, the original code's played array is used to prevent playing the same note again if it's already in the array. So, when a note is played, it's added to played, and when released, it's removed. The sound is only played if the note is not in played.

In React, to replicate this, we can use a ref to track the played notes, since the played array is accessed synchronously in event handlers, and we don't want to wait for state updates.

So, playedRef = useRef<string[]>([]);

When a note is played, check if playedRef.current includes it. If not, play the sound and add it to playedRef.current. When the note is released, filter it out.

This way, the checks are immediate and don't rely on state, which is asynchronous.

So, combining all these ideas:

- soundMapper is a ref that holds the Audio objects.
- playedRef is a ref that holds the currently playing notes.
- activeNotes is a state array that holds the notes for visual feedback.
- When a note is played, update playedRef and activeNotes.
- When a note is released, update both.

But wait, the original code adds the 'piano-key-active' class when the note is played and removes it on release. So, the visual state is tied to whether the note is in played. Therefore, in React, the activeNotes state can be derived from playedRef.current, but since React's rendering is based on state, we need to have a state that triggers re-renders when the active notes change.

Alternatively, use a state variable activeNotes that is updated whenever a note is played or released, which will trigger a re-render and update the class names.

But how to keep playedRef and activeNotes in sync? Because playedRef is for the audio logic, and activeNotes is for the visual.

Wait, in the original code, the played array is used to prevent audio from playing again, and the class is added/removed based on the same condition. So, in React, perhaps the playedRef can track the notes that are currently playing (for audio), and the activeNotes state can track the same for visual. But that's redundant. Alternatively, have a single source of truth.

Alternatively, when a note is played, add it to both playedRef.current and activeNotes state. When released, remove from both. But that would require two separate updates: one for the ref (synchronous) and one for the state (asynchronous).

This might complicate things. Maybe it's better to have the activeNotes state be the source of truth for both the visual and the audio. But then, when checking if the note is already playing, we have to read from the state, which is asynchronous and might not be up-to-date in event handlers.

Hmm, this is a bit of a problem. Because in the original code, the played array is checked synchronously. So, using a ref for played notes is necessary to prevent overlapping sounds. The visual feedback can be handled by a state, but the audio logic needs immediate access to the current played notes.

So, the plan is:

- playedRef: useRef<string[]>([]) to track notes currently playing (audio)
- activeNotes: useState<string[]>([]) to track notes for visual feedback

When a note is played:

1. Check if playedRef.current includes the note. If yes, return.
2. Add the note to playedRef.current.
3. Update activeNotes state to include the note.
4. Play the sound.

When a note is released:

1. Remove the note from playedRef.current.
2. Update activeNotes state to exclude the note.

This way, the audio logic uses the ref for immediate checks, and the visual state uses React's state to trigger re-renders.

But this requires that both playedRef and activeNotes are updated. For example, in the play function:

if (!playedRef.current.includes(note)) {
  playedRef.current = [...playedRef.current, note];
  setActiveNotes(prev => [...prev, note]);
  // play sound
}

In the resetActive function:

playedRef.current = playedRef.current.filter(n => n !== note);
setActiveNotes(prev => prev.filter(n => n !== note));

This should work, but it's a bit more code. However, it ensures that the audio logic is handled synchronously with the ref, and the visual state is updated via React's state.

Now, implementing the play function in React:

The play function can be a callback that handles both keyboard and mouse events. For keyboard events, the event is a KeyboardEvent, and we check the key. For mouse events, the event is a MouseEvent, and we check the target element.

In React, the event handlers for the piano container's onMouseDown, onMouseUp, etc., will receive synthetic events. For the keyboard events, the useEffect hook adds event listeners to the document, which receive native events.

So, the play function needs to handle both types of events. Let's create a handlePlay function that can take either a KeyboardEvent or a MouseEvent.

Wait, in React, the keyboard event handlers added via useEffect will receive the native event, while the mouse events from JSX will receive synthetic events. So, the function needs to determine the source of the event.

Alternatively, create separate handlers for keyboard and mouse events.

But to replicate the original code's logic, where the play function checks if the event is a KeyboardEvent, we can create a unified handler.

So, in the handlePlay function:

function handlePlay(event: KeyboardEvent | MouseEvent) {
  const isKeyboard = event instanceof KeyboardEvent;
  let note: string | undefined;
  let keyElement: HTMLElement | null = null;

  if (isKeyboard) {
    const key = event.key.toUpperCase();
    keyElement = document.querySelector(`.piano-key[data-letter="${key}"]`);
    note = keyElement?.dataset.note;
  } else {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    keyElement = target;
    note = keyElement.dataset.note;
  }

  if (!note || !keyElement) return;

  if (playedRef.current.includes(note)) return;

  // Add to playedRef and activeNotes
  playedRef.current = [...playedRef.current, note];
  setActiveNotes(prev => [...prev, note]);

  // Play the sound
  const sound = soundMapper.current[note];
  sound.currentTime = 0;
  sound.play().catch(error => console.error('Error playing sound:', error));
}

Similarly, the resetActive function:

function handleReset(event: KeyboardEvent | MouseEvent) {
  const isKeyboard = event instanceof KeyboardEvent;
  let note: string | undefined;
  let keyElement: HTMLElement | null = null;

  if (isKeyboard) {
    const key = event.key.toUpperCase();
    keyElement = document.querySelector(`.piano-key[data-letter="${key}"]`);
    note = keyElement?.dataset.note;
  } else {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    keyElement = target;
    note = keyElement.dataset.note;
  }

  if (!note || !keyElement) return;

  // Remove from playedRef and activeNotes
  playedRef.current = playedRef.current.filter(n => n !== note);
  setActiveNotes(prev => prev.filter(n => n !== note));
}

But using document.querySelector in React is not ideal, as it directly accesses the DOM. Instead, perhaps we can map the letters to notes in a data structure and look them up without querying the DOM.

Alternatively, create a map that associates letters to notes. For example:

const keyMap = {
  'D': 'c',
  'F': 'd',
  'G': 'e',
  'H': 'f',
  'J': 'g',
  'K': 'a',
  'L': 'b',
  'R': 'c♯',
  'T': 'd♯',
  'U': 'f♯',
  'I': 'g♯',
  'O': 'a♯',
};

Then, for a keyboard event, we can get event.key.toUpperCase(), check if it's in keyMap, and get the corresponding note.

This way, we avoid querying the DOM, which is better for React's declarative approach.

So, modifying the handlePlay function for keyboard events:

if (isKeyboard) {
  const key = event.key.toUpperCase();
  note = keyMap[key as keyof typeof keyMap];
  if (!note) return;
  // Find the key element based on data-letter
  keyElement = document.querySelector(`.piano-key[data-letter="${key}"]`);
} else {
  // handle mouse event
}

This reduces the dependency on DOM queries and uses a predefined map.

But we still need to get the keyElement to add the class. However, in React, the visual state is controlled by the activeNotes state, so the className of each key is based on whether the note is in activeNotes. Therefore, we don't need to directly manipulate the classList; instead, the className is set conditionally in the JSX.

Wait, yes! In React, each piano key's className is determined by whether its note is in activeNotes. So, instead of adding/removing classes via classList, we can conditionally apply the 'piano-key-active' class based on the activeNotes state.

Therefore, in the JSX for each piano key:

className={`piano-key ${isSharp ? 'sharp' : ''} ${activeNotes.includes(note) ? 'piano-key-active' : ''}`}

This way, whenever activeNotes changes, the component re-renders and updates the class names accordingly.

So, the keyElement manipulation is no longer needed; the visual state is entirely controlled by React's state. Therefore, in the handlePlay and handleReset functions, we don't need to query the DOM for the key element. Instead, we just need to update the activeNotes state and the playedRef.

This simplifies the code:

function handlePlay(event: KeyboardEvent | MouseEvent) {
  let note: string | undefined;
  const isKeyboard = event instanceof KeyboardEvent;

  if (isKeyboard) {
    const key = event.key.toUpperCase();
    note = keyMap[key as keyof typeof keyMap];
  } else {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    note = target.dataset.note;
  }

  if (!note || playedRef.current.includes(note)) return;

  playedRef.current = [...playedRef.current, note];
  setActiveNotes(prev => [...prev, note]);

  const sound = soundMapper.current[note];
  sound.currentTime = 0;
  sound.play().catch(error => console.error('Error playing sound:', error));
}

function handleReset(event: KeyboardEvent | MouseEvent) {
  let note: string | undefined;
  const isKeyboard = event instanceof KeyboardEvent;

  if (isKeyboard) {
    const key = event.key.toUpperCase();
    note = keyMap[key as keyof typeof keyMap];
  } else {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('piano-key')) return;
    note = target.dataset.note;
  }

  if (!note) return;

  playedRef.current = playedRef.current.filter(n => n !== note);
  setActiveNotes(prev => prev.filter(n => n !== note));
}

This approach removes the need to query the DOM for key elements, relying instead on the data and state.

Now, the keyMap is defined as:

const keyMap = {
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
} as const;

This ensures type safety in TypeScript.

Next, handling the mouse move event while the mouse button is pressed. The original code checks if event.buttons === 1 (left button pressed) during mousemove. In React, the onMouseMove event can be attached to the piano container, and in the handler, check if the buttons property is 1.

So, in the piano container's onMouseMove handler:

const handleMouseMove = (event: React.MouseEvent) => {
  if (event.buttons === 1) {
    handlePlay(event.nativeEvent);
  }
};

But since handlePlay expects a MouseEvent or KeyboardEvent, and event.nativeEvent is a native MouseEvent, this should work.

Now, putting it all together in the component:

- Use useState for isLetters and activeNotes.
- Use useRef for soundMapper and playedRef.
- Define the keyMap and keys data.
- useEffect for adding/removing keyboard event listeners.
- Render the piano keys based on the data, applying the 'piano-key-active' class if the note is in activeNotes.

The fullscreen functionality is handled by a button's onClick event, same as before.

Testing for edge cases: Ensure that sharp keys with no letter (the 'none' class) are rendered but not interactive. In the sharpKeys array, the third element has letter: null and note: null, so in the JSX, it should render a div without data attributes and with the 'none' class.

Also, the original CSS must be imported, so in React, the import './css/style.css' statement is needed.

Finally, the index.html's head content (like fonts and title) should be moved to the React app's public/index.html, but the user hasn't provided that, so assuming that the CSS and assets are placed appropriately in the React project structure.

Putting all this into code:

The App.tsx component will look like this:

Import React, useState, useRef, useEffect, useCallback.
Define the soundMapper as a ref.
Define the keyMap and keys data.
Set up event handlers.
Render the JSX structure.

Now, writing the code step by step.
</think>

**src/App.tsx**
```tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './css/style.css';

type KeyType = {
  letter: string | null;
  note: string | null;
  isSharp?: boolean;
};

const whiteKeys: KeyType[] = [
  { letter: 'D', note: 'c' },
  { letter: 'F', note: 'd' },
  { letter: 'G', note: 'e' },
  { letter: 'H', note: 'f' },
  { letter: 'J', note: 'g' },
  { letter: 'K', note: 'a' },
  { letter: 'L', note: 'b' },
];

const sharpKeys: KeyType[] = [
  { letter: 'R', note: 'c♯', isSharp: true },
  { letter: 'T', note: 'd♯', isSharp: true },
  { letter: null, note: null, isSharp: true },
  { letter: 'U', note: 'f♯', isSharp: true },
  { letter: 'I', note: 'g♯', isSharp: true },
  { letter: 'O', note: 'a♯', isSharp: true },
];

const keyMap: { [key: string]: string } = {
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

const soundExtensions: { [key: string]: string } = {
  'c♯': 'c%23',
  'd♯': 'd%23',
  'f♯': 'f%23',
  'g♯': 'g%23',
  'a♯': 'a%23',
};

function App() {
  const [isLetters, setIsLetters] = useState(false);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const playedRef = useRef<string[]>([]);
  const soundMapper = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c♯', 'd♯', 'f♯', 'g♯', 'a♯'];
    notes.forEach((note) => {
      const fileName = soundExtensions[note] || note;
      soundMapper.current[note] = new Audio(`./assets/audio/${fileName}.mp3`);
    });
  }, []);

  const handlePlay = useCallback((event: KeyboardEvent | MouseEvent) => {
    let note: string | undefined;
    
    if (event instanceof KeyboardEvent) {
      note = keyMap[event.key.toUpperCase()];
    } else {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('piano-key')) return;
      note = target.dataset.note;
    }

    if (!note || playedRef.current.includes(note)) return;

    playedRef.current = [...playedRef.current, note];
    setActiveNotes((prev) => [...prev, note]);

    const sound = soundMapper.current[note];
    sound.currentTime = 0;
    sound.play().catch((error) => console.error('Error playing sound:', error));
  }, []);

  const handleReset = useCallback((event: KeyboardEvent | MouseEvent) => {
    let note: string | undefined;

    if (event instanceof KeyboardEvent) {
      note = keyMap[event.key.toUpperCase()];
    } else {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('piano-key')) return;
      note = target.dataset.note;
    }

    if (!note) return;

    playedRef.current = playedRef.current.filter((n) => n !== note);
    setActiveNotes((prev) => prev.filter((n) => n !== note));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handlePlay(event);
    const handleKeyUp = (event: KeyboardEvent) => handleReset(event);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePlay, handleReset]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons === 1) {
      handlePlay(event.nativeEvent);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
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
        <div className={`piano ${isLetters ? 'letters' : ''}`}>
          <div className="keys-white">
            {whiteKeys.map(({ letter, note }) => (
              <div
                key={note}
                className={`piano-key ${activeNotes.includes(note!) ? 'piano-key-active' : ''}`}
                data-letter={letter}
                data-note={note}
                onMouseDown={handlePlay as any}
                onMouseUp={handleReset as any}
                onMouseLeave={handleReset as any}
              />
            ))}
          </div>
          <div className="keys-sharp">
            {sharpKeys.map(({ letter, note, isSharp }, index) => (
              <div
                key={index}
                className={`piano-key sharp ${!letter ? 'none' : ''} ${
                  note && activeNotes.includes(note) ? 'piano-key-active' : ''
                }`}
                data-letter={letter!}
                data-note={note!}
                onMouseDown={letter ? (handlePlay as any) : undefined}
                onMouseUp={letter ? (handleReset as any) : undefined}
                onMouseLeave={letter ? (handleReset as any) : undefined}
              />
            ))}
          </div>
        </div>
        <button className="fullscreen openfullscreen" onClick={toggleFullscreen} />
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
}

export default App;
```

### Tokens: {'input_tokens': 1423, 'output_tokens': 7295}
### Execution time: 143.28365397453308
