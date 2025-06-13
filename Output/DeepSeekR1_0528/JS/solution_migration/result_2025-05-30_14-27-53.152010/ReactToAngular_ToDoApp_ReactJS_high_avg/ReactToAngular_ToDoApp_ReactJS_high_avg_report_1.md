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
### Thoughts:
We are migrating a React application to Angular 14. The application is a TodoMVC app.

Steps:
1. We'll set up the Angular project structure.
2. We'll use NgRx for state management.
3. We'll create components for TodoApp, TodoItem, TodoFooter, and any other necessary components.
4. We'll create services to handle the business logic (like the TodoModel in React).
5. We'll set up routing for the different views (all, active, completed).

Let's break down the migration:

## 1. Project Structure

We'll have:
- app.module.ts: Main module.
- app-routing.module.ts: Routing configuration.
- components:
   - todo-app.component.ts (the main component)
   - todo-item.component.ts
   - todo-footer.component.ts
- store:
   - actions/todo.actions.ts
   - reducers/todo.reducer.ts
   - effects/todo.effects.ts
   - selectors/todo.selectors.ts
- models:
   - todo.model.ts (define the Todo interface and the AppState)
- services:
   - todo.service.ts (to handle the business logic and storage)

## 2. State Management with NgRx

We'll model the state after the React state and the TodoModel.

The state should have:
- todos: an array of Todo items.
- nowShowing: which can be 'all', 'active', or 'completed'

We'll create actions for:
- addTodo
- toggleAll
- toggle
- destroy
- save (update)
- clearCompleted
- setVisibilityFilter (to set nowShowing)

We'll also have an effect to persist the todos to localStorage (like the React model did).

## 3. Converting Components

### TodoApp (main component) becomes TodoAppComponent

In Angular, we'll set up the component with:
- The template (HTML) for the main view.
- Using the store to get the state and dispatch actions.

### TodoItemComponent

We'll have:
- @Input() for the todo item.
- @Output() for events (toggle, destroy, save, cancel edit).

### TodoFooterComponent

- @Input() for count, completedCount, nowShowing.
- @Output() for clearCompleted.

## 4. Services

We'll create a TodoService to handle:
- The storage (using localStorage, like the Utils.store).
- We might not need the service for the storage if we handle it in an effect, but we can use it for the UUID and pluralize.

Alternatively, we can create a separate service for localStorage and use it in the effect.

## 5. Routing

We'll set up routes for:
- /: showing all
- /active: active
- /completed: completed

We'll use the router to set the nowShowing state.

## 6. Detailed Steps

### Step 1: Define the Todo model

Create `todo.model.ts`:

```ts
// models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const enum VisibilityFilter {
  SHOW_ALL = 'all',
  SHOW_ACTIVE = 'active',
  SHOW_COMPLETED = 'completed'
}

export interface AppState {
  todos: Todo[];
  visibilityFilter: VisibilityFilter;
}
```

### Step 2: Set up the actions

Create `store/actions/todo.actions.ts`:

```ts
import { createAction, props } from '@ngrx/store';
import { Todo, VisibilityFilter } from '../models/todo.model';

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
  props<{ id: string, title: string }>()
);

export const clearCompleted = createAction(
  '[Todo] Clear Completed'
);

export const setVisibilityFilter = createAction(
  '[Todo] Set Visibility Filter',
  props<{ filter: VisibilityFilter }>()
);
```

### Step 3: Create the reducer

Create `store/reducers/todo.reducer.ts`:

```ts
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo.actions';
import { Todo, VisibilityFilter, AppState } from '../models/todo.model';

export const initialState: AppState = {
  todos: [],
  visibilityFilter: VisibilityFilter.SHOW_ALL
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9), // simple id generation, but we can use a service for UUID
      title,
      completed: false
    };
    return {
      ...state,
      todos: [...state.todos, newTodo]
    };
  }),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.toggle, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.destroy, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.save, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.setVisibilityFilter, (state, { filter }) => ({
    ...state,
    visibilityFilter: filter
  }))
);
```

### Step 4: Create selectors

Create `store/selectors/todo.selectors.ts`:

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, Todo, VisibilityFilter } from '../models/todo.model';

