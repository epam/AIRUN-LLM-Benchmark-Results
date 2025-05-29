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
### Thoughts:
Let me analyze this React TypeScript application step by step.

Looking at the structure:
1. This appears to be a Todo application (TodoMVC)
2. Main components: TodoApp (main component), TodoItem, TodoFooter
3. State management: Using a TodoModel class with a pub-sub pattern
4. The app uses older React patterns (class components, refs, ReactDOM.findDOMNode)

Key issues I notice:
1. **Outdated patterns**: Using string refs, ReactDOM.findDOMNode, class components
2. **Type safety**: Missing interface definitions (IAppProps, IAppState, ITodo, etc.)
3. **State management**: Using a custom model with subscribe pattern instead of modern approaches
4. **Performance**: Binding functions in render, using array index as keys could be problematic
5. **Accessibility**: Some issues with keyboard navigation and ARIA attributes
6. **Code organization**: Mixing concerns in components

Let me go through each category systematically.

### Answer:
# React TypeScript Todo Application Analysis

## Readability

### 1. Unclear Variable Names

**Issue**: Variable names like `val`, `cb`, and single-letter parameters reduce code readability.

**Current Code**:
```tsx
var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

this.onChanges.forEach(function (cb) { cb(); });
```

**Recommended Solution**:
```tsx
const todoTitle = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

this.onChanges.forEach(function (callback) { callback(); });
```

### 2. Complex Conditional Logic

**Issue**: Nested ternary operators and switch statements reduce readability.

**Current Code**:
```tsx
return todo !== todoToToggle ?
  todo :
  Utils.extend({}, todo, {completed: !todo.completed});
```

**Recommended Solution**:
```tsx
if (todo !== todoToToggle) {
  return todo;
}
return { ...todo, completed: !todo.completed };
```

### 3. Magic Numbers

**Issue**: Using raw numbers without clear naming.

**Current Code**:
```tsx
uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
```

**Recommended Solution**:
```tsx
const UUID_VERSION_POSITION = 12;
const UUID_VARIANT_POSITION = 16;
const UUID_VERSION = 4;
const UUID_VARIANT_MASK = 3;
const UUID_VARIANT_BITS = 8;

uuid += (i === UUID_VERSION_POSITION ? UUID_VERSION : 
         (i === UUID_VARIANT_POSITION ? (random & UUID_VARIANT_MASK | UUID_VARIANT_BITS) : random))
```

## Maintainability

### 1. Outdated React Patterns

**Issue**: Using deprecated features like string refs and ReactDOM.findDOMNode.

**Current Code**:
```tsx
var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();
```

**Recommended Solution**:
```tsx
// Using React.createRef
class TodoApp extends React.Component<IAppProps, IAppState> {
  private newFieldRef = React.createRef<HTMLInputElement>();

  public handleNewTodoKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    
    const todoTitle = this.newFieldRef.current?.value.trim();
    if (todoTitle) {
      this.props.model.addTodo(todoTitle);
      this.newFieldRef.current.value = '';
    }
  }

  // In render:
  <input
    ref={this.newFieldRef}
    className="new-todo"
    // ...
  />
}
```

### 2. Tight Coupling with External Router

**Issue**: Direct dependency on global Router variable.

**Current Code**:
```tsx
declare var Router;
// ...
var router = Router({
  '/': setState.bind(this, {nowShowing: ALL_TODOS}),
  // ...
});
```

**Recommended Solution**:
```tsx
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

// Modern React Router implementation
function TodoApp() {
  const location = useLocation();
  const nowShowing = location.pathname === '/active' ? ACTIVE_TODOS :
                     location.pathname === '/completed' ? COMPLETED_TODOS : ALL_TODOS;
  // ...
}
```

### 3. Convert to Functional Components

**Issue**: Class components are verbose and don't support hooks.

**Current Code**:
```tsx
class TodoFooter extends React.Component<ITodoFooterProps, {}> {
  public render() {
    // ...
  }
}
```

