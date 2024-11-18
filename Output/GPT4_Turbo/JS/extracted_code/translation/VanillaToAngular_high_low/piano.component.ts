import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent {
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
  showLetters = false;

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const method = event.type === 'keydown' ? 'play' : 'resetActive';
    this[method](event);
  }

  play(event: any) {
    const isKeyboard = event instanceof KeyboardEvent;
    const key = isKeyboard ? event.key.toUpperCase() : null;
    const note = isKeyboard ? key : event.target.dataset.note;
    if (!note || this.played.includes(note)) return;

    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${key}]`) : event.target;
    if (!pianoEl) return;

    pianoEl.classList.add('piano-key-active');
    const sound = this.soundMapper[note];
    sound.currentTime = 0;
    sound.play();
    this.played.push(note);
  }

  resetActive(event: any) {
    const isKeyboard = event instanceof KeyboardEvent;
    const key = isKeyboard ? event.key.toUpperCase() : null;
    const pianoEl = isKeyboard ? document.querySelector(`.piano-key[data-letter=${key}]`) : event.target;
    if (!pianoEl) return;

    pianoEl.classList.remove('piano-key-active');
    this.played = this.played.filter(note => note !== pianoEl.dataset.note);
  }

  toggleLetters() {
    this.showLetters = !this.showLetters;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}