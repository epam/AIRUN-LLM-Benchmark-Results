Your task is to write unit-tests for a legacy part of frontend application.

app.tsx
```tsx
declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';
    }
  }

  public toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle : ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo : ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo : ITodo) {
    this.setState({editing: todo.id});
  }

  public save(todoToSave : ITodo, text : String) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={ e => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();

```

todoItem.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {

  public state : ITodoItemState;

  constructor(props : ITodoItemProps){
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event : React.FormEvent) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
  }

  public handleKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event : React.FormEvent) {
    var input : any = event.target;
    this.setState({ editText : input.value });
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  public componentDidUpdate(prevProps : ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={ e => this.handleEdit() }>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={ e => this.handleSubmit(e) }
          onChange={ e => this.handleChange(e) }
          onKeyDown={ e => this.handleKeyDown(e) }
        />
      </li>
    );
  }
}

export { TodoItem };

```

utils.ts
```ts

class Utils {
  public static uuid() : string {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace : string, data? : any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs : any[]) : any {
    var newObj = {};
    for (var i = 0; i < objs.length; i++) {
      var obj = objs[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}

export { Utils };

```

footer.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { Utils } from "./utils";

class TodoFooter extends React.Component<ITodoFooterProps, {}> {

  public render() {
    var activeTodoWord = Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({selected: nowShowing === ALL_TODOS})}>
                All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
                Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };

```

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

todoModel.ts
```ts
import { Utils } from "./utils";
class TodoModel implements ITodoModel {
  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}

export { TodoModel };

```


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
// package.json
{
  "name": "legacy-todo-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "classnames": "^2.2.6"
  },
  "devDependencies": {
    "@types/react": "^16.9.0",
    "@types/react-dom": "^16.9.0",
    "@types/jest": "^26.0.0",
    "jest": "^26.0.0",
    "ts-jest": "^26.0.0",
    "typescript": "^3.9.0",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.0",
    "@types/enzyme": "^3.10.3",
    "@types/enzyme-adapter-react-16": "^1.0.6",
    "react-test-renderer": "^16.13.1"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "target": "ES6",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "lib": ["dom", "es6"],
    "skipLibCheck": true,
    "strict": false,
    "noImplicitAny": false
  },
  "include": ["src", "__tests__"]
}

// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}']
};

// src/app.tsx
declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

interface IAppProps {
  model: any;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';
    }
  }

  public toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle : any) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo : any) {
    this.props.model.destroy(todo);
  }

  public edit(todo : any) {
    this.setState({editing: todo.id});
  }

  public save(todoToSave : any, text : string) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={ e => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

export default TodoApp;

var model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();

// src/todoItem.tsx
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onToggle: (e?: any) => void;
  onDestroy: (e?: any) => void;
  onEdit: (e?: any) => void;
  onSave: (value: string) => void;
  onCancel: (e?: any) => void;
}

interface ITodoItemState {
  editText: string;
}

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {

  public state : ITodoItemState;

  constructor(props : ITodoItemProps){
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event : React.FormEvent) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
  }

  public handleKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event : React.FormEvent) {
    var input : any = event.target;
    this.setState({ editText : input.value });
  }

  public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  public componentDidUpdate(prevProps : ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={ e => this.handleEdit() }>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={ e => this.handleSubmit(e) }
          onChange={ e => this.handleChange(e) }
          onKeyDown={ e => this.handleKeyDown(e) }
        />
      </li>
    );
  }
}

export { TodoItem };

// src/footer.tsx
import * as classNames from "classnames";
import * as React from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { Utils } from "./utils";

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: (e?: any) => void;
}

class TodoFooter extends React.Component<ITodoFooterProps, {}> {

  public render() {
    var activeTodoWord = Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({selected: nowShowing === ALL_TODOS})}>
                All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
                Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };

// src/constants.ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

// src/todoModel.ts
import { Utils } from "./utils";
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange: any): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: Boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