**Recommended Solution**:
```tsx
interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ 
  count, 
  completedCount, 
  nowShowing, 
  onClearCompleted 
}) => {
  const activeTodoWord = Utils.pluralize(count, 'item');
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      {/* ... */}
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
```

## Performance

### 1. Function Binding in Render

**Issue**: Creating new function instances on every render.

**Current Code**:
```tsx
<TodoItem
  onToggle={this.toggle.bind(this, todo)}
  onDestroy={this.destroy.bind(this, todo)}
  onEdit={this.edit.bind(this, todo)}
  onSave={this.save.bind(this, todo)}
/>
```

**Recommended Solution**:
```tsx
// Using arrow functions in class properties
class TodoApp extends React.Component<IAppProps, IAppState> {
  private toggle = (todoToToggle: ITodo) => {
    this.props.model.toggle(todoToToggle);
  }

  // Or with hooks:
  const TodoApp: React.FC<TodoAppProps> = ({ model }) => {
    const toggle = useCallback((todoToToggle: ITodo) => {
      model.toggle(todoToToggle);
    }, [model]);
    
    return todoItems.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => toggle(todo)}
        // ...
      />
    ));
  };
}
```

### 2. Inefficient UUID Generation

**Issue**: String concatenation in loop is inefficient.

**Current Code**:
```tsx
public static uuid() : string {
  var uuid = '';
  for (i = 0; i < 32; i++) {
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }
  return uuid;
}
```

**Recommended Solution**:
```tsx
public static uuid(): string {
  // Use crypto.randomUUID() if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback to more efficient implementation
  const segments = [];
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      segments.push('-');
    } else if (i === 14) {
      segments.push('4');
    } else if (i === 19) {
      segments.push(((Math.random() * 16 | 0) & 3 | 8).toString(16));
    } else {
      segments.push((Math.random() * 16 | 0).toString(16));
    }
  }
  return segments.join('');
}
```

## Accessibility

### 1. Missing ARIA Labels

**Issue**: Interactive elements lack proper ARIA attributes.

**Current Code**:
```tsx
<button className="destroy" onClick={this.props.onDestroy} />
```

**Recommended Solution**:
```tsx
<button 
  className="destroy" 
  onClick={this.props.onDestroy}
  aria-label={`Delete todo: ${this.props.todo.title}`}
/>
```

### 2. Focus Management

**Issue**: No focus management after actions like deleting todos.

**Current Code**:
```tsx
public destroy(todo : ITodo) {
  this.props.model.destroy(todo);
}
```

**Recommended Solution**:
```tsx
const TodoItem: React.FC<TodoItemProps> = ({ todo, onDestroy, index, totalItems }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  
  const handleDestroy = () => {
    // Store reference to next or previous item
    const nextElement = itemRef.current?.nextElementSibling || 
                       itemRef.current?.previousElementSibling;
    
    onDestroy(todo);
    
    // Focus management
    if (nextElement instanceof HTMLElement) {
      nextElement.querySelector<HTMLInputElement>('.toggle')?.focus();
    }
  };
  
  return (
    <li ref={itemRef} className={classNames({/* ... */})}>
      {/* ... */}
    </li>
  );
};
```

### 3. Form Semantics

**Issue**: Input field without proper form structure.

**Current Code**:
```tsx
<input
  ref="newField"
  className="new-todo"
  placeholder="What needs to be done?"
  onKeyDown={ e => this.handleNewTodoKeyDown(e) }
/>
```

**Recommended Solution**:
```tsx
<form onSubmit={handleSubmit} role="form" aria-label="Create new todo">
  <input
    ref={newFieldRef}
    className="new-todo"
    placeholder="What needs to be done?"
    aria-label="New todo input"
    type="text"
    autoComplete="off"
  />
</form>
```

## React and TypeScript Best Practices

### 1. Missing Type Definitions

**Issue**: Interfaces are referenced but not defined in the code.

**Recommended Solution**:
```tsx
// types.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoModel {
  todos: ITodo[];
  subscribe(callback: () => void): void;
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todo: ITodo): void;
  destroy(todo: ITodo): void;
  save(todo: ITodo, text: string): void;
  clearCompleted(): void;
}

export interface IAppProps {
  model: ITodoModel;
}

export interface IAppState {
  nowShowing: string;
  editing: string | null;
}
```

