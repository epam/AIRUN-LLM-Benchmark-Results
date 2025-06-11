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
### Thoughts:
**Modernizing a Legacy React Application: A Thought Process**

Alright, let's break this down. My goal is clear: migrate this old React app to the latest React 18, utilizing modern best practices and the power of Redux Toolkit. I've got a comprehensive plan, and it starts with a thorough code analysis. I'm looking at the existing components – the main `app.tsx`, each `todoItem.tsx`, the `footer.tsx`, the model, the utilities, and that crucial entry point. I need to understand the current state management, the interactions, and the overall architecture before I can start ripping things apart and putting them back together.

My strategy involves a complete overhaul of the state management using Redux Toolkit. No more custom pub/sub patterns for me! I'm creating a `todosSlice` to handle the core todo logic – adding, toggling, deleting, and updating. I'll also need a `filterSlice` to manage the "nowShowing" state, which dictates which todos are visible. I'll explore if `editing` is better as local component state. I'll ditch that old `TodoModel` entirely.

Next up, the components! I'm transitioning everything to functional components with hooks, embracing React 18 standards. `App.tsx` becomes the container, dispatching actions and handling the layout. I'm introducing a `TodoList` component to render the filtered list of todos, making the structure more clear and manageable. `TodoItem` will be a functional component with its own local "editing" state. The `Footer` will display the counts and filtering options, leveraging the Redux store. And of course, a new `Header` to handle adding new todos.

Routing will be handled by `react-router-dom`, a much more standard approach. The old custom router? History. I'm wrapping the whole app with the `<Provider>` and `<BrowserRouter>` in the entry point, setting up the Redux store using `configureStore` and using `createRoot` for React 18. I'll replace those older utilities, `nanoid` for `uuid`,  the spread operator in place of `extend`, and keep `pluralize`.  I'll explore making the store interact with local storage to load the existing state.

My plan then transitions to the step-by-step implementation. I'll make sure to get the packages set up first! I'm creating `todosSlice` and `filterSlice` within the store. The `todosSlice` is all about `createSlice` to manage the `todos` array. I'm going to load from local storage with state saved on changes. Then `filterSlice` will get the `nowShowing` state. Each component will be broken down, using hooks, mapping over filtered todos, and dispatching the actions that the user wants. The goal is to make these components very functional and decoupled. I'm going to add a listener to the store to save data to `localStorage`.

I am making sure that I have all of the necessary types and interfaces. I'll create a central `types.ts` file for my `Todo` interface and other shared types. The code structure will reflect the Redux slices and feature organization, and it'll follow this structure:

```
/
├── package.json
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── features/
│   │   ├── filters/
│   │   │   ├── Footer.tsx
│   │   │   └── filtersSlice.ts
│   │   ├── todos/
│   │   │   ├── Header.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── todosSlice.ts
│   ├── index.tsx
│   ├── constants.ts
│   ├── types.d.ts
│   └── utils/
│       ├── localStorage.ts
│       └── pluralize.ts
└── ... (other config files)
```

The rest of the migration will be defined component-by-component, keeping everything organized and easy to test and debug, and clearly organized into the `features` directory and subdirectories.


### Answer:
Of course. I will migrate the provided legacy React application to a modern, robust, and performant architecture using React 18, Redux Toolkit, and TypeScript.

Here is the refactored and modernized application code, structured by feature for clarity and maintainability.

### 1. Project Setup (`package.json`)

This file lists all the necessary dependencies for the new application.

```json
{
  "name": "react-todos-migrated",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@types/node": "^18.17.15",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.2.2"
  }
}
```

### 2. Core Application Files

These files set up the application's entry point, Redux store, and global types.

#### `src/index.tsx`

The application entry point now uses React 18's `createRoot` API and sets up the Redux `Provider` and `BrowserRouter` for routing.

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './app/App';
import 'todomvc-app-css/index.css';

const container = document.getElementsByClassName('todoapp')[0];

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element with class "todoapp"');
}
```

#### `src/app/App.tsx`

The main `App` component is now a functional component that orchestrates the layout and uses a custom hook to sync the URL with the Redux filter state.

```tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../features/todos/Header';
import { TodoList } from '../features/todos/TodoList';
import { Footer } from '../features/filters/Footer';
import { useAppDispatch, useAppSelector } from './hooks';
import { setFilter } from '../features/filters/filtersSlice';
import { selectTodos } from '../features/todos/todosSlice';
import { Filter } from '../types';

const App: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Sync URL hash with Redux filter state
  useEffect(() => {
    const routeFilter = location.pathname.substring(1) as Filter;
    dispatch(setFilter(routeFilter || 'all'));
  }, [location, dispatch]);

  const hasTodos = todos.length > 0;

  return (
    <>
      <Header />
      {hasTodos && <TodoList />}
      {hasTodos && <Footer />}
    </>
  );
};

