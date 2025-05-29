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
# React TypeScript TodoMVC Application Code Review

## Application Overview

This is a TodoMVC implementation using React class components with TypeScript. The application follows a traditional MVC pattern with a centralized model for state management and uses string refs and legacy React patterns.

---

## Readability

### 1. Unclear Variable Names and Magic Values

**Issue:** The code uses abbreviated variable names and magic DOM queries that reduce readability.

**Current Code:**
```tsx
var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();
var setState = this.setState;
```

**Recommended Solution:**
```tsx
const inputValue = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();
const setAppState = this.setState;
```

### 2. Complex Conditional Logic in Render

**Issue:** The filtering logic in render method is embedded and hard to follow.

**Current Code:**
```tsx
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
```

**Recommended Solution:**
```tsx
private getFilteredTodos = (todos: ITodo[], filter: string): ITodo[] => {
  switch (filter) {
    case ACTIVE_TODOS:
      return todos.filter(todo => !todo.completed);
    case COMPLETED_TODOS:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

// In render:
const shownTodos = this.getFilteredTodos(todos, this.state.nowShowing);
```

---

## Maintainability

### 1. Tightly Coupled Components with String Refs

**Issue:** Using deprecated string refs creates tight coupling and makes testing difficult.

**Current Code:**
```tsx
<input
  ref="newField"
  className="new-todo"
  placeholder="What needs to be done?"
  onKeyDown={ e => this.handleNewTodoKeyDown(e) }
  autoFocus={true}
/>
```

**Recommended Solution:**
```tsx
private newFieldRef = React.createRef<HTMLInputElement>();

<input
  ref={this.newFieldRef}
  className="new-todo"
  placeholder="What needs to be done?"
  onKeyDown={this.handleNewTodoKeyDown}
  autoFocus={true}
/>

public handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
  if (event.keyCode !== ENTER_KEY) return;
  
  event.preventDefault();
  const inputValue = this.newFieldRef.current?.value.trim();
  
  if (inputValue) {
    this.props.model.addTodo(inputValue);
    this.newFieldRef.current!.value = '';
  }
};
```

### 2. Mixed Responsibilities in TodoApp Component

**Issue:** The main component handles routing, state management, and UI rendering.

**Current Code:**
```tsx
public componentDidMount() {
  var setState = this.setState;
  var router = Router({
    '/': setState.bind(this, {nowShowing: ALL_TODOS}),
    '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
    '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
  });
  router.init('/');
}
```

**Recommended Solution:**
```tsx
// Separate routing logic
class TodoRouter {
  private onRouteChange: (route: string) => void;
  
  constructor(onRouteChange: (route: string) => void) {
    this.onRouteChange = onRouteChange;
  }
  
  init() {
    const router = Router({
      '/': () => this.onRouteChange(ALL_TODOS),
      '/active': () => this.onRouteChange(ACTIVE_TODOS),
      '/completed': () => this.onRouteChange(COMPLETED_TODOS)
    });
    router.init('/');
  }
}

// In component:
private router = new TodoRouter((route) => {
  this.setState({ nowShowing: route });
});

public componentDidMount() {
  this.router.init();
}
```

---

## Performance

### 1. Inefficient Event Handler Binding

**Issue:** Creating new function instances on every render causes unnecessary re-renders.

**Current Code:**
```tsx
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
```

**Recommended Solution:**
```tsx
// Use arrow functions as class properties
public toggle = (todoToToggle: ITodo) => {
  this.props.model.toggle(todoToToggle);
};

public destroy = (todo: ITodo) => {
  this.props.model.destroy(todo);
};

// Create memoized handlers
private createTodoHandlers = memoize((todo: ITodo) => ({
  onToggle: () => this.toggle(todo),
  onDestroy: () => this.destroy(todo),
  onEdit: () => this.edit(todo),
  onSave: (text: string) => this.save(todo, text),
}));

// In render:
const todoItems = shownTodos.map((todo) => (
  <TodoItem
    key={todo.id}
    todo={todo}
    {...this.createTodoHandlers(todo)}
    editing={this.state.editing === todo.id}
    onCancel={this.cancel}
  />
));
```

### 2. Unnecessary DOM Queries

**Issue:** Multiple DOM queries for the same element.

**Current Code:**
```tsx
var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();
if (val) {
  this.props.model.addTodo(val);
  (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';
}
```

**Recommended Solution:**
```tsx
const inputElement = this.newFieldRef.current;
if (!inputElement) return;

const inputValue = inputElement.value.trim();
if (inputValue) {
  this.props.model.addTodo(inputValue);
  inputElement.value = '';
}
```

---

## Accessibility

### 1. Missing ARIA Labels and Semantic Structure

**Issue:** The application lacks proper ARIA attributes and semantic HTML.

**Current Code:**
```tsx
<input
  id="toggle-all"
  className="toggle-all"
  type="checkbox"
  onChange={ e => this.toggleAll(e) }
  checked={activeTodoCount === 0}
/>
<label htmlFor="toggle-all">
  Mark all as complete
</label>
```

**Recommended Solution:**
```tsx
<input
  id="toggle-all"
  className="toggle-all"
  type="checkbox"
  onChange={this.toggleAll}
  checked={activeTodoCount === 0}
  aria-label={`Mark all ${todos.length} todos as ${activeTodoCount === 0 ? 'incomplete' : 'complete'}`}
/>
<label htmlFor="toggle-all">
  Mark all as complete
</label>
<ul className="todo-list" role="list" aria-label="Todo items">
  {todoItems}
</ul>
```

