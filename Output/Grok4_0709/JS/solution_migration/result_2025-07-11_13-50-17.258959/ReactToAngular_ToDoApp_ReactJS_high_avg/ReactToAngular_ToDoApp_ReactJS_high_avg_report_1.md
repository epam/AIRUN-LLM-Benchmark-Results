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
```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/all' },
      {
        path: '',
        loadChildren: () => import('./todo/todo.module').then((m) => m.TodoModule),
      },
    ]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <router-outlet></router-outlet>
    </section>
  `,
})
export class AppComponent {}
```

```typescript
// src/app/todo/todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import * as fromTodo from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';

@NgModule({
  declarations: [
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'all', component: TodoListComponent, data: { filter: 'all' } },
      { path: 'active', component: TodoListComponent, data: { filter: 'active' } },
      { path: 'completed', component: TodoListComponent, data: { filter: 'completed' } },
    ]),
    StoreModule.forFeature(fromTodo.todoFeatureKey, fromTodo.reducer),
    EffectsModule.forFeature([TodoEffects]),
  ],
})
export class TodoModule {}
```

```typescript
// src/app/todo/components/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromTodo from '../../state';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  template: `
    <div>
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          (keydown)="handleNewTodoKeyDown($event)"
          autofocus
        />
      </header>
      <section class="main" *ngIf="(hasTodos$ | async)">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          [checked]="(activeCount$ | async) === 0"
          (change)="toggleAll($event.target.checked)"
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <app-todo-item
            *ngFor="let todo of (shownTodos$ | async)"
            [todo]="todo"
            [editing]="editing === todo.id"
            (toggle)="toggle(todo)"
            (destroy)="destroy(todo)"
            (edit)="edit(todo)"
            (save)="save(todo, $event)"
            (cancel)="cancel()"
          ></app-todo-item>
        </ul>
      </section>
      <app-todo-footer
        *ngIf="(showFooter$ | async)"
        [count]="(activeCount$ | async) ?? 0"
        [completedCount]="(completedCount$ | async) ?? 0"
        (clearCompleted)="clearCompleted()"
      ></app-todo-footer>
    </div>
  `,
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  shownTodos$: Observable<Todo[]>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  hasTodos$: Observable<boolean>;
  showFooter$: Observable<boolean>;
  editing: string | null = null;
  filter: string = 'all';

  constructor(private store: Store, private route: ActivatedRoute) {
    this.todos$ = this.store.select(fromTodo.selectTodos);
    this.activeCount$ = this.store.select(fromTodo.selectActiveCount);
    this.completedCount$ = this.store.select(fromTodo.selectCompletedCount);
    this.hasTodos$ = this.todos$.pipe(map((todos) => todos.length > 0));
    this.showFooter$ = combineLatest([this.activeCount$, this.completedCount$]).pipe(
      map(([active, completed]) => active > 0 || completed > 0)
    );
  }

  ngOnInit(): void {
    this.shownTodos$ = combineLatest([this.todos$, this.route.data]).pipe(
      map(([todos, data]) => {
        this.filter = data['filter'];
        return todos.filter((todo) => {
          switch (this.filter) {
            case 'active':
              return !todo.completed;
            case 'completed':
              return todo.completed;
            default:
              return true;
          }
        });
      })
    );
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== 13) {
      return;
    }
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();
    if (val) {
      this.store.dispatch(fromTodo.addTodo({ title: val }));
      input.value = '';
    }
  }

  toggleAll(checked: boolean): void {
    this.store.dispatch(fromTodo.toggleAll({ checked }));
  }

  toggle(todo: Todo): void {
    this.store.dispatch(fromTodo.toggleTodo({ id: todo.id }));
  }

  destroy(todo: Todo): void {
    this.store.dispatch(fromTodo.destroyTodo({ id: todo.id }));
  }

  edit(todo: Todo): void {
    this.editing = todo.id;
  }

  save(todo: Todo, text: string): void {
    this.store.dispatch(fromTodo.saveTodo({ id: todo.id, title: text }));
    this.editing = null;
  }

  cancel(): void {
    this.editing = null;
  }

  clearCompleted(): void {
    this.store.dispatch(fromTodo.clearCompleted());
  }
}
```