class TodoModel implements ITodoModel {
  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    this.todos = this.todos.map((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}

export { TodoModel };

// src/utils.ts
class Utils {
  public static uuid() : string {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace : string, data? : any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs : any[]) : any {
    var newObj = {};
    for (var i = 0; i < objs.length; i++) {
      var obj = objs[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}

export { Utils };


// __tests__/TodoApp.test.tsx
import React from 'react';
import { mount } from 'enzyme';
import TodoApp from '../src/app';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../src/constants';

class DummyModel {
  todos = [];
  addTodo = jest.fn(todo => {
    this.todos.push({ id: '1', title: todo, completed: false });
  });
  toggleAll = jest.fn();
  toggle = jest.fn();
  destroy = jest.fn();
  save = jest.fn();
  clearCompleted = jest.fn();
  subscribe = jest.fn();
}

describe('TodoApp Component', () => {
  let model;
  let wrapper;
  beforeEach(() => {
    model = new DummyModel();
    global.Router = jest.fn(() => { return { init: jest.fn() }; });
    wrapper = mount(<TodoApp model={model} />);
  });

  it('renders header input', () => {
    expect(wrapper.find('input.new-todo').exists()).toBe(true);
  });

  it('handles new todo key down and adds todo when ENTER is pressed', () => {
    const input = wrapper.find('input.new-todo');
    input.getDOMNode().value = 'Test Todo';
    input.simulate('keyDown', { keyCode: ENTER_KEY, preventDefault: jest.fn() });
    expect(model.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(input.getDOMNode().value).toBe('');
  });

  it('does not add todo when non-ENTER key is pressed', () => {
    const input = wrapper.find('input.new-todo');
    input.getDOMNode().value = 'Do not add';
    input.simulate('keyDown', { keyCode: 999 });
    expect(model.addTodo).not.toHaveBeenCalled();
  });

  it('toggles all todos when toggle-all checkbox is changed', () => {
    const checkbox = wrapper.find('input.toggle-all');
    checkbox.simulate('change', { target: { checked: true } });
    expect(model.toggleAll).toHaveBeenCalledWith(true);
  });

  it('renders main and footer only if todos exist', () => {
    expect(wrapper.find('section.main').exists()).toBe(false);
    model.todos.push({ id: '1', title: 'Todo', completed: false });
    wrapper.setProps({ model });
    wrapper.update();
    expect(wrapper.find('section.main').exists()).toBe(true);
  });

  it('sets editing state when edit is triggered', () => {
    wrapper.instance().edit({ id: '1', title: 'Test', completed: false });
    expect(wrapper.state('editing')).toBe('1');
  });

  it('saves todo and resets editing state', () => {
    wrapper.instance().save({ id: '1', title: 'Old', completed: false }, 'New');
    expect(model.save).toHaveBeenCalledWith({ id: '1', title: 'Old', completed: false }, 'New');
    expect(wrapper.state('editing')).toBe(null);
  });
});


// __tests__/TodoItem.test.tsx
import React from 'react';
import { mount } from 'enzyme';
import { TodoItem } from '../src/todoItem';
import { ENTER_KEY, ESCAPE_KEY } from '../src/constants';

describe('TodoItem Component', () => {
  let todo;
  let onToggle, onDestroy, onEdit, onSave, onCancel;
  let wrapper;
  
  beforeEach(() => {
    todo = { id: '1', title: 'Test Todo', completed: false };
    onToggle = jest.fn();
    onDestroy = jest.fn();
    onEdit = jest.fn();
    onSave = jest.fn();
    onCancel = jest.fn();
    wrapper = mount(
      <TodoItem
        todo={todo}
        editing={false}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  });

  it('renders todo item', () => {
    expect(wrapper.find('li').exists()).toBe(true);
    expect(wrapper.find('label').text()).toBe('Test Todo');
  });

  it('calls onEdit and sets state on double click', () => {
    wrapper.find('label').simulate('doubleclick');
    expect(onEdit).toHaveBeenCalled();
    expect(wrapper.state('editText')).toBe('Test Todo');
  });

  it('calls onSave when ENTER key is pressed in edit input', () => {
    wrapper.setProps({ editing: true });
    wrapper.update();
    const input = wrapper.find('input.edit');
    input.instance().value = 'Updated Todo';
    wrapper.setState({ editText: 'Updated Todo' });
    input.simulate('keyDown', { keyCode: ENTER_KEY });
    expect(onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('calls onCancel when ESCAPE key is pressed', () => {
    wrapper.setProps({ editing: true });
    wrapper.update();
    wrapper.setState({ editText: 'Changed' });
    const input = wrapper.find('input.edit');
    input.simulate('keyDown', { keyCode: ESCAPE_KEY });
    expect(wrapper.state('editText')).toBe('Test Todo');
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onDestroy if edit text is empty on blur', () => {
    wrapper.setProps({ editing: true });
    wrapper.update();
    const input = wrapper.find('input.edit');
    wrapper.setState({ editText: '' });
    input.simulate('blur', {});
    expect(onDestroy).toHaveBeenCalled();
  });
});


// __tests__/TodoFooter.test.tsx
import React from 'react';
import { shallow } from 'enzyme';
import { TodoFooter } from '../src/footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../src/constants';

describe('TodoFooter Component', () => {
  let onClearCompleted;
  let wrapper;

  beforeEach(() => {
    onClearCompleted = jest.fn();
    wrapper = shallow(
      <TodoFooter count={2} completedCount={1} nowShowing={ALL_TODOS} onClearCompleted={onClearCompleted} />
    );
  });

  it('displays correct count with pluralization', () => {
    expect(wrapper.find('.todo-count').text()).toContain('2 items left');
  });

  it('renders clear completed button when completedCount > 0', () => {
    expect(wrapper.find('.clear-completed').exists()).toBe(true);
    wrapper.find('.clear-completed').simulate('click');
    expect(onClearCompleted).toHaveBeenCalled();
  });

  it('renders correct filter selection', () => {
    wrapper.setProps({ nowShowing: ACTIVE_TODOS });
    wrapper.update();
    expect(wrapper.find('a').at(1).hasClass('selected')).toBe(true);
    wrapper.setProps({ nowShowing: COMPLETED_TODOS });
    wrapper.update();
    expect(wrapper.find('a').at(2).hasClass('selected')).toBe(true);
  });
});


// __tests__/Utils.test.ts
import { Utils } from '../src/utils';

describe('Utils', () => {
  it('generates uuid of correct format', () => {
    const uuid = Utils.uuid();
    expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  });

  it('pluralizes correctly', () => {
    expect(Utils.pluralize(1, 'item')).toBe('item');
    expect(Utils.pluralize(2, 'item')).toBe('items');
  });

  it('stores and retrieves data from localStorage', () => {
    const namespace = 'test';
    const data = [{ id: '1', title: 'Test', completed: false }];
    localStorage.clear();
    Utils.store(namespace, data);
    const stored = Utils.store(namespace);
    expect(stored).toEqual(data);
  });

  it('extends objects correctly', () => {
    const a = { a: 1 };
    const b = { b: 2 };
    const result = Utils.extend(a, b);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});


// __tests__/TodoModel.test.ts
import { TodoModel } from '../src/todoModel';

jest.mock('../src/utils', () => {
  return {
    Utils: {
      uuid: jest.fn(() => '1234'),
      pluralize: jest.requireActual('../src/utils').Utils.pluralize,
      store: jest.fn(() => []),
      extend: Object.assign
    }
  };
});

describe('TodoModel', () => {
  let model;
  beforeEach(() => {
    model = new TodoModel('test-key');
    model.onChanges = [];
  });

  it('adds a new todo', () => {
    const informSpy = jest.spyOn(model, 'inform');
    model.addTodo('New Todo');
    expect(model.todos.length).toBe(1);
    expect(model.todos[0]).toEqual({ id: '1234', title: 'New Todo', completed: false });
    expect(informSpy).toHaveBeenCalled();
  });

  it('toggles all todos', () => {
    model.todos = [
      { id: '1', title: 'a', completed: false },
      { id: '2', title: 'b', completed: true }
    ];
    const informSpy = jest.spyOn(model, 'inform');
    model.toggleAll(true);
    expect(model.todos.every(t => t.completed)).toBe(true);
    expect(informSpy).toHaveBeenCalled();
  });

  it('toggles a single todo', () => {
    const todo = { id: '1', title: 'a', completed: false };
    model.todos = [todo];
    const informSpy = jest.spyOn(model, 'inform');
    model.toggle(todo);
    expect(model.todos[0].completed).toBe(true);
    expect(informSpy).toHaveBeenCalled();
  });

  it('destroys a todo', () => {
    const todo = { id: '1', title: 'a', completed: false };
    model.todos = [todo];
    const informSpy = jest.spyOn(model, 'inform');
    model.destroy(todo);
    expect(model.todos.length).toBe(0);
    expect(informSpy).toHaveBeenCalled();
  });

  it('saves a todo', () => {
    const todo = { id: '1', title: 'a', completed: false };
    model.todos = [todo];
    const informSpy = jest.spyOn(model, 'inform');
    model.save(todo, 'updated');
    expect(model.todos[0].title).toBe('updated');
    expect(informSpy).toHaveBeenCalled();
  });

  it('clears completed todos', () => {
    model.todos = [
      { id: '1', title: 'a', completed: true },
      { id: '2', title: 'b', completed: false }
    ];
    const informSpy = jest.spyOn(model, 'inform');
    model.clearCompleted();
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].completed).toBe(false);
    expect(informSpy).toHaveBeenCalled();
  });
} );


### Tokens: {'input_tokens': 3225, 'output_tokens': 9753, 'reasoning_tokens': 3776}
### Execution time: 54.82962608337402
