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

## Run 2:
### Answer:
**podcast-item.component.html**
```html
<div class="panel">
  <div class="header">
    <h4 *ngIf="showChannel">
      <a *ngIf="!showExpanded" [routerLink]="[podcastUrl]">{{ podcast.title }}</a>
      <span *ngIf="showExpanded">{{ podcast.title }}</span>
    </h4>
    <h4 *ngIf="!showChannel">
      <a [routerLink]="[podcastUrl]">{{ podcast.title }}</a>
    </h4>
    <div class="text-center" *ngIf="isLoggedIn && podcast.lastPlayedAt">
      <label class="label label-success">Listened {{ formatListenDate(podcast.lastPlayedAt) }}</label>
    </div>
    <div class="thumbnail" *ngIf="showImage">
      <div class="caption text-center">
        <h5><a [routerLink]="[channelUrl]">{{ podcast.name }}</a></h5>
      </div>
      <a [routerLink]="[channelUrl]">
        <img
          [src]="image"
          [alt]="podcast.name"
          [height]="60"
          [width]="60"
          (error)="handleError()"
        />
      </a>
    </div>
    <h5 *ngIf="!showImage"><a [routerLink]="[channelUrl]">{{ podcast.name }}</a></h5>
  </div>
  <div class="body" style="padding: 10px">
    <small>
      <time [datetime]="podcast.pubDate">{{ formatPubDate(podcast.pubDate) }}</time>
      <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
    </small>
    <div class="btn-group" style="float: right">
      <button
        type="button"
        class="btn btn-default"
        (click)="togglePlayer()"
        [title]="podcast.isPlaying ? 'Stop' : 'Play'"
      >
        <i class="fa" [ngClass]="podcast.isPlaying ? 'fa-stop' : 'fa-play'"></i>
      </button>
      <button
        type="button"
        class="btn btn-default"
        [download]="true"
        [href]="podcast.enclosureUrl"
        [title]="'Download this podcast'"
      >
        <i class="fa fa-download"></i>
      </button>
      <button
        *ngIf="isLoggedIn"
        type="button"
        class="btn btn-default"
        (click)="toggleBookmark()"
        [title]="podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'"
      >
        <i class="fa" [ngClass]="podcast.isBookmarked ? 'fa-bookmark' : 'fa-bookmark-o'"></i>
      </button>
    </div>
  </div>
  <div *ngIf="podcast.description && !showExpanded">
    <button
      type="button"
      class="btn btn-default form-control"
      (click)="toggleDetail()"
      [title]="podcast.isShowDetail ? 'Hide details' : 'Show details'"
    >
      <i class="fa" [ngClass]="podcast.isShowDetail ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </button>
  </div>
  <div
    *ngIf="description.__html && (podcast.isShowDetail || showExpanded)"
    [innerHTML]="description.__html"
    [class.lead]="showExpanded"
    [class.text-center]="true"
    style="margin-top: 20px"
  ></div>
</div>
```

**podcast-item.component.ts**
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Podcast } from '../podcast';
import { Router } from '@angular/router';
import { sanitize, highlight, formatPubDate, formatListenDate } from '../utils';
import { Store } from '@ngrx/store';
import { togglePlayer, toggleBookmark, toggleDetail } from '../store/actions/podcast.actions';

@Component({
  selector: 'podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss'],
})
export class PodcastItemComponent implements OnInit {
  @Input() podcast: Podcast;
  @Input() isLoggedIn: boolean;
  @Input() showImage: boolean;
  @Input() showChannel: boolean;
  @Input() showExpanded: boolean;
  @Input() searchQuery: string;

  channelUrl: string;
  podcastUrl: string;
  image: string;
  description: any;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.channelUrl = `/channel/${this.podcast.channelId}/`;
    this.podcastUrl = `/podcast/${this.podcast.id}/`;
    this.image = this.podcast.image || '/static/podcast.png';
    this.description = sanitize(highlight(this.podcast.description, this.searchQuery));
  }

  togglePlayer(): void {
    this.store.dispatch(togglePlayer({ podcast: this.podcast }));
  }

  toggleBookmark(): void {
    this.store.dispatch(toggleBookmark({ podcast: this.podcast }));
  }

  toggleDetail(): void {
    this.store.dispatch(toggleDetail({ podcast: this.podcast }));
  }

  handleError(): void {
    this.image = '/static/podcast.png';
  }

  formatListenDate(date: string): string {
    return formatListenDate(date);
  }

  formatPubDate(date: string): string {
    return formatPubDate(date);
  }
}
```

**podcast.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastItemComponent } from './podcast-item.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [PodcastItemComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [PodcastItemComponent],
})
export class PodcastModule {}
```
### Tokens: {'prompt_tokens': 1630, 'completion_tokens': 1470, 'total_tokens': 3100}
### Execution time: 9.991206884384155
