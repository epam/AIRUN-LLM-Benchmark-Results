I have the following application code that needs comprehensive unit testing:

<source_code>
```tsx
// app.tsx
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

```tsx
// todoItem.tsx
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

```ts
// utils.ts

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

```tsx
// footer.tsx
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

```ts
// constants.ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

```ts
// todoModel.ts
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

</source_code>

Please follow these steps:

1. Testing Environment Setup:
   - Select appropriate testing libraries for React with TypeScript (Jest, React Testing Library, etc.)
   - Configure the testing environment with proper TypeScript support
   - Set up necessary test configuration files (jest.config.js, setupTests.ts, etc.)

2. Test Coverage Requirements:
   - Achieve minimum 80% code coverage across all components
   - Prioritize testing of critical business logic in model classes
   - Create separate test files for each component/module following naming convention: `[filename].test.tsx`

3. Component Testing Approach:
   - Write tests for component rendering and UI state verification
   - Test component lifecycle methods functionality
   - Verify event handling (keyboard events, clicks, form submissions)
   - Test conditional rendering logic based on props/state

4. Data Management Testing:
   - Test data flow between components using props
   - Validate state management functionality
   - Verify proper handling of user inputs
   - Test local storage interactions with appropriate mocks

5. Mocking Requirements:
   - Mock external dependencies and browser APIs (localStorage, etc.)
   - Create test fixtures for sample data
   - Implement mocks for routing functionality
   - Simulate DOM events for interaction testing

6. Test Quality Guidelines:
   - Ensure tests are isolated and don't depend on each other
   - Cover both happy paths and edge cases/error conditions
   - Structure tests with proper describe/it blocks for readability
   - Implement proper assertions with meaningful error messages

7. Delivery Requirements:
   - Provide complete working test suite with no TODOs or placeholder code
   - Ensure all tests pass successfully
   - Include any necessary instructions for running tests
   - Do not modify the original application code
## Run 1:
### Answer:
# React Todo App Testing Suite

I'll create a comprehensive testing suite for the provided Todo application using Jest and React Testing Library, which are the most popular choices for testing React applications with TypeScript.

## 1. Testing Environment Setup

First, let's set up the testing environment:

### package.json additions

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.5",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "ts-jest": "^29.0.3"
  },
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### jest.config.js

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx'
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

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Router
global.Router = jest.fn((routes) => {
  return {
    init: jest.fn()
  };
});
```

### types/index.d.ts

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

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  editing: string | null;
  nowShowing: string;
}

interface ITodoItemProps {
  todo: ITodo;
  editing?: boolean;
  onSave: (val: any) => void;
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

declare var Router: any;
```

## 2. Test Files

### utils.test.ts

