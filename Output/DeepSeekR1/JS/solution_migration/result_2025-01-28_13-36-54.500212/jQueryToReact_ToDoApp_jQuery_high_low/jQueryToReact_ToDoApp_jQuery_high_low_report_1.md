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
Okay, I need to convert this jQuery TodoMVC app to React 18 using Redux Toolkit, TypeScript, and other specified libraries. Let me start by understanding the original code structure.

First, the original app uses Handlebars for templates and jQuery for DOM manipulation. In React, components will replace the templates. The state management is handled by Redux Toolkit instead of the custom store in util.

Looking at the app.js, the App object manages todos, rendering, and event handling. I'll need to create Redux slices for the todos state. The actions will include adding, toggling, editing, deleting todos, clearing completed, and toggling all.

The components should be split into TodoItem, TodoList, Footer, etc. The main App component will handle the input for new todos and include the other components.

For routing, React Router can handle the filter (all, active, completed). The footer has links that change the URL hash, which in React Router can be managed with Routes and useParams or useLocation.

The util functions like uuid can be replaced with nanoid. The pluralize function can be a helper function in the utils folder.

The localStorage is handled in the original app's util.store. In Redux, I can use a middleware like redux-persist or manually sync the store with localStorage. Since the user didn't mention redux-persist, maybe I should create a custom middleware to save the todos to localStorage whenever the state changes.

Now, let's outline the steps:

1. Set up the Redux store with createSlice for todos and filter.
2. Create actions for all the operations (addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, toggleAll, setFilter).
3. Implement components: TodoItem for each todo, TodoList to display them, Footer for the count and filters, and NewTodo for the input.
4. Use React Router to handle the filter based on the URL.
5. Add localStorage persistence using a middleware or useEffect.
6. Convert Handlebars templates to JSX.
7. Replace jQuery event handlers with React event handlers and Redux dispatch.

Wait, the original code uses a Router with '#/' URLs. In React, using react-router-dom, I can set up a BrowserRouter with Routes. The filter can be a URL parameter.

Testing each part: The main App component will fetch todos from the Redux store, display the NewTodo input, TodoList, and Footer. The TodoList will filter todos based on the current filter from the Redux store.

For the toggle all checkbox, it should check if all todos are completed. The Redux slice will have a toggleAll action that sets each todo's completed status.

The edit functionality in React requires handling double-click to enter editing mode, which can be managed with component state in TodoItem.

I need to make sure all the original features are covered: adding, toggling, editing, deleting, filtering, clearing completed, and toggle all.

Now, let's start writing the code files.

First, the package.json dependencies. We'll need react, react-dom, react-redux, @reduxjs/toolkit, react-router-dom, nanoid, and types for them.

Then, the store setup with configureStore, combining the todos and filter reducers.

Components:

- TodoItem: Displays a todo, allows toggling, editing, and deleting.
- TodoList: Maps over todos and renders TodoItem components.
- Footer: Shows the count, filters, and clear completed button.
- NewTodo: Input field for adding new todos.

The Redux slice will handle all state changes. The middleware for localStorage will save the todos whenever the state changes.

In the main App component, use useEffect to dispatch an init action to load todos from localStorage on mount.

Testing each component's functionality against the original app's behavior. For example, when a user edits a todo by double-clicking, the TodoItem should switch to an input field, and on blur or enter, update the Redux state.

I need to make sure that all the event handlers from jQuery are translated to React's synthetic events and that state updates are handled through Redux actions.

Finally, ensure that the code is split into separate files, uses TypeScript interfaces, and follows best practices for React and Redux.
</think>

package.json:
```json
{
  "name": "todomvc-react",
  "version": "1.0.0",
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.18.0",
    "react-scripts": "5.0.1",
    "todomvc-app-css": "^2.4.0",
    "todomvc-common": "^1.0.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
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
```typescript
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from './types';

interface TodosState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = {
  items: JSON.parse(localStorage.getItem('todos-react') || '[]'),
  filter: 'all'
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false
          }
        };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.items.find(t => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    toggleAll(state) {
      const allCompleted = state.items.every(t => t.completed);
      state.items.forEach(t => (t.completed = !allCompleted));
    },
    clearCompleted(state) {
      state.items = state.items.filter(t => !t.completed);
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  toggleAll,
  clearCompleted,
  setFilter
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
```

src/types.ts:
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
```

src/index.tsx:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/:filter?" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

src/App.tsx:
```typescript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { Todo, FilterType } from './types';
import { setFilter } from './store';
import { RootState } from './store';

const App = () => {
  const dispatch = useDispatch();
  const { filter } = useParams<{ filter: FilterType }>();
  const location = useLocation();
  const todos = useSelector((state: RootState) => state.todos.items);

  useEffect(() => {
    const routeFilter = location.pathname.slice(1) as FilterType || 'all';
    dispatch(setFilter(routeFilter));
  }, [location, dispatch]);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTodo />
      </header>
      <TodoList todos={todos} />
      <Footer />
    </section>
  );
};

export default App;
```

src/components/NewTodo.tsx:
```typescript
import { useState, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store';

const NewTodo = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyUp={handleSubmit}
      autoFocus
    />
  );
};

export default NewTodo;
```

src/components/TodoList.tsx:
```typescript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import { RootState } from '../store';
import { FilterType } from '../types';

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  const filter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const allCompleted = todos.every(todo => todo.completed);

  if (!todos.length) return null;

  return (
    <>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={allCompleted}
          onChange={() => dispatch(toggleAll())}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
    </>
  );
};

export default TodoList;
```

src/components/TodoItem.tsx:
```typescript
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, deleteTodo } from '../store';
import { Todo } from '../types';

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
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
    } else {
      dispatch(deleteTodo(todo.id));
    }
    setEditing(false);
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
        <button
          className="destroy"
          onClick={() => dispatch(deleteTodo(todo.id))}
        />
      </div>
      <input
        ref={editInputRef}
        className="edit"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleSubmit}
        onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </li>
  );
};

export default TodoItem;
```

src/components/Footer.tsx:
```typescript
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../store';
import { FilterType } from '../types';

const Footer = () => {
  const todos = useSelector((state: RootState) => state.todos.items);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const location = useLocation();
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;

  if (!todos.length) return null;

  const pluralize = (count: number, word: string) =>
    count === 1 ? word : `${word}s`;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {pluralize(activeCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/all"
            className={filter === 'all' ? 'selected' : ''}
          >
            All
          </Link>
        </li>
        <li>
          <Link
            to="/active"
            className={filter === 'active' ? 'selected' : ''}
          >
            Active
          </Link>
        </li>
        <li>
          <Link
            to="/completed"
            className={filter === 'completed' ? 'selected' : ''}
          >
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(clearCompleted())}
        >
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
@import 'todomvc-common/base.css';
@import 'todomvc-app-css/index.css';

#root {
  display: flex;
  justify-content: center;
}

.todoapp {
  width: 550px;
  margin: 40px 0;
}
```

src/store.d.ts:
```typescript
import { store } from './store';
import { Todo, FilterType } from './types';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Tokens: {'input_tokens': 2423, 'output_tokens': 3468}
### Execution time: 168.97398400306702
