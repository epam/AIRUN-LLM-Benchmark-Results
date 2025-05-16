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
Okay, I will migrate the jQuery TodoMVC application to React 18.x using Create React App, TypeScript, Redux Toolkit, and `nanoid`.

Here's the plan:

1.  **Set up the project:** Create a new React app with TypeScript.
2.  **Install dependencies:** `reduxjs/toolkit`, `react-redux`, `nanoid`.
3.  **Organize CSS:** Copy the provided CSS files and import them globally.
4.  **Define Types:** Create TypeScript interfaces for `Todo` and `FilterStatus`.
5.  **LocalStorage Service:** Implement functions to load and save todos from/to localStorage.
6.  **Redux Store & Slice:**
    *   Configure the Redux store.
    *   Create a `todosSlice` with reducers for all todo operations (add, toggle, delete, update, toggleAll, clearCompleted) and filter management.
    *   Implement selectors to derive data from the state.
7.  **Create Components:**
    *   `App`: Main component, handles layout, routing, and the "appIsReady" notification.
    *   `Header`: Input for new todos.
    *   `TodoList`: Renders the list of todos.
    *   `TodoItem`: Represents a single todo item with editing, toggling, and deletion capabilities.
    *   `Footer`: Displays todo count, filter links, and "Clear completed" button.
8.  **Implement Routing:** Use a `useEffect` hook in `App.tsx` to listen to `hashchange` events and update the filter state in Redux.
9.  **Utility Functions:** Migrate `pluralize`.
10. **Event Handling & Logic:** Replicate all event handlers and application logic from the original jQuery app using React and Redux.

Let's generate the code files.

**1. Project Setup (Manual Steps):**

First, you would create a new React application:
```bash
npx create-react-app todomvc-react --template typescript
cd todomvc-react
```

Then, install the necessary dependencies:
```bash
npm install @reduxjs/toolkit react-redux nanoid
npm install -D @types/react-redux
# The original app uses director for routing, we'll handle hash routing manually or with a lightweight approach.
```

**2. CSS Files:**

Create the following directory structure and copy the CSS files:
`src/styles/app.css` (from original `src/app.css`)
`src/styles/base.css` (from original `node_modules/todomvc-common/base.css`)
`src/styles/index.css` (from original `node_modules/todomvc-app-css/index.css`)

Create `src/styles/global.css`:
```css
/* src/styles/global.css */
@import './base.css';
@import './index.css';
@import './app.css';
```

**3. Code Files:**

Here are the TypeScript and React component files:

**`public/index.html` (Update title and meta if needed, CRA handles the rest)**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="TodoMVC app created with React"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>TodoMVC: React</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      The original app had an info footer here. We'll render it within the React app.
      The script templates (todo-template, footer-template) are no longer needed.
      jQuery, Handlebars, Director are no longer needed.
    -->
  </body>
</html>
```

**`src/index.tsx`**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './styles/global.css'; // Import global styles

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

**`src/App.tsx`**
```typescript
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { selectTodos, setFilter, FilterStatus } from './features/todos/todosSlice';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'all';
      dispatch(setFilter(hash as FilterStatus));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial filter set

    // Notify app is ready (for compatibility with potential test environments)
    const appIsReadyDiv = document.createElement('div');
    appIsReadyDiv.id = 'appIsReady';
    document.body.appendChild(appIsReadyDiv);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (document.body.contains(appIsReadyDiv)) {
        document.body.removeChild(appIsReadyDiv);
      }
    };
  }, [dispatch]);

  return (
    <>
      <section className="todoapp">
        <Header />
        {todos.length > 0 && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        <p>Updated by the TodoMVC Team</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  );
};

export default App;
```

**`src/features/todos/types.ts`**
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
```

**`src/services/localStorage.ts`**
```typescript
import { Todo } from '../features/todos/types';

const TODOS_STORAGE_KEY = 'todos-react';

export const loadState = (): Todo[] | undefined => {
  try {
    const serializedState = localStorage.getItem(TODOS_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as Todo[];
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

export const saveState = (state: Todo[]): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(TODOS_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};
```

**`src/features/todos/todosSlice.ts`**
```typescript
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Todo, FilterStatus } from './types';
import { loadState, saveState } from '../../services/localStorage';

interface TodosState {
  todos: Todo[];
  filter: FilterStatus;
}

const initialState: TodosState = {
  todos: loadState() || [],
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  toggleAllTodos,
  clearCompletedTodos,
  setFilter,
} = todosSlice.actions;

// Selectors
export const selectTodos = (state: RootState): Todo[] => state.todos.todos;
export const selectFilter = (state: RootState): FilterStatus => state.todos.filter;

export const selectActiveTodos = (state: RootState): Todo[] =>
  state.todos.todos.filter(todo => !todo.completed);

export const selectCompletedTodos = (state: RootState): Todo[] =>
  state.todos.todos.filter(todo => todo.completed);

export const selectFilteredTodos = (state: RootState): Todo[] => {
  const todos = selectTodos(state);
  const filter = selectFilter(state);
  if (filter === 'active') {
    return todos.filter(todo => !todo.completed);
  }
  if (filter === 'completed') {
    return todos.filter(todo => todo.completed);
  }
  return todos;
};

export const selectActiveTodoCount = (state: RootState): number =>
  selectActiveTodos(state).length;

export const selectCompletedTodoCount = (state: RootState): number =>
  selectCompletedTodos(state).length;

export const selectAllTodosCompleted = (state: RootState): boolean =>
  state.todos.todos.length > 0 && state.todos.todos.every(todo => todo.completed);

export default todosSlice.reducer;
```

