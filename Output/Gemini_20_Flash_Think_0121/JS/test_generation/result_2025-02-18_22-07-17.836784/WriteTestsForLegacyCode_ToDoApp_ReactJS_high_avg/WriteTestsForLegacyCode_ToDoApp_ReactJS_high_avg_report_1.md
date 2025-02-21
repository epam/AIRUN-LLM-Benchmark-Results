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
```typescript
// __tests__/utils.test.ts
import { Utils } from '../utils';

describe('Utils', () => {
  describe('uuid', () => {
    it('should generate a valid UUID', () => {
      const uuid = Utils.uuid();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('should generate different UUIDs each time', () => {
      const uuid1 = Utils.uuid();
      const uuid2 = Utils.uuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('pluralize', () => {
    it('should return singular word for count 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural word for count other than 1', () => {
      expect(Utils.pluralize(0, 'item')).toBe('items');
      expect(Utils.pluralize(2, 'item')).toBe('items');
      expect(Utils.pluralize(10, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = String(value);
        },
        clear: () => {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    beforeEach(() => {
      localStorage.clear();
    });

    it('should store data in localStorage', () => {
      const namespace = 'test-namespace';
      const data = [{ id: '1', title: 'Test Todo', completed: false }];
      Utils.store(namespace, data);
      expect(localStorage.getItem(namespace)).toBe(JSON.stringify(data));
    });

    it('should retrieve data from localStorage', () => {
      const namespace = 'test-namespace';
      const data = [{ id: '1', title: 'Test Todo', completed: false }];
      localStorage.setItem(namespace, JSON.stringify(data));
      expect(Utils.store(namespace)).toEqual(data);
    });

    it('should return empty array if no data in localStorage', () => {
      const namespace = 'test-namespace';
      expect(Utils.store(namespace)).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should extend object with properties from other objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { d: 5 };
      const extendedObj = Utils.extend(obj1, obj2, obj3);
      expect(extendedObj).toEqual({ a: 1, b: 3, c: 4, d: 5 });
    });

    it('should handle empty objects', () => {
      const obj1 = {};
      const obj2 = { a: 1 };
      const extendedObj = Utils.extend(obj1, obj2);
      expect(extendedObj).toEqual({ a: 1 });
    });

    it('should handle no objects', () => {
      const extendedObj = Utils.extend();
      expect(extendedObj).toEqual({});
    });
  });
});
```

```typescript
// __tests__/todoModel.test.ts
import { TodoModel } from '../todoModel';
import { Utils } from '../utils';

jest.mock('../utils', () => ({
  Utils: {
    uuid: jest.fn(() => 'mock-uuid'),
    store: jest.fn(() => []),
    extend: jest.fn((...args) => Object.assign({}, ...args)),
  },
}));

describe('TodoModel', () => {
  let todoModel: TodoModel;
  const mockStore = Utils.store as jest.Mock;
  const mockUuid = Utils.uuid as jest.Mock;
  const mockExtend = Utils.extend as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    todoModel = new TodoModel('test-key');
  });

  it('should initialize with key and empty todos array', () => {
    expect(todoModel.key).toBe('test-key');
    expect(todoModel.todos).toEqual([]);
    expect(todoModel.onChanges).toEqual([]);
    expect(mockStore).toHaveBeenCalledWith('test-key');
  });

  it('subscribe should add onChange callback', () => {
    const onChange = jest.fn();
    todoModel.subscribe(onChange);
    expect(todoModel.onChanges).toContain(onChange);
  });

  describe('inform', () => {
    it('should store todos and call onChange callbacks', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();
      todoModel.subscribe(onChange1);
      todoModel.subscribe(onChange2);
      todoModel.todos = [{ id: '1', title: 'Test Todo', completed: false }];
      todoModel.inform();
      expect(mockStore).toHaveBeenCalledWith('test-key', todoModel.todos);
      expect(onChange1).toHaveBeenCalled();
      expect(onChange2).toHaveBeenCalled();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo and inform subscribers', () => {
      const initialTodos = [];
      mockStore.mockReturnValueOnce(initialTodos);
      todoModel = new TodoModel('test-key');
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.addTodo('New Todo');
      expect(todoModel.todos).toEqual([{ id: 'mock-uuid', title: 'New Todo', completed: false }]);
      expect(mockUuid).toHaveBeenCalled();
      expect(mockStore).toHaveBeenCalledWith('test-key', [{ id: 'mock-uuid', title: 'New Todo', completed: false }]);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('toggleAll', () => {
    it('should toggle completed status of all todos and inform subscribers', () => {
      todoModel.todos = [
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: true },
      ];
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.toggleAll(true);
      expect(todoModel.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: true },
        { id: '2', title: 'Todo 2', completed: true },
      ]);
      expect(mockExtend).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    it('should toggle completed status of a specific todo and inform subscribers', () => {
      const todoToToggle = { id: '1', title: 'Todo 1', completed: false };
      todoModel.todos = [todoToToggle, { id: '2', title: 'Todo 2', completed: true }];
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.toggle(todoToToggle);
      expect(todoModel.todos).toEqual([
        { id: '1', title: 'Todo 1', completed: true },
        { id: '2', title: 'Todo 2', completed: true },
      ]);
      expect(mockExtend).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove a todo and inform subscribers', () => {
      const todoToDestroy = { id: '1', title: 'Todo 1', completed: false };
      todoModel.todos = [todoToDestroy, { id: '2', title: 'Todo 2', completed: true }];
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.destroy(todoToDestroy);
      expect(todoModel.todos).toEqual([{ id: '2', title: 'Todo 2', completed: true }]);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should update todo title and inform subscribers', () => {
      const todoToSave = { id: '1', title: 'Todo 1', completed: false };
      todoModel.todos = [todoToSave, { id: '2', title: 'Todo 2', completed: true }];
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.save(todoToSave, 'Updated Todo');
      expect(todoModel.todos).toEqual([
        { id: '1', title: 'Updated Todo', completed: false },
        { id: '2', title: 'Todo 2', completed: true },
      ]);
      expect(mockExtend).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('clearCompleted', () => {
    it('should remove completed todos and inform subscribers', () => {
      todoModel.todos = [
        { id: '1', title: 'Todo 1', completed: true },
        { id: '2', title: 'Todo 2', completed: false },
        { id: '3', title: 'Todo 3', completed: true },
      ];
      const onChange = jest.fn();
      todoModel.subscribe(onChange);
      todoModel.clearCompleted();
      expect(todoModel.todos).toEqual([{ id: '2', title: 'Todo 2', completed: false }]);
      expect(onChange).toHaveBeenCalled();
    });
  });
});
```

