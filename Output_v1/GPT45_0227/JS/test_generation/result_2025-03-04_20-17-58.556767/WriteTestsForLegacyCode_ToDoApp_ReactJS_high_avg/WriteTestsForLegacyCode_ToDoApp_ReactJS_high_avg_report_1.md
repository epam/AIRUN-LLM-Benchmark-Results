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
package.json
```json
{
  "scripts": {
    "test": "jest --coverage"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
```

jest.config.js
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  }
};
```

jest.setup.ts
```ts
import '@testing-library/jest-dom';
```

__tests__/todoModel.test.ts
```ts
import { TodoModel } from "../todoModel";
import { Utils } from "../utils";

jest.mock("../utils", () => ({
  Utils: {
    store: jest.fn().mockReturnValue([]),
    uuid: jest.fn().mockReturnValue("1234"),
    extend: jest.requireActual("../utils").Utils.extend
  }
}));

describe("TodoModel", () => {
  let model: TodoModel;
  beforeEach(() => {
    model = new TodoModel("test");
  });

  test("should add todo", () => {
    model.addTodo("Test Todo");
    expect(model.todos).toHaveLength(1);
    expect(model.todos[0]).toEqual({
      id: "1234",
      title: "Test Todo",
      completed: false
    });
  });

  test("should toggle todo", () => {
    model.addTodo("Test Todo");
    model.toggle(model.todos[0]);
    expect(model.todos[0].completed).toBe(true);
  });

  test("should destroy todo", () => {
    model.addTodo("Test Todo");
    model.destroy(model.todos[0]);
    expect(model.todos).toHaveLength(0);
  });

  test("should save todo", () => {
    model.addTodo("Test Todo");
    model.save(model.todos[0], "Updated Todo");
    expect(model.todos[0].title).toBe("Updated Todo");
  });

  test("should clear completed todos", () => {
    model.addTodo("Todo 1");
    model.addTodo("Todo 2");
    model.toggle(model.todos[0]);
    model.clearCompleted();
    expect(model.todos).toHaveLength(1);
    expect(model.todos[0].title).toBe("Todo 2");
  });

  test("should toggle all todos", () => {
    model.addTodo("Todo 1");
    model.addTodo("Todo 2");
    model.toggleAll(true);
    expect(model.todos.every(todo => todo.completed)).toBe(true);
  });
});
```

__tests__/utils.test.ts
```ts
import { Utils } from "../utils";

describe("Utils", () => {
  test("uuid generates unique id", () => {
    const id1 = Utils.uuid();
    const id2 = Utils.uuid();
    expect(id1).not.toEqual(id2);
    expect(id1).toHaveLength(36);
  });

  test("pluralize returns correct word", () => {
    expect(Utils.pluralize(1, "item")).toBe("item");
    expect(Utils.pluralize(2, "item")).toBe("items");
  });

  test("store saves and retrieves data", () => {
    const namespace = "testNamespace";
    const data = [{ id: 1 }];
    Utils.store(namespace, data);
    expect(Utils.store(namespace)).toEqual(data);
  });

  test("extend merges objects", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    expect(Utils.extend(obj1, obj2)).toEqual({ a: 1, b: 2 });
  });
});
```

__tests__/footer.test.tsx
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoFooter } from "../footer";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../constants";

describe("TodoFooter", () => {
  test("renders correctly with active todos", () => {
    render(<TodoFooter count={2} completedCount={1} nowShowing={ALL_TODOS} onClearCompleted={jest.fn()} />);
    expect(screen.getByText("2 items left")).toBeInTheDocument();
    expect(screen.getByText("Clear completed")).toBeInTheDocument();
  });

  test("calls onClearCompleted when button clicked", () => {
    const onClearCompleted = jest.fn();
    render(<TodoFooter count={1} completedCount={1} nowShowing={ALL_TODOS} onClearCompleted={onClearCompleted} />);
    fireEvent.click(screen.getByText("Clear completed"));
    expect(onClearCompleted).toHaveBeenCalled();
  });

  test("highlights selected filter", () => {
    render(<TodoFooter count={1} completedCount={0} nowShowing={ACTIVE_TODOS} onClearCompleted={jest.fn()} />);
    expect(screen.getByText("Active")).toHaveClass("selected");
    expect(screen.getByText("All")).not.toHaveClass("selected");
  });
});
```

__tests__/todoItem.test.tsx
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../todoItem";

describe("TodoItem", () => {
  const todo = { id: "1", title: "Test Todo", completed: false };
  const setup = (editing = false) => {
    const props = {
      todo,
      editing,
      onToggle: jest.fn(),
      onDestroy: jest.fn(),
      onEdit: jest.fn(),
      onSave: jest.fn(),
      onCancel: jest.fn()
    };
    render(<TodoItem {...props} />);
    return props;
  };

  test("renders todo item", () => {
    setup();
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  test("calls onToggle when checkbox clicked", () => {
    const props = setup();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(props.onToggle).toHaveBeenCalled();
  });

  test("calls onDestroy when destroy button clicked", () => {
    const props = setup();
    fireEvent.click(screen.getByRole("button"));
    expect(props.onDestroy).toHaveBeenCalled();
  });

  test("enters edit mode on double click", () => {
    const props = setup();
    fireEvent.doubleClick(screen.getByText("Test Todo"));
    expect(props.onEdit).toHaveBeenCalled();
  });

  test("calls onSave on blur", () => {
    const props = setup(true);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Updated Todo" } });
    fireEvent.blur(input);
    expect(props.onSave).toHaveBeenCalledWith("Updated Todo");
  });

  test("calls onCancel on ESC key", () => {
    const props = setup(true);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { keyCode: 27 });
    expect(props.onCancel).toHaveBeenCalled();
  });
});
```

__tests__/app.test.tsx
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoApp } from "../app";
import { TodoModel } from "../todoModel";

jest.mock("../todoModel");

describe("TodoApp", () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel("test");
    model.todos = [{ id: "1", title: "Test Todo", completed: false }];
    render(<TodoApp model={model} />);
  });

  test("renders initial todos", () => {
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  test("adds new todo", () => {
    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.keyDown(input, { keyCode: 13 });
    expect(model.addTodo).toHaveBeenCalledWith("New Todo");
  });
});
```

### Tokens: {'input_tokens': 3226, 'output_tokens': 1808, 'reasoning_tokens': 0}
### Execution time: 51.40081787109375
