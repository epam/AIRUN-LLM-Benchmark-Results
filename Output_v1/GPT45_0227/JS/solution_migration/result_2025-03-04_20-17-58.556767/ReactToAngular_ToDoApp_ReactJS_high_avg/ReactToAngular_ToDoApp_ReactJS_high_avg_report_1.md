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
### app.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TodoModel } from './todo.model';
import { TodoActions } from './store/todo.actions';
import { selectFilteredTodos, selectActiveCount, selectCompletedCount } from './store/todo.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  todos$: Observable<TodoModel[]>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  editingId: string | null = null;
  filter: string = 'all';

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.store.dispatch(TodoActions.setFilter({ filter: this.filter }));
    });

    this.todos$ = this.store.select(selectFilteredTodos);
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  addTodo(title: string) {
    if (title.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title }));
    }
  }

  toggleAll(completed: boolean) {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }

  toggle(todo: TodoModel) {
    this.store.dispatch(TodoActions.toggleTodo({ id: todo.id }));
  }

  destroy(todo: TodoModel) {
    this.store.dispatch(TodoActions.deleteTodo({ id: todo.id }));
  }

  edit(todo: TodoModel) {
    this.editingId = todo.id;
  }

  save(todo: TodoModel, title: string) {
    if (title.trim()) {
      this.store.dispatch(TodoActions.updateTodo({ id: todo.id, title }));
    } else {
      this.destroy(todo);
    }
    this.editingId = null;
  }

  cancel() {
    this.editingId = null;
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

### app.component.html
```html
<header class="header">
  <h1>todos</h1>
  <input class="new-todo" placeholder="What needs to be done?" autofocus (keyup.enter)="addTodo($event.target.value); $event.target.value=''" />
</header>

<section class="main" *ngIf="(todos$ | async)?.length">
  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="(activeCount$ | async) === 0" (change)="toggleAll($event.target.checked)" />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of todos$ | async"
      [todo]="todo"
      [editing]="editingId === todo.id"
      (toggle)="toggle(todo)"
      (destroy)="destroy(todo)"
      (edit)="edit(todo)"
      (save)="save(todo, $event)"
      (cancel)="cancel()"
    ></app-todo-item>
  </ul>
</section>

<app-footer
  *ngIf="(activeCount$ | async) + (completedCount$ | async) > 0"
  [activeCount]="activeCount$ | async"
  [completedCount]="completedCount$ | async"
  [currentFilter]="filter"
  (clearCompleted)="clearCompleted()"
></app-footer>
```

### todo-item.component.ts
```typescript
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { TodoModel } from './todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input() todo: TodoModel;
  @Input() editing: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() destroy = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editInput') editInput: ElementRef;
  editText: string;

  ngAfterViewChecked() {
    if (this.editing && this.editInput) {
      this.editInput.nativeElement.focus();
      this.editInput.nativeElement.setSelectionRange(this.editText.length, this.editText.length);
    }
  }

  startEdit() {
    this.editText = this.todo.title;
    this.edit.emit();
  }

  submitEdit() {
    this.save.emit(this.editText);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancel.emit();
    } else if (event.key === 'Enter') {
      this.submitEdit();
    }
  }
}
```

### todo-item.component.html
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggle.emit()" />
    <label (dblclick)="startEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="destroy.emit()"></button>
  </div>
  <input
    #editInput
    class="edit"
    [(ngModel)]="editText"
    (blur)="submitEdit()"
    (keydown)="handleKeydown($event)"
  />
</li>
```

### footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  @Input() activeCount: number;
  @Input() completedCount: number;
  @Input() currentFilter: string;
  @Output() clearCompleted = new EventEmitter<void>();

  pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }
}
```

### footer.component.html
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ activeCount }}</strong> {{ pluralize(activeCount, 'item') }} left
  </span>
  <ul class="filters">
    <li><a routerLink="/" [class.selected]="currentFilter === 'all'">All</a></li>
    <li><a routerLink="/active" [class.selected]="currentFilter === 'active'">Active</a></li>
    <li><a routerLink="/completed" [class.selected]="currentFilter === 'completed'">Completed</a></li>
  </ul>
  <button class="clear-completed" *ngIf="completedCount > 0" (click)="clearCompleted.emit()">Clear completed</button>
</footer>
```

### todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const TodoActions = {
  addTodo: createAction('[Todo] Add Todo', props<{ title: string }>()),
  toggleTodo: createAction('[Todo] Toggle Todo', props<{ id: string }>()),
  deleteTodo: createAction('[Todo] Delete Todo', props<{ id: string }>()),
  updateTodo: createAction('[Todo] Update Todo', props<{ id: string; title: string }>()),
  toggleAll: createAction('[Todo] Toggle All', props<{ completed: boolean }>()),
  clearCompleted: createAction('[Todo] Clear Completed'),
  setFilter: createAction('[Todo] Set Filter', props<{ filter: string }>()),
};
```

### todo.selectors.ts
```typescript
import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectTodos = (state: AppState) => state.todos.items;
export const selectFilter = (state: AppState) => state.todos.filter;

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos, filter) => todos.filter(todo => filter === 'all' || (filter === 'active' && !todo.completed) || (filter === 'completed' && todo.completed))
);

export const selectActiveCount = createSelector(selectTodos, todos => todos.filter(todo => !todo.completed).length);
export const selectCompletedCount = createSelector(selectTodos, todos => todos.filter(todo => todo.completed).length);
```

### Tokens: {'input_tokens': 3269, 'output_tokens': 1841, 'reasoning_tokens': 0}
### Execution time: 46.03243088722229
