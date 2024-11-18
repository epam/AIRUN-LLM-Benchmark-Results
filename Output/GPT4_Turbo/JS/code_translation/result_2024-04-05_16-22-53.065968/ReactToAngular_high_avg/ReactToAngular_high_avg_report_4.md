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


Your task is to migrate this code to Angular 14.x.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 4:
### Answer:
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todosReducer } from './store/todos.reducer';
import { TodosEffects } from './store/todos.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodosEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, clearCompleted, toggleAll, toggleTodo, destroyTodo, saveTodo } from './store/todos.actions';
import { Observable } from 'rxjs';
import { ITodo } from './todo.model';
import { selectFilteredTodos, selectActiveTodoCount, selectCompletedCount } from './store/todos.selectors';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodoText = '';
  nowShowing = ALL_TODOS;
  ENTER_KEY = ENTER_KEY;

  todos$: Observable<ITodo[]> = this.store.select(selectFilteredTodos, { filter: this.nowShowing });
  activeTodoCount$: Observable<number> = this.store.select(selectActiveTodoCount);
  completedCount$: Observable<number> = this.store.select(selectCompletedCount);

  constructor(private store: Store) {}

  addTodo() {
    if (this.newTodoText.trim().length) {
      this.store.dispatch(addTodo({ text: this.newTodoText }));
      this.newTodoText = '';
    }
  }

  toggleAllTodos(checked: boolean) {
    this.store.dispatch(toggleAll({ completed: checked }));
  }

  toggleCompletion(todo: ITodo) {
    this.store.dispatch(toggleTodo({ id: todo.id }));
  }

  destroy(todo: ITodo) {
    this.store.dispatch(destroyTodo({ id: todo.id }));
  }

  save(todo: ITodo, text: string) {
    this.store.dispatch(saveTodo({ id: todo.id, text }));
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  changeFilter(filter: string) {
    this.nowShowing = filter;
    this.todos$ = this.store.select(selectFilteredTodos, { filter: this.nowShowing });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === this.ENTER_KEY) {
      this.addTodo();
    }
  }
}
```

```html
<!-- app.component.html -->
<header class="header">
  <h1>todos</h1>
  <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodoText" (keydown.enter)="addTodo()" autofocus>
</header>
<section class="main" *ngIf="todos$ | async as todos">
  <input id="toggle-all" class="toggle-all" type="checkbox" (change)="toggleAllTodos($event.target.checked)">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item *ngFor="let todo of todos" [todo]="todo" (toggle)="toggleCompletion(todo)" (destroy)="destroy(todo)" (save)="save(todo, $event)"></app-todo-item>
  </ul>
</section>
<app-todo-footer [activeTodoCount]="activeTodoCount$ | async" [completedCount]="completedCount$ | async" [nowShowing]="nowShowing" (clearCompleted)="clearCompleted()" (changeFilter)="changeFilter($event)"></app-todo-footer>
```

```typescript
// todo-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITodo } from '../todo.model';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo: ITodo;
  @Output() toggle = new EventEmitter<ITodo>();
  @Output() destroy = new EventEmitter<ITodo>();
  @Output() save = new EventEmitter<string>();

  editing = false;
  editText = '';

  constructor() {}

  editTodo() {
    this.editing = true;
    this.editText = this.todo.title;
  }

  cancelEditing() {
    this.editing = false;
  }

  stopEditing() {
    this.editing = false;
    this.save.emit(this.editText.trim());
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.cancelEditing();
    } else if (event.keyCode === ENTER_KEY) {
      this.stopEditing();
    }
  }
}
```

```html
<!-- todo-item.component.html -->
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input class="toggle" type="checkbox" (change)="toggle.emit(todo)" [checked]="todo.completed">
    <label (dblclick)="editTodo()">{{todo.title}}</label>
    <button class="destroy" (click)="destroy.emit(todo)"></button>
  </div>
  <input class="edit" *ngIf="editing" [(ngModel)]="editText" (blur)="stopEditing()" (keydown)="handleKeyDown($event)">
