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
// Angular 14.x Migration of React Todo Application

// 1. Project Setup and Basic Structure (Conceptual - you'd use Angular CLI)
// ng new angular-todo --style css --routing --stateManagement ngrx
// cd angular-todo
// ng g component todo-app
// ng g component todo-item
// ng g component todo-footer
// ng g service todo
// ng g module state --route state --module app --route-module app-routing.module

// 2. Install Dependencies (if not already included by Angular CLI with ngrx option)
// npm install @ngrx/store @ngrx/effects @ngrx/store-devtools classnames

// -----------------------------------------------------------------------------------------------------------------------
// constants.ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

// -----------------------------------------------------------------------------------------------------------------------
// utils.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  public uuid(): string {
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

  public pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  public store<T>(namespace: string, data?: T[]): T[] | void {
    if (data) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public extend<T, U>(obj1: T, obj2: U): T & U {
    const newObj: any = {};
    for (const key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        newObj[key] = (obj1 as any)[key];
      }
    }
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        newObj[key] = (obj2 as any)[key];
      }
    }
    return newObj as T & U;
  }
}

// -----------------------------------------------------------------------------------------------------------------------
// todo.model.ts (formerly todoModel.ts - but model.ts is Angular convention)
import { Injectable } from '@angular/core';
import { Utils } from './utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITodo } from './interfaces';

@Injectable({
  providedIn: 'root' // Making it root injectable for app-wide use, though NgRx will manage state centrally
})
export class TodoModel {
  private key = 'angular-todos'; // Fixed key, consider making configurable if needed
  private todos: ITodo[] = [];
  private todos$ = new BehaviorSubject<ITodo[]>([]); // Observable for todos

  constructor(private utils: Utils) {
    this.todos = this.utils.store<ITodo>(this.key) || [];
    this.todos$.next(this.todos); // Initialize observable with stored todos
  }

  getTodos(): Observable<ITodo[]> {
    return this.todos$.asObservable();
  }

  private updateStore(): void {
    this.utils.store(this.key, this.todos);
    this.todos$.next([...this.todos]); // Emit new array to trigger change detection
  }

  addTodo(title: string): void {
    const newTodo: ITodo = {
      id: this.utils.uuid(),
      title: title,
      completed: false
    };
    this.todos = [...this.todos, newTodo]; // Immutable update
    this.updateStore();
  }

  toggleAll(checked: boolean): void {
    this.todos = this.todos.map(todo => ({ ...todo, completed: checked })); // Immutable update
    this.updateStore();
  }

  toggle(todoToToggle: ITodo): void {
    this.todos = this.todos.map(todo =>
      todo.id === todoToToggle.id ? { ...todo, completed: !todo.completed } : todo
    ); // Immutable update
    this.updateStore();
  }

  destroy(todo: ITodo): void {
    this.todos = this.todos.filter(candidate => candidate.id !== todo.id); // Immutable update
    this.updateStore();
  }

  save(todoToSave: ITodo, text: string): void {
    this.todos = this.todos.map(todo =>
      todo.id === todoToSave.id ? { ...todo, title: text } : todo
    ); // Immutable update
    this.updateStore();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed); // Immutable update
    this.updateStore();
  }
}


// -----------------------------------------------------------------------------------------------------------------------
// interfaces.ts (For shared interfaces)
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface IAppProps { // While props are not directly used in Angular components in the same way, keeping for context from original React
  model: TodoModel;
}

export interface IAppState { // State will be managed by NgRx in Angular
  nowShowing: string;
  editing: string | null;
}

export interface ITodoItemProps { //  Props for TodoItem - will become @Input() in Angular
  todo: ITodo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: (event: any) => void;
}

export interface ITodoItemState { // State for TodoItem - Angular component state
  editText: string;
}

export interface ITodoFooterProps { // Props for TodoFooter - will become @Input() and @Output() in Angular
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}


// -----------------------------------------------------------------------------------------------------------------------
// State Management with NgRx (state/state.module.ts, state/todo.reducer.ts, state/todo.actions.ts, state/todo.selectors.ts)

// state/state.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todoReducer } from './todo.reducer';
import { TodoEffects } from './todo.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({ todosState: todoReducer }), // Register reducer
    EffectsModule.forRoot([TodoEffects]), // Register effects (if needed)
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }) // Devtools for debugging
  ]
})
export class StateModule { }


// state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ITodo } from '../interfaces';
import * as TodoActions from './todo.actions';
import { ALL_TODOS } from '../constants';

