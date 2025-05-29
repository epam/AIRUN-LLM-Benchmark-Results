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
I'll migrate your React application to React 18.x with Redux Toolkit, modern TypeScript, and functional components. Let me break this down into organized files:

## 1. Package Configuration

```json
// package.json
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.25",
    "@types/react-dom": "^18.2.11",
    "classnames": "^2.3.2",
    "nanoid": "^5.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.16.0",
    "typescript": "^5.2.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
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

## 2. TypeScript Interfaces

```ts
// src/types/index.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  editingId: string | null;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface RootState {
  todos: TodoState;
}

export interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}

export interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  currentFilter: FilterType;
  onClearCompleted: () => void;
}

export interface TodoHeaderProps {
  onAddTodo: (title: string) => void;
}

export interface TodoMainProps {
  todos: Todo[];
  allCompleted: boolean;
  onToggleAll: () => void;
}
```

## 3. Constants

```ts
// src/constants/index.ts
export const FILTERS = {
  ALL: 'all' as const,
  ACTIVE: 'active' as const,
  COMPLETED: 'completed' as const,
} as const;

export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
} as const;

export const STORAGE_KEY = 'react-todos';
```

## 4. Utilities

```ts
// src/utils/storage.ts
export const storage = {
  get: <T>(key: string): T[] => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
};

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : `${word}s`;
};
```

## 5. Redux Store Setup

```ts
// src/store/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodoState, FilterType } from '../types';
import { storage } from '../utils/storage';
import { STORAGE_KEY, FILTERS } from '../constants';

const initialState: TodoState = {
  todos: storage.get<Todo>(STORAGE_KEY),
  filter: FILTERS.ALL,
  editingId: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload.trim(),
        completed: false,
      };
      state.todos.push(newTodo);
      storage.set(STORAGE_KEY, state.todos);
    },

    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        storage.set(STORAGE_KEY, state.todos);
      }
    },

    toggleAllTodos: (state) => {
      const allCompleted = state.todos.every(todo => todo.completed);
      state.todos.forEach(todo => {
        todo.completed = !allCompleted;
      });
      storage.set(STORAGE_KEY, state.todos);
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      storage.set(STORAGE_KEY, state.todos);
    },

    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        storage.set(STORAGE_KEY, state.todos);
      }
    },

    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      storage.set(STORAGE_KEY, state.todos);
    },

    setFilter: (state, action: PayloadAction<FilterType>) => {
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
  toggleAllTodos,
  deleteTodo,
  updateTodo,
  clearCompleted,
  setFilter,
  setEditingId,
} = todoSlice.actions;

export default todoSlice.reducer;
```

```ts
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/hooks/redux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 6. Selectors

```ts
// src/store/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { FILTERS } from '../constants';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.filter;
export const selectEditingId = (state: RootState) => state.todos.editingId;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTERS.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    const allCompleted = todos.length > 0 && activeCount === 0;
    
    return {
      activeCount,
      completedCount,
      allCompleted,
      totalCount: todos.length,
    };
  }
);
```

## 7. Components

```tsx
// src/components/TodoHeader.tsx
import React, { useState, useCallback } from 'react';
import { TodoHeaderProps } from '../types';
import { KEYS } from '../constants';

const TodoHeader: React.FC<TodoHeaderProps> = React.memo(({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== KEYS.ENTER) {
      return;
    }

    event.preventDefault();
    const value = inputValue.trim();
    
    if (value) {
      onAddTodo(value);
      setInputValue('');
    }
  }, [inputValue, onAddTodo]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
});

TodoHeader.displayName = 'TodoHeader';

export default TodoHeader;
```

```tsx
// src/components/TodoItem.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { TodoItemProps } from '../types';
import { KEYS } from '../constants';

const TodoItem: React.FC<TodoItemProps> = React.memo(({
  todo,
  isEditing,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      const input = editFieldRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  const handleSubmit = useCallback(() => {
    const value = editText.trim();
    if (value) {
      onSave(todo.id, value);
    } else {
      onDestroy(todo.id);
    }
  }, [editText, todo.id, onSave, onDestroy]);

  const handleEdit = useCallback(() => {
    onEdit(todo.id);
    setEditText(todo.title);
  }, [todo.id, todo.title, onEdit]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === KEYS.ESCAPE) {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === KEYS.ENTER) {
      handleSubmit();
    }
  }, [todo.title, onCancel, handleSubmit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDestroy = useCallback(() => {
    onDestroy(todo.id);
  }, [todo.id, onDestroy]);

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: isEditing,
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={handleDestroy} />
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

TodoItem.displayName = 'TodoItem';

export default TodoItem;
```

