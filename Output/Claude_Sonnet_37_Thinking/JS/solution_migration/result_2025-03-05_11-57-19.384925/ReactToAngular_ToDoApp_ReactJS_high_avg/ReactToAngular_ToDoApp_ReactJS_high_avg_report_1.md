I have the following React app code:

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


Your task is to migrate this code to Angular 14.x., assume that the code which is not provided has been already migrated and has the same contract.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects if needed.
- For big files try to split the code into separate components or functions.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Thoughts:
I'll translate the provided React code to Angular 14.x. Let's break this down step by step, considering the requirements:

1. Use @ngrx/store and @ngrx/effects where appropriate
2. Split large files
3. Optimize where possible
4. Remove TODOs
5. Return the translated code as markdown snippets

First, let's understand the structure of the React application:

- `app.tsx`: Main component with todo management logic
- `todoItem.tsx`: Component for individual todo items
- `footer.tsx`: Footer component with filtering and summary
- `constants.ts`: Constants used across the app
- `todoModel.ts`: Model handling data persistence and changes
- `utils.ts`: Utility functions

For the Angular version, I'll need to:

1. Create appropriate components, services, and models
2. Set up NgRx store for state management
3. Implement proper Angular routing to replace the Router logic
4. Apply Angular-specific syntax and patterns

Let's proceed with each file:

### 1. Constants

These can remain largely the same, just formatted for Angular:

```typescript
// constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

### 2. Utils

This can also remain similar:

```typescript
// utils.ts
export class Utils {
  public static uuid(): string {
    let i, random;
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

  public static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace: string, data?: any): any {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs: any[]): any {
    const newObj = {};
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}
```

### 3. Models and Types

Let's create the necessary interfaces first:

```typescript
// models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoAppState {
  todos: Todo[];
  nowShowing: string;
  editing: string | null;
}
```

### 4. NgRx Store Setup

We'll need to create actions, reducers, and effects for our todo app:

```typescript
// store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ todo: Todo }>()
);

export const destroyTodo = createAction(
  '[Todo] Destroy Todo',
  props<{ todo: Todo }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: string }>()
);

export const saveTodo = createAction(
  '[Todo] Save Todo',
  props<{ todo: Todo, text: string }>()
);

export const cancelEdit = createAction(
  '[Todo] Cancel Edit'
);

export const clearCompleted = createAction(
  '[Todo] Clear Completed'
);

export const changeFilter = createAction(
  '[Todo] Change Filter',
  props<{ filter: string }>()
);

export const loadTodos = createAction(
  '[Todo] Load Todos'
);

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
```

```typescript
// store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { TodoAppState } from '../models/todo.model';
import * as TodoActions from './todo.actions';
import { ALL_TODOS } from '../constants';
import { Utils } from '../utils';

export const initialState: TodoAppState = {
  todos: [],
  nowShowing: ALL_TODOS,
  editing: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, {
      id: Utils.uuid(),
      title,
      completed: false
    }]
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({
      ...todo,
      completed
    }))
  })),
  on(TodoActions.toggleTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => 
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    )
  })),
  on(TodoActions.destroyTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== todo.id)
  })),
  on(TodoActions.editTodo, (state, { id }) => ({
    ...state,
    editing: id
  })),
  on(TodoActions.saveTodo, (state, { todo, text }) => ({
    ...state,
    editing: null,
    todos: state.todos.map(t =>
      t.id === todo.id ? { ...t, title: text } : t
    )
  })),
  on(TodoActions.cancelEdit, (state) => ({
    ...state,
    editing: null
  })),
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.changeFilter, (state, { filter }) => ({
    ...state,
    nowShowing: filter
  }))
);
```

```typescript
// store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { Utils } from '../utils';

@Injectable()
export class TodoEffects {
  private readonly STORAGE_KEY = 'angular-todos';

  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    map(() => {
      const todos = Utils.store(this.STORAGE_KEY);
      return TodoActions.loadTodosSuccess({ todos });
    })
  ));

  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.toggleAll,
      TodoActions.toggleTodo,
      TodoActions.destroyTodo,
      TodoActions.saveTodo,
      TodoActions.clearCompleted
    ),
    tap(() => {
      // This is just to trigger the next effect, not actually an action dispatch
    })
  ), { dispatch: false });

  constructor(private actions$: Actions) {}
}
```

```typescript
// store/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoAppState } from '../models/todo.model';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodoState = createFeatureSelector<TodoAppState>('todo');

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

