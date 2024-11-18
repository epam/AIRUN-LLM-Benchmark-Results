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
**image.test.js**
```js
import React from 'react';
import { shallow } from 'enzyme';
import Image from './image';

describe('Image', () => {
  it('should render an image with the correct src', () => {
    const wrapper = shallow(<Image src="test.jpg" />);
    expect(wrapper.find('img').prop('src')).toBe('test.jpg');
  });

  it('should render an image with the correct alt text', () => {
    const wrapper = shallow(<Image src="test.jpg" alt="test" />);
    expect(wrapper.find('img').prop('alt')).toBe('test');
  });

  it('should render an image with the correct onError handler', () => {
    const handleError = jest.fn();
    const wrapper = shallow(<Image src="test.jpg" onError={handleError} />);
    wrapper.find('img').simulate('error');
    expect(handleError).toHaveBeenCalled();
  });
});
```

**podcast_item.test.js**
```js
import React from 'react';
import { shallow } from 'enzyme';
import PodcastItem from './podcast_item';

describe('PodcastItem', () => {
  it('should render a podcast item with the correct title', () => {
    const wrapper = shallow(<PodcastItem podcast={{ title: 'Test Podcast' }} />);
    expect(wrapper.find('h4').text()).toBe('Test Podcast');
  });

  it('should render a podcast item with the correct description', () => {
    const wrapper = shallow(<PodcastItem podcast={{ description: 'Test Description' }} />);
    expect(wrapper.find('p').text()).toBe('Test Description');
  });

  it('should render a podcast item with the correct pub date', () => {
    const wrapper = shallow(<PodcastItem podcast={{ pubDate: '2018-01-01' }} />);
    expect(wrapper.find('time').text()).toBe('January 1, 2018');
  });

  it('should render a podcast item with the correct source', () => {
    const wrapper = shallow(<PodcastItem podcast={{ source: 'https://example.com' }} />);
    expect(wrapper.find('a').prop('href')).toBe('https://example.com');
  });

  it('should render a podcast item with the correct buttons', () => {
    const wrapper = shallow(<PodcastItem podcast={{}} />);
    expect(wrapper.find('ButtonGroup').exists()).toBe(true);
  });

  it('should render a podcast item with the correct image', () => {
    const wrapper = shallow(<PodcastItem podcast={{ image: 'test.jpg' }} />);
    expect(wrapper.find('Image').prop('src')).toBe('test.jpg');
  });

  it('should render a podcast item with the correct channel name', () => {
    const wrapper = shallow(<PodcastItem podcast={{ name: 'Test Channel' }} />);
    expect(wrapper.find('Link').text()).toBe('Test Channel');
  });

  it('should render a podcast item with the correct channel url', () => {
    const wrapper = shallow(<PodcastItem podcast={{ channelId: 1 }} />);
    expect(wrapper.find('Link').prop('to')).toBe('/channel/1/');
  });

  it('should render a podcast item with the correct podcast url', () => {
    const wrapper = shallow(<PodcastItem podcast={{ id: 1 }} />);
    expect(wrapper.find('Link').prop('to')).toBe('/podcast/1/');
  });

  it('should render a podcast item with the correct played at date', () => {
    const wrapper = shallow(<PodcastItem podcast={{ lastPlayedAt: '2018-01-01' }} />);
    expect(wrapper.find('Label').text()).toBe('Listened January 1, 2018');
  });

  it('should render a podcast item with the correct bookmark button', () => {
    const wrapper = shallow(<PodcastItem podcast={{ isBookmarked: true }} />);
    expect(wrapper.find('Button').prop('title')).toBe('Remove bookmark');
  });

  it('should render a podcast item with the correct download button', () => {
    const wrapper = shallow(<PodcastItem podcast={{ enclosureUrl: 'test.mp3' }} />);
    expect(wrapper.find('Button').prop('href')).toBe('test.mp3');
  });

  it('should render a podcast item with the correct toggle detail button', () => {
    const wrapper = shallow(<PodcastItem podcast={{}} />);
    expect(wrapper.find('Button').prop('title')).toBe('Show details');
  });
});
```
### Tokens: {'prompt_tokens': 1610, 'completion_tokens': 1063, 'total_tokens': 2673}
### Execution time: 7.172330141067505

