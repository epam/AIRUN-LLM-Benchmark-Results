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
// src/app/constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

```typescript
// src/app/utils.ts
export class Utils {
  static uuid(): string {
    let i: number, random: number;
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

  static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  static store(namespace: string, data?: any): any {
    if (data) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  static extend(...objs: any[]): any {
    return Object.assign({}, ...objs);
  }
}
```

```typescript
// src/app/models/todo.model.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
```

```typescript
// src/app/store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { ITodo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);

export const toggle = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);

export const destroy = createAction(
  '[Todo] Destroy Todo',
  props<{ id: string }>()
);

export const save = createAction(
  '[Todo] Save Todo',
  props<{ id: string; title: string }>()
);

export const clearCompleted = createAction(
  '[Todo] Clear Completed'
);

export const loadTodos = createAction(
  '[Todo] Load Todos',
  props<{ todos: ITodo[] }>()
);
```

```typescript
// src/app/store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleAll, toggle, destroy, save, clearCompleted, loadTodos } from './todo.actions';
import { Utils } from '../utils';
import { ITodo } from '../models/todo.model';

export interface TodoState {
  todos: ITodo[];
}

export const initialState: TodoState = {
  todos: Utils.store('react-todos') as ITodo[]
};

export const todoReducer = createReducer(
  initialState,
  on(loadTodos, (state, { todos }) => ({ ...state, todos })),
  on(addTodo, (state, { title }) => {
    const newTodo: ITodo = {
      id: Utils.uuid(),
      title,
      completed: false
    };
    const updatedTodos = [...state.todos, newTodo];
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  }),
  on(toggleAll, (state, { completed }) => {
    const updatedTodos = state.todos.map(todo => ({ ...todo, completed }));
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  }),
  on(toggle, (state, { id }) => {
    const updatedTodos = state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  }),
  on(destroy, (state, { id }) => {
    const updatedTodos = state.todos.filter(todo => todo.id !== id);
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  }),
  on(save, (state, { id, title }) => {
    const updatedTodos = state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    );
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  }),
  on(clearCompleted, (state) => {
    const updatedTodos = state.todos.filter(todo => !todo.completed);
    Utils.store('react-todos', updatedTodos);
    return { ...state, todos: updatedTodos };
  })
);
```

```typescript
// src/app/store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectActiveTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos.filter(todo => todo.completed)
);

export const selectFilteredTodos = (filter: string) => createSelector(
  selectTodoState,
  (state: TodoState) => {
    switch (filter) {
      case ACTIVE_TODOS:
        return state.todos.filter(todo => !todo.completed);
      case COMPLETED_TODOS:
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }
);

export const selectActiveCount = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos.filter(todo => todo.completed).length
);
```

```typescript
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { AppComponent } from './app.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent },
];

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
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, toggleAll } from './store/todo.actions';
import { selectFilteredTodos } from './store/todo.selectors';
import { ALL_TODOS } from './constants';
import { Observable } from 'rxjs';
import { ITodo } from './models/todo.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newTodo: string = '';
  nowShowing: string = ALL_TODOS;
  filteredTodos$: Observable<ITodo[]>;

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.nowShowing = url.length && url[0].path || ALL_TODOS;
      this.filteredTodos$ = this.store.select(selectFilteredTodos(this.nowShowing));
    });
  }

  handleNewTodoKeyDown() {
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.store.dispatch(toggleAll({ completed: checked }));
  }
}
```

```html
<!-- src/app/app.component.html -->
<div class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input
      [(ngModel)]="newTodo"
      class="new-todo"
      placeholder="What needs to be done?"
      (keyup.enter)="handleNewTodoKeyDown()"
      autofocus
    />
  </header>
  <section class="main" *ngIf="(filteredTodos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      (change)="toggleAll($event)"
      [checked]="(store.select('todos') | async)?.todos.every(todo => todo.completed)"
    />
    <label for="toggle-all">
      Mark all as complete
    </label>
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of filteredTodos$ | async"
        [todo]="todo">
      </app-todo-item>
    </ul>
  </section>
  <app-todo-footer
    *ngIf="(store.select('todos') | async)?.todos.length"
    [nowShowing]="nowShowing">
  </app-todo-footer>
</div>
```

```typescript
// src/app/todo-footer/todo-footer.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCompleted } from '../store/todo.actions';
import { selectActiveCount, selectCompletedCount } from '../store/todo.selectors';
import { Observable } from 'rxjs';
import { Utils } from '../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
})
export class TodoFooterComponent {
  @Input() nowShowing: string;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  activeTodoWord$: Observable<string>;

  constructor(private store: Store) {
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
    this.activeTodoWord$ = this.activeCount$.pipe(
      map(count => Utils.pluralize(count, 'item'))
    );
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```html
<!-- src/app/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ activeCount$ | async }}</strong> {{ activeTodoWord$ | async }} left
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
    class="clear-completed"
    *ngIf="(completedCount$ | async) > 0"
    (click)="clearCompleted()">
    Clear completed
  </button>
