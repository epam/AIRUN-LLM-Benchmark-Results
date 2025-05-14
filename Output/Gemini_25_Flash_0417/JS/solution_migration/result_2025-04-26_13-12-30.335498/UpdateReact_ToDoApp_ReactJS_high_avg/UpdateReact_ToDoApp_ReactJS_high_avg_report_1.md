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
Okay, let's migrate this React application to React 18 using functional components, hooks, Redux Toolkit, and modern practices.

Here's the plan:

1.  **Setup:** Create a basic project structure and `package.json`. Install necessary dependencies (`react`, `react-dom`, `react-redux`, `@reduxjs/toolkit`, `classnames`, `nanoid`, `@types/react`, `@types/react-dom`, `@types/classnames`, `@types/react-redux`).
2.  **TypeScript:** Define all necessary interfaces and types in a dedicated file.
3.  **Redux Toolkit:**
    *   Define the state shape.
    *   Create a `todosSlice` using `createSlice` to manage the todo list state and filtering. This replaces the `TodoModel`.
    *   Implement reducers for all todo operations (add, toggle, destroy, save, toggle all, clear completed).
    *   Configure the Redux store using `configureStore`.
    *   Implement localStorage persistence by subscribing to store changes.
4.  **Routing:** Replace the global `Router` with a simple hash change listener that updates the filter state in Redux.
5.  **Utilities:** Replace `Utils.uuid` with `nanoid`. Remove `Utils.extend` (use spread syntax). Keep `Utils.pluralize`. Move localStorage logic to the Redux persistence.
6.  **Components:**
    *   Convert all class components (`TodoApp`, `TodoItem`, `TodoFooter`) to functional components using hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`).
    *   Break down the main `TodoApp` component into smaller, more focused components (e.g., `Header`, `MainSection`, `TodoList`, `TodoItem`, `Footer`).
    *   Use `useSelector` to read state from the Redux store.
    *   Use `useDispatch` to dispatch actions.
    *   Replace `ReactDOM.findDOMNode` and string `refs` with `useRef`.
    *   Use `React.memo` for performance optimization on components like `TodoItem` and `Footer`.
    *   Use `useCallback` for event handlers passed down to memoized components.
7.  **Entry Point:** Update `app.tsx` (or `index.tsx`) to use `ReactDOM.createRoot` and wrap the application in the `Provider` component from `react-redux`. Set up the hash change listener here.
8.  **Refinement:** Ensure strict TypeScript types are used everywhere. Clean up code, remove old comments, follow consistent formatting.

Let's implement this.

**Project Structure:**

```
my-todo-app/
├── public/
│   └── index.html  // Basic HTML file
├── src/
│   ├── components/
│   │   ├── App.tsx         // Main layout component
│   │   ├── Header.tsx      // New todo input
│   │   ├── MainSection.tsx // Toggle all checkbox and TodoList
│   │   ├── TodoList.tsx    // Renders list of TodoItems
│   │   ├── TodoItem.tsx    // Individual todo item
│   │   └── Footer.tsx      // Counts, filters, clear completed
│   ├── redux/
│   │   ├── todosSlice.ts   // Redux slice
│   │   └── store.ts        // Redux store configuration
│   ├── types/
│   │   └── index.ts        // TypeScript interfaces and types
│   ├── utils/
│   │   └── index.ts        // Utility functions (pluralize)
│   ├── constants.ts        // Constants
│   └── index.tsx           // Entry point (createRoot, Provider, hash listener)
├── package.json
├── tsconfig.json
└── .gitignore
```

**1. `package.json`**

```json
{
  "name": "my-todo-app",
  "version": "1.0.0",
  "description": "Migrated TodoMVC React app",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --open --mode development",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.1",
    "classnames": "^2.5.1",
    "nanoid": "^5.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.1.0"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@types/react-redux": "^7.1.33",
    "css-loader": "^6.10.0",
    "html-webpack-plugin": "^5.6.0",
    "style-loader": "^3.3.4",
    "ts-loader": "^9.5.1",
    "typescript": "^5.4.2",
    "webpack": "^5.90.3",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.3"
  }
}
```
*(Note: You'll need a `webpack.config.js` and `tsconfig.json` to build and run this. Basic configs are assumed.)*

**2. `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "es2016",
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
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

