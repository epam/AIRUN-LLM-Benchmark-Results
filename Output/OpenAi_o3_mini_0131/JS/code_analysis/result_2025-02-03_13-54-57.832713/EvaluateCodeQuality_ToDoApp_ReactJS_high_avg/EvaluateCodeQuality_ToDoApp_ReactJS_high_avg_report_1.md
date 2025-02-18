I have the following application code that needs review and improvement:

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


Your task is to analyze the code and suggest enhancements focusing on the following aspects:
- Readability: Identify unclear parts and suggest clearer alternatives with code examples.
- Maintainability: Point out non-modular or hard-to-maintain structures and provide modular, maintainable code examples.
- Performance: Highlight performance issues and offer optimized code snippets.
- Accessibility: Suggest improvements for better accessibility with example code.
- Best Practices: Indicate deviations from best practices in the used tech stack (e.g., React, TypeScript) and correct them with code examples.
- Testing: Comment on testability and suggest testable code structures with example tests.
- Documentation: If documentation/comments are lacking or unclear, suggest better documentation with examples.

Provide answer in the next format:
## {Aspect 1}
### 1. {Name of the Issue}
{description}
Example
```<Code snippet or part of code with issue>```
Example of fixed issue - if applicable
```<Code snippet with fixed issue>``` - if applicable
## Run 1:
### Answer:
Below is a review of the code with suggested improvements. Each aspect is discussed with a clear description of the issue and code examples showing the problematic part and potential fixes.

--------------------------------------------------------------------------------
  
## Readability

### 1. Excessive Use of .bind() in Render Methods  
Description: In multiple places you call functions with .bind(this, …) inside render (e.g. onToggle, onDestroy, etc.). This pattern can clutter the render method and make it less readable.  
Example  
--------------------------------------------------
<input
  className="toggle"
  type="checkbox"
  checked={this.props.todo.completed}
  onChange={this.props.onToggle}  // elsewhere: onToggle={this.toggle.bind(this, todo)}
/>
--------------------------------------------------  
Fixed Issue: Use class properties with arrow functions or bind once in the constructor. For example, define handler methods as arrow functions so that they capture ‘this’ automatically.  
Example  
--------------------------------------------------
// In TodoItem.tsx, instead of using .bind() in render:
class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
  // Define methods as class properties:
  handleToggle = () => {
    this.props.onToggle();
  };
  // ...
  public render() {
    return (
      <li className={classNames({...})}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.handleToggle}
          />
          {/* other code */}
        </div>
      </li>
    );
  }
}
--------------------------------------------------

### 2. Outdated String Refs and Imperative DOM Access  
Description: The code uses string refs (for example, refs="newField" and refs="editField") and ReactDOM.findDOMNode to access inputs. This approach is deprecated and less clear.  
Example  
--------------------------------------------------
(ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value;
--------------------------------------------------  
Fixed Issue: Use React.createRef (or callback refs) and access the current element directly.  
Example  
--------------------------------------------------
// In TodoApp.tsx:
class TodoApp extends React.Component<IAppProps, IAppState> {
  private newFieldRef = React.createRef<HTMLInputElement>();

  public handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const input = this.newFieldRef.current;
    if (input) {
      const val = input.value.trim();
      if (val) {
        this.props.model.addTodo(val);
        input.value = '';
      }
    }
  };

  public render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          ref={this.newFieldRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={this.handleNewTodoKeyDown}
          autoFocus
        />
      </header>
    );
  }
}
--------------------------------------------------

## Maintainability

