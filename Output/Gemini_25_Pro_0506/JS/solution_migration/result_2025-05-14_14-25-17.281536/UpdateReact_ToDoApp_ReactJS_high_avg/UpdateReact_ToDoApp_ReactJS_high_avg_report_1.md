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
Okay, I will migrate the provided React application to React 18.x with Redux Toolkit, TypeScript, and modern React patterns.

Here's the plan:

1.  **Project Structure**: I'll organize the files into `app` (for core app logic like store and main component), `components`, `types`, and `utils`.
2.  **Type Definitions (`types/index.ts`)**: Define `ITodo`, `FilterStatus`, and Redux state types.
3.  **Constants (`utils/constants.ts`)**: Migrate existing constants and add new ones like `LOCAL_STORAGE_KEY`.
4.  **Utilities (`utils/index.ts`)**: Replace custom UUID with `nanoid`, update `localStorage` handling, and keep `pluralize`.
5.  **Redux Setup**:
    *   `app/slices/todosSlice.ts`: Manages todos and `editingTodoId`. Loads initial state from `localStorage`.
    *   `app/slices/filterSlice.ts`: Manages `nowShowing` filter state.
    *   `app/store.ts`: Configures the Redux store with combined reducers and middleware for `localStorage` persistence.
6.  **Component Migration**:
    *   All class components will be converted to functional components using hooks.
    *   `TodoApp` will become `app/App.tsx`, orchestrating other components and handling routing logic.
    *   `TodoItem` will be `components/TodoItem.tsx`, managing its own edit state and dispatching actions.
    *   `TodoFooter` will be `components/TodoFooter.tsx`, displaying counts and filter links.
    *   New components:
        *   `components/TodoList.tsx`: Renders the list of `TodoItem`s.
        *   `components/TodoInput.tsx`: Handles new todo input.
    *   `React.memo` will be used for performance optimization.
    *   `useCallback` and `useMemo` will be used appropriately.
7.  **Entry Point (`index.tsx`)**: Set up React 18's `createRoot` and Redux `Provider`.
8.  **Routing**: The hash-based routing will be reimplemented using `window.location.hash` and a `useEffect` hook in `App.tsx` to dispatch filter changes to Redux.
9.  **HTML (`public/index.html`)**: A basic HTML structure to host the app.

Let's start with the code for each file.

**1. `package.json` (Illustrative)**

```json
{
  "name": "react-todo-migrated",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1", // Using latest stable
    "classnames": "^2.5.1",
    "nanoid": "^5.0.4", // ESM module
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4" // Using latest stable
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/node": "^18.17.0",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "vite": "^5.0.10", // Example bundler
    "@vitejs/plugin-react": "^4.2.1" // Vite React plugin
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "type": "module" // Important for nanoid v5+ and modern ESM
}
```

**2. `tsconfig.json` (Minimal for code generation)**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }] // If using Vite default setup
}
```

**3. `src/types/index.ts`**

```typescript
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';

// Redux state related types
export interface TodosState {
  todos: ITodo[];
  editingTodoId: string | null;
}

export interface FilterState {
  nowShowing: FilterStatus;
}

// This will be inferred by store.ts but good for reference
// export interface RootState {
//   todos: TodosState;
//   filter: FilterState;
// }
```

**4. `src/utils/constants.ts`**

```typescript
import { FilterStatus } from '../types';

export const ALL_TODOS: FilterStatus = 'all';
export const ACTIVE_TODOS: FilterStatus = 'active';
export const COMPLETED_TODOS: FilterStatus = 'completed';

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

export const LOCAL_STORAGE_KEY = 'react-todos-migrated';
```

**5. `src/utils/index.ts`**

```typescript
import { nanoid } from 'nanoid';

export const generateId = (): string => nanoid();

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const loadState = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.warn("Could not load state from localStorage for key:", key, error);
    return undefined;
  }
};

