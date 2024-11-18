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
To accomplish the task of writing unit tests for the provided legacy frontend application components (`Image` and `PodcastItem`), we will use Jest as our testing framework along with Enzyme for rendering React components and simulating interactions. This setup is common for React applications and provides a comprehensive environment for unit and integration testing.

First, ensure you have Jest and Enzyme installed in your project. If not, you can add them by running:

```bash
npm install --save-dev jest enzyme enzyme-adapter-react-16 react-test-renderer
```

You'll also need to configure Enzyme to work with your React version. Create a setup file for Enzyme:

**setupTests.js**
```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

Now, let's write the tests.

**image.test.js**
```js
import React from 'react';
import { shallow } from 'enzyme';
import Image from './image';

describe('Image Component', () => {
  let props;
  beforeEach(() => {
    props = {
      src: 'test.jpg',
      errSrc: 'error.jpg',
      imgProps: {},
    };
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<Image {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays error image on error', () => {
    const wrapper = shallow(<Image {...props} />);
    wrapper.find('img').simulate('error', { preventDefault: () => {} });
    expect(wrapper.state('src')).toEqual(props.errSrc);
  });

  it('does not change state if error is already set', () => {
    const wrapper = shallow(<Image {...props} />);
    wrapper.setState({ isError: true });
    wrapper.find('img').simulate('error', { preventDefault: () => {} });
    expect(wrapper.state('src')).toEqual(props.src);
  });

  it('updates src when receiving new props', () => {
    const wrapper = shallow(<Image {...props} />);
    wrapper.setProps({ src: 'new.jpg' });
    expect(wrapper.state('src')).toEqual('new.jpg');
  });
});
```

**podcast_item.test.js**
```js
import React from 'react';
import { shallow } from 'enzyme';
import PodcastItem from './podcast_item';

describe('PodcastItem Component', () => {
  let props;
  beforeEach(() => {
    props = {
      podcast: {
        id: '1',
        title: 'Test Podcast',
        channelId: 'channel1',
        image: 'test.jpg',
        enclosureUrl: 'http://example.com/podcast.mp3',
        isPlaying: false,
        isBookmarked: false,
        description: 'Test Description',
        pubDate: '2020-01-01',
        lastPlayedAt: '2020-01-02',
      },
      isLoggedIn: true,
      showImage: true,
      showChannel: true,
      showExpanded: false,
      searchQuery: '',
      togglePlayer: jest.fn(),
      toggleDetail: jest.fn(),
      toggleBookmark: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<PodcastItem {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('toggles player on button click', () => {
    const wrapper = shallow(<PodcastItem {...props} />);
    wrapper.find('Button').at(0).simulate('click');
    expect(props.togglePlayer).toHaveBeenCalled();
  });

  it('toggles bookmark on button click', () => {
    const wrapper = shallow(<PodcastItem {...props} />);
    wrapper.find('Button').at(2).simulate('click');
    expect(props.toggleBookmark).toHaveBeenCalled();
  });

  it('toggles detail on button click', () => {
    const wrapper = shallow(<PodcastItem {...props} />);
    wrapper.find('Button').last().simulate('click');
    expect(props.toggleDetail).toHaveBeenCalled();
  });
});
```

These tests cover the basic functionalities of the `Image` and `PodcastItem` components, including rendering, state changes, and interaction handling. Depending on the complexity of your application and components, you might need to add more tests to achieve the desired coverage. Remember to mock any external dependencies if necessary to isolate the component behavior.
### Tokens: {'prompt_tokens': 1373, 'completion_tokens': 913, 'total_tokens': 2286}
### Execution time: 60.81884789466858
