I have the following application code that needs to migrate:

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

1. Migrate the provided React TypeScript application to Angular 14.x:
   - Maintain all existing functionality and component relationships
   - Preserve the application's state management patterns
   - Ensure all component lifecycle methods are properly translated to Angular equivalents

2. Implement state management:
   - Use @ngrx/store for application state management
   - Implement @ngrx/effects where side effects are needed
   - Convert the existing state model to appropriate actions, reducers, and selectors

3. Apply Angular architecture best practices:
   - Split large components into smaller, focused components
   - Create appropriate services for data handling and business logic
   - Implement proper dependency injection patterns

4. Convert React component structure:
   - Transform JSX templates to Angular HTML templates
   - Replace React event handlers with Angular event bindings
   - Convert React refs to Angular @ViewChild decorators

5. Implement proper typing:
   - Maintain TypeScript interfaces and types
   - Ensure strong typing throughout the application
   - Use appropriate Angular decorators (@Component, @Input, @Output, etc.)

6. Handle component communication:
   - Replace React props with Angular @Input() decorators
   - Convert callback props to Angular @Output() EventEmitter
   - Implement appropriate service-based communication where needed

7. Optimize the application:
   - Apply Angular change detection strategies where appropriate
   - Implement lazy loading for feature modules
   - Ensure efficient rendering patterns

8. Ensure proper routing:
   - Convert any React routing to Angular Router
   - Implement route guards and resolvers if needed
   - Maintain the same URL structure and navigation patterns

9. Code quality requirements:
   - No TODOs in the final code
   - Follow Angular style guide conventions
   - Ensure code is clean, readable, and maintainable

## Run 1:
### Answer:
Okay, this is a comprehensive migration from an older React class-based application to Angular 14.x with NgRx. I'll break down the migration into logical steps and provide the complete code.

**Migration Strategy Overview:**

1.  **Project Setup:** Create a new Angular 14 project and install NgRx.
2.  **Core Utilities & Interfaces:** Migrate `constants.ts`, `utils.ts`, and define all necessary TypeScript interfaces.
3.  **NgRx State Management:**
    *   Define the `ITodo` interface and the overall `TodosState`.
    *   Create NgRx Actions for all operations (`addTodo`, `toggle`, `destroy`, `save`, `clearCompleted`, `toggleAll`, and also `loadTodos`, `loadTodosSuccess`, `loadTodosFailure`, `saveTodos`).
    *   Implement the Reducer to handle state transitions immutably.
    *   Develop Selectors to query the state efficiently.
    *   Create Effects to handle side effects like `localStorage` persistence and initial loading.
4.  **Component Migration:**
    *   **`TodoFooter` -> `TodoFooterComponent`**: A presentational component with `@Input` and `@Output`.
    *   **`TodoItem` -> `TodoItemComponent`**: A presentational component with `@Input`, `@Output`, `ViewChild`, and `OnPush` change detection.
    *   **`TodoApp` -> `TodosPageComponent`**: A container component responsible for dispatching actions and selecting data from the NgRx store. It will also handle routing logic.
    *   **New Component: `TodoListComponent`**: To encapsulate the rendering of the list of `TodoItemComponent`s, improving separation of concerns.
5.  **Routing:** Implement Angular Router to handle the `/`, `/active`, `/completed` routes. The `nowShowing` filter will be derived from the active route.
6.  **Architecture & Best Practices:**
    *   Organize code into `core` (services, interfaces) and `todos` (feature module with components, NgRx store).
    *   Implement lazy loading for the `TodosModule`.
    *   Use Angular's dependency injection.
    *   Apply `async` pipe for NgRx store subscriptions in templates.
    *   Use `ngClass` for conditional classes.

---

**File Structure for the Angular Application:**

