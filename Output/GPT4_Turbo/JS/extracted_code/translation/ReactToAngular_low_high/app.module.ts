import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { LoadingComponent } from './loading/loading.component';
import { PagerComponent } from './pager/pager.component';
import { PodcastItemComponent } from './podcast-item/podcast-item.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { ImageComponent } from './image/image.component';
import { IconComponent } from './icon/icon.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { reducers, metaReducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    PodcastListComponent,
    LoadingComponent,
    PagerComponent,
    PodcastItemComponent,
    PageHeaderComponent,
    BookmarksComponent,
    ImageComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }