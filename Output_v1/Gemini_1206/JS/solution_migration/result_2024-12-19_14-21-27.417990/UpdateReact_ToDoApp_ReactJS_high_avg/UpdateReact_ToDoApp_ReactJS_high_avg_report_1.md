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
```json
package.json
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "description": "Todo app migrated to React 18",
  "main": "index.tsx",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "css-loader": "^6.8.1",
    "html-webpack-plugin": "^5.5.3",
    "style-loader": "^3.3.3",
    "ts-loader": "^9.4.4",
    "typescript": "^5.1.6",
    "webpack": "^5.88.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  }
}
```

```tsx
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './components/App';
import './index.css';

const container = document.getElementsByClassName('todoapp')[0];
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```tsx
// src/components/App.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
  selectTodos,
  selectNowShowing,
  setNowShowing,
} from '../store/todoSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const nowShowing = useSelector(selectNowShowing);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/') {
      dispatch(setNowShowing(ALL_TODOS));
    } else if (pathname === '/active') {
      dispatch(setNowShowing(ACTIVE_TODOS));
    } else if (pathname === '/completed') {
      dispatch(setNowShowing(COMPLETED_TODOS));
    }
  }, [location, dispatch]);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const val = event.currentTarget.value.trim();

    if (val) {
      dispatch(addTodo(val));
      event.currentTarget.value = '';
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    dispatch(toggleAll(checked));
  };

  const handleToggle = (id: string) => {
    dispatch(toggle(id));
  };

  const handleDestroy = (id: string) => {
    dispatch(destroy(id));
  };

  const handleSave = (id: string, text: string) => {
    dispatch(save({ id, text }));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const filteredTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
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
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDestroy={handleDestroy}
                onSave={handleSave}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export default App;
```

```tsx
// src/components/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { ITodo } from '../store/todoSlice';

interface TodoItemProps {
  todo: ITodo;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onSave: (id: string, text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDestroy, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(todo.id, val);
      setEditText(val);
      setEditing(false);
    } else {
      onDestroy(todo.id);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [editing]);

  return (
    <li className={classNames({ completed: todo.completed, editing: editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => onDestroy(todo.id)} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
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

export default TodoItem;
```

```tsx
// src/components/TodoFooter.tsx
import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { useSelector, useDispatch } from 'react-redux';
import { setNowShowing } from '../store/todoSlice';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  count,
  completedCount,
  nowShowing,
  onClearCompleted,
}) => {
  const dispatch = useDispatch();

  const pluralize = (count: number, word: string) => {
    return count === 1 ? word : word + 's';
  };

  const activeTodoWord = pluralize(count, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
            onClick={() => dispatch(setNowShowing(ALL_TODOS))}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            onClick={() => dispatch(setNowShowing(ACTIVE_TODOS))}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            onClick={() => dispatch(setNowShowing(COMPLETED_TODOS))}
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

export default TodoFooter;
```

```ts
// src/constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```ts
// src/store/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from './store';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: ITodo[];
  nowShowing: string;
}

const initialTodos: ITodo[] = JSON.parse(localStorage.getItem('react-todos') || '[]');

const initialState: TodoState = {
  todos: initialTodos,
  nowShowing: ALL_TODOS,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false,
      });
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos = state.todos.map((todo) => ({
        ...todo,
        completed: action.payload,
      }));
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    toggle: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    destroy: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    save: (state, action: PayloadAction<{ id: string; text: string }>) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload.id ? { ...todo, title: action.payload.text } : todo
      );
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    setNowShowing: (state, action: PayloadAction<string>) => {
      state.nowShowing = action.payload;
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
  setNowShowing,
} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectNowShowing = (state: RootState) => state.todos.nowShowing;

export default todoSlice.reducer;
```

```ts
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```css
/* src/index.css */
/* Paste your CSS here */
```

```
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
};

```

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>React • TodoMVC</title>
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <section class="todoapp"></section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>
        Created by <a href="http://github.com/petehunt/">petehunt</a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  </body>
</html>
```

### Tokens: {'input_tokens': 3807, 'output_tokens': 3946}
### Execution time: 91.65194582939148
