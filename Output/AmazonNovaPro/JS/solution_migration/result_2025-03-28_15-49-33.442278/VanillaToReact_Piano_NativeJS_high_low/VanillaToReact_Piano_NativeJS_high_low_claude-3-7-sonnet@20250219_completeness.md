# Evaluation Report

- **Pass** (100%): Verify the application renders a header with the title 'Virtual Piano'
  
  The provided code clearly includes a header component with the title "Virtual Piano":
  ```tsx
  <header className="header">
    <h1 className="header-title">Virtual Piano</h1>
  </header>
  ```

- **Pass** (100%): Confirm the application includes a button container with 'Notes' and 'Letters' toggle buttons
  
  The code includes a button container with the two required toggle buttons:
  ```tsx
  <div className="btn-container">
    <button className={`btn btn-notes ${!isLetters ? 'btn-active' : ''}`} onClick={change}>Notes</button>
    <button className={`btn btn-letters ${isLetters ? 'btn-active' : ''}`} onClick={change}>Letters</button>
  </div>
  ```

- **Pass** (100%): Verify the piano component renders all piano keys (natural and sharp keys)
  
  The code renders both natural keys and sharp keys within the piano component:
  ```tsx
  <div className={`piano ${isLetters ? 'letters' : ''}`}>
    {['D-c', 'F-d', 'G-e', 'H-f', 'J-g', 'K-a', 'L-b'].map(([letter, note]) => (
      <div key={letter} className="piano-key" data-letter={letter} data-note={note}
        onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}
        onMouseMove={(e: React.MouseEvent) => e.buttons === 1 && play(e)}></div>
    ))}
    <div className="keys-sharp">
      {['R-c♯', 'T-d♯', '-e♯', 'U-f♯', 'I-g♯', 'O-a♯'].map(([letter, note]) => (
        <div key={letter || note} className={`piano-key sharp ${!note ? 'none' : ''}`} data-letter={letter} data-note={note}
          onMouseDown={play} onMouseUp={resetActive} onMouseOut={resetActive}
          onMouseMove={(e: React.MouseEvent) => e.buttons === 1 && play(e)}></div>
      ))}
    </div>
  </div>
  ```

- **Pass** (100%): Ensure each piano key has appropriate data attributes for letters and notes
  
  Each piano key, both natural and sharp, includes the required data attributes:
  ```tsx
  data-letter={letter} data-note={note}
  ```

- **Pass** (100%): Verify the application plays the correct audio when piano keys are clicked
  
  The code includes a sound mapper and logic to play the correct audio when a key is activated:
  ```tsx
  const soundMapper: SoundMap = {
    c: new Audio(`${process.env.PUBLIC_URL}/assets/audio/a.mp3`),
    // other mappings...
  };
  
  // In the play function:
  const sound = soundMapper[note];
  sound.currentTime = 0;
  sound.play();
  ```

- **Pass** (100%): Confirm the application highlights keys when they are active (pressed)
  
  The application adds a CSS class to highlight active keys:
  ```tsx
  (target as HTMLElement).classList.add('piano-key-active');
  ```
  And removes it when the key is released:
  ```tsx
  (target as HTMLElement).classList.remove('piano-key-active');
  ```

- **Pass** (100%): Verify the application responds to keyboard input to play corresponding piano notes
  
  The code adds keyboard event listeners to handle key presses:
  ```tsx
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => play(event);
    const handleKeyUp = (event: KeyboardEvent) => resetActive(event);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown',