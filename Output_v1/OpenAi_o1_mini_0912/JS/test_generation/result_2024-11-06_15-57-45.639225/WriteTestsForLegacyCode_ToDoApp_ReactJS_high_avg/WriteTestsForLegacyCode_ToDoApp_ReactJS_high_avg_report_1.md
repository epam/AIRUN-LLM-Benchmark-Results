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
```json
// package.json
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "jest": "^29.6.1",
    "jest-environment-jsdom": "^29.6.1",
    "ts-jest": "^29.1.0",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "classnames": "^2.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "router": "^1.3.4"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/utils.ts'
  ]
};
```

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

```typescript
// src/__tests__/app.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoApp } from '../app';
import { TodoModel } from '../todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';

jest.mock('../todoModel');

describe('TodoApp', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('test-key');
    (model.todos as any) = [];
    (model.subscribe as jest.Mock).mockImplementation((cb) => cb());
  });

  test('renders without crashing', () => {
    render(<TodoApp model={model} />);
  });

  test('adds a new todo on Enter key press', () => {
    const { getByPlaceholderText } = render(<TodoApp model={model} />);
    const input = getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: ENTER_KEY });
    expect(model.addTodo).toHaveBeenCalledWith('New Todo');
    expect(input.value).toBe('');
  });

  test('does not add todo on non-Enter key press', () => {
    const { getByPlaceholderText } = render(<TodoApp model={model} />);
    const input = getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'a', keyCode: 65 });
    expect(model.addTodo).not.toHaveBeenCalled();
  });

  test('toggles all todos', () => {
    const { getByLabelText } = render(<TodoApp model={model} />);
    const toggleAll = getByLabelText('Mark all as complete') as HTMLInputElement;
    fireEvent.change(toggleAll, { target: { checked: true } });
    expect(model.toggleAll).toHaveBeenCalledWith(true);
  });

  test('renders footer when there are todos', () => {
    (model.todos as any) = [{ id: '1', title: 'Test', completed: false }];
    const { getByText } = render(<TodoApp model={model} />);
    expect(getByText('1 item left')).toBeInTheDocument();
  });

  test('renders main section when there are todos', () => {
    (model.todos as any) = [{ id: '1', title: 'Test', completed: false }];
    const { getByLabelText } = render(<TodoApp model={model} />);
    expect(getByLabelText('Mark all as complete')).toBeInTheDocument();
  });

  test('clears completed todos', () => {
    const { getByText } = render(<TodoApp model={model} />);
    fireEvent.click(getByText('Clear completed'));
    expect(model.clearCompleted).toHaveBeenCalled();
  });
});
```

```typescript
// src/__tests__/footer.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoFooter } from '../footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoFooter', () => {
  test('renders the correct count and pluralizes correctly', () => {
    const { getByText } = render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(getByText('1 item left')).toBeInTheDocument();
  });

  test('renders "Clear completed" button when there are completed todos', () => {
    const { getByText } = render(
      <TodoFooter
        count={2}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(getByText('Clear completed')).toBeInTheDocument();
  });

  test('does not render "Clear completed" button when there are no completed todos', () => {
    const { queryByText } = render(
      <TodoFooter
        count={2}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(queryByText('Clear completed')).toBeNull();
  });

  test('calls onClearCompleted when "Clear completed" button is clicked', () => {
    const onClearCompleted = jest.fn();
    const { getByText } = render(
      <TodoFooter
        count={2}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={onClearCompleted}
      />
    );
    fireEvent.click(getByText('Clear completed'));
    expect(onClearCompleted).toHaveBeenCalled();
  });

  test('highlights the correct filter', () => {
    const { getByText } = render(
      <TodoFooter
        count={2}
        completedCount={1}
        nowShowing={ACTIVE_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(getByText('Active')).toHaveClass('selected');
    expect(getByText('All')).not.toHaveClass('selected');
    expect(getByText('Completed')).not.toHaveClass('selected');
  });
});
```

```typescript
// src/__tests__/todoItem.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoItem } from '../todoItem';

describe('TodoItem', () => {
  const todo = { id: '1', title: 'Test Todo', completed: false };
  const onToggle = jest.fn();
  const onDestroy = jest.fn();
  const onEdit = jest.fn();
  const onSave = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo correctly', () => {
    const { getByText, getByRole } = render(
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
    expect(getByText('Test Todo')).toBeInTheDocument();
    expect(getByRole('checkbox')).not.toBeChecked();
  });

  test('calls onToggle when checkbox is clicked', () => {
    const { getByRole } = render(
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
    fireEvent.click(getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalled();
  });

  test('calls onDestroy when destroy button is clicked', () => {
    const { getByRole } = render(
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
    fireEvent.click(getByRole('button', { name: /destroy/i }));
    expect(onDestroy).toHaveBeenCalled();
  });

  test('enters editing mode on double click', () => {
    const { getByText, getByDisplayValue } = render(
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
    fireEvent.doubleClick(getByText('Test Todo'));
    expect(onEdit).toHaveBeenCalled();
    expect(getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  test('saves edited todo on Enter key', () => {
    const { getByDisplayValue } = render(
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
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(onSave).toHaveBeenCalledWith('Updated Todo');
  });

  test('cancels editing on Escape key', () => {
    const { getByDisplayValue } = render(
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
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });
    expect(onCancel).toHaveBeenCalled();
    expect(input.value).toBe('Test Todo');
  });

  test('calls onSave on blur', () => {
    const { getByDisplayValue } = render(
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
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.blur(input);
    expect(onSave).toHaveBeenCalledWith('Test Todo');
  });

  test('calls onDestroy if edited title is empty on submit', () => {
    const { getByDisplayValue } = render(
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
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    expect(onDestroy).toHaveBeenCalled();
  });
});
```

