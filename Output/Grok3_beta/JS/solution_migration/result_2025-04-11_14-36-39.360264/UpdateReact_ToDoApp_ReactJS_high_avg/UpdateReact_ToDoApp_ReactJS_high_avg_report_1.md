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
I'll migrate the provided React application to React 18.x with Redux Toolkit, modern patterns, and proper TypeScript typing. I'll restructure the codebase into a feature-based architecture and implement all the requested improvements.

Let's create a modern version of this Todo application. I'll organize the code into a clear folder structure and provide all necessary files.

### Project Structure
```
src/
├── features/
│   └── todos/
│       ├── components/
│       │   ├── TodoApp.tsx
│       │   ├── TodoList.tsx
│       │   ├── TodoItem.tsx
│       │   ├── TodoFooter.tsx
│       │   └── TodoInput.tsx
│       ├── store/
│       │   ├── todosSlice.ts
│       │   └── types.ts
│       └── index.ts
├── app/
│   ├── store.ts
│   └── App.tsx
├── utils/
│   └── localStorage.ts
├── index.tsx
└── package.json
```

### 1. Main Entry Point (index.tsx)
```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 2. App Component (app/App.tsx)
```tsx
// src/app/App.tsx
import React from 'react';
import { TodoApp } from '../features/todos/components/TodoApp';

const App: React.FC = () => {
  return (
    <div className="todoapp">
      <TodoApp />
    </div>
  );
};

export default App;
```

### 3. Redux Store Configuration (app/store.ts)
```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/store/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4. Types Definition (features/todos/store/types.ts)
```ts
// src/features/todos/store/types.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
  editing: boolean;
}

export interface TodoFooterProps {
  count: number;
  completedCount: number;
  filter: string;
  onClearCompleted: () => void;
}
```

### 5. Redux Slice (features/todos/store/todosSlice.ts)
```ts
// src/features/todos/store/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { TodosState, Todo } from './types';
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';

const initialState: TodosState = {
  todos: loadFromLocalStorage('react-todos') || [],
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
      saveToLocalStorage('react-todos', state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage('react-todos', state.todos);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveToLocalStorage('react-todos', state.todos);
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveToLocalStorage('react-todos', state.todos);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
        saveToLocalStorage('react-todos', state.todos);
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveToLocalStorage('react-todos', state.todos);
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  toggleAll, 
  destroyTodo, 
  saveTodo, 
  clearCompleted,
  setFilter
} = todosSlice.actions;
export default todosSlice.reducer;
```

### 6. Local Storage Utility (utils/localStorage.ts)
```ts
// src/utils/localStorage.ts
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error(`Error loading from localStorage for key ${key}:`, error);
    return null;
  }
};

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};
```

### 7. TodoApp Component (features/todos/components/TodoApp.tsx)
```tsx
// src/features/todos/components/TodoApp.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { setFilter } from '../store/todosSlice';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2) || 'all';
      dispatch(setFilter(hash as 'all' | 'active' | 'completed'));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial call to set filter based on current hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      {todos.length > 0 && <TodoList todos={todos} filter={filter} />}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          filter={filter}
        />
      )}
    </div>
  );
};
```

### 8. TodoInput Component (features/todos/components/TodoInput.tsx)
```tsx
// src/features/todos/components/TodoInput.tsx
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';

const TodoInput: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) { // ENTER_KEY
      event.preventDefault();
      const trimmedText = newTodo.trim();
      if (trimmedText) {
        dispatch(addTodo(trimmedText));
        setNewTodo('');
      }
    }
  }, [newTodo, dispatch]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  }, []);

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodo}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default TodoInput;
```

### 9. TodoList Component (features/todos/components/TodoList.tsx)
```tsx
// src/features/todos/components/TodoList.tsx
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../store/types';
import { toggleAll } from '../store/todosSlice';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: string;
}

const TodoList: React.FC<TodoListProps> = ({ todos, filter }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState<string | null>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleToggleAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  }, [dispatch]);

  const handleEdit = useCallback((id: string) => {
    setEditing(id);
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
  }, []);

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={todos.every(todo => todo.completed)}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={editing === todo.id}
            onEdit={() => handleEdit(todo.id)}
            onCancel={handleCancel}
          />
        ))}
      </ul>
    </section>
  );
};

export default React.memo(TodoList);
```