</footer>
```

```typescript
// src/app/todo-item/todo-item.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggle, destroy, save } from '../store/todo.actions';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() todo: ITodo;
  @Input() editing: boolean;
  @Output() onCancel = new EventEmitter<void>();
  @ViewChild('editInput') editInput: ElementRef;

  editText: string = '';

  constructor(private store: Store) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing && changes.editing.currentValue) {
      this.editText = this.todo.title;
      setTimeout(() => {
        if (this.editInput) {
          this.editInput.nativeElement.focus();
          this.editInput.nativeElement.setSelectionRange(this.editText.length, this.editText.length);
        }
      }, 0);
    }
  }

  handleSubmit() {
    const val = this.editText.trim();
    if (val) {
      this.store.dispatch(save({ id: this.todo.id, title: val }));
    } else {
      this.store.dispatch(destroy({ id: this.todo.id }));
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.onCancel.emit();
      this.editText = this.todo.title;
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event: any) {
    this.editText = event.target.value;
  }

  toggleCompleted() {
    this.store.dispatch(toggle({ id: this.todo.id }));
  }

  destroyTodo() {
    this.store.dispatch(destroy({ id: this.todo.id }));
  }
}
```

```html
<!-- src/app/todo-item/todo-item.component.html -->
<li [ngClass]="{ completed: todo.completed, editing: editing }">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="toggleCompleted()"
    />
    <label (dblclick)="editing = true">
      {{ todo.title }}
    </label>
    <button class="destroy" (click)="destroyTodo()"></button>
  </div>
  <input
    #editInput
    class="edit"
    [(ngModel)]="editText"
    (blur)="handleSubmit()"
    (ngModelChange)="handleChange($event)"
    (keydown)="handleKeyDown($event)"
    *ngIf="editing"
  />
</li>
```

```css
/* src/app/app.component.css */
/* Add your styles here */
```

```css
/* src/app/todo-footer/todo-footer.component.css */
/* Add your styles here */
```

```css
/* src/app/todo-item/todo-item.component.css */
/* Add your styles here */
```

```typescript
// src/app/store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadTodos } from './todo.actions';
import { Utils } from '../utils';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App Init] Load Todos'),
      map(() => {
        const todos = Utils.store('react-todos') as ITodo[];
        return loadTodos({ todos });
      })
    )
  );

  constructor(private actions$: Actions) {}
}
```

```typescript
// src/app/app.component.ts (Updated to dispatch loadTodos on init)
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, toggleAll, loadTodos } from './store/todo.actions';
import { selectFilteredTodos } from './store/todo.selectors';
import { ALL_TODOS } from './constants';
import { Observable } from 'rxjs';
import { ITodo } from './models/todo.model';
import { ActivatedRoute } from '@angular/router';
import { Utils } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newTodo: string = '';
  nowShowing: string = ALL_TODOS;
  filteredTodos$: Observable<ITodo[]>;

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit() {
    const todos = Utils.store('react-todos') as ITodo[];
    this.store.dispatch(loadTodos({ todos }));

    this.route.url.subscribe(url => {
      this.nowShowing = url.length && url[0].path || ALL_TODOS;
      this.filteredTodos$ = this.store.select(selectFilteredTodos(this.nowShowing));
    });
  }

  handleNewTodoKeyDown() {
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.store.dispatch(toggleAll({ completed: checked }));
  }
}
```

```typescript
// src/app/store/index.ts
import { ActionReducerMap } from '@ngrx/store';
import { todoReducer, TodoState } from './todo.reducer';

export interface AppState {
  todos: TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: todoReducer,
};
```

```typescript
// src/app/store/todo.effects.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { TodoEffects } from './todo.effects';
import { loadTodos } from './todo.actions';
import { ITodo } from '../models/todo.model';
import { Utils } from '../utils';
import { hot, cold } from 'jasmine-marbles';

describe('TodoEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(TodoEffects);
  });

  it('should load todos', () => {
    const todos: ITodo[] = [
      { id: '1', title: 'Test Todo', completed: false },
    ];
    spyOn(Utils, 'store').and.returnValue(todos);

    const action = { type: '[App Init] Load Todos' };
    const outcome = loadTodos({ todos });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: outcome });

    expect(effects.loadTodos$).toBeObservable(expected);
  });
});
```

```json
// angular.json (Add necessary configurations if needed)
{
  ...
}
```

```json
// package.json (Add necessary dependencies)
{
  "dependencies": {
    "@angular/animations": "~14.0.0",
    "@angular/common": "~14.0.0",
    "@angular/compiler": "~14.0.0",
    "@angular/core": "~14.0.0",
    "@angular/forms": "~14.0.0",
    "@angular/platform-browser": "~14.0.0",
    "@angular/platform-browser-dynamic": "~14.0.0",
    "@angular/router": "~14.0.0",
    "@ngrx/effects": "^14.0.0",
    "@ngrx/store": "^14.0.0",
    "classnames": "^2.3.1",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
  },
  ...
}
```

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { provideStoreDevtools } from '@ngrx/store-devtools';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Angular TodoApp</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

```css
/* src/styles.css */
/* Add global styles here */
body {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  color: #4d4d4d;
  min-height: 100vh;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.todoapp {
  background: #fff;
  margin: 130px 0 40px 0;
  position: relative;
  box-shadow:
    0 2px 4px 0 rgba(0,0,0,0.2),
    0 25px 50px 0 rgba(0,0,0,0.1);
}
.header h1 {
  position: absolute;
  top: -155px;
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
}
.new-todo {
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0,0,0,0.003);
  box-sizing: border-box;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}
```

```typescript
// Additional files like environments.ts can be assumed to be present as per Angular standards.
```

### Tokens: {'input_tokens': 3368, 'output_tokens': 9210, 'reasoning_tokens': 4224}
### Execution time: 51.946666955947876
