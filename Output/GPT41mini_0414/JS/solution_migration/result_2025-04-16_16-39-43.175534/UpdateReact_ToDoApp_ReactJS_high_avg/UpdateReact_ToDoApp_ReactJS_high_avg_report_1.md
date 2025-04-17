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
Below is a comprehensive migration of your React Todo app to React 18.x with Redux Toolkit, functional components, hooks, strict TypeScript typing, modern patterns, and improved architecture. The code is split into feature folders, uses nanoid, and includes performance optimizations.

---

### 1. **package.json**

```json
{
  "name": "react18-redux-todo",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.10.0"
  },
  "devDependencies": {
    "typescript": "^5.0.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

---

### 2. **src/app/store.ts** — Redux store setup with middleware

```ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // localStorage is serializable, but we disable for safety
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 3. **src/features/todos/todosSlice.ts** — Redux Toolkit slice with localStorage persistence

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

interface TodosState {
  todos: Todo[];
  filter: Filter;
  editingId: string | null;
}

const LOCAL_STORAGE_KEY = 'react-todos';

const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Todo[];
    }
  } catch {
    // ignore JSON parse errors
  }
  return [];
};

const saveTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore localStorage errors
  }
};

const initialState: TodosState = {
  todos: loadTodos(),
  filter: 'all',
  editingId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        saveTodos(state.todos);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    destroy(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      saveTodos(state.todos);
    },
    save(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.todos);
      }
      state.editingId = null;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
      saveTodos(state.todos);
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    startEditing(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    cancelEditing(state) {
      state.editingId = null;
    },
  },
});

export const {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
  setFilter,
  startEditing,
  cancelEditing,
} = todosSlice.actions;

export default todosSlice.reducer;
```

---

### 4. **src/features/todos/TodoApp.tsx** — Main app component with hooks and router

```tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  addTodo,
  toggleAll,
  setFilter,
  Filter,
} from './todosSlice';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';

const FILTER_MAP: Record<string, Filter> = {
  '/': ALL_TODOS,
  '/active': ACTIVE_TODOS,
  '/completed': COMPLETED_TODOS,
};

const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);
  const filter = useAppSelector((state) => state.todos.filter);
  const editingId = useAppSelector((state) => state.todos.editingId);
  const newTodoRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Sync filter with URL path
  useEffect(() => {
    const path = location.pathname;
    const newFilter = FILTER_MAP[path] || ALL_TODOS;
    dispatch(setFilter(newFilter));
  }, [location.pathname, dispatch]);

  // Redirect to '/' if unknown path
  useEffect(() => {
    if (!Object.keys(FILTER_MAP).includes(location.pathname)) {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const handleNewTodoKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const val = newTodoRef.current?.value.trim();
      if (val) {
        dispatch(addTodo(val));
        if (newTodoRef.current) newTodoRef.current.value = '';
      }
    },
    [dispatch]
  );

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(toggleAll(e.target.checked));
    },
    [dispatch]
  );

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newTodoRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
          aria-label="New todo"
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={activeTodoCount === 0}
            aria-label="Toggle all todos"
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList
            todos={todos}
            filter={filter}
            editingId={editingId}
          />
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={filter}
        />
      )}
    </div>
  );
};

export default React.memo(TodoApp);
```

---

### 5. **src/features/todos/TodoList.tsx** — List of filtered todos

```tsx
import React, { useMemo } from 'react';
import TodoItem from './TodoItem';
import { Todo, Filter } from './todosSlice';

interface TodoListProps {
  todos: Todo[];
  filter: Filter;
  editingId: string | null;
}

const TodoList: React.FC<TodoListProps> = ({ todos, filter, editingId }) => {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={editingId === todo.id}
        />
      ))}
    </ul>
  );
};

