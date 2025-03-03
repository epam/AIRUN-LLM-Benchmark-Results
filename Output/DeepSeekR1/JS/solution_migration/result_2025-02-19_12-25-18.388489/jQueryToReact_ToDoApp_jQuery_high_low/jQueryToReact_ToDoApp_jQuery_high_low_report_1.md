I have the following jQuery app code:

index.html
```html
<!doctype html>
<html lang="en" data-framework="jquery">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="A TodoMVC written in jQuery." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>TodoMVC: jQuery</title>
        <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
        <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
        <link rel="stylesheet" href="src/app.css">
    </head>
    <body>
        <section id="todoapp" class="todoapp">
            <header id="header" class="header">
                <h1>todos</h1>
                <input id="new-todo" class="new-todo" placeholder="What needs to be done?" autofocus>
            </header>
            <main id="main" class="main">
                <div class="toggle-all-container">
                    <input id="toggle-all" class="toggle-all" type="checkbox">
                    <label for="toggle-all">Mark all as complete</label>
                </div>
                <ul id="todo-list" class="todo-list"></ul>
            </main>
            <footer id="footer" class="footer"></footer>
        </section>
        <footer id="info" class="info">
            <p>Double-click to edit a todo</p>
            <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
            <p>Updated by the TodoMVC Team</p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
        <script id="todo-template" type="text/x-handlebars-template">
            {{#this as |item index|}}
            <li class="{{#if item.completed}} completed{{/if}}" data-id="{{item.id}}"">
                <div class="view">
                    <input class="toggle" type="checkbox" {{#if item.completed}}checked{{/if}}>
                    <label>{{item.title}}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="{{item.title}}">
            </li>
        {{/this}}
        </script>
        <script id="footer-template" type="text/x-handlebars-template">
            <span id="todo-count" class="todo-count"><strong>{{activeTodoCount}}</strong> {{activeTodoWord}} left</span>
            <ul id="filters" class="filters">
                <li>
                    <a {{#eq filter 'all'}}class="selected"{{/eq}} href="#/all">All</a>
                </li>
                <li>
                    <a {{#eq filter 'active'}}class="selected"{{/eq}}href="#/active">Active</a>
                </li>
                <li>
                    <a {{#eq filter 'completed'}}class="selected"{{/eq}}href="#/completed">Completed</a>
                </li>
            </ul>
            {{#if completedTodos}}<button class="clear-completed">Clear completed</button>{{/if}}
        </script>
        <!-- <script src="node_modules/todomvc-common/base.js"></script> -->
        <script src="node_modules/jquery/dist/jquery.min.js"></script>
        <script src="node_modules/handlebars/dist/handlebars.min.js"></script>
        <script src="node_modules/director/build/director.min.js"></script>
        <script src="src/app.js"></script>
    </body>
</html>

```

app.js
```js
/*global jQuery, Handlebars, Router */
jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    var util = {
        uuid: function () {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function (namespace, data) {
            return [];
        }
    };

    var App = {
        ENTER_KEY: 13,
        ESCAPE_KEY: 27,
        init: function () {
            this.todos = util.store('todos-jquery');
            this.todoTemplate = Handlebars.compile($('#todo-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.bindEvents();

            new Router({
                '/:filter': function (filter) {
                    this.filter = filter;
                    this.render();
                }.bind(this)
            }).init('/all');

            var dummyNodeToNotifyAppIsReady = document.createElement('div');
            dummyNodeToNotifyAppIsReady.id = 'appIsReady';
            document.body.appendChild(dummyNodeToNotifyAppIsReady);
        },
        bindEvents: function () {
            $('#new-todo').on('keyup', this.create.bind(this));
            $('#toggle-all').on('change', this.toggleAll.bind(this));
            $('#footer').on('click', '.clear-completed', this.destroyCompleted.bind(this));
            $('#todo-list')
                .on('change', '.toggle', this.toggle.bind(this))
                .on('dblclick', 'label', this.edit.bind(this))
                .on('keyup', '.edit', this.editKeyup.bind(this))
                .on('focusout', '.edit', this.update.bind(this))
                .on('click', '.destroy', this.destroy.bind(this));
        },
        render: function () {
            var todos = this.getFilteredTodos();
            $('#todo-list').html(this.todoTemplate(todos));
            $('#main').toggle(todos.length > 0);
            $('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
            this.renderFooter();
            $('#new-todo').focus();
            util.store('todos-jquery', this.todos);
        },
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.getActiveTodos().length;
            var template = this.footerTemplate({
                activeTodoCount: activeTodoCount,
                activeTodoWord: util.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount,
                filter: this.filter
            });

            $('#footer').toggle(todoCount > 0).html(template);
        },
        toggleAll: function (e) {
            var isChecked = $(e.target).prop('checked');

            this.todos.forEach(function (todo) {
                todo.completed = isChecked;
            });

            this.render();
        },
        getActiveTodos: function () {
            return this.todos.filter(function (todo) {
                return !todo.completed;
            });
        },
        getCompletedTodos: function () {
            return this.todos.filter(function (todo) {
                return todo.completed;
            });
        },
        getFilteredTodos: function () {
            if (this.filter === 'active') {
                return this.getActiveTodos();
            }

            if (this.filter === 'completed') {
                return this.getCompletedTodos();
            }

            return this.todos;
        },
        destroyCompleted: function () {
            this.todos = this.getActiveTodos();
            this.filter = 'all';
            this.render();
        },
        // accepts an element from inside the `.item` div and
        // returns the corresponding index in the `todos` array
        indexFromEl: function (el) {
            var id = $(el).closest('li').data('id');
            var todos = this.todos;
            var i = todos.length;

            while (i--) {
                if (todos[i].id === id) {
                    return i;
                }
            }
        },
        create: function (e) {
            var $input = $(e.target);
            var val = $.trim($input.val());

            if (e.which !== this.ENTER_KEY || !val) {
                return;
            }

            this.todos.push({
                id: util.uuid(),
                title: val,
                completed: false
            });

            $input.val('');

            this.render();
        },
        toggle: function (e) {
            var i = this.indexFromEl(e.target);
            this.todos[i].completed = !this.todos[i].completed;
            this.render();
        },
        edit: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            const title = $(e.target).text();
            $input.trigger("focus").val("").val(title);
        },
        editKeyup: function (e) {
            if (e.which === this.ENTER_KEY) {
                e.target.blur();
            }

            if (e.which === this.ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function (e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (!val) {
                this.destroy(e);
                return;
            }

            if ($el.data('abort')) {
                $el.data('abort', false);
            } else {
                this.todos[this.indexFromEl(el)].title = val;
            }

            this.render();
        },
        destroy: function (e) {
            this.todos.splice(this.indexFromEl(e.target), 1);
            this.render();
        }
    };

    window.app = App;
    window.app.init();
});

```


