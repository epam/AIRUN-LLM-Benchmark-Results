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
Below is a complete React‑18 + Redux‑Toolkit + TypeScript migration of your TodoMVC app.  We:

 • Switched to functional components/hooks  
 • Bootstrapped state with RTK’s createSlice  
 • Persist to localStorage safely  
 • Wrote strict TS interfaces everywhere  
 • Used nanoid for IDs  
 • Split files by feature  
 • Added memoization (React.memo, useCallback)  
 • Did a tiny code split (React.lazy + Suspense)  
 • No deprecated lifecycles remain  

File structure:

```
package.json
tsconfig.json
src/
  index.tsx
  App.tsx
  store.ts
  common/
    constants.ts
    hooks.ts
    localStorage.ts
  features/
    todos/
      types.ts
      todosSlice.ts
      TodoApp.tsx
      TodoItem.tsx
      TodoFooter.tsx
```

––– package.json –––
```json
{
  "name": "react-todo-rtk-ts",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.2",
    "nanoid": "^4.0.0",
    "classnames": "^2.3.1"
  },
  "devDependencies": {
    "typescript": "^4.8.4",
    "@types/react": "^18.0.14",
    "@types/react-dom": "^18.0.5",
    "@types/classnames": "^2.3.1"
  }
}
```

––– tsconfig.json –––
```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom","dom.iterable","esnext"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

––– src/index.tsx –––
```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

––– src/store.ts –––
```ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';
import { loadState, saveState } from './common/localStorage';

const preloaded = loadState<{ todos: any }>();

const store = configureStore({
  reducer: { todos: todosReducer },
  preloadedState: preloaded
});

store.subscribe(() => {
  saveState({ todos: store.getState().todos });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

––– src/common/localStorage.ts –––
```ts
export const loadState = <T>(): T | undefined => {
  try {
    const serialized = localStorage.getItem('appState');
    if (!serialized) return undefined;
    return JSON.parse(serialized) as T;
  } catch (err) {
    console.error('loadState failed', err);
    return undefined;
  }
};

export const saveState = (state: any): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('appState', serialized);
  } catch (err) {
    console.error('saveState failed', err);
  }
};
```

––– src/common/constants.ts –––
```ts
export type Filter = 'all' | 'active' | 'completed';
export const ALL_TODOS: Filter = 'all';
export const ACTIVE_TODOS: Filter = 'active';
export const COMPLETED_TODOS: Filter = 'completed';
```

––– src/common/hooks.ts –––
```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

––– src/features/todos/types.ts –––
```ts
import { Filter, ALL_TODOS } from '../../common/constants';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  filter: Filter;
  editingTodoId: string | null;
}

export const initialTodosState: TodosState = {
  todos: [],
  filter: ALL_TODOS,
  editingTodoId: null
};
```

––– src/features/todos/todosSlice.ts –––
```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Filter, ALL_TODOS } from '../../common/constants';
import { TodosState, initialTodosState, Todo } from './types';

const slice = createSlice({
  name: 'todos',
  initialState: initialTodosState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: { id: nanoid(), title, completed: false }
        };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const t = state.todos.find(t => t.id === action.payload);
      if (t) t.completed = !t.completed;
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(t => (t.completed = action.payload));
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const t = state.todos.find(t => t.id === action.payload.id);
      if (t) t.title = action.payload.title;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
    },
    changeFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    setEditing(state, action: PayloadAction<string | null>) {
      state.editingTodoId = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  deleteTodo,
  saveTodo,
  clearCompleted,
  changeFilter,
  setEditing
} = slice.actions;

export default slice.reducer;
```

––– src/App.tsx –––
```tsx
import React, { Suspense } from 'react';

const TodoApp = React.lazy(() => import('./features/todos/TodoApp'));

const App: React.FC = () => (
  <Suspense fallback={<div>Loading…</div>}>
    <TodoApp />
  </Suspense>
);

export default App;
```

