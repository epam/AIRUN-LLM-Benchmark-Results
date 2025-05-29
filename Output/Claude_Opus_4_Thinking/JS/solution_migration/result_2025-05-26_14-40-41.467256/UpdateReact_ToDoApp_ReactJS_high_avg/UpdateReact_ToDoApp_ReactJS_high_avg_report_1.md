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
Looking at this code, I can see it's a classic TodoMVC application written in older React with TypeScript. I need to:

1. Migrate from React 16/17 patterns to React 18.x
2. Replace class components with functional components and hooks
3. Implement Redux Toolkit for state management
4. Update TypeScript typings
5. Restructure the application architecture
6. Use modern dependencies

Let me analyze the existing code:
- `app.tsx` - Main app component with routing and state management
- `todoItem.tsx` - Individual todo item component
- `footer.tsx` - Footer component with filters
- `todoModel.ts` - Data model with localStorage persistence
- `utils.ts` - Utility functions
- `constants.ts` - Constants

Key changes needed:
1. Replace `ReactDOM.render` with `ReactDOM.createRoot` (React 18)
2. Replace class components with functional components
3. Replace custom router with React Router
4. Replace custom state management with Redux Toolkit
5. Replace string refs with useRef
6. Replace ReactDOM.findDOMNode with refs
7. Use modern TypeScript patterns

Let me start implementing the migration:

### Answer:
I'll help you migrate this TodoMVC application to React 18.x with Redux Toolkit and modern patterns. Let me break this down into the required files:

## 1. Package.json

```json
{
  "name": "todomvc-react-redux",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@types/react-redux": "^7.1.31",
    "@types/react-router-dom": "^5.3.3",
    "classnames": "^2.3.2",
    "nanoid": "^5.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.20.1",
    "typescript": "^5.3.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "react-scripts": "5.0.1"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

## 2. Types (types/index.ts)

```typescript
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export interface TodosState {
  todos: ITodo[];
  filter: FilterType;
  editingId: string | null;
}

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

## 3. Redux Store Configuration (store/index.ts)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 4. Redux Slice (store/todosSlice.ts)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo, TodosState, FilterType } from '../types';

const STORAGE_KEY = 'react-todos';

const loadTodos = (): ITodo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: ITodo[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};

const initialState: TodosState = {
  todos: loadTodos(),
  filter: FilterType.ALL,
  editingId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const todo: ITodo = {
        id: nanoid(),
        title: action.payload.trim(),
        completed: false,
      };
      state.todos.push(todo);
      saveTodos(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        saveTodos(state.todos);
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(state.todos);
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
  toggleAll,
  deleteTodo,
  updateTodo,
  clearCompleted,
  setFilter,
  setEditingId,
} = todosSlice.actions;

export default todosSlice.reducer;
```

## 5. Redux Hooks (hooks/redux.ts)

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 6. Main App Component (components/App.tsx)

```tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './TodoList';
import { FilterType } from '../types';

const App: React.FC = () => {
  return (
    <div className="todoapp">
      <Routes>
        <Route path="/" element={<TodoList filter={FilterType.ALL} />} />
        <Route path="/active" element={<TodoList filter={FilterType.ACTIVE} />} />
        <Route path="/completed" element={<TodoList filter={FilterType.COMPLETED} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
```

## 7. TodoList Component (components/TodoList.tsx)

```tsx
import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilter } from '../store/todosSlice';
import { FilterType } from '../types';
import Header from './Header';
import MainSection from './MainSection';
import Footer from './Footer';

interface TodoListProps {
  filter: FilterType;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector(state => state.todos);

  useEffect(() => {
    dispatch(setFilter(filter));
  }, [dispatch, filter]);

  const { activeTodoCount, completedCount } = useMemo(() => {
    return todos.reduce(
      (acc, todo) => ({
        activeTodoCount: todo.completed ? acc.activeTodoCount : acc.activeTodoCount + 1,
        completedCount: todo.completed ? acc.completedCount + 1 : acc.completedCount,
      }),
      { activeTodoCount: 0, completedCount: 0 }
    );
  }, [todos]);

  return (
    <>
      <Header />
      {todos.length > 0 && <MainSection />}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <Footer
          activeTodoCount={activeTodoCount}
          completedCount={completedCount}
        />
      )}
    </>
  );
};

export default TodoList;
```

## 8. Header Component (components/Header.tsx)

```tsx
import React, { useState, useCallback, KeyboardEvent } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addTodo } from '../store/todosSlice';
import { ENTER_KEY } from '../types';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleNewTodoKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== ENTER_KEY) {
        return;
      }

      event.preventDefault();
      const trimmedText = newTodo.trim();

      if (trimmedText) {
        dispatch(addTodo(trimmedText));
        setNewTodo('');
      }
    },
    [dispatch, newTodo]
  );

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={handleNewTodoKeyDown}
        autoFocus
      />
    </header>
  );
};

