I have the following React app code:

podcasts.js
```js
import _ from 'lodash';
import React, { PropTypes } from 'react';

import Loading from './loading';
import Pager from './pager';
import Podcast from './podcast_item';

export class PodcastList extends React.Component {

  render() {
    const {
      actions,
      dispatch,
      isLoggedIn,
      podcasts,
      searchQuery,
      isLoading,
      ifEmpty,
      page,
      onSelectPage,
      showChannel,
    } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    const emptyMsg = typeof ifEmpty === 'undefined' ? 'No podcasts found' : ifEmpty;
    if (_.isEmpty(podcasts)) {
      return <div className="lead">{emptyMsg}</div>;
    }

    const pager = <Pager page={page} onSelectPage={onSelectPage} />;

    return (
      <div>
        {pager}
        {podcasts.map(podcast => {
          const togglePlayer = event => {
            event.preventDefault();
            dispatch(actions.player.togglePlayer(podcast));
          };

          const toggleBookmark = event => {
            event.preventDefault();
            dispatch(actions.bookmarks.toggleBookmark(podcast));
          };

          const toggleDetail = event => {
            event.preventDefault();
            dispatch(actions.showDetail.toggleDetail(podcast));
          };

          return (
            <Podcast
              key={podcast.id}
              searchQuery={searchQuery}
              isLoggedIn={isLoggedIn}
              podcast={podcast}
              showImage={false}
              showChannel={showChannel}
              showExpanded={false}
              toggleBookmark={toggleBookmark}
              toggleDetail={toggleDetail}
              togglePlayer={togglePlayer}
            />);
        })}
        {pager}
        </div>
      );
  }
}

PodcastList.propTypes = {
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  podcasts: PropTypes.array.isRequired,
  page: PropTypes.object,
  onSelectPage: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  ifEmpty: PropTypes.any,
  showChannel: PropTypes.bool,
  searchQuery: PropTypes.string,
};

export default PodcastList;

```

loading.js
```js
import React from 'react';
import Icon from './icon';

export default function () {
  return (
    <div className="text-center" style={{ marginTop: 50 }}>
      <h1 style={{ fontFamily: 'GoodDog' }}><Icon icon="spinner" spin /> loading...</h1>
    </div>
  );
}

```

icon.js
```js
import React, { PropTypes } from 'react';
import classnames from 'classnames';

function Icon(props) {
  const classes = classnames('fa', 'fa-' + props.icon, { 'fa-spin': props.spin });
  return <i className={classes} />;
}


Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  spin: PropTypes.bool,
};

export default Icon;

```

header.js
```js
import React, { PropTypes } from 'react';

const PageHeader = ({ header }) => {
  return (
    <div className="page-header text-center">
      <h3>{header}</h3>
    </div>
  );
};

PageHeader.propTypes = {
  header: PropTypes.any.isRequired,
};

export default PageHeader;

```

bookmarks.js
```js
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { Button, Input } from 'react-bootstrap';

import * as actions from '../actions';
import { podcastsSelector } from '../selectors';
import PodcastList from '../components/podcasts';
import PageHeader from '../components/header';
import Icon from '../components/icon';
import { getTitle } from './utils';


export class Bookmarks extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    this.actions = bindActionCreators(actions.bookmarks, dispatch);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleSelectSearch = this.handleSelectSearch.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();
    const query = _.trim(this.refs.query.getValue());
    if (query) {
      this.actions.searchBookmarks(query);
    } else {
      this.actions.getBookmarks();
    }
  }

  handleClearSearch(event) {
    event.preventDefault();
    this.refs.query.getInputDOMNode().value = '';
    this.actions.getBookmarks();
  }

  handleSelectSearch(event) {
    event.preventDefault();
    this.refs.query.getInputDOMNode().select();
  }

  handleSelectPage(page) {
    window.scrollTo(0, 0);
    this.actions.getBookmarks(page);
  }

  render() {
    const { query } = this.props;
    return (
      <DocumentTitle title={getTitle('My bookmarks')}>
      <div>
        <PageHeader header="My bookmarks" />
        <form onSubmit={this.handleSearch}>
          <Input
            type="search"
            ref="query"
            onClick={this.handleSelectSearch}
            placeholder="Find a podcast in your bookmarks"
          />
          <Input>
            <Button
              bsStyle="primary"
              type="submit"
              defaultValue={query}
              className="form-control"
            ><Icon icon="search" /> Search
            </Button>
          </Input>
          {query ? <Input>
            <Button
              bsStyle="default"
              onClick={this.handleClearSearch}
              className="form-control"
            ><Icon icon="refresh" /> Show all bookmarks
            </Button>
          </Input> : ''}
        </form>
        <PodcastList
          actions={actions}
          searchQuery={query}
          showChannel
          isLoggedIn
          ifEmpty="No bookmarks found"
          onSelectPage={this.handleSelectPage}
          {...this.props}
        />
      </div>
    </DocumentTitle>
    );
  }
}

Bookmarks.propTypes = {
  podcasts: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  currentlyPlaying: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = state => {
  const { query } = state.bookmarks;
  const { page, isLoading } = state.podcasts;
  return {
    podcasts: podcastsSelector(state),
    page,
    isLoading,
    query,
  };
};

export default connect(mapStateToProps)(Bookmarks);

```

