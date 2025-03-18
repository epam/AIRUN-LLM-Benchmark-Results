import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ImageComponent } from './image.component';
import { ButtonsComponent } from './buttons.component';
import { PodcastItemComponent } from './podcast-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
    ButtonsComponent,
    PodcastItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]) // Define your routes here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }