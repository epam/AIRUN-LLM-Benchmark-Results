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
utils.test.ts
```ts
import { Utils } from './utils';

describe('Utils tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('uuid generates a string of length 36', () => {
    const id = Utils.uuid();
    expect(id.length).toBe(36); // Standard UUID length
  });

  test('pluralize returns singular when count is 1', () => {
    const word = Utils.pluralize(1, 'item');
    expect(word).toBe('item');
  });

  test('pluralize returns plural when count is not 1', () => {
    expect(Utils.pluralize(0, 'item')).toBe('items');
    expect(Utils.pluralize(2, 'item')).toBe('items');
  });

  test('store saves and retrieves data from localStorage', () => {
    const namespace = 'test-namespace';
    const data = [{ id: 1, title: 'Test' }];
    Utils.store(namespace, data);
    const storedData = Utils.store(namespace);
    expect(storedData).toEqual(data);
  });

  test('store returns empty array when namespace not found', () => {
    const storedData = Utils.store('non-existent-namespace');
    expect(storedData).toEqual([]);
  });

  test('extend merges objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = Utils.extend(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });
});
```

todoModel.test.ts
```ts
import { TodoModel } from './todoModel';

describe('TodoModel tests', () => {
  let todoModel: TodoModel;

  beforeEach(() => {
    localStorage.clear();
    todoModel = new TodoModel('test-todos');
  });

  test('addTodo adds a new todo', () => {
    todoModel.addTodo('Test Todo');
    expect(todoModel.todos.length).toBe(1);
    expect(todoModel.todos[0].title).toBe('Test Todo');
  });

  test('toggleAll sets all todos to completed', () => {
    todoModel.addTodo('Todo 1');
    todoModel.addTodo('Todo 2');
    todoModel.toggleAll(true);
    expect(todoModel.todos.every(todo => todo.completed)).toBe(true);
  });

  test('toggleAll sets all todos to not completed', () => {
    todoModel.addTodo('Todo 1');
    todoModel.addTodo('Todo 2');
    todoModel.toggleAll(false);
    expect(todoModel.todos.every(todo => !todo.completed)).toBe(true);
  });

  test('toggle toggles a todo\'s completed state', () => {
    todoModel.addTodo('Todo 1');
    const todo = todoModel.todos[0];
    expect(todo.completed).toBe(false);
    todoModel.toggle(todo);
    expect(todoModel.todos[0].completed).toBe(true);
  });

  test('destroy removes a todo', () => {
    todoModel.addTodo('Todo 1');
    todoModel.addTodo('Todo 2');
    const todo = todoModel.todos[0];
    todoModel.destroy(todo);
    expect(todoModel.todos.length).toBe(1);
    expect(todoModel.todos[0].title).toBe('Todo 2');
  });

  test('save updates a todo\'s title', () => {
    todoModel.addTodo('Todo 1');
    const todo = todoModel.todos[0];
    todoModel.save(todo, 'Updated Todo 1');
    expect(todoModel.todos[0].title).toBe('Updated Todo 1');
  });

  test('clearCompleted removes completed todos', () => {
    todoModel.addTodo('Todo 1');
    todoModel.addTodo('Todo 2');
    const todo = todoModel.todos[0];
    todoModel.toggle(todo);
    todoModel.clearCompleted();
    expect(todoModel.todos.length).toBe(1);
    expect(todoModel.todos[0].title).toBe('Todo 2');
  });

  test('inform calls subscribed functions', () => {
    const mockCallback = jest.fn();
    todoModel.subscribe(mockCallback);
    todoModel.addTodo('Todo 1');
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

todoItem.test.tsx
```tsx
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TodoItem } from './todoItem';
import '@testing-library/jest-dom/extend-expect';

