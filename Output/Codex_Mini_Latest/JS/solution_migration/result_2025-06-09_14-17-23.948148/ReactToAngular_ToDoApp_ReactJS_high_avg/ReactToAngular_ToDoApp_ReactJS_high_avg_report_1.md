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
Below is a complete Angular 14.x migration of your React+TypeScript “TodoMVC”‐style app, rewritten to use Angular best practices, @ngrx/store for state management (with effects), lazy‐loaded feature modules, OnPush change‐detection, Angular Router (with hash‐style URLs to match `#/active`, etc.), strongly typed interfaces, @Input/@Output communication, @ViewChild for “refs,” and proper dependency injection.  All React lifecycle methods have been mapped to Angular equivalents, and all functionality (filtering, editing, toggling, persisting to localStorage) is preserved.

---

## 1. File structure

```text
angular-todos/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── filter.model.ts
│   │   │   │   └── todo.model.ts
│   │   │   ├── services/
│   │   │   │   ├── todo-storage.service.ts
│   │   │   │   └── utils.ts
│   │   ├── store/
│   │   │   ├── actions/
│   │   │   │   └── todo.actions.ts
│   │   │   ├── effects/
│   │   │   │   └── todo.effects.ts
│   │   │   ├── reducers/
│   │   │   │   ├── index.ts
│   │   │   │   └── todo.reducer.ts
│   │   │   └── selectors/
│   │   │       └── todo.selectors.ts
│   │   └── todos/
│   │       ├── todos.module.ts
│   │       ├── todos-routing.module.ts
│   │       └── components/
│   │           ├── todo-app/
│   │           │   ├── todo-app.component.ts
│   │           │   ├── todo-app.component.html
│   │           │   └── todo-app.component.scss
│   │           ├── todo-list/
│   │           │   ├── todo-list.component.ts
│   │           │   └── todo-list.component.html
│   │           ├── todo-item/
│   │           │   ├── todo-item.component.ts
│   │           │   ├── todo-item.component.html
│   │           │   └── todo-item.component.scss
│   │           └── todo-footer/
│   │               ├── todo-footer.component.ts
│   │               └── todo-footer.component.html
└── (other Angular CLI–generated files…)
```

---

## 2. Core models & utilities

### src/app/core/models/constants.ts

```ts
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

### src/app/core/models/filter.model.ts

```ts
export type Filter = 'all' | 'active' | 'completed';

export const ALL_TODOS: Filter = 'all';
export const ACTIVE_TODOS: Filter = 'active';
export const COMPLETED_TODOS: Filter = 'completed';
```

### src/app/core/models/todo.model.ts

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### src/app/core/services/todo-storage.service.ts

```ts
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoStorageService {
  private storageKey = 'angular-todos';

  loadTodos(): Todo[] {
    const store = localStorage.getItem(this.storageKey);
    return store ? JSON.parse(store) : [];
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }
}
```

### src/app/core/services/utils.ts

```ts
export class Utils {
  static pluralize(count: number, word: string): string {
    return count === 1 ? word : `${word}s`;
  }
}
```

---

## 3. NgRx: actions, reducers, selectors & effects

### src/app/store/actions/todo.actions.ts

```ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../core/models/todo.model';
import { Update } from '@ngrx/entity';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);
export const addTodoSuccess = createAction(
  '[Todo] Add Todo Success',
  props<{ todo: Todo }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);
export const toggleTodoSuccess = createAction(
  '[Todo] Toggle Todo Success',
  props<{ id: string; completed: boolean }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);
export const toggleAllSuccess = createAction(
  '[Todo] Toggle All Success',
  props<{ completed: boolean }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);
export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: string }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ update: Update<Todo> }>()
);
export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ update: Update<Todo> }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');
export const clearCompletedSuccess = createAction(
  '[Todo] Clear Completed Success'
);
```

### src/app/store/reducers/todo.reducer.ts

```ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../core/models/todo.model';
import * as TodoActions from '../actions/todo.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface TodoState extends EntityState<Todo> {
  loading: boolean;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