export interface TodoState {
  todos: ITodo[];
  nowShowing: string;
  editing: string | null;
}

export const initialState: TodoState = {
  todos: [],
  nowShowing: ALL_TODOS,
  editing: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos: todos })), // Load initial todos
  on(TodoActions.addTodoSuccess, (state, { todo }) => ({ ...state, todos: [...state.todos, todo] })),
  on(TodoActions.toggleAllSuccess, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: completed }))
  })),
  on(TodoActions.toggleTodoSuccess, (state, { todoId }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)
  })),
  on(TodoActions.destroyTodoSuccess, (state, { todoId }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== todoId)
  })),
  on(TodoActions.saveTodoSuccess, (state, { todoId, text }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === todoId ? { ...todo, title: text } : todo)
  })),
  on(TodoActions.clearCompletedSuccess, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.setNowShowing, (state, { nowShowing }) => ({ ...state, nowShowing })),
  on(TodoActions.setEditing, (state, { editing }) => ({ ...state, editing })),
);


// state/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { ITodo } from '../interfaces';

// Load Todos (Initial load - might use effects for initial load from local storage if needed)
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: ITodo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

// Add Todo
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: ITodo }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<{ error: any }>());

// Toggle All
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const toggleAllSuccess = createAction('[Todo] Toggle All Success', props<{ completed: boolean }>());
export const toggleAllFailure = createAction('[Todo] Toggle All Failure', props<{ error: any }>());

// Toggle Todo
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ todoId: string }>());
export const toggleTodoSuccess = createAction('[Todo] Toggle Todo Success', props<{ todoId: string }>());
export const toggleTodoFailure = createAction('[Todo] Toggle Todo Failure', props<{ error: any }>());

// Destroy Todo
export const destroyTodo = createAction('[Todo] Destroy Todo', props<{ todoId: string }>());
export const destroyTodoSuccess = createAction('[Todo] Destroy Todo Success', props<{ todoId: string }>());
export const destroyTodoFailure = createAction('[Todo] Destroy Todo Failure', props<{ error: any }>());

// Save Todo
export const saveTodo = createAction('[Todo] Save Todo', props<{ todoId: string, text: string }>());
export const saveTodoSuccess = createAction('[Todo] Save Todo Success', props<{ todoId: string, text: string }>());
export const saveTodoFailure = createAction('[Todo] Save Todo Failure', props<{ error: any }>());

// Clear Completed
export const clearCompleted = createAction('[Todo] Clear Completed');
export const clearCompletedSuccess = createAction('[Todo] Clear Completed Success');
export const clearCompletedFailure = createAction('[Todo] Clear Completed Failure', props<{ error: any }>());

// UI State Actions
export const setNowShowing = createAction('[Todo] Set Now Showing', props<{ nowShowing: string }>());
export const setEditing = createAction('[Todo] Set Editing', props<{ editing: string | null }>());


// state/todo.effects.ts (Example of effects - for simple local storage, reducers might be enough, but showing for completeness)
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { TodoModel } from '../todo.model';
import { ITodo } from '../interfaces';

@Injectable()
export class TodoEffects {
  private key = 'angular-todos'; // Key for local storage

  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    map(() => {
      const todos = this.todoModel.getTodosFromStore(); // Assuming getTodosFromStore in TodoModel
      return TodoActions.loadTodosSuccess({ todos });
    }),
    catchError(error => of(TodoActions.loadTodosFailure({ error })))
  ));

  addTodo$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.addTodo),
    map(action => {
      const newTodo = this.todoModel.addTodoToStore(action.title); // Assuming addTodoToStore in TodoModel returns new todo
      return TodoActions.addTodoSuccess({ todo: newTodo });
    }),
    catchError(error => of(TodoActions.addTodoFailure({ error })))
  ));

  toggleAll$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.toggleAll),
    map(action => {
      this.todoModel.toggleAllInStore(action.completed); // Assuming toggleAllInStore in TodoModel updates store
      return TodoActions.toggleAllSuccess({ completed: action.completed });
    }),
    catchError(error => of(TodoActions.toggleAllFailure({ error })))
  ));

  toggleTodo$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.toggleTodo),
    map(action => {
      this.todoModel.toggleTodoInStore(action.todoId); // Assuming toggleTodoInStore in TodoModel updates store
      return TodoActions.toggleTodoSuccess({ todoId: action.todoId });
    }),
    catchError(error => of(TodoActions.toggleTodoFailure({ error })))
  ));

  destroyTodo$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.destroyTodo),
    map(action => {
      this.todoModel.destroyTodoFromStore(action.todoId); // Assuming destroyTodoFromStore in TodoModel updates store
      return TodoActions.destroyTodoSuccess({ todoId: action.todoId });
    }),
    catchError(error => of(TodoActions.destroyTodoFailure({ error })))
  ));

  saveTodo$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.saveTodo),
    map(action => {
      this.todoModel.saveTodoInStore(action.todoId, action.text); // Assuming saveTodoInStore in TodoModel updates store
      return TodoActions.saveTodoSuccess({ todoId: action.todoId, text: action.text });
    }),
    catchError(error => of(TodoActions.saveTodoFailure({ error })))
  ));

  clearCompleted$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.clearCompleted),
    map(() => {
      this.todoModel.clearCompletedInStore(); // Assuming clearCompletedInStore in TodoModel updates store
      return TodoActions.clearCompletedSuccess();
    }),
    catchError(error => of(TodoActions.clearCompletedFailure({ error })))
  ));


  constructor(private actions$: Actions, private todoModel: TodoModel) {}
}


