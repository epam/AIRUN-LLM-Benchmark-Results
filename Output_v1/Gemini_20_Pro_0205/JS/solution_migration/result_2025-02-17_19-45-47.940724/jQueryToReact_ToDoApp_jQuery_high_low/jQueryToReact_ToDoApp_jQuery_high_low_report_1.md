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
// package.json
{
  "name": "react-todomvc",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.34",
    "@types/react": "^18.2.8",
    "@types/react-dom": "^18.2.4",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.7",
    "react-router-dom": "^6.11.2",
    "react-scripts": "5.0.1",
    "todomvc-app-css": "^2.4.2",
    "todomvc-common": "^1.0.5",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
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

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  filter: string;
}

const initialState: TodosState = {
  todos: [],
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  toggleAllTodos,
  clearCompletedTodos,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;

```

```tsx
// src/components/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, updateTodo, deleteTodo } from '../store/todosSlice';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleEdit = () => {
    setEditing(true);
    setNewTitle(title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = () => {
      if (newTitle.trim()) {
          dispatch(updateTodo({ id, title: newTitle }));
      } else {
          dispatch(deleteTodo(id));
      }
      setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setNewTitle(title);
      setEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteTodo(id));
  };

  return (
    <li className={completed ? 'completed' : ''} data-id={id}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{title}</label>
        <button className="destroy" onClick={handleDelete} />
      </div>
      {editing && (
        <input
          ref={inputRef}
          className="edit"
          value={newTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;

```

```tsx
// src/components/TodoList.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';
import { Todo } from '../store/todosSlice';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const getFilteredTodos = (todos: Todo[], filter: string) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
};

export default TodoList;

```

```tsx
// src/components/TodoFooter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompletedTodos, setFilter } from '../store/todosSlice';
import { Link } from 'react-router-dom';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Link>
        </li>
        <li>
          <Link
            to="/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </Link>
        </li>
        <li>
          <Link
            to="/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => handleFilterChange('completed')}
          >
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

```

```tsx
// src/components/TodoInput.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';

const TodoInput: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newTodo.trim() !== '') {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodo}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default TodoInput;

```

```tsx
// src/App.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { toggleAllTodos } from './store/todosSlice';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.todos);
    const allCompleted = todos.length > 0 && todos.every((todo) => todo.completed);

    const handleToggleAllChange = () => {
        dispatch(toggleAllTodos(!allCompleted));
    };

    return (
        <Router>
            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <TodoInput />
                </header>
                <section className="main">
                    <div className="toggle-all-container">
                        <input
                            id="toggle-all"
                            className="toggle-all"
                            type="checkbox"
                            checked={allCompleted}
                            onChange={handleToggleAllChange}
                        />
                        <label htmlFor="toggle-all">Mark all as complete</label>
                    </div>
                    <TodoList />
                </section>
                {todos.length > 0 && <TodoFooter />}
            </section>
            <Routes>
                <Route path="/:filter" element={<></>} />
            </Routes>
            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Created by the TodoMVC Team</p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
            <div id="appIsReady"></div>
        </Router>
    );
};

export default App;

```

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './app.css';

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

```css
/* src/app.css */
.toggle-all-container {
    position: relative;
}

.toggle-all-container label {
    position: absolute;
    top: -54px;
    left: 14px;
    width: 25px;
    text-align: center;
    font-size: 28px;
    color: #e6e6e6;
    transform: rotate(90deg);
}
```


### Tokens: {'input_tokens': 2766, 'output_tokens': 3449}
### Execution time: 29.018236875534058
