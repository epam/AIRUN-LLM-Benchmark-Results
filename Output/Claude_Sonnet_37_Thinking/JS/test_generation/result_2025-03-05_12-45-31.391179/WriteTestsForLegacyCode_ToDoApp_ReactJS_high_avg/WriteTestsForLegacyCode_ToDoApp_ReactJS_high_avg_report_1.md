Your task is to write unit-tests for a legacy part of frontend application.

app.tsx
```tsx
declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';
    }
  }

  public toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle : ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo : ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo : ITodo) {
    this.setState({editing: todo.id});
  }

  public save(todoToSave : ITodo, text : String) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={ e => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();

```

todoItem.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {

  public state : ITodoItemState;

  constructor(props : ITodoItemProps){
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event : React.FormEvent) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
  }

  public handleKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event : React.FormEvent) {
    var input : any = event.target;
    this.setState({ editText : input.value });
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  public componentDidUpdate(prevProps : ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={ e => this.handleEdit() }>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={ e => this.handleSubmit(e) }
          onChange={ e => this.handleChange(e) }
          onKeyDown={ e => this.handleKeyDown(e) }
        />
      </li>
    );
  }
}

export { TodoItem };

```

utils.ts
```ts

class Utils {
  public static uuid() : string {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace : string, data? : any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs : any[]) : any {
    var newObj = {};
    for (var i = 0; i < objs.length; i++) {
      var obj = objs[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}

export { Utils };

```

footer.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { Utils } from "./utils";

class TodoFooter extends React.Component<ITodoFooterProps, {}> {

  public render() {
    var activeTodoWord = Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({selected: nowShowing === ALL_TODOS})}>
                All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
                Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };

```

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

todoModel.ts
```ts
import { Utils } from "./utils";
class TodoModel implements ITodoModel {
  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}

export { TodoModel };

```


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Thoughts:
Let's break down this task:

1. I need to write unit tests for a legacy frontend application
2. The app is a TypeScript React application
3. I need to choose testing libraries
4. I need to set up the testing environment
5. I need to achieve at least 80% code coverage
6. I should mock dependencies as needed

First, let's choose the testing libraries:

1. **Jest**: A popular JavaScript testing framework that works well with TypeScript and React
2. **React Testing Library**: A library that helps test React components in a user-centric way
3. **jest-dom**: Custom Jest matchers for testing DOM elements

Now, I'll set up the testing environment and then write tests for each component.

Let's start by creating the testing configuration files:

1. **jest.config.js**: Configuration for Jest
2. **setupTests.ts**: Setup file for the testing environment

Then, I'll write tests for each component and utility:

1. TodoModel tests
2. Utils tests
3. TodoItem tests
4. TodoFooter tests
5. TodoApp tests

Let's begin by setting up the test environment:

For `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/index.tsx",
    "!src/**/*.d.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

For `setupTests.ts`:
```typescript
import '@testing-library/jest-dom';
```

Now I'll start writing tests for each file:

Let's first define the interfaces that seem to be missing from the provided files:

```typescript
// interfaces.ts

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange: any): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onSave: (text: string) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
}

interface ITodoItemState {
  editText: string;
}

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}
```

Now, let's start writing tests for each component and utility:

1. Let's start with testing the `Utils` class:

```typescript
// utils.test.ts
import { Utils } from './utils';

