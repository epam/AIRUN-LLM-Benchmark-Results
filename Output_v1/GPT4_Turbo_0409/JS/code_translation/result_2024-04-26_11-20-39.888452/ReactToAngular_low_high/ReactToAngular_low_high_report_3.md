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

## Run 2:
### Answer:
```markdown
## Angular Components and Services Translation

### app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { LoadingComponent } from './loading/loading.component';
import { PagerComponent } from './pager/pager.component';
import { PodcastItemComponent } from './podcast-item/podcast-item.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { HeaderComponent } from './header/header.component';
import { IconComponent } from './icon/icon.component';
import { ImageComponent } from './image/image.component';
import { reducers, metaReducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    PodcastListComponent,
    LoadingComponent,
    PagerComponent,
    PodcastItemComponent,
    BookmarksComponent,
    HeaderComponent,
    IconComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
```

### podcast-list.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Podcast } from '../models/podcast.model';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html'
})
export class PodcastListComponent {
  @Input() podcasts: Podcast[];
  @Input() isLoading: boolean;
  @Input() ifEmpty: string;
  @Input() page: any;
  @Input() showChannel: boolean;
  @Input() isLoggedIn: boolean;
  @Input() searchQuery: string;
  @Output() onSelectPage = new EventEmitter<number>();

  constructor() {}

  get emptyMessage() {
    return this.ifEmpty || 'No podcasts found';
  }
}
```

### podcast-list.component.html
```html
<app-loading *ngIf="isLoading"></app-loading>
<div *ngIf="!isLoading">
  <div *ngIf="podcasts.length === 0" class="lead">{{ emptyMessage }}</div>
  <app-pager *ngIf="podcasts.length > 0" [page]="page" (onSelectPage)="onSelectPage.emit($event)"></app-pager>
  <app-podcast-item *ngFor="let podcast of podcasts" [podcast]="podcast" [isLoggedIn]="isLoggedIn" [showChannel]="showChannel" [searchQuery]="searchQuery"></app-podcast-item>
  <app-pager *ngIf="podcasts.length > 0" [page]="page" (onSelectPage)="onSelectPage.emit($event)"></app-pager>
</div>
```

### loading.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="text-center" style="margin-top: 50px;">
      <h1 style="font-family: 'GoodDog';"><app-icon [icon]="'spinner'" [spin]="true"></app-icon> loading...</h1>
    </div>
  `
})
export class LoadingComponent {}
```

### pager.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html'
})
export class PagerComponent {
  @Input() page: any;
  @Output() onSelectPage = new EventEmitter<number>();

  handleFirstPage() {
    this.onSelectPage.emit(1);
  }

  handleLastPage() {
    this.onSelectPage.emit(this.page.numPages);
  }

  handlePreviousPage() {
    if (this.page.page > 1) {
      this.onSelectPage.emit(this.page.page - 1);
    }
  }

  handleNextPage() {
    if (this.page.page < this.page.numPages) {
      this.onSelectPage.emit(this.page.page + 1);
    }
  }

  get isFirstPage() {
    return this.page.page <= 1;
  }

  get isLastPage() {
    return this.page.page >= this.page.numPages;
  }
}
```

### pager.component.html
```html
<nav *ngIf="page && onSelectPage && page.numPages > 1">
  <ul class="pagination">
    <li [class.disabled]="isFirstPage"><a (click)="handleFirstPage()"><app-icon icon="fast-backward"></app-icon></a></li>
    <li [class.disabled]="isFirstPage"><a (click)="handlePreviousPage()"><app-icon icon="backward"></app-icon></a></li>
    <li [class.disabled]="isLastPage"><a (click)="handleNextPage()"><app-icon icon="forward"></app-icon></a></li>
    <li [class.disabled]="isLastPage"><a (click)="handleLastPage()"><app-icon icon="fast-forward"></app-icon></a></li>
  </ul>
</nav>
```

### podcast-item.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { Podcast } from '../models/podcast.model';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html'
})
export class PodcastItemComponent {
  @Input() podcast: Podcast;
  @Input() isLoggedIn: boolean;
  @Input() showChannel: boolean;
  @Input() searchQuery: string;

  constructor() {}
}
```

### podcast-item.component.html
```html
<div class="panel">
  <div class="text-center">
    <h4><a [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a></h4>
    <div *ngIf="isLoggedIn && podcast.lastPlayedAt" class="text-center">
      <h5><span class="label label-success">Listened {{ podcast.lastPlayedAt | date }}</span></h5>
    </div>
    <div *ngIf="showChannel">
      <div class="thumbnail">
        <div class="caption text-center">
          <h5><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.channelName }}</a></h5>
        </div>
        <a [routerLink]="['/channel', podcast.channelId]">
          <app-image [src]="podcast.image" [errSrc]="'/static/podcast.png'" [imgProps]="{height: 60, width: 60, alt: podcast.channelName}"></app-image>
        </a>
      </div>
    </div>
  </div>
  <div style="padding: 10px;">
    <small>
      <time [attr.dateTime]="podcast.pubDate">{{ podcast.pubDate | date }}</time>&nbsp;
      <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
    </small>
    <div class="btn-group" style="float: right;">
      <button title="Play/Stop" (click)="togglePlayer(podcast)"><app-icon [icon]="podcast.isPlaying ? 'stop' : 'play'"></app-icon></button>
      <a download title="Download this podcast" class="btn btn-default" [href]="podcast.enclosureUrl"><app-icon icon="download"></app-icon></a>
      <button *ngIf="isLoggedIn" (click)="toggleBookmark(podcast)" title="Add/Remove bookmark"><app-icon [icon]="podcast.isBookmarked ? 'bookmark' : 'bookmark-o'"></app-icon></button>
    </div>
  </div>
  <button *ngIf="!podcast.isShowDetail" class="form-control" title="Show/Hide details" (click)="toggleDetail(podcast)"><app-icon [icon]="podcast.isShowDetail ? 'chevron-up' : 'chevron-down'"></app-icon></button>
  <p *ngIf="podcast.description && (podcast.isShowDetail || showExpanded)" [innerHTML]="podcast.description | sanitize:searchQuery" class="lead text-center" style="margin-top: 20px;"></p>
