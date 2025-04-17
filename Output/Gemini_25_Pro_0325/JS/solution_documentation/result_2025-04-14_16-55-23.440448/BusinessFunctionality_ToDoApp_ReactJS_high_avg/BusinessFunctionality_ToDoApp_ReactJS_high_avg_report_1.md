I have the following application code that needs to provide the business requirements:

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


Please follow these steps:

1. Analyze the provided source code and document its business requirements:
   - Identify and summarize the main functionality and features
   - Describe the core components and their relationships
   - Map out the data flow and state management approach

2. Document user interaction patterns:
   - Identify all user-facing features and interaction points
   - Describe the expected user workflow and experience
   - Document any UI/UX patterns implemented in the code

3. Extract business objectives from the implementation:
   - Determine the primary business goals addressed by the application
   - Identify any secondary objectives or use cases supported
   - Note how the technical implementation aligns with business needs

4. Identify constraints and assumptions:
   - Document any technical limitations or constraints evident in the code
   - Note architectural assumptions that influence the implementation
   - Identify any dependencies or external requirements

5. Evaluate performance and scalability considerations:
   - Document any performance optimizations present in the code
   - Identify scalability approaches or limitations
   - Note any efficiency patterns or concerns in the implementation

6. Present your findings in a structured format:
   - Organize insights by functional area
   - Support observations with specific references to the code structure
   - Provide a comprehensive overview of the application's purpose and design

## Run 1:
### Answer:
Okay, let's break down the provided React TodoMVC application code to extract its business requirements, user interactions, objectives, constraints, and performance considerations.

---

## Business Requirements Documentation: React Todo Application

This document outlines the business requirements, user interactions, objectives, and technical considerations derived from the provided React source code for a Todo list application.

**1. Analysis of Source Code & Business Requirements**

*   **Main Functionality & Features:**
    *   **Task Creation:** Users can add new tasks (todos) to a list. (`app.tsx: handleNewTodoKeyDown`, `todoModel.ts: addTodo`)
    *   **Task Viewing:** Users can view the list of existing tasks. (`app.tsx: render`, `todoItem.tsx: render`)
    *   **Task Completion:** Users can mark individual tasks as completed or active (toggle state). (`app.tsx: toggle`, `todoItem.tsx: render checkbox`, `todoModel.ts: toggle`)
    *   **Bulk Task Completion:** Users can mark all currently visible tasks as completed or active simultaneously. (`app.tsx: toggleAll`, `todoModel.ts: toggleAll`)
    *   **Task Editing:** Users can modify the text description of an existing task. (`app.tsx: edit`, `app.tsx: save`, `todoItem.tsx: handleEdit`, `todoItem.tsx: handleSubmit`, `todoModel.ts: save`)
    *   **Task Deletion:** Users can remove individual tasks from the list. (`app.tsx: destroy`, `todoItem.tsx: onDestroy prop`, `todoModel.ts: destroy`)
    *   **Filtering:** Users can filter the displayed tasks based on their status: All, Active, or Completed. (`app.tsx: componentDidMount (Router)`, `app.tsx: render (shownTodos filter)`, `footer.tsx: filter links`)
    *   **Clear Completed Tasks:** Users can remove all tasks marked as completed from the list in a single action. (`app.tsx: clearCompleted`, `footer.tsx: clearButton`, `todoModel.ts: clearCompleted`)
    *   **Task Count Display:** The application displays the number of active (incomplete) tasks remaining. (`app.tsx: render (activeTodoCount)`, `footer.tsx: render`)
    *   **Data Persistence:** Tasks are saved locally in the browser, so they persist even after the browser window is closed and reopened. (`todoModel.ts: constructor`, `todoModel.ts: inform`, `utils.ts: store using localStorage`)

*   **Core Components & Relationships:**
    *   **`TodoApp` (`app.tsx`):** The main application component. It orchestrates the overall UI, manages application state (current filter `nowShowing`, which item is `editing`), handles user input for new todos, renders the list of `TodoItem`s and the `TodoFooter`, and interacts with the `TodoModel` to perform data operations.
    *   **`TodoItem` (`todoItem.tsx`):** Represents a single todo item in the list. It displays the task's title and completion status, handles user interactions for toggling completion, initiating editing, saving edits, canceling edits, and deleting the task. It manages its own temporary state during editing (`editText`).
    *   **`TodoFooter` (`footer.tsx`):** Displays the count of active todos, provides filtering links (All, Active, Completed), and shows the "Clear completed" button when applicable.
    *   **`TodoModel` (`todoModel.ts`):** Manages the application's data (the array of todo objects). It contains the core logic for adding, updating, deleting, and filtering todos. It also handles data persistence using `localStorage` (via `Utils.store`) and notifies the application (via `subscribe`/`inform`) when data changes.
    *   **`Utils` (`utils.ts`):** Provides utility functions for generating unique IDs (`uuid`), pluralizing words (`pluralize`), interacting with `localStorage` (`store`), and basic object extension (`extend`).
    *   **`constants.ts`:** Defines shared constant values (filter names, key codes) to avoid magic strings/numbers.

