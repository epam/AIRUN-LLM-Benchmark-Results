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

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
**jest.config.js**
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
```

**package.json**
```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "dependencies": {
    "classnames": "^2.2.6",
    "react": "^17.0.1",
    "react-dom": "^17.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^11.2.2",
    "@types/classnames": "^2.2.10",
    "@types/jest": "^26.0.20",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "jest": "^26.6.3",
    "ts-jest": "^26.4.4",
    "typescript": "^4.1.3"
  }
}
```

**src/app.tsx**
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

export { TodoApp };

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

**src/constants.ts**
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

**src/footer.tsx**
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

**src/todoItem.tsx**
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

```

**src/todoModel.ts**
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

**src/utils.ts**
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

**__tests__/utils.test.ts**
```ts
import { Utils } from '../utils';

describe('Utils', () => {
  describe('uuid', () => {
    it('should generate a valid UUID', () => {
      const uuid = Utils.uuid();
      expect(uuid).toMatch(/[a-f0-9\-]{36}/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = Utils.uuid();
      const uuid2 = Utils.uuid();
      expect(uuid1).not.toEqual(uuid2);
    });
  });

  describe('pluralize', () => {
    it('should return singular word when count is 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural word when count is not 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should store data in localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      Utils.store('testNamespace', data);
      expect(localStorage.getItem('testNamespace')).toEqual(JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      localStorage.setItem('testNamespace', JSON.stringify(data));
      const result = Utils.store('testNamespace');
      expect(result).toEqual(data);
    });

    it('should return empty array if no data in localStorage', () => {
      const result = Utils.store('unknownNamespace');
      expect(result).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should merge multiple objects into one', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = Utils.extend({}, obj1, obj2);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should not modify the original objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = Utils.extend({}, obj1, obj2);
      expect(obj1).toEqual({ a: 1 });
      expect(obj2).toEqual({ b: 2 });
    });
  });
});
```

**__tests__/todoModel.test.ts**
```ts
import { TodoModel } from '../todoModel';
import { Utils } from '../utils';

jest.mock('../utils');

describe('TodoModel', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    (Utils.store as jest.Mock).mockClear();
    todoModel = new TodoModel('test-todos');
  });

  it('should initialize with empty todos', () => {
    expect(todoModel.todos).toEqual([]);
  });

  it('should add a new todo', () => {
    const title = 'Test todo';
    todoModel.addTodo(title);
    expect(todoModel.todos.length).toBe(1);
    expect(todoModel.todos[0].title).toBe(title);
    expect(todoModel.todos[0].completed).toBe(false);
  });

  it('should toggle all todos', () => {
    todoModel.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false },
    ];
    todoModel.toggleAll(true);
    expect(todoModel.todos.every(todo => todo.completed)).toBe(true);

    todoModel.toggleAll(false);
    expect(todoModel.todos.every(todo => !todo.completed)).toBe(true);
  });

  it('should toggle a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    todoModel.todos = [todo];
    todoModel.toggle(todo);
    expect(todoModel.todos[0].completed).toBe(true);
  });

  it('should destroy a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    todoModel.todos = [todo];
    todoModel.destroy(todo);
    expect(todoModel.todos.length).toBe(0);
  });

  it('should save a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    todoModel.todos = [todo];
    todoModel.save(todo, 'Updated Todo');
    expect(todoModel.todos[0].title).toBe('Updated Todo');
  });

  it('should clear completed todos', () => {
    todoModel.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    todoModel.clearCompleted();
    expect(todoModel.todos.length).toBe(1);
    expect(todoModel.todos[0].id).toBe('1');
  });

  it('should call inform when changes occur', () => {
    const informSpy = jest.spyOn(todoModel, 'inform');
    todoModel.addTodo('Test todo');
    expect(informSpy).toHaveBeenCalled();
  });

  it('should subscribe and call onChanges', () => {
    const callback = jest.fn();
    todoModel.subscribe(callback);
    todoModel.addTodo('Test todo');
    expect(callback).toHaveBeenCalled();
  });
});
```