export default Header;
```

## 9. MainSection Component (components/MainSection.tsx)

```tsx
import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleAll } from '../store/todosSlice';
import { FilterType } from '../types';
import TodoItem from './TodoItem';

const MainSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, filter } = useAppSelector(state => state.todos);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos]
  );

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(toggleAll(e.target.checked));
    },
    [dispatch]
  );

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={completedCount === todos.length && todos.length > 0}
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

export default MainSection;
```

## 10. TodoItem Component (components/TodoItem.tsx)

```tsx
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTodo, deleteTodo, updateTodo, setEditingId } from '../store/todosSlice';
import { ITodo, ENTER_KEY, ESCAPE_KEY } from '../types';

interface TodoItemProps {
  todo: ITodo;
}

const TodoItem: React.FC<TodoItemProps> = memo(({ todo }) => {
  const dispatch = useAppDispatch();
  const editingId = useAppSelector(state => state.todos.editingId);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const isEditing = editingId === todo.id;

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(deleteTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    dispatch(setEditingId(todo.id));
    setEditText(todo.title);
  }, [dispatch, todo.id, todo.title]);

  const handleSubmit = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(updateTodo({ id: todo.id, title: trimmedText }));
      dispatch(setEditingId(null));
    } else {
      handleDestroy();
    }
  }, [dispatch, todo.id, editText, handleDestroy]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        setEditText(todo.title);
        dispatch(setEditingId(null));
      } else if (event.keyCode === ENTER_KEY) {
        handleSubmit();
      }
    },
    [dispatch, todo.title, handleSubmit]
  );

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
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;
```

## 11. Footer Component (components/Footer.tsx)

```tsx
import React, { useCallback, memo } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearCompleted } from '../store/todosSlice';
import { FilterType } from '../types';
import { pluralize } from '../utils';

interface FooterProps {
  activeTodoCount: number;
  completedCount: number;
}

const Footer: React.FC<FooterProps> = memo(({ activeTodoCount, completedCount }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.todos.filter);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const activeTodoWord = pluralize(activeTodoCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={classNames({ selected: filter === FilterType.ALL })}
          >
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={classNames({ selected: filter === FilterType.ACTIVE })}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={classNames({ selected: filter === FilterType.COMPLETED })}
          >
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
```

## 12. Utilities (utils/index.ts)

```typescript
export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : `${word}s`;
};
```

## 13. Entry Point (index.tsx)

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './components/App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

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
```

## 14. HTML Template (public/index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TodoMVC</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
```

## Key Migration Changes:

1. **React 18 Features**:
   - Used `createRoot` API
   - Implemented React.StrictMode
   - Used automatic batching

2. **Redux Toolkit**:
   - Replaced custom state management with Redux Toolkit
   - Used `createSlice` for reducers
   - Implemented proper TypeScript typing for Redux

3. **Modern React Patterns**:
   - Converted all class components to functional components
   - Used hooks (useState, useEffect, useCallback, useMemo, useRef)
   - Implemented React.memo for performance optimization

4. **TypeScript Improvements**:
   - Proper type definitions for all components
   - Type-safe Redux hooks
   - Strict type checking throughout

5. **Modern Dependencies**:
   - Replaced custom UUID with nanoid
   - Used React Router v6 for routing
   - Proper localStorage error handling

6. **Performance Optimizations**:
   - Memoized expensive computations
   - Used useCallback to prevent unnecessary re-renders
   - Implemented proper component memoization

7. **Code Organization**:
   - Organized by feature (components, store, hooks, types, utils)
   - Separated concerns properly
   - Cleaner, more maintainable structure

The application now follows modern React 18 best practices with Redux Toolkit for state management, proper TypeScript typing, and optimized performance.

### Tokens: {'input_tokens': 4353, 'output_tokens': 5336}
### Execution time: 53.656874895095825
