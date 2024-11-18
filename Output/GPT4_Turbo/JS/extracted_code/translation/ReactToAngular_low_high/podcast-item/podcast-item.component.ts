import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-podcast-item',
  template: `
    <div class="panel">
      <div class="text-center">
        <h4 *ngIf="showChannel">
          <a *ngIf="showExpanded; else titleLink" href="#">{{podcast.title}}</a>
          <ng-template #titleLink><a [routerLink]="['/podcast', podcast.id]">{{podcast.title}}</a></ng-template>
        </h4>
        <!-- Other elements -->
      </div>
      <!-- Other elements -->
    </div>
  `,
})
export class PodcastItemComponent {
  @Input() podcast: any;
  @Input() isLoggedIn: boolean;
  @Input() showChannel: boolean;
  @Input() showExpanded: boolean;
  @Input() searchQuery: string;
  @Input() showImage: boolean;
  @Output() toggleBookmark = new EventEmitter<any>();
  @Output() toggleDetail = new EventEmitter<any>();
  @Output() togglePlayer = new EventEmitter<any>();
}