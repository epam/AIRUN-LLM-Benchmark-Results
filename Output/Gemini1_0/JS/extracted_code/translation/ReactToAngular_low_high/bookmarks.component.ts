import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Podcast } from '../models/podcast.model';
import { Page } from '../models/page.model';
import {
  getBookmarks,
  searchBookmarks,
} from '../actions/podcasts.actions';
import {
  selectBookmarks,
  selectPage,
  selectPodcasts,
  selectSearchQuery,
} from '../selectors/podcasts.selectors';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent implements OnInit {
  podcasts$: Observable<Podcast[]>;
  page$: Observable<Page>;
  searchQuery$: Observable<string>;

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.podcasts$ = this.store.select(selectPodcasts);
    this.page$ = this.store.select(selectPage);
    this.searchQuery$ = this.store.select(selectSearchQuery);
    this.store.dispatch(getBookmarks());
  }

  handleSearch(event: Event): void {
    event.preventDefault();
    const query = (event.target as HTMLFormElement).querySelector('input[type=search]')?.value.trim();
    if (query) {
      this.store.dispatch(searchBookmarks({ query }));
    } else {
      this.store.dispatch(getBookmarks());
    }
  }

  handleClearSearch(event: Event): void {
    event.preventDefault();
    (event.target as HTMLButtonElement).parentElement?.querySelector('input[type=search]')?.value = '';
    this.store.dispatch(getBookmarks());
  }

  handleSelectSearch(event: Event): void {
    event.preventDefault();
    (event.target as HTMLInputElement).select();
  }

  handleSelectPage(page: number): void {
    window.scrollTo(0, 0);
    this.store.dispatch(getBookmarks({ page }));
  }
}