**`src/store/index.ts`**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { selectTodos } from '../features/todos/todosSlice';
import { saveState } from '../services/localStorage';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

store.subscribe(() => {
  saveState(selectTodos(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**`src/hooks/useAppDispatch.ts`**
```typescript
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
```

**`src/hooks/useAppSelector.ts`** (This is a common pattern, but CRA with Redux template provides `useAppSelector` directly. If not, you'd create it)
```typescript
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**`src/utils/constants.ts`**
```typescript
export const ENTER_KEY = 'Enter';
export const ESCAPE_KEY = 'Escape';
```

**`src/utils/pluralize.ts`**
```typescript
export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};
```

**`src/components/Header.tsx`**
```typescript
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addTodo } from '../features/todos/todosSlice';
import { ENTER_KEY } from '../utils/constants';

const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ENTER_KEY) {
      const title = newTodo.trim();
      if (title) {
        dispatch(addTodo(title));
        setNewTodo('');
      }
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={handleNewTodoChange}
        onKeyDown={handleNewTodoKeyDown}
        autoFocus
      />
    </header>
  );
};

export default Header;
```

**`src/components/TodoList.tsx`**
```typescript
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  selectFilteredTodos,
  toggleAllTodos,
  selectAllTodosCompleted,
  selectTodos,
} from '../features/todos/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const allCompleted = useAppSelector(selectAllTodosCompleted);
  const todos = useAppSelector(selectTodos); // To check if there are any todos

  const handleToggleAll = () => {
    dispatch(toggleAllTodos(!allCompleted));
  };

  if (todos.length === 0) {
    return null; // Don't render main section if no todos
  }

  return (
    <main className="main">
      <div className="toggle-all-container">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={allCompleted}
          onChange={handleToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </main>
  );
};

export default TodoList;
```

**`src/components/TodoItem.tsx`**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleTodo, deleteTodo, updateTodo } from '../features/todos/todosSlice';
import { Todo } from '../features/todos/types';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useAppDispatch();
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(todo.title); // Reset editText to current title on edit start
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.key === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const newTitle = editText.trim();
    if (newTitle) {
      if (newTitle !== todo.title) {
        dispatch(updateTodo({ id: todo.id, title: newTitle }));
      }
      setEditing(false);
    } else {
      handleDelete(); // Delete if title is empty
    }
  };

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      // Move cursor to end of input
      const len = editFieldRef.current.value.length;
      editFieldRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  let liClassName = '';
  if (todo.completed) {
    liClassName += 'completed';
  }
  if (editing) {
    liClassName += ' editing';
  }

  return (
    <li className={liClassName.trim()} data-id={todo.id}>
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
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit} // Save on blur
        />
      )}
    </li>
  );
};

export default TodoItem;
```

**`src/components/Footer.tsx`**
```typescript
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  selectActiveTodoCount,
  selectCompletedTodoCount,
  selectFilter,
  clearCompletedTodos,
  FilterStatus,
  selectTodos,
} from '../features/todos/todosSlice';
import { pluralize } from '../utils/pluralize';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTodoCount = useAppSelector(selectActiveTodoCount);
  const completedTodoCount = useAppSelector(selectCompletedTodoCount);
  const currentFilter = useAppSelector(selectFilter);
  const totalTodos = useAppSelector(selectTodos).length;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  if (totalTodos === 0) {
    return null; // Don't render footer if no todos
  }

  const itemWord = pluralize(activeTodoCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {(['all', 'active', 'completed'] as FilterStatus[]).map(filter => (
          <li key={filter}>
            <a
              href={`#/${filter}`}
              className={currentFilter === filter ? 'selected' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </a>
          </li>
        ))}
      </ul>
      {completedTodoCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
```

**4. Final Steps:**

*   Ensure all CSS files (`base.css`, `index.css`, `app.css`) are correctly placed in `src/styles/` and imported via `src/styles/global.css` in `src/index.tsx`.
*   Run `npm start` to test the application.

This migration covers all the requirements: React 18, TypeScript, Redux Toolkit, `nanoid`, component-based architecture, state management, routing via hash changes, event handling, keyboard shortcuts, and localStorage persistence. The visual appearance and user experience should be identical to the original jQuery version. The code is split into components and follows React best practices with functional components and hooks.

### Tokens: {'input_tokens': 2959, 'output_tokens': 5114}
### Execution time: 93.77076292037964
