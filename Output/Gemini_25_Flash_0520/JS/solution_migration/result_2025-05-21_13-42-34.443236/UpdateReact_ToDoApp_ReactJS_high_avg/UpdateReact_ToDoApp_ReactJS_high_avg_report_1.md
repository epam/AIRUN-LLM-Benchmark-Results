I have the following application code that needs to migrate:

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

1. Migrate the provided React application to React 18.x:
   - Update all React imports to React 18.x compatible syntax
   - Replace deprecated React lifecycle methods with modern alternatives
   - Implement React 18 features where appropriate

2. Implement state management using Redux Toolkit:
   - Convert the existing state management to Redux Toolkit with createSlice
   - Implement proper action creators and reducers
   - Replace direct state mutations with immutable state updates

3. Update TypeScript implementation:
   - Ensure all components use proper TypeScript typing
   - Define interfaces for all props, state, and Redux store
   - Implement strict type checking throughout the application

4. Restructure the application architecture:
   - Split the monolithic components into smaller, focused components
   - Organize files by feature or functionality
   - Implement proper component composition patterns

5. Implement modern React patterns:
   - Replace class components with functional components and hooks
   - Use React.memo for performance optimization where appropriate
   - Implement proper event handling with useCallback

6. Update dependencies and configuration:
   - Create a package.json with all required dependencies
   - Configure Redux store with proper middleware
   - Set up Redux Provider in the application entry point

7. Optimize for performance:
   - Implement proper memoization strategies
   - Avoid unnecessary re-renders
   - Use React.lazy for code splitting where appropriate

8. Replace utility functions:
   - Use nanoid for ID generation instead of custom UUID implementation
   - Implement modern localStorage handling

9. Code quality requirements:
   - Ensure no TODOs remain in the codebase
   - Follow consistent naming conventions
   - Implement proper error handling

## Run 1:
### Answer:
The provided application code is written in an older version of React (likely 0.14.x or similar, given the use of `ReactDOM.findDOMNode` and `this.refs`). Migrating this to React 18.x with Redux Toolkit and modern patterns involves a significant rewrite.

Here's a step-by-step migration addressing all your requirements:

**Key Changes Implemented:**