describe('Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });
  
  describe('uuid', () => {
    it('should generate a valid uuid', () => {
      const uuid = Utils.uuid();
      // UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit and y is one of 8, 9, A, or B
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('pluralize', () => {
    it('should return singular when count is 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural when count is not 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    it('should store data in localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      Utils.store('test-namespace', data);
      
      const storedData = localStorage.getItem('test-namespace');
      expect(storedData).toBe(JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      localStorage.setItem('test-namespace', JSON.stringify(data));
      
      const retrievedData = Utils.store('test-namespace');
      expect(retrievedData).toEqual(data);
    });

    it('should return empty array if no data exists', () => {
      const retrievedData = Utils.store('non-existent-namespace');
      expect(retrievedData).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should extend objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const extended = Utils.extend(obj1, obj2);
      
      expect(extended).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should work with any number of objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const extended = Utils.extend(obj1, obj2, obj3);
      
      expect(extended).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should return an empty object when no objects are provided', () => {
      const extended = Utils.extend();
      expect(extended).toEqual({});
    });
  });
});
```

2. Now, let's test the `TodoModel` class:

```typescript
// todoModel.test.ts
import { TodoModel } from './todoModel';
import { Utils } from './utils';

// Mock the Utils module
jest.mock('./utils', () => ({
  Utils: {
    store: jest.fn(),
    uuid: jest.fn().mockReturnValue('mock-uuid'),
    extend: jest.fn((_, todo, updates) => ({ ...todo, ...updates }))
  }
}));

describe('TodoModel', () => {
  let model: TodoModel;
  let mockTodo: ITodo;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up mocks
    (Utils.store as jest.Mock).mockReturnValue([]);
    mockCallback = jest.fn();
    mockTodo = { id: '1', title: 'Test Todo', completed: false };
    
    // Initialize the model
    model = new TodoModel('test-todos');
    model.subscribe(mockCallback);
  });

  it('should initialize with the correct key and empty todos', () => {
    expect(model.key).toBe('test-todos');
    expect(model.todos).toEqual([]);
    expect(Utils.store).toHaveBeenCalledWith('test-todos');
  });

  describe('subscribe', () => {
    it('should add the callback to onChanges array', () => {
      expect(model.onChanges).toContain(mockCallback);
    });
  });

  describe('inform', () => {
    it('should call store and all callbacks', () => {
      model.inform();
      expect(Utils.store).toHaveBeenCalledWith('test-todos', []);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo to the todos array', () => {
      model.addTodo('New Todo');
      expect(model.todos).toEqual([{
        id: 'mock-uuid',
        title: 'New Todo',
        completed: false
      }]);
      expect(Utils.uuid).toHaveBeenCalled();
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('toggleAll', () => {
    beforeEach(() => {
      model.todos = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true }
      ];
    });

    it('should toggle all todos to completed', () => {
      model.toggleAll(true);
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: true },
        { id: '2', title: 'Todo 2', completed: true }
      ]);
      expect(Utils.extend).toHaveBeenCalledTimes(2);
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should toggle all todos to not completed', () => {
      model.toggleAll(false);
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: false }
      ]);
      expect(Utils.extend).toHaveBeenCalledTimes(2);
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should toggle the completed status of a specific todo', () => {
      model.toggle(mockTodo);
      expect(model.todos[0].completed).toBe(true);
      expect(Utils.extend).toHaveBeenCalledWith({}, mockTodo, { completed: true });
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should remove a todo from the todos array', () => {
      model.destroy(mockTodo);
      expect(model.todos).toEqual([]);
      expect(Utils.store).toHaveBeenCalledWith('test-todos', []);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should update the title of a todo', () => {
      model.save(mockTodo, 'Updated Title');
      expect(model.todos[0].title).toBe('Updated Title');
      expect(Utils.extend).toHaveBeenCalledWith({}, mockTodo, { title: 'Updated Title' });
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('clearCompleted', () => {
    beforeEach(() => {
      model.todos = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true }
      ];
    });

    it('should remove all completed todos', () => {
      model.clearCompleted();
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: false }
      ]);
      expect(Utils.store).toHaveBeenCalledWith('test-todos', model.todos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
```

3. Now, let's test the `TodoFooter` component:

```typescript
// footer.test.tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from './footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

describe('TodoFooter', () => {
  const defaultProps = {
    count: 3,
    completedCount: 2,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the footer with the correct item count', () => {
    render(<TodoFooter {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('items left')).toBeInTheDocument();
  });

  it('should render "item" (singular) when count is 1', () => {
    render(<TodoFooter {...defaultProps} count={1} />);
    expect(screen.getByText('item left')).toBeInTheDocument();
  });

  it('should render the clear completed button when there are completed items', () => {
    render(<TodoFooter {...defaultProps} />);
    const clearButton = screen.getByText('Clear completed');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not render the clear completed button when there are no completed items', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />);
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when the clear completed button is clicked', () => {
    render(<TodoFooter {...defaultProps} />);
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });

  it('should highlight the All filter when nowShowing is ALL_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ALL_TODOS} />);
    expect(screen.getByText('All').closest('a')).toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).not.toHaveClass('selected');
  });

  it('should highlight the Active filter when nowShowing is ACTIVE_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ACTIVE_TODOS} />);
    expect(screen.getByText('All').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).not.toHaveClass('selected');
  });

  it('should highlight the Completed filter when nowShowing is COMPLETED_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={COMPLETED_TODOS} />);
    expect(screen.getByText('All').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).toHaveClass('selected');
  });
});
```

4. Next, let's test the `TodoItem` component:

```typescript
// todoItem.test.tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './todoItem';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

