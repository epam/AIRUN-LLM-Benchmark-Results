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
<think>
Okay, I need to migrate this React code to Angular 14.x. Let me start by understanding the structure of the React app. The main components are TodoApp, TodoItem, TodoFooter, and the TodoModel. The app uses a router for filtering todos, and state management is handled through the model's subscription.

First, Angular uses modules and components, so I'll create an Angular module for the todo feature. The TodoApp component in React is the root component, so in Angular, that'll be the main component, maybe TodoComponent. 

The React code uses a TodoModel class to manage state and notify changes. In Angular, using @ngrx/store would be appropriate for state management. So I'll set up a store with actions, reducers, and effects if needed. The model's methods like addTodo, toggleAll, etc., will become actions.

Looking at the TodoModel, it uses localStorage via Utils.store. In NgRx, I can create an effect to persist the todos to localStorage whenever the state changes. The initial state can be loaded from localStorage in the reducer.

Next, the TodoApp component's state (nowShowing and editing) can be managed in the NgRx store as well. The router in React is handled by a router that sets the nowShowing state. In Angular, I'll use the Angular Router and select the current route to determine which todos to display. Maybe a selector that combines the route and the todos.

The TodoItem and TodoFooter components will be converted to Angular components. In React, they receive props; in Angular, these become input properties. Event handlers become output emitters.

For the TodoItem's editing state, in React it's managed by the parent. In Angular, since we're using NgRx, maybe the editing state is part of the store, or perhaps managed locally within the TodoItem component. Since the original code passes editing as a prop, it's better to keep it in the store to maintain consistency.

The Utils class can be converted into Angular services. Since they're static methods, I'll create a service with these methods and inject them where needed.

The React code uses refs, like this.refs["newField"]. In Angular, I'll use template reference variables with @ViewChild decorators to access DOM elements.

In the React componentDidMount, the router is initialized. In Angular, I'll set up routes in the app-routing.module to handle the different views (all, active, completed). The component can then subscribe to route changes to update the filter.

The TodoFooter has links that change the route. In Angular, these will be routerLinks.

Now, breaking down each file:

1. app.tsx becomes a TodoComponent in Angular. The main template will have the header, input, and include the todo-list and todo-footer components. The component will dispatch actions to the store and select data from it.

2. todoItem.tsx becomes a TodoItemComponent with inputs for todo and editing, and outputs for toggling, destroying, etc. The double-click to edit and input handling will be handled within the component, dispatching actions as needed.

3. footer.tsx becomes TodoFooterComponent, with inputs for count, completedCount, and nowShowing. The clear completed button will emit an event or dispatch an action.

4. The TodoModel is replaced by NgRx store. Actions will be defined for addTodo, toggle, destroy, etc. The reducer will handle these actions to update the state. Effects might handle persistence to localStorage.

5. The Utils class becomes a service, providing uuid, pluralize, store, and extend methods. This service can be injected into effects or components as needed.

6. Constants can remain as a constants file, exporting the same strings and key codes.

Potential issues to watch for:

- React's setState is replaced by NgRx store dispatches and selectors.
- Refs in React are converted to Angular ViewChild.
- Lifecycle methods like componentDidMount become ngOnInit in Angular.
- Binding methods in React (e.g., this.toggle.bind(this, todo)) in Angular can be handled by outputs or directly calling methods with parameters.

Testing each part step by step, ensuring that the store is correctly updated, and components react to state changes. Also, ensuring that the router integration works to filter the todos based on the active route.

I'll start by setting up the NgRx store. Define the state shape, actions, reducers, and effects. Then create the components, services, and update the templates to use Angular syntax.
</think>

Here's the Angular 14.x migration:

app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todosReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';
import { TodoComponent } from './todo.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFooterComponent } from './todo-footer.component';
import { UtilsService } from './utils.service';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'all' },
      { path: ':filter', component: TodoComponent }
    ]),
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  declarations: [TodoComponent, TodoItemComponent, TodoFooterComponent],
  providers: [UtilsService],
  bootstrap: [TodoComponent]
})
export class AppModule {}
```

todo.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from './store/app.state';
import { addTodo, toggleAll, clearCompleted } from './store/todo.actions';
import { UtilsService } from './utils.service';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html'
})
export class TodoComponent {
  todos$ = this.store.select(state => state.todos.todos);
  activeTodoCount$ = this.todos$.pipe(
    map(todos => todos.filter(todo => !todo.completed).length)
  );
  nowShowing$ = this.store.select(state => state.todos.filter);
  editing: string | null = null;

  constructor(private store: Store<AppState>, private utils: UtilsService) {}

  handleNewTodoKeyDown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key !== 'Enter') return;
    const val = input.value.trim();
    if (val) {
      this.store.dispatch(addTodo({ id: this.utils.uuid(), title: val }));
      input.value = '';
    }
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(toggleAll({ checked }));
  }
}
```