### 1. Routing Logic Hard-Coded in ComponentDidMount  
Description: The routing configuration is embedded inside componentDidMount and directly manipulates the component’s state via .bind(this, { … }). As your app grows, it may be better to decouple routing from the component logic.  
Example  
--------------------------------------------------
var router = Router({
  '/': setState.bind(this, {nowShowing: ALL_TODOS}),
  '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
  '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
});
--------------------------------------------------  
Fixed Issue: Consider moving routing to a separate module or use a more declarative approach (e.g. react-router) so that the component only consumes state provided by routing.  
Example  
--------------------------------------------------
// routes.ts (extracted)
export const routes = [
  { path: '/', nowShowing: ALL_TODOS },
  { path: '/active', nowShowing: ACTIVE_TODOS },
  { path: '/completed', nowShowing: COMPLETED_TODOS }
];
// Then in componentDidMount, iterate through routes or use react-router to render based on route.
--------------------------------------------------

### 2. Business Logic Mixed with UI  
Description: The TodoModel is tightly coupled with localStorage operations and internal state management. Extracting persistence logic can improve testability and modularity.  
Example  
--------------------------------------------------
public inform() {
  Utils.store(this.key, this.todos);
  this.onChanges.forEach(cb => cb());
}
--------------------------------------------------  
Fixed Issue: Extract storage/persistence into its own service class. This separation allows you to test TodoModel logic without side effects.  
Example  
--------------------------------------------------
// storageService.ts
export class StorageService {
  static save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  static load<T>(key: string): T | null {
    const store = localStorage.getItem(key);
    return store ? JSON.parse(store) : null;
  }
}

// In TodoModel.ts, use StorageService
import { StorageService } from "./storageService";
...
public inform() {
  StorageService.save(this.key, this.todos);
  this.onChanges.forEach(cb => cb());
}
--------------------------------------------------

## Performance

### 1. Inline Arrow Functions in Render  
Description: Inline arrow functions (e.g. onKeyDown={e => this.handleNewTodoKeyDown(e)}) are recreated on every render and may lead to unnecessary re-renders of child components.  
Example  
--------------------------------------------------
<input
  onKeyDown={ e => this.handleNewTodoKeyDown(e) }
/>
--------------------------------------------------  
Fixed Issue: Bind these event handler functions once (for instance, as class instance methods defined as arrow functions). This prevents creating a new function instance on every render.  
Example  
--------------------------------------------------
// In TodoApp.tsx, see previous example: handleNewTodoKeyDown is defined as a class property.
--------------------------------------------------

### 2. Use PureComponent (or memo) for Components With Shallow Props Comparison  
Description: In components like TodoItem that already implement shouldComponentUpdate, consider extending React.PureComponent (or using React.memo for functional components) to simplify the logic.  
Example  
--------------------------------------------------
class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
  public shouldComponentUpdate(nextProps, nextState) { ... }
}
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
class TodoItem extends React.PureComponent<ITodoItemProps, ITodoItemState> {
  // Remove manual shouldComponentUpdate unless deeper comparisons are required.
}
--------------------------------------------------

## Accessibility

### 1. Label and Input Associations  
Description: Some inputs lack explicit association with their labels. For instance, the "Mark all as complete" checkbox should be more accessible for screen reader users.  
Example  
--------------------------------------------------
<input
  id="toggle-all"
  className="toggle-all"
  type="checkbox"
  onChange={this.toggleAll}
/>
<label htmlFor="toggle-all">Mark all as complete</label>
--------------------------------------------------  
Fixed Issue: Although the code already links label to input via htmlFor and id, ensure that every interactive element provides proper aria attributes when necessary. For example, in the TodoItem’s destroy button, add an aria-label:  
--------------------------------------------------
<button
  className="destroy"
  onClick={this.props.onDestroy}
  aria-label="Delete todo item"
/>
--------------------------------------------------

### 2. Keyboard Navigation for Editing Items  
Description: For better accessibility, ensure that the edit input in TodoItem is announced correctly and focus management is smooth. Adding aria-live regions or hints can help.  
Example  
--------------------------------------------------
<input
  ref="editField"
  className="edit"
  value={this.state.editText}
  onBlur={ e => this.handleSubmit(e) }
  onChange={ e => this.handleChange(e) }
  onKeyDown={ e => this.handleKeyDown(e) }