```typescript
// __tests__/todoFooter.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFooter } from '../footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoFooter', () => {
  it('should render correct count of active items', () => {
    render(
      <TodoFooter
        count={2}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });

  it('should render "item" when count is 1', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('should render "Clear completed" button when completedCount > 0', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Clear completed' })).toBeInTheDocument();
  });

  it('should not render "Clear completed" button when completedCount is 0', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: 'Clear completed' })).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when "Clear completed" button is clicked', () => {
    const onClearCompleted = jest.fn();
    render(
      <TodoFooter
        count={1}
        completedCount={1}
        nowShowing={ALL_TODOS}
        onClearCompleted={onClearCompleted}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear completed' }));
    expect(onClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('should highlight "All" filter when nowShowing is ALL_TODOS', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ALL_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByRole('link', { name: 'All' }).parentElement).toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Active' }).parentElement).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Completed' }).parentElement).not.toHaveClass('selected');
  });

  it('should highlight "Active" filter when nowShowing is ACTIVE_TODOS', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={ACTIVE_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByRole('link', { name: 'Active' }).parentElement).toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'All' }).parentElement).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Completed' }).parentElement).not.toHaveClass('selected');
  });

  it('should highlight "Completed" filter when nowShowing is COMPLETED_TODOS', () => {
    render(
      <TodoFooter
        count={1}
        completedCount={0}
        nowShowing={COMPLETED_TODOS}
        onClearCompleted={jest.fn()}
      />
    );
    expect(screen.getByRole('link', { name: 'Completed' }).parentElement).toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'All' }).parentElement).not.toHaveClass('selected');
    expect(screen.getByRole('link', { name: 'Active' }).parentElement).not.toHaveClass('selected');
  });
});
```