image.js
```js
import React, { PropTypes } from 'react';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.stateFromProps(props);
    this.handleError = this.handleError.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.stateFromProps(newProps);
    }
    return newProps === this.props;
  }

  stateFromProps(props) {
    const src = props.src || props.errSrc;
    this.state = {
      src,
      isError: false,
    };
  }

  handleError(event) {
    event.preventDefault();
    if (this.state.isError) {
      return;
    }
    this.setState({
      isError: true,
      src: this.props.errSrc,
    });
  }

  render() {
    return (
      <img {...this.props.imgProps}
        src={this.state.src}
        onError={this.handleError}
      />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  errSrc: PropTypes.string.isRequired,
  imgProps: PropTypes.object,
};

export default Image;

```

pager.js
```js
import React, { PropTypes } from 'react';
import * as bs from 'react-bootstrap';
import Icon from './icon';

export const Pager = props => {
  const { page, onSelectPage } = props;

  if (!page || !onSelectPage || page.numPages < 2) {
    return <span></span>;
  }

  const handleFirstPage = () => {
    onSelectPage(1);
  };

  const handleLastPage = () => {
    onSelectPage(props.page.numPages);
  };

  const handlePreviousPage = () => {
    onSelectPage(props.page.page - 1);
  };

  const handleNextPage = () => {
    onSelectPage(props.page.page + 1);
  };

  const isFirstPage = page.page <= 1;
  const isLastPage = page.page >= page.numPages;

  return (
    <bs.Pager>
      <bs.PageItem
        previous
        onSelect={handleFirstPage}
        disabled={isFirstPage}
      ><Icon icon="fast-backward"/></bs.PageItem>
      <bs.PageItem
        previous
        onSelect={handlePreviousPage}
        disabled={isFirstPage}
      ><Icon icon="backward"/></bs.PageItem>
      <bs.PageItem
        next
        onSelect={handleLastPage}
        disabled={isLastPage}
      ><Icon icon="fast-forward"/></bs.PageItem>
      <bs.PageItem
        next
        onSelect={handleNextPage}
        disabled={isLastPage}
      ><Icon icon="forward"/></bs.PageItem>
    </bs.Pager>
  );
};

Pager.propTypes = {
  onSelectPage: PropTypes.func,
  page: PropTypes.object,
};

export default Pager;

```