```ts
import { Utils } from './utils';

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('uuid', () => {
    it('should generate a valid UUID', () => {
      const uuid = Utils.uuid();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = Utils.uuid();
      const uuid2 = Utils.uuid();
      expect(uuid1).not.toEqual(uuid2);
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
      const data = [{ id: '1', title: 'Test', completed: false }];
      Utils.store('test-namespace', data);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-namespace', JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(data));
      
      const result = Utils.store('test-namespace');
      expect(localStorage.getItem).toHaveBeenCalledWith('test-namespace');
      expect(result).toEqual(data);
    });

    it('should return empty array when localStorage is empty', () => {
      localStorage.getItem = jest.fn().mockReturnValue(null);
      
      const result = Utils.store('test-namespace');
      expect(result).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { d: 5 };
      
      const result = Utils.extend(obj1, obj2, obj3);
      
      expect(result).toEqual({
        a: 1,
        b: 3,
        c: 4,
        d: 5
      });
    });

    it('should handle empty objects', () => {
      const result = Utils.extend({}, { a: 1 }, {});
      expect(result).toEqual({ a: 1 });
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
  let mockTodos: ITodo[];
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockTodos = [
      { id: '1', title: 'Test Todo 1', completed: false },
      { id: '2', title: 'Test Todo 2', completed: true }
    ];
    
    (Utils.store as jest.Mock).mockImplementation((key, data) => {
      if (data) return;
      return mockTodos;
    });
    
    mockCallback = jest.fn();
    model = new TodoModel('test-todos');
    model.subscribe(mockCallback);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with the correct key and load todos from storage', () => {
      expect(model.key).toBe('test-todos');
      expect(model.todos).toEqual(mockTodos);
      expect(Utils.store).toHaveBeenCalledWith('test-todos');
    });
  });

  describe('subscribe', () => {
    it('should add callback to onChanges array', () => {
      const newCallback = jest.fn();
      model.subscribe(newCallback);
      expect(model.onChanges).toContain(newCallback);
    });
  });

  describe('inform', () => {
    it('should store todos and call all callbacks', () => {
      model.inform();
      expect(Utils.store).toHaveBeenCalledWith('test-todos', mockTodos);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo with the given title', () => {
      model.addTodo('New Todo');
      
      expect(model.todos.length).toBe(3);
      expect(model.todos[2]).toEqual({
        id: 'test-uuid',
        title: 'New Todo',
        completed: false
      });
      expect(Utils.uuid).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('toggleAll', () => {
    it('should set all todos to completed when checked is true', () => {
      model.toggleAll(true);
      
      expect(model.todos.every(todo => todo.completed)).toBe(true);
      expect(Utils.extend).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should set all todos to not completed when checked is false', () => {
      model.toggleAll(false);
      
      expect(model.todos.every(todo => !todo.completed)).toBe(true);
      expect(Utils.extend).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    it('should toggle the completed status of the specified todo', () => {
      const todoToToggle = mockTodos[0];
      const initialStatus = todoToToggle.completed;
      
      model.toggle(todoToToggle);
      
      expect(Utils.extend).toHaveBeenCalledWith({}, todoToToggle, { completed: !initialStatus });
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove the specified todo', () => {
      const todoToDestroy = mockTodos[0];
      
      model.destroy(todoToDestroy);
      
      expect(model.todos.length).toBe(1);
      expect(model.todos).not.toContain(todoToDestroy);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should update the title of the specified todo', () => {
      const todoToSave = mockTodos[0];
      const newTitle = 'Updated Title';
      
      model.save(todoToSave, newTitle);
      
      expect(Utils.extend).toHaveBeenCalledWith({}, todoToSave, { title: newTitle });
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      model.clearCompleted();
      
      expect(model.todos.length).toBe(1);
      expect(model.todos.every(todo => !todo.completed)).toBe(true);
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
```

### todoItem.test.tsx

```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './todoItem';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

// Mock ReactDOM.findDOMNode which is used in the component
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn().mockImplementation(() => ({
    focus: jest.fn(),
    setSelectionRange: jest.fn(),
    value: 'Test Todo'
  }))
}));

describe('TodoItem', () => {
  const mockTodo: ITodo = {
    id: 'test-id',
    title: 'Test Todo',
    completed: false
  };
  
  const defaultProps: ITodoItemProps = {
    todo: mockTodo,
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

  it('should render correctly in non-editing mode', () => {
    render(<TodoItem {...defaultProps} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('textbox')).toHaveValue('Test Todo');
    expect(screen.getByRole('listitem')).not.toHaveClass('editing');
  });

  it('should render correctly in editing mode', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    expect(screen.getByRole('listitem')).toHaveClass('editing');
  });

  it('should render correctly when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem {...defaultProps} todo={completedTodo} />);
    
    expect(screen.getByRole('listitem')).toHaveClass('completed');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDestroy when destroy button is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(defaultProps.onDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when label is double-clicked', () => {
    render(<TodoItem {...defaultProps} />);
    
    fireEvent.doubleClick(screen.getByText('Test Todo'));
    
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it('should update state when input value changes', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Todo' } });
    
    expect(screen.getByRole('textbox')).toHaveValue('Updated Todo');
  });

  it('should call onSave with trimmed value when form is submitted', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Todo ' } });
    fireEvent.blur(screen.getByRole('textbox'));
    
    expect(defaultProps.onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should call onDestroy when form is submitted with empty value', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
    fireEvent.blur(screen.getByRole('textbox'));
    
    expect(defaultProps.onDestroy).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('should handle ESCAPE key press', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { keyCode: ESCAPE_KEY });
    
    expect(defaultProps.onCancel).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('Test Todo');
  });

  it('should handle ENTER key press', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { keyCode: ENTER_KEY });
    
    expect(defaultProps.onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should not update when props and state have not changed', () => {
    const { rerender } = render(<TodoItem {...defaultProps} />);
    
    const instance = screen.getByRole('listitem');
    
    // Re-render with the same props
    rerender(<TodoItem {...defaultProps} />);
    
    // The component should not have updated
    expect(instance).toBe(screen.getByRole('listitem'));
  });

  it('should update when todo prop changes', () => {
    const { rerender } = render(<TodoItem {...defaultProps} />);
    
    const updatedTodo = { ...mockTodo, title: 'Updated Todo' };
    rerender(<TodoItem {...defaultProps} todo={updatedTodo} />);
    
    expect(screen.getByText('Updated Todo')).toBeInTheDocument();
  });

  it('should update when editing prop changes', () => {
    const { rerender } = render(<TodoItem {...defaultProps} />);
    
    rerender(<TodoItem {...defaultProps} editing={true} />);
    
    expect(screen.getByRole('listitem')).toHaveClass('editing');
  });
});
```

