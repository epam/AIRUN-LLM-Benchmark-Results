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
### Thoughts:
I need to migrate this React application to React 18.x using TypeScript, Redux Toolkit with createSlice, and nanoid. Here's my plan:

1. Create a package.json with the required dependencies
2. Convert the existing TodoModel to Redux Toolkit using createSlice
3. Set up the Redux store and provider
4. Update components to use hooks and functional components instead of class components
5. Split the code into separate components
6. Optimize the code where possible

Let's start:

### 1. package.json

```json
{
  "name": "todo-app-react18",
  "version": "1.0.0",
  "description": "Todo App migrated to React 18",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@types/node": "^16.18.36",
    "@types/react": "^18.2.13",
    "@types/react-dom": "^18.2.6",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.0",
    "react-router-dom": "^6.13.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "eslint": "^8.43.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0"
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

### 2. Define types

Let's create a types.ts file:

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';
```

### 3. Create Redux slice

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';

interface TodosState {
  entities: Todo[];
}

const loadTodos = (): Todo[] => {
  const stored = localStorage.getItem('react-todos');
  return (stored && JSON.parse(stored)) || [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem('react-todos', JSON.stringify(todos));
};

const initialState: TodosState = {
  entities: loadTodos(),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.entities.push(action.payload);
        saveTodos(state.entities);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    todoToggled: (state, action: PayloadAction<string>) => {
      const todo = state.entities.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.entities);
      }
    },
    todoDeleted: (state, action: PayloadAction<string>) => {
      state.entities = state.entities.filter(todo => todo.id !== action.payload);
      saveTodos(state.entities);
    },
    todoEdited: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.entities.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.entities);
      }
    },
    allToggled: (state, action: PayloadAction<boolean>) => {
      state.entities.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.entities);
    },
    completedCleared: (state) => {
      state.entities = state.entities.filter(todo => !todo.completed);
      saveTodos(state.entities);
    },
  },
});

export const {
  todoAdded,
  todoToggled,
  todoDeleted,
  todoEdited,
  allToggled,
  completedCleared,
} = todosSlice.actions;

export default todosSlice.reducer;
```

### 4. Create Redux Store

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';
import filterReducer from './features/filters/filtersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5. Create Filters Slice

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter } from '../types';

const initialState: Filter = 'all';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChanged: (_, action: PayloadAction<Filter>) => {
      return action.payload;
    },
  },
});

export const { filterChanged } = filterSlice.actions;

export default filterSlice.reducer;
```

### 6. Create index.tsx

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App';
import './index.css';

const container = document.getElementsByClassName('todoapp')[0];
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 7. Create React components

App.tsx
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { useAppSelector } from './hooks';

export const App: React.FC = () => {
  const todos = useAppSelector(state => state.todos.entities);
  
  return (
    <Router>
      <div>
        <TodoHeader />
        {todos.length > 0 && <TodoList />}
        {todos.length > 0 && <TodoFooter />}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/:filter" element={null} />
      </Routes>
    </Router>
  );
};
```

TodoHeader.tsx
```typescript
import React, { useState, KeyboardEvent } from 'react';
import { useAppDispatch } from '../hooks';
import { todoAdded } from '../features/todos/todosSlice';