// Mock ReactDOM
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn(ref => {
    if (ref.current) return ref.current;
    if (ref === 'editField') {
      return { 
        focus: jest.fn(),
        setSelectionRange: jest.fn(),
        value: 'Test Todo'
      };
    }
    return null;
  })
}));

describe('TodoItem', () => {
  const defaultProps = {
    todo: { id: '1', title: 'Test Todo', completed: false },
    editing: false,
    onSave: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    onCancel: jest.fn(),
    onToggle: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a todo item', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should apply the completed class when the todo is completed', () => {
    const props = {
      ...defaultProps,
      todo: { ...defaultProps.todo, completed: true }
    };
    const { container } = render(<TodoItem {...props} />);
    expect(container.firstChild).toHaveClass('completed');
  });

  it('should apply the editing class when editing is true', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    const { container } = render(<TodoItem {...props} />);
    expect(container.firstChild).toHaveClass('editing');
  });

  it('should call onToggle when the checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should call onEdit when the label is double-clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const label = screen.getByText('Test Todo');
    fireEvent.doubleClick(label);
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  it('should call onDestroy when the destroy button is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const destroyButton = screen.getByRole('button');
    fireEvent.click(destroyButton);
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should update editText state when input changes', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    
    // Simulate blur to trigger handleSubmit
    fireEvent.blur(input);
    expect(defaultProps.onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should call onDestroy when submitting an empty value', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    
    // Simulate blur to trigger handleSubmit
    fireEvent.blur(input);
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should call onCancel when Escape key is pressed', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { keyCode: ESCAPE_KEY });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call handleSubmit when Enter key is pressed', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(defaultProps.onSave).toHaveBeenCalledWith('Test Todo');
  });

  it('should focus the input when transitioning to editing mode', () => {
    // First render without editing
    const { rerender } = render(<TodoItem {...defaultProps} />);
    
    // Then rerender with editing=true
    rerender(<TodoItem {...defaultProps} editing={true} />);
    
    // React DOM's findDOMNode should have been called to focus the input
    expect(require('react-dom').findDOMNode).toHaveBeenCalled();
  });

  // Test for shouldComponentUpdate
  it('should only update when props or state changes', () => {
    const instance = new TodoItem(defaultProps);
    
    // Same props and state, should not update
    expect(instance.shouldComponentUpdate(defaultProps, { editText: 'Test Todo' })).toBe(false);
    
    // Different todo, should update
    expect(instance.shouldComponentUpdate(
      { ...defaultProps, todo: { id: '2', title: 'New Todo', completed: false } },
      { editText: 'Test Todo' }
    )).toBe(true);
    
    // Different editing state, should update
    expect(instance.shouldComponentUpdate(
      { ...defaultProps, editing: true },
      { editText: 'Test Todo' }
    )).toBe(true);
    
    // Different editText state, should update
    expect(instance.shouldComponentUpdate(
      defaultProps,
      { editText: 'New Edit Text' }
    )).toBe(true);
  });
});
```

5. Finally, let's test the main `TodoApp` component:

```typescript
// app.test.tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

