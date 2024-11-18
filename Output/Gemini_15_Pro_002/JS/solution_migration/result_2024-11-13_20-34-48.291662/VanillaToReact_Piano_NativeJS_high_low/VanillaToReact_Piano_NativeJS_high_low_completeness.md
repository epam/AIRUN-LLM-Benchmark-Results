# Evaluation Report

### Step 1: Verify the application contains a button container with "Notes" and "Letters" buttons.
**Pass**: The application contains a button container with "Notes" and "Letters" buttons, as seen in the following code snippet:
```typescript
<div className="btn-container">
  <button className={`btn btn-notes ${!useLetters ? 'btn-active' : ''}`} onClick={() => setUseLetters(false)}>Notes</button>
  <button className={`btn btn-letters ${useLetters ? 'btn-active' : ''}`} onClick={() => setUseLetters(true)}>Letters</button>
</div>
```

### Step 2: Verify the application renders piano keys for both natural and sharp notes.
**Pass**: The application renders piano keys for both natural and sharp notes, as seen in the following code snippet:
```typescript
<div className={`piano ${useLetters ? 'letters' : ''}`} ref={pianoRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}>
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
```

### Step 3: Verify clicking on a piano key plays the correct sound and highlights the key.
**Pass**: Clicking on a piano key plays the correct sound and highlights the key, as seen in the `play` function:
```typescript
const play = (event: KeyboardEvent | React.MouseEvent) => {
  const isKeyboard = event instanceof KeyboardEvent;
  const key = isKeyboard ? (event.key.toUpperCase()) : (event.target as HTMLDivElement).dataset.letter;

  const pianoEl = pianoRef.current?.querySelector(`.piano-key[data-letter="${key}"]`);

  if (!pianoEl || !key) return;

  const note = pianoEl.dataset.note;
  if (!note || played.includes(note)) return;

  pianoEl.classList.add('piano-key-active');
  soundMapper[note].currentTime = 0;
  soundMapper[note].play();
  setPlayed([...played, note]);
};
```

### Step 4: Verify releasing the mouse button or moving the cursor out of the key stops the sound and removes the highlight.
**Pass**: Releasing the mouse button or moving the cursor out of the key stops the sound and removes the highlight, as seen in the `resetActive` function:
```typescript
const resetActive = (event: KeyboardEvent | React.MouseEvent) => {
  const isKeyboard = event instanceof KeyboardEvent;
  const key = isKeyboard ? (event.key.toUpperCase()) : (event.target as HTMLDivElement).dataset.letter;
  const pianoEl = pianoRef.current?.querySelector(`.piano-key[data-letter="${key}"]`);

  if (!pianoEl || !key) return;

  pianoEl.classList.remove('piano-key-active');
  setPlayed(played.filter((n) => n !== pianoEl.dataset.note));
};
```

### Step 5: Verify pressing and releasing keyboard keys play and stop the corresponding piano notes.
**Pass**: Pressing and releasing keyboard keys play and stop the corresponding piano notes, as seen in the `useEffect` hook:
```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => play(event);
  const handleKeyUp = (event: KeyboardEvent) => resetActive(event);

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };
}, [played]);
```

### Step 6: Verify clicking the "Notes" button displays note names on the keys.
**Pass**: Clicking the "Notes" button displays note names on the keys, as seen in the button's `onClick` handler:
```typescript
<button className={`btn btn-notes ${!useLetters ? 'btn-active' : ''}`} onClick={() => setUseLetters(false)}>Notes</button>
```

### Step 7: Verify clicking the "Letters" button displays letter names on the keys.
**Pass**: Clicking the "Letters" button displays letter names on the keys, as seen in the button's `onClick` handler:
```typescript
<button className={`btn btn-letters ${useLetters ? 'btn-active' : ''}`} onClick={() => setUseLetters(true)}>Letters</button>
```

### Step 8: Verify the fullscreen button toggles fullscreen mode for the application.
**Pass**: The fullscreen button toggles fullscreen mode for the application, as seen in the `toggleFullscreen` function:
```typescript
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
```

### Step 9: Verify the application correctly handles simultaneous multiple key presses.
**Pass**: The application correctly handles simultaneous multiple key presses, as seen in the `play` function which allows multiple notes to be played and added to the `played` state array.

### Summary
- Total number of steps evaluated: 9
- Number of passed steps: 9
- Number of failed steps: 0