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
Okay, let's migrate the jQuery TodoMVC application to React 18 using Redux Toolkit, TypeScript, and Create React App.

We will break down the original application's structure and logic and translate it into React components, Redux state management, and React Router for routing.

**Migration Steps:**

1.  **Set up the Project:** Create a new Create React App project with the TypeScript template.
2.  **Install Dependencies:** Add Redux Toolkit, React Redux, React Router DOM, and nanoid.
3.  **Copy CSS:** Transfer the original `app.css` and include the TodoMVC base CSS files.
4.  **Define Types:** Create TypeScript interfaces for the Todo structure and Redux state.
5.  **Set up Redux Store:** Configure the Redux store using Redux Toolkit.
6.  **Create Redux Slice:** Implement a Redux slice for managing the todo list and filter state.
7.  **Implement Local Storage:** Add logic to load/save state from/to local storage.
8.  **Set up Routing:** Configure React Router to handle the filter routes (`/`, `/active`, `/completed`).
9.  **Create Components:** Build React functional components for different parts of the UI (App, TodoApp, Header, Main, TodoList, TodoItem, Footer, Info).
10. **Connect Components to Redux:** Use `useSelector` and `useDispatch` hooks to interact with the Redux store.
11. **Implement Component Logic:** Translate the jQuery event handlers and DOM manipulation logic into React component state, props, and event handlers.
12. **Refine and Test:** Ensure all functionalities match the original application.

Let's start building.

**1. Project Setup (using `npx create-react-app`):**

```bash
npx create-react-app my-react-todomvc --template typescript
cd my-react-todomvc
```

**2. Install Dependencies:**

```bash
npm install @reduxjs/toolkit react-redux react-router-dom nanoid
# Or using yarn:
# yarn add @reduxjs/toolkit react-redux react-router-dom nanoid
```

**3. Copy CSS:**

*   Create a `src/app.css` file and copy the content from the original `src/app.css`.
*   You'll need to get the `todomvc-common/base.css` and `todomvc-app-css/index.css` files. The easiest way is often to install the `todomvc-common` and `todomvc-app-css` packages and reference them from `node_modules` or copy them into your `src` directory. For simplicity in this example, let's assume you copy them into `src/styles/`.

```bash
mkdir src/styles
# Copy base.css and index.css into src/styles/
```

**4. Define Types:**

Create a file `src/types/index.ts`:

```typescript
// src/types/index.ts

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodosState {
  todos: Todo[];
  filter: TodoFilter;
}
```

**5. Set up Redux Store:**

Create a file `src/redux/store.ts`:

```typescript
// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {todos: TodosState}
export type AppDispatch = typeof store.dispatch;
```

**6. Create Redux Slice:**

Create a file `src/redux/todosSlice.ts`:

```typescript
// src/redux/todosSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodosState, TodoFilter } from '../types';
import { loadState, saveState } from '../utils/localStorage';

// Load initial state from local storage, default to empty if not found
const initialState: TodosState = loadState() || {
  todos: [],
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload.trim(),
        completed: false,
      };
      state.todos.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    // Action to load state from local storage (used on app initialization)
    loadTodos: (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
    }
  },
});

export const {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  clearCompleted,
  toggleAll,
  setFilter,
  loadTodos,
} = todosSlice.actions;

export default todosSlice.reducer;
```

**7. Implement Local Storage:**

Create a file `src/utils/localStorage.ts`:

```typescript
// src/utils/localStorage.ts

import { TodosState } from '../types';

const STORAGE_KEY = 'todos-react-redux-typescript';

export const loadState = (): TodosState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    // Only load the 'todos' part, filter is handled by routing
    const loadedState = JSON.parse(serializedState);
    // Ensure loaded state has the expected structure, especially the todos array
    if (loadedState && Array.isArray(loadedState.todos)) {
         // We only load the todos array, the filter is determined by the route
        return {
            todos: loadedState.todos,
            filter: 'all' // Default filter on load, will be updated by router
        };
    }
    return undefined;
  } catch (err) {
    console.error("Could not load state from local storage", err);
    return undefined;
  }
};

export const saveState = (state: TodosState) => {
  try {
    // Only save the 'todos' array, filter is transient based on route
    const stateToSave = { todos: state.todos };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to local storage", err);
  }
};
```