### 2. State Management Modernization

**Issue**: Custom pub-sub pattern instead of modern state management.

**Recommended Solution**:
```tsx
// Using React Context and useReducer
interface TodoState {
  todos: ITodo[];
  filter: 'all' | 'active' | 'completed';
  editingId: string | null;
}

type TodoAction = 
  | { type: 'ADD_TODO'; title: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'EDIT_TODO'; id: string; title: string }
  | { type: 'TOGGLE_ALL'; completed: boolean }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_FILTER'; filter: TodoState['filter'] }
  | { type: 'SET_EDITING'; id: string | null };

const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
} | null>(null);

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: crypto.randomUUID(),
          title: action.title,
          completed: false
        }]
      };
    // ... other cases
  }
};
```

### 3. Proper Error Boundaries

**Issue**: No error handling for component failures.

**Recommended Solution**:
```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Todo app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
<ErrorBoundary>
  <TodoApp model={model} />
</ErrorBoundary>
```

## Documentation

### 1. Missing JSDoc Comments

**Issue**: Key functions lack documentation.

**Current Code**:
```tsx
public save(todoToSave : ITodo, text : string) {
  this.todos = this.todos.map(function (todo) {
    return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
  });
  this.inform();
}
```

**Recommended Solution**:
```tsx
/**
 * Updates the title of a specific todo item
 * @param todoToSave - The todo item to update
 * @param text - The new title for the todo
 * @example
 * model.save(todoItem, "Updated todo title");
 */
public save(todoToSave: ITodo, text: string): void {
  this.todos = this.todos.map(todo => 
    todo !== todoToSave ? todo : { ...todo, title: text }
  );
  this.inform();
}
```

### 2. Component Documentation

**Issue**: Components lack proper documentation about props and behavior.

**Recommended Solution**:
```tsx
/**
 * TodoItem Component
 * 
 * Renders a single todo item with edit, delete, and toggle functionality.
 * Supports inline editing with keyboard shortcuts (Enter to save, Escape to cancel).
 * 
 * @component
 * @example
 * <TodoItem
 *   todo={{ id: '1', title: 'Buy milk', completed: false }}
 *   onToggle={(todo) => console.log('Toggle', todo)}
 *   onDestroy={(todo) => console.log('Delete', todo)}
 *   onEdit={(todo) => console.log('Edit', todo)}
 *   editing={false}
 *   onSave={(todo, text) => console.log('Save', todo, text)}
 *   onCancel={() => console.log('Cancel')}
 * />
 */
interface TodoItemProps {
  /** The todo item to display */
  todo: ITodo;
  /** Callback when the todo's completed status is toggled */
  onToggle: (todo: ITodo) => void;
  /** Callback when the todo is deleted */
  onDestroy: (todo: ITodo) => void;
  /** Callback when edit mode is activated */
  onEdit: (todo: ITodo) => void;
  /** Whether this item is currently being edited */
  editing: boolean;
  /** Callback when edit is saved with new text */
  onSave: (todo: ITodo, text: string) => void;
  /** Callback when edit is cancelled */
  onCancel: () => void;
}
```

### 3. README Documentation

**Issue**: No high-level documentation about the application structure.

**Recommended Solution**:
```markdown
# Todo Application

## Architecture

This application follows the TodoMVC specification with the following structure:

- **Components**:
  - `TodoApp`: Main container component managing application state
  - `TodoItem`: Individual todo item with edit/delete/toggle functionality
  - `TodoFooter`: Footer with filters and stats
  
- **State Management**:
  - Uses a custom TodoModel with pub-sub pattern for state updates
  - Persists to localStorage automatically
  
- **Routing**:
  - Hash-based routing for filter states (/active, /completed)

## Development

```bash
npm install
npm start
```

## Testing

```bash
npm test
```
```

### Tokens: {'input_tokens': 4331, 'output_tokens': 4337}
### Execution time: 53.45399785041809
