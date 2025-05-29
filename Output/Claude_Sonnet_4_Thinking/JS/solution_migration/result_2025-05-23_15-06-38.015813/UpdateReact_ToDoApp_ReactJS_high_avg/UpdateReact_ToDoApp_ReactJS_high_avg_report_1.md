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
Alright, this is a comprehensive migration task from React class components to React 18.x with Redux Toolkit, functional components, and TypeScript. Let me break down what needs to be done:

1. Migrate from React class components to functional components with hooks
2. Implement Redux Toolkit for state management instead of the custom model
3. Update TypeScript interfaces and typing
4. Restructure the application
5. Use modern React patterns
6. Update dependencies
7. Performance optimizations
8. Replace utility functions
9. Code quality improvements

Let me start by analyzing the current code structure:

Current files:
- app.tsx - Main TodoApp component (class-based)
- todoItem.tsx - TodoItem component (class-based) 
- utils.ts - Utility functions
- footer.tsx - TodoFooter component (class-based)
- constants.ts - Constants
- todoModel.ts - Data model with custom state management

I need to define TypeScript interfaces first, then create the Redux store, then convert components to functional components.

Let me start:

1. First, I'll create the TypeScript interfaces
2. Create Redux store with RTK
3. Convert components to functional components
4. Create package.json
5. Restructure file organization
6. Implement modern patterns

Let me start with the interfaces and types:

### Answer:
I'll help you migrate this React application to React 18.x with Redux Toolkit and modern patterns. Let me provide a complete restructured solution:

## 1. Package.json Configuration

```json
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "classnames": "^2.3.2",
    "nanoid": "^5.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 2. TypeScript Interfaces and Types

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

export interface RootState {
  todos: TodoState;
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
// src/utils/index.ts
import { nanoid } from 'nanoid';
import { Todo } from '../types';

export const generateId = (): string => nanoid();

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : `${word}s`;
};

export const loadFromStorage = (key: string): Todo[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

export const saveToStorage = (key: string, data: Todo[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
```

## 5. Redux Store Setup

```ts
// src/store/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoState, FilterType } from '../types';
import { generateId, loadFromStorage, saveToStorage } from '../utils';
import { STORAGE_KEY } from '../constants';

const initialState: TodoState = {
  todos: loadFromStorage(STORAGE_KEY),
  filter: 'all',
  editingId: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: generateId(),
        title: action.payload.trim(),
        completed: false,
      };
      state.todos.push(newTodo);
      saveToStorage(STORAGE_KEY, state.todos);
    },
    
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveToStorage(STORAGE_KEY, state.todos);
      }
    },
    
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveToStorage(STORAGE_KEY, state.todos);
    },
    
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveToStorage(STORAGE_KEY, state.todos);
    },
    
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        todo.title = title.trim();
        saveToStorage(STORAGE_KEY, state.todos);
      }
      state.editingId = null;
    },
    
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveToStorage(STORAGE_KEY, state.todos);
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
  destroyTodo,
  saveTodo,
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

## 6. Redux Hooks

```ts
// src/hooks/redux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 7. Selectors

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

export const selectActiveTodoCount = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectCompletedTodoCount = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed).length
);

export const selectHasTodos = createSelector(
  [selectTodos],
  (todos) => todos.length > 0
);

export const selectAllCompleted = createSelector(
  [selectTodos, selectActiveTodoCount],
  (todos, activeCount) => todos.length > 0 && activeCount === 0
);
```

## 8. Components

```tsx
// src/components/TodoItem.tsx
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import classNames from 'classnames';
import { TodoItemProps } from '../types';
import { KEYS } from '../constants';

const TodoItem: React.FC<TodoItemProps> = memo(({
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
    const trimmedText = editText.trim();
    if (trimmedText) {
      onSave(todo.id, trimmedText);
    } else {
      onDestroy(todo.id);
    }
  }, [editText, onSave, onDestroy, todo.id]);

  const handleEdit = useCallback(() => {
    onEdit(todo.id);
    setEditText(todo.title);
  }, [onEdit, todo.id, todo.title]);

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
  }, [onToggle, todo.id]);

  const handleDestroy = useCallback(() => {
    onDestroy(todo.id);
  }, [onDestroy, todo.id]);

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
// src/components/TodoFooter.tsx
import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import { TodoFooterProps, FilterType } from '../types';
import { FILTERS } from '../constants';
import { pluralize } from '../utils';

