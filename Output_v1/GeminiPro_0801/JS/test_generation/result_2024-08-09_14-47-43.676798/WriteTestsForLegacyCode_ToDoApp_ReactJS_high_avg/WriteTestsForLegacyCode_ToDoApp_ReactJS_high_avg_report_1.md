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
// src/__tests__/app.spec.tsx
import React from 'react';
import { shallow, mount } from 'enzyme';
import { TodoApp } from '../app';
import { TodoModel } from '../todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

jest.mock('../todoModel');

const mockModel = new TodoModel('react-todos') as jest.Mocked<TodoModel>;

describe('TodoApp', () => {
  let component: any;

  beforeEach(() => {
    component = shallow(<TodoApp model={mockModel} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should initialize state correctly', () => {
    expect(component.state('nowShowing')).toBe(ALL_TODOS);
    expect(component.state('editing')).toBeNull();
  });

  describe('componentDidMount', () => {
    it('should initialize router and set initial state', () => {
      const instance = component.instance() as TodoApp;
      jest.spyOn(instance, 'setState');
      const routerMock = {
        init: jest.fn(),
      };
      // @ts-ignore
      jest.spyOn(window, 'Router').mockReturnValue(routerMock);
      instance.componentDidMount();
      expect(window.Router).toHaveBeenCalledWith({
        '/': expect.any(Function),
        '/active': expect.any(Function),
        '/completed': expect.any(Function),
      });
      expect(routerMock.init).toHaveBeenCalledWith('/');
      expect(instance.setState).toHaveBeenCalledWith({ nowShowing: ALL_TODOS });
    });
  });

  describe('handleNewTodoKeyDown', () => {
    it('should not add todo if ENTER key is not pressed', () => {
      const event = {
        keyCode: 10,
        preventDefault: jest.fn(),
      } as React.KeyboardEvent;
      component.instance().handleNewTodoKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(mockModel.addTodo).not.toHaveBeenCalled();
    });

    it('should not add todo if input is empty', () => {
      const event = {
        keyCode: 13,
        preventDefault: jest.fn(),
      } as React.KeyboardEvent;
      component.instance().handleNewTodoKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockModel.addTodo).not.toHaveBeenCalled();
    });

    it('should add todo if ENTER key is pressed and input is not empty', () => {
      const event = {
        keyCode: 13,
        preventDefault: jest.fn(),
      } as React.KeyboardEvent;
      component.instance().refs = {
        newField: {
          value: 'New todo',
        },
      };
      component.instance().handleNewTodoKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockModel.addTodo).toHaveBeenCalledWith('New todo');
    });
  });

  describe('toggleAll', () => {
    it('should toggle all todos', () => {
      const event = {
        target: {
          checked: true,
        },
      } as React.FormEvent;
      component.instance().toggleAll(event);
      expect(mockModel.toggleAll).toHaveBeenCalledWith(true);
    });
  });

  describe('toggle', () => {
    it('should toggle a todo', () => {
      const todo = { id: 1, title: 'Test', completed: false };
      component.instance().toggle(todo);
      expect(mockModel.toggle).toHaveBeenCalledWith(todo);
    });
  });

  describe('destroy', () => {
    it('should destroy a todo', () => {
      const todo = { id: 1, title: 'Test', completed: false };
      component.instance().destroy(todo);
      expect(mockModel.destroy).toHaveBeenCalledWith(todo);
    });
  });

  describe('edit', () => {
    it('should set editing state', () => {
      const todo = { id: 1, title: 'Test', completed: false };
      component.instance().edit(todo);
      expect(component.state('editing')).toBe(1);
    });
  });

  describe('save', () => {
    it('should save a todo', () => {
      const todo = { id: 1, title: 'Test', completed: false };
      component.instance().save(todo, 'Updated todo');
      expect(mockModel.save).toHaveBeenCalledWith(todo, 'Updated todo');
      expect(component.state('editing')).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should clear editing state', () => {
      component.setState({ editing: 1 });
      component.instance().cancel();
      expect(component.state('editing')).toBeNull();
    });
  });

  describe('clearCompleted', () => {
    it('should clear completed todos', () => {
      component.instance().clearCompleted();
      expect(mockModel.clearCompleted).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    it('should render todo items', () => {
      mockModel.todos = [
        { id: 1, title: 'Test 1', completed: false },
        { id: 2, title: 'Test 2', completed: true },
      ];
      component.setState({ nowShowing: ALL_TODOS });
      component.update();
      expect(component.find('TodoItem')).toHaveLength(2);
    });

    it('should filter todo items based on nowShowing state', () => {
      mockModel.todos = [
        { id: 1, title: 'Test 1', completed: false },
        { id: 2, title: 'Test 2', completed: true },
      ];
      component.setState({ nowShowing: ACTIVE_TODOS });
      component.update();
      expect(component.find('TodoItem')).toHaveLength(1);
      expect(component.find('TodoItem').props().todo.id).toBe(1);
    });

    it('should render footer when there are todos', () => {
      mockModel.todos = [{ id: 1, title: 'Test', completed: false }];
      component.update();
      expect(component.find('TodoFooter')).toHaveLength(1);
    });

    it('should not render footer when there are no todos', () => {
      mockModel.todos = [];
      component.update();
      expect(component.find('TodoFooter')).toHaveLength(0);
    });
  });
});

```

```typescript
// src/__tests__/todoItem.spec.tsx
import React from 'react';
import { shallow } from 'enzyme';
import { TodoItem } from '../todoItem';
import * as constants from '../constants';

describe('TodoItem', () => {
  let component: any;
  const todo = { id: 1, title: 'Test', completed: false };
  const props = {
    todo,
    onToggle: jest.fn(),
    onDestroy: jest.fn(),
    onEdit: jest.fn(),
    editing: false,
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<TodoItem {...props} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should initialize state correctly', () => {
    expect(component.state('editText')).toBe(todo.title);
  });

  describe('handleSubmit', () => {
    it('should call onSave prop with trimmed value if editText is not empty', () => {
      component.setState({ editText: '  Test  ' });
      component.instance().handleSubmit({} as React.FormEvent);
      expect(props.onSave).toHaveBeenCalledWith('Test');
      expect(component.state('editText')).toBe('Test');
    });

    it('should call onDestroy prop if editText is empty', () => {
      component.setState({ editText: '  ' });
      component.instance().handleSubmit({} as React.FormEvent);
      expect(props.onDestroy).toHaveBeenCalled();
    });
  });

  describe('handleEdit', () => {
    it('should call onEdit prop and update editText state', () => {
      component.instance().handleEdit();
      expect(props.onEdit).toHaveBeenCalled();
      expect(component.state('editText')).toBe(todo.title);
    });
  });

  describe('handleKeyDown', () => {
    it('should call onCancel prop and reset editText state when ESCAPE key is pressed', () => {
      const event = { keyCode: constants.ESCAPE_KEY } as React.KeyboardEvent;
      component.instance().handleKeyDown(event);
      expect(props.onCancel).toHaveBeenCalledWith(event);
      expect(component.state('editText')).toBe(todo.title);
    });

    it('should call handleSubmit when ENTER key is pressed', () => {
      const event = { keyCode: constants.ENTER_KEY } as React.KeyboardEvent;
      jest.spyOn(component.instance(), 'handleSubmit');
      component.instance().handleKeyDown(event);
      expect(component.instance().handleSubmit).toHaveBeenCalledWith(event);
    });
  });

  describe('handleChange', () => {
    it('should update editText state', () => {
      const event = {
        target: { value: 'New text' },
      } as React.FormEvent;
      component.instance().handleChange(event);
      expect(component.state('editText')).toBe('New text');
    });
  });

  describe('shouldComponentUpdate', () => {
    it('should return true if todo, editing or editText props/state have changed', () => {
      expect(component.instance().shouldComponentUpdate({ ...props, todo: { ...todo, title: 'Updated' } }, component.state())).toBe(true);
      expect(component.instance().shouldComponentUpdate({ ...props, editing: true }, component.state())).toBe(true);
      expect(component.instance().shouldComponentUpdate(props, { ...component.state(), editText: 'Updated' })).toBe(true);
    });

    it('should return false if todo, editing and editText props/state have not changed', () => {
      expect(component.instance().shouldComponentUpdate(props, component.state())).toBe(false);
    });
  });

  describe('componentDidUpdate', () => {
    it('should focus and set selection range of editField input when editing prop changes to true', () => {
      const instance = component.instance();
      jest.spyOn(instance, 'focus');
      jest.spyOn(instance, 'setSelectionRange');
      instance.componentDidUpdate({ ...props, editing: true });
      expect(instance.focus).toHaveBeenCalled();
      expect(instance.setSelectionRange).toHaveBeenCalledWith(todo.title.length, todo.title.length);
    });
  });
});

