I have the following application code that needs to evaluate:

<source_code>
```tsx
// app.tsx
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

```tsx
// todoItem.tsx
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

```ts
// utils.ts

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

```tsx
// footer.tsx
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

```ts
// constants.ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

```ts
// todoModel.ts
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

</source_code>

Please follow these steps:

1. Analyze the provided React TypeScript application:
   - Identify structural patterns and component relationships
   - Understand the application's state management approach

2. Evaluate and suggest improvements for code readability:
   - Identify unclear variable names, functions, or logic flows
   - Suggest clearer alternatives with specific code examples
   - Address any complex or nested conditional statements

3. Assess code maintainability:
   - Identify non-modular or tightly coupled components
   - Suggest refactoring for better separation of concerns
   - Provide examples of more maintainable code structures

4. Analyze performance considerations:
   - Identify potential bottlenecks or inefficient operations
   - Review component lifecycle methods and rendering optimizations
   - Suggest performance improvements with specific code examples

5. Evaluate accessibility compliance:
   - Check for proper ARIA attributes and semantic HTML
   - Identify keyboard navigation issues
   - Suggest accessibility improvements with code examples

6. Review adherence to React and TypeScript best practices:
   - Identify outdated patterns or anti-patterns
   - Check for proper typing and interface definitions
   - Suggest modern React patterns (hooks, functional components)

7. Assess code documentation quality:
   - Review existing comments and documentation
   - Identify areas needing better documentation
   - Provide examples of improved documentation