const TodoFooter: React.FC<TodoFooterProps> = memo(({
  activeCount,
  completedCount,
  currentFilter,
  onClearCompleted,
}) => {
  const activeTodoWord = pluralize(activeCount, 'item');

  const handleClearCompleted = useCallback(() => {
    onClearCompleted();
  }, [onClearCompleted]);

  const renderFilterLink = (filter: FilterType, label: string, href: string) => (
    <li key={filter}>
      <a
        href={href}
        className={classNames({ selected: currentFilter === filter })}
      >
        {label}
      </a>
    </li>
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        {renderFilterLink(FILTERS.ALL, 'All', '#/')}
        {' '}
        {renderFilterLink(FILTERS.ACTIVE, 'Active', '#/active')}
        {' '}
        {renderFilterLink(FILTERS.COMPLETED, 'Completed', '#/completed')}
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
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

```tsx
// src/components/TodoApp.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  addTodo,
  toggleTodo,
  toggleAllTodos,
  destroyTodo,
  saveTodo,
  clearCompleted,
  setFilter,
  setEditingId,
} from '../store/todoSlice';
import {
  selectFilteredTodos,
  selectActiveTodoCount,
  selectCompletedTodoCount,
  selectHasTodos,
  selectAllCompleted,
  selectEditingId,
  selectFilter,
} from '../store/selectors';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { KEYS, FILTERS } from '../constants';

const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const activeCount = useAppSelector(selectActiveTodoCount);
  const completedCount = useAppSelector(selectCompletedTodoCount);
  const hasTodos = useAppSelector(selectHasTodos);
  const allCompleted = useAppSelector(selectAllCompleted);
  const editingId = useAppSelector(selectEditingId);
  const currentFilter = useAppSelector(selectFilter);
  
  const newFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      switch (hash) {
        case '#/active':
          dispatch(setFilter(FILTERS.ACTIVE));
          break;
        case '#/completed':
          dispatch(setFilter(FILTERS.COMPLETED));
          break;
        default:
          dispatch(setFilter(FILTERS.ALL));
          break;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== KEYS.ENTER) {
      return;
    }

    event.preventDefault();
    
    const input = newFieldRef.current;
    if (input) {
      const val = input.value.trim();
      if (val) {
        dispatch(addTodo(val));
        input.value = '';
      }
    }
  }, [dispatch]);

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(event.target.checked));
  }, [dispatch]);

  const handleToggle = useCallback((id: string) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);

  const handleDestroy = useCallback((id: string) => {
    dispatch(destroyTodo(id));
  }, [dispatch]);

  const handleEdit = useCallback((id: string) => {
    dispatch(setEditingId(id));
  }, [dispatch]);

  const handleSave = useCallback((id: string, text: string) => {
    dispatch(saveTodo({ id, title: text }));
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(setEditingId(null));
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const todoItems = filteredTodos.map((todo) => (
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
  ));

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newFieldRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      
      {hasTodos && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={allCompleted}
          />
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      )}
      
      {hasTodos && (
        <TodoFooter
          activeCount={activeCount}
          completedCount={completedCount}
          currentFilter={currentFilter}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export default TodoApp;
```

## 9. Main Application Entry Point

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoApp from './components/TodoApp';

const container = document.querySelector('.todoapp');
if (!container) {
  throw new Error('Could not find root element with class "todoapp"');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <TodoApp />
    </Provider>
  </React.StrictMode>
);
```

## 10. Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

## Key Improvements Made:

1. **React 18.x Migration**: Updated to functional components with hooks, using createRoot API
2. **Redux Toolkit Integration**: Replaced custom state management with RTK
3. **TypeScript Improvements**: Added comprehensive type definitions and interfaces
4. **Performance Optimizations**: Used React.memo, useCallback, and createSelector for memoization
5. **Modern Patterns**: Replaced class components with functional components and hooks
6. **Code Organization**: Split into focused, single-responsibility components
7. **Error Handling**: Added proper error handling for localStorage operations
8. **Modern Dependencies**: Updated to nanoid, Redux Toolkit, and React 18
9. **Immutable Updates**: All state updates are now immutable via RTK
10. **Code Quality**: Removed deprecated patterns, added display names, and consistent naming

The application now follows modern React and Redux patterns while maintaining all original functionality with improved performance and maintainability.

### Tokens: {'input_tokens': 4353, 'output_tokens': 5631}
### Execution time: 62.20904088020325