export default App;
```

#### `src/app/store.ts`

The Redux store is configured using `configureStore` from Redux Toolkit. It combines reducers and includes middleware to automatically save the todos state to `localStorage`.

```ts
import { configureStore, Middleware } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import filtersReducer from '../features/filters/filtersSlice';
import { saveState } from '../utils/localStorage';

const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  // Only save todos state on actions related to the todos slice
  if (action.type?.startsWith('todos/')) {
    const { todos } = store.getState();
    saveState('react-todos', todos.todos);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### `src/app/hooks.ts`

This file provides pre-typed versions of the `useDispatch` and `useSelector` hooks for better TypeScript integration.

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. Features

The application is now organized by features (`todos`, `filters`).

#### `src/features/todos/todosSlice.ts`

This Redux slice manages all state and logic related to the todo items. It replaces the old `TodoModel` class with immutable state updates handled by reducers.

```ts
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo } from '../../types';
import { loadState } from '../../utils/localStorage';
import { RootState } from '../../app/store';

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: loadState('react-todos') || [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title: title.trim(),
          completed: false,
        },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  toggleAllTodos,
  clearCompletedTodos,
} = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;

export default todosSlice.reducer;
```

#### `src/features/todos/Header.tsx`

A dedicated functional component for the header and the new todo input field.

```tsx
import React, { useState, KeyboardEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addTodo } from './todosSlice';
import { ENTER_KEY } from '../../constants';

export const Header: React.FC = () => {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ENTER_KEY && text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};
```

#### `src/features/todos/TodoList.tsx`

This component is responsible for filtering and rendering the list of todos.

```tsx
import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { TodoItem } from './TodoItem';
import { selectTodos, toggleAllTodos } from './todosSlice';
import { selectFilter } from '../filters/filtersSlice';

export const TodoList: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const filter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeTodoCount = useMemo(() => {
    return todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  }, [todos]);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0 && todos.length > 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};
```

#### `src/features/todos/TodoItem.tsx`

The `TodoItem` is now a memoized functional component. It manages its own editing state locally using hooks (`useState`, `useEffect`, `useRef`) for better encapsulation and performance.

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../../app/hooks';
import { toggleTodo, deleteTodo, updateTodo } from './todosSlice';
import { Todo } from '../../types';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useAppDispatch();
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      if (trimmedText !== todo.title) {
        dispatch(updateTodo({ id: todo.id, title: trimmedText }));
      }
    } else {
      dispatch(deleteTodo(todo.id));
    }
    setIsEditing(false);
  }, [editText, todo.id, todo.title, dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ENTER_KEY) {
      handleSave();
    } else if (e.key === ESCAPE_KEY) {
      setEditText(todo.title);
      setIsEditing(false);
    }
  }, [handleSave, todo.title]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(deleteTodo(todo.id))} />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      )}
    </li>
  );
});
```

#### `src/features/filters/filtersSlice.ts`

A small slice to manage the UI filter state (`all`, `active`, `completed`).

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter } from '../../types';
import { RootState } from '../../app/store';

interface FiltersState {
  status: Filter;
}

const initialState: FiltersState = {
  status: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.status = action.payload;
    },
  },
});

export const { setFilter } = filtersSlice.actions;

export const selectFilter = (state: RootState) => state.filters.status;

export default filtersSlice.reducer;
```

#### `src/features/filters/Footer.tsx`

The `Footer` component displays counts and filter links. It gets all necessary data from the Redux store and uses `Link` from `react-router-dom` for navigation.

```tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectTodos, clearCompletedTodos } from '../todos/todosSlice';
import { selectFilter } from './filtersSlice';
import { pluralize } from '../../utils/pluralize';
import { Filter } from '../../types';

const FILTER_TITLES: { [key in Filter]: string } = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

export const Footer: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const currentFilter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  const activeTodoCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        {(Object.keys(FILTER_TITLES) as Filter[]).map(filter => (
          <li key={filter}>
            <Link
              to={filter === 'all' ? '/' : `/${filter}`}
              className={classNames({ selected: filter === currentFilter })}
            >
              {FILTER_TITLES[filter]}
            </Link>
          </li>
        ))}
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
```

### 4. Utilities and Types

#### `src/types.ts`

Centralized TypeScript type definitions.

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';
```

#### `src/constants.ts`

Application-wide constants.

```ts
export const ENTER_KEY = 'Enter';
export const ESCAPE_KEY = 'Escape';
```

#### `src/utils/localStorage.ts`

Robust functions for interacting with `localStorage`, including error handling.

```ts
export function loadState<T>(key: string): T | undefined {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return undefined;
  }
}

export function saveState<T>(key: string, state: T): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
}
```

#### `src/utils/pluralize.ts`

A simple, isolated utility function.

```ts
export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}
```

### Tokens: {'input_tokens': 4085, 'output_tokens': 7456, 'reasoning_tokens': 3159}
### Execution time: 73.61797714233398
