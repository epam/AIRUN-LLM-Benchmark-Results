I have the following React app code:

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
**podcast-item.component.html**
```html
<div class="podcast-item">
  <div class="header">
    <div class="title">
      <a *ngIf="showChannel" [routerLink]="['/channel', podcast.channelId]">{{ podcast.title }}</a>
      <a *ngIf="!showChannel" [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a>
    </div>
    <div class="played-at" *ngIf="isLoggedIn && podcast.lastPlayedAt">
      <label class="label label-success">Listened {{ formatListenDate(podcast.lastPlayedAt) }}</label>
    </div>
    <div class="image" *ngIf="showImage">
      <a [routerLink]="['/channel', podcast.channelId]">
        <img [src]="podcast.image || '/static/podcast.png'" alt="{{ podcast.name }}" height="60" width="60" />
      </a>
      <div class="caption text-center">
        <h5><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
      </div>
    </div>
    <div class="channel-name" *ngIf="!showImage">
      <h5><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
    </div>
  </div>
  <div class="body">
    <div class="description" [innerHTML]="description.__html" *ngIf="podcast.description && (podcast.isShowDetail || showExpanded)"></div>
    <div class="buttons">
      <button class="btn btn-default" (click)="togglePlayer()" title="{{ podcast.isPlaying ? 'Stop' : 'Play' }}">
        <i class="fa" [ngClass]="{'fa-stop': podcast.isPlaying, 'fa-play': !podcast.isPlaying}"></i>
      </button>
      <button class="btn btn-default" [download]="true" [href]="podcast.enclosureUrl" title="Download this podcast">
        <i class="fa fa-download"></i>
      </button>
      <button class="btn btn-default" *ngIf="isLoggedIn" (click)="toggleBookmark()" title="{{ podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks' }}">
        <i class="fa" [ngClass]="{'fa-bookmark': podcast.isBookmarked, 'fa-bookmark-o': !podcast.isBookmarked}"></i>
      </button>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-default" *ngIf="!podcast.isShowDetail && !showExpanded" (click)="toggleDetail()" title="{{ podcast.isShowDetail ? 'Hide details' : 'Show details' }}">
      <i class="fa" [ngClass]="{'fa-chevron-up': podcast.isShowDetail, 'fa-chevron-down': !podcast.isShowDetail}"></i>
    </button>
  </div>
</div>
```

**podcast-item.component.ts**
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Podcast } from '../models/podcast';
import { PodcastService } from '../services/podcast.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { TogglePlayerAction, ToggleBookmarkAction, ToggleDetailAction } from '../store/actions/podcast.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss']
})
export class PodcastItemComponent implements OnInit {
  @Input() podcast: Podcast;
  @Input() showChannel: boolean;
  @Input() showExpanded: boolean;
  @Input() searchQuery: string;
  @Input() showImage: boolean;
  description: any;
  isLoggedIn$: Observable<boolean>;

  constructor(private podcastService: PodcastService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.description = this.podcastService.sanitize(this.podcastService.highlight(this.podcast.description, this.searchQuery));
    this.isLoggedIn$ = this.store.select(state => state.auth.isLoggedIn);
  }

  togglePlayer() {
    this.store.dispatch(new TogglePlayerAction(this.podcast.id));
  }

  toggleBookmark() {
    this.store.dispatch(new ToggleBookmarkAction(this.podcast.id));
  }

  toggleDetail() {
    this.store.dispatch(new ToggleDetailAction(this.podcast.id));
  }

  formatListenDate(date: string) {
    return this.podcastService.formatListenDate(date);
  }
}
```

**podcast-item.module.ts**
```typescript
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
```
### Tokens: {'prompt_tokens': 1630, 'completion_tokens': 1264, 'total_tokens': 2894}
### Execution time: 9.752978801727295
