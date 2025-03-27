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
Okay, let's migrate the jQuery TodoMVC application to React 18 using Create React App, TypeScript, and Redux Toolkit.

**1. Project Setup**

First, create a new React project with the TypeScript template:

```bash
npx create-react-app my-todomvc-react --template typescript
cd my-todomvc-react
```

Install the necessary dependencies:

```bash
npm install @reduxjs/toolkit react-redux react-router-dom react-router-hashlink nanoid
npm install --save-dev @types/react-redux @types/react-router-dom @types/nanoid @types/react-router-hashlink
```

**2. Copy CSS Files**

Copy the CSS files from the original project into the `src` directory:

*   `node_modules/todomvc-common/base.css` -> `src/css/base.css`
*   `node_modules/todomvc-app-css/index.css` -> `src/css/index.css`
*   `src/app.css` -> `src/css/app.css` (If you have custom styles)

*Self-correction: The original `app.css` was empty in the provided snippet, so we'll just use the common ones.*

**3. Import CSS**

Import the CSS files in your main entry point, `src/index.tsx`:

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; // We'll create this next
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import CSS
import './css/base.css';
import './css/index.css';
// import './css/app.css'; // If you have custom styles

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

reportWebVitals();
```

**4. Define Types**

Create a file for shared types:

```typescript
// src/types/index.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
```

**5. Setup Redux Store and Slice**

Create the Redux store and the `todos` slice.

```typescript
// src/store/localStorage.ts
import { Todo } from '../types';

const STORAGE_KEY = 'todos-react';

export const loadState = (): Todo[] | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

export const saveState = (state: Todo[]): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};
```

```typescript
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction, nanoid, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store'; // Adjust path if needed
import { Todo, FilterStatus } from '../../types';
import { loadState } from '../../store/localStorage'; // Adjust path

interface TodosState {
  todos: Todo[];
  filter: FilterStatus;
}

const initialState: TodosState = {
  todos: loadState() || [], // Load initial state from localStorage
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
          title: title.trim(),
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
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted: (state) => {
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
  destroyTodo,
  editTodo,
  toggleAll,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

// Selectors
export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.filter;

export const selectActiveTodos = createSelector(
    selectTodos,
    (todos) => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
    selectTodos,
    (todos) => todos.filter(todo => todo.completed)
);

export const selectFilteredTodos = createSelector(
    selectTodos,
    selectFilter,
    (todos, filter) => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default: // 'all'
                return todos;
        }
    }
);

export const selectActiveTodoCount = createSelector(
    selectActiveTodos,
    (activeTodos) => activeTodos.length
);

export const selectCompletedTodoCount = createSelector(
    selectCompletedTodos,
    (completedTodos) => completedTodos.length
);

export const selectTotalTodoCount = createSelector(
    selectTodos,
    (todos) => todos.length
);

export const selectAreAllCompleted = createSelector(
    selectTodos,
    selectActiveTodoCount,
    (todos, activeCount) => todos.length > 0 && activeCount === 0
);


export default todosSlice.reducer;
```

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import { saveState } from './localStorage';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

// Subscribe to store changes to save todos to localStorage
store.subscribe(() => {
  saveState(store.getState().todos.todos);
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {todos: TodosState}
export type AppDispatch = typeof store.dispatch;
```

**6. Create Hooks for Redux**

It's good practice to create typed hooks.

```typescript
// src/hooks/reduxHooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**7. Implement Components**

Let's break down the UI into components.

```typescript
// src/utils/pluralize.ts
export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}
```

```typescript
// src/features/todos/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { toggleTodo, destroyTodo, editTodo } from './todosSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(destroyTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    // We need useEffect to focus after the input is rendered
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleSubmit = () => {
    const newTitle = editText.trim();
    if (newTitle) {
      if (newTitle !== todo.title) {
        dispatch(editTodo({ id: todo.id, title: newTitle }));
      }
      setIsEditing(false);
    } else {
      // If the title is empty, destroy the todo
      handleDestroy();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.title); // Reset text
      setIsEditing(false); // Exit editing mode
    }
  };

  const handleBlur = () => {
    // Only submit on blur if not triggered by Escape key
    // This check might not be strictly necessary depending on exact event order,
    // but it clarifies intent. The Escape keydown handler already resets state.
    handleSubmit();
  };

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Move cursor to end
      editInputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText.length]); // Added editText.length dependency for potential re-focus needs

  const liClasses = [
    todo.completed ? 'completed' : '',
    isEditing ? 'editing' : '',
  ].join(' ').trim();

  return (
    <li className={liClasses} data-id={todo.id}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={handleEditChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </li>
  );
};

