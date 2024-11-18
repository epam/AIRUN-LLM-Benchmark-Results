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

## Run 4:
### Answer:
**podcast-list.component.html**
```html
<div *ngIf="isLoading$ | async">
  <app-loading></app-loading>
</div>
<div *ngIf="podcasts$ | async as podcasts; else empty">
  <app-pager [page]="page$ | async" (onSelectPage)="onSelectPage($event)"></app-pager>
  <app-podcast-item
    *ngFor="let podcast of podcasts"
    [podcast]="podcast"
    [showImage]="showImage"
    [showChannel]="showChannel"
    [showExpanded]="false"
    (togglePlayer)="togglePlayer(podcast)"
    (toggleBookmark)="toggleBookmark(podcast)"
    (toggleDetail)="toggleDetail(podcast)"
  ></app-podcast-item>
  <app-pager [page]="page$ | async" (onSelectPage)="onSelectPage($event)"></app-pager>
</div>
<ng-template #empty>
  <div class="lead">{{ ifEmpty }}</div>
</ng-template>
```

**podcast-list.component.ts**
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Podcast } from '../models/podcast.model';
import { Page } from '../models/page.model';
import {
  getPodcasts,
  getPodcastsByQuery,
  getPodcastsByPage,
  togglePlayer,
  toggleBookmark,
  toggleDetail,
} from '../actions/podcasts.actions';
import { selectPodcasts, selectPage, selectIsLoading } from '../selectors/podcasts.selectors';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss'],
})
export class PodcastListComponent implements OnInit {
  @Input() ifEmpty?: string;
  @Input() showChannel = false;
  @Input() showImage = false;
  podcasts$: Observable<Podcast[]>;
  page$: Observable<Page>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.podcasts$ = this.store.select(selectPodcasts);
    this.page$ = this.store.select(selectPage);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  onSelectPage(page: number): void {
    this.store.dispatch(getPodcastsByPage({ page }));
  }

  togglePlayer(podcast: Podcast): void {
    this.store.dispatch(togglePlayer({ podcast }));
  }

  toggleBookmark(podcast: Podcast): void {
    this.store.dispatch(toggleBookmark({ podcast }));
  }

  toggleDetail(podcast: Podcast): void {
    this.store.dispatch(toggleDetail({ podcast }));
  }
}
```

**loading.component.html**
```html
<div class="text-center" style="margin-top: 50px;">
  <h1 style="font-family: GoodDog;"><app-icon icon="spinner" spin></app-icon> loading...</h1>
</div>
```

**loading.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
```

**icon.component.html**
```html
<i [ngClass]="classes"></i>
```

**icon.component.ts**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon: string = '';
  @Input() spin = false;

  get classes(): string[] {
    return ['fa', `fa-${this.icon}`, { 'fa-spin': this.spin }];
  }
}
```

**header.component.html**
```html
<div class="page-header text-center">
  <h3>{{ header }}</h3>
</div>
```

**header.component.ts**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() header: string = '';
}
```

**bookmarks.component.html**
```html
<app-page-header header="My bookmarks"></app-page-header>
<form (ngSubmit)="handleSearch($event)">
  <input
    type="search"
    #query
    (click)="handleSelectSearch($event)"
    placeholder="Find a podcast in your bookmarks"
  />
  <button type="submit" class="form-control" [disabled]="!query.value">
    <app-icon icon="search"></app-icon> Search
  </button>
  <button type="button" class="form-control" *ngIf="query.value" (click)="handleClearSearch($event)">
    <app-icon icon="refresh"></app-icon> Show all bookmarks
  </button>
</form>
<app-podcast-list
  [podcasts]="podcasts$ | async"
  [page]="page$ | async"
  [showChannel]="true"
  [isLoggedIn]="true"
  [ifEmpty]="'No bookmarks found'"
  (onSelectPage)="handleSelectPage($event)"
></app-podcast-list>
```

**bookmarks.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Podcast } from '../models/podcast.model';
import { Page } from '../models/page.model';
import {
  getBookmarks,
  getBookmarksByQuery,
  getBookmarksByPage,
} from '../actions/bookmarks.actions';
import { selectBookmarks, selectPage } from '../selectors/bookmarks.selectors';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent implements OnInit {
  podcasts$: Observable<Podcast[]>;
  page$: Observable<Page>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.podcasts$ = this.store.select(selectBookmarks);
    this.page$ = this.store.select(selectPage);
    this.store.dispatch(getBookmarks());
  }

  handleSearch(event: Event): void {
    event.preventDefault();
    const query = (event.target as HTMLInputElement).value.trim();
    if (query) {
      this.store.dispatch(getBookmarksByQuery({ query }));
    } else {
      this.store.dispatch(getBookmarks());
    }
  }

  handleClearSearch(event: Event): void {
    event.preventDefault();
    (event.target as HTMLInputElement).value = '';
    this.store.dispatch(getBookmarks());
  }

  handleSelectSearch(event: Event): void {
    event.preventDefault();
    (event.target as HTMLInputElement).select();
  }

  handleSelectPage(page: number): void {
    window.scrollTo(0, 0);
    this.store.dispatch(getBookmarksByPage({ page }));
  }
}
```

**image.component.html**
```html
<img [src]="src" (error)="handleError($event)" [ngClass]="imgProps" />
```

**image.component.ts**
```typescript
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() src: string = '';
  @Input() errSrc: string = '';
  @Input() imgProps: any;

  isError = false;

  ngOnInit(): void {
    if (!this.src) {
      this.src = this.errSrc;
      this.isError = true;
    }
  }

  handleError(event: Event): void {
    event.preventDefault();
    if (this.isError) {
      return;
    }
    this.isError = true;
    this.src = this.errSrc;
  }
}
```

**pager.component.html**
```html
<nav *ngIf="page$ | async as page">
  <ul class="pager">
    <li [ngClass]="{ disabled: page.page <= 1 }">
      <a (click)="handleFirstPage()" href="#">
        <app-icon icon="fast-backward"></app-icon>
      </a>
    </li>
    <li [ngClass]="{ disabled: page.page <= 1 }">
      <a (click)="handlePreviousPage()" href="#">
        <app-icon icon="backward"></app-icon>
      </a>
    </li>
    <li [ngClass]="{ disabled: page.page >= page.numPages }">
      <a (click)="handleNextPage()" href="#">
        <app-icon icon="forward"></app-icon>
      </a>
    </li>
    <li [ngClass]="{ disabled: page.page >= page.numPages }">
      <a (click)="handleLastPage()" href="#">
        <app-icon icon="fast-forward"></app-icon>
      </a>
    </li>
  </ul>