8. Format your response using the following structure for each issue:
   - Category heading (e.g., ## Readability)
   - Issue name (e.g., ### 1. Unclear Function Names)
   - Description of the issue
   - Code example showing the issue
   - Code example showing the recommended solution
## Run 1:
### Answer:
Okay, let's analyze the provided React TypeScript TodoMVC application code.

This application is a classic implementation of the TodoMVC pattern using React class components and TypeScript. It demonstrates core React concepts like components, state, props, lifecycle methods, and event handling, combined with TypeScript for static typing. It also includes a custom data model (`TodoModel`) and utility functions (`Utils`).

Here's a detailed evaluation based on your criteria:

## 1. Structural Patterns and State Management

*   **Structural Pattern:** The application follows a typical parent-child component structure. `TodoApp` is the main container component, rendering `TodoItem` for each todo and `TodoFooter` for controls and filtering. This is a standard hierarchical component composition pattern in React.
*   **Component Relationships:**
    *   `TodoApp` is the parent of `TodoItem` (rendered via a list) and `TodoFooter`.
    *   `TodoApp` holds the main application state (`nowShowing` filter, `editing` todo ID).
    *   `TodoApp` interacts with the `TodoModel` instance passed as a prop to perform data operations (add, toggle, destroy, save, clear completed, toggle all).
    *   `TodoItem` is a presentational component that receives an individual `todo` object and callbacks (`onToggle`, `onDestroy`, `onEdit`, `onSave`, `onCancel`) as props. It also manages its own local state (`editText`) for the editing functionality.
    *   `TodoFooter` is a presentational component receiving counts, the current filter (`nowShowing`), and a callback (`onClearCompleted`) as props.
*   **State Management:**
    *   **Application Data (Todos):** Managed by the `TodoModel` class. This class holds the array of todos, persists them to `localStorage`, and implements a simple observer pattern (`subscribe`, `inform`) to notify listeners (specifically, the `render` function which re-renders the `TodoApp`) when the data changes. This is a custom, non-standard React pattern for managing application-level data outside the component tree.
    *   **UI State:** Managed within React components using `this.state`.
        *   `TodoApp` manages the current filter (`nowShowing`) and the ID of the todo being edited (`editing`).
        *   `TodoItem` manages the text content of the input field while editing (`editText`).
*   **Data Flow:** Data flows primarily downwards from `TodoApp` to `TodoItem` and `TodoFooter` via props. Actions (like toggling a todo, destroying a todo, saving an edit) are handled by callbacks passed down as props from `TodoApp` to `TodoItem` and `TodoFooter`. These callbacks then interact with the `TodoModel` instance held by `TodoApp`. The `TodoModel` notifies a global `render` function, which triggers a re-render of the entire `TodoApp` tree.

## 2. Readability

### 1. String Refs

*   **Description:** The code uses legacy string refs (`ref="newField"`, `ref="editField"`). String refs are older and have potential issues with module bundling and performance compared to callback refs or `React.createRef`. They are officially deprecated.
*   **Issue Code:**
    ```tsx
    // app.tsx
    <input
      ref="newField" // String ref
      className="new-todo"
      // ...
    />

    // todoItem.tsx
    <input
      ref="editField" // String ref
      className="edit"
      // ...
    />
    ```
*   **Recommended Solution:** Use `React.createRef` (for class components) or `useRef` (for functional components).

    ```tsx
    // app.tsx
    class TodoApp extends React.Component<IAppProps, IAppState> {
      private newFieldRef: React.RefObject<HTMLInputElement>; // Declare ref

      constructor(props : IAppProps) {
        super(props);
        this.state = { /* ... */ };
        this.newFieldRef = React.createRef(); // Initialize ref
      }

      public handleNewTodoKeyDown(event : React.KeyboardEvent) {
        // ...
        // Use current property of the ref object
        var val = (this.newFieldRef.current as HTMLInputElement).value.trim();
        // ...
        (this.newFieldRef.current as HTMLInputElement).value = '';
        // ...
      }

      public render() {
        return (
          <div>
            <header className="header">
              {/* ... */}
              <input
                ref={this.newFieldRef} // Assign ref object
                className="new-todo"
                placeholder="What needs to be done?"
                onKeyDown={ e => this.handleNewTodoKeyDown(e) }
                autoFocus={true}
              />
            </header>
            {/* ... */}
          </div>
        );
      }
    }

    // todoItem.tsx
    class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
      private editFieldRef: React.RefObject<HTMLInputElement>; // Declare ref

      constructor(props : ITodoItemProps){
        super(props);
        this.state = { editText: this.props.todo.title };
        this.editFieldRef = React.createRef(); // Initialize ref
      }

      public componentDidUpdate(prevProps : ITodoItemProps) {
        if (!prevProps.editing && this.props.editing) {
          // Use current property of the ref object
          var node = (this.editFieldRef.current as HTMLInputElement);
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
            {/* ... */}
            <input
              ref={this.editFieldRef} // Assign ref object
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
    ```

### 2. Use of `ReactDOM.findDOMNode`

*   **Description:** `ReactDOM.findDOMNode` is used to get the DOM node associated with a component instance or a ref. It's generally discouraged because it breaks encapsulation and can return `null` for components that don't render a DOM element (like fragments). It's also deprecated in Strict Mode. Direct access via `ref.current` is preferred.
*   **Issue Code:**
    ```tsx
    // app.tsx
    var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();
    // ...
    (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';

    // todoItem.tsx
    var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
    ```
*   **Recommended Solution:** Use the `.current` property of the ref object directly, as shown in the `React.createRef` example above.

### 3. Manual Object Extension in `Utils.extend`

*   **Description:** The `Utils.extend` function manually iterates over object properties to merge them. While functional, the spread syntax (`...`) is the modern, more concise, and readable way to achieve this in JavaScript/TypeScript.
*   **Issue Code:**
    ```ts
    // utils.ts
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
    ```
*   **Recommended Solution:** Replace `Utils.extend` usage with the spread syntax. The `Utils.extend` function itself can be removed or replaced with a simple spread.

    ```ts
    // todoModel.ts
    public toggleAll(checked : Boolean) {
      this.todos = this.todos.map<ITodo>((todo : ITodo) => {
        // Use spread syntax instead of Utils.extend
        return { ...todo, completed: checked };
      });
      this.inform();
    }

    public toggle(todoToToggle : ITodo) {
      this.todos = this.todos.map<ITodo>((todo : ITodo) => {
        return todo !== todoToToggle ?
          todo :
          // Use spread syntax instead of Utils.extend
          { ...todo, completed: !todo.completed };
      });
      this.inform();
    }

    public save(todoToSave : ITodo, text : string) {
      this.todos = this.todos.map(function (todo) {
        return todo !== todoToSave ? todo : { ...todo, title: text }; // Use spread syntax
      });
      this.inform();
    }
    ```

### 4. Inline Arrow Functions for Event Handlers (Minor)

*   **Description:** While using inline arrow functions (`e => this.handler(e)`) is common for binding `this` and passing event objects, defining class methods as arrow functions (`handler = (event) => { ... }`) can sometimes improve readability by keeping the handler logic separate and ensuring `this` is always correctly bound without needing `bind` or inline arrows. For simple handlers like these, the current approach is acceptable, but class properties are a modern alternative.
*   **Issue Code:**
    ```tsx
    // app.tsx
    onKeyDown={ e => this.handleNewTodoKeyDown(e) }
    onChange={ e => this.toggleAll(e) }
    onClearCompleted={ e=> this.clearCompleted() }

    // todoItem.tsx
    onDoubleClick={ e => this.handleEdit() }
    onBlur={ e => this.handleSubmit(e) }
    onChange={ e => this.handleChange(e) }
    onKeyDown={ e => this.handleKeyDown(e) }
    ```
*   **Recommended Solution:** (Optional) Use class property arrow functions.

    ```tsx
    // app.tsx
    class TodoApp extends React.Component<IAppProps, IAppState> {
      // ... constructor and state ...

      // Define as class property arrow function
      public handleNewTodoKeyDown = (event : React.KeyboardEvent) => {
        // ... logic ...
      }

      // Define as class property arrow function
      public toggleAll = (event : React.FormEvent) => {
        // ... logic ...
      }

      // ... other methods ...

      // Define as class property arrow function
      public clearCompleted = () => { // No event needed here
        this.props.model.clearCompleted();
      }

      public render() {
        return (
          <div>
            <header className="header">
              {/* ... */}
              <input
                ref={this.newFieldRef}
                className="new-todo"
                placeholder="What needs to be done?"
                onKeyDown={this.handleNewTodoKeyDown} // Pass the method directly
                autoFocus={true}
              />
            </header>
            {main}
            {footer}
          </div>
        );
      }
    }

    // todoItem.tsx
    class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
      // ... constructor and state ...

      // Define as class property arrow function
      public handleSubmit = (event : React.FormEvent) => {
        // ... logic ...
      }

      // Define as class property arrow function
      public handleEdit = () => {
        // ... logic ...
      }

      // Define as class property arrow function
      public handleKeyDown = (event : React.KeyboardEvent) => {
        // ... logic ...
      }

      // Define as class property arrow function
      public handleChange = (event : React.FormEvent) => {
        // ... logic ...
      }

      // ... lifecycle methods ...

      public render() {
        return (
          <li className={classNames({
            completed: this.props.todo.completed,
            editing: this.props.editing
          })}>
            <div className="view">
              {/* ... */}
              <label onDoubleClick={this.handleEdit}> {/* Pass method directly */}
                {this.props.todo.title}
              </label>
              {/* ... */}
            </div>
            <input
              ref={this.editFieldRef}
              className="edit"
              value={this.state.editText}
              onBlur={this.handleSubmit} {/* Pass method directly */}
              onChange={this.handleChange} {/* Pass method directly */}
              onKeyDown={this.handleKeyDown} {/* Pass method directly */}
            />
          </li>
        );
      }
    }
    ```

## 3. Maintainability

### 1. Custom `TodoModel` and Global `render`

*   **Description:** The `TodoModel` uses a manual `subscribe`/`inform` pattern and relies on a global `render` function to update the UI. This is not how state management is typically handled in modern React applications. It couples the data model directly to the rendering mechanism outside of React's component tree and state flow, making it harder to reason about updates, test, and integrate with standard React features like Context or state management libraries.
*   **Issue Code:**
    ```ts
    // todoModel.ts
    class TodoModel implements ITodoModel {
      // ...
      public onChanges : Array<any>; // Array of callbacks

      public subscribe(onChange) { // Add callback
        this.onChanges.push(onChange);
      }

      public inform() { // Call all callbacks
        Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) { cb(); });
      }
      // ... methods call this.inform() after changing this.todos
    }

    // app.tsx
    var model = new TodoModel('react-todos'); // Global instance

    function render() { // Global render function
      ReactDOM.render(
        <TodoApp model={model}/>, // Renders the root component
        document.getElementsByClassName('todoapp')[0]
      );
    }

    model.subscribe(render); // Subscribe the global render function
    render(); // Initial render
    ```
*   **Recommended Solution:** Integrate the `TodoModel` or its data into React's state management.
    *   **Option A (Simple):** Keep `TodoModel` but manage its data *within* `TodoApp`'s state. `TodoApp` would subscribe to `TodoModel` changes and update its *own* state, triggering re-renders naturally.
    *   **Option B (Better):** Use React Context to provide the `TodoModel` instance or the todo data and update functions to the component tree. Components can then consume this context.
    *   **Option C (Modern):** Use a dedicated state management library (like Zustand, Redux Toolkit, MobX, Recoil) which provides more structured and testable ways to manage application state outside of components while integrating seamlessly with React.

    *Example (Illustrative - Option A):*

    ```tsx
    // app.tsx
    // Remove global model and render function
    // var model = new TodoModel('react-todos');
    // function render() { ... }
    // model.subscribe(render);
    // render();

    class TodoApp extends React.Component<{}, IAppState> { // No model prop needed if managed internally
      private model: TodoModel; // Keep model instance inside the component

      public state : IAppState = {
        nowShowing: ALL_TODOS,
        editing: null,
        todos: [] // Add todos to component state
      };

      constructor(props : {}) { // No IAppProps needed
        super(props);
        this.model = new TodoModel('react-todos'); // Initialize model
        // Bind model's inform callback to update component state
        this.model.subscribe(() => this.setState({ todos: this.model.todos }));
      }

      public componentDidMount() {
        // Initialize state with todos from model after component mounts
        this.setState({ todos: this.model.todos });

        // Router setup remains similar, but updates component state directly
        var router = Router({
          '/': () => this.setState({nowShowing: ALL_TODOS}),
          '/active': () => this.setState({nowShowing: ACTIVE_TODOS}),
          '/completed': () => this.setState({nowShowing: COMPLETED_TODOS})
        });
        router.init('/');
      }

      // ... rest of the methods (handleNewTodoKeyDown, toggleAll, etc.)
      // These methods would now call this.model.addTodo(...) etc.
      // The model.inform() call inside TodoModel will trigger the subscription
      // which updates this component's state, causing a re-render.

      public render() {
        // Use state.todos instead of props.model.todos
        const todos = this.state.todos;
        // ... rest of render logic using 'todos' from state ...
      }
    }

    // Render the root component directly
    ReactDOM.render(
      <TodoApp />,
      document.getElementsByClassName('todoapp')[0]
    );
    ```
    *(Note: This is a simplified example. A full refactor might involve functional components and hooks for a more modern approach).*

### 2. Manual DOM Manipulation in `componentDidUpdate`

*   **Description:** Directly manipulating the DOM (`node.focus()`, `node.setSelectionRange()`) within `componentDidUpdate` is a form of imperative programming that can make components harder to understand and test compared to declarative approaches. While sometimes necessary for specific tasks like focusing inputs, relying on `findDOMNode` and manual manipulation increases coupling to the DOM structure.
*   **Issue Code:**
    ```tsx
    // todoItem.tsx
    public componentDidUpdate(prevProps : ITodoItemProps) {
      if (!prevProps.editing && this.props.editing) {
        var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }
    ```
*   **Recommended Solution:** Use `React.createRef` (or `useRef` with hooks) and access the DOM node via `ref.current`. While the *action* of focusing is still imperative, using refs is the standard React way to interact with DOM nodes when necessary. The code provided already uses `componentDidUpdate` correctly to only focus when editing starts, which is good. The improvement is primarily replacing `findDOMNode` and string refs. (See Readability section for ref examples).

### 3. Global `declare var Router`

*   **Description:** Declaring a global variable (`declare var Router`) makes the component dependent on external, non-imported code. This reduces modularity, makes testing harder, and isn't a standard way to handle dependencies in modern JavaScript/TypeScript projects.
*   **Issue Code:**
    ```tsx
    // app.tsx
    declare var Router; // Assumes Router exists globally
    // ...
    public componentDidMount() {
      var setState = this.setState;
      var router = Router({ // Uses the global Router
        // ...
      });
      router.init('/');
    }
    ```
*   **Recommended Solution:** Import the router library if it's a module, or integrate a standard React router library like `react-router-dom`.

    *Example (Illustrative with `react-router-dom`):*

    ```tsx
    // app.tsx
    // Remove declare var Router;
    // import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Example import

    // The routing logic would be handled differently, likely outside TodoApp
    // using <Route> components to render TodoApp with different 'nowShowing' props
    // or by using hooks like useLocation or useParams if using functional components.

    // Example of passing filter via props based on route (simplified)
    // In your root rendering file:
    /*
    import { HashRouter as Router, Route } from 'react-router-dom';
    // ... other imports ...

    ReactDOM.render(
      <Router>
        <Route path="/active">
          <TodoApp model={model} nowShowing={ACTIVE_TODOS} />
        </Route>
        <Route path="/completed">
          <TodoApp model={model} nowShowing={COMPLETED_TODOS} />
        </Route>
        <Route path="/"> // Default route
          <TodoApp model={model} nowShowing={ALL_TODOS} />
        </Route>
      </Router>,
      document.getElementsByClassName('todoapp')[0]
    );

    // TodoApp would then receive nowShowing as a prop and use it directly
    class TodoApp extends React.Component<IAppProps, IAppState> {
      // ... constructor ...
      // state would no longer need nowShowing if it comes from props
      // public state : IAppState = { editing: null };

      // componentDidMount would not initialize router
      // public componentDidMount() { /* ... */ }

      public render() {
        // Use this.props.nowShowing directly
        const nowShowing = this.props.nowShowing;
        // ... rest of render logic ...
      }
    }
    */
    ```

## 4. Performance Considerations

### 1. Calculations in `render`

*   **Description:** Filtering (`shownTodos`) and reducing (`activeTodoCount`, `completedCount`) the `todos` array happens directly within the `render` method of `TodoApp`. For a small list like a typical TodoMVC, this is perfectly acceptable and performant. However, for very large lists or more complex calculations, doing this on every render could become a bottleneck.
*   **Issue Code:**
    ```tsx
    // app.tsx
    public render() {
      // ...
      const todos = this.props.model.todos; // Or this.state.todos if refactored

      var shownTodos = todos.filter((todo) => { /* ... filter logic ... */ });

      var todoItems = shownTodos.map((todo) => { /* ... map to TodoItem ... */ });

      var activeTodoCount = todos.reduce(function (accum, todo) { /* ... reduce logic ... */ }, 0);

      var completedCount = todos.length - activeTodoCount;
      // ...
    }
    ```
*   **Recommended Solution:** For this application size, no change is strictly necessary. If performance became an issue with many todos, these calculations could be memoized using `useMemo` (in functional components) or potentially calculated in `componentDidUpdate` and stored in state (in class components), though the latter adds complexity.

### 2. `shouldComponentUpdate` in `TodoItem`

*   **Description:** `TodoItem` implements `shouldComponentUpdate` to manually check if props (`todo`, `editing`) or state (`editText`) have changed. This is a valid performance optimization for class components to prevent unnecessary re-renders of individual list items when the data they display hasn't changed. The implementation correctly checks for shallow changes.
*   **Issue Code:**
    ```tsx
    // todoItem.tsx
    public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
      return (
        nextProps.todo !== this.props.todo ||
        nextProps.editing !== this.props.editing ||
        nextState.editText !== this.state.editText
      );
    }
    ```
*   **Recommended Solution:** This is already a good optimization for class components. If refactoring to functional components, the equivalent would be wrapping the component in `React.memo`.

    ```tsx
    // todoItem.tsx (if refactored to functional component)
    import * as React from "react";
    // ... other imports ...

    const TodoItem: React.FC<ITodoItemProps> = React.memo(({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
      const [editText, setEditText] = React.useState(todo.title);
      // ... rest of the logic using hooks (useState, useEffect, useRef) ...

      return (
        // ... JSX ...
      );
    });

    export { TodoItem };
    ```
    `React.memo` performs a shallow comparison of props by default. If props are complex objects that change identity but not content, a custom comparison function can be provided as the second argument to `React.memo`.

## 5. Accessibility Compliance

### 1. Filter Links (`<a>`)

*   **Description:** The filter links (`All`, `Active`, `Completed`) use `<a>` tags with `href` attributes pointing to hash URLs (`#/`, `#/active`, `#/completed`). While this works for hash-based routing, semantically these are actions that filter the list *on the current page*, not links to different resources. Using `<a>` tags might imply navigation to screen readers or assistive technologies.
*   **Issue Code:**
    ```tsx
    // footer.tsx
    <a
      href="#/"
      className={classNames({selected: nowShowing === ALL_TODOS})}>
        All
    </a>
    // ... similar for Active and Completed
    ```
*   **Recommended Solution:** If using a proper client-side router (like `react-router-dom`), use the router's `Link` component. If sticking to hash routing or refactoring state management, consider using `<button>` elements styled as links, as they semantically represent actions. Add `aria-current="page"` to the currently selected filter link/button.

    *Example using buttons:*

    ```tsx
    // footer.tsx
    // ...
    <ul className="filters">
      <li>
        <button // Use button
          className={classNames({selected: nowShowing === ALL_TODOS})}
          onClick={() => this.props.onFilterChange(ALL_TODOS)} // Assuming a new prop for filter change
          aria-current={nowShowing === ALL_TODOS ? 'page' : undefined} // Add aria-current
        >
            All
        </button>
      </li>
      {' '}
      <li>
        <button // Use button
          className={classNames({selected: nowShowing === ACTIVE_TODOS})}
          onClick={() => this.props.onFilterChange(ACTIVE_TODOS)}
          aria-current={nowShowing === ACTIVE_TODOS ? 'page' : undefined} // Add aria-current
        >
            Active
        </button>
      </li>
      {' '}
      <li>
        <button // Use button
          className={classNames({selected: nowShowing === COMPLETED_TODOS})}
          onClick={() => this.props.onFilterChange(COMPLETED_TODOS)}
          aria-current={nowShowing === COMPLETED_TODOS ? 'page' : undefined} // Add aria-current
        >
            Completed
        </button>
      </li>
    </ul>
    // ...
    ```
    *(Requires adding an `onFilterChange` prop to `TodoFooter` and handling it in `TodoApp`)*

### 2. Editing Input Accessibility

*   **Description:** When a todo item is double-clicked, the label is replaced by an input field for editing. The input field appears without a corresponding `<label>` element associated with it in the DOM structure at that moment. While the visual label is the original todo title, the input itself lacks an explicit, persistent label for assistive technologies.
*   **Issue Code:**
    ```tsx
    // todoItem.tsx
    <li className={classNames({
      completed: this.props.todo.completed,
      editing: this.props.editing // This class hides the view and shows the input
    })}>
      <div className="view"> {/* Shown when not editing */}
        {/* ... checkbox and label ... */}
        <label onDoubleClick={ e => this.handleEdit() }>
          {this.props.todo.title}
        </label>
        {/* ... destroy button ... */}
      </div>
      <input {/* Shown when editing */}
        ref="editField"
        className="edit"
        value={this.state.editText}
        onBlur={ e => this.handleSubmit(e) }
        onChange={ e => this.handleChange(e) }
        onKeyDown={ e => this.handleKeyDown(e) }
      />
    </li>
    ```
*   **Recommended Solution:** When the input field is rendered, associate it with the todo's title using `aria-label` or `aria-labelledby`. Since the original label element is hidden, `aria-label` is simpler here.

    ```tsx
    // todoItem.tsx
    // ...
    <input
      ref={this.editFieldRef} // Using ref object
      className="edit"
      value={this.state.editText}
      onBlur={this.handleSubmit}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
      aria-label={`Edit todo: ${this.props.todo.title}`} // Add aria-label
    />
    // ...
    ```

### 3. Keyboard Navigation for Editing Blur

*   **Description:** The `onBlur` event on the editing input triggers the `handleSubmit` function, which saves the changes or destroys the todo if the input is empty. This matches the TodoMVC specification but means if a user navigates away from the input using the Tab key, the changes are saved immediately. While functional, some users might expect Tab to simply move focus without triggering a save action, which is typically associated with Enter or a Save button.
*   **Issue Code:**
    ```tsx
    // todoItem.tsx
    <input
      // ...
      onBlur={ e => this.handleSubmit(e) } // Save/destroy on blur
      // ...
    />
    ```
*   **Recommended Solution:** This is a UX/A11y trade-off following the spec. If a different behavior is desired, the `onBlur` handler could be modified or removed, requiring users to explicitly press Enter or click a Save button (which would need to be added) to finalize edits. For strict TodoMVC compliance, the current behavior is correct but worth noting as a potential point of friction for some users.

## 6. React and TypeScript Best Practices

### 1. Class Components vs. Functional Components and Hooks

*   **Description:** The application is built using React class components. While still supported, functional components with hooks are the modern standard for writing React components. Hooks provide a more concise way to manage state, side effects, and context, often leading to more readable and reusable code.
*   **Issue Code:** The entire application is based on `class ... extends React.Component`.
*   **Recommended Solution:** Refactor components to use functional components and hooks (`useState`, `useEffect`, `useRef`, `useContext`).

    *Example (Illustrative - `TodoItem` refactored):*

    ```tsx
    // todoItem.tsx
    import * as classNames from "classnames";
    import * as React from "react";
    // ReactDOM.findDOMNode is not needed with hooks
    import { ENTER_KEY, ESCAPE_KEY } from "./constants";

    // Use functional component
    const TodoItem: React.FC<ITodoItemProps> = React.memo(({
      todo,
      onToggle,
      onDestroy,
      onEdit,
      editing,
      onSave,
      onCancel
    }) => {
      // Use useState for local state
      const [editText, setEditText] = React.useState(todo.title);
      // Use useRef for DOM access
      const editFieldRef = React.useRef<HTMLInputElement>(null);

      // Sync local state when todo title changes from props (e.g., after save)
      React.useEffect(() => {
        setEditText(todo.title);
      }, [todo.title]); // Dependency array ensures this runs only when todo.title changes

      // Focus input when editing starts
      React.useEffect(() => {
        if (editing) {
          const node = editFieldRef.current;
          if (node) {
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
          }
        }
      }, [editing]); // Dependency array ensures this runs only when 'editing' prop changes

      const handleSubmit = () => {
        const val = editText.trim();
        if (val) {
          onSave(val);
          // No need to setState({ editText: val }) here, as the useEffect above
          // will sync the state from the prop update triggered by onSave.
        } else {
          onDestroy();
        }
      };

      const handleEdit = () => {
        onEdit();
        // No need to setState({ editText: this.props.todo.title }) here,
        // as the useEffect above will sync the state from the prop.
      };

      const handleKeyDown = (event : React.KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY) {
          setEditText(todo.title); // Revert local state
          onCancel(); // Call cancel prop
        } else if (event.keyCode === ENTER_KEY) {
          handleSubmit(); // Call submit handler
        }
      };

      const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => { // Use more specific event type
        setEditText(event.target.value);
      };

      // shouldComponentUpdate logic is handled by React.memo

      return (
        <li className={classNames({
          completed: todo.completed,
          editing: editing
        })}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={todo.completed}
              onChange={onToggle} // Pass prop directly
            />
            <label onDoubleClick={handleEdit}> {/* Pass handler directly */}
              {todo.title}
            </label>
            <button className="destroy" onClick={onDestroy} /> {/* Pass prop directly */}
          </div>
          <input
            ref={editFieldRef} // Assign ref object
            className="edit"
            value={editText}
            onBlur={handleSubmit} // Pass handler directly
            onChange={handleChange} // Pass handler directly
            onKeyDown={handleKeyDown} // Pass handler directly
            aria-label={`Edit todo: ${todo.title}`} // Add aria-label
          />
        </li>
      );
    });

    export { TodoItem };
    ```

### 2. Type Safety (`any` usage)

*   **Description:** While TypeScript is used, there are instances where `any` is used for event targets (`var target : any = event.target;`, `var input : any = event.target;`). More specific event types and accessing properties safely can improve type safety.
*   **Issue Code:**
    ```tsx
    // app.tsx
    public toggleAll(event : React.FormEvent) {
      var target : any = event.target; // Using any
      var checked = target.checked;
      this.props.model.toggleAll(checked);
    }

    // todoItem.tsx
    public handleChange(event : React.FormEvent) {
      var input : any = event.target; // Using any
      this.setState({ editText : input.value });
    }
    ```
*   **Recommended Solution:** Use more specific event types and type assertions or checks.

    ```tsx
    // app.tsx
    public toggleAll(event : React.ChangeEvent<HTMLInputElement>) { // Use ChangeEvent for input
      // event.target is now typed as HTMLInputElement
      var checked = event.target.checked;
      this.props.model.toggleAll(checked);
    }

    // todoItem.tsx
    public handleChange(event : React.ChangeEvent<HTMLInputElement>) { // Use ChangeEvent for input
      // event.target is now typed as HTMLInputElement
      this.setState({ editText : event.target.value });
    }
    ```

### 3. Custom `Utils.extend` vs. Spread Syntax

*   **Description:** As mentioned in Readability, using a custom `extend` function when the native spread syntax is available is an anti-pattern in modern JavaScript/TypeScript.
*   **Issue Code:** See Readability section.
*   **Recommended Solution:** Use spread syntax (`{ ...obj1, ...obj2 }`). See Readability section for examples.

### 4. Custom `TodoModel` Subscription vs. React State/Context

*   **Description:** Relying on a custom observer pattern outside of React's state management is not a standard React practice and makes the application less idiomatic and harder to integrate with the React ecosystem.
*   **Issue Code:** See Maintainability section.
*   **Recommended Solution:** Integrate state management using standard React patterns (Context, hooks) or libraries. See Maintainability section for discussion.

## 7. Code Documentation Quality

### 1. Lack of Component/Method Descriptions

*   **Description:** The code has very few comments explaining the purpose of classes, methods, or complex logic blocks. While the code is relatively simple for TodoMVC, adding documentation (especially using TSDoc/JSDoc syntax) would significantly improve maintainability, particularly for developers new to the codebase.
*   **Issue Code:** Most classes and public methods lack descriptive comments.
    ```tsx
    // app.tsx
    class TodoApp extends React.Component<IAppProps, IAppState> {
      // No comment explaining what TodoApp does
      public state : IAppState;
      constructor(props : IAppProps) { /* ... */ }
      public componentDidMount() { /* ... */ } // No comment explaining router setup
      public handleNewTodoKeyDown(event : React.KeyboardEvent) { /* ... */ } // No comment explaining input handling
      // ...
    }
    ```
*   **Recommended Solution:** Add TSDoc/JSDoc comments to classes, methods, and complex logic.

    ```tsx
    // app.tsx
    /**
     * The main Todo application component.
     * Manages the list of todos, filtering, and editing state.
     */
    class TodoApp extends React.Component<IAppProps, IAppState> {
      private newFieldRef: React.RefObject<HTMLInputElement>;

      constructor(props : IAppProps) {
        super(props);
        this.state = {
          nowShowing: ALL_TODOS,
          editing: null
        };
        this.newFieldRef = React.createRef();
      }

      /**
       * Sets up the hash-based router to update the filter state based on the URL.
       */
      public componentDidMount() {
        // ... router setup ...
      }

      /**
       * Handles the key down event on the new todo input field.
       * Adds a new todo when the Enter key is pressed.
       * @param event The keyboard event.
       */
      public handleNewTodoKeyDown(event : React.KeyboardEvent) {
        // ... logic ...
      }

      /**
       * Toggles the completion status of all todos.
       * @param event The form event from the toggle-all checkbox.
       */
      public toggleAll(event : React.ChangeEvent<HTMLInputElement>) {
        // ... logic ...
      }

      // ... add comments for other methods ...

      public render() {
        // ... render logic ...
      }
    }
    ```

### 2. Missing Interface Definitions

*   **Description:** The code uses type annotations like `IAppProps`, `IAppState`, `ITodo`, `ITodoItemProps`, `ITodoItemState`, `ITodoFooterProps`, `ITodoModel`. However, the definitions for these interfaces are not included in the provided source code. While the code compiles if these interfaces are defined elsewhere, including them or referencing where they are defined is crucial for understanding the expected data structures.
*   **Issue Code:** The interfaces are used but not defined in the provided snippets.
    ```tsx
    // app.tsx
    class TodoApp extends React.Component<IAppProps, IAppState> { /* ... */ }
    // ...
    public toggle(todoToToggle : ITodo) { /* ... */ }

    // todoItem.tsx
    class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> { /* ... */ }
    // ...
    constructor(props : ITodoItemProps){ /* ... */ }

    // todoModel.ts
    class TodoModel implements ITodoModel { /* ... */ }
    // ...
    public todos : Array<ITodo>;
    ```
*   **Recommended Solution:** Include the interface definitions in the relevant files or in a dedicated types file (`types.ts` or `interfaces.ts`) and import them.

    *Example (`types.ts`):*

    ```ts
    // types.ts
    interface ITodo {
      id: string;
      title: string;
      completed: boolean;
    }

    interface IAppProps {
      model: ITodoModel; // Assuming TodoApp still takes model as prop initially
      // If refactored, this might change
    }

    interface IAppState {
      nowShowing: string; // Use the constant types if possible, e.g., type TodoFilter = typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS;
      editing: string | null; // ID of the todo being edited
      todos?: ITodo[]; // Add todos here if managing state internally
    }

    interface ITodoItemProps {
      todo: ITodo;
      onToggle: () => void;
      onDestroy: () => void;
      onEdit: () => void;
      editing: boolean;
      onSave: (text: string) => void;
      onCancel: () => void; // Simplified from event => this.cancel()
    }

    interface ITodoItemState {
      editText: string;
    }

    interface ITodoFooterProps {
      count: number; // Active todo count
      completedCount: number;
      nowShowing: string; // Current filter
      onClearCompleted: () => void;
      onFilterChange?: (filter: string) => void; // Add if refactoring filter handling
    }

    interface ITodoModel {
      key: string;
      todos: ITodo[];
      onChanges: Array<() => void>; // More specific type than any

      subscribe(onChange: () => void): void;
      inform(): void;
      addTodo(title: string): void;
      toggleAll(checked: boolean): void;
      toggle(todoToToggle: ITodo): void;
      destroy(todo: ITodo): void;
      save(todoToSave: ITodo, text: string): void;
      clearCompleted(): void;
    }
    ```
    Then import these interfaces where needed.

## Summary of Key Improvement Areas:

1.  **State Management:** The custom `TodoModel` subscription pattern and global render function are the most significant deviations from modern React practices. Refactoring to use React's built-in state management (Context, hooks) or a dedicated library would greatly improve maintainability and testability.
2.  **Legacy React APIs:** String refs and `ReactDOM.findDOMNode` are deprecated. Replacing them with `React.createRef` (or `useRef`) and direct ref access is a necessary update.
3.  **Class Components:** While functional, refactoring to functional components with hooks is the modern standard and often leads to more concise and reusable code.
4.  **Dependency Management:** The global `declare var Router` should be replaced by importing a router library.
5.  **Accessibility:** Improve filter link semantics and add `aria-label` to the editing input.
6.  **Readability/Modern Syntax:** Replace `Utils.extend` with spread syntax. Consider using class property arrow functions for handlers.
7.  **Documentation:** Add TSDoc/JSDoc comments and ensure all interfaces are defined and accessible.

Overall, the code is a functional implementation of TodoMVC using React and TypeScript from a slightly older era of React development (pre-hooks, using class components and some legacy patterns). It's well-structured within its chosen paradigm but can be significantly modernized and improved in terms of maintainability, readability, and adherence to current best practices.

### Tokens: {'input_tokens': 4044, 'output_tokens': 10115}
### Execution time: 71.33652210235596
