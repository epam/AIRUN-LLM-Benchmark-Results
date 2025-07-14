# Evaluation Report

- **Pass** (100%): Verify the application renders a header with the title 'Virtual Piano'.  
  The code includes a header section with a <code>&lt;h1 className="header-title"&gt;Virtual Piano&lt;/h1&gt;</code>, ensuring the title is rendered.

- **Pass** (100%): Confirm the application includes a button container with 'Notes' and 'Letters' toggle buttons.  
  The code contains a div with class <code>"btn-container"</code> and two buttons labeled "Notes" and "Letters" that update the <code>isLetters</code> state.

- **Pass** (100%): Verify the piano component renders all piano keys (natural and sharp keys).  
  The <code>App</code> component maps over the <code>whiteKeys</code> and <code>blackKeys</code> arrays to render natural keys and sharp keys respectively.

- **Pass** (100%): Ensure each piano key has appropriate data attributes for letters and notes.  
  Each key element is rendered with <code>data-letter</code> and <code>data-note</code> attributes. Even the sharp keys, although some may be rendered as “none” (empty attributes) when the key is not present, meet the requirement.

- **Pass** (100%): Verify the application plays the correct audio when piano keys are clicked.  
  The <code>handleMouseDown</code> event retrieves the note from the key’s data attributes, and <code>playSound</code> uses the <code>soundMapper</code> to play the corresponding audio.

- **Pass** (100%): Confirm the application highlights keys when they are active (pressed).  
  Active keys are tracked in the <code>activeNotes</code> state and rendered with the additional <code>'piano-key-active'</code> class when pressed.

- **Pass** (100%): Verify the application responds to keyboard input to play corresponding piano notes.  
  Keyboard events are listened to at the document level in a <code>useEffect</code>, and the keys are mapped using the <code>letterToNote</code> structure to trigger sound playback and visual activation.

- **Pass** (100%): Ensure the application toggles between displaying notes and letters when corresponding buttons are clicked.  
  The toggle buttons update the <code>isLetters</code> state, and the piano’s className dynamically includes “letters” when appropriate.

- **Pass** (100%): Verify the fullscreen button toggles the application between normal and fullscreen modes.  
  The <code>handleFullscreen</code> function checks the fullscreen state and calls the appropriate browser APIs (<code>requestFullscreen</code> and <code>exitFullscreen</code>) when the fullscreen button is clicked.

- **Pass** (100%): Confirm the application handles multiple simultaneous key presses correctly.  
  The design uses a Set (<code>activeNotes</code>) to support multiple active notes, and keyboard events check whether a note is already active before triggering playback, ensuring multiple keys can be activated concurrently.

- **Pass** (100%): Verify the application handles mouse drag functionality across piano keys.  
  The <code>handleMouseMove</code> event listens for mouse drags (when <code>e.buttons === 1</code>) and triggers audio playback and activation for newly hovered keys.

- **Pass** (100%): Ensure the application includes a footer with the year information.  
  The footer section in the code displays a <code>div</code> with the year "2020", fulfilling the requirement.

---

Total steps evaluated: 12  
Number of passed steps: 12  
Number of failed steps: 0