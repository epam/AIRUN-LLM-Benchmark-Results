import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastItemComponent } from './podcast-item.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [PodcastItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [PodcastItemComponent]
})
export class PodcastItemModule { }