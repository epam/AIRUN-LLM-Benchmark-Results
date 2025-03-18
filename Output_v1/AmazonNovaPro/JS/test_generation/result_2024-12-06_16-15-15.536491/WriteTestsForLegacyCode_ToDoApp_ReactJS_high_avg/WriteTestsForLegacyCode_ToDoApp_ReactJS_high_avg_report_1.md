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
```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TodoApp } from './app';
import { TodoModel } from './todoModel';
import { TodoItem } from './todoItem';
import { TodoFooter } from './footer';
import { Utils } from './utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY } from './constants';

jest.mock('./todoModel', () => ({
  TodoModel: jest.fn().mockImplementation(() => ({
    todos: [],
    subscribe: jest.fn(),
    addTodo: jest.fn(),
    toggleAll: jest.fn(),
    toggle: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    clearCompleted: jest.fn(),
  })),
}));

describe('TodoApp', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('react-todos') as jest.Mocked<TodoModel>;
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoApp model={model} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('adds a new todo on Enter key press', async () => {
    model.todos = [{ id: '1', title: 'Test Todo', completed: false }];
    model.addTodo = jest.fn();

    const { getByPlaceholderText } = render(<TodoApp model={model} />);
    const newTodoInput = getByPlaceholderText('What needs to be done?');
    fireEvent.change(newTodoInput, { target: { value: 'New Todo' } });
    fireEvent.keyDown(newTodoInput, { key: 'Enter', keyCode: ENTER_KEY });

    await waitFor(() => expect(model.addTodo).toHaveBeenCalledWith('New Todo'));
  });

  it('toggles all todos', async () => {
    model.todos = [{ id: '1', title: 'Test Todo', completed: false }];
    model.toggleAll = jest.fn();

    const { getByLabelText } = render(<TodoApp model={model} />);
    const toggleAllCheckbox = getByLabelText('Mark all as complete');
    fireEvent.click(toggleAllCheckbox);

    await waitFor(() => expect(model.toggleAll).toHaveBeenCalledWith(true));
  });

  it('toggles a single todo', async () => {
    model.todos = [{ id: '1', title: 'Test Todo', completed: false }];
    model.toggle = jest.fn();

    const { getByLabelText } = render(<TodoApp model={model} />);
    const todoCheckbox = getByLabelText('Test Todo');
    fireEvent.click(todoCheckbox);

    await waitFor(() => expect(model.toggle).toHaveBeenCalledWith(model.todos[0]));
  });

  it('destroys a todo', async () => {
    model.todos = [{ id: '1', title: 'Test Todo', completed: false }];
    model.destroy = jest.fn();

    const { getByTitle } = render(<TodoApp model={model} />);
    const destroyButton = getByTitle('Destroy Todo');
    fireEvent.click(destroyButton);

    await waitFor(() => expect(model.destroy).toHaveBeenCalledWith(model.todos[0]));
  });

  it('edits a todo', async () => {
    model.todos = [{ id: '1', title: 'Test Todo', completed: false }];
    model.save = jest.fn();

    const { getByLabelText, getByPlaceholderText } = render(<TodoApp model={model} />);
    const editButton = getByLabelText('Test Todo');
    fireEvent.doubleClick(editButton);

    const editInput = getByPlaceholderText('Edit Todo');
    fireEvent.change(editInput, { target: { value: 'Edited Todo' } });
    fireEvent.blur(editInput);

    await waitFor(() => expect(model.save).toHaveBeenCalledWith(model.todos[0], 'Edited Todo'));
  });

  it('clears completed todos', async () => {
    model.todos = [
      { id: '1', title: 'Test Todo 1', completed: true },
      { id: '2', title: 'Test Todo 2', completed: false },
    ];
    model.clearCompleted = jest.fn();

    const { getByText } = render(<TodoApp model={model} />);
    const clearCompletedButton = getByText('Clear completed');
    fireEvent.click(clearCompletedButton);

    await waitFor(() => expect(model.clearCompleted).toHaveBeenCalled());
  });
});

describe('TodoItem', () => {
  let props: any;

  beforeEach(() => {
    props = {
      todo: { id: '1', title: 'Test Todo', completed: false },
      onToggle: jest.fn(),
      onDestroy: jest.fn(),
      onEdit: jest.fn(),
      editing: false,
      onSave: jest.fn(),
      onCancel: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoItem {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('handles todo toggle', () => {
    const { getByClassName } = render(<TodoItem {...props} />);
    const toggleCheckbox = getByClassName('toggle');
    fireEvent.click(toggleCheckbox);
    expect(props.onToggle).toHaveBeenCalled();
  });

  it('handles todo destroy', () => {
    const { getByClassName } = render(<TodoItem {...props} />);
    const destroyButton = getByClassName('destroy');
    fireEvent.click(destroyButton);
    expect(props.onDestroy).toHaveBeenCalled();
  });

  it('handles todo edit', () => {
    const { getByLabelText } = render(<TodoItem {...props} />);
    const label = getByLabelText('Test Todo');
    fireEvent.doubleClick(label);
    expect(props.onEdit).toHaveBeenCalled();
  });

  it('handles todo save', async () => {
    props.editing = true;
    const { getByClassName } = render(<TodoItem {...props} />);
    const editInput = getByClassName('edit');
    fireEvent.change(editInput, { target: { value: 'Edited Todo' } });
    fireEvent.blur(editInput);

    await waitFor(() => expect(props.onSave).toHaveBeenCalledWith(props.todo, 'Edited Todo'));
  });

  it('handles todo cancel', async () => {
    props.editing = true;
    const { getByClassName } = render(<TodoItem {...props} />);
    const editInput = getByClassName('edit');
    fireEvent.keyDown(editInput, { key: 'Escape', keyCode: ESCAPE_KEY });

    await waitFor(() => expect(props.onCancel).toHaveBeenCalled());
  });
});

describe('TodoFooter', () => {
  let props: any;

  beforeEach(() => {
    props = {
      count: 1,
      completedCount: 0,
      nowShowing: ALL_TODOS,
      onClearCompleted: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TodoFooter {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders the correct number of items left', () => {
    const { getByText } = render(<TodoFooter {...props} />);
    expect(getByText('1 item left')).toBeInTheDocument();
  });

  it('renders the clear completed button when there are completed todos', () => {
    props.completedCount = 1;
    const { getByText } = render(<TodoFooter {...props} />);
    expect(getByText('Clear completed')).toBeInTheDocument();
  });

  it('calls onClearCompleted when clear completed button is clicked', async () => {
    props.completedCount = 1;
    const { getByText } = render(<TodoFooter {...props} />);
    const clearCompletedButton = getByText('Clear completed');
    fireEvent.click(clearCompletedButton);

    await waitFor(() => expect(props.onClearCompleted).toHaveBeenCalled());
  });
});
```

### Tokens: {'input_tokens': 3635, 'output_tokens': 1731}
### Execution time: 24.806684017181396
