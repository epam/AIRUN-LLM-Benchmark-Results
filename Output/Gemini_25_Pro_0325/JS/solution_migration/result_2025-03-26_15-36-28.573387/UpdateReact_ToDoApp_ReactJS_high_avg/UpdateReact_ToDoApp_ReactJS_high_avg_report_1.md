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
Okay, let's migrate the TodoMVC application following the specified steps.

**1. Project Setup & Dependencies (`package.json`)**

First, create a `package.json` file with the necessary dependencies:

```json
// package.json
{
  "name": "react-redux-todo-mvc",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5", // Or latest stable
    "classnames": "^2.3.2",
    "nanoid": "^4.0.2", // For ID generation
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2" // Or latest stable
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/node": "^18.17.1", // Or latest stable
    "@types/react": "^18.2.18",
    "@types/react-dom": "^18.2.7",
    "react-scripts": "5.0.1", // Example build tool
    "typescript": "^5.1.6" // Or latest stable
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
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

*Install dependencies:* `npm install` or `yarn install`

**2. TypeScript Configuration (`tsconfig.json`)**

Ensure you have a `tsconfig.json` with strict settings:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es6", // Target modern browsers
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true, // Enable strict type checking
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx" // Use new JSX transform
  },
  "include": [
    "src" // Source files directory
  ]
}
```

**3. File Structure**

Organize the code into a `src` directory:

```
src/
├── app/
│   ├── App.tsx
│   ├── store.ts
│   └── localStorage.ts
├── components/
│   └── Footer.tsx
├── features/todos/
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   └── todosSlice.ts
├── types/
│   └── index.ts
├── constants.ts
├── index.css       # (Standard TodoMVC CSS)
└── index.tsx       # (Application entry point)
```

**4. Define Types (`src/types/index.ts`)**

```typescript
// src/types/index.ts
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS;

export interface TodosState {
  todos: Todo[];
  filter: FilterStatus;
  editingId: string | null; // Track which todo is being edited
}

// Define RootState for useSelector hook
export interface RootState {
  todos: TodosState;
}
```

**5. Constants (`src/constants.ts`)**

This remains largely the same, but we can export FilterStatus type as well.

```typescript
// src/constants.ts
export const ALL_TODOS = 'all' as const;
export const ACTIVE_TODOS = 'active' as const;
export const COMPLETED_TODOS = 'completed' as const;

export const ENTER_KEY = 'Enter'; // Use key strings
export const ESCAPE_KEY = 'Escape'; // Use key strings

export const LOCAL_STORAGE_KEY = 'react-redux-todos';
```

**6. Local Storage Utility (`src/app/localStorage.ts`)**

Replace the old `Utils.store` with dedicated, type-safe functions.

```typescript
// src/app/localStorage.ts
import { Todo } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

export const loadState = (): Todo[] | undefined => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // No state saved
    }
    // Add basic validation if needed
    const parsedState = JSON.parse(serializedState);
    if (Array.isArray(parsedState)) {
        // Potentially add more validation here to ensure items match Todo structure
        return parsedState as Todo[];
    }
    return undefined;
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

export const saveState = (todos: Todo[]): void => {
  try {
    const serializedState = JSON.stringify(todos);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};
```

**7. Redux Slice (`src/features/todos/todosSlice.ts`)**

This replaces `TodoModel.ts` and manages the state logic.

```typescript
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodosState, FilterStatus } from '../../types';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { loadState } from '../../app/localStorage';

const initialState: TodosState = {
  todos: loadState() || [], // Load initial state from localStorage
  filter: ALL_TODOS,
  editingId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (title) {
        state.todos.push({
          id: nanoid(),
          title,
          completed: false,
        });
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      // If the deleted todo was being edited, stop editing
      if (state.editingId === action.payload) {
          state.editingId = null;
      }
    },
    startEditingTodo: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const trimmedTitle = title.trim();
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        if (trimmedTitle) {
          todo.title = trimmedTitle;
        } else {
          // If saved with empty title, remove the todo
          state.todos = state.todos.filter(t => t.id !== id);
        }
      }
      state.editingId = null; // Exit editing mode after save
    },
    cancelEditingTodo: (state) => {
      state.editingId = null;
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      const completed = action.payload;
      state.todos.forEach(todo => {
        todo.completed = completed;
      });
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  destroyTodo,
  startEditingTodo,
  saveTodo,
  cancelEditingTodo,
  clearCompleted,
  toggleAll,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
```

