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
Below is one possible Angular 14.x migration. It preserves all existing functionality, uses @ngrx/store + @ngrx/effects to load/save from localStorage, splits UI into smart/container and dumb/presentational components, uses the Router (with hash‑style URLs), strong typing, OnPush change detection, lazy‑loaded feature module, and follows Angular style guidelines.

1. Application structure (src/app)

   • app/
     – app.component.ts
     – app.module.ts
     – app-routing.module.ts
     – todos/            ← lazy‑loaded feature
       • models/
         – todo.model.ts
         – filter.model.ts
       • store/
         – actions/todo.actions.ts
         – reducers/todo.reducer.ts
         – selectors/todo.selectors.ts
         – effects/todo.effects.ts
       • utils/
         – utils.ts
       • pipes/
         – pluralize.pipe.ts
       • components/
         – todo-app/
           • todo-app.component.ts
           • todo-app.component.html
           • todo-app.component.scss
         – todo-input/
           • todo-input.component.ts
           • todo-input.component.html
         – todo-list/
           • todo-list.component.ts
           • todo-list.component.html
         – todo-item/
           • todo-item.component.ts
           • todo-item.component.html
           • todo-item.component.scss
         – todo-footer/
           • todo-footer.component.ts
           • todo-footer.component.html

---

File: src/app/app.component.ts  
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
```

File: src/app/app-routing.module.ts  
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

File: src/app/app.module.ts  
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

File: src/app/todos/models/todo.model.ts  
```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

File: src/app/todos/models/filter.model.ts  
```ts
export type Filter = 'all' | 'active' | 'completed';
```

---

File: src/app/todos/utils/utils.ts  
```ts
export class Utils {
  static uuid(): string {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      const random = (Math.random() * 16) | 0;
      if ([8,12,16,20].includes(i)) { uuid += '-'; }
      uuid += ((i === 12) ? 4 : (i === 16 ? (random & 3) | 8 : random))
        .toString(16);
    }
    return uuid;
  }
}
```

---

File: src/app/todos/pipes/pluralize.pipe.ts  
```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluralize' })
export class PluralizePipe implements PipeTransform {
  transform(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }
}
```

---

File: src/app/todos/store/actions/todo.actions.ts  
```ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { Filter } from '../../models/filter.model';

export const loadTodos       = createAction('[Todo] Load Todos');
export const loadTodosSuccess= createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo         = createAction('[Todo] Add Todo', props<{ id: string; title: string }>());
export const toggleTodo      = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const updateTodo      = createAction('[Todo] Update Todo', props<{ id: string; title: string }>());
export const removeTodo      = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const toggleAll       = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const clearCompleted  = createAction('[Todo] Clear Completed');
export const setFilter       = createAction('[Todo] Set Filter', props<{ filter: Filter }>());
```

---

File: src/app/todos/store/reducers/todo.reducer.ts  
```ts
import { createReducer, on, Action } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { Filter } from '../../models/filter.model';
import * as TodoActions from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}

export const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

const _todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo,       (state, { id, title }) =>
    ({ ...state, todos: [...state.todos, { id, title, completed: false }] })
  ),
  on(TodoActions.toggleTodo,    (state, { id }) =>
    ({ ...state,
       todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    })
  ),
  on(TodoActions.updateTodo,    (state, { id, title }) =>
    ({ ...state,
       todos: state.todos.map(t => t.id === id ? { ...t, title } : t)
    })
  ),
  on(TodoActions.removeTodo,    (state, { id }) =>
    ({ ...state, todos: state.todos.filter(t => t.id !== id) })
  ),
  on(TodoActions.toggleAll,     (state, { completed }) =>
    ({ ...state, todos: state.todos.map(t => ({ ...t, completed })) })
  ),
  on(TodoActions.clearCompleted,(state) =>
    ({ ...state, todos: state.todos.filter(t => !t.completed) })
  ),
  on(TodoActions.setFilter,     (state, { filter }) =>
    ({ ...state, filter })
  )
);

export function todoReducer(state: TodoState | undefined, action: Action) {
  return _todoReducer(state, action);
}
```

---

