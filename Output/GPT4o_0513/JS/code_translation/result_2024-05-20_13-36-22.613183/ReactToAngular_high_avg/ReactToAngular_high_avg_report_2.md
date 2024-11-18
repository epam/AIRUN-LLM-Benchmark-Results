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

## Run 2:
### Answer:
```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TodoModel } from './todoModel';
import { TodoFooterComponent } from './footer.component';
import { TodoItemComponent } from './todoItem.component';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { AppState, selectTodos, selectNowShowing, selectEditing } from './store/selectors';
import { addTodo, toggleAll, toggleTodo, destroyTodo, editTodo, saveTodo, cancelEdit, clearCompleted, setNowShowing } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos$: Observable<ITodo[]>;
  nowShowing$: Observable<string>;
  editing$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.todos$ = this.store.select(selectTodos);
    this.nowShowing$ = this.store.select(selectNowShowing);
    this.editing$ = this.store.select(selectEditing);
  }

  ngOnInit() {
    this.store.dispatch(setNowShowing({ nowShowing: ALL_TODOS }));
  }

  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();

    if (val) {
      this.store.dispatch(addTodo({ title: val }));
      input.value = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.store.dispatch(toggleAll({ checked }));
  }

  toggle(todo: ITodo) {
    this.store.dispatch(toggleTodo({ todo }));
  }

  destroy(todo: ITodo) {
    this.store.dispatch(destroyTodo({ todo }));
  }

  edit(todo: ITodo) {
    this.store.dispatch(editTodo({ todoId: todo.id }));
  }

  save(todo: ITodo, text: string) {
    this.store.dispatch(saveTodo({ todo, text }));
  }

  cancel() {
    this.store.dispatch(cancelEdit());
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```html
<!-- app.component.html -->
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
  <section class="main" *ngIf="(todos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      (change)="toggleAll($event)"
      [checked]="(todos$ | async)?.filter(todo => !todo.completed).length === 0"
    />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <li *ngFor="let todo of todos$ | async">
        <app-todo-item
          [todo]="todo"
          [editing]="(editing$ | async) === todo.id"
          (toggle)="toggle(todo)"
          (destroy)="destroy(todo)"
          (edit)="edit(todo)"
          (save)="save(todo, $event)"
          (cancel)="cancel()"
        ></app-todo-item>
      </li>
    </ul>
  </section>
  <app-todo-footer
    *ngIf="(todos$ | async)?.length"
    [count]="(todos$ | async)?.filter(todo => !todo.completed).length"
    [completedCount]="(todos$ | async)?.filter(todo => todo.completed).length"
    [nowShowing]="nowShowing$ | async"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```

```typescript
// todoItem.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ITodo } from './todoModel';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todoItem.component.html',
  styleUrls: ['./todoItem.component.css']
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: ITodo;
  @Input() editing!: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  editText: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing && changes.editing.currentValue) {
      this.editText = this.todo.title;
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
      this.handleSubmit(event);
    }
  }

  handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editText = input.value;
  }

  handleSubmit(event: Event) {
    const val = this.editText.trim();
    if (val) {
      this.save.emit(val);
    } else {
      this.destroy.emit();
    }
  }
}
```

```html
<!-- todoItem.component.html -->
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggle.emit()" />
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroy.emit()"></button>
  </div>
  <input
    class="edit"
    *ngIf="editing"
    [value]="editText"
    (blur)="handleSubmit($event)"
    (input)="handleChange($event)"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

```typescript
// footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class TodoFooterComponent {
  @Input() count!: number;
  @Input() completedCount!: number;
  @Input() nowShowing!: string;
  @Output() clearCompleted = new EventEmitter<void>();

  get activeTodoWord() {
    return Utils.pluralize(this.count, 'item');
  }
}
```

```html
<!-- footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a [class.selected]="nowShowing === 'all'" href="#/">All</a>
    </li>
    <li>
      <a [class.selected]="nowShowing === 'active'" href="#/active">Active</a>
    </li>
    <li>
      <a [class.selected]="nowShowing === 'completed'" href="#/completed">Completed</a>
    </li>
  </ul>
  <button *ngIf="completedCount > 0" class="clear-completed" (click)="clearCompleted.emit()">
    Clear completed
  </button>
</footer>
```

