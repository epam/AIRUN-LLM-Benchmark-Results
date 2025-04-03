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
Below is an example of how you might refactor the original codebase to use modern React (React 18.x), functional components with hooks, Redux Toolkit for state management, nanoid for unique ID generation, and TypeScript throughout. The example shows one possible project layout; feel free to adapt folder structures, filenames, or other details to suit your team’s preferences.

────────────────────────────────────────────────────────────
1. package.json
────────────────────────────────────────────────────────────
{
  "name": "react-todos",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@types/classnames": "^2.3.1",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2"
  },
  "devDependencies": {
    "@types/node": "^18.15.11",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.5",
    "vite": "^4.3.2"
  }
}

────────────────────────────────────────────────────────────
2. vite.config.ts (example configuration for Vite)
────────────────────────────────────────────────────────────
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  }
});

────────────────────────────────────────────────────────────
3. src/types.ts
────────────────────────────────────────────────────────────
/**
 * Define shared TypeScript types and interfaces here.
 */

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

────────────────────────────────────────────────────────────
4. src/constants.ts
────────────────────────────────────────────────────────────
/**
 * Application constants.
 */
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

────────────────────────────────────────────────────────────
5. src/redux/todoSlice.ts
────────────────────────────────────────────────────────────
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Todo, TodoState, FilterType } from '../types';

// Load from localStorage initially (modern approach)
function loadTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem('react-todos');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const initialState: TodoState = {
  todos: loadTodosFromStorage(),
  filter: 'all',
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const title = action.payload.trim();
      if (title) {
        state.todos.push({
          id: nanoid(),
          title,
          completed: false,
        });
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      const checked = action.payload;
      state.todos.forEach((todo) => {
        todo.completed = checked;
      });
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const id = action.payload;
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    saveTodo(state, action: PayloadAction<{ id: string; text: string }>) {
      const { id, text } = action.payload;
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.title = text;
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleAll,
  toggleTodo,
  destroyTodo,
  saveTodo,
  clearCompleted,
  setFilter,
} = todoSlice.actions;

export default todoSlice.reducer;

────────────────────────────────────────────────────────────
6. src/redux/store.ts
────────────────────────────────────────────────────────────
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

// Persist todos to localStorage on any state change
store.subscribe(() => {
  const state = store.getState().todo;
  localStorage.setItem('react-todos', JSON.stringify(state.todos));
});

// Infer types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

────────────────────────────────────────────────────────────
7. src/redux/hooks.ts (custom typed hooks for Redux)
────────────────────────────────────────────────────────────
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

────────────────────────────────────────────────────────────
8. src/components/App.tsx
────────────────────────────────────────────────────────────
import React, { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  addTodo,
  toggleAll,
  clearCompleted,
  setFilter,
} from '../redux/todoSlice';
import { ENTER_KEY } from '../constants';
import { FilterType } from '../types';
import TodoList from './TodoList';
import Footer from './Footer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, filter } = useAppSelector((state) => state.todo);

  // Derive counts
  const activeTodoCount = todos.reduce(
    (count, todo) => (todo.completed ? count : count + 1),
    0
  );
  const completedCount = todos.length - activeTodoCount;

  /**
   * Listen for hash changes to update filter.
   * This replaces the old `Router` usage with a minimal approach.
   */
  useEffect(() => {
    function handleHashChange() {
      let newFilter: FilterType = 'all';
      switch (window.location.hash) {
        case '#/active':
          newFilter = 'active';
          break;
        case '#/completed':
          newFilter = 'completed';
          break;
        default:
          newFilter = 'all';
      }
      dispatch(setFilter(newFilter));
    }
    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  /**
   * Handle new todo creation using the "Enter" key.
   */
  const handleNewTodoKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode !== ENTER_KEY) return;
      e.preventDefault();

      const input = e.currentTarget;
      const val = input.value.trim();
      if (val) {
        dispatch(addTodo(val));
        input.value = '';
      }
    },
    [dispatch]
  );

  /**
   * Toggle all items completed or not completed.
   */
  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(toggleAll(e.target.checked));
    },
    [dispatch]
  );

  /**
   * Clear all completed todos.
   */
  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const isAllChecked = activeTodoCount === 0 && todos.length > 0;

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>

      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={isAllChecked}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>

          <TodoList />
        </section>
      )}

      {(activeTodoCount > 0 || completedCount > 0) && (
        <Footer
          activeTodoCount={activeTodoCount}
          completedCount={completedCount}
          filter={filter}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export default App;

────────────────────────────────────────────────────────────
9. src/components/TodoList.tsx
────────────────────────────────────────────────────────────
import React, { useMemo } from 'react';
import { useAppSelector } from '../redux/hooks';
import TodoItem from './TodoItem';
import { FilterType } from '../types';

const TodoList: React.FC = () => {
  const { todos, filter } = useAppSelector((state) => state.todo);

  // Filter todos based on the active filter
  const visibleTodos = useMemo(() => {
    switch (filter as FilterType) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <ul className="todo-list">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default React.memo(TodoList);

────────────────────────────────────────────────────────────
10. src/components/TodoItem.tsx
────────────────────────────────────────────────────────────
import React, { useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../redux/hooks';
import { toggleTodo, destroyTodo, saveTodo } from '../redux/todoSlice';
import { Todo } from '../types';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  // Whenever we transition to editing=true, focus the input
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText]);

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroyTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    setEditing(true);
    setEditText(todo.title);
  }, [todo.title]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditText(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === ESCAPE_KEY) {
        setEditing(false);
        setEditText(todo.title);
      } else if (e.keyCode === ENTER_KEY) {
        handleSubmit();
      }
    },
    [todo.title]
  );

  const handleSubmit = useCallback(() => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, text: val }));
      setEditText(val);
    } else {
      dispatch(destroyTodo(todo.id));
    }
    setEditing(false);
  }, [dispatch, todo.id, editText]);

  const liClass = classNames({
    completed: todo.completed,
    editing: editing,
  });

  return (
    <li className={liClass}>
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
      {editing && (
        <input
          ref={inputRef}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default React.memo(TodoItem);

────────────────────────────────────────────────────────────
11. src/components/Footer.tsx
────────────────────────────────────────────────────────────
import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { setFilter } from '../redux/todoSlice';

/**
 * Footer component to display remaining items, filtering UI, and
 * a button to clear completed items.
 */
interface FooterProps {
  activeTodoCount: number;
  completedCount: number;
  filter: FilterType;
  onClearCompleted: () => void;
}

const Footer: React.FC<FooterProps> = ({
  activeTodoCount,
  completedCount,
  filter,
  onClearCompleted,
}) => {
  const dispatch = useAppDispatch();
  const itemWord = activeTodoCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === 'all' })}
            onClick={() => dispatch(setFilter('all'))}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === 'active' })}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === 'completed' })}
            onClick={() => dispatch(setFilter('completed'))}
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