### 2. Missing Keyboard Navigation Support

**Issue:** The todo items lack proper keyboard navigation.

**Current Code:**
```tsx
<label onDoubleClick={ e => this.handleEdit() }>
  {this.props.todo.title}
</label>
<button className="destroy" onClick={this.props.onDestroy} />
```

**Recommended Solution:**
```tsx
<label 
  onDoubleClick={this.handleEdit}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleEdit();
    }
  }}
  tabIndex={0}
  role="button"
  aria-label={`Edit todo: ${this.props.todo.title}`}
>
  {this.props.todo.title}
</label>
<button 
  className="destroy" 
  onClick={this.props.onDestroy}
  aria-label={`Delete todo: ${this.props.todo.title}`}
/>
```

---

## React and TypeScript Best Practices

### 1. Missing Interface Definitions

**Issue:** The code references interfaces that aren't defined in the provided files.

**Recommended Solution:**
```tsx
// interfaces.ts
interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  nowShowing: string;
  editing: string | null;
}

interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

interface ITodoItemState {
  editText: string;
}

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

interface ITodoModel {
  todos: ITodo[];
  addTodo: (title: string) => void;
  toggleAll: (checked: boolean) => void;
  toggle: (todo: ITodo) => void;
  destroy: (todo: ITodo) => void;
  save: (todo: ITodo, text: string) => void;
  clearCompleted: () => void;
  subscribe: (callback: () => void) => void;
}
```

### 2. Outdated Class Component Pattern

**Issue:** Using class components instead of modern functional components with hooks.

**Recommended Solution:**
```tsx
// Modern functional component with hooks
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TodoAppProps {
  model: ITodoModel;
}

const TodoApp: React.FC<TodoAppProps> = ({ model }) => {
  const [nowShowing, setNowShowing] = useState(ALL_TODOS);
  const [editing, setEditing] = useState<string | null>(null);
  const [todos, setTodos] = useState<ITodo[]>(model.todos);
  const newFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = model.subscribe(() => {
      setTodos([...model.todos]);
    });

    const router = Router({
      '/': () => setNowShowing(ALL_TODOS),
      '/active': () => setNowShowing(ACTIVE_TODOS),
      '/completed': () => setNowShowing(COMPLETED_TODOS)
    });
    router.init('/');

    return unsubscribe;
  }, [model]);

  const handleNewTodoKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) return;
    
    event.preventDefault();
    const inputValue = newFieldRef.current?.value.trim();
    
    if (inputValue) {
      model.addTodo(inputValue);
      newFieldRef.current!.value = '';
    }
  }, [model]);

  // ... rest of the component logic
};
```

---

## Documentation

### 1. Missing Function Documentation

**Issue:** Complex functions lack proper documentation.

**Current Code:**
```tsx
public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
  return (
    nextProps.todo !== this.props.todo ||
    nextProps.editing !== this.props.editing ||
    nextState.editText !== this.state.editText
  );
}
```

**Recommended Solution:**
```tsx
/**
 * Optimizes rendering by preventing unnecessary updates.
 * Only re-renders when:
 * - The todo item data changes
 * - The editing state changes
 * - The edit text input value changes
 * 
 * @param nextProps - The incoming props
 * @param nextState - The incoming state
 * @returns true if component should update, false otherwise
 */
public shouldComponentUpdate(nextProps: ITodoItemProps, nextState: ITodoItemState): boolean {
  return (
    nextProps.todo !== this.props.todo ||
    nextProps.editing !== this.props.editing ||
    nextState.editText !== this.state.editText
  );
}
```

### 2. Missing Component Documentation

**Issue:** Components lack proper JSDoc documentation.

**Recommended Solution:**
```tsx
/**
 * TodoApp - Main application component that manages the todo list
 * 
 * Features:
 * - Add new todos
 * - Toggle todo completion status
 * - Edit existing todos
 * - Filter todos by status (all/active/completed)
 * - Clear completed todos
 * 
 * @param props.model - The todo data model instance
 */
class TodoApp extends React.Component<IAppProps, IAppState> {
  // ... component implementation
}

/**
 * TodoItem - Individual todo item component
 * 
 * Supports:
 * - Inline editing on double-click
 * - Toggle completion status
 * - Delete todo item
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * 
 * @param props.todo - The todo item data
 * @param props.editing - Whether this item is currently being edited
 * @param props.onToggle - Callback to toggle completion status
 * @param props.onDestroy - Callback to delete the todo
 * @param props.onEdit - Callback to enter edit mode
 * @param props.onSave - Callback to save edited text
 * @param props.onCancel - Callback to cancel editing
 */
class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
  // ... component implementation
}
```

## Summary

The application demonstrates a solid understanding of React fundamentals but uses outdated patterns and lacks modern best practices. Key improvements should focus on:

1. **Modernization**: Migrate to functional components with hooks
2. **Performance**: Eliminate unnecessary re-renders and DOM queries
3. **Accessibility**: Add proper ARIA attributes and keyboard navigation
4. **Type Safety**: Complete interface definitions and proper typing
5. **Maintainability**: Better separation of concerns and modular architecture
6. **Documentation**: Comprehensive JSDoc comments for all public methods and components

These improvements would significantly enhance the code's maintainability, performance, and user experience while following current React and TypeScript best practices.

### Tokens: {'input_tokens': 4302, 'output_tokens': 3785}
### Execution time: 43.71412897109985
