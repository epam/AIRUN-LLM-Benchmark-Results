I have the following application code that needs to migrate:

<source_code>
```html
// index.html
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

```js
// app.js
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

</source_code>

Please follow these steps:

1. Migrate the provided jQuery application to React 18:
   - Convert the jQuery-based implementation to React 18.x
   - Maintain all existing functionality and behavior
   - Preserve the same visual appearance and user experience

2. Use the following technology stack:
   - Create React App as the project foundation
   - TypeScript for type safety
   - Redux Toolkit with createSlice for state management
   - nanoid for generating unique IDs

3. Project structure and architecture:
   - Split the application into separate components following React best practices
   - Implement proper component hierarchy and composition
   - Create appropriate TypeScript interfaces/types for all data structures
   - Organize code into feature-based or domain-based modules

4. State management implementation:
   - Configure Redux store properly
   - Set up Redux provider in the application entry point
   - Create appropriate slices using Redux Toolkit's createSlice
   - Implement all required reducers, actions, and selectors

5. Technical requirements:
   - Maintain the same routing functionality
   - Preserve all event handlers and their behaviors
   - Implement proper form handling and validation
   - Ensure all keyboard shortcuts work as in the original application
   - Maintain local storage persistence if present in the original code

6. Code quality:
   - Optimize the code where possible
   - Follow React best practices and patterns
   - Ensure the code is production-ready with no TODOs
   - Use functional components with hooks instead of class components
   - Implement proper error handling

## Run 1:
### Answer:
Below is one complete solution that shows how you might reorganize this jQuery TodoMVC app into a React 18 application written in TypeScript. In our example we use Create React App (with the TypeScript template), Redux Toolkit (including createSlice) for state management, and nanoid for unique IDs. We also use react‐router‑dom (using HashRouter to preserve URL hash–based routing like in the original) so that the filter (all/active/completed) is taken from the URL.

Below is one sample project structure and code:

──────────────────────────────
Project structure (under src):

• index.tsx
• App.tsx
• store.ts
• features/
  └ todos/
    ├ todosSlice.ts
• components/
  ├ TodoApp.tsx
  ├ TodoInput.tsx
  ├ TodoList.tsx
  ├ TodoItem.tsx
  └ TodoFooter.tsx
• types/
  └ Todo.ts

You can keep your existing CSS (for example, in App.css) so that the look and feel remains unchanged.
──────────────────────────────

Below are the source files:

──────────────────────────────
1. src/types/Todo.ts
──────────────────────────────
 
// src/types/Todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

──────────────────────────────
2. src/features/todos/todosSlice.ts
──────────────────────────────

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types/Todo';
import { nanoid } from 'nanoid';

interface TodosState {
  todos: Todo[];
}

const localStorageKey = 'todos-react';

// helper functions for persistence
function loadTodos(): Todo[] {
  const todos = localStorage.getItem(localStorageKey);
  return todos ? JSON.parse(todos) : [];
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
}

const initialState: TodosState = {
  todos: loadTodos()
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        saveTodos(state.todos);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.title = title;
        saveTodos(state.todos);
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      saveTodos(state.todos);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
      saveTodos(state.todos);
    }
  }
});

export const { addTodo, toggleTodo, editTodo, deleteTodo, toggleAll, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;

──────────────────────────────
3. src/store.ts
──────────────────────────────

import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer
  }
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

──────────────────────────────
4. src/index.tsx
──────────────────────────────

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

──────────────────────────────
5. src/App.tsx
──────────────────────────────

import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import TodoApp from './components/TodoApp';

const FilterWrapper: React.FC = () => {
  // extract filter from params; default to 'all'
  const { filter } = useParams<{ filter: string }>();
  // We check to see if filter is valid otherwise default to 'all'
  const validFilters = ['all', 'active', 'completed'];
  const currentFilter = filter && validFilters.includes(filter) ? filter : 'all';
  return <TodoApp filter={currentFilter} />;
};

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/all" replace />} />
        <Route path="/:filter" element={<FilterWrapper />} />
      </Routes>
    </div>
  );
};

export default App;

──────────────────────────────
6. src/components/TodoApp.tsx
──────────────────────────────

import React from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

interface TodoAppProps {
  filter: 'all' | 'active' | 'completed';
}