// Mock dependencies
jest.mock('./todoModel');
jest.mock('./footer', () => ({
  TodoFooter: jest.fn(props => (
    <div data-testid="todo-footer">
      <span>Count: {props.count}</span>
      <button onClick={props.onClearCompleted}>Clear completed</button>
    </div>
  ))
}));
jest.mock('./todoItem', () => ({
  TodoItem: jest.fn(props => (
    <li data-testid="todo-item">
      <input 
        type="checkbox" 
        checked={props.todo.completed} 
        onChange={props.onToggle} 
      />
      <span>{props.todo.title}</span>
      <button onClick={props.onDestroy}>Delete</button>
      <button onClick={props.onEdit}>Edit</button>
      {props.editing && (
        <input 
          type="text" 
          value={props.todo.title} 
          onChange={e => props.onSave(e.target.value)} 
          onKeyDown={e => {
            if (e.key === 'Escape') {
              props.onCancel(e);
            }
          }}
        />
      )}
    </li>
  ))
}));

// Mock Router
global.Router = jest.fn().mockImplementation(routes => ({
  init: jest.fn()
}));

// Mock ReactDOM.findDOMNode
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn(ref => {
    if (ref === 'newField') {
      return { value: 'New Todo', trim: () => 'New Todo' };
    }
    return null;
  }),
  render: jest.fn()
}));

