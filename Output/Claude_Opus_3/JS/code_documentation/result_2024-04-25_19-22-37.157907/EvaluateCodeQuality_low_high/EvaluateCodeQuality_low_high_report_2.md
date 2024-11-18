I have the following application code that needs review and improvement:

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


Your task is to analyze the code and suggest enhancements focusing on the following aspects:
- Readability: Identify unclear parts and suggest clearer alternatives with code examples.
- Maintainability: Point out non-modular or hard-to-maintain structures and provide modular, maintainable code examples.
- Performance: Highlight performance issues and offer optimized code snippets.
- Accessibility: Suggest improvements for better accessibility with example code.
- Best Practices: Indicate deviations from best practices in the used tech stack (e.g., React, TypeScript) and correct them with code examples.
- Testing: Comment on testability and suggest testable code structures with example tests.
- Documentation: If documentation/comments are lacking or unclear, suggest better documentation with examples.

Please ensure your response includes specific code examples for each suggested improvement.
Return the improved code as markdown code snippets without additional commentary on the conversion process.
## Run 2:
### Answer:
Here are some suggested improvements to the provided code:

podcasts.js:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import Loading from './loading';
import Pager from './pager';
import Podcast from './podcast_item';

const PodcastList = ({
  actions,
  dispatch,
  isLoggedIn,
  podcasts,
  searchQuery,
  isLoading,
  emptyMessage = 'No podcasts found',
  page,
  onSelectPage,
  showChannel,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!podcasts.length) {
    return <div className="lead">{emptyMessage}</div>;
  }

  const handleTogglePlayer = podcast => event => {
    event.preventDefault();
    dispatch(actions.player.togglePlayer(podcast));
  };

  const handleToggleBookmark = podcast => event => {
    event.preventDefault();
    dispatch(actions.bookmarks.toggleBookmark(podcast));
  };

  const handleToggleDetail = podcast => event => {
    event.preventDefault();
    dispatch(actions.showDetail.toggleDetail(podcast));
  };

  return (
    <div>
      <Pager page={page} onSelectPage={onSelectPage} />
      {podcasts.map(podcast => (
        <Podcast
          key={podcast.id}
          searchQuery={searchQuery}
          isLoggedIn={isLoggedIn}
          podcast={podcast}
          showImage={false}
          showChannel={showChannel}
          showExpanded={false}
          toggleBookmark={handleToggleBookmark(podcast)}
          toggleDetail={handleToggleDetail(podcast)}
          togglePlayer={handleTogglePlayer(podcast)}
        />
      ))}
      <Pager page={page} onSelectPage={onSelectPage} />
    </div>
  );
};

PodcastList.propTypes = {
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  podcasts: PropTypes.array.isRequired,
  page: PropTypes.object,
  onSelectPage: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string,
  showChannel: PropTypes.bool,
  searchQuery: PropTypes.string,
};

export default PodcastList;
```

Improvements:
- Use functional component syntax for better readability
- Destructure props for cleaner code
- Rename `ifEmpty` prop to `emptyMessage` for clarity
- Use `podcasts.length` instead of `_.isEmpty` for simplicity
- Extract event handlers to separate functions for reusability
- Use implicit return in arrow functions for conciseness
- Add default value for `emptyMessage` prop
- Use more descriptive names for event handlers

loading.js:
```jsx
import React from 'react';
import Icon from './icon';

const Loading = () => (
  <div className="text-center" style={{ marginTop: 50 }}>
    <h1 style={{ fontFamily: 'GoodDog' }}>
      <Icon icon="spinner" spin /> Loading...
    </h1>
  </div>
);

export default Loading;
```

Improvements:
- Use functional component syntax for simplicity
- Capitalize component name for consistency
- Remove unnecessary function wrapper

icon.js:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Icon = ({ icon, spin }) => (
  <i className={classNames('fa', `fa-${icon}`, { 'fa-spin': spin })} />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  spin: PropTypes.bool,
};

export default Icon;
```

Improvements:
- Use functional component syntax for simplicity
- Use template literal for dynamic class name
- Use `classNames` library for conditional classes

header.js:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ children }) => (
  <div className="page-header text-center">
    <h3>{children}</h3>
  </div>
);

PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageHeader;
```

Improvements:
- Use `children` prop for more flexible content
- Rename `header` prop to `children` for clarity

bookmarks.js:
```jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Button, Input } from 'react-bootstrap';
import * as actions from '../actions';
import { podcastsSelector } from '../selectors';
import PodcastList from '../components/podcasts';
import PageHeader from '../components/header';
import Icon from '../components/icon';
import { getTitle } from './utils';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { query, podcasts, page, isLoading } = useSelector(state => ({
    query: state.bookmarks.query,
    podcasts: podcastsSelector(state),
    page: state.podcasts.page,
    isLoading: state.podcasts.isLoading,
  }));

  const handleSearch = useCallback(
    event => {
      event.preventDefault();
      const searchQuery = event.target.elements.query.value.trim();
      if (searchQuery) {
        dispatch(actions.bookmarks.searchBookmarks(searchQuery));
      } else {
        dispatch(actions.bookmarks.getBookmarks());
      }
    },
    [dispatch]
  );

  const handleClearSearch = useCallback(
    event => {
      event.preventDefault();
      event.target.form.elements.query.value = '';
      dispatch(actions.bookmarks.getBookmarks());
    },
    [dispatch]
  );

  const handleSelectPage = useCallback(
    page => {
      window.scrollTo(0, 0);
      dispatch(actions.bookmarks.getBookmarks(page));
    },
    [dispatch]
  );

  return (
    <DocumentTitle title={getTitle('My bookmarks')}>
      <div>
        <PageHeader>My bookmarks</PageHeader>
        <form onSubmit={handleSearch}>
          <Input
            type="search"
            name="query"
            placeholder="Find a podcast in your bookmarks"
          />
          <Button type="submit">
            <Icon icon="search" /> Search
          </Button>
          {query && (
            <Button onClick={handleClearSearch}>
              <Icon icon="refresh" /> Show all bookmarks
            </Button>
          )}
        </form>
        <PodcastList
          actions={actions}
          searchQuery={query}
          showChannel
          isLoggedIn
          emptyMessage="No bookmarks found"
          onSelectPage={handleSelectPage}
          podcasts={podcasts}
          page={page}
          isLoading={isLoading}
        />
      </div>
    </DocumentTitle>
  );
};

Bookmarks.propTypes = {
  podcasts: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  query: PropTypes.string,
};

export default Bookmarks;
```

Improvements:
- Use functional component syntax with hooks for better readability
- Use `useSelector` and `useDispatch` hooks from `react-redux` for simpler state management
- Use `useCallback` hook for memoizing callback functions
- Destructure state values for cleaner code
- Use `event.target` instead of refs for form input access
- Pass `emptyMessage` prop directly to `PodcastList` component
- Remove unnecessary `connect` HOC and `mapStateToProps` function
- Use more descriptive names for event handlers
- Add prop types for better type checking

image.js:
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Image = ({ src, fallbackSrc, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return <img {...props} src={imageSrc} onError={handleError} />;
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string.isRequired,
};

export default Image;
```

Improvements:
- Use functional component syntax with hooks for better readability
- Use `useState` hook for managing image source state
- Use `useEffect` hook for updating image source when `src` prop changes
- Rename `errSrc` prop to `fallbackSrc` for clarity
- Use object spread operator for passing additional props to `img` element
- Simplify error handling logic

pager.js:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Pager as BootstrapPager, PageItem } from 'react-bootstrap';
import Icon from './icon';

const Pager = ({ page, onSelectPage }) => {
  if (!page || page.numPages < 2) {
    return null;
  }

  const handlePageChange = newPage => () => {
    onSelectPage(newPage);
  };

  const isFirstPage = page.page <= 1;
  const isLastPage = page.page >= page.numPages;

  return (
    <BootstrapPager>
      <PageItem disabled={isFirstPage} onSelect={handlePageChange(1)}>
        <Icon icon="fast-backward" />
      </PageItem>
      <PageItem disabled={isFirstPage} onSelect={handlePageChange(page.page - 1)}>
        <Icon icon="backward" />
      </PageItem>
      <PageItem disabled={isLastPage} onSelect={handlePageChange(page.numPages)}>
        <Icon icon="fast-forward" />
      </PageItem>
      <PageItem disabled={isLastPage} onSelect={handlePageChange(page.page + 1)}>
        <Icon icon="forward" />
      </PageItem>
    </BootstrapPager>
  );
};

Pager.propTypes = {
  page: PropTypes.shape({
    page: PropTypes.number.isRequired,
    numPages: PropTypes.number.isRequired,
  }),
  onSelectPage: PropTypes.func.isRequired,
};

