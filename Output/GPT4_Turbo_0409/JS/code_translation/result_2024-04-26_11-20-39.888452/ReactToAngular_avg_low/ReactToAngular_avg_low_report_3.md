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
```markdown
### Angular Components and Services

#### image.component.ts
```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `
    <img [src]="src" [attr.alt]="imgProps?.alt" [width]="imgProps?.width" [height]="imgProps?.height" (error)="handleError($event)" />
  `
})
export class ImageComponent implements OnChanges {
  @Input() src!: string;
  @Input() errSrc!: string;
  @Input() imgProps?: { alt?: string, width?: number, height?: number };
  isError = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.isError = false; // Reset error state on src change
    }
  }

  handleError(event: Event): void {
    event.preventDefault();
    if (!this.isError) {
      this.isError = true;
      this.src = this.errSrc;
    }
  }
}
```

#### buttons.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buttons',
  template: `
    <div class="btn-group" style="float: right;">
      <button (click)="togglePlayer.emit()" title="{{ podcast.isPlaying ? 'Stop' : 'Play' }}">
        <app-icon [icon]="podcast.isPlaying ? 'stop' : 'play'"></app-icon>
      </button>
      <a download title="Download this podcast" class="btn btn-default" [href]="podcast.enclosureUrl">
        <app-icon icon="download"></app-icon>
      </a>
      <button *ngIf="isLoggedIn" (click)="toggleBookmark.emit()" title="{{ podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks' }}">
        <app-icon [icon]="podcast.isBookmarked ? 'bookmark' : 'bookmark-o'"></app-icon>
      </button>
    </div>
  `
})
export class ButtonsComponent {
  @Input() isLoggedIn!: boolean;
  @Input() podcast!: any;
  @Output() toggleBookmark = new EventEmitter<void>();
  @Output() togglePlayer = new EventEmitter<void>();
}
```

#### podcast-item.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { formatPubDate, formatListenDate, sanitize, highlight } from './utils';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html'
})
export class PodcastItemComponent {
  @Input() podcast!: any;
  @Input() isLoggedIn!: boolean;
  @Input() showImage!: boolean;
  @Input() showChannel!: boolean;
  @Input() showExpanded!: boolean;
  @Input() searchQuery!: string;

  toggleDetail(): void {
    this.podcast.isShowDetail = !this.podcast.isShowDetail;
  }
}
```

#### podcast-item.component.html
```html
<ng-container>
  <div *ngIf="showChannel" class="text-center">
    <h4 *ngIf="showExpanded; else linkTitle">{{ podcast.title }}</h4>
    <ng-template #linkTitle><a [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a></ng-template>
    <div *ngIf="showImage" class="thumbnail">
      <div class="caption text-center">
        <h5><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
      </div>
      <a [routerLink]="['/channel', podcast.channelId]">
        <app-image [src]="podcast.image || '/static/podcast.png'" [errSrc]="'/static/podcast.png'" [imgProps]="{ height: 60, width: 60, alt: podcast.name }"></app-image>
      </a>
    </div>
    <h5 *ngIf="!showImage"><a [routerLink]="['/channel', podcast.channelId]">{{ podcast.name }}</a></h5>
  </div>
  <div *ngIf="!showChannel" class="text-center">
    <h4><a [routerLink]="['/podcast', podcast.id]">{{ podcast.title }}</a></h4>
  </div>
  <div style="padding: 10px;">
    <small>
      <time [attr.dateTime]="podcast.pubDate">{{ formatPubDate(podcast.pubDate) }}</time>
      <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
    </small>
    <app-buttons [isLoggedIn]="isLoggedIn" [podcast]="podcast" (toggleBookmark)="toggleBookmark()" (togglePlayer)="togglePlayer()"></app-buttons>
  </div>
  <button *ngIf="podcast.description && !showExpanded" class="form-control" (click)="toggleDetail()" title="{{ podcast.isShowDetail ? 'Hide details' : 'Show details' }}">
    <app-icon [icon]="podcast.isShowDetail ? 'chevron-up' : 'chevron-down'"></app-icon>
  </button>
  <p *ngIf="podcast.description && (podcast.isShowDetail || showExpanded)" [innerHTML]="sanitize(highlight(podcast.description, searchQuery))" class="lead text-center" style="margin-top: 20px;"></p>
</ng-container>
```
```

### Tokens: {'input_tokens': 1388, 'output_tokens': 1155}
### Execution time: 59.11915588378906