describe('TodoApp', () => {
  let mockModel: jest.Mocked<TodoModel>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock model
    mockModel = new TodoModel('test-todos') as jest.Mocked<TodoModel>;
    mockModel.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true }
    ];
  });

  it('should render the app with todos', () => {
    render(<TodoApp model={mockModel} />);
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-item').length).toBe(2);
  });

  it('should initialize router on mount', () => {
    render(<TodoApp model={mockModel} />);
    expect(Router).toHaveBeenCalled();
    expect(Router.mock.results[0].value.init).toHaveBeenCalledWith('/');
  });

  it('should add a new todo when Enter is pressed', () => {
    render(<TodoApp model={mockModel} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(mockModel.addTodo).toHaveBeenCalledWith('New Todo');
  });

  it('should not add a todo when a key other than Enter is pressed', () => {
    render(<TodoApp model={mockModel} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { keyCode: 27 }); // Escape key
    expect(mockModel.addTodo).not.toHaveBeenCalled();
  });

  it('should toggle all todos when the toggle-all checkbox is clicked', () => {
    render(<TodoApp model={mockModel} />);
    const toggleAll = screen.getByLabelText('Mark all as complete');
    fireEvent.change(toggleAll, { target: { checked: true } });
    expect(mockModel.toggleAll).toHaveBeenCalledWith(true);
  });

  it('should toggle a specific todo', () => {
    render(<TodoApp model={mockModel} />);
    const todoItems = screen.getAllByTestId('todo-item');
    const firstTodoCheckbox = todoItems[0].querySelector('input[type="checkbox"]');
    fireEvent.click(firstTodoCheckbox);
    expect(mockModel.toggle).toHaveBeenCalledWith(mockModel.todos[0]);
  });

  it('should destroy a todo when delete is clicked', () => {
    render(<TodoApp model={mockModel} />);
    const todoItems = screen.getAllByTestId('todo-item');
    const firstTodoDeleteButton = todoItems[0].querySelector('button:first-of-type');
    fireEvent.click(firstTodoDeleteButton);
    expect(mockModel.destroy).toHaveBeenCalledWith(mockModel.todos[0]);
  });

  it('should set editing state when edit is clicked', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    const todoItems = screen.getAllByTestId('todo-item');
    const firstTodoEditButton = todoItems[0].querySelector('button:nth-of-type(2)');
    fireEvent.click(firstTodoEditButton);
    
    // Component state should be updated to set editing
    const app = container.firstChild;
    expect(app).toHaveProperty('state.editing', '1');
  });

  it('should save an edited todo', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // First set editing state
    const app = container.firstChild;
    app.setState({ editing: '1' });
    
    // Then simulate save
    const todoItems = screen.getAllByTestId('todo-item');
    const editInput = todoItems[0].querySelector('input[type="text"]');
    fireEvent.change(editInput, { target: { value: 'Updated Todo' } });
    
    expect(mockModel.save).toHaveBeenCalledWith(mockModel.todos[0], 'Updated Todo');
    expect(app).toHaveProperty('state.editing', null);
  });

  it('should cancel editing', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // First set editing state
    const app = container.firstChild;
    app.setState({ editing: '1' });
    
    // Then simulate cancel
    const todoItems = screen.getAllByTestId('todo-item');
    const editInput = todoItems[0].querySelector('input[type="text"]');
    fireEvent.keyDown(editInput, { key: 'Escape' });
    
    expect(app).toHaveProperty('state.editing', null);
  });

  it('should clear completed todos', () => {
    render(<TodoApp model={mockModel} />);
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    expect(mockModel.clearCompleted).toHaveBeenCalled();
  });

  it('should filter todos based on nowShowing state', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // Active todos
    const app = container.firstChild;
    app.setState({ nowShowing: ACTIVE_TODOS });
    
    // Should only show active todos
    expect(screen.getAllByTestId('todo-item').length).toBe(1);
    
    // Completed todos
    app.setState({ nowShowing: COMPLETED_TODOS });
    
    // Should only show completed todos
    expect(screen.getAllByTestId('todo-item').length).toBe(1);
    
    // All todos
    app.setState({ nowShowing: ALL_TODOS });
    
    // Should show all todos
    expect(screen.getAllByTestId('todo-item').length).toBe(2);
  });

  it('should not render the main section or footer when there are no todos', () => {
    mockModel.todos = [];
    render(<TodoApp model={mockModel} />);
    
    expect(screen.queryByTestId('todo-footer')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Mark all as complete')).not.toBeInTheDocument();
  });
});
```

With these tests in place, we should have good coverage of all components and utilities in the application. Let's make sure we're also testing edge cases and handling errors appropriately.

From what I've seen in the code base, there are a lot of different functionalities to cover for adequate test coverage. I've tried to include tests for:

1. Utility functions (UUID generation, pluralization, localStorage interactions, object extension)
2. Todo model operations (adding, toggling, destroying, saving, and clearing todos)
3. Footer component (rendering counts, filter links, clear completed button)
4. TodoItem component (rendering, editing, completing, deleting)
5. Main TodoApp component (overall functionality, routing, filtering, etc.)

This set of tests should give us a good coverage of the codebase, likely meeting or exceeding the 80% coverage requirement. These tests will also ensure that any future changes or refactoring won't break existing functionality.

### Answer:
# TodoApp Unit Tests

## Setup Files

### jest.config.js
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### setupTests.ts
```ts
import '@testing-library/jest-dom';
```

### interfaces.ts
```ts
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange: any): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: Boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onSave: (text: string) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
}

interface ITodoItemState {
  editText: string;
}

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}
```

## Unit Tests

### utils.test.ts
```ts
import { Utils } from './utils';