Modify `src/index.tsx` to load state and save state on store changes:

```typescript
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './redux/store';
import { saveState } from './utils/localStorage';
import { loadTodos } from './redux/todosSlice'; // Import the loadTodos action

// Import CSS files
import './styles/base.css';
import './styles/index.css';
import './app.css';

// Load state from local storage on app start
const loadedState = localStorage.getItem('todos-react-redux-typescript');
if (loadedState) {
    try {
        const parsedState = JSON.parse(loadedState);
        if (parsedState && Array.isArray(parsedState.todos)) {
             store.dispatch(loadTodos(parsedState.todos));
        }
    } catch (e) {
        console.error("Failed to parse state from local storage", e);
    }
}


// Subscribe to store changes to save state
store.subscribe(() => {
  // We only need to save the todos array, filter is not persistent
  saveState({ todos: store.getState().todos.todos, filter: store.getState().todos.filter });
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
```

**8. Set up Routing:**

Modify `src/App.tsx` to handle routing and set the filter based on the URL.

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from './redux/todosSlice';
import { TodoFilter } from './types';

import TodoApp from './components/TodoApp';
import Info from './components/Info';

// Component to handle filter logic based on route params
const FilterHandler: React.FC = () => {
  const { filter: filterParam } = useParams<{ filter: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    const validFilters: TodoFilter[] = ['all', 'active', 'completed'];
    const currentFilter: TodoFilter = validFilters.includes(filterParam as TodoFilter)
      ? (filterParam as TodoFilter)
      : 'all'; // Default to 'all' if invalid filter in URL

    dispatch(setFilter(currentFilter));
  }, [filterParam, dispatch]);

  return <TodoApp />;
};

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Redirect root to /all */}
        <Route path="/" element={<Navigate to="/all" replace />} />
        {/* Handle filter routes */}
        <Route path="/:filter" element={<FilterHandler />} />
        {/* Fallback for unknown routes (optional, could be a 404 or redirect) */}
        <Route path="*" element={<Navigate to="/all" replace />} />
      </Routes>
      <Info />
    </>
  );
};

export default App;
```

**9. Create Components:**

Create a `src/components` directory and the following files:

*   `src/components/TodoApp.tsx`
*   `src/components/Header.tsx`
*   `src/components/Main.tsx`
*   `src/components/TodoList.tsx`
*   `src/components/TodoItem.tsx`
*   `src/components/Footer.tsx`
*   `src/components/Info.tsx`

**`src/components/TodoApp.tsx`:**

```typescript
// src/components/TodoApp.tsx

import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <Header />
      <Main />
      <Footer />
    </section>
  );
};

export default TodoApp;
```

**`src/components/Header.tsx`:**

```typescript
// src/components/Header.tsx

import React, { useState, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todosSlice';

const Header: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const dispatch = useDispatch();

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleNewTodoKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const title = newTodoTitle.trim();
      if (title) {
        dispatch(addTodo(title));
        setNewTodoTitle(''); // Clear input after adding
      }
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={newTodoTitle}
        onChange={handleNewTodoChange}
        onKeyDown={handleNewTodoKeyDown}
      />
    </header>
  );
};

export default Header;
```

**`src/components/Main.tsx`:**

```typescript
// src/components/Main.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleAll } from '../redux/todosSlice';
import TodoList from './TodoList';

const Main: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const dispatch = useDispatch();

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  // Hide main section if no todos
  if (todos.length === 0) {
    return null;
  }

  return (
    <main className="main">
      <div className="toggle-all-container">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={activeTodoCount === 0}
          onChange={handleToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
      <TodoList />
    </main>
  );
};

export default Main;
```

**`src/components/TodoList.tsx`:**

```typescript
// src/components/TodoList.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TodoItem from './TodoItem';
import { Todo } from '../types';

// Selector to get filtered todos
const selectFilteredTodos = (state: RootState): Todo[] => {
  const { todos, filter } = state.todos;
  if (filter === 'active') {
    return todos.filter(todo => !todo.completed);
  }
  if (filter === 'completed') {
    return todos.filter(todo => todo.completed);
  }
  return todos; // 'all' filter
};

