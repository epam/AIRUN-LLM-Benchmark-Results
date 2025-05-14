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
Okay, let's set up the testing environment and create comprehensive unit tests for the provided React/TypeScript application using Jest and React Testing Library.

We will follow the steps outlined:

1.  **Testing Environment Setup:** Jest, React Testing Library, ts-jest.
2.  **Test Coverage Requirements:** Aim for 80%+ coverage.
3.  **Component Testing Approach:** RTL for rendering, events, state, props.
4.  **Data Management Testing:** Test model logic, state updates, prop passing.
5.  **Mocking Requirements:** Mock `localStorage`, global `Router`, `ReactDOM.findDOMNode`, child components where appropriate for isolation.
6.  **Test Quality Guidelines:** Isolated, clear, cover cases.
7.  **Delivery Requirements:** Complete, passing tests, instructions.

**Project Structure:**

```
.
├── src/
│   ├── app.tsx
│   ├── constants.ts
│   ├── footer.tsx
│   ├── todoItem.tsx
│   ├── todoModel.ts
│   ├── utils.ts
│   └── types.d.ts (assuming interfaces are here or need to be defined)
├── __tests__/
│   ├── app.test.tsx
│   ├── footer.test.tsx
│   ├── todoItem.test.tsx
│   ├── todoModel.test.ts
│   ├── utils.test.ts
├── jest.config.js
├── package.json
├── tsconfig.json
└── setupTests.ts
```

*(Note: The provided code snippets don't include `types.d.ts` or the interface definitions (`IAppProps`, `IAppState`, `ITodo`, `ITodoItemProps`, `ITodoItemState`, `ITodoFooterProps`, `ITodoModel`). I will assume these exist or define minimal ones for the tests to compile.)*

**1. Setup:**

First, ensure you have Node.js and npm/yarn installed.

Install dependencies:

```bash
npm install --save-dev jest ts-jest @types/jest react react-dom @types/react @types/react-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event classnames @types/classnames
```
*(Note: `react`, `react-dom`, `classnames`, `@types/react`, `@types/react-dom`, `@types/classnames` might already be project dependencies, but listed here for completeness if starting fresh).*

Create `jest.config.js`:

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    // Handle module aliases (if any)
    // '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Optional: Configure coverage reporting
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx', // Assuming index.tsx is just bootstrap
    '!src/types.d.ts', // Assuming types file
    '!src/constants.ts', // Constants file usually doesn't need coverage
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
```

Create `setupTests.ts`:

```typescript
// setupTests.ts
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: 0, // Basic implementation, length might not be accurate
    key: (index: number) => Object.keys(store)[index] || null, // Basic implementation
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock the global Router object used in app.tsx
// This mock captures the routes and provides an init method
const mockRouter = jest.fn((routes: { [key: string]: Function }) => {
  // Store the routes passed to the constructor
  (mockRouter as any).routes = routes;
  return {
    init: jest.fn((initialRoute: string) => {
      // Simulate navigating to the initial route
      if ((mockRouter as any).routes[initialRoute]) {
        (mockRouter as any).routes[initialRoute]();
      }
    }),
    // Add other router methods if needed by the component, e.g., destroy
    destroy: jest.fn(),
  };
});

Object.defineProperty(global, 'Router', { value: mockRouter });

// Mock ReactDOM.findDOMNode as it's used in the original code
// RTL discourages this, but we must mock it to test the existing code.
// We need to return an object that simulates a DOM element with necessary properties/methods.
const mockFindDOMNode = jest.fn((component: any) => {
  // This mock is simplified. In a real scenario, you might need to
  // return different mock elements based on the component/ref being looked up.
  // For this app, it's used for the new todo input and the edit input.
  // We'll return a mock element that supports 'value', 'focus', 'setSelectionRange'.
  const mockElement = {
    value: '', // Default value
    focus: jest.fn(),
    setSelectionRange: jest.fn(),
    // Add other properties/methods if needed by the component
    // For the newField ref in TodoApp, we need to be able to set/get its value.
    // For the editField ref in TodoItem, we need focus/setSelectionRange.
    // A single mock object might not be sufficient if the usage differs significantly.
    // Let's make it slightly more dynamic based on context if possible,
    // or just return a generic mock that covers the needed methods.
    // A simple generic mock covering the needed methods:
  };
  // We can potentially add a way to distinguish, but for these two specific uses,
  // a mock object with value, focus, and setSelectionRange should suffice.
  // The 'value' property needs to be settable and gettable.
  let elementValue = '';
  Object.defineProperty(mockElement, 'value', {
    get: jest.fn(() => elementValue),
    set: jest.fn((val) => { elementValue = val; }),
    configurable: true,
  });

  return mockElement;
});

// Spy on the actual ReactDOM.findDOMNode and replace its implementation
// This allows us to restore it if needed, though for this app, replacing is fine.
// Using Object.defineProperty is safer than directly assigning to ReactDOM.findDOMNode
// as ReactDOM might be imported differently.
// Let's mock the entire ReactDOM module and provide our mock findDOMNode.
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'), // Keep other exports
  findDOMNode: mockFindDOMNode,
  render: jest.fn(), // Mock render as it's called outside the component tree we test
}));

// Mock Utils.uuid to return predictable values for testing
jest.mock('./utils', () => {
  const actualUtils = jest.requireActual('./utils');
  return {
    ...actualUtils,
    Utils: {
      ...actualUtils.Utils,
      uuid: jest.fn(() => 'mock-uuid-123'), // Return a fixed UUID for tests
      // We might need to mock store if we don't want it interacting with the localStorage mock directly
      // or if we need to control its return value more precisely in specific tests.
      // For now, let the Utils.store interact with the localStorage mock.
    },
  };
});

// Mock child components for App.test.tsx to isolate App's logic
jest.mock('./todoItem', () => ({
  TodoItem: jest.fn(({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => (
    <li data-testid={`todo-item-${todo.id}`} className={editing ? 'editing' : ''}>
      <div className="view">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} data-testid={`toggle-${todo.id}`} />
        <label onDoubleClick={onEdit} data-testid={`label-${todo.id}`}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} data-testid={`destroy-${todo.id}`} />
      </div>
      {/* Render a mock edit input if editing, useful for checking props */}
      {editing && (
        <input
          className="edit"
          defaultValue={todo.title} // Use defaultValue as state is managed internally in real component
          onBlur={(e) => onSave((e.target as HTMLInputElement).value)} // Simulate save on blur
          onKeyDown={(e) => { // Simulate save/cancel on keydown
            if (e.key === 'Enter') onSave((e.target as HTMLInputElement).value);
            if (e.key === 'Escape') onCancel();
          }}
          data-testid={`edit-input-${todo.id}`}
        />
      )}
    </li>
  )),
}));