export const saveState = <T>(key: string, state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.warn("Could not save state to localStorage for key:", key, error);
  }
};
```

**6. Redux Setup**

**`src/app/slices/todosSlice.ts`**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodo, TodosState } from '../../types';
import { generateId, loadState } from '../../utils';
import { LOCAL_STORAGE_KEY } from '../../utils/constants';

// Load initial todos from localStorage, default to empty array if not found or error
const initialTodos = loadState<ITodo[]>(LOCAL_STORAGE_KEY) || [];

const initialState: TodosState = {
  todos: initialTodos,
  editingTodoId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (title) {
        const newTodo: ITodo = {
          id: generateId(),
          title,
          completed: false,
        };
        state.todos.push(newTodo);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      // If the destroyed todo was being edited, clear editingTodoId
      if (state.editingTodoId === action.payload) {
        state.editingTodoId = null;
      }
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const title = action.payload.title.trim();
      if (!title) { // If title becomes empty, treat as destroy
        state.todos = state.todos.filter(t => t.id !== action.payload.id);
        if (state.editingTodoId === action.payload.id) {
          state.editingTodoId = null;
        }
        return;
      }
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = title;
      }
      state.editingTodoId = null;
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      // If any of the cleared todos were being edited, clear editingTodoId
      // This is less likely scenario but good for robustness
      if (state.editingTodoId && state.todos.every(todo => todo.id !== state.editingTodoId)) {
        state.editingTodoId = null;
      }
    },
    setEditingTodoId: (state, action: PayloadAction<string | null>) => {
      state.editingTodoId = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  destroyTodo,
  saveTodo,
  toggleAll,
  clearCompleted,
  setEditingTodoId,
} = todosSlice.actions;

export default todosSlice.reducer;
```

**`src/app/slices/filterSlice.ts`**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, FilterStatus } from '../../types';
import { ALL_TODOS } from '../../utils/constants';

const initialState: FilterState = {
  nowShowing: ALL_TODOS,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.nowShowing = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
```

**`src/app/store.ts`**

```typescript
import { configureStore, Middleware } from '@reduxjs/toolkit';
import todosReducer from './slices/todosSlice';
import filterReducer from './slices/filterSlice';
import { saveState } from '../utils';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import { TodosState, FilterState } from '../types'; // Import specific state types

// Define the RootState type based on the reducers
export interface AppRootState {
  todos: TodosState;
  filter: FilterState;
}

// Middleware for saving todos to localStorage
const localStorageMiddleware: Middleware<{}, AppRootState> = store => next => action => {
  const result = next(action);
  // Check if the action is one that modifies todos
  if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('todos/')) {
    const todosState = store.getState().todos;
    saveState(LOCAL_STORAGE_KEY, todosState.todos);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**7. Components**

**`src/components/TodoInput.tsx`**

```tsx
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../app/slices/todosSlice';
import { ENTER_KEY } from '../utils/constants';

const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();
      const trimmedText = inputValue.trim();
      if (trimmedText) {
        dispatch(addTodo(trimmedText));
        setInputValue('');
      }
    }
  }, [dispatch, inputValue]);

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default React.memo(TodoInput);
```

**`src/components/TodoItem.tsx`**

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { ITodo } from '../types';
import { toggleTodo, destroyTodo, saveTodo, setEditingTodoId } from '../app/slices/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';

interface TodoItemProps {
  todo: ITodo;
  isEditing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isEditing }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
      const node = editFieldRef.current;
      if (node) {
        // Set selection range to the end of the text
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }
  }, [isEditing]);

  // Reset editText if todo.title changes externally while not editing
  useEffect(() => {
    if (!isEditing) {
      setEditText(todo.title);
    }
  }, [todo.title, isEditing]);


  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroyTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    dispatch(setEditingTodoId(todo.id));
    setEditText(todo.title); // Ensure editText is current when starting edit
  }, [dispatch, todo.id, todo.title]);

  const submitEdit = useCallback(() => {
    const trimmedText = editText.trim();
    // The saveTodo reducer handles empty title by destroying the todo
    dispatch(saveTodo({ id: todo.id, title: trimmedText }));
    // saveTodo reducer also sets editingTodoId to null
  }, [dispatch, todo.id, editText]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title); // Reset local edit text
      dispatch(setEditingTodoId(null)); // Cancel editing
    } else if (event.keyCode === ENTER_KEY) {
      submitEdit();
    }
  }, [dispatch, todo.title, submitEdit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

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
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button 
          className="destroy" 
          onClick={handleDestroy} 
          aria-label={`Delete ${todo.title}`}
        />
      </div>
      {isEditing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onBlur={submitEdit} // Save on blur
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label={`Edit ${todo.title}`}
        />
      )}
    </li>
  );
};

export default React.memo(TodoItem);
```

**`src/components/TodoList.tsx`**

```tsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import { ITodo, FilterStatus } from '../types';
import { RootState } from '../app/store'; // Use RootState from store

const getVisibleTodos = (todos: ITodo[], filter: FilterStatus): ITodo[] => {
  switch (filter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      // Should not happen with FilterStatus type, but good for safety
      console.warn('Unknown filter status:', filter);
      return todos;
  }
};

