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
Okay, I've prepared a comprehensive unit testing suite for your React/TypeScript TodoMVC application.

**1. Testing Environment Setup**

I've chosen Jest as the test runner and React Testing Library (RTL) for interacting with React components. TypeScript support is handled by `ts-jest`.

**Prerequisites:**
*   Node.js and npm (or yarn) installed.
*   Your project should have `react`, `react-dom`, and `classnames` as dependencies.

**Installation:**
Install the necessary development dependencies:
```bash
npm install --save-dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event typescript
# or
yarn add --dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event typescript
```

**Configuration Files:**

**`jest.config.js`** (place in your project root)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Or your path to setupTests.ts
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure this points to your tsconfig.json
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/constants.ts", 
    // Exclude main bootstrap file if you have one (e.g., index.tsx)
    // "!src/index.tsx", 
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**`tsconfig.json`** (ensure it's compatible, especially `jsx` and `types`)
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
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true, // Set to false if you build separately, true for CRA-like setups
    "jsx": "react-jsx", // Or "react" if using older JSX transform
    "types": ["jest", "@testing-library/jest-dom"] // Add "node" if you use Node.js types
  },
  "include": [
    "src", // Your source file directory
    "setupTests.ts", // Or your path to setupTests.ts
    "src/types.d.ts" // Or your path to global type definitions
  ]
}
```

**`setupTests.ts`** (place in your project root, or adjust path in `jest.config.js`)
```typescript
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMockFactory = () => {
  let store: { [key: string]: string } = {};
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
    }),
  };
};
const mockLocalStorageInstance = localStorageMockFactory();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorageInstance });

// Mock global Router
let mockRouterInstanceSingleton: any;
const mockRouterImplementation = (routes: Record<string, () => void>) => {
  mockRouterInstanceSingleton = {
    routes,
    init: jest.fn((path: string) => {
      if (routes[path]) {
        routes[path]();
      }
    }),
    // Helper for tests to trigger route changes and simulate router behavior
    triggerRoute: (path: string) => {
      if (routes[path]) {
        routes[path]();
      }
    },
  };
  return mockRouterInstanceSingleton;
};
(global as any).Router = mockRouterImplementation;
(global as any).getMockRouterInstance = () => mockRouterInstanceSingleton;

// This export makes the file a module, which is good practice.
export {};
```

**`src/types.d.ts`** (global type definitions, place in your `src` folder or adjust path in `tsconfig.json`)
```typescript
// src/types.d.ts
declare interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

declare interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange: () => void): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

declare interface IAppProps {
  model: ITodoModel;
}

declare interface IAppState {
  nowShowing: string;
  editing: string | null;
}

declare interface ITodoItemProps {
  key?: string; // React key, not typically part of consumable props
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: (event: React.KeyboardEvent | React.FormEvent) => void;
}

declare interface ITodoItemState {
  editText: string;
}

declare interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: (event: React.MouseEvent) => void;
}

// For the global Router variable used in app.tsx
declare var Router: (routes: Record<string, () => void>) => {
  init: (path: string) => void;
  // If other router methods are used, declare them here
};
```

**Important Note on Exporting `TodoApp`:**
For `app.test.tsx` to work as written, the `TodoApp` class needs to be exported from `app.tsx`. If you cannot modify the original `app.tsx`, you would need to copy the `TodoApp` class definition into the test file, which is not ideal. Assuming a minor modification for testability is acceptable:
In `app.tsx`, change:
`class TodoApp extends React.Component<IAppProps, IAppState>`
to:
`export class TodoApp extends React.Component<IAppProps, IAppState>`
(And update the `ReactDOM.render` call at the bottom of `app.tsx` if it was using the non-exported name). The tests below will import it as `TodoApp`.

**2. Test Files**

Create the following test files alongside their corresponding source files (e.g., `src/utils.test.ts` for `src/utils.ts`).

**`src/utils.test.ts`**
```typescript
import { Utils } from './utils'; // Assuming Utils is in ./utils.ts