**3. `webpack.config.js`**

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true, // Needed for hash routing if not explicitly handled
  },
};
```

**4. `public/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>React • TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <section class="todoapp"></section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="http://github.com/petehunt/">petehunt</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</body>
</html>
```
*(Note: This assumes you have `todomvc-common` and `todomvc-app-css` installed or available in `node_modules`. You might need to adjust paths or copy these files.)*

**5. `src/types/index.ts`**

```typescript
import { store } from '../redux/store';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';

// Redux types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Component Prop Types
export interface HeaderProps {
  onNewTodo: (title: string) => void;
}

export interface MainSectionProps {
  todos: ITodo[];
  filter: TodoFilter;
  onToggleAll: (completed: boolean) => void;
  onToggle: (todo: ITodo) => void;
  onDestroy: (todo: ITodo) => void;
  onEdit: (todo: ITodo) => void;
  onSave: (todo: ITodo, text: string) => void;
  onCancel: () => void;
  editingId: string | null;
}

export interface TodoListProps {
  todos: ITodo[];
  onToggle: (todo: ITodo) => void;
  onDestroy: (todo: ITodo) => void;
  onEdit: (todo: ITodo) => void;
  onSave: (todo: ITodo, text: string) => void;
  onCancel: () => void;
  editingId: string | null;
}

export interface TodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
  editing: boolean;
}

export interface FooterProps {
  count: number;
  completedCount: number;
  nowShowing: TodoFilter;
  onClearCompleted: () => void;
  onFilterChange: (filter: TodoFilter) => void;
}
```

**6. `src/constants.ts`**

```typescript
const ALL_TODOS: TodoFilter = 'all';
const ACTIVE_TODOS: TodoFilter = 'active';
const COMPLETED_TODOS: TodoFilter = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };
```
*(Note: Added `TodoFilter` type annotation)*

**7. `src/utils/index.ts`**

```typescript
// Keep pluralize, remove uuid and extend
export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}

// localStorage logic will be handled in Redux store configuration
```

**8. `src/redux/todosSlice.ts`**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodo, TodoFilter } from '../types';
import { nanoid } from 'nanoid';
import { ALL_TODOS } from '../constants';

interface TodosState {
  todos: ITodo[];
  filter: TodoFilter;
  editingId: string | null; // Keep editing state in Redux for simplicity
}

// Load initial state from localStorage
const loadState = (): ITodo[] => {
  try {
    const serializedState = localStorage.getItem('react-todos');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return [];
  }
};

const initialState: TodosState = {
  todos: loadState(),
  filter: ALL_TODOS, // Default filter
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
          title: title,
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
    },
    saveTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        const text = action.payload.text.trim();
        if (text) {
          todo.title = text;
        } else {
          // If text is empty, destroy the todo
          state.todos = state.todos.filter(t => t.id !== todo.id);
        }
      }
      state.editingId = null; // Exit editing mode after saving
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
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
  setFilter,
  setEditingId,
} = todosSlice.actions;

export default todosSlice.reducer;
```

**9. `src/redux/store.ts`**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import { RootState } from '../types';

const localStorageMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  // Only save state if the action is related to todos modification
  if (action.type.startsWith('todos/')) {
     localStorage.setItem('react-todos', JSON.stringify(storeAPI.getState().todos.todos));
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

// Optional: Subscribe directly if middleware is not preferred for simple cases
// store.subscribe(() => {
//   localStorage.setItem('react-todos', JSON.stringify(store.getState().todos.todos));
// });
```
*(Note: Using a simple middleware to save state on relevant actions is slightly more efficient than subscribing to *any* state change, but for this app, either works fine.)*

**10. `src/components/Header.tsx`**

```tsx
import React, { useState, KeyboardEvent } from 'react';
import { ENTER_KEY } from '../constants';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = React.memo(({ onNewTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleNewTodoKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = newTodoText.trim();

    if (val) {
      onNewTodo(val);
      setNewTodoText('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodoText}
        onKeyDown={handleNewTodoKeyDown}
        onChange={(e) => setNewTodoText(e.target.value)}
        autoFocus={true}
      />
    </header>
  );
});

export default Header;
```

**11. `src/components/TodoItem.tsx`**

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { TodoItemProps } from '../types';

const TodoItem: React.FC<TodoItemProps> = React.memo(({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel,
  editing,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  // Sync internal edit state when todo title changes or editing starts/stops
  useEffect(() => {
    if (editing) {
      setEditText(todo.title);
      // Focus the input when editing starts
      const node = editFieldRef.current;
      if (node) {
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }
  }, [editing, todo.title]); // Re-run effect if editing state or todo title changes

  const handleSubmit = (event: FormEvent) => {
    const val = editText.trim();
    if (val) {
      onSave(val);
    } else {
      onDestroy();
    }
  };

  const handleEdit = () => {
    onEdit();
    // State update and focus handled by useEffect
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title); // Revert changes
      onCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setEditText(event.currentTarget.value);
  };

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: editing,
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

export default TodoItem;
```

**12. `src/components/TodoList.tsx`**

```tsx
import React from 'react';
import TodoItem from './TodoItem';
import { TodoListProps } from '../types';

const TodoList: React.FC<TodoListProps> = React.memo(({
  todos,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel,
  editingId,
}) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo)}
          onDestroy={() => onDestroy(todo)}
          onEdit={() => onEdit(todo)}
          editing={editingId === todo.id}
          onSave={(text) => onSave(todo, text)}
          onCancel={onCancel}
        />
      ))}
    </ul>
  );
});

export default TodoList;
```

**13. `src/components/MainSection.tsx`**

```tsx
import React, { useMemo } from 'react';
import TodoList from './TodoList';
import { MainSectionProps } from '../types';

const MainSection: React.FC<MainSectionProps> = React.memo(({
  todos,
  filter,
  onToggleAll,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel,
  editingId,
}) => {

  // Filter todos based on the current filter state
  const shownTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default: // 'all'
        return todos;
    }
  }, [todos, filter]); // Re-calculate only if todos or filter change

  const activeTodoCount = useMemo(() =>
    todos.reduce((count, todo) => count + (todo.completed ? 0 : 1), 0),
    [todos] // Re-calculate only if todos change
  );

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAll(event.target.checked);
  };

  if (todos.length === 0) {
    return null; // Don't render main section if no todos
  }

  return (
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
      <TodoList
        todos={shownTodos}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editingId={editingId}
      />
    </section>
  );
});

export default MainSection;
```

**14. `src/components/Footer.tsx`**

```tsx
import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils';
import { FooterProps, TodoFilter } from '../types';

const Footer: React.FC<FooterProps> = React.memo(({
  count,
  completedCount,
  nowShowing,
  onClearCompleted,
  onFilterChange,
}) => {
  const activeTodoWord = pluralize(count, 'item');
  const clearButton = completedCount > 0 ? (
    <button
      className="clear-completed"
      onClick={onClearCompleted}>
      Clear completed
    </button>
  ) : null;

  if (count === 0 && completedCount === 0) {
      return null; // Don't render footer if no todos at all
  }

  const renderFilterLink = (filter: TodoFilter, label: string) => (
    <li>
      <a
        href={`#/${filter === ALL_TODOS ? '' : filter}`}
        className={classNames({ selected: nowShowing === filter })}
        onClick={() => onFilterChange(filter)} // Use onClick to update state immediately
      >
        {label}
      </a>
    </li>
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        {renderFilterLink(ALL_TODOS, 'All')}
        {' '}
        {renderFilterLink(ACTIVE_TODOS, 'Active')}
        {' '}
        {renderFilterLink(COMPLETED_TODOS, 'Completed')}
      </ul>
      {clearButton}
    </footer>
  );
});