```typescript
// constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```typescript
// utils.ts
export class Utils {
  static uuid(): string {
    let i, random;
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

  static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  static extend(...objs: any[]): any {
    const newObj = {};
    for (const obj of objs) {
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

```typescript
// todoModel.ts
import { Utils } from './utils';

export class TodoModel {
  key: string;
  todos: ITodo[];
  onChanges: Array<() => void>;

  constructor(key: string) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  subscribe(onChange: () => void) {
    this.onChanges.push(onChange);
  }

  inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(cb => cb());
  }

  addTodo(title: string) {
    this.todos = [...this.todos, { id: Utils.uuid(), title, completed: false }];
    this.inform();
  }

  toggleAll(checked: boolean) {
    this.todos = this.todos.map(todo => Utils.extend({}, todo, { completed: checked }));
    this.inform();
  }

  toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map(todo => todo !== todoToToggle ? todo : Utils.extend({}, todo, { completed: !todo.completed }));
    this.inform();
  }

  destroy(todo: ITodo) {
    this.todos = this.todos.filter(candidate => candidate !== todo);
    this.inform();
  }

  save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map(todo => todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text }));
    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.inform();
  }
}
```

```typescript
// store/actions.ts
import { createAction, props } from '@ngrx/store';
import { ITodo } from '../todoModel';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ checked: boolean }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ todo: ITodo }>());
export const destroyTodo = createAction('[Todo] Destroy Todo', props<{ todo: ITodo }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ todoId: string }>());
export const saveTodo = createAction('[Todo] Save Todo', props<{ todo: ITodo, text: string }>());
export const cancelEdit = createAction('[Todo] Cancel Edit');
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setNowShowing = createAction('[Todo] Set Now Showing', props<{ nowShowing: string }>());
```

```typescript
// store/reducers.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleAll, toggleTodo, destroyTodo, editTodo, saveTodo, cancelEdit, clearCompleted, setNowShowing } from './actions';
import { ITodo } from '../todoModel';
import { Utils } from '../utils';

export interface AppState {
  todos: ITodo[];
  nowShowing: string;
  editing: string | null;
}

export const initialState: AppState = {
  todos: Utils.store('react-todos'),
  nowShowing: 'all',
  editing: null
};

export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Utils.uuid(), title, completed: false }]
  })),
  on(toggleAll, (state, { checked }) => ({
    ...state,
    todos: state.todos.map(todo => Utils.extend({}, todo, { completed: checked }))
  })),
  on(toggleTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t !== todo ? t : Utils.extend({}, t, { completed: !t.completed }))
  })),
  on(destroyTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(t => t !== todo)
  })),
  on(editTodo, (state, { todoId }) => ({
    ...state,
    editing: todoId
  })),
  on(saveTodo, (state, { todo, text }) => ({
    ...state,
    todos: state.todos.map(t => t !== todo ? t : Utils.extend({}, t, { title: text })),
    editing: null
  })),
  on(cancelEdit, state => ({
    ...state,
    editing: null
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(setNowShowing, (state, { nowShowing }) => ({
    ...state,
    nowShowing
  }))
);
```

```typescript
// store/selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './reducers';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectTodos = createSelector(
  selectAppState,
  (state: AppState) => state.todos
);

export const selectNowShowing = createSelector(
  selectAppState,
  (state: AppState) => state.nowShowing
);

export const selectEditing = createSelector(
  selectAppState,
  (state: AppState) => state.editing
);
```

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './todoItem.component';
import { TodoFooterComponent } from './footer.component';
import { todoReducer } from './store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ app: todoReducer }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// models.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

export interface IAppProps {
  model: TodoModel;
}

export interface IAppState {
  nowShowing: string;
  editing: string | null;
}

export interface ITodoItemState {
  editText: string;
}
```

### Tokens: {'input_tokens': 3269, 'output_tokens': 3512}
### Execution time: 56.827008962631226