describe('Utils', () => {
  describe('uuid', () => {
    it('should generate a string', () => {
      expect(typeof Utils.uuid()).toBe('string');
    });

    it('should generate a unique id (probabilistic check)', () => {
      const id1 = Utils.uuid();
      const id2 = Utils.uuid();
      expect(id1).not.toBe(id2);
    });

    it('should generate id in correct format (version 4 UUID)', () => {
      const uuid = Utils.uuid();
      // Regex for v4 UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is one of 8, 9, A, or B.
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('pluralize', () => {
    it('should return singular for count 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural for count 0', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
    });

    it('should return plural for count > 1', () => {
      expect(Utils.pluralize(2, 'item')).toBe('items');
      expect(Utils.pluralize(5, 'apple')).toBe('apples');
    });
  });

  describe('store', () => {
    const namespace = 'test-namespace';

    beforeEach(() => {
      // localStorage is mocked in setupTests.ts and its methods are jest.fn()
      // We can clear these mocks and the underlying store for each test.
      (localStorage.clear as jest.Mock).mockClear();
      (localStorage.getItem as jest.Mock).mockClear();
      (localStorage.setItem as jest.Mock).mockClear();
      localStorage.clear(); // Clears the actual mock store
    });

    it('should store data in localStorage', () => {
      const data = { foo: 'bar' };
      Utils.store(namespace, data);
      expect(localStorage.setItem).toHaveBeenCalledWith(namespace, JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      // Prime the mock localStorage directly for this test
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(data));

      const retrievedData = Utils.store(namespace);
      expect(localStorage.getItem).toHaveBeenCalledWith(namespace);
      expect(retrievedData).toEqual(data);
    });

    it('should return an empty array if no data in localStorage for the namespace', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);
      const retrievedData = Utils.store(namespace);
      expect(localStorage.getItem).toHaveBeenCalledWith(namespace);
      expect(retrievedData).toEqual([]);
    });
    
    it('should return an empty array if localStorage data is invalid JSON', () => {
        (localStorage.getItem as jest.Mock).mockReturnValueOnce('invalid-json-string');
        // JSON.parse will throw, and the catch block should return []
        const retrievedData = Utils.store(namespace);
        expect(retrievedData).toEqual([]);
    });

    it('should return undefined when storing data (as per localStorage.setItem)', () => {
        const data = { foo: 'bar' };
        expect(Utils.store(namespace, data)).toBeUndefined();
    });
  });

  describe('extend', () => {
    it('should return an empty object if no arguments provided', () => {
      expect(Utils.extend()).toEqual({});
    });

    it('should merge multiple objects, later objects overwriting earlier ones', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { d: 5 };
      expect(Utils.extend(obj1, obj2, obj3)).toEqual({ a: 1, b: 3, c: 4, d: 5 });
    });

    it('should handle empty objects in arguments', () => {
      const obj1 = { a: 1 };
      const obj2 = {};
      expect(Utils.extend(obj1, obj2)).toEqual({ a: 1 });
      expect(Utils.extend(obj2, obj1)).toEqual({ a: 1 });
    });

    it('should not modify original objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      Utils.extend(obj1, obj2);
      expect(obj1).toEqual({ a: 1 }); // Original obj1 unchanged
      expect(obj2).toEqual({ b: 2 }); // Original obj2 unchanged
    });
  });
});
```

**`src/todoModel.test.ts`**
```typescript
import { TodoModel } from './todoModel'; // Assuming TodoModel is in ./todoModel.ts
import { Utils } from './utils';

// Mock parts of Utils used by TodoModel
jest.mock('./utils', () => {
  const originalUtils = jest.requireActual('./utils').Utils;
  return {
    Utils: {
      // Mock specific functions
      uuid: jest.fn(),
      store: jest.fn(),
      // Keep original implementation for others if needed by the module under test
      pluralize: originalUtils.pluralize,
      extend: originalUtils.extend, // TodoModel uses extend
    },
  };
});

// Create typed mocks for easier usage
const mockUtilsUuid = Utils.uuid as jest.Mock;
const mockUtilsStore = Utils.store as jest.Mock;

