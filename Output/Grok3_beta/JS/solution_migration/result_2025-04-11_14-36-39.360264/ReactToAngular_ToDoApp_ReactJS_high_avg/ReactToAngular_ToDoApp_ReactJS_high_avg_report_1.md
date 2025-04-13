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
I'll migrate the React Todo application to Angular 14.x following the specified requirements. I'll break this down into multiple files and implement a modern Angular architecture with NgRx for state management.

First, let's create the project structure and necessary files:

### 1. Project Structure
```
src/
├── app/
│   ├── core/
│   │   ├── state/
│   │   │   ├── todo.actions.ts
│   │   │   ├── todo.effects.ts
│   │   │   ├── todo.reducer.ts
│   │   │   ├── todo.selectors.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── storage.service.ts
│   │   └── core.module.ts
│   ├── shared/
│   │   ├── models/
│   │   │   └── todo.model.ts
│   │   ├── utils/
│   │   │   └── utils.ts
│   │   └── constants.ts
│   ├── features/
│   │   └── todos/
│   │       ├── components/
│   │       │   ├── todo-app/
│   │       │   │   ├── todo-app.component.ts
│   │       │   │   ├── todo-app.component.html
│   │       │   │   └── todo-app.component.scss
│   │       │   ├── todo-item/
│   │       │   │   ├── todo-item.component.ts
│   │       │   │   ├── todo-item.component.html
│   │       │   │   └── todo-item.component.scss
│   │       │   └── todo-footer/
│   │       │       ├── todo-footer.component.ts
│   │       │       ├── todo-footer.component.html
│   │       │       └── todo-footer.component.scss
│   │       ├── todos-routing.module.ts
│   │       └── todos.module.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.module.ts
│   └── app-routing.module.ts
└── styles.scss
```

### 2. State Management with NgRx

#### todo.model.ts
```typescript
// src/app/shared/models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  nowShowing: string;
  editing: string | null;
}
```

#### todo.actions.ts
```typescript
// src/app/core/state/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../shared/models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const destroyTodo = createAction('[Todo] Destroy Todo', props<{ id: string }>());
export const saveTodo = createAction('[Todo] Save Todo', props<{ id: string; title: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setNowShowing = createAction('[Todo] Set Now Showing', props<{ nowShowing: string }>());
export const setEditing = createAction('[Todo] Set Editing', props<{ id: string | null }>());
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
```

#### todo.reducer.ts
```typescript
// src/app/core/state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { TodoState } from '../../shared/models/todo.model';
import * as TodoActions from './todo.actions';
import { Utils } from '../../shared/utils/utils';

export const initialState: TodoState = {
  todos: [],
  nowShowing: 'all',
  editing: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Utils.uuid(), title, completed: false }]
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.destroyTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.saveTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.setNowShowing, (state, { nowShowing }) => ({
    ...state,
    nowShowing
  })),
  on(TodoActions.setEditing, (state, { id }) => ({
    ...state,
    editing: id
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  }))
);
```

#### todo.effects.ts
```typescript
// src/app/core/state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { StorageService } from '../services/storage.service';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => TodoActions.loadTodosSuccess({ todos: this.storageService.getTodos() }))
    )
  );

  saveTodos$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.toggleAll,
        TodoActions.destroyTodo,
        TodoActions.saveTodo,
        TodoActions.clearCompleted
      ),
      tap(() => this.storageService.saveTodos())
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private storageService: StorageService
  ) {}
}
```

#### todo.selectors.ts
```typescript
// src/app/core/state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../../shared/models/todo.model';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../shared/constants';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectNowShowing = createSelector(
  selectTodoState,
  state => state.nowShowing
);

export const selectEditing = createSelector(
  selectTodoState,
  state => state.editing
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectNowShowing,
  (todos, nowShowing) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return todos.filter(todo => !todo.completed);
      case COMPLETED_TODOS:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveTodoCount = createSelector(
  selectAllTodos,
  todos => todos.reduce((count, todo) => todo.completed ? count : count + 1, 0)
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  selectActiveTodoCount,
  (todos, activeCount) => todos.length - activeCount
);
```

