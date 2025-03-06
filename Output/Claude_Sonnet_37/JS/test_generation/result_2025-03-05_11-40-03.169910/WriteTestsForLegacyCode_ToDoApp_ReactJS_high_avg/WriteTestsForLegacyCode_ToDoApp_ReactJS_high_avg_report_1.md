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
# Setting up the testing environment

First, let's create the necessary configuration files for our testing setup.

**jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**setupTests.ts**
```typescript
import '@testing-library/jest-dom';
```

**package.json** (dependencies to add)
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.5",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "ts-jest": "^29.0.5"
  }
}
```

# Test Files

**utils.test.ts**
```typescript
import { Utils } from './utils';

describe('Utils', () => {
  describe('uuid', () => {
    it('should generate a valid uuid', () => {
      const uuid = Utils.uuid();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
  });

  describe('pluralize', () => {
    it('should return singular form when count is 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural form when count is not 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.spyOn(localStorage, 'getItem');
      jest.spyOn(localStorage, 'setItem');
    });

    it('should store data in localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      Utils.store('test-namespace', data);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-namespace', JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const data = [{ id: '1', title: 'Test', completed: false }];
      localStorage.setItem('test-namespace', JSON.stringify(data));
      const result = Utils.store('test-namespace');
      expect(localStorage.getItem).toHaveBeenCalledWith('test-namespace');
      expect(result).toEqual(data);
    });

    it('should return empty array if no data in localStorage', () => {
      const result = Utils.store('empty-namespace');
      expect(result).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { d: 5 };
      const result = Utils.extend(obj1, obj2, obj3);
      expect(result).toEqual({ a: 1, b: 3, c: 4, d: 5 });
    });

    it('should handle empty objects', () => {
      const result = Utils.extend({}, { a: 1 }, {});
      expect(result).toEqual({ a: 1 });
    });
  });
});
```

**todoModel.test.ts**
```typescript
import { TodoModel } from './todoModel';
import { Utils } from './utils';

jest.mock('./utils', () => ({
  Utils: {
    uuid: jest.fn().mockReturnValue('test-uuid'),
    store: jest.fn(),
    extend: jest.fn((_, todo, updates) => ({ ...todo, ...updates }))
  }
}));

