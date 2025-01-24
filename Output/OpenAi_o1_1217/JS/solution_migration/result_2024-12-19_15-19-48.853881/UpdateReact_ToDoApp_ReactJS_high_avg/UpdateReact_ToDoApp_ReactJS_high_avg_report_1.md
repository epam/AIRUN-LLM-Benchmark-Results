I have the following React app code:

app.tsx
```tsx
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

todoItem.tsx
```tsx
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

utils.ts
```ts

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

footer.tsx
```tsx
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

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

todoModel.ts
```ts
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


Your task is to migrate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use the following libraries: TypeScript, Redux Toolkit with createSlice, and nanoid.
- Provide a package.json file and configure the store and provider.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
```markdown
```jsonc
// package.json
{
  "name": "react18-todos",
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
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "nanoid": "^4.0.1"
  },
  "devDependencies": {
    "@types/node": "^18.16.19",
    "typescript": "^5.0.4",
    "vite": "^4.3.9"
  }
}
```
```

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```tsx
// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { todosReducer } from './todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```tsx
// src/todos/constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```tsx
// src/todos/utils.ts
export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's';
}

export function loadTodosFromStorage(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function saveTodosToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
```

```tsx
// src/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { loadTodosFromStorage, saveTodosToStorage } from './utils';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  items: Todo[];
  filter: string;
}

const STORAGE_KEY = 'react-todos';

const initialState: TodosState = {
  items: loadTodosFromStorage(STORAGE_KEY),
  filter: 'all'
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: nanoid(),
        title: action.payload,
        completed: false
      });
      saveTodosToStorage(STORAGE_KEY, state.items);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.items = state.items.map(todo => ({
        ...todo,
        completed: action.payload
      }));
      saveTodosToStorage(STORAGE_KEY, state.items);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodosToStorage(STORAGE_KEY, state.items);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveTodosToStorage(STORAGE_KEY, state.items);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      state.items = state.items.map(todo =>
        todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
      );
      saveTodosToStorage(STORAGE_KEY, state.items);
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      saveTodosToStorage(STORAGE_KEY, state.items);
    }
  }
});

export const {
  setFilter,
  addTodo,
  toggleAll,
  toggleTodo,
  removeTodo,
  saveTodo,
  clearCompleted
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
```

```tsx
// src/todos/TodoItem.tsx
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from './constants';
import { useAppDispatch } from '../utils/hooks';
import { removeTodo, saveTodo, toggleTodo } from './todosSlice';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
  onEdit: (id: string) => void;
  onCancel: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  editing,
  onEdit,
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const [editText, setEditText] = useState(title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      dispatch(saveTodo({ id, title: trimmed }));
    } else {
      dispatch(removeTodo(id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(title);
      onCancel();
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  return (
    <li
      className={classNames({
        completed,
        editing
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => dispatch(toggleTodo(id))}
        />
        <label onDoubleClick={() => onEdit(id)}>
          {title}
        </label>
        <button className="destroy" onClick={() => dispatch(removeTodo(id))} />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={() => handleSubmit()}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};
```

```tsx
// src/todos/TodoFooter.tsx
import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { pluralize } from './utils';

interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  currentFilter: string;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeCount,
  completedCount,
  currentFilter,
  onClearCompleted
}) => {
  const activeTodoWord = pluralize(activeCount, 'item');
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: currentFilter === ALL_TODOS })}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: currentFilter === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>
        {' '}
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
```

```tsx
// src/todos/TodoList.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../utils/hooks';
import { TodoItem } from './TodoItem';
import { Todo } from './todosSlice';

interface TodoListProps {
  items: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ items }) => {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);

  const onEdit = (id: string) => {
    setEditingId(id);
  };

  const onCancel = () => {
    setEditingId(null);
  };

  return (
    <ul className="todo-list">
      {items.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          editing={editingId === todo.id}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      ))}
    </ul>
  );
};
```

```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useAppDispatch } from './utils/hooks';
import {
  setFilter,
  addTodo,
  toggleAll,
  clearCompleted
} from './todos/todosSlice';
import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  ENTER_KEY
} from './todos/constants';
import { TodoFooter } from './todos/TodoFooter';
import { TodoList } from './todos/TodoList';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, filter } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === ACTIVE_TODOS || hash === COMPLETED_TODOS) {
        dispatch(setFilter(hash));
      } else {
        dispatch(setFilter(ALL_TODOS));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch]);

  const shownTodos = items.filter(todo => {
    if (filter === ACTIVE_TODOS) {
      return !todo.completed;
    } else if (filter === COMPLETED_TODOS) {
      return todo.completed;
    }
    return true;
  });

  const activeCount = items.reduce((acc, t) => t.completed ? acc : acc + 1, 0);
  const completedCount = items.length - activeCount;

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== ENTER_KEY) return;
    e.preventDefault();
    const input = e.currentTarget;
    const val = input.value.trim();
    if (val) {
      dispatch(addTodo(val));
      input.value = '';
    }
  };

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
      {items.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => dispatch(toggleAll(e.target.checked))}
            checked={activeCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList items={shownTodos} />
        </section>
      )}
      {(activeCount > 0 || completedCount > 0) && (
        <TodoFooter
          activeCount={activeCount}
          completedCount={completedCount}
          currentFilter={filter}
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      )}
    </div>
  );
};
```

```tsx
// src/utils/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
```

### Tokens: {'input_tokens': 3257, 'output_tokens': 5221, 'reasoning_tokens': 2240}
### Execution time: 43.44010615348816