```tsx
// src/components/TodoMain.tsx
import React, { useCallback } from 'react';
import { TodoMainProps } from '../types';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectFilteredTodos, selectEditingId } from '../store/selectors';
import { toggleTodo, deleteTodo, updateTodo, setEditingId } from '../store/todoSlice';
import TodoItem from './TodoItem';

const TodoMain: React.FC<TodoMainProps> = React.memo(({ todos, allCompleted, onToggleAll }) => {
  const dispatch = useAppDispatch();
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const editingId = useAppSelector(selectEditingId);

  const handleToggle = useCallback((id: string) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);

  const handleDestroy = useCallback((id: string) => {
    dispatch(deleteTodo(id));
  }, [dispatch]);

  const handleEdit = useCallback((id: string) => {
    dispatch(setEditingId(id));
  }, [dispatch]);

  const handleSave = useCallback((id: string, text: string) => {
    dispatch(updateTodo({ id, title: text }));
    dispatch(setEditingId(null));
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(setEditingId(null));
  }, [dispatch]);

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={onToggleAll}
        checked={allCompleted}
      />
      <label htmlFor="toggle-all">
        Mark all as complete
      </label>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onToggle={handleToggle}
            onDestroy={handleDestroy}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
      </ul>
    </section>
  );
});

TodoMain.displayName = 'TodoMain';

export default TodoMain;
```

```tsx
// src/components/TodoFooter.tsx
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import { TodoFooterProps, FilterType } from '../types';
import { FILTERS } from '../constants';
import { pluralize } from '../utils/storage';

const TodoFooter: React.FC<TodoFooterProps> = React.memo(({
  activeCount,
  completedCount,
  currentFilter,
  onClearCompleted,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterClick = useCallback((filter: FilterType) => {
    const path = filter === FILTERS.ALL ? '/' : `/${filter}`;
    navigate(path);
  }, [navigate]);

  const activeTodoWord = pluralize(activeCount, 'item');

  if (activeCount === 0 && completedCount === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <button
            type="button"
            className={classNames({ selected: currentFilter === FILTERS.ALL })}
            onClick={() => handleFilterClick(FILTERS.ALL)}
          >
            All
          </button>
        </li>
        {' '}
        <li>
          <button
            type="button"
            className={classNames({ selected: currentFilter === FILTERS.ACTIVE })}
            onClick={() => handleFilterClick(FILTERS.ACTIVE)}
          >
            Active
          </button>
        </li>
        {' '}
        <li>
          <button
            type="button"
            className={classNames({ selected: currentFilter === FILTERS.COMPLETED })}
            onClick={() => handleFilterClick(FILTERS.COMPLETED)}
          >
            Completed
          </button>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});

TodoFooter.displayName = 'TodoFooter';

export default TodoFooter;
```

## 8. Main App Component

```tsx
// src/components/TodoApp.tsx
import React, { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  selectTodos,
  selectFilter,
  selectTodoStats,
} from '../store/selectors';
import {
  addTodo,
  toggleAllTodos,
  clearCompleted,
  setFilter,
} from '../store/todoSlice';
import { FilterType } from '../types';
import { FILTERS } from '../constants';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const todos = useAppSelector(selectTodos);
  const currentFilter = useAppSelector(selectFilter);
  const { activeCount, completedCount, allCompleted } = useAppSelector(selectTodoStats);

  // Handle route changes
  useEffect(() => {
    const path = location.pathname;
    let filter: FilterType = FILTERS.ALL;
    
    if (path === '/active') {
      filter = FILTERS.ACTIVE;
    } else if (path === '/completed') {
      filter = FILTERS.COMPLETED;
    }
    
    dispatch(setFilter(filter));
  }, [location.pathname, dispatch]);

  const handleAddTodo = useCallback((title: string) => {
    dispatch(addTodo(title));
  }, [dispatch]);

  const handleToggleAll = useCallback(() => {
    dispatch(toggleAllTodos());
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  return (
    <div>
      <TodoHeader onAddTodo={handleAddTodo} />
      <TodoMain
        todos={todos}
        allCompleted={allCompleted}
        onToggleAll={handleToggleAll}
      />
      <TodoFooter
        activeCount={activeCount}
        completedCount={completedCount}
        currentFilter={currentFilter}
        onClearCompleted={handleClearCompleted}
      />
    </div>
  );
};

export default TodoApp;
```

## 9. App Entry Point

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="todoapp">
          <Routes>
            <Route path="/" element={<TodoApp />} />
            <Route path="/active" element={<TodoApp />} />
            <Route path="/completed" element={<TodoApp />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
```

```tsx
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Key Improvements Made:

1. **React 18 Migration**: Updated to use `createRoot` and modern React patterns
2. **Redux Toolkit**: Implemented proper state management with createSlice and immutable updates
3. **TypeScript**: Added comprehensive type definitions and strict typing
4. **Functional Components**: Converted all class components to functional components with hooks
5. **Performance Optimization**: Used React.memo, useCallback, and proper memoization
6. **Modern Routing**: Replaced custom router with React Router v6
7. **Code Organization**: Split into focused, reusable components
8. **Error Handling**: Added proper error handling for localStorage operations
9. **Modern Dependencies**: Used nanoid for ID generation and updated all dependencies
10. **Clean Architecture**: Implemented proper separation of concerns with selectors, hooks, and utilities

The application now follows modern React 18 best practices with proper TypeScript support, Redux Toolkit for state management, and optimized performance patterns.

### Tokens: {'input_tokens': 4324, 'output_tokens': 5856}
### Execution time: 55.603665828704834