**8. Redux Store (`src/app/store.ts`)**

Configure the store and add middleware for saving state to localStorage.

```typescript
// src/app/store.ts
import { configureStore, Middleware } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import { saveState } from './localStorage';
import { RootState } from '../types'; // Import RootState

// Middleware to save todos to localStorage after relevant actions
const localStorageMiddleware: Middleware<{}, RootState> = store => next => action => {
  const result = next(action);
  // Only save state if the action might have changed the todos array
  if (action.type.startsWith('todos/')) {
      // Avoid saving on filter changes or editing state changes
      if (!action.type.endsWith('setFilter') && !action.type.endsWith('startEditingTodo') && !action.type.endsWith('cancelEditingTodo')) {
          const { todos } = store.getState().todos;
          saveState(todos);
      }
  }
  return result;
};


export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
```

**9. Application Entry Point (`src/index.tsx`)**

Set up React 18 root rendering and Redux Provider.

```typescript
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import './index.css'; // Import TodoMVC styles

const container = document.getElementsByClassName('todoapp')[0];

if (container) {
  const root = createRoot(container); // Use createRoot for React 18
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root container '.todoapp' not found.");
}
```

**10. Main Application Component (`src/app/App.tsx`)**

This component orchestrates the header, list, and footer. It also handles routing/filter logic.

```typescript
// src/app/App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, FilterStatus } from '../types';
import { addTodo, setFilter } from '../features/todos/todosSlice';
import TodoList from '../features/todos/TodoList';
import Footer from '../components/Footer';
import { ENTER_KEY, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFilter = useSelector((state: RootState) => state.todos.filter);
  const [newTodo, setNewTodo] = useState<string>('');

  // Handle hash changes for filtering
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let filter: FilterStatus = ALL_TODOS;
      if (hash === '#/active') {
        filter = ACTIVE_TODOS;
      } else if (hash === '#/completed') {
        filter = COMPLETED_TODOS;
      }
      dispatch(setFilter(filter));
    };

    // Initial filter setup based on hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);


  const handleNewTodoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  }, []);

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const title = newTodo.trim();
    if (title) {
      dispatch(addTodo(title));
      setNewTodo(''); // Clear input
    }
  }, [newTodo, dispatch]);

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleNewTodoChange}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      <TodoList />
      <Footer />
    </div>
  );
};

export default App;
```

**11. Todo List Component (`src/features/todos/TodoList.tsx`)**

Displays the list of todos and the "toggle all" checkbox.

```typescript
// src/features/todos/TodoList.tsx
import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, Todo } from '../../types';
import { toggleAll } from './todosSlice';
import TodoItem from './TodoItem';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default: // ALL_TODOS
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodoCount = useMemo(() => {
    return todos.reduce((count, todo) => (!todo.completed ? count + 1 : count), 0);
  }, [todos]);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  }, [dispatch]);

  if (todos.length === 0) {
    return null; // Don't render main/footer if no todos
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={activeTodoCount === 0 && todos.length > 0} // Checked if all are complete
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

export default TodoList; // No need for React.memo here as it depends on global state
```

**12. Todo Item Component (`src/features/todos/TodoItem.tsx`)**

Represents a single todo item, handling display, editing, toggling, and deletion.

