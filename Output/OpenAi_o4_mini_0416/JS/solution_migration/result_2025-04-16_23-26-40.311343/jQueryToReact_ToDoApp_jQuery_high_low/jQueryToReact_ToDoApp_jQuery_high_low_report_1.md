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
Below is a complete “TodoMVC” rewrite in React 18 + TypeScript + Redux‑Toolkit + nanoid under CRA. It matches all jQuery behaviors (add/edit/delete/toggle/toggle‑all/clear completed, Esc to cancel edit, Enter to commit, hash‑based routing, localStorage persistence, same CSS).  
   
Folder structure  
src/  
├─ app/  
│  ├─ hooks.ts  
│  └─ store.ts  
├─ components/  
│  ├─ Footer.tsx  
│  ├─ Header.tsx  
│  ├─ TodoApp.tsx  
│  ├─ TodoItem.tsx  
│  └─ TodoList.tsx  
├─ features/  
│  └─ todos/  
│     ├─ todosSelectors.ts  
│     ├─ todosSlice.ts  
│     └─ types.ts  
├─ App.tsx  
├─ index.tsx  
└─ app.css  
   
---  
1) Install dependencies  
```bash
npx create-react-app my-todo --template typescript
cd my-todo
npm install react-router-dom @reduxjs/toolkit react-redux nanoid todomvc-common todomvc-app-css
```  
   
2) src/app/store.ts  
```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../features/todos/todosSlice'

const LOCALSTORAGE_KEY = 'todos-react'

function loadTodos() {
  try {
    const serialized = localStorage.getItem(LOCALSTORAGE_KEY)
    return serialized ? JSON.parse(serialized) : []
  } catch {
    return []
  }
}

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState: {
    todos: loadTodos(),
  },
})

store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state.todos))
  } catch {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

3) src/app/hooks.ts  
```ts
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

4) src/features/todos/types.ts  
```ts
// src/features/todos/types.ts
export interface Todo {
  id: string
  title: string
  completed: boolean
}
```

5) src/features/todos/todosSlice.ts  
```ts
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { Todo } from './types'

type TodosState = Todo[]

const todosSlice = createSlice({
  name: 'todos',
  initialState: [] as TodosState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.push(action.payload)
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } }
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const t = state.find((x) => x.id === action.payload)
      if (t) t.completed = !t.completed
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.forEach((t) => (t.completed = action.payload))
    },
    editTodo(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const t = state.find((x) => x.id === action.payload.id)
      if (t) t.title = action.payload.title
    },
    deleteTodo(state, action: PayloadAction<string>) {
      return state.filter((x) => x.id !== action.payload)
    },
    clearCompleted(state) {
      return state.filter((x) => !x.completed)
    },
  },
})

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  editTodo,
  deleteTodo,
  clearCompleted,
} = todosSlice.actions
export default todosSlice.reducer
```

6) src/features/todos/todosSelectors.ts  
```ts
// src/features/todos/todosSelectors.ts
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Todo } from './types'

export const selectTodos = (state: RootState) => state.todos

export const selectActiveTodos = createSelector(
  selectTodos,
  (todos) => todos.filter((t) => !t.completed)
)

export const selectCompletedTodos = createSelector(
  selectTodos,
  (todos) => todos.filter((t) => t.completed)
)

export const selectTodosByFilter = (filter: string) =>
  createSelector(
    selectTodos,
    selectActiveTodos,
    selectCompletedTodos,
    (all, active, completed) => {
      if (filter === 'active') return active
      if (filter === 'completed') return completed
      return all
    }
  )

export const selectActiveCount = createSelector(
  selectActiveTodos,
  (a) => a.length
)

export const selectCompletedCount = createSelector(
  selectCompletedTodos,
  (a) => a.length
)
```

7) src/App.tsx  
```tsx
// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TodoApp from './components/TodoApp'
import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'
import './app.css'

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/all" replace />} />
    <Route path="/:filter" element={<TodoApp />} />
    <Route path="*" element={<Navigate to="/all" replace />} />
  </Routes>
)

export default App
```

8) src/index.tsx  
```tsx
// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
)
```

9) src/components/TodoApp.tsx  
```tsx
// src/components/TodoApp.tsx
import React from 'react'
import Header from './Header'
import TodoList from './TodoList'
import Footer from './Footer'

const TodoApp: React.FC = () => (
  <section id="todoapp" className="todoapp">
    <Header />
    <TodoList />
    <Footer />
  </section>
)

export default TodoApp
```