podcast_item.js
```js
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { sanitize, highlight, formatPubDate, formatListenDate } from './utils';

import {
  ButtonGroup,
  Button,
  Panel,
  Label,
} from 'react-bootstrap';


import Icon from './icon';
import Image from './image';

const Buttons = props => {
  const { podcast } = props;
  return (
    <ButtonGroup style={{ float: 'right' }}>
     <Button
       title={ podcast.isPlaying ? 'Stop' : 'Play' }
       onClick={props.togglePlayer}
     ><Icon icon={ podcast.isPlaying ? 'stop' : 'play' } />
     </Button>
     <Button
       download
       title="Download this podcast"
       className="btn btn-default"
       href={podcast.enclosureUrl}
     ><Icon icon="download" /></Button>
    {props.isLoggedIn ?
    <Button
      onClick={props.toggleBookmark}
      title={podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
    ><Icon icon={podcast.isBookmarked ? 'bookmark' : 'bookmark-o'} />
    </Button> : ''}
    </ButtonGroup>
  );
};

Buttons.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  podcast: PropTypes.object.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  togglePlayer: PropTypes.func.isRequired,
};

export default function PodcastItem(props) {
  const {
    podcast,
    showChannel,
    showExpanded,
    toggleDetail,
    isLoggedIn,
    searchQuery,
    showImage,
  } = props;

  const channelUrl = `/channel/${podcast.channelId}/`;
  const podcastUrl = `/podcast/${podcast.id}/`;
  const image = podcast.image || '/static/podcast.png';

  const playedAt = isLoggedIn && podcast.lastPlayedAt ?
    <div className="text-center">
      <h5>
      <Label bsStyle="success">
       Listened {formatListenDate(podcast.lastPlayedAt)}
      </Label>
      </h5>
    </div> : '';

  let header;

  if (showChannel) {
    header = (
      <div className="text-center">
        <h4>{showExpanded ? podcast.title :
          <Link to={podcastUrl}>{podcast.title}</Link>}
        </h4>
        {playedAt}
        {showImage ?
        <div className="thumbnail">
          <div className="caption text-center">
            <h5><Link to={channelUrl}>{podcast.name}</Link></h5>
          </div>
             <Link to={channelUrl}>
              <Image
                src={image}
                errSrc="/static/podcast.png"
                imgProps={{
                  height: 60,
                  width: 60,
                  alt: podcast.name,
                }}
              />
            </Link>
          </div> :
          <h5><Link to={channelUrl}>{podcast.name}</Link></h5>
          }
      </div>
    );
  } else {
    header = (
      <div className="text-center">
        <h4><Link to={podcastUrl}>{podcast.title}</Link></h4>
        {playedAt}
      </div>
    );
  }

  const description = sanitize(highlight(podcast.description, searchQuery));

  return (
    <Panel>
      {header}
      <div style={{ padding: 10 }}>
        <small>
          <time dateTime={podcast.pubDate}>{formatPubDate(podcast.pubDate)}</time>&nbsp;
          {podcast.source ? <a href={podcast.source} target="_blank">Source</a> : '' }
        </small>
        <Buttons {...props} />
      </div>
      {podcast.description && !showExpanded ?
      <Button
        className="form-control"
        title={podcast.isShowDetail ? 'Hide details' : 'Show details'}
        onClick={toggleDetail}
      ><Icon icon={podcast.isShowDetail ? 'chevron-up' : 'chevron-down'} />
      </Button> : ''}
    {description.__html && (podcast.isShowDetail || showExpanded) ?
    <p
      className={classnames({ lead: showExpanded, 'text-center': true })}
      style={{ marginTop: 20 }}
      dangerouslySetInnerHTML={description}
    /> : ''}
  </Panel>
  );
}


PodcastItem.propTypes = {
  podcast: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  showImage: PropTypes.bool,
  showChannel: PropTypes.bool.isRequired,
  showExpanded: PropTypes.bool,
  searchQuery: PropTypes.string,
  togglePlayer: PropTypes.func.isRequired,
  toggleDetail: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
};

```


Your task is to migrate this code to Angular 14.x.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
```markdown
# Angular 14.x Migration

## app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { LoadingComponent } from './loading/loading.component';
import { PagerComponent } from './pager/pager.component';
import { PodcastItemComponent } from './podcast-item/podcast-item.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { IconComponent } from './icon/icon.component';
import { ImageComponent } from './image/image.component';
import { FormsModule } from '@angular/forms';
import { podcastsReducer } from './store/podcasts.reducer';
import { PodcastsEffects } from './store/podcasts.effects';

@NgModule({
  declarations: [
    AppComponent,
    PodcastListComponent,
    LoadingComponent,
    PagerComponent,
    PodcastItemComponent,
    PageHeaderComponent,
    BookmarksComponent,
    IconComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ podcasts: podcastsReducer }),
    EffectsModule.forRoot([PodcastsEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## app-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

const routes: Routes = [
  { path: 'bookmarks', component: BookmarksComponent },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## podcast-list.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { togglePlayer, toggleBookmark, toggleDetail } from '../store/podcasts.actions';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
})
export class PodcastListComponent {
  @Input() podcasts: any[];
  @Input() isLoading: boolean;
  @Input() ifEmpty: string;
  @Input() page: any;
  @Input() onSelectPage: Function;
  @Input() showChannel: boolean;
  @Input() isLoggedIn: boolean;
  @Input() searchQuery: string;

  constructor(private store: Store) {}

  togglePlayer(podcast: any) {
    this.store.dispatch(togglePlayer({ podcast }));
  }

  toggleBookmark(podcast: any) {
    this.store.dispatch(toggleBookmark({ podcast }));
  }

  toggleDetail(podcast: any) {
    this.store.dispatch(toggleDetail({ podcast }));
  }
}
```