*   **Data Flow & State Management:**
    *   **Data Source:** `TodoModel` holds the canonical list of todos, initially loaded from `localStorage`.
    *   **State:**
        *   *Application Data State:* Managed by `TodoModel` (`this.todos`).
        *   *Application UI State:* Managed within `TodoApp`'s state (`nowShowing`, `editing`).
        *   *Component UI State:* Managed within `TodoItem`'s state (`editText` during editing).
    *   **Flow:**
        1.  User interacts with UI elements (`TodoApp`, `TodoItem`, `TodoFooter`).
        2.  Event handlers in components are triggered.
        3.  Handlers in `TodoApp` often call methods on the `TodoModel` instance (`this.props.model`).
        4.  `TodoModel` updates its internal `todos` array (using immutable patterns like `map`, `filter`).
        5.  `TodoModel.inform()` is called, which saves the updated data to `localStorage` (`Utils.store`) and triggers subscribed callbacks.
        6.  The `render` function (subscribed in `app.tsx`) is called, causing `ReactDOM.render` to re-render the `TodoApp` component with the updated model data.
        7.  React efficiently updates the DOM based on the changes in props and state.
    *   **Routing:** A simple client-side router (`director` library is implied by the `Router({...})` syntax) is used to update the `nowShowing` state in `TodoApp` based on the URL hash (`#/`, `#/active`, `#/completed`), triggering list filtering.

**2. User Interaction Patterns**

*   **Adding a Todo:**
    *   User types the task description into the input field labeled "What needs to be done?".
    *   User presses the `Enter` key.
    *   The input field clears, and the new task appears at the bottom of the list. (`app.tsx: handleNewTodoKeyDown`)
*   **Toggling Completion (Single Todo):**
    *   User clicks the checkbox to the left of a task description.
    *   The task's visual style changes (e.g., strikethrough, faded text) to indicate completion status. The active item count in the footer updates. (`todoItem.tsx: checkbox onChange -> onToggle`, `app.tsx: toggle`)
*   **Toggling Completion (All Todos):**
    *   User clicks the down-arrow icon (`#toggle-all`) at the top-left of the list.
    *   If any items are active, all items become completed. If all items are already completed, all items become active. The visual state of all items and the footer count update accordingly. (`app.tsx: toggleAll`)
*   **Editing a Todo:**
    *   User double-clicks on the text of an existing task. (`todoItem.tsx: label onDoubleClick -> handleEdit`)
    *   The task display transforms into an input field pre-filled with the current task text, and the input field receives focus. (`todoItem.tsx: render conditional, componentDidUpdate`)
    *   User modifies the text.
    *   User presses `Enter` or clicks outside the input field (blur). The task updates with the new text. (`todoItem.tsx: handleKeyDown (Enter)`, `todoItem.tsx: onBlur -> handleSubmit`)
    *   User presses `Escape`. The edit is cancelled, and the task reverts to its original text. (`todoItem.tsx: handleKeyDown (Escape) -> onCancel`, `app.tsx: cancel`)
*   **Deleting a Todo:**
    *   User hovers the mouse cursor over a task item.
    *   A red 'x' button appears on the right side of the item. (`todoItem.tsx: .destroy button`)
    *   User clicks the 'x' button.
    *   The task is removed from the list. The footer count may update. (`todoItem.tsx: button onClick -> onDestroy`, `app.tsx: destroy`)
*   **Filtering Tasks:**
    *   User clicks one of the filter links ("All", "Active", "Completed") in the footer. (`footer.tsx: links`)
    *   The URL hash updates (e.g., `#/active`).
    *   The list updates to show only the tasks matching the selected filter. The selected filter link is visually highlighted. (`app.tsx: componentDidMount (Router sets state)`, `app.tsx: render (filters shownTodos)`)
*   **Clearing Completed Tasks:**
    *   User clicks the "Clear completed" button in the footer (this button is only visible if at least one task is completed). (`footer.tsx: clearButton conditional rendering`)
    *   All tasks marked as completed are removed from the list. (`footer.tsx: button onClick -> onClearCompleted`, `app.tsx: clearCompleted`)