const TodoApp: React.FC<TodoAppProps> = ({ filter }) => {
  return (
    <section id="todoapp" className="todoapp">
      <header id="header" className="header">
        <h1>todos</h1>
        <TodoInput />
      </header>
      <main id="main" className="main">
        <TodoList filter={filter} />
      </main>
      <footer id="footer" className="footer">
        <TodoFooter filter={filter} />
      </footer>
      <footer id="info" className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        <p>Updated by the TodoMVC Team</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </section>
  );
};

export default TodoApp;

──────────────────────────────
7. src/components/TodoInput.tsx
──────────────────────────────

import React, { useState, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todos/todosSlice';
import { AppDispatch } from '../store';

const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      dispatch(addTodo(title.trim()));
      setTitle('');
    }
  };

  return (
    <input
      id="new-todo"
      className="new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyUp={handleKeyUp}
      autoFocus
    />
  );
};

export default TodoInput;

──────────────────────────────
8. src/components/TodoList.tsx
──────────────────────────────

import React, { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleAll } from '../features/todos/todosSlice';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  filter: 'all' | 'active' | 'completed';
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch<AppDispatch>();

  const getFilteredTodos = (): Todo[] => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleToggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  const filteredTodos = getFilteredTodos();

  return (
    <>
      {todos.length > 0 && (
        <div className="toggle-all-container">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={activeTodosCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
        </div>
      )}
      <ul id="todo-list" className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
};

export default TodoList;

──────────────────────────────
9. src/components/TodoItem.tsx
──────────────────────────────

import React, { useState, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, deleteTodo } from '../features/todos/todosSlice';
import { Todo } from '../types/Todo';
import { AppDispatch } from '../store';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    finishEditing();
  };

  const finishEditing = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      dispatch(deleteTodo(todo.id));
    } else {
      if (trimmed !== todo.title) {
        dispatch(editTodo({ id: todo.id, title: trimmed }));
      }
    }
    setEditing(false);
  };

  const cancelEditing = () => {
    setDraftTitle(todo.title);
    setEditing(false);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`} data-id={todo.id}>
      {editing ? (
        <input
          className="edit"
          autoFocus
          value={draftTitle}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
          />
          <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
          <button className="destroy" onClick={handleDelete}></button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;

──────────────────────────────
10. src/components/TodoFooter.tsx
──────────────────────────────

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { clearCompleted } from '../features/todos/todosSlice';
import { Link } from 'react-router-dom';

interface TodoFooterProps {
  filter: 'all' | 'active' | 'completed';
}

const TodoFooter: React.FC<TodoFooterProps> = ({ filter }) => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const dispatch = useDispatch<AppDispatch>();

  const pluralize = (count: number, word: string) => (count === 1 ? word : `${word}s`);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span id="todo-count" className="todo-count">
        <strong>{activeCount}</strong> {pluralize(activeCount, 'item')} left
      </span>
      <ul id="filters" className="filters">
        <li>
          <Link className={filter === 'all' ? 'selected' : ''} to="/all">
            All
          </Link>
        </li>
        <li>
          <Link className={filter === 'active' ? 'selected' : ''} to="/active">
            Active
          </Link>
        </li>
        <li>
          <Link className={filter === 'completed' ? 'selected' : ''} to="/completed">
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
};

export default TodoFooter;

──────────────────────────────
Comments & Explanation:
──────────────────────────────
• We use a Redux slice (todosSlice.ts) to manage all actions (adding, deleting, toggling, editing, toggling all, clearing completed). Persistence in localStorage is implemented in helper functions inside the slice.
• The unique IDs are generated with nanoid.
• In App.tsx we use HashRouter so that the routing (/#/all, /#/active, etc.) remains similar to the original.
• The TodoApp component composes TodoInput, TodoList, and TodoFooter into a layout that mimics the existing HTML structure.
• The TodoItem component is a functional component with internal editing state. It handles double-click “edit mode,” keyboard (Enter/ESC) events, and losing focus.
• All components use React hooks (useState, useDispatch, useSelector) and TypeScript interfaces to provide type safety.
• CSS files (e.g. base.css and index.css as referenced in the original HTML) can be imported in index.css or App.css so that the visual appearance stays the same.

This solution meets all the requirements while preserving the original functionality and user experience. You can now run this app (after creating it with Create React App) and it will behave similarly to the original jQuery version but with modern React 18, TypeScript, and Redux Toolkit.

### Tokens: {'input_tokens': 2554, 'output_tokens': 4268, 'reasoning_tokens': 832}
### Execution time: 35.6088650226593