describe('TodoModel', () => {
  let model: TodoModel;
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (Utils.store as jest.Mock).mockReturnValue([]);
    mockOnChange = jest.fn();
    model = new TodoModel('test-key');
    model.subscribe(mockOnChange);
  });

  it('should initialize with the correct key and empty todos', () => {
    expect(model.key).toBe('test-key');
    expect(model.todos).toEqual([]);
    expect(model.onChanges).toEqual([mockOnChange]);
  });

  it('should subscribe to changes', () => {
    const anotherCallback = jest.fn();
    model.subscribe(anotherCallback);
    expect(model.onChanges).toEqual([mockOnChange, anotherCallback]);
  });

  it('should inform subscribers when todos change', () => {
    model.inform();
    expect(Utils.store).toHaveBeenCalledWith('test-key', []);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should add a todo', () => {
    model.addTodo('Test Todo');
    expect(model.todos).toEqual([
      { id: 'test-uuid', title: 'Test Todo', completed: false }
    ]);
    expect(Utils.uuid).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should toggle all todos', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true }
    ];

    model.toggleAll(true);
    
    expect(Utils.extend).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalled();
    expect(model.todos.every(todo => todo.completed)).toBe(true);
  });

  it('should toggle a specific todo', () => {
    const todo1 = { id: '1', title: 'Todo 1', completed: false };
    const todo2 = { id: '2', title: 'Todo 2', completed: true };
    model.todos = [todo1, todo2];

    model.toggle(todo1);
    
    expect(Utils.extend).toHaveBeenCalledWith({}, todo1, { completed: true });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should destroy a todo', () => {
    const todo1 = { id: '1', title: 'Todo 1', completed: false };
    const todo2 = { id: '2', title: 'Todo 2', completed: true };
    model.todos = [todo1, todo2];

    model.destroy(todo1);
    
    expect(model.todos).toEqual([todo2]);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should save a todo with new text', () => {
    const todo1 = { id: '1', title: 'Todo 1', completed: false };
    const todo2 = { id: '2', title: 'Todo 2', completed: true };
    model.todos = [todo1, todo2];

    model.save(todo1, 'Updated Todo');
    
    expect(Utils.extend).toHaveBeenCalledWith({}, todo1, { title: 'Updated Todo' });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should clear completed todos', () => {
    const todo1 = { id: '1', title: 'Todo 1', completed: false };
    const todo2 = { id: '2', title: 'Todo 2', completed: true };
    model.todos = [todo1, todo2];

    model.clearCompleted();
    
    expect(model.todos).toEqual([todo1]);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
```

**footer.test.tsx**
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from './footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

jest.mock('./utils', () => ({
  Utils: {
    pluralize: jest.fn((count, word) => count === 1 ? word : word + 's')
  }
}));

describe('TodoFooter', () => {
  const defaultProps = {
    count: 0,
    completedCount: 0,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the correct count of active items', () => {
    render(<TodoFooter {...defaultProps} count={1} />);
    expect(Utils.pluralize).toHaveBeenCalledWith(1, 'item');
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('item left')).toBeInTheDocument();
  });

  it('should pluralize items when count is not 1', () => {
    render(<TodoFooter {...defaultProps} count={2} />);
    expect(Utils.pluralize).toHaveBeenCalledWith(2, 'item');
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('items left')).toBeInTheDocument();
  });

  it('should show clear completed button when there are completed items', () => {
    render(<TodoFooter {...defaultProps} completedCount={2} />);
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  it('should not show clear completed button when there are no completed items', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />);
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when clear completed button is clicked', () => {
    render(<TodoFooter {...defaultProps} completedCount={2} />);
    fireEvent.click(screen.getByText('Clear completed'));
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });

  it('should highlight the All filter when nowShowing is ALL_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ALL_TODOS} />);
    expect(screen.getByText('All').className).toContain('selected');
    expect(screen.getByText('Active').className).not.toContain('selected');
    expect(screen.getByText('Completed').className).not.toContain('selected');
  });

  it('should highlight the Active filter when nowShowing is ACTIVE_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={ACTIVE_TODOS} />);
    expect(screen.getByText('All').className).not.toContain('selected');
    expect(screen.getByText('Active').className).toContain('selected');
    expect(screen.getByText('Completed').className).not.toContain('selected');
  });

  it('should highlight the Completed filter when nowShowing is COMPLETED_TODOS', () => {
    render(<TodoFooter {...defaultProps} nowShowing={COMPLETED_TODOS} />);
    expect(screen.getByText('All').className).not.toContain('selected');
    expect(screen.getByText('Active').className).not.toContain('selected');
    expect(screen.getByText('Completed').className).toContain('selected');
  });
});
```

**todoItem.test.tsx**
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './todoItem';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

// Mock ReactDOM.findDOMNode
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn().mockImplementation(() => ({
    focus: jest.fn(),
    setSelectionRange: jest.fn()
  }))
}));

describe('TodoItem', () => {
  const defaultProps = {
    todo: { id: '1', title: 'Test Todo', completed: false },
    editing: false,
    onSave: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    onCancel: jest.fn(),
    onToggle: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a todo item', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should render a completed todo item', () => {
    render(
      <TodoItem 
        {...defaultProps} 
        todo={{ ...defaultProps.todo, completed: true }} 
      />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('listitem').className).toContain('completed');
  });

  it('should render an editing todo item', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    expect(screen.getByRole('listitem').className).toContain('editing');
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('should call onDestroy when destroy button is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should call onEdit when label is double-clicked', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.doubleClick(screen.getByText('Test Todo'));
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  it('should update state when input changes', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    expect(input).toHaveValue('Updated Todo');
  });

  it('should call onSave with trimmed value when form is submitted', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo ' } });
    fireEvent.blur(input);
    expect(defaultProps.onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should call onDestroy when form is submitted with empty value', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: '  ' } });
    fireEvent.blur(input);
    expect(defaultProps.onDestroy).toHaveBeenCalled();
  });

  it('should call onCancel when escape key is pressed', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: ESCAPE_KEY });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onSave when enter key is pressed', () => {
    render(<TodoItem {...defaultProps} editing={true} />);
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(defaultProps.onSave).toHaveBeenCalledWith('Test Todo');
  });

  it('should not update if props and state have not changed', () => {
    const { rerender } = render(<TodoItem {...defaultProps} />);
    const instance = screen.getByRole('listitem');
    
    // Re-render with same props
    rerender(<TodoItem {...defaultProps} />);
    
    // Component should not update
    expect(instance).toBe(screen.getByRole('listitem'));
  });
});
```

**app.test.tsx**
```tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