```typescript
// src/__tests__/todoModel.test.ts
import { TodoModel } from '../todoModel';
import { Utils } from '../utils';

jest.mock('../utils');

describe('TodoModel', () => {
  let model: TodoModel;

  beforeEach(() => {
    (Utils.store as jest.Mock).mockReturnValue([]);
    model = new TodoModel('test-key');
    model.onChanges = [];
    jest.clearAllMocks();
  });

  test('initializes with empty todos', () => {
    expect(model.todos).toEqual([]);
  });

  test('adds a todo', () => {
    model.addTodo('New Todo');
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].title).toBe('New Todo');
    expect(Utils.store).toHaveBeenCalled();
  });

  test('toggles all todos to completed', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false }
    ];
    model.toggleAll(true);
    expect(model.todos.every(todo => todo.completed)).toBe(true);
    expect(Utils.store).toHaveBeenCalled();
  });

  test('toggles a single todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    model.toggle(todo);
    expect(model.todos[0].completed).toBe(true);
    expect(Utils.store).toHaveBeenCalled();
  });

  test('destroys a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    model.destroy(todo);
    expect(model.todos.length).toBe(0);
    expect(Utils.store).toHaveBeenCalled();
  });

  test('saves a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    model.save(todo, 'Updated Todo');
    expect(model.todos[0].title).toBe('Updated Todo');
    expect(Utils.store).toHaveBeenCalled();
  });

  test('clears completed todos', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: true },
      { id: '2', title: 'Todo 2', completed: false }
    ];
    model.clearCompleted();
    expect(model.todos.length).toBe(1);
    expect(model.todos[0].id).toBe('2');
    expect(Utils.store).toHaveBeenCalled();
  });

  test('subscribes and informs', () => {
    const callback = jest.fn();
    model.subscribe(callback);
    model.addTodo('New Todo');
    expect(callback).toHaveBeenCalled();
  });
});
```

```typescript
// src/__tests__/utils.test.ts
import { Utils } from '../utils';

describe('Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('generates a uuid of correct length', () => {
    const uuid = Utils.uuid();
    expect(uuid).toHaveLength(36);
    expect(uuid[8]).toBe('-');
    expect(uuid[13]).toBe('-');
    expect(uuid[18]).toBe('-');
    expect(uuid[23]).toBe('-');
  });

  test('pluralizes correctly', () => {
    expect(Utils.pluralize(1, 'item')).toBe('item');
    expect(Utils.pluralize(0, 'item')).toBe('items');
    expect(Utils.pluralize(2, 'item')).toBe('items');
  });

  test('stores and retrieves data from localStorage', () => {
    const data = [{ id: '1', title: 'Test', completed: false }];
    Utils.store('test-key', data);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(data));
    const retrieved = Utils.store('test-key');
    expect(retrieved).toEqual(data);
  });

  test('extends objects correctly', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const extended = Utils.extend(obj1, obj2);
    expect(extended).toEqual({ a: 1, b: 2 });
  });
});
```

```typescript
// src/__tests__/footer.test.tsx
// (Duplicate, remove if necessary)
```

```typescript
// src/app.tsx
declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

interface IAppProps {
  model: TodoModel;
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
    var setState = this.setState.bind(this);
    var router = Router({
      '/': () => setState({ nowShowing: ALL_TODOS }),
      '/active': () => setState({ nowShowing: ACTIVE_TODOS }),
      '/completed': () => setState({ nowShowing: COMPLETED_TODOS })
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

  public save(todoToSave : any, text : String) {
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
```

```typescript
// src/__tests__/routerMock.ts
global.Router = jest.fn(() => ({
  init: jest.fn(),
}));
```

```typescript
// src/__tests__/footer.test.tsx
// (Already provided above)
```

```typescript
// src/footer.tsx
import * as classNames from "classnames";
import * as React from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { Utils } from "./utils";

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
```

```typescript
// src/__tests__/todoItem.test.tsx
// (Already provided above)
```

```typescript
// src/todoItem.tsx
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";

interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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

  public handleKeyDown(event : React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event : React.FormEvent<HTMLInputElement>) {
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

```typescript
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
  onChanges: Array<() => void>;
  subscribe: (onChange: () => void) => void;
  inform: () => void;
  addTodo: (title: string) => void;
  toggleAll: (checked: boolean) => void;
  toggle: (todoToToggle: ITodo) => void;
  destroy: (todo: ITodo) => void;
  save: (todoToSave: ITodo, text: string) => void;
  clearCompleted: () => void;
}

class TodoModel implements ITodoModel {
  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<() => void>;

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

  public toggleAll(checked : boolean) {
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
export type { ITodo };
```

```typescript
// src/__tests__/utils.test.ts
// (Already provided above)
```

```typescript
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
// src/__tests__/app.test.tsx
// (Already provided above)
```

```typescript
// src/index.tsx
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import * as React from "react";
import * as ReactDOM from "react-dom";

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

### Tokens: {'input_tokens': 3321, 'output_tokens': 7577, 'reasoning_tokens': 448}
### Execution time: 42.174331188201904
