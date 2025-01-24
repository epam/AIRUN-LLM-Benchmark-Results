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
```markdown
```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoAppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-app></app-todo-app>
    </section>
  `
})
export class AppComponent {}
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
// constants/constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```ts
// services/utils.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  uuid(): string {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      const random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12
        ? 4
        : i === 16
        ? (random & 3) | 8
        : random
      ).toString(16);
    }
    return uuid;
  }

  pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  store(namespace: string, data?: any): any {
    if (data) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }
    const stored = localStorage.getItem(namespace);
    return (stored && JSON.parse(stored)) || [];
  }

  extend<T>(...objs: T[]): T {
    const newObj: any = {};
    for (const obj of objs) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}
```

```ts
// components/todo-app/todo-app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
  ENTER_KEY
} from '../../constants/constants';
import {
  addTodo,
  clearCompleted,
  setFilter,
  toggle,
  toggleAll,
  destroy,
  save
} from '../../store/todo.actions';
import {
  selectTodos,
  selectFilter,
  selectActiveCount,
  selectCompletedCount
} from '../../store/todo.selectors';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html'
})
export class TodoAppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  filter$: Observable<string>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  editing: string | null = null;
  newTodoValue = '';

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
    this.filter$ = this.store.select(selectFilter);
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  ngOnInit(): void {}

  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    if (this.newTodoValue.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodoValue.trim() }));
      this.newTodoValue = '';
    }
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(toggleAll({ checked }));
  }

  toggle(todo: Todo) {
    this.store.dispatch(toggle({ todo }));
  }

  destroy(todo: Todo) {
    this.store.dispatch(destroy({ todo }));
  }

  edit(todo: Todo) {
    this.editing = todo.id;
  }

  saveTitle(todo: Todo, text: string) {
    this.store.dispatch(save({ todo, text }));
    this.editing = null;
  }

  cancel() {
    this.editing = null;
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  showAll() {
    this.store.dispatch(setFilter({ filter: ALL_TODOS }));
  }

  showActive() {
    this.store.dispatch(setFilter({ filter: ACTIVE_TODOS }));
  }

  showCompleted() {
    this.store.dispatch(setFilter({ filter: COMPLETED_TODOS }));
  }
}
```

```html
<!-- components/todo-app/todo-app.component.html -->
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodoValue"
      (keydown)="handleNewTodoKeyDown($event)"
      autofocus
    />
  </header>

  <section class="main" *ngIf="(todos$ | async)?.length as total">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeCount$ | async) === 0 && total > 0"
      (change)="toggleAll($event)"
    />
    <label htmlFor="toggle-all">Mark all as complete</label>

    <ul class="todo-list">
      <li
        *ngFor="let todo of (todos$ | async)"
        [ngClass]="{
          completed: todo.completed,
          editing: editing === todo.id
        }"
      >
        <app-todo-item
          [todo]="todo"
          [editing]="editing === todo.id"
          (toggleTodo)="toggle($event)"
          (destroyTodo)="destroy($event)"
          (editTodo)="edit($event)"
          (saveTodo)="saveTitle(todo, $event)"
          (cancelEdit)="cancel()"
        ></app-todo-item>
      </li>
    </ul>
  </section>

  <app-todo-footer
    [nowShowing]="(filter$ | async)"
    [activeCount]="(activeCount$ | async)"
    [completedCount]="(completedCount$ | async)"
    (clearCompleted)="clearCompleted()"
    (showAll)="showAll()"
    (showActive)="showActive()"
    (showCompleted)="showCompleted()"
  ></app-todo-footer>
</div>
```

```ts
// components/todo-item/todo-item.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { ESCAPE_KEY, ENTER_KEY } from '../../constants/constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent implements OnChanges, AfterViewChecked {
  @Input() todo!: Todo;
  @Input() editing = false;
  @Output() toggleTodo = new EventEmitter<Todo>();
  @Output() destroyTodo = new EventEmitter<Todo>();
  @Output() editTodo = new EventEmitter<Todo>();
  @Output() saveTodo = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();

  editText = '';
  @ViewChild('editField') editField!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todo'] && !changes['todo'].firstChange) {
      this.editText = this.todo.title;
    }
    if (changes['editing'] && this.editing) {
      this.editText = this.todo.title;
    }
  }

  ngAfterViewChecked() {
    if (this.editing && this.editField) {
      this.editField.nativeElement.focus();
      const val = this.editField.nativeElement.value;
      this.editField.nativeElement.setSelectionRange(val.length, val.length);
    }
  }

  handleEdit() {
    this.editTodo.emit(this.todo);
  }

  handleChange(event: any) {
    this.editText = event.target.value;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancelEdit.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.submit();
    }
  }

  submit() {
    const val = this.editText.trim();
    if (val) {
      this.saveTodo.emit(val);
    } else {
      this.destroyTodo.emit(this.todo);
    }
  }

  toggle() {
    this.toggleTodo.emit(this.todo);
  }

  destroy() {
    this.destroyTodo.emit(this.todo);
  }
}
```

```html
<!-- components/todo-item/todo-item.component.html -->
<div class="view">
  <input
    class="toggle"
    type="checkbox"
    [checked]="todo.completed"
    (change)="toggle()"
  />
  <label (dblclick)="handleEdit()">
    {{ todo.title }}
  </label>
  <button class="destroy" (click)="destroy()"></button>