### 10. TodoItem Component (features/todos/components/TodoItem.tsx)
```tsx
// src/features/todos/components/TodoItem.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Todo } from '../store/types';
import { toggleTodo, destroyTodo, saveTodo } from '../store/todosSlice';

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onEdit, onCancel }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText.length]);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(destroyTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleSubmit = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(saveTodo({ id: todo.id, text: trimmedText }));
    } else {
      dispatch(destroyTodo(todo.id));
    }
    onCancel();
  }, [editText, dispatch, todo.id, onCancel]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 27) { // ESCAPE_KEY
      setEditText(todo.title);
      onCancel();
    } else if (event.keyCode === 13) { // ENTER_KEY
      handleSubmit();
    }
  }, [todo.title, onCancel, handleSubmit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={onEdit}>{todo.title}</label>
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
};

export default React.memo(TodoItem);
```

### 11. TodoFooter Component (features/todos/components/TodoFooter.tsx)
```tsx
// src/features/todos/components/TodoFooter.tsx
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { clearCompleted } from '../store/todosSlice';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  filter: string;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, filter }) => {
  const dispatch = useDispatch();

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const activeTodoWord = count === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={classNames({ selected: filter === 'all' })}>
            All
          </a>
        </li>{' '}
        <li>
          <a href="#/active" className={classNames({ selected: filter === 'active' })}>
            Active
          </a>
        </li>{' '}
        <li>
          <a href="#/completed" className={classNames({ selected: filter === 'completed' })}>
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

export default React.memo(TodoFooter);
```

### 12. Package.json
```json
// package.json
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "@reduxjs/toolkit": "^1.9.5",
    "nanoid": "^4.0.2",
    "classnames": "^2.3.2",
    "typescript": "^5.1.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/classnames": "^2.3.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Key Improvements and Changes Made:

1. **React 18 Migration**:
   - Updated to React 18 with modern rendering API (`createRoot`).
   - Replaced class components with functional components and hooks.
   - Removed deprecated lifecycle methods and implemented `useEffect`.

2. **Redux Toolkit Integration**:
   - Implemented state management with `createSlice` for todos.
   - Created proper action creators and reducers with immutable updates.
   - Configured Redux store with Provider.

3. **TypeScript Enhancements**:
   - Defined clear interfaces for all components and state.
   - Ensured strict typing throughout the application.
   - Used proper type annotations for events and props.

4. **Architecture Restructuring**:
   - Organized code into feature-based structure (`features/todos`).
   - Split monolithic components into smaller, focused components (`TodoInput`, `TodoList`, etc.).
   - Implemented proper component composition.

5. **Modern React Patterns**:
   - Used hooks (`useState`, `useEffect`, `useCallback`) for state and side effects.
   - Implemented `React.memo` for performance optimization.
   - Used `useCallback` for event handlers to prevent unnecessary re-renders.

6. **Performance Optimizations**:
   - Applied memoization with `React.memo` on components.
   - Optimized event handlers with `useCallback`.
   - Minimized re-renders with proper dependency arrays.

7. **Utility Updates**:
   - Replaced custom UUID with `nanoid` for ID generation.
   - Implemented modern localStorage handling with error checking.

8. **Code Quality**:
   - Removed all TODO comments and ensured clean code.
   - Followed consistent naming conventions (camelCase for variables, PascalCase for components).
   - Implemented proper error handling in localStorage operations.

This migrated version maintains the original functionality while incorporating modern React practices, robust state management with Redux Toolkit, and a clean, maintainable architecture. The application is now more performant, type-safe, and easier to scale.

### Tokens: {'input_tokens': 3490, 'output_tokens': 4085, 'reasoning_tokens': 0}
### Execution time: 38.76315402984619
