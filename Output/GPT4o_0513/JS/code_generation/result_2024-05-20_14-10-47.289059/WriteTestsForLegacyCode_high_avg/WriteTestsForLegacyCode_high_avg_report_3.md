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
## Run 3:
### Answer:
```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
    "classnames": "^2.3.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@types/jest": "^27.0.1",
    "@types/react": "^17.0.21",
    "@types/react-dom": "^17.0.9",
    "@types/classnames": "^2.3.1",
    "jest": "^27.0.6",
    "ts-jest": "^27.0.5",
    "typescript": "^4.3.5"
  }
}
```

jest.config.js
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  }
};
```

setupTests.ts
```ts
import '@testing-library/jest-dom';
```

__mocks__/styleMock.js
```js
module.exports = {};
```

__tests__/app.test.tsx
```tsx
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoApp } from '../app';
import { TodoModel } from '../todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoApp', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('react-todos');
  });

  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp model={model} />);
    expect(getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(getByText('todos')).toBeInTheDocument();
  });

  test('adds a new todo', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp model={model} />);
    const input = getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(getByText('New Todo')).toBeInTheDocument();
  });

  test('toggles all todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    const { getByLabelText } = render(<TodoApp model={model} />);
    const toggleAll = getByLabelText('Mark all as complete');
    fireEvent.click(toggleAll);
    expect(model.todos.every(todo => todo.completed)).toBe(true);
  });

  test('clears completed todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggleAll(true);
    const { getByText } = render(<TodoApp model={model} />);
    const clearCompleted = getByText('Clear completed');
    fireEvent.click(clearCompleted);
    expect(model.todos.length).toBe(0);
  });
});
```

__tests__/todoItem.test.tsx
```tsx
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoItem } from '../todoItem';
import { ITodo } from '../interfaces';

describe('TodoItem', () => {
  let todo: ITodo;
  let onToggle: jest.Mock;
  let onDestroy: jest.Mock;
  let onEdit: jest.Mock;
  let onSave: jest.Mock;
  let onCancel: jest.Mock;

  beforeEach(() => {
    todo = { id: '1', title: 'Test Todo', completed: false };
    onToggle = jest.fn();
    onDestroy = jest.fn();
    onEdit = jest.fn();
    onSave = jest.fn();
    onCancel = jest.fn();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
      />
    );
    expect(getByText('Test Todo')).toBeInTheDocument();
  });

  test('toggles todo', () => {
    const { getByRole } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
      />
    );
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalled();
  });

  test('destroys todo', () => {
    const { getByRole } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
      />
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onDestroy).toHaveBeenCalled();
  });

  test('edits todo', () => {
    const { getByText } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
      />
    );
    const label = getByText('Test Todo');
    fireEvent.doubleClick(label);
    expect(onEdit).toHaveBeenCalled();
  });

  test('saves todo', () => {
    const { getByDisplayValue } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={true}
      />
    );
    const input = getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(onSave).toHaveBeenCalledWith('Updated Todo');
  });

  test('cancels edit', () => {
    const { getByDisplayValue } = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={true}
      />
    );
    const input = getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });
    expect(onCancel).toHaveBeenCalled();
  });
});
```

__tests__/footer.test.tsx
```tsx
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoFooter } from '../footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoFooter', () => {
  let onClearCompleted: jest.Mock;

  beforeEach(() => {
    onClearCompleted = jest.fn();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={onClearCompleted}
      />
    );
    expect(getByText('1 item left')).toBeInTheDocument();
    expect(getByText('Clear completed')).toBeInTheDocument();
  });

  test('clears completed todos', () => {
    const { getByText } = render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={onClearCompleted}
      />
    );
    const button = getByText('Clear completed');
    fireEvent.click(button);
    expect(onClearCompleted).toHaveBeenCalled();
  });

  test('filters todos', () => {
    const { getByText } = render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={onClearCompleted}
      />
    );
    const allFilter = getByText('All');
    const activeFilter = getByText('Active');
    const completedFilter = getByText('Completed');
    expect(allFilter).toHaveClass('selected');
    fireEvent.click(activeFilter);
    expect(activeFilter).toHaveClass('selected');
    fireEvent.click(completedFilter);
    expect(completedFilter).toHaveClass('selected');
  });
});
```

__tests__/utils.test.ts
```ts
import { Utils } from '../utils';

describe('Utils', () => {
  test('uuid generates a unique id', () => {
    const id1 = Utils.uuid();
    const id2 = Utils.uuid();
    expect(id1).not.toBe(id2);
  });

  test('pluralize returns correct pluralization', () => {
    expect(Utils.pluralize(1, 'item')).toBe('item');
    expect(Utils.pluralize(2, 'item')).toBe('items');
  });

  test('store saves and retrieves data from localStorage', () => {
    const namespace = 'test';
    const data = [{ id: 1, title: 'Test' }];
    Utils.store(namespace, data);
    expect(Utils.store(namespace)).toEqual(data);
  });

  test('extend merges objects correctly', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const result = Utils.extend(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
```

__tests__/todoModel.test.ts
```ts
import { TodoModel } from '../todoModel';
import { ITodo } from '../interfaces';

describe('TodoModel', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('react-todos');
  });

  test('adds a new todo', () => {
    model.addTodo('New Todo');
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('New Todo');
  });

  test('toggles all todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggleAll(true);
    expect(model.todos.every(todo => todo.completed)).toBe(true);
  });

  test('toggles a todo', () => {
    model.addTodo('Todo 1');
    const todo = model.todos[0];
    model.toggle(todo);
    expect(todo.completed).toBe(true);
  });

  test('destroys a todo', () => {
    model.addTodo('Todo 1');
    const todo = model.todos[0];
    model.destroy(todo);
    expect(model.todos.length).toBe(0);
  });

  test('saves a todo', () => {
    model.addTodo('Todo 1');
    const todo = model.todos[0];
    model.save(todo, 'Updated Todo');
    expect(todo.title).toBe('Updated Todo');
  });

  test('clears completed todos', () => {
    model.addTodo('Todo 1');
    model.addTodo('Todo 2');
    model.toggleAll(true);
    model.clearCompleted();
    expect(model.todos.length).toBe(0);
  });
});
```

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

export { TodoApp };
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
      nextState

### Tokens: {'input_tokens': 3226, 'output_tokens': 4096}
### Execution time: 53.138367891311646