### footer.test.tsx

```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from './footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

jest.mock('./utils', () => ({
  Utils: {
    pluralize: jest.fn((count, word) => count === 1 ? word : word + 's')
  }
}));

describe('TodoFooter', () => {
  const defaultProps = {
    count: 1,
    completedCount: 0,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with one active item', () => {
    render(<TodoFooter {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('item left')).toBeInTheDocument();
    expect(Utils.pluralize).toHaveBeenCalledWith(1, 'item');
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  it('should render correctly with multiple active items', () => {
    render(<TodoFooter {...defaultProps} count={3} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('items left')).toBeInTheDocument();
    expect(Utils.pluralize).toHaveBeenCalledWith(3, 'item');
  });

  it('should render clear completed button when there are completed items', () => {
    render(<TodoFooter {...defaultProps} completedCount={2} />);
    
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  it('should call onClearCompleted when clear completed button is clicked', () => {
    render(<TodoFooter {...defaultProps} completedCount={2} />);
    
    fireEvent.click(screen.getByText('Clear completed'));
    
    expect(defaultProps.onClearCompleted).toHaveBeenCalledTimes(1);
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

### app.test.tsx

```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as ReactDOM from 'react-dom';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

// Mock dependencies
jest.mock('./todoModel');
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn().mockImplementation(() => ({
    value: 'Test Todo'
  }))
}));