</nav>
```

**pager.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Page } from '../models/page.model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent {
  @Input() page: Page | null = null;
  @Output() onSelectPage = new EventEmitter<number>();

  handleFirstPage(): void {
    this.onSelectPage.emit(1);
  }

  handleLastPage(): void {
    if (this.page) {
      this.onSelectPage.emit(this.page.numPages);
    }
  }

  handlePreviousPage(): void {
    if (this.page && this.page.page > 1) {
      this.onSelectPage.emit(this.page.page - 1);
    }
  }

  handleNextPage(): void {
    if (this.page && this.page.page < this.page.numPages) {
      this.onSelectPage.emit(this.page.page + 1);
    }
  }
}
```

**podcast-item.component.html**
```html
<div class="panel">
  <div class="text-center">
    <h4>
      <a *ngIf="!showExpanded" [routerLink]="podcastUrl">{{ podcast.title }}</a>
      <span *ngIf="showExpanded">{{ podcast.title }}</span>
    </h4>
    <div *ngIf="isLoggedIn && podcast.lastPlayedAt">
      <h5>
        <span class="label label-success">
          Listened {{ formatListenDate(podcast.lastPlayedAt) }}
        </span>
      </h5>
    </div>
    <div *ngIf="showImage">
      <div class="thumbnail">
        <div class="caption text-center">
          <h5><a [routerLink]="channelUrl">{{ podcast.name }}</a></h5>
        </div>
        <a [routerLink]="channelUrl">
          <app-image
            [src]="image"
            [errSrc]="/static/podcast.png"
            [imgProps]="{ height: 60, width: 60, alt: podcast.name }"
          ></app-image>
        </a>
      </div>
    </div>
    <h5 *ngIf="!showImage"><a [routerLink]="channelUrl">{{ podcast.name }}</a></h5>
  </div>
  <div style="padding: 10px;">
    <small>
      <time [dateTime]="podcast.pubDate">{{ formatPubDate(podcast.pubDate) }}</time>&nbsp;
      <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
    </small>
    <div class="btn-group pull-right">
      <button
        title="{{ podcast.isPlaying ? 'Stop' : 'Play' }}"
        (click)="togglePlayer(podcast)"
        type="button"
        class="btn btn-default"
      >
        <app-icon [icon]="podcast.isPlaying ? 'stop' : 'play'"></app-icon>
      </button>
      <button
        title="Download this podcast"
        (click)="downloadPodcast()"
        type="button"
        class="btn btn-default"
        [download]="podcast.title"
        [href]="podcast.enclosureUrl"
      >
        <app-icon icon="download"></app-icon>
      </button>
      <button
        *ngIf="isLoggedIn"
        title="{{ podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks' }}"
        (click)="toggleBookmark(podcast)"
        type="button"
        class="btn btn-default"
      >
        <app-icon [icon]="podcast.isBookmarked ? 'bookmark' : 'bookmark-o'"></app-icon>
      </button>
    </div>
  </div>
  <button
    *ngIf="!showExpanded"
    (click)="toggleDetail(podcast)"
    type="button"
    class="btn btn-default form-control"
  >
    <app-icon [icon]="podcast.isShowDetail ? 'chevron-up' : 'chevron-down'"></app-icon>
  </button>
  <p
    *ngIf="description && (podcast.isShowDetail || showExpanded)"
    [innerHTML]="description"
    class="lead text-center"
    style="margin-top: 20px;"
  ></p>
</div>
```

**podcast-item.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Podcast } from '../models/podcast.model';
import { formatListenDate, formatPubDate, sanitize, highlight } from '../utils';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss'],
})
export class PodcastItemComponent {
  @Input() podcast: Podcast = {} as Podcast;
  @Input() showChannel = false;
  @Input() showExpanded = false;
  @Input() showImage = false;
  @Output() togglePlayer = new EventEmitter<Podcast>();
  @Output() toggleBookmark = new EventEmitter<Podcast>();
  @Output() toggleDetail = new EventEmitter<Podcast>();

  get image(): string {
    return this.podcast.image || '/static/podcast.png';
  }

  get channelUrl(): string {
    return `/channel/${this.podcast.channelId}/`;
  }

  get podcastUrl(): string {
    return `/podcast/${this.podcast.id}/`;
  }

  get description(): any {
    return sanitize(highlight(this.podcast.description, this.searchQuery));
  }

  downloadPodcast(): void {}

  formatListenDate(date: string): string {
    return formatListenDate(date);
  }

  formatPubDate(date: string): string {
    return formatPubDate(date);
  }
}
```
### Tokens: {'prompt_tokens': 3733, 'completion_tokens': 3725, 'total_tokens': 7458}
### Execution time: 23.30214023590088