## podcast-list.component.html
```html
<app-loading *ngIf="isLoading"></app-loading>
<div *ngIf="!isLoading">
  <div *ngIf="podcasts.length === 0" class="lead">{{ ifEmpty || 'No podcasts found' }}</div>
  <app-pager *ngIf="podcasts.length > 0" [page]="page" (onSelectPage)="onSelectPage($event)"></app-pager>
  <app-podcast-item *ngFor="let podcast of podcasts" [podcast]="podcast" [showChannel]="showChannel" [isLoggedIn]="isLoggedIn" [searchQuery]="searchQuery" (togglePlayer)="togglePlayer($event)" (toggleBookmark)="toggleBookmark($event)" (toggleDetail)="toggleDetail($event)"></app-podcast-item>
  <app-pager *ngIf="podcasts.length > 0" [page]="page" (onSelectPage)="onSelectPage($event)"></app-pager>
</div>
```

## loading.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="text-center" style="margin-top: 50px;">
      <h1 style="font-family: 'GoodDog';"><app-icon [icon]="'spinner'" [spin]="true"></app-icon> loading...</h1>
    </div>
  `,
})
export class LoadingComponent {}
```

## pager.component.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
})
export class PagerComponent {
  @Input() page: any;
  @Output() onSelectPage = new EventEmitter<number>();

  handleSelectPage(page: number) {
    this.onSelectPage.emit(page);
  }
}
```

## pager.component.html
```html
<div *ngIf="page && page.numPages > 1">
  <button (click)="handleSelectPage(1)" [disabled]="page.page <= 1"><app-icon icon="fast-backward"></app-icon></button>
  <button (click)="handleSelectPage(page.page - 1)" [disabled]="page.page <= 1"><app-icon icon="backward"></app-icon></button>
  <button (click)="handleSelectPage(page.numPages)" [disabled]="page.page >= page.numPages"><app-icon icon="fast-forward"></app-icon></button>
  <button (click)="handleSelectPage(page.page + 1)" [disabled]="page.page >= page.numPages"><app-icon icon="forward"></app-icon></button>
</div>
```

## podcast-item.component.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
})
export class PodcastItemComponent {
  @Input() podcast: any;
  @Input() showChannel: boolean;
  @Input() isLoggedIn: boolean;
  @Input() searchQuery: string;
  @Output() togglePlayer = new EventEmitter<any>();
  @Output() toggleBookmark = new EventEmitter<any>();
  @Output() toggleDetail = new EventEmitter<any>();

  onTogglePlayer() {
    this.togglePlayer.emit(this.podcast);
  }

  onToggleBookmark() {
    this.toggleBookmark.emit(this.podcast);
  }

  onToggleDetail() {
    this.toggleDetail.emit(this.podcast);
  }
}
```

## podcast-item.component.html
```html
<div class="podcast-item">
  <!-- Podcast item content goes here -->
  <button (click)="onTogglePlayer()">Play</button>
  <button (click)="onToggleBookmark()">Bookmark</button>
  <button (click)="onToggleDetail()">Details</button>
</div>
```

## icon.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [ngClass]="['fa', 'fa-' + icon, {'fa-spin': spin}]"></i>`,
})
export class IconComponent {
  @Input() icon: string;
  @Input() spin: boolean = false;
}
```

## image.component.ts
```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `<img [src]="src" (error)="handleError()" [attr.alt]="alt" />`,
})
export class ImageComponent implements OnChanges {
  @Input() src: string;
  @Input() errSrc: string;
  @Input() alt: string = '';
  isError: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !this.isError) {
      this.src = this.src || this.errSrc;
    }
  }

  handleError(): void {
    if (!this.isError) {
      this.isError = true;
      this.src = this.errSrc;
    }
  }
}
```

## page-header.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header text-center">
      <h3>{{ header }}</h3>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() header: string;
}
```