// Mock dependencies
jest.mock('react-dom', () => ({
  findDOMNode: jest.fn().mockImplementation(() => ({
    value: 'Test Todo',
    focus: jest.fn(),
    setSelectionRange: jest.fn()
  })),
  render: jest.fn()
}));

// Mock Router
global.Router = jest.fn().mockImplementation((routes) => ({
  init: jest.fn((path) => routes[path]())
}));

describe('TodoApp', () => {
  let model: TodoModel;
  
  beforeEach(() => {
    jest.clearAllMocks();
    model = new TodoModel('test-model');
    jest.spyOn(model, 'addTodo');
    jest.spyOn(model, 'toggleAll');
    jest.spyOn(model, 'toggle');
    jest.spyOn(model, 'destroy');
    jest.spyOn(model, 'save');
    jest.spyOn(model, 'clearCompleted');
  });

  it('should render the app with empty todos', () => {
    render(<TodoApp model={model} />);
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.queryByTestId('main')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should initialize router on mount', () => {
    render(<TodoApp model={model} />);
    expect(Router).toHaveBeenCalled();
    expect(Router).toHaveBeenCalledWith({
      '/': expect.any(Function),
      '/active': expect.any(Function),
      '/completed': expect.any(Function)
    });
  });

  it('should add a todo when Enter key is pressed', () => {
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { keyCode: ENTER_KEY });
    expect(model.addTodo).toHaveBeenCalledWith('Test Todo');
  });

  it('should not add a todo when a key other than Enter is pressed', () => {
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { keyCode: 27 }); // Escape key
    expect(model.addTodo).not.toHaveBeenCalled();
  });

  it('should toggle all todos', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false }
    ];
    
    render(<TodoApp model={model} />);
    
    const toggleAll = screen.getByLabelText('Mark all as complete');
    fireEvent.change(toggleAll, { target: { checked: true } });
    
    expect(model.toggleAll).toHaveBeenCalledWith(true);
  });

  it('should toggle a specific todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Call toggle method directly since we can't easily access the TodoItem's toggle
    const todoApp = app.container.firstChild;
    todoApp.toggle(todo);
    
    expect(model.toggle).toHaveBeenCalledWith(todo);
  });

  it('should destroy a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Call destroy method directly
    instance.destroy(todo);
    
    expect(model.destroy).toHaveBeenCalledWith(todo);
  });

  it('should edit a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Call edit method directly
    instance.edit(todo);
    
    expect(instance.state.editing).toBe(todo.id);
  });

  it('should save a todo', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Set editing state
    instance.setState({ editing: todo.id });
    
    // Call save method directly
    instance.save(todo, 'Updated Todo');
    
    expect(model.save).toHaveBeenCalledWith(todo, 'Updated Todo');
    expect(instance.state.editing).toBeNull();
  });

  it('should cancel editing', () => {
    const todo = { id: '1', title: 'Todo 1', completed: false };
    model.todos = [todo];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Set editing state
    instance.setState({ editing: todo.id });
    
    // Call cancel method directly
    instance.cancel();
    
    expect(instance.state.editing).toBeNull();
  });

  it('should clear completed todos', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true }
    ];
    
    const app = render(<TodoApp model={model} />);
    const instance = app.container.firstChild;
    
    // Call clearCompleted method directly
    instance.clearCompleted();
    
    expect(model.clearCompleted).toHaveBeenCalled();
  });

  it('should filter todos based on nowShowing state', () => {
    model.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true }
    ];
    
    const { rerender } = render(<TodoApp model={model} />);
    let app = screen.getByText('todos').parentElement;
    
    // Initially should show all todos
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    
    // Set nowShowing to ACTIVE_TODOS
    app.setState({ nowShowing: ACTIVE_TODOS });
    rerender(<TodoApp model={model} />);
    
    // Should only show active todos
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
    
    // Set nowShowing to COMPLETED_TODOS
    app.setState({ nowShowing: COMPLETED_TODOS });
    rerender(<TodoApp model={model} />);
    
    // Should only show completed todos
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
});
```

### Tokens: {'input_tokens': 4009, 'output_tokens': 6540}
### Execution time: 72.67478108406067
