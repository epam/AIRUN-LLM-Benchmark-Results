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
```typescript
// index.html
<!doctype html>
<html lang="en" data-framework="react">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="A TodoMVC written in React." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>TodoMVC: React</title>
        <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
        <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
        <link rel="stylesheet" href="src/app.css">
    </head>
    <body>
        <div id="root"></div>
        <footer id="info" class="info">
            <p>Double-click to edit a todo</p>
            <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
            <p>Updated by the TodoMVC Team</p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
    </body>
</html>
```

```typescript
// src/app.css
/* No changes needed, content from original src/app.css if any */
```

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import './index.css'; // You can add global styles here if needed

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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

```typescript
// src/index.css
/* You can add global styles here if needed, or keep it empty */
```

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { useAppDispatch } from './app/hooks';
import { getTodosFromLocalStorage } from './features/todos/todosSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTodosFromLocalStorage());
    const appIsReadyEvent = new CustomEvent('appIsReady');
    document.dispatchEvent(appIsReadyEvent);
  }, [dispatch]);

  return (
    <section className="todoapp">
      <Header />
      <Main />
      <Footer />
    </section>
  );
}

export default App;
```

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/app/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```typescript
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = {
  todos: [],
  filter: 'all',
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    getTodosFromLocalStorage: (state) => {
      try {
        const storedTodos = localStorage.getItem('todos-react-ts');
        if (storedTodos) {
          state.todos = JSON.parse(storedTodos) as Todo[];
        }
      } catch (error) {
        console.error('Error loading todos from local storage:', error);
        state.todos = []; // Fallback to empty array in case of error
      }
    },
    saveTodosToLocalStorage: (state) => {
      try {
        localStorage.setItem('todos-react-ts', JSON.stringify(state.todos));
      } catch (error) {
        console.error('Error saving todos to local storage:', error);
      }
    },
    addTodo: {
      reducer: (state, action: PayloadAction<{ id: string; title: string }>) => {
        state.todos.push({ id: action.payload.id, title: action.payload.title, completed: false });
      },
      prepare: (title: string) => ({ payload: { id: nanoid(), title } }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => (todo.completed = action.payload));
    },
    updateTodoTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    deleteCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  getTodosFromLocalStorage,
  saveTodosToLocalStorage,
  addTodo,
  toggleTodo,
  toggleAllTodos,
  updateTodoTitle,
  deleteTodo,
  deleteCompletedTodos,
  setFilter,
} = todosSlice.actions;

export const selectTodos = (state: RootState) => {
  const { todos, filter } = state.todos;

  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const selectActiveTodosCount = (state: RootState) => state.todos.todos.filter((todo) => !todo.completed).length;
export const selectCompletedTodosCount = (state: RootState) => state.todos.todos.filter((todo) => todo.completed).length;
export const selectFilter = (state: RootState) => state.todos.filter;
export const selectVisibleTodos = (state: RootState) => selectTodos(state);
export const selectAllTodosCount = (state: RootState) => state.todos.todos.length;

export default todosSlice.reducer;
```

```typescript
// src/components/Header.tsx
import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addTodo } from '../features/todos/todosSlice';

const Header: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const dispatch = useAppDispatch();

  const handleNewTodoKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && newTodoTitle.trim()) {
        dispatch(addTodo(newTodoTitle.trim()));
        setNewTodoTitle('');
      }
    },
    [newTodoTitle, dispatch]
  );

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        onKeyDown={handleNewTodoKeyDown}
      />
    </header>
  );
};