export const initialState: TodoState = adapter.getInitialState({
  loading: false,
});

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) =>
    adapter.setAll(todos, { ...state, loading: false })
  ),
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    adapter.addOne(todo, state)
  ),
  on(TodoActions.toggleTodoSuccess, (state, { id, completed }) =>
    adapter.updateOne({ id, changes: { completed } }, state)
  ),
  on(TodoActions.toggleAllSuccess, (state, { completed }) =>
    adapter.map(todo => ({ ...todo, completed }), state)
  ),
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  ),
  on(TodoActions.updateTodoSuccess, (state, { update }) =>
    adapter.updateOne(update, state)
  ),
  on(TodoActions.clearCompletedSuccess, state => {
    const toRemove = state.ids.filter(id => {
      const t = state.entities[id];
      return t?.completed;
    }) as string[];
    return adapter.removeMany(toRemove, state);
  })
);

export const { selectAll, selectEntities } = adapter.getSelectors();
```

### src/app/store/reducers/index.ts

```ts
import { ActionReducerMap } from '@ngrx/store';
import * as fromTodo from './todo.reducer';

export interface AppState {
  todos: fromTodo.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodo.todoReducer,
};
```

### src/app/store/selectors/todo.selectors.ts

```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodo from '../reducers/todo.reducer';
import { Filter } from '../../core/models/filter.model';

export const selectTodoState = createFeatureSelector<fromTodo.TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  fromTodo.selectAll
);

export const selectActiveCount = createSelector(
  selectAllTodos,
  todos => todos.filter(t => !t.completed).length
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  todos => todos.filter(t => t.completed).length
);

export const selectFilteredTodos = (filter: Filter) =>
  createSelector(selectAllTodos, todos => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });
```

### src/app/store/effects/todo.effects.ts

```ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/todo.actions';
import { TodoStorageService } from '../../core/services/todo-storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { selectAllTodos, selectEntities } from '../selectors/todo.selectors';
import { map, withLatestFrom, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private storage: TodoStorageService,
    private store: Store<AppState>
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        const todos = this.storage.loadTodos();
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      map(({ title }) => {
        const todo = { id: uuidv4(), title, completed: false };
        return TodoActions.addTodoSuccess({ todo });
      })
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      withLatestFrom(this.store.select(selectEntities)),
      map(([{ id }, entities]) => {
        const completed = !entities[id]!.completed;
        return TodoActions.toggleTodoSuccess({ id, completed });
      })
    )
  );

  toggleAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleAll),
      map(({ completed }) => TodoActions.toggleAllSuccess({ completed }))
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      map(({ id }) => TodoActions.deleteTodoSuccess({ id }))
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      map(({ update }) => TodoActions.updateTodoSuccess({ update }))
    )
  );

  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearCompleted),
      map(() => TodoActions.clearCompletedSuccess())
    )
  );

  persistTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodoSuccess,
          TodoActions.toggleTodoSuccess,
          TodoActions.toggleAllSuccess,
          TodoActions.deleteTodoSuccess,
          TodoActions.updateTodoSuccess,
          TodoActions.clearCompletedSuccess
        ),
        withLatestFrom(this.store.select(selectAllTodos)),
        tap(([_, todos]) => this.storage.saveTodos(todos))
      ),
    { dispatch: false }
  );
}
```

---

## 4. App-level module & routing

### src/app/app.component.ts

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
```

### src/app/app-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./todos/todos.module').then(m => m.TodosModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### src/app/app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects/todo.effects';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

---

## 5. Lazy‐loaded Todos feature module & routing

### src/app/todos/todos-routing.module.ts

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { ALL_TODOS } from '../core/models/filter.model';

