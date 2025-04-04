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
```json
{
  "name": "todomvc-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.3",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import TodoApp from './components/TodoApp';
import { store } from './app/store';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>
);
```

```tsx
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

```tsx
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: []
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
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted(state) {
      state.items = state.items.filter(todo => !todo.completed);
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  updateTodo,
  destroyTodo,
  toggleAll,
  clearCompleted
} = todosSlice.actions;

export default todosSlice.reducer;
```

```tsx
// src/components/TodoApp.tsx
import React, { useEffect, useState } from 'react';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';
import { useAppSelector } from '../hooks';

export type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const todos = useAppSelector(state => state.todos.items);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'active' || hash === 'completed') {
        setFilter(hash);
      } else {
        setFilter('all');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getFilteredTodos = () => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }
    return todos;
  };

  return (
    <section id="todoapp" className="todoapp">
      <Header />
      <section id="main" className="main" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
        <TodoList todos={getFilteredTodos()} />
      </section>
      <Footer filter={filter} />
    </section>
  );
};

export default TodoApp;
```

```tsx
// src/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './app/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```tsx
// src/components/Header.tsx
import React, { KeyboardEvent, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { addTodo } from '../features/todos/todosSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      dispatch(addTodo(title.trim()));
      setTitle('');
    }
  };

  return (
    <header id="header" className="header">
      <h1>todos</h1>
      <input
        id="new-todo"
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyUp={handleKeyUp}
      />
    </header>
  );
};

export default Header;
```

```tsx
// src/components/TodoList.tsx
import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../features/todos/todosSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleAll } from '../features/todos/todosSlice';

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const dispatch = useAppDispatch();
  const allCompleted = useAppSelector(state => state.todos.items.every(todo => todo.completed));

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  return (
    <>
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
      <ul id="todo-list" className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
};

export default TodoList;
```

```tsx
// src/components/TodoItem.tsx
import React, { useState, KeyboardEvent, FocusEvent, ChangeEvent } from 'react';
import { Todo, toggleTodo, updateTodo, destroyTodo } from '../features/todos/todosSlice';
import { useAppDispatch } from '../hooks';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setEditing(false);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      dispatch(destroyTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: trimmedTitle }));
    }
    setEditing(false);
  };

  const handleDestroy = () => {
    dispatch(destroyTodo(todo.id));
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`} data-id={todo.id}>
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
      {editing && (
        <input
          className="edit"
          value={editTitle}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </li>
  );
};

export default TodoItem;
```

```tsx
// src/components/Footer.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearCompleted } from '../features/todos/todosSlice';
import { FilterType } from './TodoApp';

interface FooterProps {
  filter: FilterType;
}

const Footer: React.FC<FooterProps> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.items);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const pluralize = (count: number, word: string) => {
    return count === 1 ? word : `${word}s`;
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer id="footer" className="footer" style={{ display: todos.length ? 'block' : 'none' }}>
      <span id="todo-count" className="todo-count">
        <strong>{activeCount}</strong> {pluralize(activeCount, 'item')} left
      </span>
      <ul id="filters" className="filters">
        <li>
          <a className={filter === 'all' ? 'selected' : ''} href="#/all">
            All
          </a>
        </li>
        <li>
          <a className={filter === 'active' ? 'selected' : ''} href="#/active">
            Active
          </a>
        </li>
        <li>
          <a className={filter === 'completed' ? 'selected' : ''} href="#/completed">
            Completed
          </a>
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

### Tokens: {'input_tokens': 2342, 'output_tokens': 4049, 'reasoning_tokens': 1344}
### Execution time: 19.981779098510742