```typescript
// __tests__/todoItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../todoItem';

describe('TodoItem', () => {
  const todo = { id: '1', title: 'Test Todo', completed: false };
  const onToggle = jest.fn();
  const onDestroy = jest.fn();
  const onEdit = jest.fn();
  const onSave = jest.fn();
  const onCancel = jest.fn();

  const renderComponent = (editing = false) => {
    render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={editing}
      />
    );
  };

  it('should render todo item with title', () => {
    renderComponent();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render checkbox with correct completed status', () => {
    renderComponent();
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
  });

  it('should apply "completed" class when todo is completed', () => {
    renderComponent();
    expect(screen.getByRole('listitem')).not.toHaveClass('completed');
    render(
      <TodoItem
        todo={{ ...todo, completed: true }}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
      />
    );
    expect(screen.getByRole('listitem')).toHaveClass('completed');
  });

  it('should apply "editing" class when editing is true', () => {
    renderComponent(true);
    expect(screen.getByRole('listitem')).toHaveClass('editing');
  });

  it('should call onToggle when checkbox is changed', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDestroy when destroy button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { className: 'destroy' }));
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when label is double clicked', () => {
    renderComponent();
    fireEvent.dblClick(screen.getByRole('label'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should render edit input when editing is true', () => {
    renderComponent(true);
    expect(screen.getByRole('textbox', { className: 'edit' })).toBeInTheDocument();
    expect((screen.getByRole('textbox', { className: 'edit' }) as HTMLInputElement).value).toBe('Test Todo');
  });

  it('should call onSave with trimmed value when edit input is blurred with value', () => {
    renderComponent(true);
    const editInput = screen.getByRole('textbox', { className: 'edit' });
    fireEvent.change(editInput, { target: { value: 'Updated Todo ' } });
    fireEvent.blur(editInput);
    expect(onSave).toHaveBeenCalledWith('Updated Todo');
  });

  it('should call onDestroy when edit input is blurred with empty value', () => {
    renderComponent(true);
    const editInput = screen.getByRole('textbox', { className: 'edit' });
    fireEvent.change(editInput, { target: { value: ' ' } });
    fireEvent.blur(editInput);
    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Escape key is pressed in edit input', () => {
    renderComponent(true);
    const editInput = screen.getByRole('textbox', { className: 'edit' });
    fireEvent.keyDown(editInput, { key: 'Escape', keyCode: 27 });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call handleSubmit when Enter key is pressed in edit input', () => {
    renderComponent(true);
    const editInput = screen.getByRole('textbox', { className: 'edit' });
    fireEvent.keyDown(editInput, { key: 'Enter', keyCode: 13 });
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should update editText state on change in edit input', () => {
    renderComponent(true);
    const editInput = screen.getByRole('textbox', { className: 'edit' });
    fireEvent.change(editInput, { target: { value: 'Typing...' } });
    expect((editInput as HTMLInputElement).value).toBe('Typing...');
  });
});
```