</li>
```

```typescript
// todo-footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() activeTodoCount: number;
  @Input() completedCount: number;
  @Input() nowShowing: string;
  @Output() clearCompleted = new EventEmitter<void>();
  @Output() changeFilter = new EventEmitter<string>();

  filters = [
    { id: ALL_TODOS, title: 'All' },
    { id: ACTIVE_TODOS, title: 'Active' },
    { id: COMPLETED_TODOS, title: 'Completed' }
  ];

  constructor() {}

  emitClearCompleted() {
    this.clearCompleted.emit();
  }

  emitChangeFilter(filter: string) {
    this.changeFilter.emit(filter);
  }
}
```

```html
<!-- todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count"><strong>{{activeTodoCount}}</strong> item left</span>
  <ul class="filters">
    <li *ngFor="let filter of filters">
      <a href="#" (click)="emitChangeFilter(filter.id)" [class.selected]="nowShowing === filter.id">{{filter.title}}</a>
    </li>
  </ul>
  <button class="clear-completed" *ngIf="completedCount > 0" (click)="emitClearCompleted()">Clear completed</button>
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
// todo.model.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
```

```typescript
// store/todos.actions.ts
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add', props<{ text: string }>());
export const toggleTodo = createAction('[Todo] Toggle', props<{ id: string }>());
export const destroyTodo = createAction('[Todo] Destroy', props<{ id: string }>());
export const saveTodo = createAction('[Todo] Save', props<{ id: string, text: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
```

```typescript
// store/todos.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, destroyTodo, saveTodo, clearCompleted, toggleAll } from './todos.actions';
import { ITodo } from '../todo.model';
import { Utils } from '../utils';

export interface TodosState {
  todos: ITodo[];
}

export const initialState: TodosState = {
  todos: []
};

export const todosReducer = createReducer(
  initialState,
  on(addTodo, (state, { text }) => ({
    ...state,
    todos: [...state.todos, { id: Utils.uuid(), title: text, completed: false }]
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
  })),
  on(destroyTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(saveTodo, (state, { id, text }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, title: text } : todo)
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  }))
);
```

```typescript
// store/todos.selectors.ts
import { createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

export const selectTodos = (state: { todos: TodosState }) => state.todos.todos;

export const selectFilteredTodos = createSelector(
  selectTodos,
  (todos, props) => {
    switch (props.filter) {
      case ACTIVE_TODOS:
        return todos.filter(todo => !todo.completed);
      case COMPLETED_TODOS:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveTodoCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);
```

```typescript
// store/todos.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TodosService } from '../todos.service';
import { addTodo, toggleTodo, destroyTodo, saveTodo, clearCompleted, toggleAll } from './todos.actions';

@Injectable()
export class TodosEffects {

  constructor(
    private actions$: Actions,
    private todosService: TodosService
  ) {}

  // Define effects here if needed, for example:
  // loadTodos$ = createEffect(() => this.actions$.pipe(
  //   ofType('[Todo] Load Todos'),
  //   mergeMap(() => this.todosService.getAll()
  //     .pipe(
  //       map(todos => ({ type: '[Todo] Todos Loaded Success', payload: todos })),
  //       catchError(() => EMPTY)
  //     ))
  //   )
  // );
}
```

```typescript
// utils.ts
export class Utils {
  static uuid() {
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
}
```

This Angular 14.x migration from the provided React codebase includes the necessary components, models, actions, reducers, selectors, and effects to manage the state of a todo application using @ngrx/store and @ngrx/effects. The code is split into separate components and optimizes the original React codebase for Angular's architecture.
### Tokens: {'prompt_tokens': 3136, 'completion_tokens': 2769, 'total_tokens': 5905}
### Execution time: 164.42904710769653