describe('Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  describe('uuid', () => {
    it('should generate a string with the correct UUID format', () => {
      const uuid = Utils.uuid();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
    
    it('should generate unique UUIDs', () => {
      const uuid1 = Utils.uuid();
      const uuid2 = Utils.uuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('pluralize', () => {
    it('should return singular form when count is 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural form when count is not 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    it('should store data in localStorage', () => {
      const testData = [{ id: '123', title: 'Test Todo', completed: false }];
      Utils.store('test-store', testData);
      
      expect(localStorage.getItem('test-store')).toBe(JSON.stringify(testData));
    });

    it('should retrieve data from localStorage', () => {
      const testData = [{ id: '123', title: 'Test Todo', completed: false }];
      localStorage.setItem('test-store', JSON.stringify(testData));
      
      const result = Utils.store('test-store');
      expect(result).toEqual(testData);
    });

    it('should return empty array when no data exists', () => {
      const result = Utils.store('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = Utils.extend(obj1, obj2);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });
    
    it('should return an empty object when no arguments provided', () => {
      expect(Utils.extend()).toEqual({});
    });
    
    it('should handle more than two objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      
      expect(Utils.extend(obj1, obj2, obj3)).toEqual({ a: 1, b: 2, c: 3 });
    });
  });
});
```

### todoModel.test.ts
```ts
import { TodoModel } from './todoModel';
import { Utils } from './utils';

jest.mock('./utils', () => ({
  Utils: {
    store: jest.fn(),
    uuid: jest.fn().mockReturnValue('test-uuid'),
    extend: jest.fn((_, todo, updates) => ({ ...todo, ...updates }))
  }
}));

describe('TodoModel', () => {
  let model: TodoModel;
  let mockTodo: ITodo;
  let mockChangeCallback: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (Utils.store as jest.Mock).mockReturnValue([]);
    mockChangeCallback = jest.fn();
    mockTodo = { id: 'test-id', title: 'Test Todo', completed: false };
    
    model = new TodoModel('test-todos');
    model.subscribe(mockChangeCallback);
  });

  it('should initialize correctly', () => {
    expect(model.key).toBe('test-todos');
    expect(model.todos).toEqual([]);
    expect(Utils.store).toHaveBeenCalledWith('test-todos');
  });

  describe('subscribe', () => {
    it('should add callback to onChanges array', () => {
      const callback = jest.fn();
      model.subscribe(callback);
      expect(model.onChanges).toContain(callback);
    });
  });

  describe('inform', () => {
    it('should update storage and call all callbacks', () => {
      model.inform();
      expect(Utils.store).toHaveBeenCalledWith('test-todos', []);
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo and inform subscribers', () => {
      model.addTodo('New Todo');
      expect(model.todos).toEqual([{
        id: 'test-uuid',
        title: 'New Todo',
        completed: false
      }]);
      expect(Utils.uuid).toHaveBeenCalled();
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('toggleAll', () => {
    beforeEach(() => {
      model.todos = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true }
      ];
    });

    it('should toggle all todos to completed', () => {
      model.toggleAll(true);
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: true },
        { id: '2', title: 'Todo 2', completed: true }
      ]);
      expect(mockChangeCallback).toHaveBeenCalled();
    });

    it('should toggle all todos to active', () => {
      model.toggleAll(false);
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: false }
      ]);
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should toggle a specific todo', () => {
      model.toggle(mockTodo);
      expect(Utils.extend).toHaveBeenCalledWith({}, mockTodo, { completed: true });
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should remove a todo', () => {
      model.destroy(mockTodo);
      expect(model.todos).toEqual([]);
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      model.todos = [mockTodo];
    });

    it('should update a todo title', () => {
      model.save(mockTodo, 'Updated Title');
      expect(Utils.extend).toHaveBeenCalledWith({}, mockTodo, { title: 'Updated Title' });
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });

  describe('clearCompleted', () => {
    beforeEach(() => {
      model.todos = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true }
      ];
    });

    it('should remove completed todos', () => {
      model.clearCompleted();
      expect(model.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: false }
      ]);
      expect(mockChangeCallback).toHaveBeenCalled();
    });
  });
});
```

### footer.test.tsx
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from './footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

describe('TodoFooter', () => {
  const defaultProps = {
    count: 3,
    completedCount: 2,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct item count', () => {
    render(<TodoFooter {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('items left')).toBeInTheDocument();
  });

  it('should use singular form when count is 1', () => {
    render(<TodoFooter {...defaultProps} count={1} />);
    expect(screen.getByText('item left')).toBeInTheDocument();
  });

  it('should show clear completed button when there are completed items', () => {
    render(<TodoFooter {...defaultProps} />);
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  it('should not show clear completed button when no completed items', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />);
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when clear button is clicked', () => {
    render(<TodoFooter {...defaultProps} />);
    fireEvent.click(screen.getByText('Clear completed'));
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });

  it('should highlight All filter when nowShowing is ALL_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ALL_TODOS} />);
    expect(screen.getByText('All').closest('a')).toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).not.toHaveClass('selected');
  });

  it('should highlight Active filter when nowShowing is ACTIVE_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ACTIVE_TODOS} />);
    expect(screen.getByText('All').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).not.toHaveClass('selected');
  });

  it('should highlight Completed filter when nowShowing is COMPLETED_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={COMPLETED_TODOS} />);
    expect(screen.getByText('All').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Active').closest('a')).not.toHaveClass('selected');
    expect(screen.getByText('Completed').closest('a')).toHaveClass('selected');
  });
});
```