```typescript
// src/features/todos/TodoItem.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Todo, RootState, AppDispatch } from '../../types';
import { toggleTodo, destroyTodo, startEditingTodo, saveTodo, cancelEditingTodo } from './todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const editingId = useSelector((state: RootState) => state.todos.editingId);
  const isEditing = editingId === todo.id;

  const [editText, setEditText] = useState<string>(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Move cursor to end
      editInputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText.length]); // Added editText.length dependency for robustness

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroyTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    dispatch(startEditingTodo(todo.id));
    setEditText(todo.title); // Reset edit text to current title on edit start
  }, [dispatch, todo.id, todo.title]);

  const handleSave = useCallback(() => {
    const newTitle = editText.trim();
    if (newTitle === todo.title) {
        // If title hasn't changed, just cancel editing
        dispatch(cancelEditingTodo());
    } else {
        // Dispatch save action (reducer handles empty title case)
        dispatch(saveTodo({ id: todo.id, title: newTitle }));
    }
    // Exit editing mode is handled within the saveTodo reducer
  }, [dispatch, todo.id, todo.title, editText]);

  const handleCancel = useCallback(() => {
    dispatch(cancelEditingTodo());
    setEditText(todo.title); // Reset edit text on cancel
  }, [dispatch, todo.title]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ESCAPE_KEY) {
      handleCancel();
    } else if (event.key === ENTER_KEY) {
      handleSave();
    }
  }, [handleCancel, handleSave]); // Dependencies are stable callbacks

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
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onBlur={handleSave} // Save on blur
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
}); // Use React.memo for performance

export default TodoItem;
```

**13. Footer Component (`src/components/Footer.tsx`)**

Displays counts, filter links, and the "clear completed" button.

```typescript
// src/components/Footer.tsx
import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState, AppDispatch } from '../types';
import { clearCompleted } from '../features/todos/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

// Simple pluralize utility (can be moved to a utils file if needed)
const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

const Footer: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const activeTodoCount = useMemo(() => {
    return todos.reduce((count, todo) => (!todo.completed ? count + 1 : count), 0);
  }, [todos]);

  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  // Don't render footer if there are no todos
  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: currentFilter === ALL_TODOS })}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: currentFilter === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: currentFilter === COMPLETED_TODOS })}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}); // Use React.memo for performance

export default Footer;
```

**14. CSS (`src/index.css`)**

You'll need the standard TodoMVC CSS. You can typically find this in the official TodoMVC repository examples (e.g., `todomvc-app-css/index.css` and `todomvc-common/base.css`). Copy the contents into `src/index.css`.

---

**Summary of Changes:**

1.  **React 18:** Updated `index.tsx` to use `createRoot`.
2.  **Redux Toolkit:** Implemented `todosSlice.ts` using `createSlice`, configured the store in `store.ts` with middleware for persistence, and wrapped the app in `<Provider>`.
3.  **TypeScript:** Defined clear interfaces (`types/index.ts`), used them throughout, and configured `tsconfig.json` for strict checking.
4.  **Restructure:** Organized files into `app`, `components`, `features`, `types`.
5.  **Modern React:** Converted all class components to functional components using hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useSelector`, `useDispatch`). Removed `ReactDOM.findDOMNode` and string refs.
6.  **Dependencies:** Updated `package.json` with modern libraries.
7.  **Performance:** Used `React.memo` on `TodoItem` and `Footer`, `useMemo` for derived data calculations, and `useCallback` for event handlers passed as props or used in `useEffect` dependencies.
8.  **Utilities:** Replaced custom UUID with `nanoid`, refactored `localStorage` handling into dedicated, safer functions. Removed `Utils.extend`. Used string `event.key` instead of key codes.
9.  **Code Quality:** Removed old comments, used consistent naming, added basic `localStorage` error handling. Routing is handled via hash changes and `useEffect`.

This migrated version uses modern React and Redux practices, offering better maintainability, type safety, and performance.

### Tokens: {'input_tokens': 4066, 'output_tokens': 5883}
### Execution time: 62.850728034973145