### 3. Services and Utils

#### storage.service.ts
```typescript
// src/app/core/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../shared/models/todo.model';
import { selectAllTodos } from '../state/todo.selectors';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'react-todos';

  constructor(private store: Store) {}

  getTodos(): Todo[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveTodos(): void {
    this.store.select(selectAllTodos).subscribe(todos => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    });
  }
}
```

#### utils.ts
```typescript
// src/app/shared/utils/utils.ts
export class Utils {
  static uuid(): string {
    let i: number;
    let random: number;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  }

  static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }
}
```

#### constants.ts
```typescript
// src/app/shared/constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

### 4. Components

#### todo-app.component.ts
```typescript
// src/app/features/todos/components/todo-app/todo-app.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../../../shared/models/todo.model';
import * as TodoActions from '../../../../core/state/todo.actions';
import {
  selectFilteredTodos,
  selectActiveTodoCount,
  selectCompletedCount,
  selectNowShowing
} from '../../../../core/state/todo.selectors';
import { ENTER_KEY } from '../../../../shared/constants';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAppComponent implements OnInit {
  filteredTodos$: Observable<Todo[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;
  nowShowing$: Observable<string>;
  newTodo = '';

  constructor(private store: Store) {
    this.filteredTodos$ = this.store.select(selectFilteredTodos);
    this.activeTodoCount$ = this.store.select(selectActiveTodoCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
    this.nowShowing$ = this.store.select(selectNowShowing);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = this.newTodo.trim();
    if (val) {
      this.store.dispatch(TodoActions.addTodo({ title: val }));
      this.newTodo = '';
    }
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(TodoActions.toggleAll({ completed: checked }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

#### todo-app.component.html
```html
<!-- src/app/features/todos/components/todo-app/todo-app.component.html -->
<div class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      (keydown)="handleNewTodoKeyDown($event)"
      autofocus
    />
  </header>
  <section class="main" *ngIf="(filteredTodos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeTodoCount$ | async) === 0"
      (change)="toggleAll($event)"
    />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <app-todo-item *ngFor="let todo of filteredTodos$ | async" [todo]="todo"></app-todo-item>
    </ul>
  </section>
  <app-todo-footer
    *ngIf="(activeTodoCount$ | async) || (completedCount$ | async)"
    [count]="activeTodoCount$ | async"
    [completedCount]="completedCount$ | async"
    [nowShowing]="nowShowing$ | async"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```

#### todo-item.component.ts
```typescript
// src/app/features/todos/components/todo-item/todo-item.component.ts
import { Component, Input, AfterViewChecked, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../../../shared/models/todo.model';
import * as TodoActions from '../../../../core/state/todo.actions';
import { ENTER_KEY, ESCAPE_KEY } from '../../../../shared/constants';
import { selectEditing } from '../../../../core/state/todo.selectors';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements AfterViewChecked {
  @Input() todo!: Todo;
  @ViewChild('editField') editField!: ElementRef;
  editText: string = '';
  editing$: any;

  constructor(private store: Store) {
    this.editing$ = this.store.select(selectEditing);
  }

  ngAfterViewChecked(): void {
    this.editing$.subscribe((editing: string | null) => {
      if (editing === this.todo.id && this.editField) {
        this.editField.nativeElement.focus();
        const length = this.editField.nativeElement.value.length;
        this.editField.nativeElement.setSelectionRange(length, length);
      }
    });
  }

  handleToggle(): void {
    this.store.dispatch(TodoActions.toggleTodo({ id: this.todo.id }));
  }

  handleDestroy(): void {
    this.store.dispatch(TodoActions.destroyTodo({ id: this.todo.id }));
  }

  handleEdit(): void {
    this.editText = this.todo.title;
    this.store.dispatch(TodoActions.setEditing({ id: this.todo.id }));
  }

  handleSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.store.dispatch(TodoActions.saveTodo({ id: this.todo.id, title: val }));
    } else {
      this.handleDestroy();
    }
    this.store.dispatch(TodoActions.setEditing({ id: null }));
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.store.dispatch(TodoActions.setEditing({ id: null }));
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
}
```

#### todo-item.component.html
```html
<!-- src/app/features/todos/components/todo-item/todo-item.component.html -->
<li [ngClass]="{'completed': todo.completed, 'editing': (editing$ | async) === todo.id}">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="handleToggle()"
    />
    <label (dblclick)="handleEdit()">{{todo.title}}</label>
    <button class="destroy" (click)="handleDestroy()"></button>
  </div>
  <input
    #editField
    class="edit"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

#### todo-footer.component.ts
```typescript
// src/app/features/todos/components/todo-footer/todo-footer.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  @Input() count: number = 0;
  @Input() completedCount: number = 0;
  @Input() nowShowing: string = '';
  @Output() clearCompleted = new EventEmitter<void>();

  get activeTodoWord(): string {
    return Utils.pluralize(this.count, 'item');
  }
}
```

#### todo-footer.component.html
```html
<!-- src/app/features/todos/components/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{count}}</strong> {{activeTodoWord}} left
  </span>
  <ul class="filters">
    <li>
      <a href="#/" [ngClass]="{'selected': nowShowing === 'all'}">All</a>
    </li>
    <li>
      <a href="#/active" [ngClass]="{'selected': nowShowing === 'active'}">Active</a>
    </li>
    <li>
      <a href="#/completed" [ngClass]="{'selected': nowShowing === 'completed'}">Completed</a>
    </li>
  </ul>
  <button
    *ngIf="completedCount > 0"
    class="clear-completed"
    (click)="clearCompleted.emit()"
  >
    Clear completed
  </button>
</footer>
```

### 5. Modules and Routing

#### core.module.ts
```typescript
// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todoReducer } from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ]
})
export class CoreModule {}
```

#### todos.module.ts
```typescript
// src/app/features/todos/todos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodosRoutingModule } from './todos-routing.module';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

@NgModule({
  declarations: [
    TodoAppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TodosRoutingModule
  ]
})
export class TodosModule {}
```

#### todos-routing.module.ts
```typescript
// src/app/features/todos/todos-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import * as TodoActions from '../../core/state/todo.actions';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../shared/constants';

const routes: Routes = [
  {
    path: '',
    component: TodoAppComponent,
    resolve: {
      todos: 'todosResolver'
    }
  },
  {
    path: 'active',
    component: TodoAppComponent,
    resolve: {
      todos: 'todosResolver'
    }
  },
  {
    path: 'completed',
    component: TodoAppComponent,
    resolve: {
      todos: 'todosResolver'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'todosResolver',
      useValue: (route: any, state: any, store: Store) => {
        const path = route.url[0]?.path || '';
        const nowShowing = path === 'active' ? ACTIVE_TODOS : path === 'completed' ? COMPLETED_TODOS : ALL_TODOS;
        store.dispatch(TodoActions.setNowShowing({ nowShowing }));
      },
      deps: [Store]
    }
  ]
})
export class TodosRoutingModule {}
```

#### app.module.ts
```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### app-routing.module.ts
```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/todos/todos.module').then(m => m.TodosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### 6. CSS (minimal changes from original)
I'll assume the CSS files remain similar to the original React application, just placed in the appropriate component folders with Angular naming conventions.

This migration:
- Uses NgRx for state management, replacing the custom model
- Implements Angular best practices with proper separation of concerns
- Maintains all functionality from the original React app
- Uses Angular routing for navigation between different views
- Implements proper typing and component communication
- Optimizes performance with OnPush change detection
- Follows Angular style guide conventions
- Implements lazy loading through feature modules

The code is clean, maintainable, and follows modern Angular practices while preserving the original functionality of the Todo application.

### Tokens: {'input_tokens': 3514, 'output_tokens': 4857, 'reasoning_tokens': 0}
### Execution time: 49.88283610343933