const TodoHeader: React.FC = () => {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    e.preventDefault();
    
    const trimmedText = text.trim();
    
    if (trimmedText) {
      dispatch(todoAdded(trimmedText));
      setText('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;
```

TodoList.tsx
```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { allToggled } from '../features/todos/todosSlice';
import { Todo } from '../types';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.entities);
  const { filter = 'all' } = useParams<{ filter: string }>();
  
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  
  const handleToggleAll = () => {
    dispatch(allToggled(activeTodoCount > 0));
  };
  
  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={activeTodoCount === 0}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
```

TodoItem.tsx
```typescript
import React, { useState, useRef, useEffect, KeyboardEvent, FormEvent } from 'react';
import classnames from 'classnames';
import { useAppDispatch } from '../hooks';
import { todoToggled, todoDeleted, todoEdited } from '../features/todos/todosSlice';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText]);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSubmit = () => {
    const text = editText.trim();
    if (text) {
      dispatch(todoEdited({ id: todo.id, title: text }));
      setEditText(text);
      setEditing(false);
    } else {
      dispatch(todoDeleted(todo.id));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setEditText(e.currentTarget.value);
  };

  return (
    <li
      className={classnames({
        completed: todo.completed,
        editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(todoToggled(todo.id))}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => dispatch(todoDeleted(todo.id))}
        />
      </div>
      <input
        ref={editInputRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;
```

TodoFooter.tsx
```typescript
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import classnames from 'classnames';
import { useAppSelector, useAppDispatch } from '../hooks';
import { completedCleared } from '../features/todos/todosSlice';

const TodoFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.entities);
  const { filter = 'all' } = useParams<{ filter: string }>();
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  
  const itemWord = activeTodoCount === 1 ? 'item' : 'items';
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to="/all"
            className={({ isActive }) => classnames({ selected: isActive || filter === 'all' })}
          >
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/active"
            className={({ isActive }) => classnames({ selected: isActive })}
          >
            Active
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/completed"
            className={({ isActive }) => classnames({ selected: isActive })}
          >
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(completedCleared())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
```

### 8. Create Redux hooks file

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Now I've migrated the code to React 18 and Redux Toolkit using createSlice and nanoid. The code is split into separate components, uses functional components with hooks instead of class components, and is optimized where possible.

The main changes are:
1. Using Redux Toolkit with createSlice instead of the custom TodoModel
2. Using functional components with hooks instead of class components
3. Using React Router v6 instead of the custom router
4. Using nanoid for generating unique IDs
5. Properly typing everything with TypeScript
6. Using React 18's createRoot API instead of ReactDOM.render
7. Optimizing state management and component updates

Let me ensure I've covered everything required:
- ✅ Used TypeScript
- ✅ Used Redux Toolkit with createSlice
- ✅ Used nanoid for IDs
- ✅ Provided package.json file
- ✅ Configured store and provider
- ✅ Split code into separate components
- ✅ Optimized code
- ✅ No TODOs in the code

With all these requirements met, I believe this is a complete migration of the app to React 18.x using modern practices.

### Answer:
# Migrated Todo App with React 18.x

## package.json
```json
{
  "name": "todo-app-react18",
  "version": "1.0.0",
  "description": "Todo App with React 18 and Redux Toolkit",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@types/node": "^16.18.36",
    "@types/react": "^18.2.13",
    "@types/react-dom": "^18.2.6",
    "classnames": "^2.3.2",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.0",
    "react-router-dom": "^6.13.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
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

## types.ts
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';
```

## store/index.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import filterReducer from '../features/filters/filtersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## hooks/index.ts
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## features/todos/todosSlice.ts
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../../types';

interface TodosState {
  entities: Todo[];
}

const loadTodos = (): Todo[] => {
  const stored = localStorage.getItem('react-todos');
  return (stored && JSON.parse(stored)) || [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem('react-todos', JSON.stringify(todos));
};

const initialState: TodosState = {
  entities: loadTodos(),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.entities.push(action.payload);
        saveTodos(state.entities);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    todoToggled: (state, action: PayloadAction<string>) => {
      const todo = state.entities.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.entities);
      }
    },
    todoDeleted: (state, action: PayloadAction<string>) => {
      state.entities = state.entities.filter(todo => todo.id !== action.payload);
      saveTodos(state.entities);
    },
    todoEdited: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.entities.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.entities);
      }
    },
    allToggled: (state, action: PayloadAction<boolean>) => {
      state.entities.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.entities);
    },
    completedCleared: (state) => {
      state.entities = state.entities.filter(todo => !todo.completed);
      saveTodos(state.entities);
    },
  },
});

export const {
  todoAdded,
  todoToggled,
  todoDeleted,
  todoEdited,
  allToggled,
  completedCleared,
} = todosSlice.actions;

export default todosSlice.reducer;
```

## features/filters/filtersSlice.ts
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter } from '../../types';

const initialState: Filter = 'all';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChanged: (_, action: PayloadAction<Filter>) => {
      return action.payload;
    },
  },
});

export const { filterChanged } = filterSlice.actions;

export default filterSlice.reducer;
```

## components/TodoItem.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { useAppDispatch } from '../hooks';
import { todoToggled, todoDeleted, todoEdited } from '../features/todos/todosSlice';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText]);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSubmit = () => {
    const text = editText.trim();
    if (text) {
      dispatch(todoEdited({ id: todo.id, title: text }));
      setEditText(text);
      setEditing(false);
    } else {
      dispatch(todoDeleted(todo.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  return (
    <li
      className={classnames({
        completed: todo.completed,
        editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(todoToggled(todo.id))}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => dispatch(todoDeleted(todo.id))}
        />
      </div>
      <input
        ref={editInputRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;
```

## components/TodoList.tsx
```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { allToggled } from '../features/todos/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.entities);
  const { filter = 'all' } = useParams<{ filter?: string }>();
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  
  const handleToggleAll = () => {
    dispatch(allToggled(activeTodoCount > 0));
  };
  
  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={activeTodoCount === 0 && todos.length > 0}
        onChange={handleToggleAll}
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

export default TodoList;
```

## components/TodoFooter.tsx
```typescript
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import classnames from 'classnames';
import { useAppSelector, useAppDispatch } from '../hooks';
import { completedCleared } from '../features/todos/todosSlice';

const TodoFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.entities);
  const { filter = 'all' } = useParams<{ filter?: string }>();
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  
  const itemWord = activeTodoCount === 1 ? 'item' : 'items';
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to="/all"
            className={({ isActive }) => classnames({ selected: isActive || filter === 'all' })}
          >
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/active"
            className={({ isActive }) => classnames({ selected: isActive })}
          >
            Active
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/completed"
            className={({ isActive }) => classnames({ selected: isActive })}
          >
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(completedCleared())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
```

## components/TodoHeader.tsx
```typescript
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { todoAdded } from '../features/todos/todosSlice';

const TodoHeader: React.FC = () => {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    e.preventDefault();
    
    const trimmedText = text.trim();
    
    if (trimmedText) {
      dispatch(todoAdded(trimmedText));
      setText('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;
```

## constants.ts
```typescript
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 'Enter';
export const ESCAPE_KEY = 'Escape';
```

## App.tsx
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { useAppSelector } from './hooks';

export const App: React.FC = () => {
  const todos = useAppSelector(state => state.todos.entities);
  
  return (
    <Router>
      <div>
        <TodoHeader />
        {todos.length > 0 && <TodoList />}
        {todos.length > 0 && <TodoFooter />}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/:filter" element={null} />
      </Routes>
    </Router>
  );
};
```

## index.tsx
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './App';
import './index.css';

const container = document.getElementsByClassName('todoapp')[0];
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### Tokens: {'input_tokens': 4076, 'output_tokens': 8019}
### Execution time: 87.19744086265564
