# Evaluation Report

- **Pass** (100%): Verify the application renders a header with the title 'Virtual Piano'  
  The Header component clearly outputs an <code>&lt;h1&gt;</code> element with the text "Virtual Piano".

- **Pass** (100%): Confirm the application includes a button container with 'Notes' and 'Letters' toggle buttons  
  The App component renders a <code>div.btn-container</code> containing two buttons labeled "Notes" and "Letters".

- **Pass** (100%): Verify the piano component renders all piano keys (natural and sharp keys)  
  The Piano component maps through an array for natural keys and another for sharp keys (with null filtering) to render all required keys.

- **Pass** (100%): Ensure each piano key has appropriate data attributes for letters and notes  
  The PianoKey component assigns both <code>data-letter</code> and <code>data-note</code> attributes to its div correctly.

- **Pass** (100%): Verify the application plays the correct audio when piano keys are clicked  
  The <code>playSound</code> function in the Piano component resets the audio and plays it based on the note associated with the clicked key.

- **Pass** (100%): Confirm the application highlights keys when they are active (pressed)  
  The PianoKey component conditionally includes the "piano-key-active" class when its <code>isActive</code> prop is true.

- **Pass** (100%): Verify the application responds to keyboard input to play corresponding piano notes  
  The Piano component adds <code>keydown</code> and <code>keyup</code> event listeners on the document to handle keyboard input corresponding to the specified notes.

- **Fail** (100%): Ensure the application toggles between displaying notes and letters when corresponding buttons are clicked  
  Although the App component manages a state (<code>isNotesActive</code>) for toggling between “Notes” and “Letters”, this state is not propagated to the Piano component. Instead, the Piano component uses its own internal state (<code>isLetters</code>) which is never updated based on the button clicks.

- **Pass** (100%): Verify the fullscreen button toggles the application between normal and fullscreen modes  
  The FullscreenButton component properly checks for a fullscreen element and toggles fullscreen using <code>requestFullscreen()</code> and <code>exitFullscreen()</code>.

- **Pass** (100%): Confirm the application handles multiple simultaneous key presses correctly  
  The implementation uses a state array <code>activeKeys</code> and conditionally plays a sound only if it’s not already playing, which supports handling of multiple distinct key presses simultaneously.

- **Fail** (100%): Verify the application handles mouse drag functionality across piano keys  
  While there is a <code>handleMouseMove</code> function declared, it is not attached to any element. This means that dragging the mouse over keys with the button pressed will not trigger continuous sound play as one might expect.

- **Pass** (100%): Ensure the application includes a footer with the year information  
  The Footer component outputs a <code>div</code> containing the text "2020" as year information.

---

Total steps evaluated: 12  
Number of passed steps: 10  
Number of failed steps: 2