### todoItem.test.tsx
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './todoItem';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

// Mock ReactDOM.findDOMNode
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn(ref => {
    if (ref && ref.refs && ref.refs.editField) {
      return {
        focus: jest.fn(),
        setSelectionRange: jest.fn(),
        value: 'Test Todo'
      };
    }
    return null;
  })
}));

describe('TodoItem', () => {
  const defaultProps = {
    todo: { id: '1', title: 'Test Todo', completed: false },
    editing: false,
    onSave: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    onCancel: jest.fn(),
    onToggle: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo item correctly', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should apply completed class when todo is completed', () => {
    const props = {
      ...defaultProps,
      todo: { ...defaultProps.todo, completed: true }
    };
    const { container } = render(<TodoItem {...props} />);
    expect(container.firstChild).toHaveClass('completed');
  });

  it('should apply editing class when in edit mode', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    const { container } = render(<TodoItem {...props} />);
    expect(container.firstChild).toHaveClass('editing');
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should call onEdit when label is double-clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.doubleClick(screen.getByText('Test Todo'));
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  it('should call onDestroy when destroy button is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should update state when edit input changes', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.blur(input);
    expect(defaultProps.onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should call onDestroy when submitting empty value', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should call onCancel when Escape key is pressed', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: ESCAPE_KEY });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onSave when Enter key is pressed', () => {
    const props = {
      ...defaultProps,
      editing: true
    };
    render(<TodoItem {...props} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(defaultProps.onSave).toHaveBeenCalledWith('Test Todo');
  });

  it('should properly determine when component should update', () => {
    const instance = new TodoItem(defaultProps);
    instance.state = { editText: 'Test Todo' };
    
    // No changes - shouldn't update
    expect(instance.shouldComponentUpdate(defaultProps, { editText: 'Test Todo' })).toBe(false);
    
    // Different todo - should update
    expect(instance.shouldComponentUpdate(
      { ...defaultProps, todo: { id: '2', title: 'Different Todo', completed: false } },
      { editText: 'Test Todo' }
    )).toBe(true);
    
    // Different editing state - should update
    expect(instance.shouldComponentUpdate(
      { ...defaultProps, editing: true },
      { editText: 'Test Todo' }
    )).toBe(true);
    
    // Different editText state - should update
    expect(instance.shouldComponentUpdate(
      defaultProps,
      { editText: 'Different Text' }
    )).toBe(true);
  });
});
```

### app.test.tsx
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

// Mock Router
global.Router = jest.fn().mockImplementation(routes => ({
  init: jest.fn()
}));

// Mock ReactDOM
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn(ref => {
    if (ref === "newField") {
      return { value: 'New Todo', trim: () => 'New Todo' };
    }
    return null;
  }),
  render: jest.fn()
}));

// Mock TodoModel
jest.mock('./todoModel', () => ({
  TodoModel: jest.fn().mockImplementation(() => ({
    key: 'test-todos',
    todos: [
      { id: '1', title: 'Active Todo', completed: false },
      { id: '2', title: 'Completed Todo', completed: true }
    ],
    onChanges: [],
    subscribe: jest.fn(),
    inform: jest.fn(),
    addTodo: jest.fn(),
    toggleAll: jest.fn(),
    toggle: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    clearCompleted: jest.fn()
  }))
}));

describe('TodoApp', () => {
  let model: TodoModel;

  beforeEach(() => {
    jest.clearAllMocks();
    model = new TodoModel('test-todos');
  });

  it('should initialize with correct state', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    expect(app.state.nowShowing).toBe(ALL_TODOS);
    expect(app.state.editing).toBe(null);
  });

  it('should set up router on mount', () => {
    render(<TodoApp model={model} />);
    expect(Router).toHaveBeenCalled();
    expect(Router.mock.results[0].value.init).toHaveBeenCalledWith('/');
  });

  it('should handle new todo creation when Enter is pressed', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(model.addTodo).toHaveBeenCalledWith('New Todo');
  });

  it('should not add todo when non-Enter key is pressed', () => {
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.keyDown(input, { keyCode: 27 }); // Escape key
    expect(model.addTodo).not.toHaveBeenCalled();
  });

  it('should toggle all todos', () => {
    render(<TodoApp model={model} />);
    const toggleAllCheckbox = screen.getByLabelText('Mark all as complete');
    
    fireEvent.change(toggleAllCheckbox, { target: { checked: true } });
    expect(model.toggleAll).toHaveBeenCalledWith(true);
  });

  it('should toggle a specific todo', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.toggle(model.todos[0]);
    expect(model.toggle).toHaveBeenCalledWith(model.todos[0]);
  });

  it('should destroy a todo', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.destroy(model.todos[0]);
    expect(model.destroy).toHaveBeenCalledWith(model.todos[0]);
  });

  it('should set editing state', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.edit(model.todos[0]);
    expect(app.state.editing).toBe('1');
  });

  it('should save edited todo', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.save(model.todos[0], 'Updated Todo');
    
    expect(model.save).toHaveBeenCalledWith(model.todos[0], 'Updated Todo');
    expect(app.state.editing).toBe(null);
  });

  it('should cancel editing', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.setState({ editing: '1' });
    app.cancel();
    
    expect(app.state.editing).toBe(null);
  });

  it('should clear completed todos', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    app.clearCompleted();
    expect(model.clearCompleted).toHaveBeenCalled();
  });

  it('should filter todos based on nowShowing state', () => {
    const app = render(<TodoApp model={model} />).container.firstChild as any;
    
    // Test ALL_TODOS filter
    app.setState({ nowShowing: ALL_TODOS });
    expect(app.render().props.children[1].props.children[2].props.children.length).toBe(2);
    
    // Test ACTIVE_TODOS filter
    app.setState({ nowShowing: ACTIVE_TODOS });
    expect(app.render().props.children[1].props.children[2].props.children.length).toBe(1);
    
    // Test COMPLETED_TODOS filter
    app.setState({ nowShowing: COMPLETED_TODOS });
    expect(app.render().props.children[1].props.children[2].props.children.length).toBe(1);
  });
});
```

### package.json additions
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "ts-jest": "^29.1.0",
    "identity-obj-proxy": "^3.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### Tokens: {'input_tokens': 4038, 'output_tokens': 14657}
### Execution time: 169.533212184906