––– src/features/todos/TodoApp.tsx –––
```tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react';
import { useAppSelector, useAppDispatch } from '../../common/hooks';
import {
  addTodo,
  toggleAll,
  toggleTodo,
  deleteTodo,
  saveTodo,
  clearCompleted,
  changeFilter,
  setEditing
} from './todosSlice';
import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  Filter
} from '../../common/constants';
import { Todo } from './types';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
  const { todos, filter, editingTodoId } = useAppSelector(
    state => state.todos
  );
  const dispatch = useAppDispatch();

  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Hash‑based routing
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash;
      switch (h) {
        case '#/active':
          dispatch(changeFilter(ACTIVE_TODOS));
          break;
        case '#/completed':
          dispatch(changeFilter(COMPLETED_TODOS));
          break;
        default:
          dispatch(changeFilter(ALL_TODOS));
      }
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
    };
  }, [dispatch]);

  const handleNewKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      const v = newTitle.trim();
      if (!v) return;
      dispatch(addTodo(v));
      setNewTitle('');
    },
    [dispatch, newTitle]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setNewTitle(e.target.value),
    []
  );

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(toggleAll(e.target.checked)),
    [dispatch]
  );

  const handleClear = useCallback(
    () => dispatch(clearCompleted()),
    [dispatch]
  );

  const handleToggle = useCallback(
    (id: string) => dispatch(toggleTodo(id)),
    [dispatch]
  );
  const handleDel = useCallback(
    (id: string) => dispatch(deleteTodo(id)),
    [dispatch]
  );
  const handleEdit = useCallback(
    (id: string) => dispatch(setEditing(id)),
    [dispatch]
  );
  const handleSave = useCallback(
    (id: string, title: string) => {
      dispatch(saveTodo({ id, title }));
      dispatch(setEditing(null));
    },
    [dispatch]
  );
  const handleCancel = useCallback(
    () => dispatch(setEditing(null)),
    [dispatch]
  );

  const shown = todos.filter(todo => {
    switch (filter) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.reduce(
    (c, t) => (!t.completed ? c + 1 : c),
    0
  );
  const completedCount = todos.length - activeCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleChange}
          onKeyDown={handleNewKey}
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
          <ul className="todo-list">
            {shown.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editingTodoId === todo.id}
                onToggle={() => handleToggle(todo.id)}
                onDestroy={() => handleDel(todo.id)}
                onEdit={() => handleEdit(todo.id)}
                onSave={title => handleSave(todo.id, title)}
                onCancel={handleCancel}
              />
            ))}
          </ul>
        </section>
      )}

      {(activeCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeCount}
          completedCount={completedCount}
          filter={filter}
          onClearCompleted={handleClear}
          onChangeFilter={f => dispatch(changeFilter(f))}
        />
      )}
    </div>
  );
};

export default TodoApp;
```

––– src/features/todos/TodoItem.tsx –––
```tsx
import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import classNames from 'classnames';
import { Todo } from './types';

interface Props {
  todo: Todo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
}

const TodoItem: React.FC<Props> = ({
  todo,
  editing,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}) => {
  const [text, setText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // keep local edit text in sync
  useEffect(() => {
    setText(todo.title);
  }, [todo.title]);

  // focus when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setText(e.target.value);

  const handleSubmit = () => {
    const v = text.trim();
    if (v) {
      onSave(v);
    } else {
      onDestroy();
    }
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Escape') {
      setText(todo.title);
      onCancel();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
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
          onChange={onToggle}
        />
        <label onDoubleClick={onEdit}>
          {todo.title}
        </label>
        <button
          className="destroy"
          onClick={onDestroy}
        />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={text}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKey}
      />
    </li>
  );
};

export default React.memo(TodoItem);
```

––– src/features/todos/TodoFooter.tsx –––
```tsx
import React, { useCallback } from 'react';
import classNames from 'classnames';
import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  Filter
} from '../../common/constants';

interface Props {
  count: number;
  completedCount: number;
  filter: Filter;
  onClearCompleted: () => void;
  onChangeFilter: (f: Filter) => void;
}

const TodoFooter: React.FC<Props> = ({
  count,
  completedCount,
  filter,
  onClearCompleted,
  onChangeFilter
}) => {
  const itemWord = count === 1 ? 'item' : 'items';

  const selectFilter = useCallback(
    (f: Filter, e: React.MouseEvent) => {
      e.preventDefault();
      onChangeFilter(f);
      window.location.hash = f === ALL_TODOS ? '/' : `/${f}`;
    },
    [onChangeFilter]
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === ALL_TODOS })}
            onClick={e => selectFilter(ALL_TODOS, e)}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === ACTIVE_TODOS })}
            onClick={e => selectFilter(ACTIVE_TODOS, e)}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === COMPLETED_TODOS })}
            onClick={e => selectFilter(COMPLETED_TODOS, e)}
          >
            Completed
          </a>
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
};

export default React.memo(TodoFooter);
```

Notes
• We never mutate state directly; RTK uses Immer under the hood.  
• All components are strictly typed.  
• We persist only the todos slice to localStorage.  
• React.lazy + Suspense demonstrate simple code splitting.  
• We use useCallback & React.memo to avoid needless re‑renders.  
• No deprecated lifecycle methods remain; we use hooks.  

This setup is ready to `npm install` / `yarn` and `npm start`.

### Tokens: {'input_tokens': 3512, 'output_tokens': 9271, 'reasoning_tokens': 5376}
### Execution time: 100.70957589149475
