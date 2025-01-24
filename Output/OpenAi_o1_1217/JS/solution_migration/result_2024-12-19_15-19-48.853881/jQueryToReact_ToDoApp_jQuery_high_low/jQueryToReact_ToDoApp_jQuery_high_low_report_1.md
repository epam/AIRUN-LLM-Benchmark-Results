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
  "name": "todo-react-typescript",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^29.2.0",
    "@types/node": "^18.7.18",
    "@types/react": "^18.0.20",
    "@types/react-dom": "^18.0.6",
    "nanoid": "^4.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-scripts": "5.0.1",
    "typescript": "^4.8.4",
    "web-vitals": "^2.1.4"
  }
}
```

```ts
// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./features/todos/todosSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

type Filter = "all" | "active" | "completed";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  list: Todo[];
  filter: Filter;
}

const initialState: TodosState = {
  list: [],
  filter: "all"
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (title !== "") {
        state.list.push({
          id: nanoid(),
          title,
          completed: false
        });
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.list.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.list.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const todo = state.list.find((t) => t.id === id);
      if (todo) {
        todo.title = title.trim();
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    removeCompleted: (state) => {
      state.list = state.list.filter((t) => !t.completed);
    }
  }
});

export const {
  setFilter,
  addTodo,
  toggleTodo,
  toggleAll,
  updateTodo,
  removeTodo,
  removeCompleted
} = todosSlice.actions;

export default todosSlice.reducer;
```

```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```tsx
// src/App.tsx
import React from "react";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import Footer from "./components/Footer";

function App() {
  return (
    <section className="todoapp">
      <Header />
      <MainSection />
      <Footer />
    </section>
  );
}

export default App;
```

```tsx
// src/components/Header.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../features/todos/todosSlice";

function Header() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim() !== "") {
      dispatch(addTodo(title));
      setTitle("");
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </header>
  );
}

export default Header;
```

```tsx
// src/components/MainSection.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { toggleAll } from "../features/todos/todosSlice";
import TodoList from "./TodoList";

function MainSection() {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.list);
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
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
          onChange={handleToggleAll}
          checked={completedCount > 0 && activeCount === 0}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
      <TodoList />
    </section>
  );
}

export default MainSection;
```

```tsx
// src/components/TodoList.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import TodoItem from "./TodoItem";

function filteredTodos(list: any[], filter: string) {
  if (filter === "active") {
    return list.filter((t) => !t.completed);
  }
  if (filter === "completed") {
    return list.filter((t) => t.completed);
  }
  return list;
}

function TodoList() {
  const { list, filter } = useSelector((state: RootState) => state.todos);
  const visibleTodos = filteredTodos(list, filter);

  return (
    <ul className="todo-list">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
```

```tsx
// src/components/TodoItem.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTodo, removeTodo, updateTodo } from "../features/todos/todosSlice";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setValue(todo.title);
      setEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      dispatch(updateTodo({ id: todo.id, title: trimmedValue }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setEditing(false);
  };

  const liClass = [todo.completed ? "completed" : "", editing ? "editing" : ""]
    .join(" ")
    .trim();

  return (
    <li className={liClass}>
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
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </li>
  );
}

export default TodoItem;
```

```tsx
// src/components/Footer.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setFilter, removeCompleted } from "../features/todos/todosSlice";

function Footer() {
  const dispatch = useDispatch();
  const { list, filter } = useSelector((state: RootState) => state.todos);
  const activeCount = list.filter((t) => !t.completed).length;
  const completedCount = list.filter((t) => t.completed).length;

  if (list.length === 0) {
    return null;
  }

  const handleClearCompleted = () => {
    dispatch(removeCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? "item" : "items"} left
      </span>
      <ul className="filters">
        <li>
          <a
            className={filter === "all" ? "selected" : ""}
            href="#/all"
            onClick={() => dispatch(setFilter("all"))}
          >
            All
          </a>
        </li>
        <li>
          <a
            className={filter === "active" ? "selected" : ""}
            href="#/active"
            onClick={() => dispatch(setFilter("active"))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={filter === "completed" ? "selected" : ""}
            href="#/completed"
            onClick={() => dispatch(setFilter("completed"))}
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
}

export default Footer;
```

```css
/* src/index.css (example styling, include your own styles as needed) */
body {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: #f5f5f5;
}
h1 {
  font-size: 80px;
  font-weight: 100;
  text-align: center;
}
.todoapp {
  background: #fff;
  margin: 40px 0;
  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2),
    0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
.header .new-todo {
  width: 100%;
  padding: 16px 16px 16px 60px;
  box-sizing: border-box;
  border: none;
  font-size: 24px;
  outline: none;
}
.main {
  position: relative;
}
.toggle-all-container {
  display: flex;
  align-items: center;
  padding-left: 15px;
}
.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.todo-list li {
  border-bottom: 1px solid #ededed;
  position: relative;
  font-size: 24px;
}
.todo-list li.completed .view label {
  text-decoration: line-through;
  color: #d9d9d9;
}
.view {
  display: flex;
  align-items: center;
  padding: 15px;
}
.toggle {
  width: 40px;
  height: auto;
  text-align: center;
  border: none;
  outline: none;
}
.destroy {
  background: none;
  border: 0;
  cursor: pointer;
  margin-left: auto;
  width: 40px;
  height: 40px;
  opacity: 0.2;
}
.destroy:hover {
  opacity: 0.8;
}
li.editing .edit {
  display: block;
  width: calc(100% - 43px);
  font-size: 24px;
  line-height: 1.4em;
  border: 0;
  outline: none;
  padding: 12px 16px;
}
li.editing .view {
  display: none;
}
.footer {
  padding: 10px 15px;
  color: #777;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.filters {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 5px;
}
.filters a {
  color: inherit;
  text-decoration: none;
  padding: 3px 7px;
  border: 1px solid transparent;
  border-radius: 3px;
}
.filters a.selected {
  border-color: rgba(175, 47, 47, 0.2);
}
.clear-completed {
  border: 0;
  background: none;
  cursor: pointer;
  opacity: 0.5;
}
.clear-completed:hover {
  opacity: 1;
}
```


### Tokens: {'input_tokens': 2342, 'output_tokens': 7727, 'reasoning_tokens': 4416}
### Execution time: 63.6075758934021