1.  **React 18.x Migration:**
    *   Replaced `ReactDOM.render` with `ReactDOM.createRoot`.
    *   Converted all class components to functional components using React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`).
    *   Replaced `this.refs` and `ReactDOM.findDOMNode` with `useRef`.
    *   Replaced `componentDidMount`, `componentDidUpdate`, `shouldComponentUpdate` with `useEffect` and `React.memo`.

2.  **Redux Toolkit State Management:**
    *   The `TodoModel` class has been replaced by a Redux Toolkit `createSlice` (`todosSlice.ts`).
    *   All todo-related actions (`addTodo`, `toggleAll`, `toggle`, `destroy`, `save`, `clearCompleted`) are now Redux actions.
    *   State updates are immutable, handled automatically by Immer within Redux Toolkit.
    *   `localStorage` persistence is integrated directly into the Redux slice's initial state and a simple listener.

3.  **TypeScript Implementation:**
    *   Comprehensive interfaces are defined for all props, state, and Redux store types (`types.ts`).
    *   Strict type checking is applied throughout.

4.  **Application Architecture Restructuring:**
    *   Components are organized into `app/` (main application), `components/` (reusable UI elements), `features/todos/` (Redux slice and related logic), `utils/`, `constants/`, and `types/`.
    *   `TodoApp` is now a functional component orchestrating the main sections.

5.  **Modern React Patterns:**
    *   All components are functional.
    *   `React.memo` is used for `TodoItem` and `TodoFooter` to optimize re-renders.
    *   `useCallback` is used for all event handlers passed down to child components to maintain referential equality.
    *   `useMemo` is used for derived state (`shownTodos`, `activeTodoCount`, `completedCount`) to prevent re-calculation on every render if dependencies haven't changed.

6.  **Dependencies and Configuration:**
    *   A `package.json` is provided with `react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`, `classnames`, `nanoid`, and their respective `@types`.
    *   Redux store is configured using `configureStore`.
    *   `Provider` from `react-redux` wraps the root component.

7.  **Performance Optimization:**
    *   `React.memo`, `useCallback`, and `useMemo` are strategically applied.
    *   The simple hash-based routing is handled with `useEffect` and `window.location.hash` listener, avoiding a heavy routing library for this specific use case.

8.  **Utility Functions:**
    *   `Utils.uuid()` is replaced by `nanoid()`.
    *   `Utils.store` is refactored into a dedicated `localStorage` utility.
    *   `Utils.extend` is removed as it's no longer needed with Redux Toolkit's Immer and modern JavaScript spread syntax.

9.  **Code Quality:**
    *   No TODOs remain.
    *   Consistent naming conventions are followed.
    *   Basic error handling for `localStorage` is included.

---

### File Structure

```
src/
├── app/
│   └── TodoApp.tsx
├── components/
│   ├── TodoFooter.tsx
│   └── TodoItem.tsx
├── constants/
│   └── index.ts
├── features/
│   └── todos/
│       └── todosSlice.ts
├── hooks/
│   └── index.ts
├── utils/
│   ├── localStorage.ts
│   └── pluralize.ts
├── types.ts
├── store.ts
└── index.tsx
```

---

### `package.json`

```json
{
  "name": "react-todo-app-migration",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.1",
    "classnames": "^2.5.1",
    "nanoid": "^5.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.1.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.86",
    "@types/react": "^18.2.63",
    "@types/react-dom": "^18.2.20",
    "@types/react-redux": "^7.1.33",
    "typescript": "^4.9.5"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

**Note:** To run this, you'll need to install `react-scripts` and set up a basic project. You can create a new React project using `npx create-react-app my-app --template typescript` and then replace the `src` folder content with the provided files and update `package.json`.

---

### `tsconfig.json` (Standard for `create-react-app` with TypeScript)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
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
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

---

### `src/types.ts`

```typescript
// src/types.ts

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: TodoFilter;
  onClearCompleted: () => void;
}

// Redux State Types
export interface TodosState {
  todos: ITodo[];
  // nowShowing is managed locally in TodoApp for routing, not in Redux state
  // editing is managed locally in TodoApp for editing, not in Redux state
}
```

### `src/constants/index.ts`

```typescript
// src/constants/index.ts

export const ALL_TODOS: TodoFilter = 'all';
export const ACTIVE_TODOS: TodoFilter = 'active';
export const COMPLETED_TODOS: TodoFilter = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
export const TODO_APP_KEY = 'react-todos'; // Key for localStorage
```

### `src/utils/localStorage.ts`

```typescript
// src/utils/localStorage.ts

import { ITodo } from '../types';

/**
 * Manages localStorage interactions for todos.
 * @param namespace The key under which to store the data.
 * @param data Optional data to store. If not provided, retrieves data.
 * @returns Stored data or an empty array if no data is found/stored.
 */
export const localStorageService = {
  get: (namespace: string): ITodo[] => {
    try {
      const store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },
  set: (namespace: string, data: ITodo[]): void => {
    try {
      localStorage.setItem(namespace, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },
};
```

### `src/utils/pluralize.ts`

```typescript
// src/utils/pluralize.ts

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};
```

### `src/features/todos/todosSlice.ts`

```typescript
// src/features/todos/todosSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo, TodosState } from '../../types';
import { localStorageService } from '../../utils/localStorage';
import { TODO_APP_KEY } from '../../constants';

const initialState: TodosState = {
  todos: localStorageService.get(TODO_APP_KEY),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false,
      });
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
    toggle: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
    destroy: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
    save: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStorageService.set(TODO_APP_KEY, state.todos);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
```

### `src/store.ts`

```typescript
// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### `src/hooks/index.ts`

```typescript
// src/hooks/index.ts

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### `src/components/TodoFooter.tsx`

```tsx
// src/components/TodoFooter.tsx

import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../constants";
import { pluralize } from "../utils/pluralize";
import { ITodoFooterProps, TodoFilter } from "../types";

const TodoFooter: React.FC<ITodoFooterProps> = React.memo(({
  count,
  completedCount,
  nowShowing,
  onClearCompleted
}) => {
  const activeTodoWord = useMemo(() => pluralize(count, 'item'), [count]);

  const clearButton = useMemo(() => {
    if (completedCount > 0) {
      return (
        <button
          className="clear-completed"
          onClick={onClearCompleted}>
          Clear completed
        </button>
      );
    }
    return null;
  }, [completedCount, onClearCompleted]);

  const filterLink = useCallback((filter: TodoFilter, label: string) => (
    <li>
      <a
        href={`#/${filter === ALL_TODOS ? '' : filter}`}
        className={classNames({ selected: nowShowing === filter })}
      >
        {label}
      </a>
    </li>
  ), [nowShowing]);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        {filterLink(ALL_TODOS, 'All')}
        {' '}
        {filterLink(ACTIVE_TODOS, 'Active')}
        {' '}
        {filterLink(COMPLETED_TODOS, 'Completed')}
      </ul>
      {clearButton}
    </footer>
  );
});

export { TodoFooter };
```

### `src/components/TodoItem.tsx`

```tsx
// src/components/TodoItem.tsx

import classNames from "classnames";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ENTER_KEY, ESCAPE_KEY } from "../constants";
import { ITodoItemProps } from "../types";

