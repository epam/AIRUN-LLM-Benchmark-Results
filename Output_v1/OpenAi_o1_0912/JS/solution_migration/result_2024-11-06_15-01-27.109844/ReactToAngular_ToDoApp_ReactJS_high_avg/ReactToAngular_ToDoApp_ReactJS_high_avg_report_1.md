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

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

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


Your task is to migrate this code to Angular 14.x., assume that the code which is not provided has been already migrated and has the same contract.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects if needed.
- For big files try to split the code into separate components or functions.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
```ts
// constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```ts
// utils.ts
export function uuid(): string {
  let i, random;
  let uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12
      ? 4
      : (i === 16 ? (random & 3 | 8) : random)
    ).toString(16);
  }

  return uuid;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any): any {
  if (data !== undefined) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const storeData = localStorage.getItem(namespace);
  return (storeData && JSON.parse(storeData)) || [];
}
```

```ts
// models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

```ts
// actions/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: string; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All Todos',
  props<{ completed: boolean }>()
);

export const clearCompleted = createAction(
  '[Todo] Clear Completed'
);

export const loadTodos = createAction(
  '[Todo] Load Todos'
);

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
```

```ts
// reducers/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from '../actions/todo.actions';
import { uuid } from '../utils';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: [],
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: uuid(), title, completed: false }],
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id !== id ? todo : { ...todo, completed: !todo.completed }
    ),
  })),
  on(TodoActions.editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id !== id ? todo : { ...todo, title }
    ),
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed })),
  })),
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  })),
);
```

```ts
// effects/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/todo.actions';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Todo } from '../models/todo.model';
import { store as storage } from '../utils';
import { Store } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{ todos: TodoState }>
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        const todos: Todo[] = storage('angular-todos');
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.toggleTodo,
          TodoActions.editTodo,
          TodoActions.deleteTodo,
          TodoActions.toggleAll,
          TodoActions.clearCompleted
        ),
        withLatestFrom(this.store$.select('todos')),
        tap(([action, state]) => {
          storage('angular-todos', state.todos);
        })
      ),
    { dispatch: false }
  );
}
```

```ts
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: ':filter', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

```ts
// components/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENTER_KEY } from '../../constants';
import * as TodoActions from '../../actions/todo.actions';
import { Todo } from '../../models/todo.model';

import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  newTodo: string = '';
  nowShowing: string = ALL_TODOS;
  editingTodoId: string = null;

  filteredTodos$: Observable<Todo[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(
    private store: Store<{ todos: { todos: Todo[] } }>,
    private route: ActivatedRoute
  ) {
    this.todos$ = store.select(state => state.todos.todos);
    this.activeTodoCount$ = this.todos$.pipe(
      map(todos => todos.filter(t => !t.completed).length)
    );
    this.completedCount$ = this.todos$.pipe(
      map(todos => todos.filter(t => t.completed).length)
    );

    this.filteredTodos$ = combineLatest([this.todos$, this.route.params]).pipe(
      map(([todos, params]) => {
        const filter = params['filter'];
        switch (filter) {
          case 'active':
            return todos.filter(t => !t.completed);
          case 'completed':
            return todos.filter(t => t.completed);
          default:
            return todos;
        }
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(TodoActions.loadTodos());

    this.route.params.subscribe(params => {
      const filter = params['filter'];
      switch (filter) {
        case 'active':
          this.nowShowing = ACTIVE_TODOS;
          break;
        case 'completed':
          this.nowShowing = COMPLETED_TODOS;
          break;
        default:
          this.nowShowing = ALL_TODOS;
          break;
      }
    });
  }

  handleNewTodoKeydown(event: KeyboardEvent) {
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

  toggleAllTodos(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(TodoActions.toggleAll({ completed: checked }));
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  toggleTodo(id: string) {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  deleteTodo(id: string) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  editTodo(id: string) {
    this.editingTodoId = id;
  }

  saveTodo(id: string, newTitle: string) {
    this.store.dispatch(TodoActions.editTodo({ id, title: newTitle }));
    this.editingTodoId = null;
  }

  cancelEditing() {
    this.editingTodoId = null;
  }
}
```

```html
<!-- components/app/app.component.html -->
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      (keydown)="handleNewTodoKeydown($event)"
      autofocus
    />
  </header>
  <section class="main" *ngIf="(todos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      (change)="toggleAllTodos($event)"
      [checked]="(activeTodoCount$ | async) === 0"
    />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of (filteredTodos$ | async)"
        [todo]="todo"
        (toggle)="toggleTodo(todo.id)"
        (destroy)="deleteTodo(todo.id)"
        (edit)="editTodo(todo.id)"
        [editing]="editingTodoId === todo.id"
        (save)="saveTodo(todo.id, $event)"
        (cancel)="cancelEditing()"
      >
      </app-todo-item>
    </ul>
  </section>
  <app-footer
    *ngIf="(todos$ | async)?.length"
    [count]="activeTodoCount$ | async"
    [completedCount]="completedCount$ | async"
    [nowShowing]="nowShowing"
    (clearCompleted)="clearCompleted()"
  ></app-footer>
</div>
```

```ts
// components/todo-item/todo-item.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Todo } from '../../models/todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() todo: Todo;
  @Input() editing: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  editText: string;

  @ViewChild('editInput') editInput: ElementRef;

  constructor() {}

  ngOnInit() {
    this.editText = this.todo.title;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing && changes.editing.currentValue) {
      this.editText = this.todo.title;
    }
  }

  ngAfterViewInit() {
    if (this.editing && this.editInput) {
      this.editInput.nativeElement.focus();
      const length = this.editInput.nativeElement.value.length;
      this.editInput.nativeElement.setSelectionRange(length, length);
    }
  }

  handleSubmit() {
    const val = this.editText.trim();
    if (val) {
      this.save.emit(val);
    } else {
      this.destroy.emit();
    }
  }

  handleEdit() {
    this.edit.emit();
    this.editText = this.todo.title;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editText = input.value;
  }
}
```

```html
<!-- components/todo-item/todo-item.component.html -->
<li [ngClass]="{ completed: todo.completed, editing: editing }">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="toggle.emit()"
    />
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroy.emit()"></button>
  </div>
  <input
    #editInput
    class="edit"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

```ts
// components/footer/footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { pluralize } from '../../utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  @Input() count: number;
  @Input() completedCount: number;
  @Input() nowShowing: string;
  @Output() clearCompleted = new EventEmitter<void>();

  allTodos = ALL_TODOS;
  activeTodos = ACTIVE_TODOS;
  completedTodos = COMPLETED_TODOS;

  pluralize = pluralize;
}
```

```html
<!-- components/footer/footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ pluralize(count, 'item') }} left
  </span>
  <ul class="filters">
    <li>
      <a
        [routerLink]="['/']"
        [ngClass]="{ selected: nowShowing === allTodos }"
        >All</a
      >
    </li>
    <li>
      <a
        [routerLink]="['/', 'active']"
        [ngClass]="{ selected: nowShowing === activeTodos }"
        >Active</a
      >
    </li>
    <li>
      <a
        [routerLink]="['/', 'completed']"
        [ngClass]="{ selected: nowShowing === completedTodos }"
        >Completed</a
      >
    </li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="completedCount > 0"
    (click)="clearCompleted.emit()"
  >
    Clear completed
  </button>
</footer>
```

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './reducers/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './effects/todo.effects';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TodoItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Tokens: {'input_tokens': 3368, 'output_tokens': 13374, 'reasoning_tokens': 9728}
### Execution time: 634.9657258987427
