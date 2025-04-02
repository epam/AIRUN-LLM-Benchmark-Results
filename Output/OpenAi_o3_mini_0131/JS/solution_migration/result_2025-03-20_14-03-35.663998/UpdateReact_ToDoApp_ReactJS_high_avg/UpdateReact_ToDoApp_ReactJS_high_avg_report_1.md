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
Below is one example of how you might refactor the legacy single‐file “TodoMVC” app into a modern React 18 application that uses functional components, React hooks, Redux Toolkit for state management, TypeScript with strict types, and improved file/feature organization. (Note that you may choose to split files or directories differently based on your project’s conventions.) 

In this example the following changes have been made:

• All React imports and usage are updated for React 18 (using createRoot, effects, hooks, etc.)  
• All class components are converted into functional components (using useState, useEffect, useCallback, and React.memo)  
• The legacy “model” and direct state mutations are replaced with a Redux Toolkit “slice” (todosSlice.ts) that defines action creators and reducers with immutable updates  
• TypeScript interfaces are declared for todos, app state, component props, and the Redux store  
• File structure is reorganized into separate folders (e.g. the “todos” feature and reusable components)  
• Utility functions now use a small “store” helper and nanoid (from Redux Toolkit) is used in place of the old custom UUID  
• A Redux Provider wraps the application entry point, and the Redux store is configured with proper middleware  
• Performance optimizations are implemented (React.memo on components, useCallback for event handlers)  

Below is a suggested final file structure and complete code samples for each file:

─────────────────────────────  
1. package.json  
─────────────────────────────

{
  "name": "redux-todo-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.0",
    "classnames": "^2.3.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}

─────────────────────────────  
2. src/store.ts  
─────────────────────────────

import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer
  }
});

// Export RootState and AppDispatch for use in our hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

─────────────────────────────  
3. src/features/todos/todosSlice.ts  
─────────────────────────────

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type VisibilityFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  nowShowing: VisibilityFilter;
  editing: string | null;
}

// Retrieve any persisted todos from localStorage
const persistedTodos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');

const initialState: TodosState = {
  todos: persistedTodos,
  nowShowing: 'all',
  editing: null
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroy(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    save(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
      state.editing = null;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    setEditing(state, action: PayloadAction<string | null>) {
      state.editing = action.payload;
    },
    setNowShowing(state, action: PayloadAction<VisibilityFilter>) {
      state.nowShowing = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
  setEditing,
  setNowShowing
} = todosSlice.actions;
export default todosSlice.reducer;

─────────────────────────────  
4. src/utils.ts  
─────────────────────────────

// A simple utility to pluralize words based on a count
export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const localStore = {
  get: <T>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

─────────────────────────────  
5. src/components/TodoApp.tsx  
─────────────────────────────

import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { RootState, AppDispatch } from '../store';
import {
  addTodo,
  toggleAll,
  setNowShowing,
  VisibilityFilter
} from '../features/todos/todosSlice';

const TodoApp: React.FC = () => {
  const { todos, nowShowing, editing } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();
  const [newTodo, setNewTodo] = useState('');

  // Simulate a router by reacting to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let filter: VisibilityFilter = 'all';
      if (hash.includes('active')) {
        filter = 'active';
      } else if (hash.includes('completed')) {
        filter = 'completed';
      }
      dispatch(setNowShowing(filter));
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initialize filter on first load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  const handleNewTodoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  }, []);

  const handleNewTodoKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const trimmed = newTodo.trim();
        if (trimmed) {
          dispatch(addTodo(trimmed));
          setNewTodo('');
        }
        e.preventDefault();
      }
    },
    [newTodo, dispatch]
  );

  const handleToggleAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  }, [dispatch]);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  let filteredTodos = todos;
  if (nowShowing === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (nowShowing === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

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
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} editing={editing === todo.id} />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter count={activeTodoCount} completedCount={completedCount} nowShowing={nowShowing} />
      )}
    </div>
  );
};

export default memo(TodoApp);

─────────────────────────────  
6. src/components/TodoItem.tsx  
─────────────────────────────

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  memo
} from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import {
  toggle,
  destroy,
  save,
  setEditing
} from '../features/todos/todosSlice';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  // Focus and set the selection range when entering editing mode
  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  const handleToggle = useCallback(() => {
    dispatch(toggle(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroy(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    dispatch(setEditing(todo.id));
    setEditText(todo.title);
  }, [dispatch, todo.id, todo.title]);

  const handleSubmit = useCallback(() => {
    const trimmed = editText.trim();
    if (trimmed) {
      dispatch(save({ id: todo.id, title: trimmed }));
    } else {
      dispatch(destroy(todo.id));
    }
  }, [dispatch, editText, todo.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditText(todo.title);
        dispatch(setEditing(null));
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [dispatch, handleSubmit, todo.title]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <li className={classNames({ completed: todo.completed, editing: editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default memo(TodoItem);

─────────────────────────────  
7. src/components/TodoFooter.tsx  
─────────────────────────────

import React, { useCallback, memo } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { clearCompleted, setNowShowing } from '../features/todos/todosSlice';
import { pluralize } from '../utils';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: 'all' | 'active' | 'completed';
}

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, nowShowing }) => {
  const dispatch = useDispatch();

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  // The click handler will update the URL hash, which in turn updates the filter via the TodoApp useEffect
  const handleFilterChange = (filter: 'all' | 'active' | 'completed') => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = filter === 'all' ? '/' : `/${filter}`;
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {pluralize(count, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === 'all' })}
            onClick={handleFilterChange('all')}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === 'active' })}
            onClick={handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === 'completed' })}
            onClick={handleFilterChange('completed')}
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
};

export default memo(TodoFooter);

─────────────────────────────  
8. src/index.tsx (Application Entry Point)  
─────────────────────────────

import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18 root API
import { Provider } from 'react-redux';
import store from './store';
import TodoApp from './components/TodoApp';

// Persist the todos slice to localStorage on every store change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('todos', JSON.stringify(state.todos.todos));
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>
);

─────────────────────────────  
Notes on This Refactoring  
─────────────────────────────

1. React 18 Syntax & Features  
   • We use createRoot (from react-dom/client) to render the application.  
   • All class components have been replaced with functional components using hooks.  
   • Event handlers are wrapped in useCallback to avoid unnecessary re-renders.  
   • React.memo is used on components that do not need to re-render on every update.

2. Redux Toolkit Integration  
   • The todosSlice in combination with configureStore replaces the old TodoModel.  
   • The slice uses “prepare” callbacks and immutable updates behind the scenes.  
   • We dispatch actions from our components via useDispatch and useSelector for state.

3. TypeScript Improvements  
   • Interfaces (Todo, TodosState, component props) are declared and used consistently.  
   • The Redux store types (RootState and AppDispatch) are exported from store.ts.

4. Architectural Restructuring  
   • Files are split by functionality (features/todos, components, utils).  
   • Component composition is clear and small components handle focused logic.

5. Modern Patterns & Performance  
   • React.lazy code splitting could be added for larger apps; here the app is small.  
   • Event handling uses proper types and useCallback for performance.

6. Dependency and Configuration Updates  
   • package.json now includes all required dependencies.  
   • The Redux Provider wraps the app at the root level.
   • A store.subscribe() hook persists the todos to localStorage whenever the state changes.

With these changes, you have a modern, type-safe, and scalable Todo application built with React 18 and Redux Toolkit, ready for further extension and production use.

### Tokens: {'input_tokens': 3512, 'output_tokens': 7727, 'reasoning_tokens': 3968}
### Execution time: 68.44279479980469
