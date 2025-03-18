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
```typescript
// app.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TodoModel } from './todoModel';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { ITodo } from './interfaces';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  nowShowing: string = ALL_TODOS;
  editing: string | null = null;
  @ViewChild('newField') newField: ElementRef;

  constructor(public model: TodoModel) {}

  ngOnInit() {
    this.model.subscribe(() => {}); // Dummy subscription, triggers change detection
    this.onUrlChange();

      // Setup router (simulated with hash changes)
    window.addEventListener('hashchange', () => this.onUrlChange());
  }

    ngAfterViewInit() {
        fromEvent(this.newField.nativeElement, 'keyup')
          .pipe(
            filter((event: KeyboardEvent) => event.key === 'Enter'),
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => this.handleNewTodoKeyDown())
          )
          .subscribe();
    }

  onUrlChange() {
      const path = window.location.hash.replace('#', '');
      switch (path) {
          case '/active':
              this.nowShowing = ACTIVE_TODOS;
              break;
          case '/completed':
              this.nowShowing = COMPLETED_TODOS;
              break;
          default:
              this.nowShowing = ALL_TODOS;
      }
  }

  handleNewTodoKeyDown() {
    const val = this.newField.nativeElement.value.trim();
    if (val) {
      this.model.addTodo(val);
      this.newField.nativeElement.value = '';
    }
  }

  toggleAll(checked: boolean) {
    this.model.toggleAll(checked);
  }

  toggle(todoToToggle: ITodo) {
    this.model.toggle(todoToToggle);
  }

  destroy(todo: ITodo) {
    this.model.destroy(todo);
  }

  edit(todo: ITodo) {
    this.editing = todo.id;
  }

  save(todoToSave: ITodo, text: string) {
    this.model.save(todoToSave, text);
    this.editing = null;
  }

  cancel() {
    this.editing = null;
  }

  clearCompleted() {
    this.model.clearCompleted();
  }

  get shownTodos() {
    return this.model.todos.filter(todo => {
      switch (this.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }

    get activeTodoCount() {
        return this.model.todos.reduce((accum, todo) => todo.completed ? accum : accum + 1, 0);
    }

    get completedCount() {
        return this.model.todos.length - this.activeTodoCount;
    }
}
```

```html
<!-- app.component.html -->
<div>
  <header class="header">
    <h1>todos</h1>
    <input
      #newField
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
    />
  </header>
  <section class="main" *ngIf="model.todos.length">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      (change)="toggleAll($event.target.checked)"
      [checked]="activeTodoCount === 0"
    />
    <label htmlFor="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of shownTodos"
        [key]="todo.id"
        [todo]="todo"
        (onToggle)="toggle(todo)"
        (onDestroy)="destroy(todo)"
        (onEdit)="edit(todo)"
        [editing]="editing === todo.id"
        (onSave)="save($event.todo, $event.text)"
        (onCancel)="cancel()"
      ></app-todo-item>
    </ul>
  </section>
  <app-todo-footer
    *ngIf="activeTodoCount || completedCount"
    [count]="activeTodoCount"
    [completedCount]="completedCount"
    [nowShowing]="nowShowing"
    (onClearCompleted)="clearCompleted()"
  ></app-todo-footer>
</div>

```

```typescript
// todo-item.component.ts
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ITodo } from './interfaces';
import { ESCAPE_KEY, ENTER_KEY } from './constants';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements AfterViewInit, OnChanges {
  @Input() todo: ITodo;
  @Input() editing: boolean;
  @Output() onToggle = new EventEmitter<void>();
  @Output() onDestroy = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{ todo: ITodo, text: string }>();
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('editField') editField: ElementRef;

  editText: string;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.editing && changes.editing.currentValue) {
            setTimeout(() => { // Delay to ensure DOM update
                this.editField.nativeElement.focus();
                this.editField.nativeElement.setSelectionRange(this.editText.length, this.editText.length);
            });
        }
    }

  constructor() {
      this.editText = '';
  }

  ngAfterViewInit() {}

  handleSubmit() {
    const val = this.editText.trim();
    if (val) {
      this.onSave.emit({ todo: this.todo, text: val });
      this.editText = val;
    } else {
      this.onDestroy.emit();
    }
  }

  handleEdit() {
    this.onEdit.emit();
    this.editText = this.todo.title;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.onCancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event: any) {
    this.editText = event.target.value;
  }
}
```

```html
<!-- todo-item.component.html -->
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggle.emit()"
    />
    <label (dblclick)="handleEdit()">{{todo.title}}</label>
    <button class="destroy" (click)="onDestroy.emit()"></button>
  </div>
  <input
    #editField
    class="edit"
    [value]="editText"
    (blur)="handleSubmit()"
    (input)="handleChange($event)"
    (keydown)="handleKeyDown($event)"
  />
</li>

```

```typescript
// footer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class TodoFooterComponent {
  @Input() count: number;
  @Input() completedCount: number;
  @Input() nowShowing: string;
  @Output() onClearCompleted = new EventEmitter<void>();

  Utils = Utils; // Make Utils available to the template

    clearCompleted() {
        this.onClearCompleted.emit();
    }
}
```

```html
<!-- footer.component.html -->
<footer class="footer" *ngIf="count || completedCount">
  <span class="todo-count">
    <strong>{{count}}</strong> {{Utils.pluralize(count, 'item')}} left
  </span>
  <ul class="filters">
    <li>
      <a
        href="#/"
        [class.selected]="nowShowing === ALL_TODOS">
          All
      </a>
    </li>
    {' '}
    <li>
      <a
        href="#/active"
        [class.selected]="nowShowing === ACTIVE_TODOS">
          Active
      </a>
    </li>
    {' '}
    <li>
      <a
        href="#/completed"
        [class.selected]="nowShowing === COMPLETED_TODOS">
          Completed
      </a>
    </li>
  </ul>
  <button
    *ngIf="completedCount > 0"
    class="clear-completed"
    (click)="clearCompleted()">
    Clear completed
  </button>
</footer>

```

```typescript
// utils.ts
export class Utils {
  public static uuid(): string {
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

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs: any[]): any {
    const newObj = {};
    for (const obj of objs) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
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
// todoModel.ts
import { Injectable } from '@angular/core';
import { Utils } from './utils';
import { ITodo } from './interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoModel {
  public key: string;
  public todos: Array<ITodo>;
  private _todosSubject: BehaviorSubject<ITodo[]> = new BehaviorSubject<ITodo[]>([]);

  constructor() {
    this.key = 'react-todos';
    this.todos = Utils.store(this.key);
    this._todosSubject.next(this.todos); // Initial value
  }

    subscribe(onChange: () => void) {
        return this._todosSubject.subscribe(onChange);
    }

  inform() {
    Utils.store(this.key, this.todos);
    this._todosSubject.next(this.todos); // Notify subscribers
  }

  addTodo(title: string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  toggleAll(checked: boolean) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return Utils.extend({}, todo, { completed: checked });
    });

    this.inform();
  }

  toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, { completed: !todo.completed });
    });

    this.inform();
  }

  destroy(todo: ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text });
    });

    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}
```

```typescript
// interfaces.ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}
```

```css
/* app.component.css, todo-item.component.css, footer.component.css */
/* You should migrate your existing CSS to these files.  I'm leaving them empty
   as the CSS migration is straightforward and doesn't involve logic changes. */

```

```typescript
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFooterComponent } from './footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```


### Tokens: {'input_tokens': 3817, 'output_tokens': 3562}
### Execution time: 31.664661169052124
