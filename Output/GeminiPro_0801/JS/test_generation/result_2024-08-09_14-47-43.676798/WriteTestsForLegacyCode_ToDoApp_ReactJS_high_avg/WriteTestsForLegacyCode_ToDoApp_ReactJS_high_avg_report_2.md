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
## Run 2:
### Answer:
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

```

```typescript
// src/setupTests.ts
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

```

```typescript
// src/app.tsx
declare var Router: any;
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TodoModel } from './todoModel';
import { TodoFooter } from './footer';
import { TodoItem } from './todoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}

class TodoApp extends React.Component<IAppProps, IAppState> {
  public state: IAppState;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
    };
  }

  public componentDidMount() {
    const setState = this.setState.bind(this);
    const router = Router({
      '/': setState.bind(this, { nowShowing: ALL_TODOS }),
      '/active': setState.bind(this, { nowShowing: ACTIVE_TODOS }),
      '/completed': setState.bind(this, { nowShowing: COMPLETED_TODOS }),
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = (ReactDOM.findDOMNode(this.refs['newField']) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      (ReactDOM.findDOMNode(this.refs['newField']) as HTMLInputElement).value = '';
    }
  }

  public toggleAll(event: React.FormEvent) {
    const target: any = event.target;
    const checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle: ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo: ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo: ITodo) {
    this.setState({ editing: todo.id });
  }

  public save(todoToSave: ITodo, text: string) {
    this.props.model.save(todoToSave, text);
    this.setState({ editing: null });
  }

  public cancel() {
    this.setState({ editing: null });
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    let footer;
    let main;
    const todos = this.props.model.todos;

    const shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    const todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel.bind(this)}
        />
      );
    });

    let activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.clearCompleted.bind(this)}
        />
      );
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll.bind(this)}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">{todoItems}</ul>
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
            onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

const model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(<TodoApp model={model} />, document.getElementsByClassName('todoapp')[0]);
}

model.subscribe(render);
render();

```

```typescript
// src/todoItem.tsx
import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: (event: any) => void;
}

