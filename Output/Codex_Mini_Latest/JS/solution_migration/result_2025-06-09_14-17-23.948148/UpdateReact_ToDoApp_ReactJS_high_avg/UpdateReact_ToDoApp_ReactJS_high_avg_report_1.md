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
Below is a complete rewrite of your Todo‑app, migrated to React 18.x, refactored into functional components with hooks, backed by Redux Toolkit, fully typed in TypeScript, and reorganized by feature.  We also replaced the custom UUID/local‑storage utilities with **nanoid** and modern storage handling, applied React 18 APIs (e.g. `createRoot`), leveraged React.lazy/Suspense for code‐splitting, used React.memo/useCallback for perf, and added strict typing everywhere.

---

## 1. Project root files

### **package.json**

```json
{
  "name": "react‑todos",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "react‑scripts start",
    "build": "react‑scripts build",
    "test": "react‑scripts test",
    "eject": "react‑scripts eject"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.0",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/react": "^18.0.25",
    "@types/react-dom": "^18.0.9",
    "react‑scripts": "5.0.1",
    "typescript": "^4.9.4"
  }
}
```
【F:package.json】

---

### **tsconfig.json**

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```
【F:tsconfig.json】

---

## 2. Folder structure

```
.
├── package.json
├── tsconfig.json
└── src
    ├── index.tsx
    ├── App.tsx
    ├── constants.ts
    ├── hooks.ts
    ├── store.ts
    └── features
        └── todos
            ├── TodoFooter.tsx
            ├── TodoItem.tsx
            ├── TodoList.tsx
            ├── todosSlice.ts
            └── types.ts
```

---

## 3. Application entry point and store setup

### **src/index.tsx**

```tsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
```
【F:src/index.tsx】

---

### **src/store.ts**

```ts
import { configureStore, Middleware } from "@reduxjs/toolkit";
import todosReducer from "./features/todos/todosSlice";

// Middleware to persist todos to localStorage on every todos‑slice action
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("todos/")) {
    const state = storeAPI.getState();
    localStorage.setItem("todos", JSON.stringify(state.todos.items));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    todos: todosReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});

// Inferred types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
【F:src/store.ts】

---

### **src/hooks.ts**

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
【F:src/hooks.ts】

---

## 4. Constants

### **src/constants.ts**

```ts
export type Filter = "all" | "active" | "completed";

export const ALL_TODOS: Filter = "all";
export const ACTIVE_TODOS: Filter = "active";
export const COMPLETED_TODOS: Filter = "completed";
```
【F:src/constants.ts】

---

## 5. Todos feature slice and types

### **src/features/todos/types.ts**

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  items: Todo[];
  filter: "all" | "active" | "completed";
}
```
【F:src/features/todos/types.ts】

---

### **src/features/todos/todosSlice.ts**

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { Todo, TodosState } from "./types";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../../constants";

// Hydrate initial todos from localStorage
const saved = localStorage.getItem("todos");
const initialState: TodosState = {
  items: saved ? JSON.parse(saved) : [],
  filter: ALL_TODOS
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: { id: nanoid(), title, completed: false }
        };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items.forEach((t) => (t.completed = action.payload));
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.items.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    clearCompleted(state) {
      state.items = state.items.filter((t) => !t.completed);
    },
    setFilter(state, action: PayloadAction<typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS>) {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  editTodo,
  deleteTodo,
  clearCompleted,
  setFilter
} = todosSlice.actions;

export default todosSlice.reducer;
```
【F:src/features/todos/todosSlice.ts】

---

## 6. Main App component

### **src/App.tsx**

```tsx
import React, { useState, useCallback, useEffect, KeyboardEvent, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import {
  addTodo,
  toggleTodo,
  toggleAll,
  deleteTodo,
  editTodo,
  clearCompleted,
  setFilter
} from "./features/todos/todosSlice";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, Filter } from "./constants";
import "./App.css"; // your styles

// Code‑split the TodoList and Footer
const TodoList = React.lazy(() => import("./features/todos/TodoList"));
const TodoFooter = React.lazy(() => import("./features/todos/TodoFooter"));

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.items);
  const filter = useAppSelector((state) => state.todos.filter);
  const [newTitle, setNewTitle] = useState("");

  // Sync URL hash to filter state
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#/", "") as Filter;
      if ([ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS].includes(hash)) {
        dispatch(setFilter(hash));
      } else {
        dispatch(setFilter(ALL_TODOS));
      }
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [dispatch]);

  const handleNewKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || newTitle.trim() === "") return;
      e.preventDefault();
      dispatch(addTodo(newTitle.trim()));
      setNewTitle("");
    },
    [dispatch, newTitle]
  );

  const handleToggleAll = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      dispatch(toggleAll(e.currentTarget.checked));
    },
    [dispatch]
  );

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const activeCount = todos.reduce((acc, t) => (t.completed ? acc : acc + 1), 0);
  const completedCount = todos.length - activeCount;

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleNewKeyDown}
          autoFocus
        />
      </header>

      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={activeCount === 0}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <React.Suspense fallback={<div>Loading tasks...</div>}>
            <TodoList
              todos={todos}
              filter={filter}
              onToggle={(id) => dispatch(toggleTodo(id))}
              onDelete={(id) => dispatch(deleteTodo(id))}
              onEdit={(id, title) => dispatch(editTodo({ id, title }))}
            />
          </React.Suspense>
        </section>
      )}

      {activeCount > 0 || completedCount > 0 ? (
        <React.Suspense fallback={<div />}>
          <TodoFooter
            activeCount={activeCount}
            completedCount={completedCount}
            currentFilter={filter}
            onClearCompleted={handleClearCompleted}
          />
        </React.Suspense>
      ) : null}
    </div>
  );
};

export default App;
```
【F:src/App.tsx】