export default Footer;
```
*(Note: Added `onClick` handlers to filter links to update Redux state immediately, in addition to the `href` for basic navigation/bookmarking.)*

**15. `src/components/App.tsx`**

```tsx
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import MainSection from './MainSection';
import Footer from './Footer';
import {
  addTodo,
  toggleTodo,
  destroyTodo,
  saveTodo,
  toggleAll,
  clearCompleted,
  setEditingId,
  setFilter,
} from '../redux/todosSlice';
import { RootState, AppDispatch, ITodo, TodoFilter } from '../types';
import { ALL_TODOS } from '../constants';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, filter, editingId } = useSelector((state: RootState) => state.todos);

  // Calculate counts using useMemo for performance
  const activeTodoCount = React.useMemo(() =>
    todos.reduce((count, todo) => count + (todo.completed ? 0 : 1), 0),
    [todos]
  );
  const completedCount = todos.length - activeTodoCount;

  // --- Event Handlers (using useCallback) ---
  const handleNewTodo = useCallback((title: string) => {
    dispatch(addTodo(title));
  }, [dispatch]);

  const handleToggle = useCallback((todo: ITodo) => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch]);

  const handleDestroy = useCallback((todo: ITodo) => {
    dispatch(destroyTodo(todo.id));
  }, [dispatch]);

  const handleEdit = useCallback((todo: ITodo) => {
    dispatch(setEditingId(todo.id));
  }, [dispatch]);

  const handleSave = useCallback((todo: ITodo, text: string) => {
    dispatch(saveTodo({ id: todo.id, text }));
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(setEditingId(null));
  }, [dispatch]);

  const handleToggleAll = useCallback((completed: boolean) => {
    dispatch(toggleAll(completed));
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const handleFilterChange = useCallback((newFilter: TodoFilter) => {
     // Update Redux state
     dispatch(setFilter(newFilter));
     // Update hash in URL
     window.location.hash = newFilter === ALL_TODOS ? '' : `/${newFilter}`;
  }, [dispatch]);


  // --- Hash Routing Effect ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const newFilter: TodoFilter = (hash === ACTIVE_TODOS || hash === COMPLETED_TODOS) ? hash : ALL_TODOS;
      // Only dispatch if the filter actually changed
      if (newFilter !== filter) {
         dispatch(setFilter(newFilter));
      }
    };

    // Set initial filter based on hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Clean up listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch, filter]); // Depend on dispatch and filter


  return (
    <div>
      <Header onNewTodo={handleNewTodo} />
      <MainSection
        todos={todos}
        filter={filter}
        onToggleAll={handleToggleAll}
        onToggle={handleToggle}
        onDestroy={handleDestroy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        editingId={editingId}
      />
      <Footer
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={filter}
        onClearCompleted={handleClearCompleted}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default App;
```

**16. `src/index.tsx` (Entry Point)**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './components/App';
import { ALL_TODOS } from './constants';

// Ensure the initial hash is set correctly if none exists
if (!window.location.hash) {
    window.location.hash = '#/';
}

const container = document.getElementsByClassName('todoapp')[0];

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Could not find element with class 'todoapp' to mount the application.");
}
```

**Summary of Changes and Modernizations:**

1.  **React 18:** Used `createRoot` for rendering.
2.  **Functional Components & Hooks:** All class components replaced with functional components using `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`.
3.  **Redux Toolkit:** Replaced `TodoModel` with a Redux slice (`todosSlice`) managing the `todos`, `filter`, and `editingId` state. Actions and reducers are defined using `createSlice`.
4.  **State Management:** Centralized state in the Redux store. Components read state using `useSelector` and dispatch actions using `useDispatch`.
5.  **TypeScript:** Comprehensive types defined for state, actions, and component props. `any` usage minimized. Strict mode enabled in `tsconfig.json`.
6.  **Architecture:** `TodoApp` broken down into `App`, `Header`, `MainSection`, `TodoList`, `TodoItem`, `Footer` for better separation of concerns.
7.  **Modern Patterns:**
    *   `React.memo` used on `TodoItem`, `TodoList`, `MainSection`, `Footer`, and `Header` to prevent unnecessary re-renders.
    *   `useCallback` used for event handlers passed down to memoized components to maintain referential equality.
    *   `useMemo` used for calculating derived state (`shownTodos`, `activeTodoCount`) to avoid recalculation on every render.
    *   `useRef` used for direct DOM access (focusing the edit input) instead of string refs and `findDOMNode`.
8.  **Routing:** Replaced the external `Router` library with a simple `useEffect` hook in the main `App` component that listens to `hashchange` events and updates the Redux filter state. Filter links in the footer now also dispatch actions.
9.  **Utilities:** Replaced custom `uuid` with `nanoid`. Removed `Utils.extend` (spread syntax is used). `Utils.store` logic moved into the Redux store configuration (middleware or subscription).
10. **Performance:** `React.memo`, `useCallback`, `useMemo` applied. `shouldComponentUpdate` logic is implicitly handled by `React.memo` and stable props/state.
11. **Code Quality:** Consistent arrow functions, clear variable names, removed old comments, added new comments where necessary. Error handling added for `createRoot`.

This migration provides a robust, modern, and maintainable React application using current best practices.

### Tokens: {'input_tokens': 4085, 'output_tokens': 7543}
### Execution time: 57.400463819503784