// state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodoState = createFeatureSelector<TodoState>('todosState'); // Feature selector for 'todosState' slice

export const selectTodos = createSelector(selectTodoState, (state) => state.todos);
export const selectNowShowing = createSelector(selectTodoState, (state) => state.nowShowing);
export const selectEditingTodoId = createSelector(selectTodoState, (state) => state.editing);

export const selectVisibleTodos = createSelector(
  selectTodos,
  selectNowShowing,
  (todos, nowShowing) => {
    return todos.filter(todo => {
      switch (nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }
);

export const selectActiveTodoCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => todo.completed).length
);


// -----------------------------------------------------------------------------------------------------------------------
// Angular Components

// todo-app.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TodoModel } from '../todo.model';
import { ITodo, IAppState } from '../interfaces';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from '../constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as TodoActions from '../state/todo.actions';
import { selectVisibleTodos, selectNowShowing, selectActiveTodoCount, selectCompletedCount, TodoState } from '../state/todo.reducer';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  @ViewChild('newField') newField!: ElementRef;

  todos$: Observable<ITodo[]> = this.store.select(selectVisibleTodos);
  nowShowing$: Observable<string> = this.store.select(selectNowShowing);
  activeTodoCount$: Observable<number> = this.store.select(selectActiveTodoCount);
  completedCount$: Observable<number> = this.store.select(selectCompletedCount);

  private routerSubscription!: Subscription;

  constructor(
    private todoModel: TodoModel,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ todosState: TodoState }> // Specify the state slice type
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.route.url.subscribe(url => {
      let nowShowing = ALL_TODOS;
      if (url.toString() === 'active') {
        nowShowing = ACTIVE_TODOS;
      } else if (url.toString() === 'completed') {
        nowShowing = COMPLETED_TODOS;
      }
      this.store.dispatch(TodoActions.setNowShowing({ nowShowing }));
    });
    this.store.dispatch(TodoActions.loadTodos()); // Load initial todos (if using effects for initial load)
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleNewTodoKeyDown(event: KeyboardEvent): void {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const inputElement = this.newField.nativeElement as HTMLInputElement;
    const val = inputElement.value.trim();
    if (val) {
      this.store.dispatch(TodoActions.addTodo({ title: val }));
      inputElement.value = '';
    }
  }

  toggleAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.store.dispatch(TodoActions.toggleAll({ completed: checked }));
  }

  toggleTodo(todo: ITodo): void {
    this.store.dispatch(TodoActions.toggleTodo({ todoId: todo.id }));
  }

  destroyTodo(todo: ITodo): void {
    this.store.dispatch(TodoActions.destroyTodo({ todoId: todo.id }));
  }

  editTodo(todo: ITodo): void {
    this.store.dispatch(TodoActions.setEditing({ editing: todo.id }));
  }

  saveTodo(todo: ITodo, text: string): void {
    this.store.dispatch(TodoActions.saveTodo({ todoId: todo.id, text: text }));
    this.store.dispatch(TodoActions.setEditing({ editing: null }));
  }

  cancelEditing(): void {
    this.store.dispatch(TodoActions.setEditing({ editing: null }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}


// todo-item.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ITodo, ITodoItemProps, ITodoItemState } from '../interfaces';
import { classNames } from 'classnames/index';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { Store } from '@ngrx/store';
import * as TodoActions from '../state/todo.actions';
import { selectEditingTodoId, TodoState } from '../state/todo.reducer';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimized change detection
})
export class TodoItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() todo!: ITodo;
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDestroy = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('editField') editField!: ElementRef;

  editText!: string;
  editingTodoId$: Observable<string | null> = this.store.select(selectEditingTodoId);
  isEditing!: boolean;
  editingSubscription!: Subscription;

  constructor(private store: Store<{ todosState: TodoState }>) { }

  ngOnInit(): void {
    this.editText = this.todo.title;
    this.editingSubscription = this.editingTodoId$.subscribe(editingId => {
      this.isEditing = editingId === this.todo.id;
      if (this.isEditing) {
        setTimeout(() => { // Ensure DOM is updated before focusing
          if (this.editField) {
            const node = this.editField.nativeElement as HTMLInputElement;
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
          }
        }, 0);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && !changes['todo'].firstChange) {
      this.editText = this.todo.title; // Update editText when todo prop changes
    }
  }

  ngOnDestroy(): void {
    if (this.editingSubscription) {
      this.editingSubscription.unsubscribe();
    }
  }

  handleSubmit(event?: Event): void {
    const val = this.editText.trim();
    if (val) {
      this.store.dispatch(TodoActions.saveTodo({ todoId: this.todo.id, text: val }));
      this.store.dispatch(TodoActions.setEditing({ editing: null })); // Exit editing mode after save
    } else {
      this.store.dispatch(TodoActions.destroyTodo({ todoId: this.todo.id }));
    }
  }

  handleEdit(): void {
    this.store.dispatch(TodoActions.setEditing({ editing: this.todo.id }));
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.store.dispatch(TodoActions.setEditing({ editing: null })); // Cancel editing
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.editText = inputElement.value;
  }

  getClassNames(): any {
    return classNames({
      completed: this.todo.completed,
      editing: this.isEditing
    });
  }

  onToggleTodo(): void {
    this.store.dispatch(TodoActions.toggleTodo({ todoId: this.todo.id }));
  }

  onDestroyTodo(): void {
    this.store.dispatch(TodoActions.destroyTodo({ todoId: this.todo.id }));
  }
}


// todo-footer.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ITodoFooterProps } from '../interfaces';
import { classNames } from 'classnames/index';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { Utils } from '../utils';
import { Store } from '@ngrx/store';
import * as TodoActions from '../state/todo.actions';
import { selectNowShowing, selectActiveTodoCount, selectCompletedCount, TodoState } from '../state/todo.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimized change detection
})
export class TodoFooterComponent {
  @Output() onClearCompleted = new EventEmitter<void>();