```
angular-todo-app/
├── src/
│   ├── app/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── local-storage.service.ts
│   │   │   │   └── utils.service.ts
│   │   │   └── interfaces/
│   │   │       └── todo.interface.ts
│   │   └── todos/
│   │       ├── todos-routing.module.ts
│   │       ├── todos.module.ts
│   │       ├── components/
│   │       │   ├── todo-footer/
│   │       │   │   ├── todo-footer.component.html
│   │       │   │   ├── todo-footer.component.scss
│   │       │   │   └── todo-footer.component.ts
│   │       │   ├── todo-item/
│   │       │   │   ├── todo-item.component.html
│   │       │   │   ├── todo-item.component.scss
│   │       │   │   └── todo-item.component.ts
│   │       │   └── todo-list/
│   │       │       ├── todo-list.component.html
│   │       │       ├── todo-list.component.scss
│   │       │       └── todo-list.component.ts
│   │       ├── containers/
│   │       │   └── todos-page/
│   │       │       ├── todos-page.component.html
│   │       │       ├── todos-page.component.scss
│   │       │       └── todos-page.component.ts
│   │       ├── store/
│   │       │   ├── todos.actions.ts
│   │       │   ├── todos.effects.ts
│   │       │   ├── todos.reducer.ts
│   │       │   ├── todos.selectors.ts
│   │       │   └── todos.state.ts
│   │       └── constants/
│   │           └── todos.constants.ts
│   └── main.ts
│   └── index.html
│   └── styles.scss
```

---

**Step 1: Create Angular Project & Install NgRx**

