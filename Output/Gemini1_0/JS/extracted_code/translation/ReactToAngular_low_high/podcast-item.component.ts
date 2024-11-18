import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Podcast } from '../models/podcast.model';
import {
  formatListenDate,
  formatPubDate,
  highlight,
  sanitize,
} from '../utils';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss'],
})
export class PodcastItemComponent {
  @Input() podcast: Podcast = {} as Podcast;
  @Input() showChannel: boolean = false;
  @Input() showExpanded: boolean = false;
  @Input() searchQuery: string = '';
  @Input() isLoggedIn: boolean = false;
  @Input() showImage: boolean = false;

  @Output() togglePlayer = new EventEmitter<Podcast>();
  @Output() toggleBookmark = new EventEmitter<Podcast>();
  @Output() toggleDetail = new EventEmitter<Podcast>();

  get channelUrl(): string {
    return `/channel/${this.podcast.channelId}/`;
  }

  get podcastUrl(): string {
    return `/podcast/${this.podcast.id}/`;
  }

  get description(): any {
    return sanitize(highlight(this.podcast.description, this.searchQuery));
  }

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  formatListenDate(date: string): string {
    return formatListenDate(date);
  }

  formatPubDate(date: string): string {
    return formatPubDate(date);
  }
}