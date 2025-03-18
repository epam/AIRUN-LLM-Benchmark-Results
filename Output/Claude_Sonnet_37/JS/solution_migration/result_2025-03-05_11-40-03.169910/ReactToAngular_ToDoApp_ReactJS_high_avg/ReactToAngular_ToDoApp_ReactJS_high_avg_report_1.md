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
### Answer:
# Angular 14.x Migration

## app.component.ts
```typescript
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TodoModel } from './models/todo.model';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import * as TodoActions from './store/todo.actions';
import { AppState } from './store/app.state';
import { selectTodos, selectActiveTodoCount, selectCompletedCount } from './store/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('newField') newField!: ElementRef;

  todos$: Observable<TodoModel[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;
  
  nowShowing: string = ALL_TODOS;
  editing: string | null = null;
  
  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.todos$ = this.store.select(selectTodos);
    this.activeTodoCount$ = this.store.select(selectActiveTodoCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const path = this.router.url;
      if (path === '/active') {
        this.nowShowing = ACTIVE_TODOS;
      } else if (path === '/completed') {
        this.nowShowing = COMPLETED_TODOS;
      } else {
        this.nowShowing = ALL_TODOS;
      }
    });
    
    // Initialize the store with todos from localStorage
    this.store.dispatch(TodoActions.loadTodos());
  }

  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.newField.nativeElement.value.trim();

    if (val) {
      this.store.dispatch(TodoActions.addTodo({ title: val }));
      this.newField.nativeElement.value = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.store.dispatch(TodoActions.toggleAll({ checked }));
  }

  toggle(todo: TodoModel) {
    this.store.dispatch(TodoActions.toggleTodo({ todo }));
  }

  destroy(todo: TodoModel) {
    this.store.dispatch(TodoActions.destroyTodo({ todo }));
  }

  edit(todo: TodoModel) {
    this.editing = todo.id;
  }

  save(todo: TodoModel, text: string) {
    this.store.dispatch(TodoActions.saveTodo({ todo, text }));
    this.editing = null;
  }

  cancel() {
    this.editing = null;
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  filterTodos(todos: TodoModel[]): TodoModel[] {
    return todos.filter((todo) => {
      switch (this.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }
}
```

## app.component.html
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
  
  <ng-container *ngIf="todos$ | async as todos">
    <section class="main" *ngIf="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        (change)="toggleAll($event)"
        [checked]="(activeTodoCount$ | async) === 0"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item
          *ngFor="let todo of filterTodos(todos)"
          [todo]="todo"
          [editing]="editing === todo.id"
          (onToggle)="toggle(todo)"
          (onDestroy)="destroy(todo)"
          (onEdit)="edit(todo)"
          (onSave)="save(todo, $event)"
          (onCancel)="cancel()"
        ></app-todo-item>
      </ul>
    </section>
    
    <app-todo-footer
      *ngIf="(activeTodoCount$ | async) > 0 || (completedCount$ | async) > 0"
      [count]="activeTodoCount$ | async"
      [completedCount]="completedCount$ | async"
      [nowShowing]="nowShowing"
      (onClearCompleted)="clearCompleted()"
    ></app-todo-footer>
  </ng-container>
</div>
```

## todo-item.component.ts
```typescript
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { TodoModel } from '../models/todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: TodoModel;
  @Input() editing = false;
  
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDestroy = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<Event>();
  
  @ViewChild('editField') editField!: ElementRef;
  
  editText = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todo'] && this.todo) {
      this.editText = this.todo.title;
    }
    
    if (changes['editing'] && this.editing && this.editField) {
      setTimeout(() => {
        const input = this.editField.nativeElement;
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      });
    }
  }

  handleSubmit(event: Event) {
    const val = this.editText.trim();
    if (val) {
      this.onSave.emit(val);
      this.editText = val;
    } else {
      this.onDestroy.emit();
    }
  }

  handleEdit() {
    this.onEdit.emit();
    this.editText = this.todo.title;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.onCancel.emit(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editText = input.value;
  }
}
```

## todo-item.component.html
```html
<li [ngClass]="{'completed': todo.completed, 'editing': editing}">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggle.emit()"
    />
    <label (dblclick)="handleEdit()">
      {{ todo.title }}
    </label>
    <button class="destroy" (click)="onDestroy.emit()"></button>
  </div>
  <input
    #editField
    class="edit"
    [value]="editText"
    (blur)="handleSubmit($event)"
    (change)="handleChange($event)"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