**3. Business Objectives**

*   **Primary Objective:** To provide users with a simple, intuitive, and persistent single-user interface for managing personal tasks (a "Todo list"). This aims to improve personal organization and productivity.
*   **Secondary Objectives:**
    *   Offer basic task status management (active/completed).
    *   Allow quick modification and deletion of tasks.
    *   Provide filtering capabilities to focus on relevant tasks.
    *   Ensure user data is retained between sessions on the same browser.
    *   Deliver a responsive and clean user experience consistent with the TodoMVC project standard.

*   **Alignment with Implementation:** The technical implementation directly supports these objectives by providing the core CRUD (Create, Read, Update, Delete) operations for tasks, state management for completion, filtering logic tied to UI controls and routing, and `localStorage` persistence. The use of React facilitates the creation of a responsive and component-based UI.

**4. Constraints and Assumptions**

*   **Technical Constraints:**
    *   **Frontend Only:** The application runs entirely in the user's browser. There is no backend server component for data storage, synchronization, or user accounts.
    *   **`localStorage` Dependency:** Data persistence relies solely on the browser's `localStorage`. This limits storage capacity (typically 5-10MB), is synchronous, and data is confined to the specific browser and domain. Data is not backed up or accessible across different devices/browsers.
    *   **External Router:** Depends on an external (though not explicitly imported by name, implied `director`) routing library (`Router`) for handling URL hash changes and filtering.
    *   **Browser Compatibility:** Assumes a modern browser environment supporting ES features used, React, and `localStorage`.
*   **Architectural Assumptions:**
    *   **Single User:** The design assumes only one user interacting with the application on a single browser instance. No multi-user collaboration features are built-in.
    *   **Component-Based UI:** Leverages React's component model for structuring the user interface.
    *   **Basic State Management:** Assumes the application's state complexity is manageable with React component state and a simple external model with a pub/sub mechanism. No complex state management library (like Redux or Zustand) is used.
    *   **Immutability Preference:** The code (and comments) indicate a preference for immutable data operations (`map`, `filter`, `Utils.extend`) when updating the todo list, which works well with React's change detection.

**5. Performance and Scalability Considerations**

*   **Performance Optimizations:**
    *   **`shouldComponentUpdate`:** Explicitly implemented in `TodoItem` to prevent unnecessary re-renders of individual todo items if their props (`todo`, `editing`) and state (`editText`) haven't changed. This is crucial for list performance.
    *   **React Virtual DOM:** Leverages React's core diffing algorithm for efficient DOM updates.
    *   **Immutable Updates:** Using `map` and `filter` creates new arrays/objects, which helps React's reconciliation process identify changes easily.
*   **Scalability Limitations:**
    *   **Data Volume:** Performance will likely degrade significantly as the number of todo items grows very large (e.g., thousands) due to:
        *   Loading the entire list from `localStorage` on initialization.
        *   Processing the entire list in memory for operations like `toggleAll`, `clearCompleted`, filtering, and saving.
        *   Saving the entire list back to `localStorage` on every change (`Utils.store`).
    *   **State Management:** The simple pub/sub model in `TodoModel` might become difficult to manage and debug in a significantly more complex application with more interconnected state.
    *   **Feature Scalability:** While the component structure is modular, adding significantly different features (e.g., deadlines, sub-tasks, tags) would require substantial changes to the `TodoModel` and potentially the component interactions.
*   **Efficiency:** The application is generally efficient for its intended purpose (personal todo lists of reasonable size). The main potential bottlenecks are the `localStorage` operations and rendering large lists without proper optimizations (which `shouldComponentUpdate` addresses for `TodoItem`).

**6. Summary Presentation**

The application implements the standard features of a TodoMVC example application using React and TypeScript. It allows users to manage a list of tasks with functionalities for adding, editing, deleting, completing, and filtering. Data is persisted locally using `localStorage`. The architecture is component-based, with a clear separation between UI components (`TodoApp`, `TodoItem`, `TodoFooter`) and data management (`TodoModel`). Key user interactions include typing and pressing Enter to add, clicking checkboxes/buttons for state changes/deletion, double-clicking for editing, and using footer links for filtering. While performant for typical use cases due to React's efficiency and specific optimizations like `shouldComponentUpdate`, its scalability is limited by its reliance on `localStorage` and its frontend-only architecture. The primary business goal is to provide a simple, effective tool for personal task management.

---

### Tokens: {'input_tokens': 3960, 'output_tokens': 5238}
### Execution time: 66.68722796440125