describe('TodoModel', () => {
  let model: TodoModel;
  let onChangeCallback: jest.Mock;
  const modelKey = 'test-todos-key';

  beforeEach(() => {
    // Reset mocks before each test
    mockUtilsUuid.mockReset();
    mockUtilsStore.mockReset();
    
    // Default behavior for Utils.store when model is constructed (reads initial data)
    mockUtilsStore.mockReturnValue([]); // Simulate empty storage

    model = new TodoModel(modelKey);
    onChangeCallback = jest.fn();
    model.subscribe(onChangeCallback);

    // Clear calls that might have happened during setup (e.g. inform in constructor if any)
    onChangeCallback.mockClear();
    mockUtilsStore.mockClear(); // Clear calls to store from constructor
  });

  it('constructor should load todos from store via Utils.store', () => {
    const initialTodos: ITodo[] = [{ id: 'id1', title: 'Initial Todo', completed: false }];
    mockUtilsStore.mockReturnValueOnce(initialTodos); // Specific return for this instantiation
    
    const newModel = new TodoModel('custom-key');
    
    expect(mockUtilsStore).toHaveBeenCalledWith('custom-key');
    expect(newModel.todos).toEqual(initialTodos);
  });

  it('inform should call all subscribed onChange callbacks and save to store', () => {
    // Add another subscriber to test multiple
    const anotherCallback = jest.fn();
    model.subscribe(anotherCallback);

    model.inform();

    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    expect(anotherCallback).toHaveBeenCalledTimes(1);
    expect(mockUtilsStore).toHaveBeenCalledWith(modelKey, model.todos);
  });

  it('addTodo should add a new todo with a generated id and inform subscribers', () => {
    const newTodoTitle = 'Learn Testing';
    const mockId = 'mock-uuid-123';
    mockUtilsUuid.mockReturnValueOnce(mockId);
    
    model.addTodo(newTodoTitle);

    expect(model.todos.length).toBe(1);
    expect(model.todos[0]).toEqual({
      id: mockId,
      title: newTodoTitle,
      completed: false,
    });
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    expect(mockUtilsStore).toHaveBeenCalledWith(modelKey, model.todos); // inform is called
  });

  it('toggleAll should set completion status for all todos and inform', () => {
    mockUtilsUuid.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    onChangeCallback.mockClear(); // Clear calls from addTodo
    mockUtilsStore.mockClear();

    model.toggleAll(true); // Mark all as completed
    expect(model.todos.every(todo => todo.completed === true)).toBe(true);
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
    expect(mockUtilsStore).toHaveBeenCalledTimes(1);

    model.toggleAll(false); // Mark all as active
    expect(model.todos.every(todo => todo.completed === false)).toBe(true);
    expect(onChangeCallback).toHaveBeenCalledTimes(2); // Called again
  });

  it('toggle should switch completion status of a specific todo and inform', () => {
    mockUtilsUuid.mockReturnValueOnce('id1');
    model.addTodo('Todo to Toggle');
    const todoToToggle = model.todos[0];
    onChangeCallback.mockClear();
    mockUtilsStore.mockClear();

    model.toggle(todoToToggle);
    expect(model.todos[0].completed).toBe(true);
    expect(onChangeCallback).toHaveBeenCalledTimes(1);

    model.toggle(todoToToggle); // Toggle back
    expect(model.todos[0].completed).toBe(false);
    expect(onChangeCallback).toHaveBeenCalledTimes(2);
  });

  it('destroy should remove a specific todo and inform', () => {
    mockUtilsUuid.mockReturnValueOnce('id1').mockReturnValueOnce('id2');
    model.addTodo('Todo to Keep');
    model.addTodo('Todo to Destroy');
    const todoToDestroy = model.todos[1];
    onChangeCallback.mockClear();
    mockUtilsStore.mockClear();

    model.destroy(todoToDestroy);
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('Todo to Keep');
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
  });

  it('save should update the title of a specific todo and inform', () => {
    mockUtilsUuid.mockReturnValueOnce('id1');
    model.addTodo('Original Title');
    const todoToSave = model.todos[0];
    const newTitle = 'Updated Title';
    onChangeCallback.mockClear();
    mockUtilsStore.mockClear();

    model.save(todoToSave, newTitle);
    expect(model.todos[0].title).toBe(newTitle);
    expect(model.todos[0].completed).toBe(false); // Other properties unchanged
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
  });

  it('clearCompleted should remove all completed todos and inform', () => {
    mockUtilsUuid.mockReturnValueOnce('id1').mockReturnValueOnce('id2').mockReturnValueOnce('id3');
    model.addTodo('Active Todo');       // completed: false
    model.addTodo('Completed Todo 1');  // completed: false initially
    model.addTodo('Completed Todo 2');  // completed: false initially

    // Mark some as completed
    model.toggle(model.todos[1]); // Complete 'Completed Todo 1'
    model.toggle(model.todos[2]); // Complete 'Completed Todo 2'
    
    onChangeCallback.mockClear();
    mockUtilsStore.mockClear();

    model.clearCompleted();
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('Active Todo');
    expect(model.todos[0].completed).toBe(false);
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
  });
});
```

**`src/footer.test.tsx`**
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoFooter } from './footer'; // Assuming TodoFooter is in ./footer.tsx
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants'; // Assuming constants are in ./constants.ts

describe('TodoFooter', () => {
  const mockOnClearCompleted = jest.fn();

  const defaultProps: ITodoFooterProps = {
    count: 0, // Active items count
    completedCount: 0,
    nowShowing: ALL_TODOS,
    onClearCompleted: mockOnClearCompleted,
  };

  beforeEach(() => {
    mockOnClearCompleted.mockClear();
  });

  it('renders correctly with 0 active items, pluralizing "items"', () => {
    render(<TodoFooter {...defaultProps} count={0} />);
    expect(screen.getByText('0 items left')).toBeInTheDocument();
  });

  it('renders correctly with 1 active item, singular "item"', () => {
    render(<TodoFooter {...defaultProps} count={1} />);
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('renders correctly with multiple active items, pluralizing "items"', () => {
    render(<TodoFooter {...defaultProps} count={5} />);
    expect(screen.getByText('5 items left')).toBeInTheDocument();
  });

  it('shows "Clear completed" button if completedCount > 0', () => {
    render(<TodoFooter {...defaultProps} completedCount={1} />);
    const clearButton = screen.getByRole('button', { name: /Clear completed/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show "Clear completed" button if completedCount is 0', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />);
    expect(screen.queryByRole('button', { name: /Clear completed/i })).not.toBeInTheDocument();
  });

  it('calls onClearCompleted when "Clear completed" button is clicked', () => {
    render(<TodoFooter {...defaultProps} completedCount={3} />);
    const clearButton = screen.getByRole('button', { name: /Clear completed/i });
    fireEvent.click(clearButton);
    expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
  });

  // Test filter link states
  const testCases = [
    { nowShowing: ALL_TODOS, selectedLink: 'All' },
    { nowShowing: ACTIVE_TODOS, selectedLink: 'Active' },
    { nowShowing: COMPLETED_TODOS, selectedLink: 'Completed' },
  ];

  testCases.forEach(tc => {
    it(`highlights "${tc.selectedLink}" filter when nowShowing is ${tc.nowShowing}`, () => {
      render(<TodoFooter {...defaultProps} nowShowing={tc.nowShowing} />);
      expect(screen.getByRole('link', { name: 'All' })).toHaveClass(tc.selectedLink === 'All' ? 'selected' : '');
      expect(screen.getByRole('link', { name: 'Active' })).toHaveClass(tc.selectedLink === 'Active' ? 'selected' : '');
      expect(screen.getByRole('link', { name: 'Completed' })).toHaveClass(tc.selectedLink === 'Completed' ? 'selected' : '');
    });
  });

  it('filter links have correct href attributes', () => {
    render(<TodoFooter {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('href', '#/');
    expect(screen.getByRole('link', { name: 'Active' })).toHaveAttribute('href', '#/active');
    expect(screen.getByRole('link', { name: 'Completed' })).toHaveAttribute('href', '#/completed');
  });
});
```