const TodoList: React.FC = () => {
  const { todos, editingTodoId } = useSelector((state: RootState) => state.todos);
  const nowShowing = useSelector((state: RootState) => state.filter.nowShowing);

  const visibleTodos = useMemo(() => getVisibleTodos(todos, nowShowing), [todos, nowShowing]);

  if (todos.length === 0) {
    return null; // Don't render list if no todos
  }
  
  return (
    <ul className="todo-list">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingTodoId === todo.id}
        />
      ))}
    </ul>
  );
};

export default React.memo(TodoList);
```

**`src/components/TodoFooter.tsx`**

```tsx
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../utils/constants';
import { pluralize } from '../utils';
import { FilterStatus } from '../types';
import { useDispatch } from 'react-redux';
import { clearCompleted } from '../app/slices/todosSlice';

interface TodoFooterProps {
  activeTodoCount: number;
  completedTodoCount: number;
  nowShowing: FilterStatus;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodoCount,
  completedTodoCount,
  nowShowing,
}) => {
  const dispatch = useDispatch();

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const activeTodoWord = pluralize(activeTodoCount, 'item');

  if (activeTodoCount === 0 && completedTodoCount === 0) {
    return null; // Don't render footer if no todos
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedTodoCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default React.memo(TodoFooter);
```

**`src/app/App.tsx`**

```tsx
import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import TodoList from '../components/TodoList';
import TodoFooter from '../components/TodoFooter';
import TodoInput from '../components/TodoInput';
import { toggleAll } from './slices/todosSlice';
import { setFilter } from './slices/filterSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../utils/constants';
import { FilterStatus } from '../types';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos); // Get the todos array
  const nowShowing = useSelector((state: RootState) => state.filter.nowShowing);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') as FilterStatus;
      // Validate hash value against known filter statuses
      if ([ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS].includes(hash)) {
        dispatch(setFilter(hash));
      } else {
        dispatch(setFilter(ALL_TODOS)); // Default to 'all' if hash is invalid
        if (window.location.hash !== '#/' && window.location.hash !== '') {
             window.location.hash = '#/'; // Correct URL to default
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Initial load based on current hash

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [dispatch]);

  const activeTodoCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedTodoCount = useMemo(() => todos.length - activeTodoCount, [todos, activeTodoCount]);
  const allTodosCompleted = useMemo(() => todos.length > 0 && activeTodoCount === 0, [todos.length, activeTodoCount]);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  }, [dispatch]);

  const hasTodos = todos.length > 0;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      {hasTodos && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={allTodosCompleted}
            aria-label="Mark all as complete"
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList />
        </section>
      )}
      {hasTodos && (
         <TodoFooter
            activeTodoCount={activeTodoCount}
            completedTodoCount={completedTodoCount}
            nowShowing={nowShowing}
          />
      )}
    </div>
  );
};

export default App;
```

**8. `src/index.tsx` (Entry Point)**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';

// Assuming you have base CSS files for TodoMVC look and feel.
// These would typically be in a `public` folder or imported if your bundler supports it.
// e.g., import './index.css';

const container = document.getElementsByClassName('todoapp')[0];

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element with class "todoapp". Ensure it exists in your HTML.');
  // Optionally, create and append a div if it's missing for development/testing
  const fallbackContainer = document.createElement('div');
  fallbackContainer.className = 'todoapp';
  document.body.appendChild(fallbackContainer);
  const root = ReactDOM.createRoot(fallbackContainer);
   root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
```

**9. `public/index.html` (Example)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React Todos - Migrated</title>
    <!-- Link to TodoMVC base CSS -->
    <!-- You would typically host these or include them via your build process -->
    <link rel="stylesheet" href="https://todomvc.com/examples/react/node_modules/todomvc-app-css/index.css">
    <link rel="stylesheet" href="https://todomvc.com/examples/react/node_modules/todomvc-common/base.css">
    <style>
      /* Small fix for potential Vite overlay issue if not using full HTML structure */
      body { position: relative; }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <section class="todoapp"></section>
    <footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Created by <a href="http://github.com/petehunt/">petehunt</a> (original React version)</p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      <p>Migrated to React 18 + Redux Toolkit by AI</p>
		</footer>
    <!-- If using Vite, it injects the script. Otherwise, point to your bundled JS -->
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

This completes the migration according to the specified requirements. The application is now using React 18, Redux Toolkit for state management, TypeScript for type safety, and modern React functional components with hooks. The structure is more modular, and performance optimizations like `React.memo`, `useCallback`, and `useMemo` are in place. The custom UUID and old localStorage methods have been updated. Error handling is basic but present (e.g., localStorage load/save warnings, root element check).

### Tokens: {'input_tokens': 4085, 'output_tokens': 6643}
### Execution time: 172.31200408935547
