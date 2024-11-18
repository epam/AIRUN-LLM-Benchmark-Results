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
## Run 1:
### Answer:
## Unit Tests with Jest and React Testing Library

**package.json**
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "react-test-renderer": "^18.2.0"
  }
}
```

**image.test.js**
```javascript
import React from 'react';
import { render } from '@testing-library/react';
import Image from './image';

describe('Image component', () => {
  it('renders an image with the provided src', () => {
    const src = 'https://example.com/image.png';
    const { getByRole } = render(<Image src={src} errSrc="" />);
    const image = getByRole('img');
    expect(image).toHaveAttribute('src', src);
  });

  it('renders the error image on error', () => {
    const errSrc = 'https://example.com/error.png';
    const { getByRole } = render(<Image src="" errSrc={errSrc} />);
    const image = getByRole('img');
    image.dispatchEvent(new Event('error'));
    expect(image).toHaveAttribute('src', errSrc);
  });

  it('does not change the image on subsequent errors', () => {
    const errSrc = 'https://example.com/error.png';
    const { getByRole } = render(<Image src="" errSrc={errSrc} />);
    const image = getByRole('img');
    image.dispatchEvent(new Event('error'));
    image.dispatchEvent(new Event('error'));
    expect(image).toHaveAttribute('src', errSrc);
  });

  it('updates the image when the src prop changes', () => {
    const src1 = 'https://example.com/image1.png';
    const src2 = 'https://example.com/image2.png';
    const { getByRole, rerender } = render(<Image src={src1} errSrc="" />);
    let image = getByRole('img');
    expect(image).toHaveAttribute('src', src1);

    rerender(<Image src={src2} errSrc="" />);
    image = getByRole('img');
    expect(image).toHaveAttribute('src', src2);
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
  title: 'Podcast Title',
  name: 'Channel Name',
  description: 'Podcast description',
  pubDate: '2023-11-22',
  enclosureUrl: 'https://example.com/podcast.mp3',
  image: 'https://example.com/image.png',
  isPlaying: false,
  isBookmarked: false,
  lastPlayedAt: null,
  source: 'https://example.com',
};

const mockProps = {
  podcast: mockPodcast,
  isLoggedIn: true,
  showImage: true,
  showChannel: true,
  showExpanded: false,
  searchQuery: '',
  togglePlayer: jest.fn(),
  toggleDetail: jest.fn(),
  toggleBookmark: jest.fn(),
};

describe('PodcastItem component', () => {
  it('renders the podcast title and channel name', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByText(mockPodcast.title)).toBeInTheDocument();
    expect(screen.getByText(mockPodcast.name)).toBeInTheDocument();
  });

  it('renders the podcast image', () => {
    render(<PodcastItem {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockPodcast.image);
  });

  it('renders the play/stop button and download button', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByTitle('Play')).toBeInTheDocument();
    expect(screen.getByTitle('Download this podcast')).toBeInTheDocument();
  });

  it('renders the bookmark button for logged-in users', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByTitle('Add to bookmarks')).toBeInTheDocument();
  });

  it('renders the publication date and source link', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByText(new RegExp(mockPodcast.pubDate))).toBeInTheDocument();
    expect(screen.getByText('Source')).toHaveAttribute('href', mockPodcast.source);
  });

  it('renders the show details button when not expanded', () => {
    render(<PodcastItem {...mockProps} />);
    expect(screen.getByTitle('Show details')).toBeInTheDocument();
  });

  it('renders the podcast description when expanded', () => {
    render(<PodcastItem {...mockProps} showExpanded />);
    expect(screen.getByText(mockPodcast.description)).toBeInTheDocument();
  });
});
``` 


### Tokens: {'input_tokens': 1609, 'output_tokens': 1237}
### Execution time: 34.987035274505615
