Your task is to write unit-tests for a legacy part of frontend application.

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 2:
### Answer:
## Unit Tests with Jest and React Testing Library

**package.json**
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@types/jest": "^29.2.5",
    "jest": "^29.3.1",
    "react-test-renderer": "^18.2.0"
  }
}
```

**image.test.js**
```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Image from './image';

describe('Image component', () => {
  it('renders with the provided src', () => {
    const { getByRole } = render(<Image src="test.jpg" errSrc="error.jpg" />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', 'test.jpg');
  });

  it('switches to errSrc on error', () => {
    const { getByRole } = render(<Image src="test.jpg" errSrc="error.jpg" />);
    const image = getByRole('img');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', 'error.jpg');
  });

  it('does not switch to errSrc if already in error state', () => {
    const { getByRole } = render(<Image src="test.jpg" errSrc="error.jpg" />);
    const image = getByRole('img');
    fireEvent.error(image);
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', 'error.jpg');
  });

  it('updates src when props change', () => {
    const { getByRole, rerender } = render(<Image src="test.jpg" errSrc="error.jpg" />);
    const image = getByRole('img');
    rerender(<Image src="new.jpg" errSrc="error.jpg" />);
    expect(image).toHaveAttribute('src', 'new.jpg');
  });
});
```

**podcast_item.test.js**
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import PodcastItem from './podcast_item';

const mockPodcast = {
  id: 1,
  channelId: 2,
  title: 'Test Podcast',
  name: 'Test Channel',
  description: 'This is a test description',
  pubDate: '2023-11-01',
  enclosureUrl: 'https://example.com/podcast.mp3',
  image: 'https://example.com/image.jpg',
  isPlaying: false,
  isBookmarked: false,
  lastPlayedAt: null,
  isShowDetail: false,
};

const mockProps = {
  podcast: mockPodcast,
  isLoggedIn: false,
  showChannel: true,
  showExpanded: false,
  searchQuery: '',
  togglePlayer: jest.fn(),
  toggleDetail: jest.fn(),
  toggleBookmark: jest.fn(),
};

describe('PodcastItem component', () => {
  it('renders podcast title and channel name', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByText('Test Podcast')).toBeInTheDocument();
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
  });

  it('renders podcast description when expanded', () => {
    render(<PodcastItem {...mockProps} showExpanded />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders play/stop button and triggers togglePlayer', () => {
    render(<PodcastItem {...mockProps} />);
    const playButton = screen.getByTitle('Play');
    fireEvent.click(playButton);
    expect(mockProps.togglePlayer).toHaveBeenCalled();
  });

  it('renders download button with correct href', () => {
    render(<PodcastItem {...mockProps} />);
    const downloadButton = screen.getByTitle('Download this podcast');
    expect(downloadButton).toHaveAttribute('href', 'https://example.com/podcast.mp3');
  });

  it('renders bookmark button and triggers toggleBookmark when logged in', () => {
    render(<PodcastItem {...mockProps} isLoggedIn />);
    const bookmarkButton = screen.getByTitle('Add to bookmarks');
    fireEvent.click(bookmarkButton);
    expect(mockProps.toggleBookmark).toHaveBeenCalled();
  });

  it('renders details button and triggers toggleDetail', () => {
    render(<PodcastItem {...mockProps} />);
    const detailsButton = screen.getByTitle('Show details');
    fireEvent.click(detailsButton);
    expect(mockProps.toggleDetail).toHaveBeenCalled();
  });
});
``` 


### Tokens: {'input_tokens': 1609, 'output_tokens': 1122}
### Execution time: 33.38064479827881
