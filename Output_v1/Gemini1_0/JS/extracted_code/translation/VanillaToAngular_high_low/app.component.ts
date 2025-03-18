import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  keys = [
    { letter: 'D', note: 'c', sharp: false },
    { letter: 'F', note: 'd', sharp: false },
    { letter: 'G', note: 'e', sharp: false },
    { letter: 'H', note: 'f', sharp: false },
    { letter: 'J', note: 'g', sharp: false },
    { letter: 'K', note: 'a', sharp: false },
    { letter: 'L', note: 'b', sharp: false },
    { letter: 'R', note: 'c♯', sharp: true },
    { letter: 'T', note: 'd♯', sharp: true },
    { letter: '', note: '', sharp: true },
    { letter: 'U', note: 'f♯', sharp: true },
    { letter: 'I', note: 'g♯', sharp: true },
    { letter: 'O', note: 'a♯', sharp: true },
  ];
  soundMapper = {
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
  played: string[] = [];

  play(key: { letter: string; note: string; sharp: boolean }) {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${key.letter}]`);
    if (!pianoEl) return;

    const note = pianoEl.dataset.note;
    if (!note || this.played.includes(note)) return;

    pianoEl.classList.add('piano-key-active');
    const sound = this.soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    this.played.push(note);
  }

  resetActive(key: { letter: string; note: string; sharp: boolean }) {
    const pianoEl = document.querySelector(`.piano-key[data-letter=${key.letter}]`);
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active');
    this.played = this.played.filter((note) => note !== pianoEl.dataset.note);
  }

  change(type: string) {
    document.querySelector('.btn-active')?.classList.remove('btn-active');
    const btn = document.querySelector(`.btn-${type}`);
    btn?.classList.add('btn-active');
    const piano = document.querySelector('.piano');
    if (type === 'letters') {
      piano?.classList.add('letters');
    } else {
      piano?.classList.remove('letters');
    }
  }

  fullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}