jest.mock('./footer', () => ({
  TodoFooter: jest.fn(({ count, completedCount, nowShowing, onClearCompleted }) => (
    <footer data-testid="todo-footer">
      <span className="todo-count">{count} items left</span> {/* Simplified text for mock */}
      <ul className="filters">
        <li><a href="#/" className={nowShowing === 'all' ? 'selected' : ''}>All</a></li>
        <li><a href="#/active" className={nowShowing === 'active' ? 'selected' : ''}>Active</a></li>
        <li><a href="#/completed" className={nowShowing === 'completed' ? 'selected' : ''}>Completed</a></li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted} data-testid="clear-completed-button">
          Clear completed
        </button>
      )}
    </footer>
  )),
}));

// Define minimal interfaces needed for compilation in tests
// In a real project, these would be in a shared types file (e.g., types.d.ts)
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoModel {
  key: string;
  todos: ITodo[];
  onChanges: any[];
  subscribe(onChange: () => void): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}

interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
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

// Assign interfaces to global scope or import them in test files
// For simplicity in this example, we'll define them here.
// In a larger project, put these in a types.d.ts file and include it in tsconfig.json.
// declare global {
//   interface ITodo { ... }
//   interface ITodoModel { ... }
//   // ... other interfaces
// }
```

Create `tsconfig.json` (if you don't have one, or ensure it includes test files):

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileName": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx", // Or "react" depending on your React version and setup
    "types": ["jest", "node"] // Include jest types
  },
  "include": [
    "src",
    "__tests__",
    "setupTests.ts" // Include setup file
  ]
}
```

**2. Test Files:**

Now, let's create the test files for each module.

**`__tests__/utils.test.ts`**

```typescript
import { Utils } from '../src/utils';

describe('Utils', () => {
  let localStorageMock: any;

  beforeEach(() => {
    // Reset localStorage mock before each test
    localStorageMock = global.localStorage;
    localStorageMock.clear();
    jest.clearAllMocks(); // Clear mocks like Utils.uuid if it was spied on
  });

  describe('uuid', () => {
    it('should return a string', () => {
      const id = Utils.uuid();
      expect(typeof id).toBe('string');
    });

    it('should return a string with hyphens', () => {
      const id = Utils.uuid();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should return different strings on subsequent calls (probabilistic)', () => {
      // This is probabilistic, but highly likely to be different
      const id1 = Utils.uuid();
      const id2 = Utils.uuid();
      expect(id1).not.toBe(id2);
    });
  });

  describe('pluralize', () => {
    it('should return the word for count 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return the plural word for count other than 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
      expect(Utils.pluralize(10, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    const namespace = 'test-namespace';
    const testData = [{ id: '1', title: 'Test Todo', completed: false }];

    it('should store data in localStorage', () => {
      Utils.store(namespace, testData);
      expect(localStorageMock.getItem(namespace)).toBe(JSON.stringify(testData));
    });

    it('should retrieve data from localStorage', () => {
      localStorageMock.setItem(namespace, JSON.stringify(testData));
      const retrievedData = Utils.store(namespace);
      expect(retrievedData).toEqual(testData);
    });

    it('should return an empty array if no data is found in localStorage', () => {
      const retrievedData = Utils.store(namespace);
      expect(retrievedData).toEqual([]);
    });

    it('should return an empty array if stored data is not valid JSON', () => {
      localStorageMock.setItem(namespace, 'invalid json');
      const retrievedData = Utils.store(namespace);
      expect(retrievedData).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should merge properties from multiple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = Utils.extend({}, obj1, obj2);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle empty objects', () => {
      const obj1 = { a: 1 };
      const result = Utils.extend({}, {}, obj1, {});
      expect(result).toEqual({ a: 1 });
    });

    it('should return a new object', () => {
      const obj1 = { a: 1 };
      const result = Utils.extend({}, obj1);
      expect(result).not.toBe(obj1);
    });

    it('should handle multiple source objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = Utils.extend({}, obj1, obj2, obj3);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
  });
});
```

**`__tests__/todoModel.test.ts`**

