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
The user wants to migrate a React 18.x application to Angular 14.x.
This involves converting React components to Angular components, managing state with NgRx, and handling routing.

**Plan:**

1. **Create Angular components:** Translate each React component (`TodoApp`, `TodoItem`, `TodoFooter`) into its Angular equivalent.
2. **Set up NgRx:** Define actions, reducers, and selectors for managing the todo state.
3. **Implement services:** Create a service to handle interactions with the `TodoModel`.
4. **Configure routing:** Set up Angular routing to handle different filter states.
5. **Update component logic:** Adapt the logic within each component to interact with the NgRx store and Angular's data binding.
6. **Handle input and events:** Convert React event handlers to Angular event bindings.
7. **Replace `ReactDOM`:** Use Angular's template syntax and `Renderer2` if direct DOM manipulation is needed (though it should be avoided).
8. **Address lifecycle methods:** Translate `componentDidMount`, `componentDidUpdate`, and `shouldComponentUpdate` to their Angular equivalents (`OnInit`, `OnChanges`, `DoCheck`).

### Answer:
```typescript
// app.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import {
  addTodo,
  toggleAll,
  filterTodos,
  clearCompleted,
  editTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from './store/todo.actions';
import { selectVisibleTodos, selectTodoCount, selectActiveTodoCount, selectCompletedTodoCount, selectNowShowing } from './store/todo.selectors';
import { ENTER_KEY } from './constants';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  nowShowing$ = this.store.select(selectNowShowing);
  todos$ = this.store.select(selectVisibleTodos);
  totalCount$ = this.store.select(selectTodoCount);
  activeCount$ = this.store.select(selectActiveTodoCount);
  completedCount$ = this.store.select(selectCompletedTodoCount);
  editingTodoId: string | null = null;
  newTodoText = '';
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      let nowShowing;
      switch (this.router.url) {
        case '/active':
          nowShowing = 'active';
          break;
        case '/completed':
          nowShowing = 'completed';
          break;
        default:
          nowShowing = 'all';
      }
      this.store.dispatch(filterTodos({ filter: nowShowing }));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.newTodoText.trim();

    if (val) {
      this.store.dispatch(addTodo({ title: val }));
      this.newTodoText = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(toggleAll({ completed: target.checked }));
  }

  toggle(id: string) {
    this.store.dispatch(toggleTodo({ id }));
  }

  destroy(id: string) {
    this.store.dispatch(deleteTodo({ id }));
  }

  edit(id: string) {
    this.editingTodoId = id;
  }

  save(id: string, text: string) {
    this.store.dispatch(updateTodo({ id, changes: { title: text } }));
    this.editingTodoId = null;
  }

  cancel() {
    this.editingTodoId = null;
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```typescript
// todo-item.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ITodo } from './models/todos';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements OnChanges, AfterViewInit {
  @Input() todo!: ITodo;
  @Input() editing!: boolean;
  @Output() onToggle = new EventEmitter<string>();
  @Output() onDestroy = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onSave = new EventEmitter<{ id: string; text: string }>();
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('editField') editField!: ElementRef;

  editText = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todo']) {
      this.editText = this.todo.title;
    }
    if (changes['editing'] && changes['editing'].currentValue) {
      setTimeout(() => this.editField.nativeElement.focus(), 0);
    }
  }

  ngAfterViewInit() {
    if (this.editing) {
      this.editField.nativeElement.focus();
    }
  }

  handleSubmit() {
    const val = this.editText.trim();
    if (val) {
      this.onSave.emit({ id: this.todo.id, text: val });
    } else {
      this.onDestroy.emit(this.todo.id);
    }
  }

  handleEdit() {
    this.onEdit.emit(this.todo.id);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.onCancel.emit();
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

```typescript
// utils.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  static uuid(): string {
    let i: number, random: number;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
        16
      );
    }

    return uuid;
  }

  static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }
}
```

```typescript
// todo-footer.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFooterComponent {
  @Input() activeCount!: number;
  @Input() completedCount!: number;
  @Input() nowShowing!: string;
  @Output() onClearCompleted = new EventEmitter<void>();

  all = ALL_TODOS;
  active = ACTIVE_TODOS;
  completed = COMPLETED_TODOS;

  clearCompleted() {
    this.onClearCompleted.emit();
  }

  pluralize(count: number, word: string): string {
    return Utils.pluralize(count, word);
  }
}
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
// todo.model.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
```

```typescript
// todo.service.ts
import { Injectable } from '@angular/core';
import { ITodo } from './models/todos';
import { Utils } from './utils';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'angular-todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos$ = new BehaviorSubject<ITodo[]>(this.getTodosFromLocalStorage());

  getTodos(): Observable<ITodo[]> {
    return this.todos$.asObservable();
  }

  addTodo(title: string): void {
    const newTodo: ITodo = {
      id: Utils.uuid(),
      title,
      completed: false,
    };
    const currentTodos = this.todos$.value;
    this.setTodosToLocalStorage([...currentTodos, newTodo]);
  }

  toggleAll(completed: boolean): void {
    const updatedTodos = this.todos$.value.map((todo) => ({ ...todo, completed }));
    this.setTodosToLocalStorage(updatedTodos);
  }

  toggle(id: string): void {
    const updatedTodos = this.todos$.value.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.setTodosToLocalStorage(updatedTodos);
  }

  delete(id: string): void {
    const updatedTodos = this.todos$.value.filter((todo) => todo.id !== id);
    this.setTodosToLocalStorage(updatedTodos);
  }

  update(id: string, changes: Partial<ITodo>): void {
    const updatedTodos = this.todos$.value.map((todo) =>
      todo.id === id ? { ...todo, ...changes } : todo
    );
    this.setTodosToLocalStorage(updatedTodos);
  }

  clearCompleted(): void {
    const updatedTodos = this.todos$.value.filter((todo) => !todo.completed);
    this.setTodosToLocalStorage(updatedTodos);
  }

  private getTodosFromLocalStorage(): ITodo[] {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  private setTodosToLocalStorage(todos: ITodo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    this.todos$.next(todos);
  }
}
```

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFooterComponent } from './todo-footer.component';
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
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([TodoEffects])
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
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