export default Header;
```

```typescript
// src/components/Main.tsx
import React from 'react';
import TodoList from './TodoList';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllTodosCount, selectActiveTodosCount, toggleAllTodos } from '../features/todos/todosSlice';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const todosCount = useAppSelector(selectAllTodosCount);
  const activeTodosCount = useAppSelector(selectActiveTodosCount);
  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(event.target.checked));
  };

  if (todosCount === 0) {
    return null;
  }

  return (
    <main className="main">
      <div className="toggle-all-container">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={activeTodosCount === 0}
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

```typescript
// src/components/TodoList.tsx
import React from 'react';
import TodoItem from './TodoItem';
import { useAppSelector } from '../app/hooks';
import { selectVisibleTodos } from '../features/todos/todosSlice';

const TodoList: React.FC = () => {
  const visibleTodos = useAppSelector(selectVisibleTodos);

  return (
    <ul className="todo-list">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
```

```typescript
// src/components/TodoItem.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Todo } from '../features/todos/todosSlice';
import { useAppDispatch } from '../app/hooks';
import { toggleTodo, updateTodoTitle, deleteTodo } from '../features/todos/todosSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const dispatch = useAppDispatch();
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleDestroy = useCallback(() => {
    dispatch(deleteTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditValue(todo.title);
    // Focus on input after a short delay to allow component to render
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  }, [todo.title]);

  const handleEditChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  }, []);

  const handleEditKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleUpdate();
      } else if (event.key === 'Escape') {
        setIsEditing(false);
        setEditValue(todo.title); // Revert to original title
      }
    },
    [handleUpdate, todo.title]
  );

  const handleUpdate = useCallback(() => {
    const value = editValue.trim();
    if (value) {
      dispatch(updateTodoTitle({ id: todo.id, title: value }));
    } else {
      dispatch(deleteTodo(todo.id)); // Delete if empty after edit
    }
    setIsEditing(false);
  }, [dispatch, todo.id, editValue]);

  const handleBlur = useCallback(() => {
    if (isEditing) { // Only update if still in editing mode (not canceled by ESC)
      handleUpdate();
    }
    setIsEditing(false); // Ensure editing mode is off even if update wasn't triggered
  }, [isEditing, handleUpdate]);


  useEffect(() => {
    if (!isEditing) {
      setEditValue(todo.title); // Keep editValue in sync with todo.title when not editing
    }
  }, [isEditing, todo.title]);


  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editValue}
          onChange={handleEditChange}
          onKeyDown={handleEditKeyDown}
          onBlur={handleBlur}
        />
      )}
    </li>
  );
};

export default TodoItem;
```

```typescript
// src/components/Footer.tsx
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectActiveTodosCount,
  selectCompletedTodosCount,
  deleteCompletedTodos,
  setFilter,
  saveTodosToLocalStorage,
  selectAllTodosCount,
} from '../features/todos/todosSlice';

const Footer: React.FC = () => {
  const activeTodosCount = useAppSelector(selectActiveTodosCount);
  const completedTodosCount = useAppSelector(selectCompletedTodosCount);
  const allTodosCount = useAppSelector(selectAllTodosCount);
  const dispatch = useAppDispatch();
  const { filter: routeFilter } = useParams<{ filter?: 'all' | 'active' | 'completed' }>();

  const handleClearCompleted = () => {
    dispatch(deleteCompletedTodos());
  };

  useEffect(() => {
    dispatch(saveTodosToLocalStorage());
  }, [dispatch, allTodosCount, activeTodosCount, completedTodosCount]); // Save on any todo change

  useEffect(() => {
    const filterFromRoute = routeFilter || 'all';
    dispatch(setFilter(filterFromRoute));
  }, [dispatch, routeFilter]);

  if (allTodosCount === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodosCount}</strong> item{activeTodosCount !== 1 ? 's' : ''} left
      </span>
      <ul className="filters">
        <li>
          <NavLink to="/all" className={({ isActive }) => isActive ? 'selected' : ''} end>
            All
          </NavLink>
        </li>
        <li>
          <NavLink to="/active" className={({ isActive }) => isActive ? 'selected' : ''}>
            Active
          </NavLink>
        </li>
        <li>
          <NavLink to="/completed" className={({ isActive }) => isActive ? 'selected' : ''}>
            Completed
          </NavLink>
        </li>
      </ul>
      {completedTodosCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
```

**To run this application:**

1.  **Ensure Node.js and npm are installed.**
2.  **Create a new React project:**
    ```bash
    npx create-react-app react-todo-ts --template typescript
    cd react-todo-ts
    ```
3.  **Install dependencies:**
    ```bash
    npm install react-redux @reduxjs/toolkit nanoid todomvc-common todomvc-app-css react-router-dom
    ```
4.  **Replace the contents of `src` folder** with the provided code (create `components` and `features/todos` folders inside `src`).
5.  **Replace the content of `public/index.html`** with the provided `index.html` code.
6.  **Start the development server:**
    ```bash
    npm start
    ```

This will start the React application on `http://localhost:3000`. The application should now function identically to the original jQuery TodoMVC, but built with React 18, TypeScript, and Redux Toolkit. It also includes local storage persistence and routing for filtering.

### Tokens: {'input_tokens': 2982, 'output_tokens': 4203}
### Execution time: 20.77485990524292