Your task is to translate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use the following libraries: Create React App, TypeScript, Redux Toolkit with createSlice, and nanoid.
- Provide a package.json file and configure the store and provider.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.
## Run 1:
### Answer:
<think>
Okay, I need to convert this jQuery TodoMVC app to React 18 using TypeScript, Redux Toolkit, and other specified libraries. Let me start by understanding the original code structure.

First, the original app uses jQuery for DOM manipulation, Handlebars for templating, and a Router. In React, I'll use components, Redux for state management, and React Router for routing.

The main components in the original HTML are the header with the input, the main section with the todo list, and the footer with filters and count. So I'll split these into React components: TodoList, TodoItem, Footer, etc.

The app's state includes todos, filter (all, active, completed), and methods to add, toggle, edit, delete todos. Redux Toolkit's createSlice will handle this. I'll define the initial state, reducers for each action, and selectors for filtered todos.

For the store setup, I'll use configureStore from Redux Toolkit. The store will include the todos slice and possibly the filter, though maybe the filter can be in the URL with React Router.

Routing: The original uses a router to handle /all, /active, /completed. In React, I'll use React Router DOM's BrowserRouter, Routes, Route, and useParams or something similar to get the filter from the URL.

Components breakdown:

- App component: Main component that includes Header, Main, Footer.
- Header: The input for adding new todos.
- Main: Toggle all checkbox and TodoList.
- TodoList: Renders list of TodoItems based on the current filter.
- TodoItem: Each todo with toggle, edit, delete buttons.
- Footer: Shows count, filters links, clear completed button.

In Redux, the todos slice will have actions like addTodo, toggleTodo, editTodo, deleteTodo, toggleAll, clearCompleted. The state will have an array of todos with id, title, completed.

The util functions like uuid can be replaced with nanoid. The pluralize function can be a helper function in the Footer component.

For the edit functionality, the original uses double-click on the label to switch to an input. In React, I'll manage an editing state in TodoItem, conditionally rendering the input or label.

The toggle all checkbox in the original checks all todos. In Redux, an action to set all todos' completed status based on the toggle.

The footer's filter links should update the URL, which React Router will handle. The Main and Footer components will read the current filter from the URL parameters.

Now, let's outline the code structure.

First, create the Redux store with createSlice:

- Define the initial state: { todos: [] }
- Reducers for add, toggle, edit, delete, etc.
- Selectors for activeTodoCount, completedTodoCount, filteredTodos.

Then, the components:

App.tsx: Sets up routing, renders Header, Main, Footer based on route.

Header.tsx: Input field to dispatch addTodo on Enter.

TodoList.tsx: Connects to Redux, uses filteredTodos selector, maps to TodoItem components.

TodoItem.tsx: Displays todo, handles toggle, edit, delete. Uses state to manage editing mode.

Footer.tsx: Displays counts, filter links, clear completed button. Uses React Router's Link for navigation.

For the CSS, import the same TodoMVC styles, but adjust class names to match React structure.