File: src/app/todos/store/selectors/todo.selectors.ts  
```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';
import { Filter } from '../../models/filter.model';

export const selectTodoFeature = createFeatureSelector<TodoState>('todos');

export const selectAllTodos      = createSelector(selectTodoFeature, s => s.todos);
export const selectFilter        = createSelector(selectTodoFeature, s => s.filter);
export const selectActiveCount   = createSelector(selectAllTodos, todos => todos.filter(t => !t.completed).length);
export const selectCompletedCount= createSelector(selectAllTodos, todos => todos.filter(t => t.completed).length);

export const selectVisibleTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'active':    return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default:          return todos;
    }
  }
);
```

---

File: src/app/todos/store/effects/todo.effects.ts  
```ts
import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT
} from '@ngrx/effects';
import { withLatestFrom, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as TodoActions from '../actions/todo.actions';
import { selectAllTodos } from '../selectors/todo.selectors';

@Injectable()
export class TodoEffects {
  private STORAGE_KEY = 'react-todos';

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        const todos = raw ? JSON.parse(raw) : [];
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.updateTodo,
        TodoActions.removeTodo,
        TodoActions.toggleAll,
        TodoActions.clearCompleted
      ),
      withLatestFrom(this.store.select(selectAllTodos)),
      tap(([_, todos]) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
      })
    )
  , { dispatch: false });
}
```

---

File: src/app/todos/todos.module.ts  
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule }  from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule }  from '@angular/forms';

import { todoReducer }    from './store/reducers/todo.reducer';
import { TodoEffects }    from './store/effects/todo.effects';

import { Utils }               from './utils/utils';
import { PluralizePipe }       from './pipes/pluralize.pipe';
import { TodoAppComponent }    from './components/todo-app/todo-app.component';
import { TodoInputComponent }  from './components/todo-input/todo-input.component';
import { TodoListComponent }   from './components/todo-list/todo-list.component';
import { TodoItemComponent }   from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

const routes: Routes = [
  { path: '', component: TodoAppComponent,     data: { filter: 'all' } },
  { path: 'active',    component: TodoAppComponent, data: { filter: 'active' } },
  { path: 'completed', component: TodoAppComponent, data: { filter: 'completed' } }
];