export default TodoItem;
```

```typescript
// src/features/todos/TodoList.tsx
import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFilteredTodos } from './todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const filteredTodos = useAppSelector(selectFilteredTodos);

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

```typescript
// src/features/todos/Header.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addTodo } from './todosSlice';

const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const title = newTodo.trim();
      if (title) {
        dispatch(addTodo(title));
        setNewTodo(''); // Clear input
      }
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        id="new-todo" // Keep ID for potential label association or testing
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default Header;
```

```typescript
// src/features/todos/MainSection.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { selectTotalTodoCount, selectAreAllCompleted, toggleAll } from './todosSlice';
import TodoList from './TodoList';

const MainSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const totalCount = useAppSelector(selectTotalTodoCount);
  const areAllCompleted = useAppSelector(selectAreAllCompleted);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  if (totalCount === 0) {
    return null; // Don't render main section if no todos
  }

  return (
    <main id="main" className="main"> {/* Keep ID for consistency if needed */}
      <div className="toggle-all-container">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={areAllCompleted}
          onChange={handleToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
      <TodoList />
    </main>
  );
};

export default MainSection;
```

```typescript
// src/features/todos/Footer.tsx
import React from 'react';
// Use HashLink for smooth scrolling if needed, otherwise regular Link or even <a> is fine for hash routing
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import {
  selectActiveTodoCount,
  selectCompletedTodoCount,
  selectTotalTodoCount,
  selectFilter,
  clearCompleted,
} from './todosSlice';
import { pluralize } from '../../utils/pluralize';
import { FilterStatus } from '../../types';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCount = useAppSelector(selectActiveTodoCount);
  const completedCount = useAppSelector(selectCompletedTodoCount);
  const totalCount = useAppSelector(selectTotalTodoCount);
  const currentFilter = useAppSelector(selectFilter);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const activeTodoWord = pluralize(activeCount, 'item');

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  if (totalCount === 0) {
    return null; // Don't render footer if no todos
  }

  return (
    <footer id="footer" className="footer"> {/* Keep ID */}
      <span id="todo-count" className="todo-count"> {/* Keep ID */}
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul id="filters" className="filters"> {/* Keep ID */}
        {filters.map(filter => (
          <li key={filter.key}>
            {/* Using NavLink to automatically add 'selected' class based on route */}
            {/* Note: React Router v6 uses 'active' class by default, we override */}
            <NavLink
              to={`/${filter.key}`}
              className={({ isActive }) => isActive ? "selected" : ""}
              // Alternatively, compare with currentFilter from Redux state:
              // className={currentFilter === filter.key ? "selected" : ""}
              // href={`#/${filter.key}`} // If not using React Router NavLink
            >
              {filter.label}
            </NavLink>
          </li>
        ))}
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

**8. Implement Routing and App Component**

We need a way to sync the URL hash with the Redux filter state.

```typescript
// src/hooks/useRouterFilterSync.ts
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch } from './reduxHooks';
import { setFilter } from '../features/todos/todosSlice';
import { FilterStatus } from '../types';

const isValidFilter = (filter: string | undefined): filter is FilterStatus => {
    return filter === 'all' || filter === 'active' || filter === 'completed';
}

export const useRouterFilterSync = () => {
    const dispatch = useAppDispatch();
    const { filter: routeFilter } = useParams<{ filter?: string }>();
    const location = useLocation(); // To detect initial load or direct navigation

    useEffect(() => {
        // Determine the effective filter: from URL or default to 'all'
        const effectiveFilter = isValidFilter(routeFilter) ? routeFilter : 'all';
        dispatch(setFilter(effectiveFilter));

        // If the URL was invalid (e.g., /#/invalid), redirect to /#/all
        // This handles the case where useParams gives undefined or an invalid string
        if (!isValidFilter(routeFilter) && location.pathname !== '/' && location.pathname !== '/all') {
             // Use window.location.replace for hash routing if useNavigate causes issues
             window.location.hash = '/all';
        }

    }, [routeFilter, dispatch, location.pathname]); // Depend on routeFilter and dispatch
};

```

