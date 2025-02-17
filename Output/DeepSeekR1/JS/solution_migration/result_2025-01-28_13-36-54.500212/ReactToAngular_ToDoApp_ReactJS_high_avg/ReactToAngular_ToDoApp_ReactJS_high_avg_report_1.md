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
Okay, I need to migrate this React code to Angular 14.x. Let me start by understanding the structure of the React app. The main components are TodoApp, TodoItem, TodoFooter, and the TodoModel. The React code uses state and props, and there's a router handling the different views. 

First, I'll consider Angular's component structure. The TodoApp in React is the root component, so in Angular, that would be the AppComponent. I'll need to create components for TodoItem and TodoFooter as well. 

The React code uses a TodoModel class to manage state. In Angular, using @ngrx/store for state management would be appropriate. So I'll set up a store with actions, reducers, and selectors. The model's methods like addTodo, toggleAll, etc., will become actions. 

Looking at the TodoModel, it uses localStorage via Utils.store. In the Angular version, I can handle this with an effect that persists the state to localStorage whenever the todos change. The initial state can be loaded from localStorage in the reducer.

The routing in React is handled by a router that updates the nowShowing state. In Angular, I'll use the RouterModule to define routes for '/', '/active', and '/completed'. The component will listen to route changes to determine which todos to display.

For the TodoItem component, in React it uses refs and ReactDOM.findDOMNode. Angular uses ViewChild for element references, so I'll adjust that. The double-click to edit and input handling can be managed with Angular's event bindings.

The TodoFooter component has links that change the route. In Angular, I'll use routerLink directives for these links and apply classes based on the current route.

I need to replace React's setState with Angular's state management via @ngrx/store. The components will dispatch actions and use selectors to get the current state.

Let me start by creating the store setup. The state will include todos, nowShowing, and editing. Actions will be defined for each state modification: add, toggle, toggleAll, destroy, save, clearCompleted, setFilter, and setEditing.

The reducer will handle these actions, updating the state accordingly. The persistence effect will listen for any actions that change the todos and save them to localStorage.

In the AppComponent, I'll subscribe to the store's selectors for filteredTodos, activeTodoCount, completedCount, and nowShowing. The template will render the main section and footer based on these values.

The TodoItem component will handle editing. When the user double-clicks, it will dispatch setEditing with the todo's id. The input field will be focused using Angular's ViewChild and ngAfterViewChecked lifecycle hook, similar to React's componentDidUpdate.

The TodoFooter component will display counts and clear completed button, using routerLink for navigation and applying active classes based on the current route.

I'll also need to update the Utils class to fit Angular's services. However, since the problem states to assume non-provided code is migrated, I'll focus on the given files.

Testing each part: ensure actions are correctly dispatched, the reducer updates state, and components reflect the state changes. Also, check that routing properly filters the todos and the localStorage persistence works.

Finally, make sure all event handlers are converted to Angular's syntax, like (keydown) instead of onKeyDown, and use Angular forms for input handling where necessary.
</think>