export const selectVisibleTodos = createSelector(
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
  todos => todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0)
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  selectActiveTodoCount,
  (todos, activeCount) => todos.length - activeCount
);
```

### 5. Todo Service

Let's create a service to handle todo operations:

```typescript
// services/todo.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo, TodoAppState } from '../models/todo.model';
import * as TodoActions from '../store/todo.actions';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private store: Store<TodoAppState>) {}

  loadTodos(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(title: string): void {
    this.store.dispatch(TodoActions.addTodo({ title }));
  }

  toggleAll(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }

  toggle(todo: Todo): void {
    this.store.dispatch(TodoActions.toggleTodo({ todo }));
  }

  destroy(todo: Todo): void {
    this.store.dispatch(TodoActions.destroyTodo({ todo }));
  }

  edit(id: string): void {
    this.store.dispatch(TodoActions.editTodo({ id }));
  }

  save(todo: Todo, text: string): void {
    this.store.dispatch(TodoActions.saveTodo({ todo, text }));
  }

  cancel(): void {
    this.store.dispatch(TodoActions.cancelEdit());
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
  
  changeFilter(filter: string): void {
    this.store.dispatch(TodoActions.changeFilter({ filter }));
  }
}
```

### 6. Components

Now, let's create the Angular components:

```typescript
// components/todo-item/todo-item.component.ts
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Input() editing = false;
  @Output() toggleTodo = new EventEmitter<void>();
  @Output() destroyTodo = new EventEmitter<void>();
  @Output() editTodo = new EventEmitter<void>();
  @Output() saveTodo = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @ViewChild('editField') editFieldRef!: ElementRef;

  editText = '';

  ngOnInit(): void {
    this.editText = this.todo.title;
  }

  ngOnChanges(): void {
    if (this.editing && this.editFieldRef) {
      const inputElement = this.editFieldRef.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }
  }

  handleSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.saveTodo.emit(val);
      this.editText = val;
    } else {
      this.destroyTodo.emit();
    }
  }

  handleEdit(): void {
    this.editTodo.emit();
    this.editText = this.todo.title;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancelEdit.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
}
```

```html
<!-- components/todo-item/todo-item.component.html -->
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input 
      class="toggle" 
      type="checkbox" 
      [checked]="todo.completed" 
      (change)="toggleTodo.emit()">
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroyTodo.emit()"></button>
  </div>
  <input 
    #editField
    class="edit"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (keydown)="handleKeyDown($event)">
</li>
```

```typescript
// components/todo-footer/todo-footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { Utils } from '../../utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent {
  @Input() count = 0;
  @Input() completedCount = 0;
  @Input() nowShowing = ALL_TODOS;
  @Output() clearCompleted = new EventEmitter<void>();

  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;

  get activeTodoWord(): string {
    return Utils.pluralize(this.count, 'item');
  }
}
```

```html
<!-- components/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a 
        [routerLink]="['/']"
        [class.selected]="nowShowing === ALL_TODOS">
        All
      </a>
    </li>
    <li>
      <a 
        [routerLink]="['/active']"
        [class.selected]="nowShowing === ACTIVE_TODOS">
        Active
      </a>
    </li>
    <li>
      <a 
        [routerLink]="['/completed']"
        [class.selected]="nowShowing === COMPLETED_TODOS">
        Completed
      </a>
    </li>
  </ul>
  <button 
    *ngIf="completedCount > 0"
    class="clear-completed" 
    (click)="clearCompleted.emit()">
    Clear completed
  </button>