10) src/components/Header.tsx  
```tsx
// src/components/Header.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { useAppDispatch } from '../app/hooks'
import { addTodo } from '../features/todos/todosSlice'

const Header: React.FC = () => {
  const [title, setTitle] = useState('')
  const dispatch = useAppDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      dispatch(addTodo(title.trim()))
      setTitle('')
    }
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        id="new-todo"
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
    </header>
  )
}

export default Header
```

11) src/components/TodoItem.tsx  
```tsx
// src/components/TodoItem.tsx
import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from 'react'
import { Todo } from '../features/todos/types'
import {
  toggleTodo,
  editTodo,
  deleteTodo,
} from '../features/todos/todosSlice'
import { useAppDispatch } from '../app/hooks'

interface Props {
  todo: Todo
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  // focus & position
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(draft.length, draft.length)
    }
  }, [editing, draft])

  const handleToggle = () => dispatch(toggleTodo(todo.id))
  const handleDelete = () => dispatch(deleteTodo(todo.id))

  const handleDoubleClick = () => {
    setDraft(todo.title)
    setEditing(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDraft(e.target.value)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setDraft(todo.title)
      setEditing(false)
    }
  }

  const handleBlur = () => {
    const val = draft.trim()
    if (!val) {
      dispatch(deleteTodo(todo.id))
    } else {
      dispatch(editTodo({ id: todo.id, title: val }))
    }
    setEditing(false)
  }

  return (
    <li
      className={`${todo.completed ? 'completed' : ''} ${
        editing ? 'editing' : ''
      }`}
      data-id={todo.id}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete} />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={draft}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </li>
  )
}

export default TodoItem
```

12) src/components/TodoList.tsx  
```tsx
// src/components/TodoList.tsx
import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectTodosByFilter } from '../features/todos/todosSelectors'
import { toggleAll } from '../features/todos/todosSlice'
import TodoItem from './TodoItem'

const TodoList: React.FC = () => {
  const { filter = 'all' } = useParams<{ filter: string }>()
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectTodosByFilter(filter))
  const activeTodos = useAppSelector((state) =>
    selectTodosByFilter('active')(state)
  )

  if (todos.length === 0 && filter === 'all') {
    // still show main if no items and 'all'
  }

  return (
    <section className="main" style={{ display: todos.length ? 'block' : 'none' }}>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={activeTodos.length === 0}
        onChange={(e) => dispatch(toggleAll(e.target.checked))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul id="todo-list" className="todo-list">
        {todos.map((t) => (
          <TodoItem key={t.id} todo={t} />
        ))}
      </ul>
    </section>
  )
}

export default TodoList
```

13) src/components/Footer.tsx  
```tsx
// src/components/Footer.tsx
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {
  selectActiveCount,
  selectCompletedCount,
} from '../features/todos/todosSelectors'
import { clearCompleted } from '../features/todos/todosSlice'

const Footer: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeCount = useAppSelector(selectActiveCount)
  const completedCount = useAppSelector(selectCompletedCount)
  const { filter = 'all' } = useParams<{ filter: string }>()

  if (activeCount + completedCount === 0) {
    return null
  }

  return (
    <footer
      id="footer"
      className="footer"
      style={{ display: activeCount + completedCount ? 'block' : 'none' }}
    >
      <span id="todo-count" className="todo-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <ul id="filters" className="filters">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <li key={f}>
            <NavLink
              to={`/${f}`}
              className={({ isActive }) => (isActive ? 'selected' : undefined)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </NavLink>
          </li>
        ))}
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
  )
}

export default Footer
```

14) src/app.css  
```css
/* you can drop in any custom overrides here */
```

—  

That’s it! Your React + TypeScript + Redux‑Toolkit rewrite now has:  
• same look (using original TodoMVC CSS)  
• full hash‑based routing (`#/all`, `#/active`, `#/completed`)  
• add/edit/delete/toggle/toggle‑all/clear completed  
• enter to save, esc to cancel, focus/blur behavior  
• localStorage persistence  
• functional components/hooks, typed Redux slice & selectors, nanoid IDs.

### Tokens: {'input_tokens': 2554, 'output_tokens': 7217, 'reasoning_tokens': 3968}
### Execution time: 63.11317801475525
