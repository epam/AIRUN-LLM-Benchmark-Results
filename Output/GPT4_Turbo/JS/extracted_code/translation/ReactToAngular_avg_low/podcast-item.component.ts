import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-podcast-item',
  template: `
    <div class="panel">
      <div class="text-center">
        <h4 *ngIf="showChannel; else titleLink">
          <a *ngIf="showExpanded; else title" [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a>
        </h4>
        <ng-template #titleLink><a [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a></ng-template>
        <ng-template #title>{{ podcast.title }}</ng-template>
        <div *ngIf="isLoggedIn && podcast.lastPlayedAt" class="text-center">
          <h5>
            <span class="label label-success">Listened {{ podcast.lastPlayedAt | date }}</span>
          </h5>
        </div>
        <div *ngIf="showImage" class="thumbnail">
          <div class="caption text-center">
            <h5><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
          </div>
          <a [routerLink]="['/channel', podcast.channelId]">
            <app-image [src]="podcast.image || '/static/podcast.png'" [errSrc]="'/static/podcast.png'" [imgProps]="{height: 60, width: 60, alt: podcast.name}"></app-image>
          </a>
        </div>
        <h5 *ngIf="!showImage"><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
      </div>
      <div style="padding: 10px;">
        <small>
          <time [attr.dateTime]="podcast.pubDate">{{ podcast.pubDate | date }}</time>&nbsp;
          <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
        </small>
        <app-buttons [isLoggedIn]="isLoggedIn" [podcast]="podcast" (togglePlayer)="togglePlayer.emit()" (toggleBookmark)="toggleBookmark.emit()"></app-buttons>
      </div>
      <button *ngIf="podcast.description && !showExpanded" class="form-control" (click)="toggleDetail.emit()" title="{{ podcast.isShowDetail ? 'Hide details' : 'Show details' }}">
        <i [ngClass]="podcast.isShowDetail ? 'chevron-up' : 'chevron-down'"></i>
      </button>
      <p *ngIf="podcast.description && (podcast.isShowDetail || showExpanded)" class="lead text-center" style="margin-top: 20px;" [innerHTML]="podcast.description"></p>
    </div>
  `,
  styles: []
})
export class PodcastItemComponent {
  @Input() podcast: any; // Define a more specific type based on your data structure
  @Input() isLoggedIn: boolean = false;
  @Input() showImage: boolean = false;
  @Input() showChannel: boolean = true;
  @Input() showExpanded: boolean = false;
  @Input() searchQuery: string = '';
  @Output() togglePlayer = new EventEmitter<void>();
  @Output() toggleDetail = new EventEmitter<void>();
  @Output() toggleBookmark = new EventEmitter<void>();
}