interface ITodoItemState {
  editText: string;
}

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
  public state: ITodoItemState;

  constructor(props: ITodoItemProps) {
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event: React.FormEvent) {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  public handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event: React.FormEvent) {
    const input: any = event.target;
    this.setState({ editText: input.value });
  }

  public shouldComponentUpdate(nextProps: ITodoItemProps, nextState: ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  public componentDidUpdate(prevProps: ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      const node = ReactDOM.findDOMNode(this.refs['editField']) as HTMLInputElement;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  public render() {
    return (
      <li
        className={classNames({
          completed: this.props.todo.completed,
          editing: this.props.editing,
        })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this.handleEdit.bind(this)}>{this.props.todo.title}</label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </li>
    );
  }
}

export { TodoItem };

```

```typescript
// src/utils.ts
class Utils {
  public static uuid(): string {
    let i;
    let random;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs: any[]): any {
    const newObj = {};
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      for (const key in obj) {
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

```typescript
// src/footer.tsx
import * as classNames from 'classnames';
import * as React from 'react';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

class TodoFooter extends React.Component<ITodoFooterProps, {}> {
  public render() {
    const activeTodoWord = Utils.pluralize(this.props.count, 'item');
    let clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button className="clear-completed" onClick={this.props.onClearCompleted}>
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
            <a href="#/" className={classNames({ selected: nowShowing === ALL_TODOS })}>
              All
            </a>
          </li>
          {' '}
          <li>
            <a href="#/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
              Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            >
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

```typescript
// src/constants.ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

```typescript
// src/todoModel.ts
import { Utils } from './utils';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<any>;

  subscribe(onChange: () => void): void;
  inform(): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}

class TodoModel implements ITodoModel {
  public key: string;
  public todos: Array<ITodo>;
  public onChanges: Array<any>;

  constructor(key: string) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange: () => void) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) {
      cb();
    });
  }

  public addTodo(title: string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false,
    });

    this.inform();
  }

  public toggleAll(checked: boolean) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return Utils.extend({}, todo, { completed: checked });
    });

    this.inform();
  }

  public toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return todo !== todoToToggle ? todo : Utils.extend({}, todo, { completed: !todo.completed });
    });

    this.inform();
  }

  public destroy(todo: ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text });
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

```typescript
// src/app.test.tsx
import React from 'react';
import { shallow, mount } from 'enzyme';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';

describe('TodoApp Component', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('react-todos');
  });

  it('should render correctly', () => {
    const component = shallow(<TodoApp model={model} />);
    expect(component).toMatchSnapshot();
  });

  it('should add new todo on handleNewTodoKeyDown', () => {
    const component = mount(<TodoApp model={model} />);
    const input = component.find('input.new-todo');
    input.simulate('change', { target: { value: 'New todo' } });
    input.simulate('keydown', { keyCode: 13 });
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('New todo');
  });

  it('should toggle all todos on toggleAll', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    const component = mount(<TodoApp model={model} />);
    const toggleAllCheckbox = component.find('input#toggle-all');
    toggleAllCheckbox.simulate('change', { target: { checked: true } });
    expect(model.todos.every((todo) => todo.completed)).toBe(true);
  });

  it('should toggle a todo on toggle', () => {
    model.addTodo('Todo 1');
    const component = mount(<TodoApp model={model} />);
    const toggleCheckbox = component.find('input.toggle').at(0);
    toggleCheckbox.simulate('change');
    expect(model.todos[0].completed).toBe(true);
  });

  it('should destroy a todo on destroy', () => {
    model.addTodo('Todo 1');
    const component = mount(<TodoApp model={model} />);
    const destroyButton = component.find('button.destroy').at(0);
    destroyButton.simulate('click');
    expect(model.todos.length).toBe(0);
  });

  it('should edit a todo on edit', () => {
    model.addTodo('Todo 1');
    const component = mount(<TodoApp model={model} />);
    const label = component.find('label').at(0);
    label.simulate('doubleClick');
    const editInput = component.find('input.edit').at(0);
    editInput.simulate('change', { target: { value: 'Edited todo' } });
    editInput.simulate('blur');
    expect(model.todos[0].title).toBe('Edited todo');
  });

  it('should cancel editing a todo on cancel', () => {
    model.addTodo('Todo 1');
    const component = mount(<TodoApp model={model} />);
    const label = component.find('label').at(0);
    label.simulate('doubleClick');
    const editInput = component.find('input.edit').at(0);
    editInput.simulate('change', { target: { value: 'Edited todo' } });
    component.find('TodoItem').at(0).props().onCancel({ keyCode: 27 });
    expect(model.todos[0].title).toBe('Todo 1');
  });

  it('should clear completed todos on clearCompleted', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggle(model.todos[0]);
    const component = mount(<TodoApp model={model} />);
    const clearCompletedButton = component.find('button.clear-completed');
    clearCompletedButton.simulate('click');
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].completed).toBe(false);
  });
});

```

```typescript
// src/todoItem.test.tsx
import React from 'react';
import { shallow, mount } from 'enzyme';
import { TodoItem } from './todoItem';