export const selectTodoState = createFeatureSelector<AppState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectVisibilityFilter = createSelector(
  selectTodoState,
  (state) => state.visibilityFilter
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectVisibilityFilter,
  (todos, visibilityFilter) => {
    switch (visibilityFilter) {
      case VisibilityFilter.SHOW_ACTIVE:
        return todos.filter(todo => !todo.completed);
      case VisibilityFilter.SHOW_COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => todo.completed).length
);
```

### Step 5: Create an effect for persistence

We want to persist the todos to localStorage whenever they change.

Create `store/effects/todo.effects.ts`:

```ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppState } from '../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleAll,
        TodoActions.toggle,
        TodoActions.destroy,
        TodoActions.save,
        TodoActions.clearCompleted
      ),
      tap(() => {
        // We'll get the current state and save the todos to localStorage
        const state = this.store.select(state => state.todos) as any; // We assume the state structure
        state.subscribe((appState: AppState) => {
          localStorage.setItem('todos-angular', JSON.stringify(appState.todos));
        });
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<{ todos: AppState }>) {}
}
```

Note: We are storing only the todos array. We are not storing the visibilityFilter.

Also, we need to load the initial state from localStorage when the app starts.

We can handle that in the reducer by adding an initial state loaded from localStorage.

Let's adjust the initial state:

In `todo.reducer.ts`:

```ts
// ... other imports
import { Todo } from '../models/todo.model';

function loadInitialState(): AppState {
  const storedTodos = localStorage.getItem('todos-angular');
  return {
    todos: storedTodos ? JSON.parse(storedTodos) : [],
    visibilityFilter: VisibilityFilter.SHOW_ALL
  };
}

export const initialState: AppState = loadInitialState();
```

### Step 6: Create the TodoService

We'll create a service for utility functions (UUID, pluralize, etc.). We don't need to put the store logic in the service because we are using NgRx.

Create `services/todo.service.ts`:

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

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
}
```

### Step 7: Set up the main module and routing

Create `app.module.ts`:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { todoReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  { path: 'all', component: AppComponent },
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
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Note: We are routing to the same AppComponent for all routes. We will handle the route changes in the component to dispatch the setVisibilityFilter action.

### Step 8: Create the main component (TodoAppComponent)

We'll convert the React `TodoApp` to Angular.

In `app.component.ts`:

```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, Todo, VisibilityFilter } from './store/models/todo.model';
import { selectFilteredTodos, selectActiveCount, selectCompletedCount, selectVisibilityFilter } from './store/selectors/todo.selectors';
import * as TodoActions from './store/actions/todo.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  visibilityFilter$: Observable<VisibilityFilter>;
  editing: string | null = null;

  constructor(private store: Store<{ todos: AppState }>, private router: Router) {
    this.todos$ = store.select(selectFilteredTodos);
    this.activeCount$ = store.select(selectActiveCount);
    this.completedCount$ = store.select(selectCompletedCount);
    this.visibilityFilter$ = store.select(selectVisibilityFilter);
  }

  ngOnInit() {
    // Set up routing
    this.router.events.subscribe(() => {
      const url = this.router.url;
      let filter: VisibilityFilter;
      if (url.includes('/active')) {
        filter = VisibilityFilter.SHOW_ACTIVE;
      } else if (url.includes('/completed')) {
        filter = VisibilityFilter.SHOW_COMPLETED;
      } else {
        filter = VisibilityFilter.SHOW_ALL;
      }
      this.store.dispatch(TodoActions.setVisibilityFilter({ filter }));
    });
  }

  handleNewTodoKeyDown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    const val = input.value.trim();
    if (val) {
      this.store.dispatch(TodoActions.addTodo({ title: val }));
      input.value = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(TodoActions.toggleAll({ completed: target.checked }));
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  setEditing(id: string) {
    this.editing = id;
  }

  cancelEditing() {
    this.editing = null;
  }
}
```

And the template `app.component.html`:

```html
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      #newTodo
      class="new-todo"
      placeholder="What needs to be done?"
      (keydown)="handleNewTodoKeyDown($event, newTodo)"
      autofocus
    />
  </header>
  <section class="main" *ngIf="(todos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      (change)="toggleAll($event)"
      [checked]="(activeCount$ | async) === 0"
    />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of todos$ | async"
        [todo]="todo"
        [editing]="editing === todo.id"
        (toggle)="store.dispatch(TodoActions.toggle({ id: todo.id }))"
        (destroy)="store.dispatch(TodoActions.destroy({ id: todo.id }))"
        (edit)="setEditing(todo.id)"
        (save)="store.dispatch(TodoActions.save({ id: todo.id, title: $event })); cancelEditing()"
        (cancel)="cancelEditing()"
      ></app-todo-item>
    </ul>
  </section>
  <app-todo-footer
    *ngIf="(activeCount$ | async) + (completedCount$ | async) > 0"
    [count]="activeCount$ | async"
    [completedCount]="completedCount$ | async"
    [nowShowing]="visibilityFilter$ | async"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```

### Step 9: Create TodoItemComponent

In `todo-item.component.ts`:

```ts
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Todo } from '../store/models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements AfterViewChecked {
  @Input() todo!: Todo;
  @Input() editing!: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editField') editField!: ElementRef<HTMLInputElement>;

  editText = '';

  ngAfterViewChecked() {
    if (this.editing) {
      this.editField.nativeElement.focus();
      this.editField.nativeElement.setSelectionRange(this.editText.length, this.editText.length);
    }
  }

  handleEdit() {
    this.editText = this.todo.title;
    this.edit.emit();
  }

  handleSubmit() {
    const text = this.editText.trim();
    if (text) {
      this.save.emit(text);
    } else {
      this.destroy.emit();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancel.emit();
    } else if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }
}
```

And the template `todo-item.component.html`:

```html
<li [class.completed]="todo.completed" [class.editing]="editing">
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
    #editField
    class="edit"
    [value]="editText"
    (blur)="handleSubmit()"
    (input)="editText = $event.target.value"
    (keydown)="handleKeyDown($event)"
  />
</li>
```

### Step 10: Create TodoFooterComponent

In `todo-footer.component.ts`:

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VisibilityFilter } from '../store/models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() count!: number;
  @Input() completedCount!: number;
  @Input() nowShowing!: VisibilityFilter;
  @Output() clearCompleted = new EventEmitter<void>();

  constructor(private todoService: TodoService) {}

  get activeTodoWord() {
    return this.todoService.pluralize(this.count, 'item');
  }
}
```

And the template `todo-footer.component.html`:

```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/all']" [class.selected]="nowShowing === 'all'">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']" [class.selected]="nowShowing === 'active'">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']" [class.selected]="nowShowing === 'completed'">Completed</a>
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