```typescript
import { TodoModel } from '../src/todoModel';
import { Utils } from '../src/utils'; // Import Utils to access the mock

// Cast Utils to access the mocked uuid
const MockedUtils = Utils as any;

describe('TodoModel', () => {
  const storageKey = 'test-todos';
  let model: TodoModel;
  let mockSubscriber: jest.Mock;

  beforeEach(() => {
    // Clear localStorage mock before each test
    (global.localStorage as any).clear();
    // Reset the mock uuid implementation
    MockedUtils.Utils.uuid.mockImplementation(() => 'mock-uuid-123');
    // Spy on Utils.store to check calls
    jest.spyOn(MockedUtils.Utils, 'store');

    model = new TodoModel(storageKey);
    mockSubscriber = jest.fn();
    model.subscribe(mockSubscriber);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore spies
  });

  it('should initialize with todos from storage', () => {
    const initialTodos = [{ id: '1', title: 'Existing Todo', completed: false }];
    (global.localStorage as any).setItem(storageKey, JSON.stringify(initialTodos));
    const newModel = new TodoModel(storageKey);
    expect(newModel.todos).toEqual(initialTodos);
  });

  it('should initialize with an empty array if storage is empty', () => {
    expect(model.todos).toEqual([]);
  });

  it('should subscribe and inform subscribers on changes', () => {
    model.inform();
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should add a todo', () => {
    const title = 'New Todo';
    model.addTodo(title);

    expect(model.todos.length).toBe(1);
    expect(model.todos[0]).toEqual({
      id: 'mock-uuid-123',
      title: title,
      completed: false,
    });
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);

    // Test adding another todo
    MockedUtils.Utils.uuid.mockImplementation(() => 'mock-uuid-456');
    model.addTodo('Another Todo');
    expect(model.todos.length).toBe(2);
    expect(model.todos[1].id).toBe('mock-uuid-456');
    expect(mockSubscriber).toHaveBeenCalledTimes(2); // Called again
  });

  it('should toggle all todos to completed', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false },
    ];
    model.toggleAll(true);

    expect(model.todos.every(todo => todo.completed)).toBe(true);
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should toggle all todos to active', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: true },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    model.toggleAll(false);

    expect(model.todos.every(todo => !todo.completed)).toBe(true);
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should toggle a specific todo', () => {
    const todoToToggle = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [
      todoToToggle,
      { id: '2', title: 'Todo 2', completed: false },
    ];

    model.toggle(todoToToggle);

    expect(model.todos[0].completed).toBe(true);
    expect(model.todos[1].completed).toBe(false); // Other todo should not change
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);

    // Toggle back
    model.toggle(model.todos[0]); // Use the updated todo object from the array
    expect(model.todos[0].completed).toBe(false);
    expect(mockSubscriber).toHaveBeenCalledTimes(2);
  });

  it('should destroy a specific todo', () => {
    const todoToDestroy = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [
      todoToDestroy,
      { id: '2', title: 'Todo 2', completed: false },
    ];

    model.destroy(todoToDestroy);

    expect(model.todos.length).toBe(1);
    expect(model.todos[0].id).toBe('2');
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should save a specific todo with new text', () => {
    const todoToSave = { id: '1', title: 'Old Title', completed: false };
    model.todos = [
      todoToSave,
      { id: '2', title: 'Todo 2', completed: false },
    ];
    const newText = 'New Title';

    model.save(todoToSave, newText);

    expect(model.todos[0].title).toBe(newText);
    expect(model.todos[1].title).toBe('Todo 2'); // Other todo should not change
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should clear completed todos', () => {
    model.todos = [
      { id: '1', title: 'Active 1', completed: false },
      { id: '2', title: 'Completed 1', completed: true },
      { id: '3', title: 'Active 2', completed: false },
      { id: '4', title: 'Completed 2', completed: true },
    ];

    model.clearCompleted();

    expect(model.todos.length).toBe(2);
    expect(model.todos.every(todo => !todo.completed)).toBe(true);
    expect(model.todos.find(todo => todo.id === '1')).toBeDefined();
    expect(model.todos.find(todo => todo.id === '3')).toBeDefined();
    expect(mockSubscriber).toHaveBeenCalledTimes(1);
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });

  it('should do nothing if clearCompleted is called with no completed todos', () => {
    model.todos = [
      { id: '1', title: 'Active 1', completed: false },
      { id: '2', title: 'Active 2', completed: false },
    ];
    const initialTodos = [...model.todos]; // Clone for comparison

    model.clearCompleted();

    expect(model.todos).toEqual(initialTodos); // Array should be the same
    expect(mockSubscriber).toHaveBeenCalledTimes(1); // inform is still called even if array content is same
    expect(MockedUtils.Utils.store).toHaveBeenCalledWith(storageKey, model.todos);
  });
});
```

**`__tests__/footer.test.tsx`**

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from '../src/footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../src/constants';
import { Utils } from '../src/utils'; // Import Utils to access the mock

// Cast Utils to access the mocked pluralize
const MockedUtils = Utils as any;