describe('TodoApp', () => {
  let mockModel: jest.Mocked<TodoModel>;
  let mockTodos: ITodo[];

  beforeEach(() => {
    mockTodos = [
      { id: '1', title: 'Test Todo 1', completed: false },
      { id: '2', title: 'Test Todo 2', completed: true }
    ];
    
    mockModel = new TodoModel('') as jest.Mocked<TodoModel>;
    mockModel.todos = mockTodos;
    mockModel.addTodo = jest.fn();
    mockModel.toggleAll = jest.fn();
    mockModel.toggle = jest.fn();
    mockModel.destroy = jest.fn();
    mockModel.save = jest.fn();
    mockModel.clearCompleted = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render correctly with todos', () => {
    render(<TodoApp model={mockModel} />);
    
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Mark all as complete')).toBeInTheDocument();
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('should initialize with correct state', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // Access component instance to check state
    const instance = container.firstChild as any;
    
    expect(instance.state).toEqual({
      nowShowing: ALL_TODOS,
      editing: null
    });
  });

  it('should set up router in componentDidMount', () => {
    render(<TodoApp model={mockModel} />);
    
    expect(Router).toHaveBeenCalled();
    expect(Router.mock.calls[0][0]).toHaveProperty('/');
    expect(Router.mock.calls[0][0]).toHaveProperty('/active');
    expect(Router.mock.calls[0][0]).toHaveProperty('/completed');
    
    const routerInstance = Router.mock.results[0].value;
    expect(routerInstance.init).toHaveBeenCalledWith('/');
  });

  it('should add a new todo when Enter key is pressed', () => {
    render(<TodoApp model={mockModel} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    (ReactDOM.findDOMNode as jest.Mock).mockReturnValue({
      value: 'New Todo',
      trim: () => 'New Todo'
    });
    
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    
    expect(mockModel.addTodo).toHaveBeenCalledWith('New Todo');
  });

  it('should not add a new todo when input is empty', () => {
    render(<TodoApp model={mockModel} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    (ReactDOM.findDOMNode as jest.Mock).mockReturnValue({
      value: '',
      trim: () => ''
    });
    
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    
    expect(mockModel.addTodo).not.toHaveBeenCalled();
  });

  it('should toggle all todos when toggle-all checkbox is clicked', () => {
    render(<TodoApp model={mockModel} />);
    
    const toggleAllCheckbox = screen.getByLabelText('Mark all as complete');
    fireEvent.change(toggleAllCheckbox, { target: { checked: true } });
    
    expect(mockModel.toggleAll).toHaveBeenCalledWith(true);
  });

  it('should toggle a todo when its checkbox is clicked', () => {
    render(<TodoApp model={mockModel} />);
    
    // Find the first todo's checkbox
    const checkboxes = screen.getAllByRole('checkbox').filter(cb => cb.className === 'toggle');
    fireEvent.click(checkboxes[0]);
    
    expect(mockModel.toggle).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should destroy a todo when its destroy button is clicked', () => {
    render(<TodoApp model={mockModel} />);
    
    // Find the first todo's destroy button
    const destroyButtons = screen.getAllByRole('button').filter(btn => btn.className === 'destroy');
    fireEvent.click(destroyButtons[0]);
    
    expect(mockModel.destroy).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should enter edit mode when a todo is double-clicked', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // Double-click the first todo
    fireEvent.doubleClick(screen.getByText('Test Todo 1'));
    
    // Check that the component state was updated
    const instance = container.firstChild as any;
    expect(instance.state.editing).toBe('1');
  });

  it('should save edited todo and exit edit mode', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // Enter edit mode
    fireEvent.doubleClick(screen.getByText('Test Todo 1'));
    
    // Save the edited todo
    const instance = container.firstChild as any;
    instance.save(mockTodos[0], 'Updated Todo');
    
    expect(mockModel.save).toHaveBeenCalledWith(mockTodos[0], 'Updated Todo');
    expect(instance.state.editing).toBeNull();
  });

  it('should cancel editing and exit edit mode', () => {
    const { container } = render(<TodoApp model={mockModel} />);
    
    // Enter edit mode
    fireEvent.doubleClick(screen.getByText('Test Todo 1'));
    
    // Cancel editing
    const instance = container.firstChild as any;
    instance.cancel();
    
    expect(instance.state.editing).toBeNull();
  });

  it('should clear completed todos when clear completed button is clicked', () => {
    render(<TodoApp model={mockModel} />);
    
    // Find and click the clear completed button
    const clearCompletedButton = screen.getByText('Clear completed');
    fireEvent.click(clearCompletedButton);
    
    expect(mockModel.clearCompleted).toHaveBeenCalled();
  });

  it('should filter todos based on nowShowing state', () => {
    const { container, rerender } = render(<TodoApp model={mockModel} />);
    
    // Initially all todos should be shown
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    
    // Set nowShowing to ACTIVE_TODOS
    const instance = container.firstChild as any;
    instance.setState({ nowShowing: ACTIVE_TODOS });
    
    rerender(<TodoApp model={mockModel} />);
    
    // Only active todos should be rendered
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();
    
    // Set nowShowing to COMPLETED_TODOS
    instance.setState({ nowShowing: COMPLETED_TODOS });
    
    rerender(<TodoApp model={mockModel} />);
    
    // Only completed todos should be rendered
    expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('should not render main section when there are no todos', () => {
    mockModel.todos = [];
    render(<TodoApp model={mockModel} />);
    
    expect(screen.queryByText('Mark all as complete')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should not render footer when there are no todos', () => {
    mockModel.todos = [];
    render(<TodoApp model={mockModel} />);
    
    expect(screen.queryByText('items left')).not.toBeInTheDocument();
    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });
});
```

### constants.test.ts

```ts
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY } from './constants';

describe('Constants', () => {
  it('should export the correct values', () => {
    expect(ALL_TODOS).toBe('all');
    expect(ACTIVE_TODOS).toBe('active');
    expect(COMPLETED_TODOS).toBe('completed');
    expect(ENTER_KEY).toBe(13);
    expect(ESCAPE_KEY).toBe(27);
  });
});
```

## Running the Tests

To run the tests, use

### Tokens: {'input_tokens': 4335, 'output_tokens': 8192}
### Execution time: 94.53939199447632
