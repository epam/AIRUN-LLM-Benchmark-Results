import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bookmarks',
  template: `
    <app-page-header header="My bookmarks"></app-page-header>
    <form (submit)="handleSearch($event)">
      <!-- Search form content -->
    </form>
    <app-podcast-list [podcasts]="podcasts$ | async" [isLoading]="isLoading$ | async" [showChannel]="true" [isLoggedIn]="true" ifEmpty="No bookmarks found"
      (onSelectPage)="handleSelectPage($event)">
    </app-podcast-list>
  `,
})
export class BookmarksComponent {
  podcasts$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<any>) {
    // Initialize your observables here by selecting from the store
  }

  handleSearch(event: Event): void {
    event.preventDefault();
    // Dispatch search action
  }

  handleSelectPage(page: number): void {
    // Dispatch action to select page
  }
}