```typescript
// __tests__/app.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { TodoApp } from '../app';
import { TodoModel } from '../todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';

jest.mock('../todoModel');
jest.mock('react-dom');

const mockTodoModel = TodoModel as jest.MockedClass<typeof TodoModel>;
const mockReactDOMRender = ReactDOM.render as jest.Mock;
const mockReactDOMFindDOMNode = ReactDOM.findDOMNode as jest.Mock;

declare var Router: any;
jest.mock('../app', () => {
  const originalModule = jest.requireActual('../app');
  return {
    ...originalModule,
    TodoApp: originalModule.TodoApp,
  };
});

const mockRouterInit = jest.fn();
const mockRouter = jest.fn(() => ({
  init: mockRouterInit,
}));
global.Router = mockRouter;

describe('TodoApp', () => {
  let modelInstance: TodoModel;

  beforeEach(() => {
    jest.clearAllMocks();
    modelInstance = new mockTodoModel('test-key');
    mockTodoModel.mockClear();
    mockReactDOMRender.mockClear();
    mockReactDOMFindDOMNode.mockReturnValue({ value: '', focus: jest.fn() });
    mockRouter.mockClear();
    mockRouterInit.mockClear();
  });

  it('should render TodoApp component', () => {
    render(<TodoApp model={modelInstance} />);
    expect(screen.getByRole('heading', { name: 'todos' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('should initialize router in componentDidMount', () => {
    render(<TodoApp model={modelInstance} />);
    expect(mockRouter).toHaveBeenCalled();
    expect(mockRouterInit).toHaveBeenCalledWith('/');
  });

  it('should set state based on router paths', () => {
    const setStateMock = jest.fn();
    jest.spyOn(React.Component.prototype, 'setState').mockImplementation(setStateMock);
    render(<TodoApp model={modelInstance} />);
    const routerCallback = mockRouter.mock.calls[0][0];
    routerCallback['/']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: ALL_TODOS });
    routerCallback['/active']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: ACTIVE_TODOS });
    routerCallback['/completed']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: COMPLETED_TODOS });
    jest.spyOn(React.Component.prototype, 'setState').mockRestore();
  });

  it('should add new todo on handleNewTodoKeyDown with ENTER_KEY', () => {
    mockReactDOMFindDOMNode.mockReturnValue({ value: 'New Todo', focus: jest.fn() });
    render(<TodoApp model={modelInstance} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { key: 'Enter', keyCode: ENTER_KEY });
    expect(modelInstance.addTodo).toHaveBeenCalledWith('New Todo');
    expect(mockReactDOMFindDOMNode).toHaveBeenCalledWith(expect.anything());
  });

  it('should not add new todo on handleNewTodoKeyDown without ENTER_KEY', () => {
    render(<TodoApp model={modelInstance} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.keyDown(input, { key: 'a', keyCode: 65 });
    expect(modelInstance.addTodo).not.toHaveBeenCalled();
  });

  it('should toggle all todos on toggleAll', () => {
    render(<TodoApp model={modelInstance} />);
    const toggleAllCheckbox = screen.getByRole('checkbox', { name: 'Mark all as complete' });
    fireEvent.click(toggleAllCheckbox);
    expect(modelInstance.toggleAll).toHaveBeenCalledWith(true);
  });

  it('should call model.toggle with todo when toggle is called', () => {
    const todo = { id: '1', title: 'Test Todo', completed: false };
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals; // Accessing internal for test, not ideal for prod
    instance.child.memoizedProps.onToggle(todo); // Simulate prop call from child
    expect(modelInstance.toggle).toHaveBeenCalledWith(todo);
  });

  it('should call model.destroy with todo when destroy is called', () => {
    const todo = { id: '1', title: 'Test Todo', completed: false };
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedProps.onDestroy(todo);
    expect(modelInstance.destroy).toHaveBeenCalledWith(todo);
  });

  it('should set editing state when edit is called', () => {
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedProps.onEdit({ id: '1' });
    expect(instance.memoizedState.editing).toBe('1');
  });

  it('should call model.save and reset editing state when save is called', () => {
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedProps.onSave({ id: '1' }, 'Updated Todo');
    expect(modelInstance.save).toHaveBeenCalledWith({ id: '1' }, 'Updated Todo');
    expect(instance.memoizedState.editing).toBeNull();
  });

  it('should reset editing state when cancel is called', () => {
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedProps.onCancel();
    expect(instance.memoizedState.editing).toBeNull();
  });

  it('should call model.clearCompleted when clearCompleted is called', () => {
    render(<TodoApp model={modelInstance} />);
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedProps.onClearCompleted();
    expect(modelInstance.clearCompleted).toHaveBeenCalled();
  });

  it('should render TodoItem for each todo', () => {
    modelInstance.todos = [{ id: '1', title: 'Todo 1', completed: false }, { id: '2', title: 'Todo 2', completed: true }];
    render(<TodoApp model={modelInstance} />);
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });

  it('should render TodoFooter when there are todos', () => {
    modelInstance.todos = [{ id: '1', title: 'Todo 1', completed: false }];
    render(<TodoApp model={modelInstance} />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer role
  });

  it('should not render TodoFooter when there are no todos', () => {
    modelInstance.todos = [];
    render(<TodoApp model={modelInstance} />);
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('should filter todos based on nowShowing state', () => {
    modelInstance.todos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
      { id: '3', title: 'Todo 3', completed: false },
    ];
    const setStateMock = jest.fn();
    jest.spyOn(React.Component.prototype, 'setState').mockImplementation(setStateMock);
    render(<TodoApp model={modelInstance} />);

    setStateMock.mockClear();
    const routerCallback = mockRouter.mock.calls[0][0];
    routerCallback['/active']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: ACTIVE_TODOS });
    rerenderWithState(modelInstance, ACTIVE_TODOS);
    expect(screen.getAllByRole('listitem').length).toBe(2); // Todo 1 and Todo 3

    setStateMock.mockClear();
    routerCallback['/completed']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: COMPLETED_TODOS });
    rerenderWithState(modelInstance, COMPLETED_TODOS);
    expect(screen.getAllByRole('listitem').length).toBe(1); // Todo 2

    setStateMock.mockClear();
    routerCallback['/']();
    expect(setStateMock).toHaveBeenCalledWith({ nowShowing: ALL_TODOS });
    rerenderWithState(modelInstance, ALL_TODOS);
    expect(screen.getAllByRole('listitem').length).toBe(3); // All todos
    jest.spyOn(React.Component.prototype, 'setState').mockRestore();
  });

  const rerenderWithState = (model: TodoModel, nowShowing: string) => {
    render(<TodoApp model={model} />, { rerender: (component) => render(<TodoApp model={model} />, {container: component.container})});
    const instance = (screen.getByType(TodoApp) as any)._reactInternals;
    instance.child.memoizedState.nowShowing = nowShowing;
    instance.child.memoizedProps.model = model;
    instance.child.memoizedProps.setState({nowShowing: nowShowing}); // Force re-render - not ideal, but simulating state change
  };
});
```

### Tokens: {'input_tokens': 3769, 'output_tokens': 6822}
### Execution time: 29.11114525794983