describe('TodoFooter', () => {
  const mockOnClearCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure pluralize mock is reset or correctly implemented
    // If Utils.pluralize is mocked in setupTests.ts, it will be used automatically.
    // If not, we could spyOn or mock it here:
    // jest.spyOn(MockedUtils.Utils, 'pluralize').mockImplementation((count, word) => `${count} ${word}${count === 1 ? '' : 's'}`);
  });

  it('should render correctly with active count and pluralization', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    expect(screen.getByText('1 item left')).toBeInTheDocument();

    render(
      <TodoFooter
        count={5}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    expect(screen.getByText('5 items left')).toBeInTheDocument();
  });

  it('should render the "Clear completed" button when completedCount > 0', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={3}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    const clearButton = screen.getByText('Clear completed');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not render the "Clear completed" button when completedCount is 0', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    const clearButton = screen.queryByText('Clear completed');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when the button is clicked', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={3}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('should apply "selected" class to the correct filter link based on nowShowing prop', () => {
    const { rerender } = render(
      <TodoFooter
        count={0}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByRole('link', { name: 'All' })).toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Active' })).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Completed' })).not.toHaveClass('selected');

    rerender(
      <TodoFooter
        count={0}
        completedCount={0}
        nowShowing={ACTIVE_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    expect(screen.getByRole('link', { name: 'All' })).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Active' })).toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Completed' })).not.toHaveClass('selected');

    rerender(
      <TodoFooter
        count={0}
        completedCount={0}
        nowShowing={COMPLETED_TODOS}
        onClearCompleted={mockOnClearCompleted}
      />
    );
    expect(screen.getByRole('link', { name: 'All' })).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Active' })).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Completed' })).toHaveClass('selected');
  });

  // Note: Clicking filter links changes the URL hash, which is handled by the Router in App.
  // Testing the Router interaction belongs in App.test.tsx or an integration test.
  // Here, we only test the rendering based on the `nowShowing` prop.
});
```

**`__tests__/todoItem.test.tsx`**

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../src/todoItem';
import { ENTER_KEY, ESCAPE_KEY } from '../src/constants';
import ReactDOM from 'react-dom'; // Import ReactDOM to access the mock

// Cast ReactDOM to access the mocked findDOMNode
const MockedReactDOM = ReactDOM as any;

describe('TodoItem', () => {
  const mockTodo: ITodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };
  const mockProps = {
    todo: mockTodo,
    onToggle: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    editing: false,
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock findDOMNode's internal state if necessary
    // The mock in setupTests.ts is simple, but if it tracked calls, reset here.
    // For the current mock, clearing mocks is sufficient.
  });

  it('should render correctly in default state', () => {
    render(<TodoItem {...mockProps} />);
    const listItem = screen.getByText(mockTodo.title).closest('li');
    expect(listItem).toBeInTheDocument();
    expect(listItem).not.toHaveClass('completed');
    expect(listItem).not.toHaveClass('editing');
    expect(screen.getByLabelText(mockTodo.title)).toBeInTheDocument(); // Label for the title
    expect(screen.getByRole('checkbox', { name: /mark as complete/i })).toBeInTheDocument(); // Toggle checkbox
    expect(screen.getByRole('button', { name: /destroy/i })).toBeInTheDocument(); // Destroy button
    expect(screen.queryByDisplayValue(mockTodo.title)).not.toBeInTheDocument(); // Edit input should not be visible
  });

  it('should render correctly in completed state', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem {...mockProps} todo={completedTodo} />);
    const listItem = screen.getByText(completedTodo.title).closest('li');
    expect(listItem).toHaveClass('completed');
    expect(screen.getByRole('checkbox', { name: /mark as complete/i })).toBeChecked();
  });

  it('should render correctly in editing state', () => {
    render(<TodoItem {...mockProps} editing={true} />);
    const listItem = screen.getByDisplayValue(mockTodo.title).closest('li');
    expect(listItem).toHaveClass('editing');
    expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument(); // Edit input should be visible
    expect(screen.queryByLabelText(mockTodo.title)).not.toBeInTheDocument(); // Label should not be visible
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoItem {...mockProps} />);
    const checkbox = screen.getByRole('checkbox', { name: /mark as complete/i });
    fireEvent.click(checkbox);
    expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDestroy when destroy button is clicked', () => {
    render(<TodoItem {...mockProps} />);
    const destroyButton = screen.getByRole('button', { name: /destroy/i });
    fireEvent.click(destroyButton);
    expect(mockProps.onDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit and update state when label is double-clicked', () => {
    render(<TodoItem {...mockProps} />);
    const label = screen.getByLabelText(mockTodo.title);
    fireEvent.doubleClick(label);
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
    // State change (editText) is internal, but we can check if the edit input appears
    // Note: With the mock TodoItem, we check the prop passing, not the internal state.
    // If testing the real component, we'd check for the edit input appearance.
  });

  describe('when editing', () => {
    const editingProps = { ...mockProps, editing: true };

    it('should focus the edit input and set cursor position on componentDidUpdate', () => {
      // This tests the componentDidUpdate logic.
      // We need to render, then rerender with editing=true to trigger the update.
      const { rerender } = render(<TodoItem {...mockProps} editing={false} />);

      // Mock the element returned by findDOMNode specifically for the edit field
      const mockEditInput = {
        value: mockTodo.title,
        focus: jest.fn(),
        setSelectionRange: jest.fn(),
      };
      // Make findDOMNode return this specific mock when called
      MockedReactDOM.findDOMNode.mockReturnValue(mockEditInput);

      rerender(<TodoItem {...mockProps} editing={true} />);

      // Check that findDOMNode was called (it's called in componentDidUpdate)
      expect(MockedReactDOM.findDOMNode).toHaveBeenCalled();
      // Check that focus and setSelectionRange were called on the returned element
      expect(mockEditInput.focus).toHaveBeenCalledTimes(1);
      expect(mockEditInput.setSelectionRange).toHaveBeenCalledWith(mockTodo.title.length, mockTodo.title.length);
    });


    it('should update editText state when typing in the input', async () => {
      // This test requires testing the *real* TodoItem component's state.
      // We need to render the actual component, not the mock.
      // Temporarily unmock TodoItem for this specific test.
      jest.unmock('../src/todoItem');
      const { TodoItem: RealTodoItem } = await import('../src/todoItem');

      render(<RealTodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;

      await userEvent.type(editInput, ' edited');

      // Check the internal state via the input value
      expect(editInput.value).toBe('Test Todo edited');

      // Re-mock TodoItem for subsequent tests
      jest.mock('../src/todoItem', () => ({
        TodoItem: jest.fn(({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => (
          <li data-testid={`todo-item-${todo.id}`} className={editing ? 'editing' : ''}>
            <div className="view">
              <input type="checkbox" checked={todo.completed} onChange={onToggle} data-testid={`toggle-${todo.id}`} />
              <label onDoubleClick={onEdit} data-testid={`label-${todo.id}`}>{todo.title}</label>
              <button className="destroy" onClick={onDestroy} data-testid={`destroy-${todo.id}`} />
            </div>
            {editing && (
              <input
                className="edit"
                defaultValue={todo.title}
                onBlur={(e) => onSave((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSave((e.target as HTMLInputElement).value);
                  if (e.key === 'Escape') onCancel();
                }}
                data-testid={`edit-input-${todo.id}`}
              />
            )}
          </li>
        )),
      }));
    });


    it('should call onSave with trimmed value on blur if value is not empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;
      const newValue = '  New Title  ';

      await userEvent.clear(editInput);
      await userEvent.type(editInput, newValue);
      fireEvent.blur(editInput);

      expect(mockProps.onSave).toHaveBeenCalledTimes(1);
      expect(mockProps.onSave).toHaveBeenCalledWith(newValue.trim());
      expect(mockProps.onDestroy).not.toHaveBeenCalled();
    });

    it('should call onDestroy on blur if value is empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;

      await userEvent.clear(editInput); // Make the input empty
      fireEvent.blur(editInput);

      expect(mockProps.onSave).not.toHaveBeenCalled();
      expect(mockProps.onDestroy).toHaveBeenCalledTimes(1);
    });

    it('should call onSave with trimmed value on Enter keydown if value is not empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;
      const newValue = '  New Title  ';

      await userEvent.clear(editInput);
      await userEvent.type(editInput, newValue);
      fireEvent.keyDown(editInput, { key: 'Enter', keyCode: ENTER_KEY });

      expect(mockProps.onSave).toHaveBeenCalledTimes(1);
      expect(mockProps.onSave).toHaveBeenCalledWith(newValue.trim());
      expect(mockProps.onDestroy).not.toHaveBeenCalled();
    });

    it('should call onDestroy on Enter keydown if value is empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;

      await userEvent.clear(editInput); // Make the input empty
      fireEvent.keyDown(editInput, { key: 'Enter', keyCode: ENTER_KEY });

      expect(mockProps.onSave).not.toHaveBeenCalled();
      expect(mockProps.onDestroy).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel and reset state on Escape keydown', async () => {
      // This test requires testing the *real* TodoItem component's state reset.
      // Temporarily unmock TodoItem for this specific test.
      jest.unmock('../src/todoItem');
      const { TodoItem: RealTodoItem } = await import('../src/todoItem');

      render(<RealTodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;

      await userEvent.type(editInput, ' changed');
      expect(editInput.value).toBe('Test Todo changed'); // Verify state changed

      fireEvent.keyDown(editInput, { key: 'Escape', keyCode: ESCAPE_KEY });

      expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
      // Check that the input value (state) was reset to the original title
      expect(editInput.value).toBe(mockTodo.title);

      // Re-mock TodoItem for subsequent tests
      jest.mock('../src/todoItem', () => ({
        TodoItem: jest.fn(({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => (
          <li data-testid={`todo-item-${todo.id}`} className={editing ? 'editing' : ''}>
            <div className="view">
              <input type="checkbox" checked={todo.completed} onChange={onToggle} data-testid={`toggle-${todo.id}`} />
              <label onDoubleClick={onEdit} data-testid={`label-${todo.id}`}>{todo.title}</label>
              <button className="destroy" onClick={onDestroy} data-testid={`destroy-${todo.id}`} />
            </div>
            {editing && (
              <input
                className="edit"
                defaultValue={todo.title}
                onBlur={(e) => onSave((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSave((e.target as HTMLInputElement).value);
                  if (e.key === 'Escape') onCancel();
                }}
                data-testid={`edit-input-${todo.id}`}
              />
            )}
          </li>
        )),
      }));
    });

    it('should not call onSave or onDestroy on other keydown events', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(mockTodo.title) as HTMLInputElement;

      await userEvent.type(editInput, 'a'); // Type a character
      fireEvent.keyDown(editInput, { key: 'A', keyCode: 65 }); // Press 'A'

      expect(mockProps.onSave).not.toHaveBeenCalled();
      expect(mockProps.onDestroy).not.toHaveBeenCalled();
      expect(mockProps.onCancel).not.toHaveBeenCalled();
    });
  });

  describe('shouldComponentUpdate', () => {
    // This tests the *real* shouldComponentUpdate logic.
    // Temporarily unmock TodoItem for this specific test.
    let RealTodoItem: typeof TodoItem;
    beforeAll(async () => {
      jest.unmock('../src/todoItem');
      const module = await import('../src/todoItem');
      RealTodoItem = module.TodoItem;
    });
    afterAll(() => {
      // Re-mock TodoItem after this describe block
      jest.mock('../src/todoItem', () => ({
        TodoItem: jest.fn(({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => (
          <li data-testid={`todo-item-${todo.id}`} className={editing ? 'editing' : ''}>
            <div className="view">
              <input type="checkbox" checked={todo.completed} onChange={onToggle} data-testid={`toggle-${todo.id}`} />
              <label onDoubleClick={onEdit} data-testid={`label-${todo.id}`}>{todo.title}</label>
              <button className="destroy" onClick={onDestroy} data-testid={`destroy-${todo.id}`} />
            </div>
            {editing && (
              <input
                className="edit"
                defaultValue={todo.title}
                onBlur={(e) => onSave((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSave((e.target as HTMLInputElement).value);
                  if (e.key === 'Escape') onCancel();
                }}
                data-testid={`edit-input-${todo.id}`}
              />
            )}
          </li>
        )),
      }));
    });


    it('should update if todo prop changes', () => {
      const instance = new RealTodoItem(mockProps);
      const nextProps = { ...mockProps, todo: { ...mockTodo, title: 'New Title' } };
      expect(instance.shouldComponentUpdate(nextProps, instance.state)).toBe(true);
    });

    it('should update if editing prop changes', () => {
      const instance = new RealTodoItem(mockProps);
      const nextProps = { ...mockProps, editing: true };
      expect(instance.shouldComponentUpdate(nextProps, instance.state)).toBe(true);
    });

    it('should update if editText state changes', () => {
      const instance = new RealTodoItem(mockProps);
      const nextState = { ...instance.state, editText: 'New Text' };
      expect(instance.shouldComponentUpdate(mockProps, nextState)).toBe(true);
    });

    it('should not update if props and state are the same', () => {
      const instance = new RealTodoItem(mockProps);
      expect(instance.shouldComponentUpdate(mockProps, instance.state)).toBe(false);
    });

    it('should not update if only function props change (assuming they are stable or not compared)', () => {
      // React's default shallow comparison would re-render if function identity changes.
      // This specific shouldComponentUpdate implementation only checks todo, editing, editText.
      const instance = new RealTodoItem(mockProps);
      const nextProps = { ...mockProps, onToggle: jest.fn() }; // New function identity
      expect(instance.shouldComponentUpdate(nextProps, instance.state)).toBe(false);
    });
  });
});
```

