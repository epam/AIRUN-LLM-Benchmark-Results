import { useEffect, useRef, useState } from "react";
import "./App.css";

const soundMapper = {
  c: new Audio(`./assets/audio/a.mp3`),
  d: new Audio(`./assets/audio/d.mp3`),
  e: new Audio(`./assets/audio/e.mp3`),
  f: new Audio(`./assets/audio/f.mp3`),
  g: new Audio(`./assets/audio/g.mp3`),
  a: new Audio(`./assets/audio/a.mp3`),
  b: new Audio(`./assets/audio/b.mp3`),
  "c♯": new Audio(`./assets/audio/c♯.mp3`),
  "d♯": new Audio(`./assets/audio/d♯.mp3`),
  "f♯": new Audio(`./assets/audio/f♯.mp3`),
  "g♯": new Audio(`./assets/audio/g♯.mp3`),
  "a♯": new Audio(`./assets/audio/a♯.mp3`),
};

const App = () => {
  const [played, setPlayed] = useState<string[]>([]);
  const [isLetters, setIsLetters] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    const pianoEl = document.querySelector(
      `.piano-key[data-letter=${event.key.toUpperCase()}]`
    );
    if (!pianoEl) return;

    const note = pianoEl.dataset.note;
    if (!note || played.includes(note)) return;

    pianoEl.classList.add("piano-key-active");
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const pianoEl = document.querySelector(
      `.piano-key[data-letter=${event.key.toUpperCase()}]`
    );
    if (!pianoEl) return;

    pianoEl.classList.remove("piano-key-active");
    setPlayed((prev) => prev.filter((note) => note !== pianoEl.dataset.note));
  };

  const handlePianoClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    if (!pianoEl.classList.contains("piano-key")) return;

    const note = pianoEl.dataset.note;
    if (!note || played.includes(note)) return;

    pianoEl.classList.add("piano-key-active");
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  };

  const handlePianoMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    if (!pianoEl.classList.contains("piano-key")) return;

    pianoEl.classList.remove("piano-key-active");
    setPlayed((prev) => prev.filter((note) => note !== pianoEl.dataset.note));
  };

  const handlePianoMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;

    const pianoEl = event.target as HTMLDivElement;
    if (!pianoEl.classList.contains("piano-key")) return;

    const note = pianoEl.dataset.note;
    if (!note || played.includes(note)) return;

    pianoEl.classList.add("piano-key-active");
    const sound = soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    setPlayed((prev) => [...prev, note]);
  };

  const handlePianoMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    const pianoEl = event.target as HTMLDivElement;
    if (!pianoEl.classList.contains("piano-key")) return;

    pianoEl.classList.remove("piano-key-active");
    setPlayed((prev) => prev.filter((note) => note !== pianoEl.dataset.note));
  };

  const handleBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.target as HTMLButtonElement;
    if (!btn.classList.contains("btn")) return;

    const activeBtn = document.querySelector(".btn-active");
    if (activeBtn) activeBtn.classList.remove("btn-active");
    btn.classList.add("btn-active");

    if (btn.classList.contains("btn-letters")) {
      setIsLetters(true);
    } else {
      setIsLetters(false);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    const piano = document.querySelector(".piano");
    piano?.addEventListener("click", handlePianoClick);
    piano?.addEventListener("mouseup", handlePianoMouseUp);
    piano?.addEventListener("mousemove", handlePianoMouseMove);
    piano?.addEventListener("mouseout", handlePianoMouseOut);
    const btnContainer = document.querySelector(".btn-container");
    btnContainer?.addEventListener("click", handleBtnClick);
    const fullscreenButton = document.querySelector(".fullscreen");
    fullscreenButton?.addEventListener("click", handleFullscreen);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      piano?.removeEventListener("click", handlePianoClick);
      piano?.removeEventListener("mouseup", handlePianoMouseUp);
      piano?.removeEventListener("mousemove", handlePianoMouseMove);
      piano?.removeEventListener("mouseout", handlePianoMouseOut);
      btnContainer?.removeEventListener("click", handleBtnClick);
      fullscreenButton?.removeEventListener("click", handleFullscreen);
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Virtual Piano</h1>
      </header>
      <main className="main">
        <div className="btn-container">
          <button className="btn btn-notes btn-active">Notes</button>
          <button className="btn btn-letters">Letters</button>
        </div>
        <div className={`piano ${isLetters ? "letters" : ""}`}>
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
        <button className="fullscreen openfullscreen"></button>
      </main>
      <footer className="footer">
        <div className="footer-container">2020</div>
      </footer>
    </div>
  );
};

export default App;