@NgModule({
  declarations: [
    TodoAppComponent,
    TodoInputComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    PluralizePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects])
  ],
  providers: [Utils]
})
export class TodosModule {}
```

---

File: src/app/todos/components/todo-app/todo-app.component.ts  
```ts
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TodoActions from '../../store/actions/todo.actions';
import {
  selectVisibleTodos,
  selectActiveCount,
  selectCompletedCount,
  selectFilter
} from '../../store/selectors/todo.selectors';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos$           = this.store.select(selectVisibleTodos);
  activeCount$     = this.store.select(selectActiveCount);
  completedCount$  = this.store.select(selectCompletedCount);
  currentFilter$   = this.store.select(selectFilter);

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit() {
    this.sub = this.route.data.subscribe((d: Data) => {
      this.store.dispatch(TodoActions.setFilter({ filter: d['filter'] }));
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addTodo(title: string) {
    this.store.dispatch(
      TodoActions.addTodo({ id: Utils.uuid(), title: title.trim() })
    );
  }

  toggleTodo(id: string) {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  removeTodo(id: string) {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  updateTodo(evt: { id: string; title: string }) {
    this.store.dispatch(
      TodoActions.updateTodo({ id: evt.id, title: evt.title.trim() })
    );
  }

  toggleAll(completed: boolean) {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

File: src/app/todos/components/todo-app/todo-app.component.html  
```html
<div class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <app-todo-input (add)="addTodo($event)"></app-todo-input>
  </header>

  <section class="main" *ngIf="(todos$ | async)?.length">
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
      (toggle)="toggleTodo($event)"
      (remove)="removeTodo($event)"
      (update)="updateTodo($event)"
    ></app-todo-list>
  </section>

  <app-todo-footer
    [activeCount]="activeCount$ | async!"
    [completedCount]="completedCount$ | async!"
    [currentFilter]="currentFilter$ | async!"
    (clearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>
```

---

File: src/app/todos/components/todo-input/todo-input.component.ts  
```ts
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoInputComponent implements AfterViewInit {
  @Output() add = new EventEmitter<string>();
  @ViewChild('newInput') newInputRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.newInputRef.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const val = this.newInputRef.nativeElement.value.trim();
      if (val) {
        this.add.emit(val);
        this.newInputRef.nativeElement.value = '';
      }
    }
  }
}
```

File: src/app/todos/components/todo-input/todo-input.component.html  
```html
<input
  #newInput
  class="new-todo"
  placeholder="What needs to be done?"
  (keydown)="onKeydown($event)"
  autofocus
/>
```

---

File: src/app/todos/components/todo-list/todo-list.component.ts  
```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; title: string }>();
}
```

File: src/app/todos/components/todo-list/todo-list.component.html  
```html
<ul class="todo-list">
  <app-todo-item
    *ngFor="let todo of todos"
    [todo]="todo"
    (toggle)="toggle.emit(todo.id)"
    (remove)="remove.emit(todo.id)"
    (update)="update.emit($event)"
  ></app-todo-item>
</ul>
```

---

File: src/app/todos/components/todo-item/todo-item.component.ts  
```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { Todo } from '../../models/todo.model';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnChanges, AfterViewChecked {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ id: string; title: string }>();

  editing = false;
  editText = '';

  @ViewChild('editInput') editInputRef!: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todo']) {
      this.editText = this.todo.title;
    }
  }

  ngAfterViewChecked() {
    if (this.editing) {
      const node = this.editInputRef.nativeElement;
      node.focus();
      const len = node.value.length;
      node.setSelectionRange(len, len);
    }
  }

  onToggle() {
    this.toggle.emit();
  }

  onDestroy() {
    this.remove.emit();
  }

  onDoubleClick() {
    this.editing = true;
  }

  onBlur() {
    this.submit();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.editing = false;
      this.editText = this.todo.title;
    } else if (event.key === 'Enter') {
      this.submit();
    }
  }

  onChange(value: string) {
    this.editText = value;
  }

  submit() {
    const text = this.editText.trim();
    if (text) {
      this.update.emit({ id: this.todo.id, title: text });
    } else {
      this.remove.emit();
    }
    this.editing = false;
  }
}
```

File: src/app/todos/components/todo-item/todo-item.component.html  
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggle()"
    />
    <label (dblclick)="onDoubleClick()">{{ todo.title }}</label>
    <button class="destroy" (click)="onDestroy()"></button>
  </div>
  <input
    #editInput
    class="edit"
    *ngIf="editing"
    [value]="editText"
    (blur)="onBlur()"
    (input)="onChange($event.target.value)"
    (keydown)="onKeydown($event)"
  />
</li>
```

---

File: src/app/todos/components/todo-footer/todo-footer.component.ts  
```ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Filter } from '../../models/filter.model';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  @Input() activeCount!: number;
  @Input() completedCount!: number;
  @Input() currentFilter!: Filter;
  @Output() clearCompleted = new EventEmitter<void>();
}
```

File: src/app/todos/components/todo-footer/todo-footer.component.html  
```html
<footer class="footer" *ngIf="activeCount || completedCount">
  <span class="todo-count">
    <strong>{{ activeCount }}</strong>
    {{ activeCount | pluralize:'item' }} left
  </span>
  <ul class="filters">
    <li><a routerLink="/"         [class.selected]="currentFilter==='all'">All</a></li>
    <li><a routerLink="/active"   [class.selected]="currentFilter==='active'">Active</a></li>
    <li><a routerLink="/completed"[class.selected]="currentFilter==='completed'">Completed</a></li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="completedCount>0"
    (click)="clearCompleted.emit()"
  >Clear completed</button>
</footer>
```

With this setup:

- The TodosModule is lazy‑loaded by the AppRoutingModule.
- @ngrx/store holds your todos + filter; @ngrx/effects handles localStorage I/O.
- All React lifecycle logic (focus on edit, state of “editing”, filtering, counts) is faithfully ported.
- Components use OnPush, @Input/@Output, @ViewChild in place of refs, and Angular event bindings.
- Routing matches “#/” “#/active” “#/completed” via useHash: true.
- The Utils.uuid method is reused for ID generation at dispatch time.
- A simple pipe replaces Utils.pluralize.
- No TODOs remain; code follows Angular style conventions.

You can copy these files into an Angular CLI project (ng new …), install @ngrx/store, @ngrx/effects, then run.

### Tokens: {'input_tokens': 3533, 'output_tokens': 14933, 'reasoning_tokens': 9984}
### Execution time: 170.95134472846985
