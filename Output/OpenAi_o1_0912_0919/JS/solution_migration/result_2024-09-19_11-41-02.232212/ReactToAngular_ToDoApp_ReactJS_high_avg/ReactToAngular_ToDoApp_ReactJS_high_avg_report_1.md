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
```typescript
// constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```typescript
// todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

```typescript
// utils.ts
export class Utils {
  static uuid(): string {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if ([8, 12, 16, 20].includes(i)) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }
    return uuid;
  }

  static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }
}
```

```typescript
// todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const loadTodos = createAction('[Todo Page] Load Todos');
export const loadTodosSuccess = createAction('[Todo API] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction('[Todo Page] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction('[Todo Page] Toggle Todo',
  props<{ todoId: string }>()
);

export const toggleAllTodos = createAction('[Todo Page] Toggle All Todos',
  props<{ completed: boolean }>()
);

export const deleteTodo = createAction('[Todo Page] Delete Todo',
  props<{ todoId: string }>()
);

export const editTodo = createAction('[Todo Page] Edit Todo',
  props<{ todoId: string, title: string }>()
);

export const clearCompleted = createAction('[Todo Page] Clear Completed');
```

```typescript
// todo.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Todo } from './todo.model';
import * as TodoActions from './todo.actions';
import { Utils } from './utils';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: Utils.store('angular-todos'),
};

const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => {
    const todo: Todo = { id: Utils.uuid(), title, completed: false };
    const todos = [...state.todos, todo];
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  }),
  on(TodoActions.toggleTodo, (state, { todoId }) => {
    const todos = state.todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  }),
  on(TodoActions.toggleAllTodos, (state, { completed }) => {
    const todos = state.todos.map(todo => ({ ...todo, completed }));
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  }),
  on(TodoActions.deleteTodo, (state, { todoId }) => {
    const todos = state.todos.filter(todo => todo.id !== todoId);
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  }),
  on(TodoActions.editTodo, (state, { todoId, title }) => {
    const todos = state.todos.map(todo =>
      todo.id === todoId ? { ...todo, title } : todo
    );
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  }),
  on(TodoActions.clearCompleted, (state) => {
    const todos = state.todos.filter(todo => !todo.completed);
    Utils.store('angular-todos', todos);
    return { ...state, todos };
  })
);

export function reducer(state: TodoState | undefined, action: Action) {
  return todoReducer(state, action);
}
```

```typescript
// todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => todo.completed)
);
```

```typescript
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer as todoReducer } from './todo.reducer';
import { AppComponent } from './app.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TodoFooterComponent,
    TodoItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    RouterModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

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

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from './todo.model';
import { Observable } from 'rxjs';
import { selectAllTodos, selectActiveTodos, selectCompletedTodos } from './todo.selectors';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { addTodo, toggleAllTodos, clearCompleted } from './todo.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  todos$: Observable<Todo[]>;
  nowShowing: string = ALL_TODOS;
  newTodoTitle: string = '';
  editingTodoId: string | null = null;

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      const path = url[0] ? url[0].path : '';
      switch (path) {
        case 'active':
          this.nowShowing = ACTIVE_TODOS;
          this.todos$ = this.store.select(selectActiveTodos);
          break;
        case 'completed':
          this.nowShowing = COMPLETED_TODOS;
          this.todos$ = this.store.select(selectCompletedTodos);
          break;
        default:
          this.nowShowing = ALL_TODOS;
          this.todos$ = this.store.select(selectAllTodos);
          break;
      }
    });
  }

  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.newTodoTitle.trim();

    if (val) {
      this.store.dispatch(addTodo({ title: val }));
      this.newTodoTitle = '';
    }
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(toggleAllTodos({ completed: checked }));
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
      [(ngModel)]="newTodoTitle"
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
      [checked]="(todos$ | async)?.length && ((todos$ | async)?.filter(todo => !todo.completed).length === 0)"
    />
    <label for="toggle-all">
      Mark all as complete
    </label>
    <ul class="todo-list">
      <app-todo-item *ngFor="let todo of todos$ | async"
        [todo]="todo"
      ></app-todo-item>
    </ul>
  </section>
  <app-todo-footer *ngIf="(todos$ | async)?.length"
    [todos]="todos$ | async"
    [nowShowing]="nowShowing"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```

```typescript
// todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Todo } from '../todo.model';
import { Store } from '@ngrx/store';
import { toggleTodo, deleteTodo, editTodo } from '../todo.actions';
import { ESCAPE_KEY, ENTER_KEY } from '../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {

  @Input() todo: Todo;

  editText: string;
  editing: boolean = false;

  constructor(private store: Store) { }

  handleToggle() {
    this.store.dispatch(toggleTodo({ todoId: this.todo.id }));
  }

  handleDestroy() {
    this.store.dispatch(deleteTodo({ todoId: this.todo.id }));
  }

  handleEdit() {
    this.editText = this.todo.title;
    this.editing = true;
  }

  handleSubmit() {
    const val = this.editText.trim();
    if (val) {
      this.store.dispatch(editTodo({ todoId: this.todo.id, title: val }));
      this.editing = false;
    } else {
      this.handleDestroy();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.editing = false;
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
}
```

```html
<!-- todo-item.component.html -->
<li [ngClass]="{ completed: todo.completed, editing: editing }">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="handleToggle()">
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="handleDestroy()"></button>
  </div>
  <input class="edit"
    *ngIf="editing"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (keydown)="handleKeyDown($event)"
  >
</li>
```

```typescript
// todo-footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../todo.model';
import { Utils } from '../utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
})
export class TodoFooterComponent {

  @Input() todos: Todo[];
  @Input() nowShowing: string;

  @Output() clearCompleted = new EventEmitter<void>();

  constructor() { }

  get activeTodoCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get completedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  pluralize(count: number, word: string): string {
    return Utils.pluralize(count, word);
  }

  handleClearCompleted() {
    this.clearCompleted.emit();
  }
}
```

```html
<!-- todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ activeTodoCount }}</strong> {{ pluralize(activeTodoCount, 'item') }} left
  </span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/']"
         [ngClass]="{ selected: nowShowing === 'all' }">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']"
         [ngClass]="{ selected: nowShowing === 'active' }">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']"
         [ngClass]="{ selected: nowShowing === 'completed' }">Completed</a>
    </li>
  </ul>
  <button *ngIf="completedCount > 0"
    class="clear-completed"
    (click)="handleClearCompleted()">
    Clear completed
  </button>
</footer>
```

### Tokens: {'input_tokens': 3368, 'output_tokens': 12629, 'reasoning_tokens': 9536}
### Execution time: 133.55788278579712