todo.component.html
```html
<div class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input 
      #newTodo
      class="new-todo" 
      placeholder="What needs to be done?"
      (keydown.enter)="handleNewTodoKeyDown($event, newTodo)"
      autofocus
    >
  </header>
  
  <section class="main" *ngIf="(todos$ | async)?.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="(activeTodoCount$ | async) === 0"
      (change)="toggleAll($event)"
    >
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <app-todo-item 
        *ngFor="let todo of todos$ | async"
        [todo]="todo"
        [editing]="editing === todo.id"
        (save)="editing = null"
        (cancel)="editing = null"
        (edit)="editing = $event"
      ></app-todo-item>
    </ul>
  </section>
  
  <app-todo-footer 
    *ngIf="(todos$ | async)?.length"
    [count]="activeTodoCount$ | async"
    [nowShowing]="nowShowing$ | async"
    (clearCompleted)="store.dispatch(clearCompleted())"
  ></app-todo-footer>
</div>
```

todo-item.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from './store/app.state';
import { UtilsService } from './utils.service';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() editing = false;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() destroy = new EventEmitter<Todo>();
  @Output() edit = new EventEmitter<string>();
  @Output() save = new EventEmitter<{ todo: Todo; text: string }>();
  @Output() cancel = new EventEmitter<void>();

  editText = '';

  constructor(private utils: UtilsService) {}

  handleSubmit() {
    const text = this.editText.trim();
    if (text) {
      this.save.emit({ todo: this.todo, text });
    } else {
      this.destroy.emit(this.todo);
    }
  }

  handleEdit() {
    this.edit.emit(this.todo.id);
    this.editText = this.todo.title;
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

todo-item.component.html
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="toggle.emit(todo)"
    >
    <label (dblclick)="handleEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroy.emit(todo)"></button>
  </div>
  <input
    *ngIf="editing"
    class="edit"
    #editInput
    [value]="editText"
    (blur)="handleSubmit()"
    (input)="editText = $event.target.value"
    (keydown)="handleKeyDown($event)"
  >
</li>
```

todo-footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { UtilsService } from './utils.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  @Input() count = 0;
  @Input() nowShowing = ALL_TODOS;
  @Output() clearCompleted = new EventEmitter<void>();

  ALL_TODOS = ALL_TODOS;
  ACTIVE_TODOS = ACTIVE_TODOS;
  COMPLETED_TODOS = COMPLETED_TODOS;

  constructor(public utils: UtilsService) {}
}
```

todo-footer.component.html
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ count }}</strong> {{ utils.pluralize(count, 'item') }} left
  </span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/all']" [class.selected]="nowShowing === ALL_TODOS">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']" [class.selected]="nowShowing === ACTIVE_TODOS">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']" [class.selected]="nowShowing === COMPLETED_TODOS">Completed</a>
    </li>
  </ul>
  <button 
    *ngIf="count > 0"
    class="clear-completed" 
    (click)="clearCompleted.emit()"
  >
    Clear completed
  </button>
</footer>
```

store/app.state.ts
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ALL_TODOS } from '../constants';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface AppState {
  todos: Todo[];
  filter: string;
}

export const initialState: AppState = {
  todos: [],
  filter: ALL_TODOS
};

export const selectTodoState = createFeatureSelector<AppState>('todos');
export const selectFilter = createSelector(selectTodoState, state => state.filter);
export const selectTodos = createSelector(
  selectTodoState,
  selectFilter,
  (state, filter) => {
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
```

store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from './app.state';

export const addTodo = createAction('[Todo] Add', props<{ todo: Todo }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ checked: boolean }>());
export const toggleTodo = createAction('[Todo] Toggle', props<{ id: string }>());
export const destroyTodo = createAction('[Todo] Destroy', props<{ id: string }>());
export const saveTodo = createAction('[Todo] Save', props<{ id: string; text: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
```

store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { Todo, initialState } from './app.state';
import { UtilsService } from '../utils.service';

export const todosReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo]
  })),
  on(TodoActions.toggleAll, (state, { checked }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: checked }))
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.destroyTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.saveTodo, (state, { id, text }) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, title: text } : todo
    )
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

store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { UtilsService } from '../utils.service';

@Injectable()
export class TodoEffects {
  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        '[Todo] Add', '[Todo] Toggle All', '[Todo] Toggle',
        '[Todo] Destroy', '[Todo] Save', '[Todo] Clear Completed'
      ),
      tap(() => {
        this.store.select(state => state.todos.todos)
          .subscribe(todos => this.utils.store('ngrx-todos', todos));
      })
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private utils: UtilsService
  ) {}
}
```

utils.service.ts
```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  uuid() {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      const random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-';
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }
    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  extend(...objs: any[]) {
    return Object.assign({}, ...objs);
  }
}
```

constants.ts
```typescript
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
```

### Tokens: {'input_tokens': 3355, 'output_tokens': 4037}
### Execution time: 86.06803798675537