</div>
<input
  #editField
  class="edit"
  *ngIf="editing"
  [(ngModel)]="editText"
  (blur)="submit()"
  (keydown)="handleKeyDown($event)"
/>
```

```ts
// components/todo-footer/todo-footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants/constants';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  @Input() nowShowing!: string;
  @Input() activeCount!: number;
  @Input() completedCount!: number;
  @Output() clearCompleted = new EventEmitter<void>();
  @Output() showAll = new EventEmitter<void>();
  @Output() showActive = new EventEmitter<void>();
  @Output() showCompleted = new EventEmitter<void>();

  constructor(private utils: UtilsService) {}

  get activeTodoWord(): string {
    return this.utils.pluralize(this.activeCount, 'item');
  }
}
```

```html
<!-- components/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ activeCount }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a
        href="javascript:void(0)"
        [class.selected]="nowShowing === 'all'"
        (click)="showAll.emit()"
        >All</a
      >
    </li>
    <li>
      <a
        href="javascript:void(0)"
        [class.selected]="nowShowing === 'active'"
        (click)="showActive.emit()"
        >Active</a
      >
    </li>
    <li>
      <a
        href="javascript:void(0)"
        [class.selected]="nowShowing === 'completed'"
        (click)="showCompleted.emit()"
        >Completed</a
      >
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

```ts
// store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ checked: boolean }>());
export const toggle = createAction('[Todo] Toggle', props<{ todo: Todo }>());
export const destroy = createAction('[Todo] Destroy', props<{ todo: Todo }>());
export const save = createAction('[Todo] Save', props<{ todo: Todo; text: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
```

```ts
// store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import {
  loadTodosSuccess,
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
  setFilter
} from './todo.actions';
import { UtilsService } from '../services/utils.service';
import { ALL_TODOS } from '../constants/constants';

export interface TodoState {
  list: Todo[];
  filter: string;
}

const initialState: TodoState = {
  list: [],
  filter: ALL_TODOS
};

export const todoReducer = createReducer(
  initialState,
  on(loadTodosSuccess, (state, { todos }) => ({
    ...state,
    list: todos
  })),
  on(addTodo, (state, { title }) => {
    const utils = new UtilsService();
    const newTodo: Todo = {
      id: utils.uuid(),
      title,
      completed: false
    };
    return {
      ...state,
      list: [...state.list, newTodo]
    };
  }),
  on(toggleAll, (state, { checked }) => {
    const utils = new UtilsService();
    return {
      ...state,
      list: state.list.map((t) => utils.extend({}, t, { completed: checked }))
    };
  }),
  on(toggle, (state, { todo }) => {
    const utils = new UtilsService();
    return {
      ...state,
      list: state.list.map((t) =>
        t.id !== todo.id
          ? t
          : utils.extend({}, t, { completed: !t.completed })
      )
    };
  }),
  on(destroy, (state, { todo }) => ({
    ...state,
    list: state.list.filter((t) => t.id !== todo.id)
  })),
  on(save, (state, { todo, text }) => {
    const utils = new UtilsService();
    return {
      ...state,
      list: state.list.map((t) =>
        t.id !== todo.id
          ? t
          : utils.extend({}, t, { title: text })
      )
    };
  }),
  on(clearCompleted, (state) => ({
    ...state,
    list: state.list.filter((t) => !t.completed)
  })),
  on(setFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);
```

```ts
// store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants/constants';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  (state: TodoState) => {
    if (state.filter === ACTIVE_TODOS) {
      return state.list.filter((t) => !t.completed);
    } else if (state.filter === COMPLETED_TODOS) {
      return state.list.filter((t) => t.completed);
    } else {
      return state.list;
    }
  }
);

export const selectFilter = createSelector(
  selectTodoState,
  (state: TodoState) => state.filter
);

export const selectActiveCount = createSelector(
  selectTodoState,
  (state: TodoState) =>
    state.list.reduce((acc, todo) => (!todo.completed ? acc + 1 : acc), 0)
);

export const selectCompletedCount = createSelector(
  selectTodoState,
  (state: TodoState) =>
    state.list.reduce((acc, todo) => (todo.completed ? acc + 1 : acc), 0)
);
```

```ts
// store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UtilsService } from '../services/utils.service';
import {
  loadTodos,
  loadTodosSuccess,
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted
} from './todo.actions';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class TodoEffects {
  private readonly storageKey = 'angular-todos';

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      map(() => {
        const list = this.utils.store(this.storageKey) || [];
        return loadTodosSuccess({ todos: list });
      })
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTodo, toggleAll, toggle, destroy, save, clearCompleted),
        mergeMap((action) => {
          return new Promise<void>((resolve) => {
            const list = this.storeValue();
            this.utils.store(this.storageKey, list);
            resolve();
          });
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private utils: UtilsService) {}

  storeValue(): any {
    const stored = this.utils.store(this.storageKey);
    return stored || [];
  }
}
```
```markdown


### Tokens: {'input_tokens': 3268, 'output_tokens': 5525, 'reasoning_tokens': 1472}
### Execution time: 40.17637228965759