In package.json, include dependencies: react, react-dom, react-redux, @reduxjs/toolkit, react-router-dom, nanoid, types, etc.

Implementing the store:

Store will be created with configureStore, and the provider wraps the App in index.tsx.

Testing each component's functionality:

- Adding a todo dispatches addTodo with nanoid.
- Toggling a todo updates the completed status.
- Editing a todo updates the title.
- Deleting removes the todo from the state.
- Toggle all sets all todos' completed to the checkbox state.
- Clear completed removes all completed todos.

Routing: Use Routes in App.tsx to handle /, /active, /completed. The Main component can use useLocation or useParams to get the current filter and select the appropriate todos.

Edge cases: When editing, pressing escape should cancel editing. Blurring the input or pressing enter saves the changes.

Now, writing each file step by step, ensuring TypeScript types are correct, and Redux is properly integrated.
</think>

package.json:
```json
{
  "name": "todomvc-react",
  "version": "1.0.0",
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.14.2",
    "react-scripts": "5.0.1",
    "todomvc-app-css": "^2.4.1",
    "todomvc-common": "^1.0.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
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

src/store.ts:
```ts
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: JSON.parse(localStorage.getItem('todos-react') || '[]'),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(t => (t.completed = action.payload));
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
  },
});

export const { addTodo, toggleTodo, editTodo, deleteTodo, toggleAll, clearCompleted } = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectActiveTodos = (state: RootState) => state.todos.todos.filter(t => !t.completed);
export const selectCompletedTodos = (state: RootState) => state.todos.todos.filter(t => t.completed);

export default todosSlice.reducer;
```

src/store.ts (continued):
```ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

src/main.tsx:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

src/App.tsx:
```tsx
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const filter = location.pathname.replace('/', '') || 'all';

  return (
    <section className="todoapp">
      <Header />
      <Main filter={filter} />
      <Footer filter={filter} />
    </section>
  );
}

export default App;
```

src/components/Header.tsx:
```tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store';

const Header = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) {
      dispatch(addTodo(text.trim()));
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
        onChange={e => setText(e.target.value)}
        onKeyUp={handleSubmit}
        autoFocus
      />
    </header>
  );
};

export default Header;
```

src/components/Main.tsx:
```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTodos, selectActiveTodos, selectCompletedTodos, toggleAll } from '../store';
import TodoList from './TodoList';

interface MainProps {
  filter: string;
}

const Main = ({ filter }: MainProps) => {
  const todos = useSelector(selectTodos);
  const activeTodos = useSelector(selectActiveTodos);
  const dispatch = useDispatch();

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return activeTodos;
      case 'completed':
        return useSelector(selectCompletedTodos);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  if (!todos.length) return null;

  return (
    <main className="main">
      <div className="toggle-all-container">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={!activeTodos.length}
          onChange={e => dispatch(toggleAll(e.target.checked))}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
      <TodoList todos={filteredTodos} />
    </main>
  );
};

export default Main;
```

src/components/TodoList.tsx:
```tsx
import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../store';

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
```

src/components/TodoItem.tsx:
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, deleteTodo } from '../store';
import { Todo } from '../store';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSubmit = () => {
    const title = editText.trim();
    if (title) {
      dispatch(editTodo({ id: todo.id, title }));
    } else {
      dispatch(deleteTodo(todo.id));
    }
    setEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(deleteTodo(todo.id))} />
      </div>
      {editing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyUp={handleKeyUp}
        />
      )}
    </li>
  );
};

export default TodoItem;
```

src/components/Footer.tsx:
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTodos, selectActiveTodos, clearCompleted } from '../store';

interface FooterProps {
  filter: string;
}

const Footer = ({ filter }: FooterProps) => {
  const todos = useSelector(selectTodos);
  const activeTodos = useSelector(selectActiveTodos);
  const dispatch = useDispatch();

  if (!todos.length) return null;

  const activeTodoWord = activeTodos.length === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodos.length}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/all" className={filter === 'all' ? 'selected' : ''}>
            All
          </Link>
        </li>
        <li>
          <Link to="/active" className={filter === 'active' ? 'selected' : ''}>
            Active
          </Link>
        </li>
        <li>
          <Link to="/completed" className={filter === 'completed' ? 'selected' : ''}>
            Completed
          </Link>
        </li>
      </ul>
      {todos.length > activeTodos.length && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
```

src/index.css:
```css
.toggle-all-container {
  position: relative;
  display: inline-block;
}

.toggle-all {
  position: absolute;
  opacity: 0;
  left: -42px;
  top: -64px;
  width: 40px;
  height: 40px;
}

.toggle-all + label {
  display: inline-block;
  width: 60px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  cursor: pointer;
  transform: rotate(90deg);
}

.toggle-all:checked + label:before {
  color: #737373;
}

#appIsReady {
  display: none;
}
```

### Tokens: {'input_tokens': 2423, 'output_tokens': 3663}
### Execution time: 74.24575996398926