---

## 7. `TodoList` and `TodoItem` components

### **src/features/todos/TodoList.tsx**

```tsx
import React, { FC, useCallback } from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

const TodoList: FC<TodoListProps> = ({ todos, filter, onToggle, onDelete, onEdit }) => {
  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const handleToggle = useCallback((id: string) => onToggle(id), [onToggle]);
  const handleDelete = useCallback((id: string) => onDelete(id), [onDelete]);
  const handleEdit = useCallback((id: string, title: string) => onEdit(id, title), [onEdit]);

  return (
    <ul className="todo-list">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </ul>
  );
};

export default React.memo(TodoList);
```
【F:src/features/todos/TodoList.tsx】

---

### **src/features/todos/TodoItem.tsx**

```tsx
import React, { FC, useState, useRef, useEffect, KeyboardEvent } from "react";
import classNames from "classnames";
import { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(
        editInputRef.current.value.length,
        editInputRef.current.value.length
      );
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditedTitle(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = () => {
    if (!editing) return;
    commitEdit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditedTitle(todo.title);
      setEditing(false);
    } else if (e.key === "Enter") {
      commitEdit();
    }
  };

  const commitEdit = () => {
    const val = editedTitle.trim();
    if (val) {
      onEdit(todo.id, val);
    } else {
      onDelete(todo.id);
    }
    setEditing(false);
  };

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={() => onDelete(todo.id)} />
      </div>
      {editing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editedTitle}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default React.memo(TodoItem);
```
【F:src/features/todos/TodoItem.tsx】

---

## 8. `TodoFooter` component

### **src/features/todos/TodoFooter.tsx**

```tsx
import React, { FC } from "react";
import classNames from "classnames";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, Filter } from "../../constants";

interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  currentFilter: Filter;
  onClearCompleted: () => void;
}

const TodoFooter: FC<TodoFooterProps> = ({
  activeCount,
  completedCount,
  currentFilter,
  onClearCompleted
}) => {
  const itemWord = activeCount === 1 ? "item" : "items";

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={classNames({ selected: currentFilter === ALL_TODOS })}>
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
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default React.memo(TodoFooter);
```
【F:src/features/todos/TodoFooter.tsx】

---

## 9. Styles

You can carry over the existing **`App.css`** and **`index.html`** (with a `<div id="root"></div>`) from your original build; styles and markup unchanged.

---

## 10. Summary of Changes

| Concern                                    | Before                                             | After                                                   |
|--------------------------------------------|----------------------------------------------------|---------------------------------------------------------|
| **React version & entry**                  | `ReactDOM.render(...)`                             | `createRoot` + Suspense + StrictMode                   |
| **Component type**                         | Class components                                   | Functional components + hooks                          |
| **State management**                       | Custom model + localStorage                        | Redux Toolkit slice + `configureStore` + middleware     |
| **Immutability**                           | Manual via utils.extend/map/filter                 | Immer-powered in slice reducers                         |
| **ID generation**                          | Custom UUID utility                                | nanoid                                                  |
| **Local storage**                          | Custom Utils.store                                  | Middleware in store + JSON methods                      |
| **Routing/filtering**                      | Director Router + lifecycle methods                | URL hash + useEffect + Redux `setFilter`                |
| **TypeScript**                             | Loose typing + `any`                               | Strongly typed props, state, actions, store             |
| **Code‑splitting & performance**           | No code‑splitting; manual shouldComponentUpdate     | React.lazy/Suspense; React.memo; useCallback            |
| **Project structure**                      | Flat files                                          | `features/todos/`, `store.ts`, `hooks.ts`               |

All TODOs are gone, dependencies are up‑to‑date, strict TS checking is enabled, and standard naming conventions and error handling (guarding missing root element) are in place.

Please let me know if you need any tweaks or additional features!

### Tokens: {'input_tokens': 3512, 'output_tokens': 8806, 'reasoning_tokens': 4480}
### Execution time: 58.795666217803955