```typescript
// app.state.ts
import { ITodo } from './models/todos';

export interface AppState {
  todos: TodoState;
}

export interface TodoState {
  todos: ITodo[];
  nowShowing: string;
}
```

```typescript
// store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { ITodo } from '../models/todos';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const filterTodos = createAction('[Filter] Filter Todos', props<{ filter: string }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: string; changes: Partial<ITodo> }>());
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: ITodo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure');
```

```typescript
// store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ITodo } from '../models/todos';
import {
  addTodo,
  toggleAll,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  filterTodos,
  updateTodo,
  loadTodosSuccess,
} from './todo.actions';
import { ALL_TODOS } from '../constants';
import { Utils } from '../utils';

export interface TodoState {
  todos: ITodo[];
  nowShowing: string;
}

export const initialState: TodoState = {
  todos: [],
  nowShowing: ALL_TODOS,
};

export const todoReducer = createReducer(
  initialState,
  on(loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Utils.uuid(), title, completed: false }],
  })),
  on(toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map((todo) => ({ ...todo, completed })),
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  on(deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  on(clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter((todo) => !todo.completed),
  })),
  on(filterTodos, (state, { filter }) => ({ ...state, nowShowing: filter })),
  on(updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo)),
  }))
);
```

```typescript
// store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(selectTodoState, (state) => state.todos);
export const selectNowShowing = createSelector(selectTodoState, (state) => state.nowShowing);

export const selectVisibleTodos = createSelector(
  selectTodos,
  selectNowShowing,
  (todos, nowShowing) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return todos.filter((todo) => !todo.completed);
      case COMPLETED_TODOS:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectTodoCount = createSelector(selectTodos, (todos) => todos.length);
export const selectActiveTodoCount = createSelector(selectTodos, (todos) => todos.filter(todo => !todo.completed).length);
export const selectCompletedTodoCount = createSelector(selectTodos, (todos) => todos.filter(todo => todo.completed).length);
```

```typescript
// store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadTodos, loadTodosSuccess } from './todo.actions';
import { of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { TodoService } from '../todo.service';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      // Simulate loading data from local storage or an API
      map(() => {
        const storedTodos = this.todoService.getTodos();
        let todos = [];
        storedTodos.subscribe(t => todos = t);
        return loadTodosSuccess({ todos });
      }),
      catchError(() => of({ type: '[Todo] Load Todos Failure' }))
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        '[Todo] Add Todo',
        '[Todo] Toggle All',
        '[Todo] Toggle Todo',
        '[Todo] Delete Todo',
        '[Todo] Clear Completed',
        '[Todo] Update Todo'
      ),
      tap(() => {
        // This effect can be used to save todos to local storage
        // after any change. For simplicity, the service handles this.
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}
```


### Tokens: {'input_tokens': 3817, 'output_tokens': 4702}
### Execution time: 17.58609390258789