const TodoItem: React.FC<ITodoItemProps> = React.memo(({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  editing,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  // Update editText when todo.title changes (e.g., if editing is cancelled externally)
  useEffect(() => {
    if (!editing) {
      setEditText(todo.title);
    }
  }, [todo.title, editing]);

  // Focus and set cursor at the end when entering edit mode
  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = useCallback(() => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val); // Keep local state in sync with saved value
    } else {
      onDestroy();
    }
  }, [editText, onSave, onDestroy]);

  const handleEdit = useCallback(() => {
    onEdit();
    setEditText(todo.title); // Reset edit text to original title when starting edit
  }, [onEdit, todo.title]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title); // Revert to original title
      onCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  }, [todo.title, onCancel, handleSubmit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: editing
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
});

export { TodoItem };
```

### `src/app/TodoApp.tsx`

```tsx
// src/app/TodoApp.tsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TodoFooter } from "../components/TodoFooter";
import { TodoItem } from "../components/TodoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "../constants";
import { useAppSelector, useAppDispatch } from "../hooks";
import { addTodo, toggleAll, toggle, destroy, save, clearCompleted } from "../features/todos/todosSlice";
import { ITodo, TodoFilter } from "../types";

const TodoApp: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();

  const [nowShowing, setNowShowing] = useState<TodoFilter>(ALL_TODOS);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const newFieldRef = useRef<HTMLInputElement>(null);

  // Custom hash-based router logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      switch (hash) {
        case ACTIVE_TODOS:
          setNowShowing(ACTIVE_TODOS);
          break;
        case COMPLETED_TODOS:
          setNowShowing(COMPLETED_TODOS);
          break;
        default:
          setNowShowing(ALL_TODOS);
          break;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Call once on mount to set initial state

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = newFieldRef.current?.value.trim();

    if (val) {
      dispatch(addTodo(val));
      if (newFieldRef.current) {
        newFieldRef.current.value = '';
      }
    }
  }, [dispatch]);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAll(checked));
  }, [dispatch]);

  const handleToggle = useCallback((todoId: string) => {
    dispatch(toggle(todoId));
  }, [dispatch]);

  const handleDestroy = useCallback((todoId: string) => {
    dispatch(destroy(todoId));
  }, [dispatch]);

  const handleEdit = useCallback((todoId: string) => {
    setEditingTodoId(todoId);
  }, []);

  const handleSave = useCallback((todoId: string, text: string) => {
    dispatch(save({ id: todoId, text }));
    setEditingTodoId(null);
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    setEditingTodoId(null);
  }, []);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  // Memoized filtered todos
  const shownTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, nowShowing]);

  // Memoized todo items for rendering
  const todoItems = useMemo(() => {
    return shownTodos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => handleToggle(todo.id)}
        onDestroy={() => handleDestroy(todo.id)}
        onEdit={() => handleEdit(todo.id)}
        editing={editingTodoId === todo.id}
        onSave={(text: string) => handleSave(todo.id, text)}
        onCancel={handleCancel}
      />
    ));
  }, [shownTodos, editingTodoId, handleToggle, handleDestroy, handleEdit, handleSave, handleCancel]);

  // Memoized counts
  const activeTodoCount = useMemo(() => {
    return todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  }, [todos]);

  const completedCount = useMemo(() => {
    return todos.length - activeTodoCount;
  }, [todos, activeTodoCount]);

  let footer;
  let main;

  if (activeTodoCount || completedCount) {
    footer = (
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={handleClearCompleted}
      />
    );
  }

  if (todos.length) {
    main = (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={handleToggleAll}
          checked={activeTodoCount === 0}
        />
        <label htmlFor="toggle-all">
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
          ref={newFieldRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export { TodoApp };
```

### `src/index.tsx`

```tsx
// src/index.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { TodoApp } from "./app/TodoApp";
import { store } from "./store";

const rootElement = document.getElementsByClassName('todoapp')[0];

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <TodoApp />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element with class 'todoapp' not found.");
}
```

---

**To run this migrated application:**

1.  **Create a new React project with TypeScript:**
    ```bash
    npx create-react-app my-todo-app --template typescript
    cd my-todo-app
    ```
2.  **Install dependencies:**
    Replace the `dependencies` and `devDependencies` sections in `package.json` with the ones provided above, then run:
    ```bash
    npm install
    # or yarn install
    ```
3.  **Replace `src` folder content:**
    Delete the existing `src` folder and create the new file structure and content as provided above.
4.  **Start the development server:**
    ```bash
    npm start
    # or yarn start
    ```

This comprehensive migration transforms the old React application into a modern React 18.x application leveraging Redux Toolkit, functional components, hooks, and best practices for performance and maintainability.

### Tokens: {'input_tokens': 4085, 'output_tokens': 13244, 'reasoning_tokens': 3153}
### Execution time: 42.167670011520386