export default React.memo(TodoList);
```

---

### 6. **src/features/todos/TodoItem.tsx** — Single todo item with editing

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../../hooks';
import {
  toggle,
  destroy,
  startEditing,
  save,
  cancelEditing,
  Todo,
} from './todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing }) => {
  const dispatch = useAppDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      setEditText(todo.title);
    }
  }, [editing, todo.title]);

  const handleToggle = useCallback(() => {
    dispatch(toggle(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroy(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    dispatch(startEditing(todo.id));
  }, [dispatch, todo.id]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    const val = editText.trim();
    if (val) {
      dispatch(save({ id: todo.id, title: val }));
    } else {
      dispatch(destroy(todo.id));
    }
  }, [dispatch, editText, todo.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditText(todo.title);
        dispatch(cancelEditing());
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [dispatch, handleSubmit, todo.title]
  );

  const handleBlur = useCallback(() => {
    if (editing) {
      handleSubmit();
    }
  }, [editing, handleSubmit]);

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark todo "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} aria-label={`Delete todo "${todo.title}"`} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Edit todo"
        />
      )}
    </li>
  );
};

export default React.memo(TodoItem);
```

---

### 7. **src/features/todos/TodoFooter.tsx** — Footer with filters and clear completed

```tsx
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../../hooks';
import { setFilter, clearCompleted, Filter } from './todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { pluralize } from '../../utils';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: Filter;
}

const FILTER_TITLES: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, nowShowing }) => {
  const dispatch = useAppDispatch();

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (filter: Filter) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      dispatch(setFilter(filter));
      // Update URL hash for backward compatibility
      const path = filter === ALL_TODOS ? '/' : `/${filter}`;
      window.history.pushState(null, '', path);
    },
    [dispatch]
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {pluralize(count, 'item')} left
      </span>
      <ul className="filters">
        {(Object.keys(FILTER_TITLES) as Filter[]).map((filter) => (
          <li key={filter}>
            <a
              href={filter === ALL_TODOS ? '#/' : `#/${filter}`}
              className={classNames({ selected: nowShowing === filter })}
              onClick={handleFilterChange(filter)}
            >
              {FILTER_TITLES[filter]}
            </a>
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

export default React.memo(TodoFooter);
```

---

### 8. **src/constants.ts**

```ts
export const ALL_TODOS = 'all' as const;
export const ACTIVE_TODOS = 'active' as const;
export const COMPLETED_TODOS = 'completed' as const;

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

---

### 9. **src/utils.ts**

```ts
export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}
```

---

### 10. **src/hooks.ts** — Typed hooks for Redux

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './app/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 11. **src/index.tsx** — React 18 entry point with Redux Provider and React Router

```tsx
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';

const TodoApp = lazy(() => import('./features/todos/TodoApp'));

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <TodoApp />
        </Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

---

### 12. **Project structure**

```
src/
  app/
    store.ts
  features/
    todos/
      todosSlice.ts
      TodoApp.tsx
      TodoList.tsx
      TodoItem.tsx
      TodoFooter.tsx
  hooks.ts
  utils.ts
  constants.ts
  index.tsx
package.json
tsconfig.json
```

---

### Notes on migration:

- **React 18**: Used `createRoot` API.
- **Redux Toolkit**: All state management moved to `todosSlice.ts`.
- **TypeScript**: All components and slices strictly typed.
- **Functional components**: Replaced all class components with hooks.
- **React Router v6**: Used `BrowserRouter` and hooks for routing and filter sync.
- **Performance**: Used `React.memo`, `useCallback`, and `useMemo` to avoid unnecessary renders.
- **Code splitting**: `TodoApp` is lazy loaded.
- **nanoid**: Used for ID generation.
- **localStorage**: Modern try/catch with JSON parse/stringify.
- **Error handling**: Basic try/catch around localStorage.
- **Accessibility**: Added aria-labels for inputs and buttons.
- **No deprecated APIs**: No `findDOMNode`, no string refs.
- **Consistent naming**: camelCase for variables and functions.
- **No TODOs**: Clean, production-ready code.

---

If you want, I can also provide a `tsconfig.json` or CSS files, or help with testing setup. Let me know!

### Tokens: {'input_tokens': 3513, 'output_tokens': 3997, 'reasoning_tokens': 0}
### Execution time: 71.29830622673035