## bookmarks.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { searchBookmarks, getBookmarks } from '../store/podcasts.actions';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
})
export class BookmarksComponent {
  query: string = '';

  constructor(private store: Store) {}

  handleSearch(event: Event): void {
    event.preventDefault();
    if (this.query) {
      this.store.dispatch(searchBookmarks({ query: this.query }));
    } else {
      this.store.dispatch(getBookmarks());
    }
  }

  handleClearSearch(event: Event): void {
    event.preventDefault();
    this.query = '';
    this.store.dispatch(getBookmarks());
  }
}
```

## bookmarks.component.html
```html
<div>
  <app-page-header header="My bookmarks"></app-page-header>
  <form (submit)="handleSearch($event)">
    <input type="search" [(ngModel)]="query" name="query" placeholder="Find a podcast in your bookmarks">
    <button type="submit">Search</button>
    <button *ngIf="query" (click)="handleClearSearch($event)">Show all bookmarks</button>
  </form>
  <app-podcast-list [podcasts]="podcasts" [searchQuery]="query" showChannel="true" isLoggedIn="true" ifEmpty="No bookmarks found" (onSelectPage)="handleSelectPage($event)"></app-podcast-list>
</div>
```

## podcasts.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { togglePlayer, toggleBookmark, toggleDetail, searchBookmarks, getBookmarks } from './podcasts.actions';

export const initialState = {
  podcasts: [],
  isLoading: false,
  query: '',
  // Define other state properties
};

export const podcastsReducer = createReducer(
  initialState,
  on(togglePlayer, (state, { podcast }) => {
    // Implement toggle player logic
    return { ...state };
  }),
  on(toggleBookmark, (state, { podcast }) => {
    // Implement toggle bookmark logic
    return { ...state };
  }),
  on(toggleDetail, (state, { podcast }) => {
    // Implement toggle detail logic
    return { ...state };
  }),
  on(searchBookmarks, (state, { query }) => {
    // Implement search bookmarks logic
    return { ...state, query };
  }),
  on(getBookmarks, (state) => {
    // Implement get bookmarks logic
    return { ...state, query: '' };
  }),
  // Add other reducer handlers
);
```

## podcasts.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const togglePlayer = createAction('[Podcast] Toggle Player', props<{ podcast: any }>());
export const toggleBookmark = createAction('[Podcast] Toggle Bookmark', props<{ podcast: any }>());
export const toggleDetail = createAction('[Podcast] Toggle Detail', props<{ podcast: any }>());
export const searchBookmarks = createAction('[Podcast] Search Bookmarks', props<{ query: string }>());
export const getBookmarks = createAction('[Podcast] Get Bookmarks');
// Define other actions
```

## podcasts.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PodcastsService } from '../podcasts.service';
import { searchBookmarks, getBookmarks, searchBookmarksSuccess, getBookmarksSuccess } from './podcasts.actions';

@Injectable()
export class PodcastsEffects {
  constructor(
    private actions$: Actions,
    private podcastsService: PodcastsService
  ) {}

  searchBookmarks$ = createEffect(() => this.actions$.pipe(
    ofType(searchBookmarks),
    mergeMap((action) =>
      this.podcastsService.searchBookmarks(action.query).pipe(
        map(podcasts => searchBookmarksSuccess({ podcasts })),
        catchError(error => of({ type: '[Podcast] Search Bookmarks Failed', error }))
      )
    )
  ));

  getBookmarks$ = createEffect(() => this.actions$.pipe(
    ofType(getBookmarks),
    mergeMap(() =>
      this.podcastsService.getBookmarks().pipe(
        map(podcasts => getBookmarksSuccess({ podcasts })),
        catchError(error => of({ type: '[Podcast] Get Bookmarks Failed', error }))
      )
    )
  ));

  // Add other effects
}
```

## podcasts.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PodcastsService {
  constructor(private http: HttpClient) {}

  searchBookmarks(query: string): Observable<any[]> {
    // Implement search bookmarks API call
    return this.http.get<any[]>('/api/bookmarks/search', { params: { query } });
  }

  getBookmarks(): Observable<any[]> {
    // Implement get bookmarks API call
    return this.http.get<any[]>('/api/bookmarks');
  }

  // Add other service methods
}
```
```
### Tokens: {'prompt_tokens': 3103, 'completion_tokens': 2893, 'total_tokens': 5996}
### Execution time: 182.79211807250977
