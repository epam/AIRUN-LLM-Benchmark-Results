import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Podcast } from '../models/podcast.model';
import { Page } from '../models/page.model';
import {
  getBookmarks,
  getPodcasts,
  searchBookmarks,
  toggleBookmark,
  toggleDetail,
  togglePlayer,
} from '../actions/podcasts.actions';
import {
  selectBookmarks,
  selectIsLoading,
  selectPage,
  selectPodcasts,
  selectSearchQuery,
} from '../selectors/podcasts.selectors';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss'],
})
export class PodcastListComponent implements OnInit {
  @Input() ifEmpty?: string;
  @Input() showChannel?: boolean;

  podcasts$: Observable<Podcast[]>;
  page$: Observable<Page>;
  isLoading$: Observable<boolean>;
  searchQuery$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.podcasts$ = this.store.select(selectPodcasts);
    this.page$ = this.store.select(selectPage);
    this.isLoading$ = this.store.select(selectIsLoading);
    this.searchQuery$ = this.store.select(selectSearchQuery);
    this.isLoggedIn$ = this.store.select(selectBookmarks);
  }

  onSelectPage(page: number): void {
    window.scrollTo(0, 0);
    this.store.dispatch(getPodcasts({ page }));
  }

  togglePlayer(podcast: Podcast): void {
    this.store.dispatch(togglePlayer({ podcast }));
  }

  toggleBookmark(podcast: Podcast): void {
    this.store.dispatch(toggleBookmark({ podcast }));
  }

  toggleDetail(podcast: Podcast): void {
    this.store.dispatch(toggleDetail({ podcast }));
  }
}