```typescript
// src/app/todo/components/todo-item/todo-item.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li [ngClass]="{ completed: todo.completed, editing: editing }">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggle.emit()" />
        <label (dblclick)="edit.emit()">{{ todo.title }}</label>
        <button class="destroy" (click)="destroy.emit()"></button>
      </div>
      <input
        #editField
        class="edit"
        [value]="editText"
        (input)="editText = $event.target.value"
        (blur)="handleSubmit()"
        (keydown)="handleKeydown($event)"
      />
    </li>
  `,
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: Todo;
  @Input() editing: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editField') editField!: ElementRef<HTMLInputElement>;

  editText: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing'] && changes['editing'].currentValue && !changes['editing'].previousValue) {
      this.editText = this.todo.title;
      setTimeout(() => {
        const node = this.editField.nativeElement;
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      });
    }
  }

  handleSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.save.emit(val);
    } else {
      this.destroy.emit();
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.editText = this.todo.title;
      this.cancel.emit();
    } else if (event.keyCode === 13) {
      this.handleSubmit();
    }
  }
}
```

```typescript
// src/app/todo/components/todo-footer/todo-footer.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ count }}</strong> {{ count === 1 ? 'item' : 'items' }} left
      </span>
      <ul class="filters">
        <li>
          <a routerLink="/all" routerLinkActive="selected">All</a>
        </li>
        <li>
          <a routerLink="/active" routerLinkActive="selected">Active</a>
        </li>
        <li>
          <a routerLink="/completed" routerLinkActive="selected">Completed</a>
        </li>
      </ul>
      <button *ngIf="completedCount > 0" class="clear-completed" (click)="clearCompleted.emit()">
        Clear completed
      </button>
    </footer>
  `,
})
export class TodoFooterComponent {
  @Input() count: number = 0;
  @Input() completedCount: number = 0;
  @Output() clearCompleted = new EventEmitter<void>();
}
```

```typescript
// src/app/todo/state/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ checked: boolean }>());
export const destroyTodo = createAction('[Todo] Destroy Todo', props<{ id: string }>());
export const saveTodo = createAction('[Todo] Save Todo', props<{ id: string; title: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
```

```typescript
// src/app/todo/state/todo.reducer.ts
import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromActions from './todo.actions';
import { Todo } from '../models/todo.model';

export const todoFeatureKey = 'todos';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: [],
};

function uuid(): string {
  let i: number;
  let random: number;
  let uuid = '';
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

export const reducer = createReducer(
  initialState,
  on(fromActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: uuid(), title, completed: false }],
  })),
  on(fromActions.toggleAll, (state, { checked }) => ({
    ...state,
    todos: state.todos.map((todo) => ({ ...todo, completed: checked })),
  })),
  on(fromActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  on(fromActions.destroyTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  on(fromActions.saveTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
  })),
  on(fromActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter((todo) => !todo.completed),
  })),
  on(fromActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
  }))
);

export const selectTodoState = createFeatureSelector<TodoState>(todoFeatureKey);

export const selectTodos = createSelector(selectTodoState, (state) => state.todos);

export const selectActiveCount = createSelector(selectTodos, (todos) =>
  todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0)
);

export const selectCompletedCount = createSelector(
  selectTodos,
  selectActiveCount,
  (todos, activeCount) => todos.length - activeCount
);
```

```typescript
// src/app/todo/state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromActions from './todo.actions';
import { selectTodos } from './todo.reducer';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    defer(() => {
      const stored = localStorage.getItem('angular-todos') || '[]';
      const todos = JSON.parse(stored);
      return of(fromActions.loadTodosSuccess({ todos }));
    })
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        map((action) => action.type),
        withLatestFrom(this.store.select(selectTodos)),
        tap(([type, todos]) => {
          const updateActions = [
            fromActions.addTodo.type,
            fromActions.toggleTodo.type,
            fromActions.toggleAll.type,
            fromActions.destroyTodo.type,
            fromActions.saveTodo.type,
            fromActions.clearCompleted.type,
          ];
          if (updateActions.includes(type)) {
            localStorage.setItem('angular-todos', JSON.stringify(todos));
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store) {}
}
```

```typescript
// src/app/todo/state/index.ts
export * from './todo.actions';
export * from './todo.reducer';
```

```typescript
// src/app/todo/models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### Tokens: {'input_tokens': 3515, 'output_tokens': 3369, 'reasoning_tokens': 4971}
### Execution time: 163.4433662891388