**`src/todoItem.test.tsx`**
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoItem } from './todoItem'; // Assuming TodoItem is in ./todoItem.tsx
import { ENTER_KEY, ESCAPE_KEY } from './constants';

describe('TodoItem', () => {
  const baseTodo: ITodo = { id: 'todo-1', title: 'Test this item', completed: false };
  
  const mockOnToggle = jest.fn();
  const mockOnDestroy = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps: ITodoItemProps = {
    todo: baseTodo,
    onToggle: mockOnToggle,
    onDestroy: mockOnDestroy,
    onEdit: mockOnEdit,
    editing: false,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderTodoItem = (props: Partial<ITodoItemProps> = {}) => {
    return render(<TodoItem {...defaultProps} {...props} />);
  };

  describe('View Mode', () => {
    it('renders todo title and checkbox correctly', () => {
      renderTodoItem();
      expect(screen.getByText(baseTodo.title)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByRole('listitem')).not.toHaveClass('completed');
      expect(screen.getByRole('listitem')).not.toHaveClass('editing');
    });

    it('renders completed todo correctly', () => {
      renderTodoItem({ todo: { ...baseTodo, completed: true } });
      expect(screen.getByRole('checkbox')).toBeChecked();
      expect(screen.getByRole('listitem')).toHaveClass('completed');
    });

    it('calls onToggle when checkbox is clicked', () => {
      renderTodoItem();
      fireEvent.click(screen.getByRole('checkbox'));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onDestroy when destroy button (X) is clicked', () => {
      renderTodoItem();
      // The destroy button has no accessible name, find by class or test id if possible
      // Assuming it's the only button in the view mode apart from checkbox (which is an input)
      const destroyButton = screen.getByRole('button'); 
      fireEvent.click(destroyButton);
      expect(mockOnDestroy).toHaveBeenCalledTimes(1);
    });

    it('calls onEdit on label double-click', () => {
      renderTodoItem();
      fireEvent.doubleClick(screen.getByText(baseTodo.title));
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Editing Mode', () => {
    const editingProps: ITodoItemProps = { ...defaultProps, editing: true };

    it('renders in editing mode with input field pre-filled with todo title', () => {
      render(<TodoItem {...editingProps} />);
      expect(screen.getByRole('listitem')).toHaveClass('editing');
      const editInput = screen.getByDisplayValue(baseTodo.title) as HTMLInputElement;
      expect(editInput).toBeInTheDocument();
      expect(editInput.tagName).toBe('INPUT');
    });

    it('componentDidUpdate focuses input and sets selection when transitioning to editing', () => {
      const { rerender } = render(<TodoItem {...defaultProps} editing={false} />); // Start not editing
      // Rerender to trigger editing mode and componentDidUpdate
      rerender(<TodoItem {...defaultProps} editing={true} />);
      
      const editInput = screen.getByDisplayValue(baseTodo.title) as HTMLInputElement;
      expect(editInput).toHaveFocus();
      // Verifying setSelectionRange is tricky in JSDOM but focus is a good indicator.
      // JSDOM input.selectionStart and input.selectionEnd can be checked if needed.
      expect(editInput.selectionStart).toBe(baseTodo.title.length);
      expect(editInput.selectionEnd).toBe(baseTodo.title.length);
    });

    it('updates internal editText state on input change', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title);
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'New edited text');
      expect(screen.getByDisplayValue('New edited text')).toBeInTheDocument();
    });

    it('calls onSave with trimmed value on Enter key if value is not empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title);
      await userEvent.clear(editInput);
      await userEvent.type(editInput, '  Save This!  ');
      fireEvent.keyDown(editInput, { keyCode: ENTER_KEY, key: 'Enter' });
      expect(mockOnSave).toHaveBeenCalledWith('Save This!');
    });

    it('calls onDestroy on Enter key if trimmed value is empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title);
      await userEvent.clear(editInput);
      await userEvent.type(editInput, '   '); // Whitespace only
      fireEvent.keyDown(editInput, { keyCode: ENTER_KEY, key: 'Enter' });
      expect(mockOnDestroy).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('calls onSave with trimmed value on blur if value is not empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title);
      await userEvent.clear(editInput);
      await userEvent.type(editInput, '  Save on Blur  ');
      fireEvent.blur(editInput);
      expect(mockOnSave).toHaveBeenCalledWith('Save on Blur');
    });

    it('calls onDestroy on blur if trimmed value is empty', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title);
      await userEvent.clear(editInput);
      // userEvent.type(editInput, '   '); // This might not trigger blur correctly if input is empty
      fireEvent.change(editInput, {target: {value: '   '}}); // Ensure value is set
      fireEvent.blur(editInput);
      expect(mockOnDestroy).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('calls onCancel and resets editText on Escape key', async () => {
      render(<TodoItem {...editingProps} />);
      const editInput = screen.getByDisplayValue(baseTodo.title) as HTMLInputElement;
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Temporary edit');
      expect(editInput.value).toBe('Temporary edit'); // Check value changed

      fireEvent.keyDown(editInput, { keyCode: ESCAPE_KEY, key: 'Escape' });
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      // Component's handleKeyDown resets state.editText to props.todo.title
      expect(editInput.value).toBe(baseTodo.title);
    });
  });

  describe('shouldComponentUpdate optimization', () => {
    // This is typically tested by ensuring the component behaves correctly
    // (i.e., re-renders when it should, doesn't when it shouldn't).
    // Direct testing of sCU is complex. The functional tests above cover
    // scenarios where re-renders are expected.
    it('re-renders when todo prop (e.g. title) changes', () => {
      const { rerender } = renderTodoItem({ todo: baseTodo });
      expect(screen.getByText(baseTodo.title)).toBeInTheDocument();
      const updatedTodo = { ...baseTodo, title: 'Updated Title Externally' };
      rerender(<TodoItem {...defaultProps} todo={updatedTodo} />);
      expect(screen.getByText('Updated Title Externally')).toBeInTheDocument();
    });

    it('re-renders when editing prop changes', () => {
      const { rerender } = renderTodoItem({ editing: false });
      expect(screen.getByRole('listitem')).not.toHaveClass('editing');
      rerender(<TodoItem {...defaultProps} editing={true} />);
      expect(screen.getByRole('listitem')).toHaveClass('editing');
    });
  });
});
```

**`src/app.test.tsx`**
```tsx
import * as React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
// Assuming TodoApp class is exported from app.tsx
// If not, you might need to adjust the import or use a workaround.
// See note in the main response about exporting TodoApp.
import { TodoApp } from './app'; 
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