</footer>
```

```typescript
// app.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Todo, TodoAppState } from './models/todo.model';
import { TodoService } from './services/todo.service';
import * as fromTodo from './store/todo.selectors';
import { ENTER_KEY } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('newTodo') newTodoInput!: ElementRef;

  todos$: Observable<Todo[]>;
  visibleTodos$: Observable<Todo[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;
  nowShowing$: Observable<string>;
  editing$: Observable<string | null>;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private store: Store<TodoAppState>
  ) {
    this.todos$ = this.store.select(fromTodo.selectAllTodos);
    this.visibleTodos$ = this.store.select(fromTodo.selectVisibleTodos);
    this.activeTodoCount$ = this.store.select(fromTodo.selectActiveTodoCount);
    this.completedCount$ = this.store.select(fromTodo.selectCompletedCount);
    this.nowShowing$ = this.store.select(fromTodo.selectNowShowing);
    this.editing$ = this.store.select(fromTodo.selectEditing);
  }

  ngOnInit(): void {
    this.todoService.loadTodos();
    
    this.route.url.subscribe(segments => {
      const path = segments.length > 0 ? segments[0].path : '';
      this.updateRouting(path);
    });
  }

  private updateRouting(path: string): void {
    switch(path) {
      case 'active':
        this.todoService.changeFilter('active');
        break;
      case 'completed':
        this.todoService.changeFilter('completed');
        break;
      default:
        this.todoService.changeFilter('all');
    }
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.newTodoInput.nativeElement.value.trim();
    if (val) {
      this.todoService.addTodo(val);
      this.newTodoInput.nativeElement.value = '';
    }
  }

  toggleAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.todoService.toggleAll(target.checked);
  }

  toggle(todo: Todo): void {
    this.todoService.toggle(todo);
  }

  destroy(todo: Todo): void {
    this.todoService.destroy(todo);
  }

  edit(todo: Todo): void {
    this.todoService.edit(todo.id);
  }

  save(todo: Todo, text: string): void {
    this.todoService.save(todo, text);
  }

  cancel(): void {
    this.todoService.cancel();
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
```

```html
<!-- app.component.html -->
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      #newTodo
      class="new-todo"
      placeholder="What needs to be done?"
      (keydown)="handleNewTodoKeyDown($event)"
      autofocus>
  </header>
  
  <section *ngIf="(todos$ | async)?.length" class="main">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeTodoCount$ | async) === 0"
      (change)="toggleAll($event)">
    <label for="toggle-all">Mark all as complete</label>
    
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of (visibleTodos$ | async)"
        [todo]="todo"
        [editing]="(editing$ | async) === todo.id"
        (toggleTodo)="toggle(todo)"
        (destroyTodo)="destroy(todo)"
        (editTodo)="edit(todo)"
        (saveTodo)="save(todo, $event)"
        (cancelEdit)="cancel()">
      </app-todo-item>
    </ul>
  </section>
  
  <app-todo-footer
    *ngIf="(activeTodoCount$ | async) > 0 || (completedCount$ | async) > 0"
    [count]="activeTodoCount$ | async"
    [completedCount]="completedCount$ | async"
    [nowShowing]="nowShowing$ | async"
    (clearCompleted)="clearCompleted()">
  </app-todo-footer>
</div>
```

### 7. Routing Module

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 8. App Module

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot({ todo: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now I have all the code translated from React to Angular, using NgRx for state management and following Angular best practices. Let me format these as markdown code snippets as requested:

### Answer:
# Angular 14.x Migration Code

## models/todo.model.ts
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoAppState {
  todos: Todo[];
  nowShowing: string;
  editing: string | null;
}
```

