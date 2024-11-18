import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buttons',
  template: `
    <div class="btn-group" style="float: right;">
      <button (click)="togglePlayer.emit()" title="{{ podcast.isPlaying ? 'Stop' : 'Play' }}">
        <i [ngClass]="podcast.isPlaying ? 'stop' : 'play'"></i>
      </button>
      <a download title="Download this podcast" class="btn btn-default" [href]="podcast.enclosureUrl">
        <i class="download"></i>
      </a>
      <button *ngIf="isLoggedIn" (click)="toggleBookmark.emit()" title="{{ podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks' }}">
        <i [ngClass]="podcast.isBookmarked ? 'bookmark' : 'bookmark-o'"></i>
      </button>
    </div>
  `,
  styles: []
})
export class ButtonsComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() podcast: any; // Define a more specific type based on your data structure
  @Output() togglePlayer = new EventEmitter<void>();
  @Output() toggleBookmark = new EventEmitter<void>();
}