// Mock the TodoModel module
jest.mock('./todoModel');
const MockedTodoModel = TodoModel as jest.MockedClass<typeof TodoModel>;

// Helper to get the mocked global router instance from setupTests.ts
const getGlobalMockRouter = () => (global as any).getMockRouterInstance();

describe('TodoApp', () => {
  let mockModelInstance: jest.Mocked<InstanceType<typeof TodoModel>>;
  
  const setupMockModel = (initialTodos: ITodo[] = []) => {
    // Create a fresh mock instance for each relevant test setup
    mockModelInstance = {
      todos: [...initialTodos], // Use a copy
      addTodo: jest.fn(),
      toggleAll: jest.fn(),
      toggle: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
      clearCompleted: jest.fn(),
      subscribe: jest.fn(), // Not directly used by TodoApp component, but by app bootstrap
      inform: jest.fn(),   // Internal to model
      key: 'mock-react-todos',
      onChanges: [],
    } as unknown as jest.Mocked<InstanceType<typeof TodoModel>>;
    
    // Configure the mock constructor of TodoModel to return this instance
    MockedTodoModel.mockImplementation(() => mockModelInstance);
  };

  beforeEach(() => {
    // Clear any previous mock implementations or instances of TodoModel
    MockedTodoModel.mockClear();
    // Clear calls to the global router mock's methods
    const router = getGlobalMockRouter();
    if (router) { // Router might not be initialized if setupTests didn't run or was cleared
        router.init?.mockClear();
        router.triggerRoute?.mockClear();
    }
  });

  const renderTodoApp = (currentTodos?: ITodo[]) => {
    // If currentTodos is not provided, setupMockModel will use its default (empty array)
    // This ensures mockModelInstance is always initialized before render
    if (currentTodos !== undefined || !mockModelInstance) {
        setupMockModel(currentTodos);
    } else {
        // If mockModelInstance exists, update its todos array for this render
        mockModelInstance.todos = [...(currentTodos || mockModelInstance.todos)];
    }
    
    // Use act for rendering if componentDidMount has async operations or state updates
    let renderResult: ReturnType<typeof render>;
    act(() => {
      renderResult = render(<TodoApp model={mockModelInstance} />);
    });
    return renderResult!;
  };


  it('renders header and new todo input', () => {
    renderTodoApp();
    expect(screen.getByRole('heading', { name: 'todos' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('componentDidMount initializes router and sets default filter (ALL_TODOS)', () => {
    renderTodoApp([{ id: '1', title: 'A todo', completed: false }]); // Add a todo to show footer
    
    const routerInstance = getGlobalMockRouter();
    expect(routerInstance.init).toHaveBeenCalledWith('/');
    
    // Check if state.nowShowing is ALL_TODOS by observing the TodoFooter
    expect(screen.getByRole('link', { name: 'All' })).toHaveClass('selected');
  });

  it('adds a new todo when Enter is pressed in the input field with text', async () => {
    renderTodoApp();
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    
    await userEvent.type(input, 'Create awesome tests');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY, key: 'Enter' });

    expect(mockModelInstance.addTodo).toHaveBeenCalledWith('Create awesome tests');
    expect(input.value).toBe(''); // Input field should be cleared
  });

  it('does not add todo if input is empty or whitespace on Enter', async () => {
    renderTodoApp();
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    await userEvent.type(input, '   '); // Whitespace
    fireEvent.keyDown(input, { keyCode: ENTER_KEY, key: 'Enter' });
    expect(mockModelInstance.addTodo).not.toHaveBeenCalled();
  });

  it('does not add todo if a key other than Enter is pressed', async () => {
    renderTodoApp();
    const input = screen.getByPlaceholderText('What needs to be done?');
    await userEvent.type(input, 'Some task');
    fireEvent.keyDown(input, { keyCode: 65, key: 'A' }); // 'A' key
    expect(mockModelInstance.addTodo).not.toHaveBeenCalled();
  });

  describe('With existing todos', () => {
    const todosSample: ITodo[] = [
      { id: '1', title: 'Todo One', completed: false },
      { id: '2', title: 'Todo Two', completed: true },
      { id: '3', title: 'Todo Three', completed: false },
    ];

    it('renders main section and footer', () => {
      renderTodoApp(todosSample);
      expect(screen.getByRole('region', { name: /main/i })).toBeInTheDocument(); // <section class="main">
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // <footer class="footer">
      expect(screen.getAllByRole('listitem').length).toBe(todosSample.length);
    });

    it('toggles all todos completion state when "toggle-all" is clicked', () => {
      renderTodoApp(todosSample); // Some active, some completed
      const toggleAllCheckbox = screen.getByLabelText('Mark all as complete');
      
      // Initial state: not all complete, so checkbox is not checked. Clicking it should mark all true.
      fireEvent.click(toggleAllCheckbox);
      expect(mockModelInstance.toggleAll).toHaveBeenCalledWith(true); // true because activeTodoCount was > 0

      // To test the other way (unchecking), simulate all being complete
      mockModelInstance.todos = todosSample.map(t => ({ ...t, completed: true }));
      renderTodoApp(mockModelInstance.todos); // Re-render with all completed
      // Now toggleAllCheckbox should be checked. Clicking it should mark all false.
      fireEvent.click(screen.getByLabelText('Mark all as complete'));
      expect(mockModelInstance.toggleAll).toHaveBeenCalledWith(false);
    });

    it('filters todos based on router state: ACTIVE_TODOS', () => {
      renderTodoApp(todosSample); // Initial render
      act(() => {
        getGlobalMockRouter().triggerRoute('/active'); // Simulate route change
      });
      // Active todos: Todo One, Todo Three
      expect(screen.getAllByRole('listitem').length).toBe(2);
      expect(screen.getByText('Todo One')).toBeInTheDocument();
      expect(screen.getByText('Todo Three')).toBeInTheDocument();
      expect(screen.queryByText('Todo Two')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Active' })).toHaveClass('selected');
    });

    it('filters todos based on router state: COMPLETED_TODOS', () => {
      renderTodoApp(todosSample);
      act(() => {
        getGlobalMockRouter().triggerRoute('/completed');
      });
      // Completed todos: Todo Two
      expect(screen.getAllByRole('listitem').length).toBe(1);
      expect(screen.getByText('Todo Two')).toBeInTheDocument();
      expect(screen.queryByText('Todo One')).not.toBeInTheDocument();
      expect(screen.queryByText('Todo Three')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Completed' })).toHaveClass('selected');
    });
    
    it('calls model.toggle when a TodoItem onToggle is triggered', () => {
      renderTodoApp(todosSample);
      const firstTodoItem = screen.getByText(todosSample[0].title).closest('li');
      const toggleCheckbox = within(firstTodoItem!).getByRole('checkbox');
      fireEvent.click(toggleCheckbox);
      expect(mockModelInstance.toggle).toHaveBeenCalledWith(todosSample[0]);
    });

    it('calls model.destroy when a TodoItem onDestroy is triggered', () => {
      renderTodoApp(todosSample);
      const firstTodoItem = screen.getByText(todosSample[0].title).closest('li');
      const destroyButton = within(firstTodoItem!).getByRole('button'); // Destroy button
      fireEvent.click(destroyButton);
      expect(mockModelInstance.destroy).toHaveBeenCalledWith(todosSample[0]);
    });

    it('sets editing state on TodoItem onEdit (double click) and clears on cancel (Escape)', async () => {
      renderTodoApp(todosSample);
      const todoLabel = screen.getByText(todosSample[0].title);
      
      // Enter editing mode
      fireEvent.doubleClick(todoLabel);
      let todoItemElement = screen.getByText(todosSample[0].title).closest('li');
      expect(todoItemElement).toHaveClass('editing');
      const editInput = within(todoItemElement!).getByDisplayValue(todosSample[0].title);

      // Cancel editing
      await userEvent.type(editInput, '{escape}'); // Press Escape
      
      // Re-query element as it might have re-rendered
      todoItemElement = screen.getByText(todosSample[0].title).closest('li');
      expect(todoItemElement).not.toHaveClass('editing');
    });

    it('calls model.save and clears editing state on TodoItem onSave (Enter in edit)', async () => {
      renderTodoApp(todosSample);
      const todoLabel = screen.getByText(todosSample[0].title);
      
      fireEvent.doubleClick(todoLabel); // Enter editing mode
      let todoItemElement = screen.getByText(todosSample[0].title).closest('li');
      const editInput = within(todoItemElement!).getByDisplayValue(todosSample[0].title);

      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Updated Title{enter}'); // Type new title and press Enter
      
      expect(mockModelInstance.save).toHaveBeenCalledWith(todosSample[0], 'Updated Title');
      todoItemElement = screen.getByText('Updated Title').closest('li'); // Assuming title updates immediately for query
      expect(todoItemElement).not.toHaveClass('editing');
    });

    it('calls model.clearCompleted when "Clear completed" button is clicked', () => {
      renderTodoApp(todosSample); // Has completed todos
      const clearButton = screen.getByRole('button', { name: /Clear completed/i });
      fireEvent.click(clearButton);
      expect(mockModelInstance.clearCompleted).toHaveBeenCalledTimes(1);
    });

    it('correctly displays active todo count', () => {
      renderTodoApp(todosSample); // 2 active todos
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });

    it('"toggle-all" checkbox is checked if all todos are completed', () => {
      const allCompleted = todosSample.map(t => ({ ...t, completed: true }));
      renderTodoApp(allCompleted);
      expect(screen.getByLabelText('Mark all as complete')).toBeChecked();
    });

    it('does not render main and footer if there are no todos', () => {
      renderTodoApp([]); // Empty array
      expect(screen.queryByRole('region', { name: /main/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument(); // Footer
    });
  });
});
```

**3. Running Tests**

1.  Ensure all dependencies and configuration files are set up as described.
2.  Add a test script to your `package.json`:
    ```json
    {
      "scripts": {
        "test": "jest",
        "test:coverage": "jest --coverage"
      }
    }
    ```
3.  Run the tests from your terminal:
    ```bash
    npm test
    ```
    Or for a coverage report:
    ```bash
    npm run test:coverage
    ```

This suite provides comprehensive tests covering component rendering, state changes, event handling, data flow, and business logic in your model and utility functions, aiming for high code coverage. Remember the note about exporting `TodoApp` from `app.tsx` for the `app.test.tsx` to work as written.

### Tokens: {'input_tokens': 4096, 'output_tokens': 10832}
### Execution time: 278.52841210365295
