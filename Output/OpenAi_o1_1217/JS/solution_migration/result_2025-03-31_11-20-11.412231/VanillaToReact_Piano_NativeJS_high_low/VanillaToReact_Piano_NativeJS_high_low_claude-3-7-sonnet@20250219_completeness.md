# Evaluation Report

- **Pass** (100%): Verify the application renders a header with the title 'Virtual Piano'
  
  The code includes a header section with the title 'Virtual Piano':
  ```jsx
  <header className="header">
    <h1 className="header-title">Virtual Piano</h1>
  </header>
  ```

- **Pass** (100%): Confirm the application includes a button container with 'Notes' and 'Letters' toggle buttons
  
  The code includes a button container with 'Notes' and 'Letters' toggle buttons:
  ```jsx
  <div className="btn-container">
    <button
      className={`btn btn-notes ${!showLetters ? 'btn-active' : ''}`}
      onClick={() => handleToggle(false)}
    >
      Notes
    </button>
    <button
      className={`btn btn-letters ${showLetters ? 'btn-active' : ''}`}
      onClick={() => handleToggle(true)}
    >
      Letters
    </button>
  </div>
  ```

- **Pass** (100%): Verify the piano component renders all piano keys (natural and sharp keys)
  
  The code renders both white (natural) and black (sharp) piano keys:
  ```jsx
  {/* White keys */}
  {pianoLayout.map(({ note, letter }, index) => {
    // White key rendering code
  })}

  {/* Sharp keys */}
  <div className="keys-sharp">
    {pianoSharps.map(({ note, letter, isSharp, hidden }, index) => {
      // Sharp key rendering code
    })}
  </div>
  ```

- **Pass** (100%): Ensure each piano key has appropriate data attributes for letters and notes
  
  Each piano key has data attributes for both notes and letters:
  ```jsx
  <div
    key={`white_${index}`}
    className={`piano-key ${isActive ? 'piano-key-active' : ''}`}
    data-note={note}
    data-letter={letter ?? ''}
    // Event handlers...
  >
    {/* Display content */}
  </div>
  ```

- **Pass** (100%): Verify the application plays the correct audio when piano keys are clicked
  
  The application has a `playNote` function that plays the correct audio when keys are clicked:
  ```jsx
  const playNote = (note: NoteName) => {
    // If this note is already active, do nothing
    if (activeNotes.has(note)) return;

    // Reset the audio clip from the start
    const sound = soundMapper[note];
    sound.currentTime = 0;
    void sound.play();

    // Add this note to the active set
    setActiveNotes((prev) => new Set(prev).add(note));
  };
  ```
  
  This function is called when piano keys are clicked via the `handleKeyMouseDown` event handler.

- **Pass** (100%): Confirm the application highlights keys when they are active (pressed)
  
  The code adds an active class to keys when they are pressed:
  ```jsx
  <div
    className={`piano-key ${isActive ? 'piano-key-active' : ''}`}
    // Other attributes...
  >
    {/* Content */}
  </div>
  ```
  
  The `isActive` state is managed through the `activeNotes` Set:
  ```jsx
  const isActive = activeNotes.has(note);
  ```

- **Pass** (100%): Verify the application responds to keyboard input to play corresponding piano notes
  
  The application handles keyboard events to play notes:
  ```jsx
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Uppercase the key so we can find matching letter in layout
    const letter = e.key.toUpperCase();
    // Attempt to find the corresponding note in pianoLayout or pianoSharps
    const foundKey =
      pianoLayout.find((p) => p.letter === letter) ||
      pianoSharps.find((p) => p.letter === letter);

    if (foundKey) {
      playNote(foundKey.note);
    