**__tests__/app.test.tsx**
```tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TodoApp } from '../app';
import { TodoModel } from '../todoModel';

describe('TodoApp', () => {
  let model: TodoModel;

  beforeEach(() => {
    (window as any).Router = jest.fn().mockReturnValue({
      init: jest.fn(),
    });
    model = new TodoModel('test-app');
  });

  test('renders the app correctly', () => {
    render(<TodoApp model={model} />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  test('adds a new todo', () => {
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(model.todos.length).toBe(1);
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });

  test('toggles a todo', () => {
    model.addTodo('Test Todo');
    render(<TodoApp model={model} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(model.todos[0].completed).toBe(true);
  });

  test('deletes a todo', () => {
    model.addTodo('Test Todo');
    render(<TodoApp model={model} />);
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    expect(model.todos.length).toBe(0);
  });

  test('filters active todos', () => {
    model.addTodo('Completed Todo');
    model.todos[0].completed = true;
    model.addTodo('Active Todo');
    render(<TodoApp model={model} />);
    const activeLink = screen.getByText('Active');
    fireEvent.click(activeLink);
    expect(screen.getByText('Active Todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument();
  });

  test('filters completed todos', () => {
    model.addTodo('Completed Todo');
    model.todos[0].completed = true;
    model.addTodo('Active Todo');
    render(<TodoApp model={model} />);
    const completedLink = screen.getByText('Completed');
    fireEvent.click(completedLink);
    expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    expect(screen.queryByText('Active Todo')).not.toBeInTheDocument();
  });

  test('clears completed todos', () => {
    model.addTodo('Completed Todo');
    model.todos[0].completed = true;
    render(<TodoApp model={model} />);
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    expect(model.todos.length).toBe(0);
  });
});
```

**__tests__/footer.test.tsx**
```tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TodoFooter } from '../footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoFooter', () => {
  const defaultProps = {
    count: 2,
    completedCount: 1,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn(),
  };

  test('renders correctly', () => {
    render(<TodoFooter {...defaultProps} />);
    expect(screen.getByText('2 items left')).toBeInTheDocument();
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  test('calls onClearCompleted when clear button is clicked', () => {
    render(<TodoFooter {...defaultProps} />);
    const clearButton = screen.getByText('Clear completed');
    fireEvent.click(clearButton);
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });

  test('highlights the selected filter', () => {
    const { rerender } = render(<TodoFooter {...defaultProps} nowShowing={ALL_TODOS} />);
    expect(screen.getByText('All').className).toContain('selected');

    rerender(<TodoFooter {...defaultProps} nowShowing={ACTIVE_TODOS} />);
    expect(screen.getByText('Active').className).toContain('selected');

    rerender(<TodoFooter {...defaultProps} nowShowing={COMPLETED_TODOS} />);
    expect(screen.getByText('Completed').className).toContain('selected');
  });

  test('does not render clear button when no completed todos', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />);
    expect(screen.queryByText('Clear completed')).toBeNull();
  });
});
```

**__tests__/todoItem.test.tsx**
```tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TodoItem } from '../todoItem';

describe('TodoItem', () => {
  const todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };

  const defaultProps = {
    todo,
    editing: false,
    onToggle: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  test('renders correctly', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  test('calls onDestroy when destroy button is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  test('calls onEdit when label is double clicked', () => {
    render(<TodoItem {...defaultProps} />);
    const label = screen.getByText('Test Todo');
    fireEvent.doubleClick(label);
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  test('shows input field when editing', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    expect(input).toBeInTheDocument();
  });

  test('calls onSave on input blur', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.blur(input);
    expect(defaultProps.onSave).toHaveBeenCalledWith('Test Todo');
  });

  test('updates editText state on input change', () => {
    const { getByDisplayValue } = render(<TodoItem {...defaultProps} editing={true} />);
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    expect(input.value).toBe('Updated Todo');
  });

  test('calls onCancel on ESCAPE key down', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  test('calls handleSubmit on ENTER key down', () => {
    const onSaveMock = jest.fn();
    render(<TodoItem {...defaultProps} editing={true} onSave={onSaveMock} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(onSaveMock).toHaveBeenCalledWith('Test Todo');
  });
});
```

### Tokens: {'input_tokens': 3321, 'output_tokens': 11503, 'reasoning_tokens': 5376}
### Execution time: 99.20501899719238