const routes: Routes = [
  { path: '', redirectTo: ALL_TODOS, pathMatch: 'full' },
  { path: ':filter', component: TodoAppComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {}
```

### src/app/todos/todos.module.ts

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TodosRoutingModule } from './todos-routing.module';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

@NgModule({
  declarations: [
    TodoAppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TodosRoutingModule
  ]
})
export class TodosModule {}
```

---

## 6. Components

### 6.1 TodoAppComponent (container)

#### src/app/todos/components/todo-app/todo-app.component.ts

```ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Todo } from '../../../core/models/todo.model';
import {
  Filter,
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS
} from '../../../core/models/filter.model';
import * as TodoActions from '../../../store/actions/todo.actions';
import * as TodoSelectors from '../../../store/selectors/todo.selectors';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  filter$: Observable<Filter>;
  newTodoTitle = '';
  editingId: string | null = null;

  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());

    this.filter$ = this.route.paramMap.pipe(
      map(m => (m.get('filter') as Filter) || ALL_TODOS),
      distinctUntilChanged()
    );

    const allTodos$ = this.store.select(TodoSelectors.selectAllTodos);

    this.todos$ = combineLatest([this.filter$, allTodos$]).pipe(
      map(([filter, todos]) => {
        switch (filter) {
          case ACTIVE_TODOS:
            return todos.filter(t => !t.completed);
          case COMPLETED_TODOS:
            return todos.filter(t => t.completed);
          default:
            return todos;
        }
      })
    );

    this.activeCount$ = this.store.select(TodoSelectors.selectActiveCount);
    this.completedCount$ = this.store.select(TodoSelectors.selectCompletedCount);
  }

  addTodo(): void {
    const t = this.newTodoTitle.trim();
    if (t) {
      this.store.dispatch(TodoActions.addTodo({ title: t }));
      this.newTodoTitle = '';
    }
  }

  toggleAll(checked: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed: checked }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  editTodo(id: string): void {
    this.editingId = id;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveTodo(id: string, title: string): void {
    this.store.dispatch(
      TodoActions.updateTodo({ update: { id, changes: { title } } })
    );
    this.cancelEdit();
  }

  toggleTodo(id: string): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  deleteTodo(id: string): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
```
【F:src/app/todos/components/todo-app/todo-app.component.ts†L1-L67】

#### src/app/todos/components/todo-app/todo-app.component.html

```html
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodoTitle"
      (keyup.enter)="addTodo()"
      autofocus
    />
  </header>

  <section *ngIf="(todos$ | async)?.length" class="main">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeCount$ | async) === 0"
      (change)="toggleAll($event.target.checked)"
    />
    <label for="toggle-all">Mark all as complete</label>

    <app-todo-list
      [todos]="todos$ | async"
      [editingId]="editingId"
      (toggle)="toggleTodo($event)"
      (delete)="deleteTodo($event)"
      (edit)="editTodo($event)"
      (save)="saveTodo($event.id, $event.title)"
      (cancel)="cancelEdit()"
    ></app-todo-list>
  </section>

  <app-todo-footer
    *ngIf="(activeCount$ | async) || (completedCount$ | async)"
    [count]="activeCount$ | async"
    [completedCount]="completedCount$ | async"
    [filter]="filter$ | async"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```
【F:src/app/todos/components/todo-app/todo-app.component.html†L1-L36】

### 6.2 TodoListComponent

#### src/app/todos/components/todo-list/todo-list.component.ts

```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Todo } from '../../../core/models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() editingId: string | null = null;

  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() save = new EventEmitter<{ id: string; title: string }>();
  @Output() cancel = new EventEmitter<void>();
}
```
【F:src/app/todos/components/todo-list/todo-list.component.ts†L1-L25】

#### src/app/todos/components/todo-list/todo-list.component.html

```html
<ul class="todo-list">
  <app-todo-item
    *ngFor="let todo of todos"
    [todo]="todo"
    [editing]="todo.id === editingId"
    (toggle)="toggle.emit(todo.id)"
    (delete)="delete.emit(todo.id)"
    (edit)="edit.emit(todo.id)"
    (save)="save.emit($event)"
    (cancel)="cancel.emit()"
  ></app-todo-item>
</ul>
```
【F:src/app/todos/components/todo-list/todo-list.component.html†L1-L11】

### 6.3 TodoItemComponent

#### src/app/todos/components/todo-item/todo-item.component.ts

```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewChecked,
  OnChanges
} from '@angular/core';
import { Todo } from '../../../core/models/todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../../../core/models/constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnChanges, AfterViewChecked {
  @Input() todo!: Todo;
  @Input() editing = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ id: string; title: string }>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editInput') editInputRef!: ElementRef<HTMLInputElement>;

  editText = '';

  ngOnChanges(): void {
    this.editText = this.todo.title;
  }

  ngAfterViewChecked(): void {
    if (this.editing && this.editInputRef) {
      const input = this.editInputRef.nativeElement;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  onToggle(): void { this.toggle.emit(); }
  onDestroy(): void { this.delete.emit(); }
  onEdit(): void { this.edit.emit(); }
  onChange(text: string): void { this.editText = text; }

  onSubmit(): void {
    const val = this.editText.trim();
    if (val) {
      this.save.emit({ id: this.todo.id, title: val });
      this.editText = val;
    } else {
      this.delete.emit();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.onSubmit();
    }
  }
}
```
【F:src/app/todos/components/todo-item/todo-item.component.ts†L1-L63】

#### src/app/todos/components/todo-item/todo-item.component.html

```html
<li [ngClass]="{ completed: todo.completed, editing: editing }">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggle()"
    />
    <label (dblclick)="onEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="onDestroy()"></button>
  </div>
  <input
    #editInput
    class="edit"
    [(ngModel)]="editText"
    (blur)="onSubmit()"
    (keydown)="onKeydown($event)"
  />
</li>
```
【F:src/app/todos/components/todo-item/todo-item.component.html†L1-L15】

### 6.4 TodoFooterComponent

#### src/app/todos/components/todo-footer/todo-footer.component.ts

```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  Filter,
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS
} from '../../../core/models/filter.model';
import { Utils } from '../../../core/services/utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  @Input() count = 0;
  @Input() completedCount = 0;
  @Input() filter: Filter = ALL_TODOS;
  @Output() clearCompleted = new EventEmitter<void>();

  readonly ALL_TODOS = ALL_TODOS;
  readonly ACTIVE_TODOS = ACTIVE_TODOS;
  readonly COMPLETED_TODOS = COMPLETED_TODOS;

  get activeTodoWord(): string {
    return Utils.pluralize(this.count, 'item');
  }

  onClear(): void {
    this.clearCompleted.emit();
  }
}
```
【F:src/app/todos/components/todo-footer/todo-footer.component.ts†L1-L32】

#### src/app/todos/components/todo-footer/todo-footer.component.html

```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ activeTodoWord }} left
  </span>
  <ul class="filters">
    <li>
      <a
        [routerLink]="[ALL_TODOS]"
        [ngClass]="{ selected: filter === ALL_TODOS }"
      >All</a>
    </li>
    <li>
      <a
        [routerLink]="[ACTIVE_TODOS]"
        [ngClass]="{ selected: filter === ACTIVE_TODOS }"
      >Active</a>
    </li>
    <li>
      <a
        [routerLink]="[COMPLETED_TODOS]"
        [ngClass]="{ selected: filter === COMPLETED_TODOS }"
      >Completed</a>
    </li>
  </ul>
  <button
    *ngIf="completedCount > 0"
    class="clear-completed"
    (click)="onClear()"
  >Clear completed</button>
</footer>
```
【F:src/app/todos/components/todo-footer/todo-footer.component.html†L1-L19】

---

## 7. Styles (SCSS)

You can reuse the original TodoMVC CSS in `*.component.scss` files or global styles. (SCSS omitted here for brevity.)

---

## 8. Summary of the nine requested steps

| Step                                                         | How we addressed it                                                                                              |
|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| 1. Migrate React TS to Angular 14.x                         | Rewrote all JSX into Angular templates, mapped lifecycle methods (`componentDidMount`, `componentDidUpdate`) to Angular’s `ngOnInit`, `ngOnChanges`, `ngAfterViewChecked`. |
| 2. Use @ngrx/store & @ngrx/effects                           | Created actions, reducers, selectors and effects for todos; effects handle localStorage side‐effects.            |
| 3. Apply Angular best practices                              | Feature module (TodosModule) is lazy‐loaded, split into focused components, services for storage and utils, DI used. |
| 4. Convert JSX to Angular templates                          | All `<TodoItem>`, `<TodoFooter>` etc. turned into `<app-todo-item>`, `<app-todo-footer>` with event bindings & `@ViewChild`.|
| 5. Strong typing                                             | Maintained interfaces (`Todo`, `Filter`), used `props`/`@Input()`, `@Output()`, `@ngrx/store` types.             |
| 6. Component communication                                   | Used `@Input()` and `@Output()` with `EventEmitter`, and container (`TodoAppComponent`) + presentational components.|
| 7. Performance optimizations                                 | All components use `ChangeDetectionStrategy.OnPush`; TodosModule is lazy-loaded.                                 |
| 8. Angular Router                                            | Configured hash‐style routing (`useHash: true`) to preserve `#/active` URL patterns; default and wildcard routes.|
| 9. Code quality                                              | No TODOs, follows Angular style guide: feature modules, smart/dumb separation, centralized store, DI, OnPush.    |

This completes the full migration of your React + TypeScript Todo application into a clean, maintainable Angular 14.x application using NgRx for state management, lazy loading, and Angular best practices throughout.

### Tokens: {'input_tokens': 3533, 'output_tokens': 16121, 'reasoning_tokens': 9600}
### Execution time: 118.96094799041748