/>
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
<input
  ref={this.editFieldRef}
  className="edit"
  value={this.state.editText}
  onBlur={this.handleSubmit}
  onChange={this.handleChange}
  onKeyDown={this.handleKeyDown}
  aria-label="Edit todo item"
/>
--------------------------------------------------
(Also see the earlier example to replace string refs with createRef.)

## Best Practices

### 1. Use TypeScript’s Strict Type Checking  
Description: Some functions use types like “any” or generic “var” declarations. Prefer const/let and explicit types where possible to leverage TypeScript’s power.  
Example  
--------------------------------------------------
var target : any = event.target;
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
const target = event.target as HTMLInputElement;
--------------------------------------------------

### 2. Remove Deprecated APIs  
Description: The usage of ReactDOM.findDOMNode is discouraged in favor of refs.  
Example  
--------------------------------------------------
(ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
--------------------------------------------------  
Fixed Issue: As shown previously, use React.createRef.
  
### 3. Consistent Formatting and Modern Syntax  
Description: Replace var with const/let throughout and use modern ES6+ patterns.  
Example  
--------------------------------------------------
var activeTodoCount = todos.reduce(function (accum, todo) {
  return todo.completed ? accum : accum + 1;
}, 0);
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
const activeTodoCount = todos.reduce((accum, todo) =>
  todo.completed ? accum : accum + 1
, 0);
--------------------------------------------------

## Testing

### 1. Decouple Business Logic from Presentation  
Description: TodoModel contains business logic that can be easily tested if isolated. Ensure that components receive their models via dependency injection so that you can supply mocks during testing.  
Example  
--------------------------------------------------
const model = new TodoModel('react-todos');
ReactDOM.render(<TodoApp model={model}/>, ...);
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
// In test, you could create a mock model:
class MockTodoModel {
  todos = [];
  subscribe = jest.fn();
  addTodo = jest.fn();
  ...
}
// Then inject it:
ReactDOM.render(<TodoApp model={new MockTodoModel()}/>, ...);
--------------------------------------------------

### 2. Write Unit Tests for Pure Components and Model Functions  
Description: By splitting business logic (TodoModel) and UI logic, you can write tests for each in isolation using frameworks like Jest or Mocha.  
Example of a test for TodoModel (using Jest)  
--------------------------------------------------
import { TodoModel } from './todoModel';

test('addTodo adds a valid todo', () => {
  const model = new TodoModel('test');
  const initialLength = model.todos.length;
  model.addTodo('New Todo');
  expect(model.todos.length).toBe(initialLength + 1);
});
--------------------------------------------------

## Documentation

### 1. Better Inline Documentation and Type Annotations  
Description: While some functions have minimal comments, using JSDoc comments can greatly improve self-documentation and developer onboarding, especially for public APIs like TodoModel.  
Example  
--------------------------------------------------
/**
 * Adds a new todo with the given title.
 * @param {string} title - The title of the todo
 */
public addTodo(title : string) { ... }
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
/**
 * Adds a new todo to the list.
 * Persists the updated list via localStorage.
 *
 * @param {string} title - The new todo title.
 * @returns {void}
 */
public addTodo(title: string): void {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  });
  this.inform();
}
--------------------------------------------------

### 2. Document the Data Structures  
Description: It can be beneficial to document interfaces (such as ITodo, ITodoModel, etc.) so that developers understand what properties and methods are available.  
Example  
--------------------------------------------------
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
--------------------------------------------------  
Fixed Issue:  
--------------------------------------------------
/**
 * Represents a single todo item.
 * @interface ITodo
 */
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
--------------------------------------------------

--------------------------------------------------------------------------------

By addressing these issues, the overall codebase will be more readable, maintainable, perform better, offer improved accessibility, and adhere to modern best practices. Additionally, clearer separation of concerns and proper documentation make the code easier to test and evolve over time.

### Tokens: {'input_tokens': 3342, 'output_tokens': 3339, 'reasoning_tokens': 704}
### Execution time: 15.703643798828125