app.component.ts
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { TodoModel } from './todoModel';
import { AppState } from './app.state';
import { addTodo, toggleAll, clearCompleted, setFilter } from './todo.actions';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          (keydown.enter)="handleNewTodoKeyDown($event)"
          autofocus
          #newTodoInput
        />
      </header>
      <section class="main" *ngIf="todos$ | async as todos">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          [checked]="(activeTodoCount$ | async) === 0"
          (change)="toggleAll($event)"
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <app-todo-item
            *ngFor="let todo of filteredTodos$ | async"
            [todo]="todo"
            [editing]="(editing$ | async) === todo.id"
            (toggle)="toggle(todo)"
            (destroy)="destroy(todo)"
            (edit)="edit(todo)"
            (save)="save(todo, $event)"
            (cancel)="cancel()"
          ></app-todo-item>
        </ul>
      </section>
      <app-todo-footer
        *ngIf="(activeTodoCount$ | async) + (completedCount$ | async) > 0"
        [count]="activeTodoCount$ | async"
        [completedCount]="completedCount$ | async"
        [nowShowing]="nowShowing$ | async"
        (clearCompleted)="clearCompleted()"
      ></app-todo-footer>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  todos$: Observable<ITodo[]>;
  filteredTodos$: Observable<ITodo[]>;
  activeTodoCount$: Observable<number>;
  completedCount$: Observable<number>;
  nowShowing$: Observable<string>;
  editing$: Observable<string | null>;
  private routerSub: Subscription;

  constructor(private store: Store<AppState>, private router: Router) {
    this.todos$ = store.select('todos');
    this.filteredTodos$ = store.select('filteredTodos');
    this.activeTodoCount$ = store.select('activeTodoCount');
    this.completedCount$ = store.select('completedCount');
    this.nowShowing$ = store.select('nowShowing');
    this.editing$ = store.select('editing');
  }

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const route = event.urlAfterRedirects.split('/').pop();
        this.store.dispatch(setFilter({ filter: route || ALL_TODOS }));
      }
    });
  }

  handleNewTodoKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const val = input.value.trim();
    if (val) {
      this.store.dispatch(addTodo({ title: val }));
      input.value = '';
    }
  }

  toggleAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(toggleAll({ completed: target.checked }));
  }

  toggle(todo: ITodo) {
    this.store.dispatch(toggle({ todo }));
  }

  destroy(todo: ITodo) {
    this.store.dispatch(destroy({ todo }));
  }

  edit(todo: ITodo) {
    this.store.dispatch(setEditing({ id: todo.id }));
  }

  save(todo: ITodo, text: string) {
    this.store.dispatch(save({ todo, text }));
  }

  cancel() {
    this.store.dispatch(setEditing({ id: null }));
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
```

todo-item.component.ts
```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="toggle.emit(todo)"
        />
        <label (dblclick)="handleEdit()">{{todo.title}}</label>
        <button class="destroy" (click)="destroy.emit(todo)"></button>
      </div>
      <input
        class="edit"
        #editInput
        [value]="editText"
        (blur)="handleSubmit()"
        (input)="editText = $event.target.value"
        (keydown)="handleKeyDown($event)"
      />
    </li>
  `
})
export class TodoItemComponent implements AfterViewChecked {
  @Input() todo: ITodo;
  @Input() editing: boolean;
  @Output() toggle = new EventEmitter<ITodo>();
  @Output() destroy = new EventEmitter<ITodo>();
  @Output() edit = new EventEmitter<ITodo>();
  @Output() save = new EventEmitter<{ todo: ITodo; text: string }>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild('editInput') editInput: ElementRef;

  editText: string;

  ngAfterViewChecked() {
    if (this.editing && this.editInput) {
      this.editInput.nativeElement.focus();
      this.editInput.nativeElement.setSelectionRange(
        this.editText.length,
        this.editText.length
      );
    }
  }

  handleEdit() {
    this.editText = this.todo.title;
    this.edit.emit(this.todo);
  }

  handleSubmit() {
    const text = this.editText.trim();
    if (text) {
      this.save.emit({ todo: this.todo, text });
    } else {
      this.destroy.emit(this.todo);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
}
```

todo-footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Utils } from './utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{count}}</strong> {{activeTodoWord}} left
      </span>
      <ul class="filters">
        <li>
          <a [routerLink]="['/']" [class.selected]="nowShowing === ALL_TODOS">All</a>
        </li>
        <li>
          <a [routerLink]="['/active']" [class.selected]="nowShowing === ACTIVE_TODOS">Active</a>
        </li>
        <li>
          <a [routerLink]="['/completed']" [class.selected]="nowShowing === COMPLETED_TODOS">Completed</a>
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
  `
})
export class TodoFooterComponent {
  @Input() count: number;
  @Input() completedCount: number;
  @Input() nowShowing: string;
  @Output() clearCompleted = new EventEmitter<void>();

  ALL_TODOS = ALL_TODOS;
  ACTIVE_TODOS = ACTIVE_TODOS;
  COMPLETED_TODOS = COMPLETED_TODOS;

  get activeTodoWord() {
    return Utils.pluralize(this.count, 'item');
  }
}
```

todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { ITodo } from './todoModel';

export const addTodo = createAction('[Todo] Add', props<{ title: string }>());
export const toggle = createAction('[Todo] Toggle', props<{ todo: ITodo }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const destroy = createAction('[Todo] Destroy', props<{ todo: ITodo }>());
export const save = createAction('[Todo] Save', props<{ todo: ITodo; text: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
export const setEditing = createAction('[Todo] Set Editing', props<{ id: string | null }>());
```

todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Utils } from './utils';
import * as TodoActions from './todo.actions';
import { ALL_TODOS } from './constants';

const initialState: AppState = {
  todos: Utils.store('angular-todos'),
  nowShowing: ALL_TODOS,
  editing: null,
  filteredTodos: [],
  activeTodoCount: 0,
  completedCount: 0
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Utils.uuid(), title, completed: false }]
  })),
  on(TodoActions.toggle, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t === todo ? { ...t, completed: !t.completed } : t)
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(t => ({ ...t, completed }))
  })),
  on(TodoActions.destroy, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(t => t !== todo)
  })),
  on(TodoActions.save, (state, { todo, text }) => ({
    ...state,
    todos: state.todos.map(t => t === todo ? { ...t, title: text } : t)
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(t => !t.completed)
  })),
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    nowShowing: filter,
    filteredTodos: filterTodos(state.todos, filter)
  })),
  on(TodoActions.setEditing, (state, { id }) => ({
    ...state,
    editing: id
  })),
);

function filterTodos(todos: ITodo[], filter: string): ITodo[] {
  switch (filter) {
    case ACTIVE_TODOS:
      return todos.filter(todo => !todo.completed);
    case COMPLETED_TODOS:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
```

app.state.ts
```typescript
import { ITodo } from './todoModel';

export interface AppState {
  todos: ITodo[];
  nowShowing: string;
  editing: string | null;
  filteredTodos: ITodo[];
  activeTodoCount: number;
  completedCount: number;
}

export const selectTodos = (state: AppState) => state.todos;
export const selectFilteredTodos = (state: AppState) => state.filteredTodos;
export const selectActiveTodoCount = (state: AppState) =>
  state.todos.reduce((count, todo) => todo.completed ? count : count + 1, 0);
export const selectCompletedCount = (state: AppState) =>
  state.todos.length - selectActiveTodoCount(state);
export const selectNowShowing = (state: AppState) => state.nowShowing;
export const selectEditing = (state: AppState) => state.editing;
```

todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Utils } from './utils';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggle,
        TodoActions.toggleAll,
        TodoActions.destroy,
        TodoActions.save,
        TodoActions.clearCompleted
      ),
      tap(action => Utils.store('angular-todos', action.todos))
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```

### Tokens: {'input_tokens': 3355, 'output_tokens': 3720}
### Execution time: 220.28521084785461
