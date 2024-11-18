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
To write unit tests for the provided React components (`Image` and `PodcastItem`), we'll use the following libraries:

- **Jest**: A comprehensive JavaScript testing solution. It works well with React and supports features like snapshots, module mocking, and timers.
- **Enzyme**: A testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output.
- **react-router-dom**: For mocking router components.
- **react-bootstrap**: For components used in the `PodcastItem`.

### Setting up the Testing Environment

First, ensure that Jest and Enzyme are installed along with necessary adapters and serializers:

```bash
npm install --save-dev jest enzyme enzyme-adapter-react-16 enzyme-to-json
npm install --save-dev @wojtekmaj/enzyme-adapter-react-17
```

Create a setup file for Enzyme to configure it with the React version:

```javascript
// setupTests.js
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });
```

Ensure Jest is configured in your `package.json`:

```json
"jest": {
  "setupFilesAfterEnv": ["<rootDir>/setupTests.js"],
  "snapshotSerializers": ["enzyme-to-json/serializer"]
}
```

### Writing Tests

#### Tests for `Image.js`

```javascript
// Image.test.js
import React from 'react';
import { shallow } from 'enzyme';
import Image from './image';

describe('Image Component', () => {
  let wrapper;
  const mockProps = {
    src: 'test.jpg',
    errSrc: 'error.jpg',
    imgProps: { alt: 'Test Image' }
  };

  beforeEach(() => {
    wrapper = shallow(<Image {...mockProps} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('displays initial image', () => {
    expect(wrapper.find('img').prop('src')).toEqual('test.jpg');
  });

  it('handles error and switches to error source', () => {
    wrapper.find('img').simulate('error', { preventDefault: () => {} });
    expect(wrapper.find('img').prop('src')).toEqual('error.jpg');
  });

  it('prevents further state updates on subsequent errors', () => {
    wrapper.find('img').simulate('error', { preventDefault: () => {} });
    wrapper.find('img').simulate('error', { preventDefault: () => {} });
    expect(wrapper.state('isError')).toBe(true);
  });
});
```

#### Tests for `PodcastItem.js`

```javascript
// PodcastItem.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import PodcastItem from './podcast_item';

describe('PodcastItem Component', () => {
  const mockProps = {
    podcast: {
      id: '1',
      title: 'Test Podcast',
      channelId: 'channel1',
      image: 'podcast.jpg',
      enclosureUrl: 'podcast.mp3',
      isPlaying: false,
      isBookmarked: false,
      description: 'Description',
      pubDate: '2021-01-01',
      lastPlayedAt: '2021-01-02'
    },
    isLoggedIn: true,
    showImage: true,
    showChannel: true,
    togglePlayer: jest.fn(),
    toggleBookmark: jest.fn(),
    toggleDetail: jest.fn()
  };

  it('renders correctly with all props', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <PodcastItem {...mockProps} />
      </MemoryRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('toggles player on button click', () => {
    const wrapper = shallow(<PodcastItem {...mockProps} />);
    wrapper.find('Button').at(0).simulate('click');
    expect(mockProps.togglePlayer).toHaveBeenCalled();
  });

  it('toggles bookmark on button click', () => {
    const wrapper = shallow(<PodcastItem {...mockProps} />);
    wrapper.find('Button').at(2).simulate('click');
    expect(mockProps.toggleBookmark).toHaveBeenCalled();
  });
});
```

### Running Tests

Run your tests using the Jest command:

```bash
npm test
```

This setup and these example tests should help you achieve the desired coverage for the `Image` and `PodcastItem` components, adhering to the requirements of testing legacy React components.

### Tokens: {'input_tokens': 1373, 'output_tokens': 960}
### Execution time: 58.84143018722534