const TodoList: React.FC = () => {
  const filteredTodos = useSelector(selectFilteredTodos);

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
```

**`src/components/TodoItem.tsx`:**

```typescript
// src/components/TodoItem.tsx

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, deleteTodo, editTodo } from '../redux/todosSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  // Effect to focus the input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Set cursor to the end
      editInputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText.length]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleDoubleClickLabel = () => {
    setIsEditing(true);
    setEditText(todo.title); // Reset edit text to current title
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleSubmitEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
      setIsEditing(false);
    } else {
      // If trimmed text is empty, destroy the todo
      dispatch(deleteTodo(todo.id));
      setIsEditing(false); // Ensure editing state is false after deletion
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.title); // Revert to original title
    setIsEditing(false);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitEdit();
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClickLabel}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={handleEditChange}
          onBlur={handleSubmitEdit} // Submit on blur
          onKeyDown={handleEditKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;
```

**`src/components/Footer.tsx`:**

```typescript
// src/components/Footer.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCompleted } from '../redux/todosSlice';
import { NavLink } from 'react-router-dom';
import { TodoFilter } from '../types';

// Helper function for pluralization
const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

const Footer: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const currentFilter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  // Hide footer if no todos
  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to="/all"
            className={({ isActive }) => (isActive || currentFilter === 'all' ? 'selected' : '')}
          >
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/active"
             className={({ isActive }) => (isActive || currentFilter === 'active' ? 'selected' : '')}
          >
            Active
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/completed"
             className={({ isActive }) => (isActive || currentFilter === 'completed' ? 'selected' : '')}
          >
            Completed
          </NavLink>
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

export default Footer;
```

**`src/components/Info.tsx`:**

```typescript
// src/components/Info.tsx

import React from 'react';

const Info: React.FC = () => {
  return (
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Created by <a href="http://sindresorhus.com">Sindre Sorhus</a>
      </p>
      <p>Updated by the TodoMVC Team</p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  );
};

export default Info;
```

**10. Update `src/app.css` (if needed):**

Ensure your `src/app.css` is correctly placed and imported. The original `app.css` seems to contain only comments, so you might need to add any custom styles there if the original example had them. For a standard TodoMVC, the `base.css` and `index.css` provide most of the styling.

**11. Final Checks:**

*   Ensure all files are saved in the correct locations.
*   Run `npm start` or `yarn start` to build and run the application.
*   Test all functionalities: adding, toggling, editing (double-click, Enter, Escape, blur), deleting, clearing completed, toggling all, and filtering (using the links and refreshing the page to check persistence).
*   Verify the appearance matches the original.

**Summary of Changes and How Requirements Were Met:**

*   **React 18:** Used functional components and hooks (`useState`, `useEffect`, `useRef`, `useSelector`, `useDispatch`, `useParams`).
*   **Create React App:** Project initialized with CRA.
*   **TypeScript:** All components, hooks, state, and actions are typed. Interfaces are defined.
*   **Redux Toolkit:** Used `configureStore` and `createSlice` for state management. Reducers and actions are defined within the slice.
*   **nanoid:** Used for generating unique IDs for new todos.
*   **Project Structure:** Code is split into logical components and organized into `components`, `redux`, `types`, and `utils` directories.
*   **State Management:** Redux store manages the `todos` array and the `filter` state. `useSelector` reads state, `useDispatch` dispatches actions.
*   **Routing:** `react-router-dom` is used for client-side routing (`/all`, `/active`, `/completed`). The `FilterHandler` component reads the route parameter and updates the Redux filter state.
*   **Event Handlers:** jQuery event handlers are replaced with React's synthetic events (`onChange`, `onClick`, `onDoubleClick`, `onKeyDown`, `onBlur`).
*   **Form Handling:** Input values are controlled by React state (`useState`).
*   **Keyboard Shortcuts:** Enter and Escape keys are handled in the `TodoItem` component for editing.
*   **Local Storage:** Implemented `loadState` and `saveState` utilities and integrated them with the Redux store subscription to persist the `todos` array.
*   **Code Quality:** Used functional components and hooks, followed standard React/Redux patterns, added TypeScript types, removed jQuery/Handlebars dependencies. Error handling for local storage is included. The `dummyNodeToNotifyAppIsReady` is removed as it's not relevant to the React structure.

This migration provides a robust, type-safe, and maintainable React application based on the original jQuery TodoMVC example.

### Tokens: {'input_tokens': 2959, 'output_tokens': 5838}
### Execution time: 42.735934019088745