## Step 11: Adjust the routing

We have already set up the routes in `app.module.ts`. We are using the routerLink in the footer.

## Step 12: Styling

We'll need to include the same CSS as the React version. We can copy the CSS from the original TodoMVC app.

## Conclusion

This is a high-level migration. We have converted the React components to Angular, used NgRx for state management, and set up routing.

Note: We have not implemented the persistence of the visibilityFilter. We are only persisting the todos. The visibilityFilter is reset to 'all' on page reload. If we want to persist the filter, we would need to adjust the localStorage to include the filter.

We also note that the UUID generation in the reducer is not the same as the React version. We can adjust the reducer to use the TodoService for UUID, but we cannot use the service in the reducer. Instead, we can generate the ID in the effect for addTodo, but to keep it simple, we are using a simple ID.

Alternatively, we can dispatch an effect for addTodo that generates the ID and then dispatches an action with the generated ID.

Let's adjust:

In `todo.actions.ts`:

```ts
export const addTodoRequest = createAction(
  '[Todo] Add Todo Request',
  props<{ title: string }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ id: string, title: string }>()
);
```

Then in the effects:

```ts
import { TodoService } from '../../services/todo.service';

// ...

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ todos: AppState }>,
    private todoService: TodoService
  ) {}

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodoRequest),
      map(action => {
        const id = this.todoService.uuid();
        return TodoActions.addTodo({ id, title: action.title });
      })
    )
  );

  // ... other effects
}
```

Then in the component, we dispatch `addTodoRequest` instead of `addTodo`.

But to keep the example simpler, we'll leave it as is for now.

This migration covers the main points. We might need to adjust for any missing details.

### Answer:
I'll help migrate this React application to Angular 14.x. Here's the step-by-step migration plan:

### 1. Create Angular Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── todo-app/
│   │   │   ├── todo-app.component.ts
│   │   │   ├── todo-app.component.html
│   │   │   └── todo-app.component.css
│   │   ├── todo-item/
│   │   │   ├── todo-item.component.ts
│   │   │   ├── todo-item.component.html
│   │   │   └── todo-item.component.css
│   │   ├── todo-footer/
│   │   │   ├── todo-footer.component.ts
│   │   │   ├── todo-footer.component.html
│   │   │   └── todo-footer.component.css
│   ├── store/
│   │   ├── todo/
│   │   │   ├── todo.actions.ts
│   │   │   ├── todo.reducer.ts
│   │   │   ├── todo.selectors.ts
│   │   │   └── todo.effects.ts
│   ├── services/
│   │   ├── todo.service.ts
│   │   └── utils.service.ts
│   ├── models/
│   │   ├── todo.model.ts
│   │   └── app-state.ts
│   ├── constants.ts
│   └── app-routing.module.ts
└── index.html
```

### 2. Implement State Management with NgRx

**app/store/todo/todo.actions.ts**
```ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);
export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);
export const toggleAllTodos = createAction(
  '[Todo] Toggle All Todos',
  props<{ completed: boolean }>()
);
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: string; title: string }>()
);
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction(
  '[Todo] Set Filter',
  props<{ filter: string }>()
);
```

**app/store/todo/todo.reducer.ts**
```ts
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { Todo } from '../../models/todo.model';

export interface TodoState {
  todos: Todo[];
  filter: string;
}

export const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  })),
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false
    };
    return { ...state, todos: [...state.todos, newTodo] };
  }),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.toggleAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.updateTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);
```

### 3. Create Services

**app/services/todo.service.ts**
```ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app-state';
import * as TodoActions from '../store/todo/todo.actions';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private store: Store<AppState>) {}

  addTodo(title: string) {
    this.store.dispatch(TodoActions.addTodo({ title }));
  }

  toggleTodo(id: string) {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  toggleAll(completed: boolean) {
    this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
  }

  updateTodo(id: string, title: string) {
    this.store.dispatch(TodoActions.updateTodo({ id, title }));
  }

  deleteTodo(id: string) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  setFilter(filter: string) {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }
}
```

**app/services/utils.service.ts**
```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
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
}
```

### 4. Create Models

**app/models/todo.model.ts**
```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

**app/models/app-state.ts**
```ts
import { Todo } from './todo.model';

export interface AppState {
  todo: {
    todos: Todo[];
    filter: string;
  };
}
```

### 5. Create Components

**app/components/todo-app/todo-app.component.ts**
```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state';
import { TodoService } from '../../services/todo.service';
import { selectTodos, selectFilter, selectActiveCount, selectCompletedCount } from '../../store/todo/todo.selectors';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  filter$: Observable<string>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  editing: string | null = null;

  constructor(
    private store: Store<AppState>,
    private todoService: TodoService
  ) {
    this.todos$ = this.store.select(selectTodos);
    this.filter$ = this.store.select(selectFilter);
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  ngOnInit() {
    // Initialize routing
    this.updateFilterFromRoute();
  }

  private updateFilterFromRoute() {
    const path = window.location.pathname;
    if (path.includes('/active')) {
      this.todoService.setFilter('active');
    } else if (path.includes('/completed')) {
      this.todoService.setFilter('completed');
    } else {
      this.todoService.setFilter('all');
    }
  }

  handleNewTodoKeyDown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key !== 'Enter') return;
    const val = input.value.trim();
    if (val) {
      this.todoService.addTodo(val);
      input.value = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.todoService.toggleAll(target.checked);
  }

  setEditing(id: string) {
    this.editing = id;
  }

  cancelEditing() {
    this.editing = null;
  }
}
```

**app/components/todo-item/todo-item.component.ts**
```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() editing = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  editText = '';

  onEdit() {
    this.editText = this.todo.title;
    this.edit.emit();
  }

  onSubmit() {
    this.save.emit(this.editText.trim());
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancel.emit();
    } else if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
}
```

### 6. Implement Routing

**app/app-routing.module.ts**
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppComponent } from './components/todo-app/todo-app.component';

const routes: Routes = [
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  { path: 'all', component: TodoAppComponent },
  { path: 'active', component: TodoAppComponent },
  { path: 'completed', component: TodoAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### 7. Update App Module

**app/app.module.ts**
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { todoReducer } from './store/todo/todo.reducer';
import { TodoEffects } from './store/todo/todo.effects';
import { AppRoutingModule } from './app-routing.module';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoAppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot({ todo: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### 8. Add Selectors

**app/store/todo/todo.selectors.ts**
```ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../../models/app-state';
import { Todo } from '../../models/todo.model';

const selectTodoState = (state: AppState) => state.todo;

export const selectTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectFilter = createSelector(
  selectTodoState,
  state => state.filter
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);
```

### 9. Add Effects for Persistence

**app/store/todo/todo.effects.ts**
```ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions

### Tokens: {'input_tokens': 3628, 'output_tokens': 8192}
### Execution time: 40.88412284851074
