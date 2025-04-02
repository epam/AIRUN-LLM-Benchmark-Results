import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-podcast-list',
  template: `
    <app-loading *ngIf="isLoading"></app-loading>
    <div *ngIf="!isLoading">
      <div class="lead" *ngIf="podcasts.length === 0">{{emptyMsg}}</div>
      <app-pager [page]="page" (onSelectPage)="onSelectPage.emit($event)" *ngIf="podcasts.length > 0"></app-pager>
      <app-podcast-item *ngFor="let podcast of podcasts" [podcast]="podcast" [isLoggedIn]="isLoggedIn" [showChannel]="showChannel" [searchQuery]="searchQuery"
        (toggleBookmark)="toggleBookmark.emit($event)" (toggleDetail)="toggleDetail.emit($event)" (togglePlayer)="togglePlayer.emit($event)">
      </app-podcast-item>
      <app-pager [page]="page" (onSelectPage)="onSelectPage.emit($event)" *ngIf="podcasts.length > 0"></app-pager>
    </div>
  `,
})
export class PodcastListComponent {
  @Input() actions: any;
  @Input() isLoggedIn: boolean;
  @Input() podcasts: any[];
  @Input() searchQuery: string;
  @Input() isLoading: boolean;
  @Input() ifEmpty: any;
  @Input() page: any;
  @Input() showChannel: boolean;
  @Output() onSelectPage = new EventEmitter<number>();
  @Output() toggleBookmark = new EventEmitter<any>();
  @Output() toggleDetail = new EventEmitter<any>();
  @Output() togglePlayer = new EventEmitter<any>();

  get emptyMsg(): string {
    return typeof this.ifEmpty === 'undefined' ? 'No podcasts found' : this.ifEmpty;
  }
}