export default Pager;
```

Improvements:
- Use functional component syntax for better readability
- Rename `bs` import to `BootstrapPager` and `PageItem` for clarity
- Return `null` instead of empty `span` when pager is not needed
- Extract page change handler to separate function for reusability
- Use more descriptive names for variables and handlers
- Add prop types for better type checking

podcast_item.js:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Panel, Label } from 'react-bootstrap';
import Icon from './icon';
import Image from './image';
import { sanitize, highlight, formatPubDate, formatListenDate } from './utils';

const Buttons = ({ podcast, isLoggedIn, togglePlayer, toggleBookmark }) => (
  <ButtonGroup style={{ float: 'right' }}>
    <Button title={podcast.isPlaying ? 'Stop' : 'Play'} onClick={togglePlayer}>
      <Icon icon={podcast.isPlaying ? 'stop' : 'play'} />
    </Button>
    <Button download title="Download this podcast" href={podcast.enclosureUrl}>
      <Icon icon="download" />
    </Button>
    {isLoggedIn && (
      <Button
        onClick={toggleBookmark}
        title={podcast.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
      >
        <Icon icon={podcast.isBookmarked ? 'bookmark' : 'bookmark-o'} />
      </Button>
    )}
  </ButtonGroup>
);

Buttons.propTypes = {
  podcast: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  togglePlayer: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
};

const PodcastItem = ({
  podcast,
  showChannel,
  showExpanded,
  toggleDetail,
  isLoggedIn,
  searchQuery,
  showImage,
  togglePlayer,
  toggleBookmark,
}) => {
  const channelUrl = `/channel/${podcast.channelId}/`;
  const podcastUrl = `/podcast/${podcast.id}/`;
  const image = podcast.image || '/static/podcast.png';

  const playedAt = isLoggedIn && podcast.lastPlayedAt && (
    <div className="text-center">
      <h5>
        <Label bsStyle="success">
          Listened {formatListenDate(podcast.lastPlayedAt)}
        </Label>
      </h5>
    </div>
  );

  const header = showChannel ? (
    <div className="text-center">
      <h4>
        {showExpanded ? (
          podcast.title
        ) : (
          <Link to={podcastUrl}>{podcast.title}</Link>
        )}
      </h4>
      {playedAt}
      {showImage ? (
        <div className="thumbnail">
          <div className="caption text-center">
            <h5>
              <Link to={channelUrl}>{podcast.name}</Link>
            </h5>
          </div>
          <Link to={channelUrl}>
            <Image src={image} fallbackSrc="/static/podcast.png" />
          </Link>
        </div>
      ) : (
        <h5>
          <Link to={channelUrl}>{podcast.name}</Link>
        </h5>
      )}
    </div>
  ) : (
    <div className="text-center">
      <h4>
        <Link to={podcastUrl}>{podcast.title}</Link>
      </h4>
      {playedAt}
    </div>
  );

  const description = sanitize(highlight(podcast.description, searchQuery));

  return (
    <Panel>
      {header}
      <div style={{ padding: 10 }}>
        <small>
          <time dateTime={podcast.pubDate}>{formatPubDate(podcast.pubDate)}</time>
          {podcast.source && (
            <span>
              &nbsp;
              <a href={podcast.source} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </span>
          )}
        </small>
        <Buttons
          podcast={podcast}
          isLoggedIn={isLoggedIn}
          togglePlayer={togglePlayer}
          toggleBookmark={toggleBookmark}
        />
      </div>
      {podcast.description && !showExpanded && (
        <Button
          className="form-control"
          title={podcast.isShowDetail ? 'Hide details' : 'Show details'}
          onClick={toggleDetail}
        >
          <Icon icon={podcast.isShowDetail ? 'chevron-up' : 'chevron-down'} />
        </Button>
      )}
      {description.__html && (podcast.isShowDetail || showExpanded) && (
        <p
          className={classNames('text-center', { lead: showExpanded })}
          style={{ marginTop: 20 }}
          dangerouslySetInnerHTML={description}
        />
      )}
    </Panel>
  );
};

PodcastItem.propTypes = {
  podcast: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  showImage: PropTypes.bool,
  showChannel: PropTypes.bool.isRequired,
  showExpanded: PropTypes.bool,
  searchQuery: PropTypes.string,
  togglePlayer: PropTypes.func.isRequired,
  toggleDetail: PropTypes.func.isRequired

### Tokens: {'input_tokens': 4244, 'output_tokens': 4096}
### Execution time: 132.92201399803162