## utils.service.ts
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  uuid(): string {
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

  pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  store(namespace: string, data?: any): any {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  extend(...objs: any[]): any {
    const newObj: any = {};
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

## todo-footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() count: number | null = 0;
  @Input() completedCount: number | null = 0;
  @Input() nowShowing: string = ALL_TODOS;
  
  @Output() onClearCompleted = new EventEmitter<void>();
  
  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;
  
  constructor(private utils: UtilsService) {}
  
  get activeTodoWord(): string {
    return this.utils.pluralize(this.count || 0, 'item');
  }
}
```

## todo-footer.component.html
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a
        routerLink="/"
        [ngClass]="{selected: nowShowing === ALL_TODOS}">
          All
      </a>
    </li>
    <li>
      <a
        routerLink="/active"
        [ngClass]="{selected: nowShowing === ACTIVE_TODOS}">
          Active
      </a>
    </li>
    <li>
      <a
        routerLink="/completed"
        [ngClass]="{selected: nowShowing === COMPLETED_TODOS}">
          Completed
      </a>
    </li>
  </ul>
  <button
    *ngIf="completedCount && completedCount > 0"
    class="clear-completed"
    (click)="onClearCompleted.emit()">
    Clear completed
  </button>
</footer>
```

## constants.ts
```typescript
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

## models/todo.model.ts
```typescript
export interface TodoModel {
  id: string;
  title: string;
  completed: boolean;
}
```

## store/app.state.ts
```typescript
import { TodoModel } from '../models/todo.model';

export interface TodoState {
  todos: TodoModel[];
}

export interface AppState {
  todos: TodoState;
}
```

## store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { TodoModel } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: TodoModel[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ checked: boolean }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ todo: TodoModel }>()
);

export const destroyTodo = createAction(
  '[Todo] Destroy Todo',
  props<{ todo: TodoModel }>()
);

export const saveTodo = createAction(
  '[Todo] Save Todo',
  props<{ todo: TodoModel, text: string }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');
```

## store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { TodoState } from './app.state';
import * as TodoActions from './todo.actions';
import { UtilsService } from '../services/utils.service';

const utils = new UtilsService();

export const initialState: TodoState = {
  todos: []
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
      id: utils.uuid(),
      title,
      completed: false
    }]
  })),
  on(TodoActions.toggleAll, (state, { checked }) => ({
    ...state,
    todos: state.todos.map(todo => ({
      ...todo,
      completed: checked
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
  on(TodoActions.saveTodo, (state, { todo, text }) => ({
    ...state,
    todos: state.todos.map(t => 
      t.id === todo.id ? { ...t, title: text } : t
    )
  })),
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  }))
);
```

## store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as TodoActions from './todo.actions';
import { AppState } from './app.state';
import { selectTodos } from './todo.selectors';
import { UtilsService } from '../services/utils.service';

@Injectable()
export class TodoEffects {
  
  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    map(() => {
      const todos = this.utils.store('angular-todos');
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
    withLatestFrom(this.store.select(selectTodos)),
    switchMap(([_, todos]) => {
      this.utils.store('angular-todos', todos);
      return [];
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private utils: UtilsService
  ) {}
}
```

## store/todo.selectors.ts
```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './app.state';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectActiveTodoCount = createSelector(
  selectTodos,
  (todos) => todos.reduce((count, todo) => todo.completed ? count : count + 1, 0)
);

export const selectCompletedCount = createSelector(
  selectTodos,
  selectActiveTodoCount,
  (todos, activeTodoCount) => todos.length - activeTodoCount
);
```

## app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Tokens: {'input_tokens': 4057, 'output_tokens': 5097}
### Execution time: 56.33933186531067