  activeTodoWord!: string;
  clearButtonVisible!: boolean;
  nowShowing$: Observable<string> = this.store.select(selectNowShowing);
  activeTodoCount$: Observable<number> = this.store.select(selectActiveTodoCount);
  completedCount$: Observable<number> = this.store.select(selectCompletedCount);


  ALL_TODOS = ALL_TODOS;
  ACTIVE_TODOS = ACTIVE_TODOS;
  COMPLETED_TODOS = COMPLETED_TODOS;

  constructor(private utils: Utils, private store: Store<{ todosState: TodoState }>) { }

  ngOnInit(): void {
    this.activeTodoCount$.subscribe(count => {
      this.activeTodoWord = this.utils.pluralize(count, 'item');
    });
    this.completedCount$.subscribe(completedCount => {
      this.clearButtonVisible = completedCount > 0;
    });
  }


  handleClearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  getFilterClass(filter: string): any {
    return this.nowShowing$.pipe(map(nowShowing => classNames({ selected: nowShowing === filter })));
  }
}


// -----------------------------------------------------------------------------------------------------------------------
// app.component.ts (Main App Component - Router Outlet will be here)
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-todo';
}


// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppComponent } from './todo-app/todo-app.component';

const routes: Routes = [
  { path: '', component: TodoAppComponent, pathMatch: 'full' },
  { path: 'active', component: TodoAppComponent },
  { path: 'completed', component: TodoAppComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown routes to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoAppComponent } from './todo-app/todo-app.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { FormsModule } from '@angular/forms';
import { StateModule } from './state/state.module';
import { Utils } from './utils';
import { TodoModel } from './todo.model';

@NgModule({
  declarations: [
    AppComponent,
    TodoAppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StateModule // Import NgRx State Module
  ],
  providers: [

### Tokens: {'input_tokens': 4088, 'output_tokens': 7040}
### Execution time: 34.73809003829956