```bash
ng new angular-todo-app --routing --style=scss --strict
cd angular-todo-app
ng add @ngrx/store@14 @ngrx/effects@14 @ngrx/store-devtools@14
```
When prompted for NgRx setup, choose `Yes` for `root` and `No` for `schematics` (we'll set up feature modules manually).

---

**Step 2: Core Utilities & Interfaces**

**`src/app/core/interfaces/todo.interface.ts`**
```typescript
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';
```

**`src/app/core/services/utils.service.ts`**
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public uuid(): string {
    let i: number;
    let random: number;
    let uuid = '';

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

  public pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }
}
```

**`src/app/core/services/local-storage.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { ITodo } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly NAMESPACE = 'react-todos'; // Original namespace

  constructor() { }

  public loadTodos(): ITodo[] {
    try {
      const storedTodos = localStorage.getItem(this.NAMESPACE);
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (e) {
      console.error('Error loading todos from localStorage', e);
      return [];
    }
  }

  public saveTodos(todos: ITodo[]): void {
    try {
      localStorage.setItem(this.NAMESPACE, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage', e);
    }
  }
}
```

---

**Step 3: NgRx State Management (in `src/app/todos/store/`)**

**`src/app/todos/constants/todos.constants.ts`**
```typescript
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

**`src/app/todos/store/todos.state.ts`**
```typescript
import { ITodo, TodoFilter } from '../../core/interfaces/todo.interface';

export interface TodosState {
  todos: ITodo[];
  editingTodoId: string | null;
  filter: TodoFilter;
}

export const initialTodosState: TodosState = {
  todos: [],
  editingTodoId: null,
  filter: 'all' // Default filter
};
```

**`src/app/todos/store/todos.actions.ts`**
```typescript
import { createAction, props } from '@ngrx/store';
import { ITodo, TodoFilter } from '../../core/interfaces/todo.interface';

// Load Todos
export const loadTodos = createAction('[Todos] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todos] Load Todos Success',
  props<{ todos: ITodo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todos] Load Todos Failure',
  props<{ error: any }>()
);

// CRUD Operations
export const addTodo = createAction(
  '[Todos] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todos] Toggle Todo',
  props<{ id: string }>()
);

export const toggleAllTodos = createAction(
  '[Todos] Toggle All Todos',
  props<{ completed: boolean }>()
);

export const destroyTodo = createAction(
  '[Todos] Destroy Todo',
  props<{ id: string }>()
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ id: string; changes: { title?: string; completed?: boolean } }>()
);

export const clearCompletedTodos = createAction('[Todos] Clear Completed Todos');

// UI State
export const setEditingTodoId = createAction(
  '[Todos] Set Editing Todo ID',
  props<{ id: string | null }>()
);

export const setTodoFilter = createAction(
  '[Todos] Set Todo Filter',
  props<{ filter: TodoFilter }>()
);
```

**`src/app/todos/store/todos.reducer.ts`**
```typescript
import { createReducer, on } from '@ngrx/store';
import { initialTodosState } from './todos.state';
import * as TodosActions from './todos.actions';
import { UtilsService } from '../../core/services/utils.service';
import { ITodo } from '../../core/interfaces/todo.interface';

// Inject UtilsService into the reducer (NgRx 14 allows this)
// For older NgRx versions, you'd pass it as a parameter or use a factory.
const utilsService = new UtilsService();

export const todosReducer = createReducer(
  initialTodosState,
  on(TodosActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos: todos,
  })),
  on(TodosActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      {
        id: utilsService.uuid(),
        title: title,
        completed: false,
      },
    ],
  })),
  on(TodosActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  on(TodosActions.toggleAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map((todo) => ({ ...todo, completed: completed })),
  })),
  on(TodosActions.destroyTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  on(TodosActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, ...changes } : todo
    ),
  })),
  on(TodosActions.clearCompletedTodos, (state) => ({
    ...state,
    todos: state.todos.filter((todo) => !todo.completed),
  })),
  on(TodosActions.setEditingTodoId, (state, { id }) => ({
    ...state,
    editingTodoId: id,
  })),
  on(TodosActions.setTodoFilter, (state, { filter }) => ({
    ...state,
    filter: filter,
  }))
);
```

**`src/app/todos/store/todos.selectors.ts`**
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.state';
import { ITodo, TodoFilter } from '../../core/interfaces/todo.interface';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(
  selectTodosState,
  (state: TodosState) => state.todos
);

export const selectEditingTodoId = createSelector(
  selectTodosState,
  (state: TodosState) => state.editingTodoId
);

export const selectTodoFilter = createSelector(
  selectTodosState,
  (state: TodosState) => state.filter
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectTodoFilter,
  (todos: ITodo[], filter: TodoFilter) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveTodoCount = createSelector(
  selectAllTodos,
  (todos: ITodo[]) => todos.filter((todo) => !todo.completed).length
);

export const selectCompletedTodoCount = createSelector(
  selectAllTodos,
  (todos: ITodo[]) => todos.filter((todo) => todo.completed).length
);

export const selectHasTodos = createSelector(
  selectAllTodos,
  (todos: ITodo[]) => todos.length > 0
);

export const selectAllTodosCompleted = createSelector(
  selectAllTodos,
  (todos: ITodo[]) => todos.length > 0 && todos.every(todo => todo.completed)
);
```

**`src/app/todos/store/todos.effects.ts`**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as TodosActions from './todos.actions';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Store, select } from '@ngrx/store';
import { TodosState } from './todos.state';
import * as TodosSelectors from './todos.selectors';

@Injectable()
export class TodosEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<TodosState>
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      switchMap(() =>
        of(this.localStorageService.loadTodos()).pipe(
          map((todos) => TodosActions.loadTodosSuccess({ todos })),
          catchError((error) => of(TodosActions.loadTodosFailure({ error })))
        )
      )
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodosActions.addTodo,
          TodosActions.toggleTodo,
          TodosActions.toggleAllTodos,
          TodosActions.destroyTodo,
          TodosActions.updateTodo,
          TodosActions.clearCompletedTodos,
          TodosActions.loadTodosSuccess // Save after initial load too, if state changes
        ),
        withLatestFrom(this.store.pipe(select(TodosSelectors.selectAllTodos))),
        tap(([action, todos]) => {
          this.localStorageService.saveTodos(todos);
        })
      ),
    { dispatch: false } // This effect does not dispatch a new action
  );
}
```

---

**Step 4: Component Migration**

**`src/app/todos/components/todo-footer/todo-footer.component.ts`**
```typescript
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../../core/services/utils.service';
import { TodoFilter } from '../../../core/interfaces/todo.interface';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize for pure inputs
})
export class TodoFooterComponent {
  @Input() activeTodoCount: number = 0;
  @Input() completedTodoCount: number = 0;
  @Input() currentFilter: TodoFilter = 'all';

  @Output() clearCompleted = new EventEmitter<void>();

  constructor(private utilsService: UtilsService) {}

  get activeTodoWord(): string {
    return this.utilsService.pluralize(this.activeTodoCount, 'item');
  }

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }
}
```

**`src/app/todos/components/todo-footer/todo-footer.component.html`**
```html
<footer class="footer" *ngIf="activeTodoCount > 0 || completedTodoCount > 0">
  <span class="todo-count">
    <strong>{{ activeTodoCount }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a
        routerLink="/all"
        routerLinkActive="selected"
        [queryParamsHandling]="'merge'"
        [class.selected]="currentFilter === 'all'"
      >
        All
      </a>
    </li>
    <li>
      <a
        routerLink="/active"
        routerLinkActive="selected"
        [queryParamsHandling]="'merge'"
        [class.selected]="currentFilter === 'active'"
      >
        Active
      </a>
    </li>
    <li>
      <a
        routerLink="/completed"
        routerLinkActive="selected"
        [queryParamsHandling]="'merge'"
        [class.selected]="currentFilter === 'completed'"
      >
        Completed
      </a>
    </li>
  </ul>
  <button
    class="clear-completed"
    (click)="onClearCompleted()"
    *ngIf="completedTodoCount > 0"
  >
    Clear completed
  </button>
</footer>
```

**`src/app/todos/components/todo-footer/todo-footer.component.scss`**
```scss
// Add styles from original CSS if any, or keep empty if external CSS handles it
```

---

**`src/app/todos/components/todo-item/todo-item.component.ts`**
```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ITodo } from '../../../core/interfaces/todo.interface';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants/todos.constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize for pure inputs
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: ITodo;
  @Input() isEditing: boolean = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editField') editField!: ElementRef<HTMLInputElement>;

  editText: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && changes['todo'].currentValue) {
      this.editText = this.todo.title;
    }
    if (changes['isEditing'] && changes['isEditing'].currentValue === true) {
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        if (this.editField) {
          this.editField.nativeElement.focus();
          this.editField.nativeElement.setSelectionRange(
            this.editField.nativeElement.value.length,
            this.editField.nativeElement.value.length
          );
        }
      }, 0);
    }
  }

  handleToggle(): void {
    this.toggle.emit();
  }

  handleDestroy(): void {
    this.destroy.emit();
  }

  handleEdit(): void {
    this.edit.emit();
    this.editText = this.todo.title; // Reset edit text on edit start
  }

  handleSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.save.emit(val);
    } else {
      this.destroy.emit(); // Destroy if title is empty
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title; // Revert to original title
      this.cancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event: Event): void {
    this.editText = (event.target as HTMLInputElement).value;
  }
}
```

**`src/app/todos/components/todo-item/todo-item.component.html`**
```html
<li
  [ngClass]="{
    completed: todo.completed,
    editing: isEditing
  }"
>
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="handleToggle()"
    />
    <label (dblclick)="handleEdit()">
      {{ todo.title }}
    </label>
    <button class="destroy" (click)="handleDestroy()"></button>
  </div>
  <input
    #editField
    class="edit"
    [value]="editText"
    (blur)="handleSubmit()"
    (input)="handleChange($event)"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

**`src/app/todos/components/todo-item/todo-item.component.scss`**
```scss
// Add styles from original CSS if any, or keep empty if external CSS handles it
```

---

**`src/app/todos/components/todo-list/todo-list.component.ts` (New Component)**
```typescript
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ITodo } from '../../../core/interfaces/todo.interface';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  @Input() todos: ITodo[] = [];
  @Input() editingTodoId: string | null = null;
  @Input() allTodosCompleted: boolean = false;
  @Input() hasTodos: boolean = false;

  @Output() toggleAll = new EventEmitter<boolean>();
  @Output() toggleTodo = new EventEmitter<string>();
  @Output() destroyTodo = new EventEmitter<string>();
  @Output() editTodo = new EventEmitter<string>();
  @Output() saveTodo = new EventEmitter<{ id: string; title: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  onToggleAll(event: Event): void {
    this.toggleAll.emit((event.target as HTMLInputElement).checked);
  }

  onToggle(id: string): void {
    this.toggleTodo.emit(id);
  }

  onDestroy(id: string): void {
    this.destroyTodo.emit(id);
  }

  onEdit(id: string): void {
    this.editTodo.emit(id);
  }

  onSave(id: string, title: string): void {
    this.saveTodo.emit({ id, title });
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}
```

**`src/app/todos/components/todo-list/todo-list.component.html`**
```html
<section class="main" *ngIf="hasTodos">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="allTodosCompleted"
    (change)="onToggleAll($event)"
  />
  <label htmlFor="toggle-all"> Mark all as complete </label>
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of todos; trackBy: todo?.id"
      [todo]="todo"
      [isEditing]="editingTodoId === todo.id"
      (toggle)="onToggle(todo.id)"
      (destroy)="onDestroy(todo.id)"
      (edit)="onEdit(todo.id)"
      (save)="onSave(todo.id, $event)"
      (cancel)="onCancel()"
    ></app-todo-item>
  </ul>
</section>
```

**`src/app/todos/components/todo-list/todo-list.component.scss`**
```scss
// Add styles from original CSS if any, or keep empty if external CSS handles it
```

---

**`src/app/todos/containers/todos-page/todos-page.component.ts` (Replaces `TodoApp`)**
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodosState } from '../../store/todos.state';
import * as TodosActions from '../../store/todos.actions';
import * as TodosSelectors from '../../store/todos.selectors';
import { Observable, Subscription } from 'rxjs';
import { ITodo, TodoFilter } from '../../../core/interfaces/todo.interface';
import { ENTER_KEY } from '../../constants/todos.constants';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss'],
})
export class TodosPageComponent implements OnInit, OnDestroy {
  @ViewChild('newField') newFieldInput!: ElementRef<HTMLInputElement>;

  filteredTodos$: Observable<ITodo[]>;
  activeTodoCount$: Observable<number>;
  completedTodoCount$: Observable<number>;
  currentFilter$: Observable<TodoFilter>;
  editingTodoId$: Observable<string | null>;
  hasTodos$: Observable<boolean>;
  allTodosCompleted$: Observable<boolean>;

  private routeSubscription!: Subscription;

  constructor(private store: Store<TodosState>, private route: ActivatedRoute) {
    this.filteredTodos$ = this.store.select(TodosSelectors.selectFilteredTodos);
    this.activeTodoCount$ = this.store.select(TodosSelectors.selectActiveTodoCount);
    this.completedTodoCount$ = this.store.select(TodosSelectors.selectCompletedTodoCount);
    this.currentFilter$ = this.store.select(TodosSelectors.selectTodoFilter);
    this.editingTodoId$ = this.store.select(TodosSelectors.selectEditingTodoId);
    this.hasTodos$ = this.store.select(TodosSelectors.selectHasTodos);
    this.allTodosCompleted$ = this.store.select(TodosSelectors.selectAllTodosCompleted);
  }

  ngOnInit(): void {
    // Dispatch action to load todos from local storage on app init
    this.store.dispatch(TodosActions.loadTodos());

    // Subscribe to route changes to update the filter in the store
    this.routeSubscription = this.route.url
      .pipe(
        map(segments => {
          const path = segments.map(segment => segment.path).join('/');
          switch (path) {
            case 'active':
              return 'active';
            case 'completed':
              return 'completed';
            default:
              return 'all';
          }
        })
      )
      .subscribe((filter: TodoFilter) => {
        this.store.dispatch(TodosActions.setTodoFilter({ filter }));
      });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();

    const val = this.newFieldInput.nativeElement.value.trim();

    if (val) {
      this.store.dispatch(TodosActions.addTodo({ title: val }));
      this.newFieldInput.nativeElement.value = ''; // Clear input field
    }
  }

  onToggleAll(completed: boolean): void {
    this.store.dispatch(TodosActions.toggleAllTodos({ completed }));
  }

  onToggleTodo(id: string): void {
    this.store.dispatch(TodosActions.toggleTodo({ id }));
  }

  onDestroyTodo(id: string): void {
    this.store.dispatch(TodosActions.destroyTodo({ id }));
  }

  onEditTodo(id: string): void {
    this.store.dispatch(TodosActions.setEditingTodoId({ id }));
  }

  onSaveTodo(payload: { id: string; title: string }): void {
    this.store.dispatch(TodosActions.updateTodo({ id: payload.id, changes: { title: payload.title } }));
    this.store.dispatch(TodosActions.setEditingTodoId({ id: null })); // Exit editing mode
  }

  onCancelEdit(): void {
    this.store.dispatch(TodosActions.setEditingTodoId({ id: null }));
  }

  onClearCompleted(): void {
    this.store.dispatch(TodosActions.clearCompletedTodos());
  }
}
```

**`src/app/todos/containers/todos-page/todos-page.component.html`**
```html
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      #newField
      class="new-todo"
      placeholder="What needs to be done?"
      (keydown)="handleNewTodoKeyDown($event)"
      autofocus
    />
  </header>

  <app-todo-list
    [todos]="filteredTodos$ | async"
    [editingTodoId]="editingTodoId$ | async"
    [allTodosCompleted]="allTodosCompleted$ | async"
    [hasTodos]="hasTodos$ | async"
    (toggleAll)="onToggleAll($event)"
    (toggleTodo)="onToggleTodo($event)"
    (destroyTodo)="onDestroyTodo($event)"
    (editTodo)="onEditTodo($event)"
    (saveTodo)="onSaveTodo($event)"
    (cancelEdit)="onCancelEdit()"
  ></app-todo-list>

  <app-todo-footer
    [activeTodoCount]="activeTodoCount$ | async"
    [completedTodoCount]="completedTodoCount$ | async"
    [currentFilter]="currentFilter$ | async"
    (clearCompleted)="onClearCompleted()"
  ></app-todo-footer>
</div>
```

**`src/app/todos/containers/todos-page/todos-page.component.scss`**
```scss
// Add styles from original CSS if any, or keep empty if external CSS handles it
```

---

**Step 5: Angular Module Configuration & Routing**

**`src/app/todos/todos.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TodosRoutingModule } from './todos-routing.module';
import { TodosPageComponent } from './containers/todos-page/todos-page.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

import { todosReducer } from './store/todos.reducer';
import { TodosEffects } from './store/todos.effects';
import { FormsModule } from '@angular/forms'; // For potential future ngModel use, though not strictly needed for this migration

@NgModule({
  declarations: [
    TodosPageComponent,
    TodoFooterComponent,
    TodoItemComponent,
    TodoListComponent
  ],
  imports: [
    CommonModule,
    TodosRoutingModule,
    FormsModule, // If you use ngModel in the future
    StoreModule.forFeature('todos', todosReducer),
    EffectsModule.forFeature([TodosEffects])
  ]
})
export class TodosModule { }
```

**`src/app/todos/todos-routing.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosPageComponent } from './containers/todos-page/todos-page.component';

const routes: Routes = [
  {
    path: '',
    component: TodosPageComponent,
    children: [
      { path: 'active', component: TodosPageComponent },
      { path: 'completed', component: TodosPageComponent },
      { path: '', redirectTo: 'all', pathMatch: 'full' }, // Default to 'all'
      { path: 'all', component: TodosPageComponent } // Explicit 'all' route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule { }
```

**`src/app/app-routing.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./todos/todos.module').then(m => m.TodosModule)
  },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the todos module
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // UseHash for old-school browser routing like original app
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**`src/app/app.module.ts`**
```typescript
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}), // Root store, feature modules will add their reducers
    EffectsModule.forRoot([]), // Root effects, feature modules will add their effects
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }) // NgRx DevTools
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**`src/app/app.component.ts`**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>', // Main entry point for routing
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-app';
}
```

**`src/app/app.component.scss`**
```scss
// Global styles if any, otherwise keep empty.
// The original app's styles are likely in a global CSS file or imported.
// For this migration, assume the main `index.html` or `styles.scss` handles the global todoapp styles.
```

---

**Final Check and Notes:**

1.  **`declare var Router;`**: This was a global variable for a simple hash-based router. In Angular, `RouterModule.forRoot({ useHash: true })` replicates this behavior, and `ActivatedRoute` is used to read the current filter from the URL.
2.  **`ReactDOM.findDOMNode(this.refs["newField"])`**: Replaced with `@ViewChild('newField') newFieldInput: ElementRef;` and `this.newFieldInput.nativeElement.value`.
3.  **`shouldComponentUpdate`**: Replaced by `ChangeDetectionStrategy.OnPush` in `TodoItemComponent` and `TodoFooterComponent`.
4.  **`TodoModel`**: Fully replaced by NgRx `actions`, `reducer`, `selectors`, and `effects`.
5.  **`Utils.extend`**: This utility was used for immutable updates. In Angular/TypeScript, the spread operator (`{ ...obj, ...changes }`) is the modern and idiomatic way to achieve this, as seen in the reducer. The `UtilsService` now only contains `uuid` and `pluralize`.
6.  **`model.subscribe(render)`**: The root-level re-render is handled by Angular's change detection and the `async` pipe in templates, which automatically subscribes to observables from the NgRx store and triggers updates when data changes.
7.  **Lazy Loading**: The `TodosModule` is lazy-loaded in `AppRoutingModule`, which is an Angular best practice for larger applications.
8.  **Code Quality**:
    *   No `TODO` comments.
    *   Follows Angular style guide (e.g., component naming, file structure).
    *   Strong typing throughout.
    *   Uses `async` pipe for observables.
    *   Separation of concerns (container/presentational components, services).

This migration provides a robust Angular 14 application with NgRx state management, maintaining all original functionality while adhering to modern Angular best practices.

### Tokens: {'input_tokens': 4101, 'output_tokens': 16670, 'reasoning_tokens': 3517}
### Execution time: 55.110705852508545