```

```typescript
// src/__tests__/utils.spec.ts
import { Utils } from '../utils';

describe('Utils', () => {
  describe('uuid', () => {
    it('should generate a valid UUID', () => {
      const uuid = Utils.uuid();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('pluralize', () => {
    it('should return singular form if count is 1', () => {
      expect(Utils.pluralize(1, 'item')).toBe('item');
    });

    it('should return plural form if count is not 1', () => {
      expect(Utils.pluralize(2, 'item')).toBe('items');
    });
  });

  describe('store', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should store data in localStorage', () => {
      Utils.store('test', { data: 'test' });
      expect(localStorage.getItem('test')).toBe('{"data":"test"}');
    });

    it('should retrieve data from localStorage', () => {
      localStorage.setItem('test', '{"data":"test"}');
      expect(Utils.store('test')).toEqual({ data: 'test' });
    });

    it('should return empty array if no data found in localStorage', () => {
      expect(Utils.store('test')).toEqual([]);
    });
  });

  describe('extend', () => {
    it('should extend an object with properties from other objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = Utils.extend(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });
  });
});

```

```typescript
// src/__tests__/footer.spec.tsx
import React from 'react';
import { shallow } from 'enzyme';
import { TodoFooter } from '../footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

describe('TodoFooter', () => {
  let component: any;
  const props = {
    count: 1,
    completedCount: 0,
    nowShowing: ALL_TODOS,
    onClearCompleted: jest.fn(),
  };

  beforeEach(() => {
    component = shallow(<TodoFooter {...props} />);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should display correct active todo count and word', () => {
    expect(component.find('.todo-count strong').text()).toBe('1');
    expect(component.find('.todo-count').text()).toContain('item left');

    component.setProps({ count: 2 });
    expect(component.find('.todo-count').text()).toContain('items left');
  });

  it('should highlight correct filter link', () => {
    expect(component.find(`a[href="#/"]`).hasClass('selected')).toBe(true);
    expect(component.find(`a[href="#/active"]`).hasClass('selected')).toBe(false);
    expect(component.find(`a[href="#/completed"]`).hasClass('selected')).toBe(false);

    component.setProps({ nowShowing: ACTIVE_TODOS });
    expect(component.find(`a[href="#/"]`).hasClass('selected')).toBe(false);
    expect(component.find(`a[href="#/active"]`).hasClass('selected')).toBe(true);
    expect(component.find(`a[href="#/completed"]`).hasClass('selected')).toBe(false);

    component.setProps({ nowShowing: COMPLETED_TODOS });
    expect(component.find(`a[href="#/"]`).hasClass('selected')).toBe(false);
    expect(component.find(`a[href="#/active"]`).hasClass('selected')).toBe(false);
    expect(component.find(`a[href="#/completed"]`).hasClass('selected')).toBe(true);
  });

  it('should not render clear button if there are no completed todos', () => {
    expect(component.find('.clear-completed').exists()).toBe(false);
  });

  it('should render clear button if there are completed todos', () => {
    component.setProps({ completedCount: 1 });
    expect(component.find('.clear-completed').exists()).toBe(true);
  });

  it('should call onClearCompleted prop when clear button is clicked', () => {
    component.setProps({ completedCount: 1 });
    component.find('.clear-completed').simulate('click');
    expect(props.onClearCompleted).toHaveBeenCalled();
  });
});

```

```typescript
// src/__tests__/todoModel.spec.ts
import { TodoModel } from '../todoModel';
import { Utils } from '../utils';

jest.mock('../utils');

describe('TodoModel', () => {
  let model: TodoModel;

  beforeEach(() => {
    model = new TodoModel('test');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty todos array', () => {
    expect(model.todos).toEqual([]);
  });

  it('should add a new todo', () => {
    (Utils.uuid as jest.Mock).mockReturnValue('1');
    model.addTodo('Learn React');
    expect(model.todos).toEqual([
      {
        id: '1',
        title: 'Learn React',
        completed: false,
      },
    ]);
  });

  it('should toggle all todos', () => {
    (Utils.uuid as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
    model.addTodo('Learn React');
    model.addTodo('Learn Angular');
    model.toggleAll(true);
    expect(model.todos.every((todo) => todo.completed)).toBe(true);
    model.toggleAll(false);
    expect(model.todos.every((todo) => !todo.completed)).toBe(true);
  });

  it('should toggle a specific todo', () => {
    (Utils.uuid as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
    model.addTodo('Learn React');
    model.addTodo('Learn Angular');
    model.toggle(model.todos[0]);
    expect(model.todos[0].completed).toBe(true);
    expect(model.todos[1].completed).toBe(false);
  });

  it('should destroy a specific todo', () => {
    (Utils.uuid as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
    model.addTodo('Learn React');
    model.addTodo('Learn Angular');
    model.destroy(model.todos[0]);
    expect(model.todos).toEqual([
      {
        id: '2',
        title: 'Learn Angular',
        completed: false,
      },
    ]);
  });

  it('should save a modified todo', () => {
    (Utils.uuid as jest.Mock).mockReturnValueOnce('1');
    model.addTodo('Learn React');
    model.save(model.todos[0], 'Learn React Native');
    expect(model.todos[0].title).toBe('Learn React Native');
  });

  it('should clear completed todos', () => {
    (Utils.uuid as jest.Mock).mockReturnValueOnce('1').mockReturnValueOnce('2');
    model.addTodo('Learn React');
    model.addTodo('Learn Angular');
    model.todos[0].completed = true;
    model.clearCompleted();
    expect(model.todos).toEqual([
      {
        id: '2',
        title: 'Learn Angular',
        completed: false,
      },
    ]);
  });

  it('should subscribe and inform listeners', () => {
    const listener = jest.fn();
    model.subscribe(listener);
    model.addTodo('Learn React');
    expect(listener).toHaveBeenCalled();
  });
});

```

### Tokens: {'input_tokens': 3767, 'output_tokens': 4616}
### Execution time: 88.71880912780762