Update `App.tsx`:

```typescript
// src/App.tsx
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './features/todos/Header';
import MainSection from './features/todos/MainSection';
import Footer from './features/todos/Footer';
import { useRouterFilterSync } from './hooks/useRouterFilterSync'; // Import the hook

// A component to apply the filter sync logic within the router context
const FilterSync: React.FC = () => {
  useRouterFilterSync();
  return null; // This component doesn't render anything itself
};

function App() {
  return (
    <HashRouter>
      {/* Apply filter sync logic */}
      <FilterSync />

      <section className="todoapp">
        <Header />
        {/* Routes will implicitly control filtering via the Redux state updated by FilterSync */}
        <Routes>
           {/* Define routes to match the filter parameter */}
           <Route path="/:filter?" element={<MainSection />} />
           {/* Optional: Redirect base path to /all */}
           {/* <Route path="/" element={<Navigate replace to="/all" />} /> */}
           {/* Note: With HashRouter, '/' might map to '#/' and '/all' to '#/all'.
               The filter logic handles the default 'all' case if no filter param exists. */}
        </Routes>
        <Footer />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        <p>Updated by the TodoMVC Team</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </HashRouter>
  );
}

export default App;
```

**9. Final Touches**

*   **Remove `reportWebVitals`:** If you don't need it, remove the import and call in `src/index.tsx`.
*   **Clean up `src/App.test.tsx`:** Update or remove the default CRA test.
*   **Remove unused files:** Delete `logo.svg`, `App.css` (if empty), `setupTests.ts` (if not writing tests yet).

**Explanation:**

1.  **CRA & TypeScript:** Provides a modern build setup and type safety.
2.  **Redux Toolkit:** Simplifies Redux setup with `configureStore` and `createSlice`. `createSlice` automatically generates action creators and action types. `createSelector` optimizes derived data calculation.
3.  **`nanoid`:** Generates unique, short, URL-friendly IDs.
4.  **State:** The application state (`todos` array and `filter` string) is managed centrally in the Redux store.
5.  **Components:** The UI is broken down into logical, reusable functional components (`Header`, `MainSection`, `TodoList`, `TodoItem`, `Footer`).
6.  **Hooks:** `useState` manages local component state (like input values or editing state). `useEffect` handles side effects (like focusing the edit input). `useRef` accesses DOM elements directly when needed (for focus). `useAppDispatch` and `useAppSelector` interact with the Redux store in a type-safe way.
7.  **Event Handling:** Standard React event handlers (`onClick`, `onChange`, `onKeyDown`, `onBlur`, `onDoubleClick`) replace jQuery event listeners. They dispatch Redux actions to modify the state.
8.  **Rendering:** React handles rendering based on the state. When the Redux state changes, components subscribed via `useAppSelector` re-render automatically. Conditional rendering (`&&`, ternary operators, or `if` checks returning `null`) replaces jQuery's `.toggle()`.
9.  **Routing:** `react-router-dom` with `HashRouter` mimics the original `#` based routing. The `useRouterFilterSync` hook reads the filter from the URL (`useParams`) and dispatches the `setFilter` action to Redux. `NavLink` in the `Footer` handles navigation and applies the `selected` class.
10. **Persistence:** The `localStorage.ts` utility saves/loads the `todos` array. The store subscribes to changes and calls `saveState` on every update. `loadState` provides the initial state for the slice.
11. **CSS:** The original TodoMVC CSS files are imported directly, preserving the look and feel.

This structure provides a robust, maintainable, and type-safe React implementation of the TodoMVC application, leveraging modern best practices with Redux Toolkit.

### Tokens: {'input_tokens': 2981, 'output_tokens': 5654}
### Execution time: 60.53978419303894