export default React.memo(Footer);

────────────────────────────────────────────────────────────
12. src/main.tsx (Entry Point)
────────────────────────────────────────────────────────────
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './components/App';
import './styles.css'; // Import your CSS here

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

────────────────────────────────────────────────────────────
13. Project Structure (example)
────────────────────────────────────────────────────────────
.
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src
│   ├── main.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── redux
│   │   ├── store.ts
│   │   ├── todoSlice.ts
│   │   └── hooks.ts
│   ├── components
│   │   ├── App.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   └── Footer.tsx
│   └── styles.css
└── ...

────────────────────────────────────────────────────────────
NOTES
────────────────────────────────────────────────────────────
1. We replaced the old class components and lifecycle methods with functional components and hooks (useEffect, useState, useCallback, useMemo).

2. State management is handled via Redux Toolkit (todoSlice). We replaced direct mutations with immutable state updates, but Redux Toolkit’s “Immer” library under the hood allows us to write in a “mutable” style that is actually converted to immutable operations.

3. Instead of a custom UUID in Utils, we now use nanoid for generating unique IDs.

4. The old “router” usage is replaced with a minimal useEffect that listens for “hashchange” events and dispatches filter changes. You could also integrate React Router if desired.

5. We use consistent naming, typed props’ interfaces, and an explicit typed store and dispatch. There are no leftover TODO comments in this code.

6. For performance: 
   • We use React.memo around presentational components like TodoList and TodoItem.  
   • useCallback/useMemo help manage stable references.  
   • This reduces unnecessary re-renders where possible.

7. If your application grows, you can split large components further or leverage React.lazy and Suspense for code splitting routes or large chunks.

8. Where needed, improve error handling with try/catch (e.g., in localStorage reading or Redux side effects).  

This completes a general demonstration of how one might modernize and restructure the original application following React 18 best practices, Redux Toolkit state management, TypeScript strictness, and improved code organization. Modify details (folder structure, naming conventions, etc.) as your project requires.

### Tokens: {'input_tokens': 3512, 'output_tokens': 5744, 'reasoning_tokens': 1792}
### Execution time: 82.80234789848328
