import { Component, Input, OnInit } from '@angular/core';
import { Podcast } from '../models/podcast';
import { PodcastService } from '../services/podcast.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { TogglePlayerAction, ToggleBookmarkAction, ToggleDetailAction } from '../store/actions/podcast.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss']
})
export class PodcastItemComponent implements OnInit {
  @Input() podcast: Podcast;
  @Input() showChannel: boolean;
  @Input() showExpanded: boolean;
  @Input() searchQuery: string;
  @Input() showImage: boolean;
  description: any;
  isLoggedIn$: Observable<boolean>;

  constructor(private podcastService: PodcastService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.description = this.podcastService.sanitize(this.podcastService.highlight(this.podcast.description, this.searchQuery));
    this.isLoggedIn$ = this.store.select(state => state.auth.isLoggedIn);
  }

  togglePlayer() {
    this.store.dispatch(new TogglePlayerAction(this.podcast.id));
  }

  toggleBookmark() {
    this.store.dispatch(new ToggleBookmarkAction(this.podcast.id));
  }

  toggleDetail() {
    this.store.dispatch(new ToggleDetailAction(this.podcast.id));
  }

  formatListenDate(date: string) {
    return this.podcastService.formatListenDate(date);
  }
}