describe('TodoItem Component', () => {
  let todo: any;
  let onToggle: jest.Mock;
  let onDestroy: jest.Mock;
  let onEdit: jest.Mock;
  let onSave: jest.Mock;
  let onCancel: jest.Mock;

  beforeEach(() => {
    todo = { id: 1, title: 'Test Todo', completed: false };
    onToggle = jest.fn();
    onDestroy = jest.fn();
    onEdit = jest.fn();
    onSave = jest.fn();
    onCancel = jest.fn();
  });

  it('should render correctly', () => {
    const component = shallow(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={false}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should call onToggle when checkbox is clicked', () => {
    const component = shallow(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={false}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    component.find('input.toggle').simulate('change');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDestroy when destroy button is clicked', () => {
    const component = shallow(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={false}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    component.find('button.destroy').simulate('click');
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when label is double clicked', () => {
    const component = shallow(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={false}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    component.find('label').simulate('doubleClick');
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when editing is finished', () => {
    const component = mount(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={true}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    component.find('input.edit').simulate('change', { target: { value: 'Edited Todo' } });
    component.find('input.edit').simulate('blur');
    expect(onSave).toHaveBeenCalledWith('Edited Todo');
  });

  it('should call onCancel when editing is cancelled', () => {
    const component = mount(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        editing={true}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    component.find('input.edit').simulate('keydown', { keyCode: ESCAPE_KEY });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

```

```typescript
// src/footer.test.tsx
import React from 'react';
import { shallow } from 'enzyme';
import { TodoFooter } from './footer';

describe('TodoFooter Component', () => {
  it('should render correctly with no completed todos', () => {
    const component = shallow(
      <TodoFooter count={1} completedCount={0} nowShowing="all" onClearCompleted={jest.fn()} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correctly with completed todos', () => {
    const component = shallow(
      <TodoFooter count={1} completedCount={1} nowShowing="all" onClearCompleted={jest.fn()} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should call onClearCompleted when clear button is clicked', () => {
    const onClearCompleted = jest.fn();
    const component = shallow(
      <TodoFooter count={1} completedCount={1} nowShowing="all" onClearCompleted={onClearCompleted} />
    );
    component.find('button.clear-completed').simulate('click');
    expect(onClearCompleted).toHaveBeenCalledTimes(1);
  });
});

```

```typescript
// src/utils.test.ts
import { Utils } from './utils';

describe('Utils', () => {
  it('should create a UUID', () => {
    const uuid = Utils.uuid();
    expect(uuid).toBeDefined();
    expect(uuid.length).toBe(36);
  });

  it('should pluralize correctly', () => {
    expect(Utils.pluralize(0, 'item')).toBe('items');
    expect(Utils.pluralize(1, 'item')).toBe('item');
    expect(Utils.pluralize(2, 'item')).toBe('items');
  });

  it('should store and retrieve data from localStorage', () => {
    const namespace = 'testNamespace';
    const data = { test: 'data' };
    Utils.store(namespace, data);
    const retrievedData = Utils.store(namespace);
    expect(retrievedData).toEqual(data);
  });

  it('should extend an object', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const extendedObj = Utils.extend(obj1, obj2);
    expect(extendedObj).toEqual({ a: 1, b: 3, c: 4 });
  });
});

```

```typescript
// src/todoModel.test.ts
import { TodoModel } from './todoModel';

describe('TodoModel', () => {
  let model: TodoModel;

  beforeEach(() => {
    localStorage.clear();
    model = new TodoModel('test');
  });

  it('should add a new todo', () => {
    model.addTodo('Test Todo');
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('Test Todo');
  });

  it('should toggle all todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggleAll(true);
    expect(model.todos.every((todo) => todo.completed)).toBe(true);
    model.toggleAll(false);
    expect(model.todos.every((todo) => !todo.completed)).toBe(true);
  });

  it('should toggle a specific todo', () => {
    model.addTodo('Todo 1');
    model.toggle(model.todos[0]);
    expect(model.todos[0].completed).toBe(true);
    model.toggle(model.todos[0]);
    expect(model.todos[0].completed).toBe(false);
  });

  it('should destroy a todo', () => {
    model.addTodo('Todo 1');
    model.destroy(model.todos[0]);
    expect(model.todos.length).toBe(0);
  });

  it('should save a todo', () => {
    model.addTodo('Todo 1');
    model.save(model.todos[0], 'Updated Todo');
    expect(model.todos[0].title).toBe('Updated Todo');
  });

  it('should clear completed todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggle(model.todos[0]);
    model.clearCompleted();
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].completed).toBe(false);
  });

  it('should subscribe and inform listeners', () => {
    const listener = jest.fn();
    model.subscribe(listener);
    model.addTodo('Test Todo');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

```

### Tokens: {'input_tokens': 3767, 'output_tokens': 6678}
### Execution time: 125.61603498458862