**`__tests__/app.test.tsx`**

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '../src/app';
import { TodoModel } from '../src/todoModel'; // Import the real model to mock it
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../src/constants';
import ReactDOM from 'react-dom'; // Import ReactDOM to access the mock

// Cast ReactDOM to access the mocked findDOMNode
const MockedReactDOM = ReactDOM as any;

// Mock the real TodoModel class
jest.mock('../src/todoModel');
const MockTodoModel = TodoModel as jest.MockedClass<typeof TodoModel>;

// Mock the global Router object (already done in setupTests.ts, but ensure it's accessible)
declare var Router: jest.Mock;

describe('TodoApp', () => {
  let mockModel: jest.Mocked<ITodoModel>;
  let mockFindDOMNodeElement: any; // To hold the mock element returned by findDOMNode

  beforeEach(() => {
    // Clear localStorage mock
    (global.localStorage as any).clear();
    jest.clearAllMocks(); // Clear mocks like Router, ReactDOM.findDOMNode, TodoModel methods

    // Create a fresh mock model instance for each test
    mockModel = {
      key: 'mock-key',
      todos: [],
      onChanges: [],
      subscribe: jest.fn(),
      inform: jest.fn(),
      addTodo: jest.fn(),
      toggleAll: jest.fn(),
      toggle: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
      clearCompleted: jest.fn(),
    };

    // Reset the mock findDOMNode implementation and the element it returns
    mockFindDOMNodeElement = {
      value: '', // Default value for the input
      focus: jest.fn(),
      setSelectionRange: jest.fn(),
    };
    // Define value property with getter/setter
    let elementValue = '';
    Object.defineProperty(mockFindDOMNodeElement, 'value', {
      get: jest.fn(() => elementValue),
      set: jest.fn((val) => { elementValue = val; }),
      configurable: true,
    });
    MockedReactDOM.findDOMNode.mockReturnValue(mockFindDOMNodeElement);

    // Reset the mock Router
    Router.mockClear();
    (Router as any).routes = {}; // Clear captured routes
    const mockRouterInstance = {
      init: jest.fn(),
      destroy: jest.fn(),
    };
    Router.mockReturnValue(mockRouterInstance);

    // Mock the TodoModel constructor to return our mock instance
    MockTodoModel.mockImplementation((key) => {
      mockModel.key = key; // Ensure the key is set on the mock
      return mockModel;
    });
  });

  it('should render header and new todo input', () => {
    render(<TodoApp model={mockModel} />);
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('should initialize router and set state on componentDidMount', () => {
    render(<TodoApp model={mockModel} />);

    // Check that Router was called with the correct routes
    expect(Router).toHaveBeenCalledTimes(1);
    const routerArgs = Router.mock.calls[0][0];
    expect(routerArgs['/']).toBeInstanceOf(Function);
    expect(routerArgs['/active']).toBeInstanceOf(Function);
    expect(routerArgs['/completed']).toBeInstanceOf(Function);

    // Check that router.init was called with '/'
    const routerInstance = Router.mock.results[0].value;
    expect(routerInstance.init).toHaveBeenCalledTimes(1);
    expect(routerInstance.init).toHaveBeenCalledWith('/');

    // Simulate the router callback being called for '/'
    // This tests if the setState binding works
    const setStateSpy = jest.spyOn(TodoApp.prototype, 'setState');
    routerArgs['/']();
    expect(setStateSpy).toHaveBeenCalledWith({ nowShowing: ALL_TODOS });
    setStateSpy.mockRestore(); // Restore the spy
  });

  it('should call model.addTodo and clear input on Enter keydown in new todo input with value', async () => {
    render(<TodoApp model={mockModel} />);
    const newFieldInput = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    const todoText = 'Buy milk';

    // Simulate typing
    await userEvent.type(newFieldInput, todoText);
    // Update the mock DOM element's value to reflect typing
    mockFindDOMNodeElement.value = todoText;

    // Simulate Enter keydown
    fireEvent.keyDown(newFieldInput, { key: 'Enter', keyCode: ENTER_KEY });

    expect(mockModel.addTodo).toHaveBeenCalledTimes(1);
    expect(mockModel.addTodo).toHaveBeenCalledWith(todoText);

    // Check that findDOMNode was called to get the input element
    expect(MockedReactDOM.findDOMNode).toHaveBeenCalledWith(expect.objectContaining({
      refs: expect.objectContaining({ newField: expect.anything() })
    }));

    // Check that the input value was cleared via the mock DOM element
    expect(mockFindDOMNodeElement.value).toBe('');
  });

  it('should not call model.addTodo on Enter keydown in new todo input with empty value', async () => {
    render(<TodoApp model={mockModel} />);
    const newFieldInput = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;

    // Ensure input is empty
    await userEvent.clear(newFieldInput);
    mockFindDOMNodeElement.value = '';

    // Simulate Enter keydown
    fireEvent.keyDown(newFieldInput, { key: 'Enter', keyCode: ENTER_KEY });

    expect(mockModel.addTodo).not.toHaveBeenCalled();
    // Input value should remain empty
    expect(mockFindDOMNodeElement.value).toBe('');
  });

  it('should not call model.addTodo on non-Enter keydown in new todo input', async () => {
    render(<TodoApp model={mockModel} />);
    const newFieldInput = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    const todoText = 'Buy milk';

    await userEvent.type(newFieldInput, todoText);
    mockFindDOMNodeElement.value = todoText;

    // Simulate a different keydown
    fireEvent.keyDown(newFieldInput, { key: 'A', keyCode: 65 });

    expect(mockModel.addTodo).not.toHaveBeenCalled();
    // Input value should not be cleared
    expect(mockFindDOMNodeElement.value).toBe(todoText);
  });

  it('should call model.toggleAll when toggle-all checkbox is clicked', () => {
    // Add some todos to ensure the main section is rendered
    mockModel.todos = [{ id: '1', title: 'Todo 1', completed: false }];
    render(<TodoApp model={mockModel} />);

    const toggleAllCheckbox = screen.getByLabelText('Mark all as complete') as HTMLInputElement;

    // Simulate clicking to check
    fireEvent.click(toggleAllCheckbox);
    expect(mockModel.toggleAll).toHaveBeenCalledTimes(1);
    expect(mockModel.toggleAll).toHaveBeenCalledWith(true);

    // Simulate clicking to uncheck (assuming it was checked)
    // We need to simulate the state change that would uncheck it
    // For this test, we just check the call with the current state
    // Let's simulate clicking it again, assuming it's now checked in the UI
    // (Though the mock doesn't update the UI state, we test the handler logic)
    // A better test would involve updating mockModel.todos and rerendering
    mockModel.todos = [{ id: '1', title: 'Todo 1', completed: true }]; // Simulate model state
    render(<TodoApp model={mockModel} />); // Rerender with updated model state
    const toggleAllCheckboxAfterCheck = screen.getByLabelText('Mark all as complete') as HTMLInputElement;
    expect(toggleAllCheckboxAfterCheck).toBeChecked(); // Checkbox should be checked if all are complete

    fireEvent.click(toggleAllCheckboxAfterCheck);
    expect(mockModel.toggleAll).toHaveBeenCalledTimes(2); // Called again
    expect(mockModel.toggleAll).toHaveBeenCalledWith(false);
  });

  it('should render main section and toggle-all checkbox if there are todos', () => {
    mockModel.todos = [{ id: '1', title: 'Todo 1', completed: false }];
    render(<TodoApp model={mockModel} />);
    expect(screen.getByRole('checkbox', { name: 'Mark all as complete' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /todo list/i })).toBeInTheDocument(); // Assuming ul has role list
  });

  it('should not render main section if there are no todos', () => {
    mockModel.todos = [];
    render(<TodoApp model={mockModel} />);
    expect(screen.queryByRole('checkbox', { name: 'Mark all as complete' })).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /todo list/i })).not.toBeInTheDocument();
  });

  it('should render footer if there are active or completed todos', () => {
    // Active todos
    mockModel.todos = [{ id: '1', title: 'Todo 1', completed: false }];
    const { rerender } = render(<TodoApp model={mockModel} />);
    expect(screen.getByTestId('todo-footer')).toBeInTheDocument();

    // Completed todos
    mockModel.todos = [{ id: '1', title: 'Todo 1', completed: true }];
    rerender(<TodoApp model={mockModel} />);
    expect(screen.getByTestId('todo-footer')).toBeInTheDocument();

    // Both active and completed
    mockModel.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    rerender(<TodoApp model={mockModel} />);
    expect(screen.getByTestId('todo-footer')).toBeInTheDocument();
  });

  it('should not render footer if there are no todos', () => {
    mockModel.todos = [];
    render(<TodoApp model={mockModel} />);
    expect(screen.queryByTestId('todo-footer')).not.toBeInTheDocument();
  });

  it('should pass correct props to TodoItem components based on state and filtering', () => {
    const todo1: ITodo = { id: '1', title: 'Todo 1', completed: false };
    const todo2: ITodo = { id: '2', title: 'Todo 2', completed: true };
    const todo3: ITodo = { id: '3', title: 'Todo 3', completed: false };
    mockModel.todos = [todo1, todo2, todo3];

    // Render with ALL_TODOS filter
    const { rerender } = render(<TodoApp model={mockModel} />);

    // Check that all TodoItems are rendered
    expect(screen.getByTestId(`todo-item-${todo1.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`todo-item-${todo2.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`todo-item-${todo3.id}`)).toBeInTheDocument();

    // Check props passed to TodoItem (using the mock component)
    const MockTodoItem = require('../src/todoItem').TodoItem; // Get the mock reference
    expect(MockTodoItem).toHaveBeenCalledTimes(3);

    // Check props for todo1 (active)
    expect(MockTodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todo1,
        editing: null === todo1.id, // Should be false
      }),
      {} // Context
    );
    // Check props for todo2 (completed)
    expect(MockTodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todo2,
        editing: null === todo2.id, // Should be false
      }),
      {}
    );

    // Simulate editing state
    rerender(<TodoApp model={mockModel} />); // Rerender to reset mock call count
    const instance = screen.getByTestId(`todo-item-${todo1.id}`).closest('li'); // Get the rendered element
    // Manually trigger the onEdit prop call on the mock component
    const todo1MockCall = MockTodoItem.mock.calls.find(call => call[0].todo.id === todo1.id);
    todo1MockCall[0].onEdit(); // Call the onEdit prop function

    // Check that setState was called to update editing state
    // We need to spy on setState for this
    const setStateSpy = jest.spyOn(TodoApp.prototype, 'setState');
    todo1MockCall[0].onEdit(); // Call again to trigger setState spy
    expect(setStateSpy).toHaveBeenCalledWith({ editing: todo1.id });
    setStateSpy.mockRestore();

    // Rerender to reflect the editing state change
    mockModel.todos = [todo1, todo2, todo3]; // Ensure model is same
    const { rerender: rerenderEditing } = render(<TodoApp model={mockModel} />); // Render with initial state
    // Manually update the state on the rendered component instance
    // This is a bit hacky, but simulates the state update from onEdit
    // A better way is to trigger the onEdit handler on the *real* component,
    // but we are testing the App component's rendering based on state/props.
    // Let's simulate the state change directly on the App instance if possible,
    // or just check the props passed to TodoItem when App's state *is* editing.

    // Let's test the props passed when App's state is already editing
    const appInstance = new TodoApp({ model: mockModel });
    appInstance.state = { nowShowing: ALL_TODOS, editing: todo1.id };
    render(appInstance.render()); // Render the output of render directly

    const MockTodoItemAfterEdit = require('../src/todoItem').TodoItem; // Get the mock reference again
    expect(MockTodoItemAfterEdit).toHaveBeenCalledTimes(3); // Still 3 items rendered

    // Check props for todo1 (now editing)
    expect(MockTodoItemAfterEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todo1,
        editing: true, // Should be true now
        onToggle: expect.any(Function),
        onDestroy: expect.any(Function),
        onEdit: expect.any(Function),
        onSave: expect.any(Function),
        onCancel: expect.any(Function),
      }),
      {}
    );
    // Check props for todo2 (not editing)
    expect(MockTodoItemAfterEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todo2,
        editing: false, // Should be false
      }),
      {}
    );

    // Test filtering (ACTIVE_TODOS)
    rerender(<TodoApp model={mockModel} />); // Reset mock call count
    const appInstanceActive = new TodoApp({ model: mockModel });
    appInstanceActive.state = { nowShowing: ACTIVE_TODOS, editing: null };
    render(appInstanceActive.render());

    const MockTodoItemActive = require('../src/todoItem').TodoItem;
    expect(MockTodoItemActive).toHaveBeenCalledTimes(2); // Only 2 active items (todo1, todo3)
    expect(MockTodoItemActive).toHaveBeenCalledWith(expect.objectContaining({ todo: todo1 }), {});
    expect(MockTodoItemActive).toHaveBeenCalledWith(expect.objectContaining({ todo: todo3 }), {});
    expect(MockTodoItemActive).not.toHaveBeenCalledWith(expect.objectContaining({ todo: todo2 }), {}); // Completed item not rendered

    // Test filtering (COMPLETED_TODOS)
    rerender(<TodoApp model={mockModel} />); // Reset mock call count
    const appInstanceCompleted = new TodoApp({ model: mockModel });
    appInstanceCompleted.state = { nowShowing: COMPLETED_TODOS, editing: null };
    render(appInstanceCompleted.render());

    const MockTodoItemCompleted = require('../src/todoItem').TodoItem;
    expect(MockTodoItemCompleted).toHaveBeenCalledTimes(1); // Only 1 completed item (todo2)
    expect(MockTodoItemCompleted).toHaveBeenCalledWith(expect.objectContaining({ todo: todo2 }), {});
    expect(MockTodoItemCompleted).not.toHaveBeenCalledWith(expect.objectContaining({ todo: todo1 }), {});
    expect(MockTodoItemCompleted).not.toHaveBeenCalledWith(expect.objectContaining({ todo: todo3 }), {});
  });

  it('should pass correct props to TodoFooter component', () => {
    const todo1: ITodo = { id: '1', title: 'Todo 1', completed: false };
    const todo2: ITodo = { id: '2', title: 'Todo 2', completed: true };
    const todo3: ITodo = { id: '3', title: 'Todo 3', completed: false };
    mockModel.todos = [todo1, todo2, todo3]; // 2 active, 1 completed

    render(<TodoApp model={mockModel} />);

    const MockTodoFooter = require('../src/footer').TodoFooter; // Get the mock reference
    expect(MockTodoFooter).toHaveBeenCalledTimes(1);
    expect(MockTodoFooter).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 2, // Active count
        completedCount: 1, // Completed count
        nowShowing: ALL_TODOS, // Default state
        onClearCompleted: expect.any(Function),
      }),
      {}
    );

    // Simulate state change for nowShowing
    const appInstanceActive = new TodoApp({ model: mockModel });
    appInstanceActive.state = { nowShowing: ACTIVE_TODOS, editing: null };
    render(appInstanceActive.render());

    const MockTodoFooterActive = require('../src/footer').TodoFooter;
    expect(MockTodoFooterActive).toHaveBeenCalledTimes(1); // Called again
    expect(MockTodoFooterActive).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 2,
        completedCount: 1,
        nowShowing: ACTIVE_TODOS, // Updated state
      }),
      {}
    );
  });

  it('should call model methods when corresponding handlers are triggered by child components', () => {
    const todo1: ITodo = { id: '1', title: 'Todo 1', completed: false };
    mockModel.todos = [todo1];
    render(<TodoApp model={mockModel} />);

    const MockTodoItem = require('../src/todoItem').TodoItem;
    const todo1MockCall = MockTodoItem.mock.calls.find(call => call[0].todo.id === todo1.id);

    // Test onToggle handler
    todo1MockCall[0].onToggle();
    expect(mockModel.toggle).toHaveBeenCalledTimes(1);
    expect(mockModel.toggle).toHaveBeenCalledWith(todo1);

    // Test onDestroy handler
    todo1MockCall[0].onDestroy();
    expect(mockModel.destroy).toHaveBeenCalledTimes(1);
    expect(mockModel.destroy).toHaveBeenCalledWith(todo1);

    // Test onSave handler
    const newTitle = 'Updated Title';
    todo1MockCall[0].onSave(newTitle);
    expect(mockModel.save).toHaveBeenCalledTimes(1);
    expect(mockModel.save).toHaveBeenCalledWith(todo1, newTitle);
    // Check that editing state is reset after save
    // Need to spy on setState again
    const setStateSpy = jest.spyOn(TodoApp.prototype, 'setState');
    todo1MockCall[0].onSave(newTitle); // Call again to trigger spy
    expect(setStateSpy).toHaveBeenCalledWith({ editing: null });
    setStateSpy.mockRestore();

    // Test onCancel handler
    todo1MockCall[0].onCancel();
    // Check that editing state is reset after cancel
    const setStateSpyCancel = jest.spyOn(TodoApp.prototype, 'setState');
    todo1MockCall[0].onCancel(); // Call again to trigger spy
    expect(setStateSpyCancel).toHaveBeenCalledWith({ editing: null });
    setStateSpyCancel.mockRestore();

    // Test clearCompleted handler from Footer
    const MockTodoFooter = require('../src/footer').TodoFooter;
    const footerMockCall = MockTodoFooter.mock.calls[0];
    footerMockCall[0].onClearCompleted();
    expect(mockModel.clearCompleted).toHaveBeenCalledTimes(1);
  });

  it('should calculate active and completed counts correctly', () => {
    const todo1: ITodo = { id: '1', title: 'Todo 1', completed: false };
    const todo2: ITodo = { id: '2', title: 'Todo 2', completed: true };
    const todo3: ITodo = { id: '3', title: 'Todo 3', completed: false };
    mockModel.todos = [todo1, todo2, todo3]; // 2 active, 1 completed

    render(<TodoApp model={mockModel} />);

    const MockTodoFooter = require('../src/footer').TodoFooter;
    expect(MockTodoFooter).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 2,
        completedCount: 1,
      }),
      {}
    );

    const toggleAllCheckbox = screen.getByLabelText('Mark all as complete') as HTMLInputElement;
    // Checkbox should be unchecked if not all are complete
    expect(toggleAllCheckbox).not.toBeChecked();

    // Simulate all completed
    mockModel.todos = [
      { id: '1', title: 'Todo 1', completed: true },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    render(<TodoApp model={mockModel} />); // Rerender with updated model

    const MockTodoFooterAfterComplete = require('../src/footer').TodoFooter;
    expect(MockTodoFooterAfterComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 0,
        completedCount: 2,
      }),
      {}
    );

    const toggleAllCheckboxAfterComplete = screen.getByLabelText('Mark all as complete') as HTMLInputElement;
    // Checkbox should be checked if all are complete
    expect(toggleAllCheckboxAfterComplete).toBeChecked();
  });
});
```

**3. Running Tests and Coverage:**

Save the test files in the `__tests__` directory and the setup/config files in the project root.

Run tests from your terminal:

```bash
npm test
# or
yarn test
```

To get coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

This will run the tests and generate a `coverage` folder with an HTML report (`coverage/lcov-report/index.html`) and console output showing coverage percentages.

**Explanation of Mocks and Strategy:**

1.  **`localStorage`:** Mocked in `setupTests.ts` with a simple in-memory object. This prevents tests from interfering with actual browser storage and makes them predictable.
2.  **`Router`:** Mocked as a global variable in `setupTests.ts`. The mock captures the routes passed to its constructor and provides a mock `init` method. This allows testing that `componentDidMount` correctly configures the router without needing a real routing library.
3.  **`ReactDOM.findDOMNode`:** Mocked in `setupTests.ts`. Since RTL discourages direct DOM access and refs, and `findDOMNode` is used, we have to mock it. The mock returns a simple object that simulates a DOM element with the properties (`value`) and methods (`focus`, `setSelectionRange`) that the components expect to find on the element returned by `findDOMNode`. This is crucial for testing the input handling and `componentDidUpdate` logic.
4.  **`Utils.uuid`:** Mocked in `setupTests.ts` to return a fixed string. This makes tests involving adding new todos deterministic regarding the generated ID.
5.  **`TodoModel`:** Mocked using `jest.mock('../src/todoModel')` and `MockTodoModel.mockImplementation`. This allows us to pass a controlled mock instance to `TodoApp` and assert that `TodoApp` calls the expected methods on the model with the correct arguments. This isolates the `TodoApp`'s logic from the `TodoModel`'s implementation details.
6.  **`TodoItem` and `TodoFooter`:** Mocked using `jest.mock` in `setupTests.ts`. These mocks are used specifically in `app.test.tsx`. By replacing the real components with simple mocks that render a `data-testid` and pass through relevant props, we can test that `TodoApp` renders the correct child components with the correct data and callbacks, without needing to render the full child component trees. This keeps `app.test.tsx` focused on the `TodoApp`'s responsibilities.
7.  **Testing Real Component Logic:** For specific tests in `todoItem.test.tsx` that *must* interact with the component's internal state or lifecycle (`editText` state updates, `shouldComponentUpdate`, `componentDidUpdate`), the `jest.unmock` and re-import pattern is used. This allows testing the specific internal behavior of `TodoItem` while keeping it mocked for the higher-level `app.test.tsx`.
8.  **RTL Usage:** Tests use `render`, `screen`, `fireEvent`, and `userEvent` to interact with the components from a user's perspective (clicking buttons, typing in inputs, etc.) and assert on the rendered output and side effects (mock function calls).

This setup provides a robust testing environment covering the requirements and allowing for isolated testing of each module while handling the specific dependencies and patterns used in the original code. The coverage report will guide further test additions if needed to reach the 80% target.

### Tokens: {'input_tokens': 4096, 'output_tokens': 16921}
### Execution time: 92.66459703445435