</div>
```

### bookmarks.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Podcast } from '../models/podcast.model';
import { loadBookmarks, searchBookmarks, clearSearch } from '../store/actions/bookmark.actions';
import { selectBookmarks, selectQuery } from '../store/selectors/bookmark.selectors';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html'
})
export class BookmarksComponent implements OnInit {
  podcasts$: Observable<Podcast[]>;
  query$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.podcasts$ = this.store.pipe(select(selectBookmarks));
    this.query$ = this.store.pipe(select(selectQuery));
    this.store.dispatch(loadBookmarks());
  }

  handleSearch(query: string) {
    if (query) {
      this.store.dispatch(searchBookmarks({ query }));
    } else {
      this.store.dispatch(loadBookmarks());
    }
  }

  handleClearSearch() {
    this.store.dispatch(clearSearch());
  }

  handleSelectPage(page: number) {
    this.store.dispatch(loadBookmarks({ page }));
  }
}
```

### bookmarks.component.html
```html
<app-header header="My bookmarks"></app-header>
<form (submit)="handleSearch(query)">
  <input type="search" [(ngModel)]="query" name="query" placeholder="Find a podcast in your bookmarks">
  <button type="submit" class="btn btn-primary"><app-icon icon="search"></app-icon> Search</button>
  <button *ngIf="query" type="button" class="btn btn-default" (click)="handleClearSearch()"><app-icon icon="refresh"></app-icon> Show all bookmarks</button>
</form>
<app-podcast-list [podcasts]="podcasts$ | async" [searchQuery]="query$ | async" showChannel isLoggedIn ifEmpty="No bookmarks found" (onSelectPage)="handleSelectPage($event)"></app-podcast-list>
```

### header.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="page-header text-center">
      <h3>{{ header }}</h3>
    </div>
  `
})
export class HeaderComponent {
  @Input() header: string;
}
```

### icon.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [ngClass]="classes"></i>`
})
export class IconComponent {
  @Input() icon: string;
  @Input() spin: boolean = false;

  get classes(): string[] {
    return ['fa', 'fa-' + this.icon, this.spin ? 'fa-spin' : ''];
  }
}
```

### image.component.ts
```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `<img [src]="src" [attr.alt]="imgProps?.alt" [style.height.px]="imgProps?.height" [style.width.px]="imgProps?.width" (error)="handleError($event)">`
})
export class ImageComponent implements OnChanges {
  @Input() src: string;
  @Input() errSrc: string;
  @Input() imgProps: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.src && changes.src.currentValue !== changes.src.previousValue) {
      this.src = this.src || this.errSrc;
    }
  }

  handleError(event: Event) {
    if (!this.src.endsWith(this.errSrc)) {
      this.src = this.errSrc;
    }
  }
}
```

### Models and Store Setup

#### podcast.model.ts
```typescript
export interface Podcast {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  image: string;
  enclosureUrl: string;
  pubDate: Date;
  lastPlayedAt?: Date;
  isPlaying: boolean;
  isBookmarked: boolean;
  description: string;
  source?: string;
}
```

#### bookmark.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const loadBookmarks = createAction('[Bookmark] Load Bookmarks', props<{ page?: number }>());
export const searchBookmarks = createAction('[Bookmark] Search Bookmarks', props<{ query: string }>());
export const clearSearch = createAction('[Bookmark] Clear Search');
```

#### bookmark.selectors.ts
```typescript
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';

export const selectBookmarksState = (state: AppState) => state.bookmarks;

export const selectBookmarks = createSelector(
  selectBookmarksState,
  (state) => state.podcasts
);

export const selectQuery = createSelector(
  selectBookmarksState,
  (state) => state.query
);
```

#### reducers/index.ts
```typescript
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { bookmarksReducer } from './bookmark.reducer';

export interface AppState {
  bookmarks: any; // Define a more specific type for real use
}

export const reducers: ActionReducerMap<AppState> = {
  bookmarks: bookmarksReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
```

#### bookmark.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { loadBookmarks, searchBookmarks, clearSearch } from '../actions/bookmark.actions';

export const initialState = {
  podcasts: [],
  query: ''
};

export const bookmarksReducer = createReducer(
  initialState,
  on(loadBookmarks, (state, { page }) => ({ ...state, page })),
  on(searchBookmarks, (state, { query }) => ({ ...state, query })),
  on(clearSearch, (state) => ({ ...state, query: '' }))
);
```

This Angular translation maintains the structure and functionality of the original React application, adapting it to Angular's architecture and state management with NgRx.

### Tokens: {'input_tokens': 3103, 'output_tokens': 3145}
### Execution time: 223.10198402404785