## constants.ts
```typescript
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

## utils.ts
```typescript
export class Utils {
  public static uuid(): string {
    let i, random;
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

  public static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace: string, data?: any): any {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs: any[]): any {
    const newObj = {};
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}
```

## store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ todo: Todo }>()
);

export const destroyTodo = createAction(
  '[Todo] Destroy Todo',
  props<{ todo: Todo }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: string }>()
);

export const saveTodo = createAction(
  '[Todo] Save Todo',
  props<{ todo: Todo, text: string }>()
);

export const cancelEdit = createAction(
  '[Todo] Cancel Edit'
);

export const clearCompleted = createAction(
  '[Todo] Clear Completed'
);

export const changeFilter = createAction(
  '[Todo] Change Filter',
  props<{ filter: string }>()
);

export const loadTodos = createAction(
  '[Todo] Load Todos'
);

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
```

## store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { TodoAppState } from '../models/todo.model';
import * as TodoActions from './todo.actions';
import { ALL_TODOS } from '../constants';
import { Utils } from '../utils';

export const initialState: TodoAppState = {
  todos: [],
  nowShowing: ALL_TODOS,
  editing: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, {
      id: Utils.uuid(),
      title,
      completed: false
    }]
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({
      ...todo,
      completed
    }))
  })),
  on(TodoActions.toggleTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => 
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    )
  })),
  on(TodoActions.destroyTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== todo.id)
  })),
  on(TodoActions.editTodo, (state, { id }) => ({
    ...state,
    editing: id
  })),
  on(TodoActions.saveTodo, (state, { todo, text }) => ({
    ...state,
    editing: null,
    todos: state.todos.map(t =>
      t.id === todo.id ? { ...t, title: text } : t
    )
  })),
  on(TodoActions.cancelEdit, (state) => ({
    ...state,
    editing: null
  })),
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.changeFilter, (state, { filter }) => ({
    ...state,
    nowShowing: filter
  }))
);
```

## store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { Utils } from '../utils';
import { Store } from '@ngrx/store';
import { TodoAppState } from '../models/todo.model';
import { selectAllTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {
  private readonly STORAGE_KEY = 'angular-todos';

  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    map(() => {
      const todos = Utils.store(this.STORAGE_KEY);
      return TodoActions.loadTodosSuccess({ todos });
    })
  ));

  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.toggleAll,
      TodoActions.toggleTodo,
      TodoActions.destroyTodo,
      TodoActions.saveTodo,
      TodoActions.clearCompleted
    ),
    withLatestFrom(this.store.select(selectAllTodos)),
    tap(([action, todos]) => {
      Utils.store(this.STORAGE_KEY, todos);
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store<TodoAppState>
  ) {}
}
```

## store/todo.selectors.ts
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoAppState } from '../models/todo.model';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodoState = createFeatureSelector<TodoAppState>('todo');

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

export const selectVisibleTodos = createSelector(
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
  todos => todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0)
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  selectActiveTodoCount,
  (todos, activeCount) => todos.length - activeCount
);
```

## services/todo.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo, TodoAppState } from '../models/todo.model';
import * as TodoActions from '../store/todo.actions';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private store: Store<{ todo: TodoAppState }>) {}

  loadTodos(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(title: string): void {
    this.store.dispatch(TodoActions.addTodo({ title }));
  }

  toggleAll(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }

  toggle(todo: Todo): void {
    this.store.dispatch(TodoActions.toggleTodo({ todo }));
  }

  destroy(todo: Todo): void {
    this.store.dispatch(TodoActions.destroyTodo({ todo }));
  }

  edit(id: string): void {
    this.store.dispatch(TodoActions.editTodo({ id }));
  }

  save(todo: Todo, text: string): void {
    this.store.dispatch(TodoActions.saveTodo({ todo, text }));
  }

  cancel(): void {
    this.store.dispatch(TodoActions.cancelEdit());
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
  
  changeFilter(filter: string): void {
    this.store.dispatch(TodoActions.changeFilter({ filter }));
  }
}
```

## components/todo-item/todo-item.component.ts
```typescript
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, OnChanges {
  @Input() todo!: Todo;
  @Input() editing = false;
  @Output() toggleTodo = new EventEmitter<void>();
  @Output() destroyTodo = new EventEmitter<void>();
  @Output() editTodo = new EventEmitter<void>();
  @Output() saveTodo = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @ViewChild('editField') editFieldRef!: ElementRef;

  editText = '';

  ngOnInit(): void {
    this.editText = this.todo.title;
  }

  ngOnChanges(): void {
    if (this.editing && this.editFieldRef) {
      const inputElement = this.editFieldRef.nativeElement as HTMLInputElement;
      inputElement.focus();
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }
  }

  handleSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.saveTodo.emit(val);
      this.editText = val;
    } else {
      this.destroyTodo.emit();
    }
  }

  handleEdit(): void {
    this.editTodo.emit();
    this.editText = this.todo.title;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancelEdit.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
}
```

## components/todo-item/todo-item.component.html
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input 
      class="toggle" 
      type="checkbox" 
      [checked]="todo.completed" 
      (change)="toggleTodo.emit()">
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroyTodo.emit()"></button>
  </div>
  <input 
    #editField
    class="edit"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (keydown)="handleKeyDown($event)">
