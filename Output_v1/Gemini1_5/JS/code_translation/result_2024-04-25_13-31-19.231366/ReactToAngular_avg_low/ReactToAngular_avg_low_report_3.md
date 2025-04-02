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

## Run 3:
### Answer:
## Angular Components

### image.component.ts

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `<img [src]="src" (error)="handleError()" [attr.alt]="alt" [attr.height]="height" [attr.width]="width" />`,
})
export class ImageComponent implements OnChanges {
  @Input() src: string;
  @Input() errSrc: string;
  @Input() alt: string;
  @Input() height: number;
  @Input() width: number;

  private isError = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].isFirstChange()) {
      this.handleError();
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

### podcast-item.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Podcast } from './models';
import { formatPubDate, formatListenDate } from './utils';

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.css'],
})
export class PodcastItemComponent {
  @Input() podcast: Podcast;
  @Input() showChannel: boolean;
  @Input() showExpanded: boolean;
  @Input() isLoggedIn: boolean;
  @Input() searchQuery: string;
  @Input() showImage: boolean;

  formatPubDate = formatPubDate;
  formatListenDate = formatListenDate;

  get channelUrl(): string {
    return `/channel/${this.podcast.channelId}/`;
  }

  get podcastUrl(): string {
    return `/podcast/${this.podcast.id}/`;
  }

  get image(): string {
    return this.podcast.image || '/static/podcast.png';
  }
}

```

### podcast-item.component.html

```html
<div class="panel panel-default">
  <div class="panel-heading text-center">
    <h4>
      <a *ngIf="!showExpanded" [routerLink]="podcastUrl">{{ podcast.title }}</a>
      <span *ngIf="showExpanded">{{ podcast.title }}</span>
    </h4>
    <div *ngIf="isLoggedIn && podcast.lastPlayedAt" class="text-center">
      <h5>
        <span class="label label-success">Listened {{ formatListenDate(podcast.lastPlayedAt) }}</span>
      </h5>
    </div>
    <div *ngIf="showChannel">
      <div *ngIf="showImage" class="thumbnail">
        <div class="caption text-center">
          <h5><a [routerLink]="channelUrl">{{ podcast.name }}</a></h5>
        </div>
        <a [routerLink]="channelUrl">
          <app-image [src]="image" errSrc="/static/podcast.png" [alt]="podcast.name" height="60" width="60"></app-image>
        </a>
      </div>
      <h5 *ngIf="!showImage"><a [routerLink]="channelUrl">{{ podcast.name }}</a></h5>
    </div>
  </div>
  <div class="panel-body" style="padding: 10px;">
    <small>
      <time [attr.dateTime]="podcast.pubDate">{{ formatPubDate(podcast.pubDate) }}</time>
      <a *ngIf="podcast.source" [href]="podcast.source" target="_blank">Source</a>
    </small>
    <app-podcast-buttons [podcast]="podcast" [isLoggedIn]="isLoggedIn"></app-podcast-buttons>
  </div>
  <button *ngIf="podcast.description && !showExpanded" class="btn btn-default btn-block" (click)="toggleDetail.emit()">
    <i class="fa" [ngClass]="{'fa-chevron-up': podcast.isShowDetail, 'fa-chevron-down': !podcast.isShowDetail}"></i>
  </button>
  <p *ngIf="podcast.description && (podcast.isShowDetail || showExpanded)" class="lead text-center" [innerHtml]="podcast.description | sanitizeHtml | highlight:searchQuery" style="margin-top: 20px;"></p>
</div>

```

### podcast-buttons.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Podcast } from './models';

@Component({
  selector: 'app-podcast-buttons',
  template: `
    <div class="btn-group pull-right">
      <button type="button" class="btn btn-default" (click)="togglePlayer.emit()" [title]="podcast.isPlaying ? 'Stop' : 'Play'">
        <i class="fa" [ngClass]="{'fa-stop': podcast.isPlaying, 'fa-play': !podcast.isPlaying}"></i>
      </button>
      <a class="btn btn-default" [href]="podcast.enclosureUrl" download [title]="'Download this podcast'">
        <i class="fa fa-download"></i>
      </a>
      <button *ngIf="isLoggedIn" type="button" class="btn btn-default" (click)="toggleBookmark.emit()" [title]="podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'">
        <i class="fa" [ngClass]="{'fa-bookmark': podcast.isBookmarked, 'fa-bookmark-o': !podcast.isBookmarked}"></i>
      </button>
    </div>
  `,
})
export class PodcastButtonsComponent {
  @Input() podcast: Podcast;
  @Input() isLoggedIn: boolean;
}

``` 


### Tokens: {'input_tokens': 1630, 'output_tokens': 1366}
### Execution time: 36.64849281311035
