I have the following jQuery app code:

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
  "name": "todomvc-react-redux",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@types/node": "^18.11.18",
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "nanoid": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.0",
    "todomvc-app-css": "^2.4.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  }
}
```

```typescript
// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/slices/todosSlice.ts
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
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
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
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
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAllTodos(state, action: PayloadAction<boolean>) {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  toggleAllTodos,
  editTodo,
  removeTodo,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
```

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'todomvc-app-css/index.css';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```tsx
// src/App.tsx
import React from 'react';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';

const App: React.FC = () => (
  <section className="todoapp">
    <Header />
    <MainSection />
    <Footer />
  </section>
);

export default App;
```

```tsx
// src/components/Header.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../slices/todosSlice';

const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim() !== '') {
      dispatch(addTodo(title.trim()));
      setTitle('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default Header;
```

```tsx
// src/components/MainSection.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleAllTodos } from '../slices/todosSlice';
import TodoList from './TodoList';

const MainSection: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const dispatch = useDispatch();

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
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
    </section>
  );
};

export default MainSection;
```

```tsx
// src/components/TodoList.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
```

```tsx
// src/components/TodoItem.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../slices/todosSlice';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = () => {
    dispatch(removeTodo(id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(title);
      setEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    const trimmedText = editText.trim();

    if (trimmedText) {
      dispatch(editTodo({ id, title: trimmedText }));
    } else {
      dispatch(removeTodo(id));
    }
    setEditing(false);
  };

  return (
    <li className={`${completed ? 'completed' : ''} ${editing ? 'editing' : ''}`} data-id={id}>
      {!editing ? (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleToggle}
          />
          <label onDoubleClick={handleDoubleClick}>{title}</label>
          <button className="destroy" onClick={handleDelete}></button>
        </div>
      ) : (
        <input
          className="edit"
          value={editText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted, setFilter } from '../slices/todosSlice';

const Footer: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const filter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();

  if (todos.length === 0) {
    return null;
  }

  const itemWord = activeTodoCount === 1 ? 'item' : 'items';

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleFilterChange = (filterValue: 'all' | 'active' | 'completed') => {
    dispatch(setFilter(filterValue));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => handleFilterChange('completed')}
          >
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

```typescript
// src/index.css
/* Add any additional custom styles if needed */
```

### Tokens: {'input_tokens': 2350, 'output_tokens': 6274, 'reasoning_tokens': 3648}
### Execution time: 55.541390895843506