</li>
```

## components/todo-footer/todo-footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { Utils } from '../../utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent {
  @Input() count = 0;
  @Input() completedCount = 0;
  @Input() nowShowing = ALL_TODOS;
  @Output() clearCompleted = new EventEmitter<void>();

  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;

  get activeTodoWord(): string {
    return Utils.pluralize(this.count, 'item');
  }
}
```

## components/todo-footer/todo-footer.component.html
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a 
        [routerLink]="['/']"
        [class.selected]="nowShowing === ALL_TODOS">
        All
      </a>
    </li>
    <li>
      <a 
        [routerLink]="['/active']"
        [class.selected]="nowShowing === ACTIVE_TODOS">
        Active
      </a>
    </li>
    <li>
      <a 
        [routerLink]="['/completed']"
        [class.selected]="nowShowing === COMPLETED_TODOS">
        Completed
      </a>
    </li>
  </ul>
  <button 
    *ngIf="completedCount > 0"
    class="clear-completed" 
    (click)="clearCompleted.emit()">
    Clear completed
  </button>
</footer>
```

## app.component.ts
```typescript
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import * as fromTodo from './store/todo.selectors';
import { ENTER_KEY } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('newTodo') newTodoInput!: ElementRef;

  todos$: Observable<Todo[]>;
  visibleTodos$: Observable<Todo[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;
  nowShowing$: Observable<string>;
  editing$: Observable<string | null>;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.todos$ = this.store.select(fromTodo.selectAllTodos);
    this.visibleTodos$ = this.store.select(fromTodo.selectVisibleTodos);
    this.activeTodoCount$ = this.store.select(fromTodo.selectActiveTodoCount);
    this.completedCount$ = this.store.select(fromTodo.selectCompletedCount);
    this.nowShowing$ = this.store.select(fromTodo.selectNowShowing);
    this.editing$ = this.store.select(fromTodo.selectEditing);
  }

  ngOnInit(): void {
    this.todoService.loadTodos();
    
    this.route.url.subscribe(segments => {
      const path = segments.length > 0 ? segments[0].path : '';
      this.updateRouting(path);
    });
  }

  private updateRouting(path: string): void {
    switch(path) {
      case 'active':
        this.todoService.changeFilter('active');
        break;
      case 'completed':
        this.todoService.changeFilter('completed');
        break;
      default:
        this.todoService.changeFilter('all');
    }
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.newTodoInput.nativeElement.value.trim();
    if (val) {
      this.todoService.addTodo(val);
      this.newTodoInput.nativeElement.value = '';
    }
  }

  toggleAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.todoService.toggleAll(target.checked);
  }

  toggle(todo: Todo): void {
    this.todoService.toggle(todo);
  }

  destroy(todo: Todo): void {
    this.todoService.destroy(todo);
  }

  edit(todo: Todo): void {
    this.todoService.edit(todo.id);
  }

  save(todo: Todo, text: string): void {
    this.todoService.save(todo, text);
  }

  cancel(): void {
    this.todoService.cancel();
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
```

## app.component.html
```html
<div class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input
      #newTodo
      class="new-todo"
      placeholder="What needs to be done?"
      (keydown)="handleNewTodoKeyDown($event)"
      autofocus>
  </header>
  
  <section *ngIf="(todos$ | async)?.length" class="main">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeTodoCount$ | async) === 0"
      (change)="toggleAll($event)">
    <label for="toggle-all">Mark all as complete</label>
    
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of (visibleTodos$ | async)"
        [todo]="todo"
        [editing]="(editing$ | async) === todo.id"
        (toggleTodo)="toggle(todo)"
        (destroyTodo)="destroy(todo)"
        (editTodo)="edit(todo)"
        (saveTodo)="save(todo, $event)"
        (cancelEdit)="cancel()">
      </app-todo-item>
    </ul>
  </section>
  
  <app-todo-footer
    *ngIf="(activeTodoCount$ | async) > 0 || (completedCount$ | async) > 0"
    [count]="activeTodoCount$ | async"
    [completedCount]="completedCount$ | async"
    [nowShowing]="nowShowing$ | async"
    (clearCompleted)="clearCompleted()">
  </app-todo-footer>
</div>
```

## app-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot({ todo: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Tokens: {'input_tokens': 4086, 'output_tokens': 11822}
### Execution time: 129.41004014015198