describe('TodoItem tests', () => {
  const todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };

  const setup = (propsOverride = {}) => {
    const onToggle = jest.fn();
    const onDestroy = jest.fn();
    const onEdit = jest.fn();
    const onSave = jest.fn();
    const onCancel = jest.fn();

    const utils = render(
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDestroy={onDestroy}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        editing={false}
        {...propsOverride}
      />
    );

    const getTodoItem = () => utils.getByText('Test Todo');
    return {
      ...utils,
      onToggle,
      onDestroy,
      onEdit,
      onSave,
      onCancel,
      getTodoItem,
    };
  };

  test('renders todo item', () => {
    const { getTodoItem } = setup();
    expect(getTodoItem()).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    const { getByRole, onToggle } = setup();
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalled();
  });

  test('calls onDestroy when destroy button is clicked', () => {
    const { getByRole, onDestroy } = setup();
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onDestroy).toHaveBeenCalled();
  });

  test('calls onEdit on double click', () => {
    const { getTodoItem, onEdit } = setup();
    fireEvent.doubleClick(getTodoItem());
    expect(onEdit).toHaveBeenCalled();
  });

  test('shows input when editing', () => {
    const { getByDisplayValue } = setup({ editing: true });
    expect(getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  test('calls onSave on input blur', () => {
    const { getByDisplayValue, onSave } = setup({ editing: true });
    const input = getByDisplayValue('Test Todo');
    fireEvent.blur(input);
    expect(onSave).toHaveBeenCalledWith('Test Todo');
  });

  test('updates state on input change', () => {
    const { getByDisplayValue } = setup({ editing: true });
    const input = getByDisplayValue('Test Todo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    expect(input.value).toBe('Updated Todo');
  });

  test('calls onSave on Enter key press', () => {
    const { getByDisplayValue, onSave } = setup({ editing: true });
    const input = getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: 13 }); // Enter key
    expect(onSave).toHaveBeenCalledWith('Test Todo');
  });

  test('calls onCancel on Escape key press', () => {
    const { getByDisplayValue, onCancel } = setup({ editing: true });
    const input = getByDisplayValue('Test Todo');
    fireEvent.keyDown(input, { keyCode: 27 }); // Escape key
    expect(onCancel).toHaveBeenCalled();
  });
});
```

app.test.tsx
```tsx
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./todoModel');

declare var Router: any;

describe('TodoApp tests', () => {
  let model: TodoModel;

  beforeEach(() => {
    (TodoModel as jest.MockedClass<typeof TodoModel>).mockClear();
    model = new TodoModel('test-todo');
    (model.subscribe as jest.Mock).mockImplementation((cb: Function) => {
      cb();
    });
    (model.todos as any) = [];
    global.Router = jest.fn().mockImplementation(() => ({
      init: jest.fn(),
    }));
  });

  test('renders without crashing', () => {
    render(<TodoApp model={model} />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  test('adds todo on Enter key press', () => {
    const addTodoMock = jest.spyOn(model, 'addTodo');
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { keyCode: 13 }); // Enter key
    expect(addTodoMock).toHaveBeenCalledWith('New Todo');
    expect(input.value).toBe('');
  });

  test('does not add todo on non-Enter key press', () => {
    const addTodoMock = jest.spyOn(model, 'addTodo');
    render(<TodoApp model={model} />);
    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { keyCode: 12 }); // Not Enter key
    expect(addTodoMock).not.toHaveBeenCalled();
  });

  test('toggleAll calls model.toggleAll', () => {
    const toggleAllMock = jest.spyOn(model, 'toggleAll');
    (model.todos as any) = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false },
    ];
    render(<TodoApp model={model} />);
    const toggleAllInput = screen.getByLabelText('Mark all as complete');
    fireEvent.click(toggleAllInput);
    expect(toggleAllMock).toHaveBeenCalledWith(true);
  });

  test('clearCompleted calls model.clearCompleted', () => {
    const clearCompletedMock = jest.spyOn(model, 'clearCompleted');
    (model.todos as any) = [
      { id: '1', title: 'Todo 1', completed: true },
      { id: '2', title: 'Todo 2', completed: false },
    ];
    render(<TodoApp model={model} />);
    const button = screen.getByText('Clear completed');
    fireEvent.click(button);
    expect(clearCompletedMock).toHaveBeenCalled();
  });

  test('shows correct number of todos left', () => {
    (model.todos as any) = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    render(<TodoApp model={model} />);
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  test('filters active todos', () => {
    (model.todos as any) = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    window.location.hash = '#/active';
    render(<TodoApp model={model} />);
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Todo 2')).toBeNull();
  });

  test('filters completed todos', () => {
    (model.todos as any) = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
    ];
    window.location.hash = '#/completed';
    render(<TodoApp model={model} />);
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.queryByText('Todo 1')).toBeNull();
  });
});
```

### Tokens: {'input_tokens': 3321, 'output_tokens': 6900, 'reasoning_tokens': 4160}
### Execution time: 73.12566995620728
