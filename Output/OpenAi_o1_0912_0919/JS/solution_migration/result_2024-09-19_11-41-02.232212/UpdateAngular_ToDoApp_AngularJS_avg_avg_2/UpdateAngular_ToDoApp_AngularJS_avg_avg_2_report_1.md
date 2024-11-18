I have the following Angular app code:

index.html
```html
<!doctype html>
<html lang="en" data-framework="angularjs">
	<head>
		<meta charset="utf-8">
		<title>AngularJS & RequireJS • TodoMVC</title>
		<link rel="stylesheet" href="node_modules/todomvc-common/base.css">
		<link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
		<style>[ng-cloak] { display: none; }</style>
	</head>
	<body>
		<section class="todoapp" ng-controller="TodoController">
			<header class="header">
				<h1>todos</h1>
				<form class="todo-form" ng-submit="addTodo()">
					<input class="new-todo" placeholder="What needs to be done?" ng-model="newTodo" autofocus>
				</form>
			</header>
			<section class="main" ng-show="todos.length" ng-cloak>
				<input id="toggle-all" class="toggle-all" type="checkbox" ng-model="allChecked" ng-click="markAll(allChecked)">
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<li ng-repeat="todo in todos | filter:statusFilter track by $index" ng-class="{completed: todo.completed, editing: todo == editedTodo}">
						<div class="view">
							<input class="toggle" type="checkbox" ng-model="todo.completed">
							<label ng-dblclick="editTodo(todo)">{{todo.title}}</label>
							<button class="destroy" ng-click="removeTodo(todo)"></button>
						</div>
						<form ng-submit="doneEditing(todo)">
							<input class="edit" ng-trim="false" ng-model="todo.title" ng-blur="doneEditing(todo)" todo-escape="revertEditing(todo)" todo-focus="todo == editedTodo">
						</form>
					</li>
				</ul>
			</section>
			<footer class="footer" ng-show="todos.length" ng-cloak>
				<span class="todo-count"><strong>{{remainingCount}}</strong>
					<ng-pluralize count="remainingCount" when="{ one: 'item left', other: 'items left' }"></ng-pluralize>
				</span>
				<ul class="filters">
					<li>
						<a ng-class="{selected: location.path() == '/'} " href="#/">All</a>
					</li>
					<li>
						<a ng-class="{selected: location.path() == '/active'}" href="#/active">Active</a>
					</li>
					<li>
						<a ng-class="{selected: location.path() == '/completed'}" href="#/completed">Completed</a>
					</li>
				</ul>
				<button class="clear-completed" ng-click="clearDoneTodos()" ng-show="remainingCount < todos.length">Clear completed</button>
			</footer>
		</section>
		<footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Credits:
				<a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
				<a href="http://ericbidelman.com">Eric Bidelman</a>,
				<a href="http://jacobmumm.com">Jacob Mumm</a>,
				<a href="http://blog.igorminar.com">Igor Minar</a> and
				<a href="http://twitter.com/passy">Pascal Hartig</a>
			</p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
		<script src="node_modules/todomvc-common/base.js"></script>
		<script data-main="js/main" src="node_modules/requirejs/require.js"></script>
	</body>
</html>

```

js\app.js
```js
/*global require*/
'use strict';

require([
	'angular'
], function (angular) {
	require([
		'controllers/todo', 
		'directives/todoFocus', 
		'directives/todoEscape',
		'services/todoStorage'
	], function (todoCtrl, todoFocusDir, todoEscapeDir, todoStorageSrv) {
		angular
			.module('todomvc', [todoFocusDir, todoEscapeDir, todoStorageSrv])
			.controller('TodoController', todoCtrl);
		angular.bootstrap(document, ['todomvc']);			
	});	
});

```

js\main.js
```js
/*global require*/
'use strict';

require.config({
	paths: {
		angular: '../node_modules/angular/angular'
	},
	shim: {
		angular: {
			exports: 'angular'
		}
	},
	deps: ['app']
});

```

js\controllers\todo.js
```js
/*global define*/
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
	'angular'
], function (angular) {
	return ['$scope', '$location', 'todoStorage', 'filterFilter',
		function ($scope, $location, todoStorage, filterFilter) {
			var todos = $scope.todos = todoStorage.get();

			$scope.newTodo = '';
			$scope.editedTodo = null;

			$scope.$watch('todos', function () {
				$scope.remainingCount = filterFilter(todos, { completed: false }).length;
				$scope.doneCount = todos.length - $scope.remainingCount;
				$scope.allChecked = !$scope.remainingCount;
				todoStorage.put(todos);
			}, true);

			if ($location.path() === '') {
				$location.path('/');
			}

			$scope.location = $location;

			$scope.$watch('location.path()', function (path) {
				$scope.statusFilter = (path === '/active') ?
					{ completed: false } : (path === '/completed') ?
					{ completed: true } : null;
			});


			$scope.addTodo = function () {
				var newTodo = $scope.newTodo.trim();
				if (!newTodo.length) {
					return;
				}

				todos.push({
					title: newTodo,
					completed: false
				});

				$scope.newTodo = '';
			};


			$scope.editTodo = function (todo) {
				$scope.editedTodo = todo;
				// Clone the original todo to restore it on demand.
				$scope.originalTodo = angular.copy(todo);
			};


			$scope.doneEditing = function (todo) {
				$scope.editedTodo = null;
				todo.title = todo.title.trim();

				if (!todo.title) {
					$scope.removeTodo(todo);
				}
			};

			$scope.revertEditing = function (todo) {
				todos[todos.indexOf(todo)] = $scope.originalTodo;
				$scope.doneEditing($scope.originalTodo);
			};

			$scope.removeTodo = function (todo) {
				todos.splice(todos.indexOf(todo), 1);
			};


			$scope.clearDoneTodos = function () {
				$scope.todos = todos = todos.filter(function (val) {
					return !val.completed;
				});
			};


			$scope.markAll = function (done) {
				todos.forEach(function (todo) {
					todo.completed = done;
				});
			};
		}
	];
});

```

js\directives\todoEscape.js
```js
/*global define*/
'use strict';

/**
 * Directive that catches the "Escape" key on the element applied to and evaluates the expression it binds to.
 */

define([
	'angular'
], function (angular) {
	var moduleName = 'TodoEscapeDirective';
	angular
		.module(moduleName, [])
		.directive('todoEscape', function () {
			var ESCAPE_KEY = 27;

			return function (scope, elem, attrs) {
				elem.bind('keydown', function (event) {
					if (event.keyCode === ESCAPE_KEY) {
						scope.$apply(attrs.todoEscape);
					}
				});

				scope.$on('$destroy', function () {
					elem.unbind('keydown');
				});
			};
		});
	return moduleName;
});

```

js\directives\todoFocus.js
```js
/*global define*/
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
 */
 
define([
	'angular'
], function (angular) {
	var moduleName = 'TodoFocusDirective';
	angular
		.module(moduleName, [])
		.directive('todoFocus', ['$timeout', function ($timeout) {
			return function (scope, elem, attrs) {
				scope.$watch(attrs.todoFocus, function (newval) {
					if (newval) {
						$timeout(function () {
							elem[0].focus();
						}, 0, false);
					}
				});
			};
		}]);
	return moduleName;
});

```

js\services\todoStorage.js
```js
/*global define*/
'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage.
 */
 
define([
	'angular'
], function (angular) {
	var moduleName = 'TodoStorageModule';
	angular
		.module(moduleName, [])
		.factory('todoStorage', function () {
			var STORAGE_ID = 'todos-angularjs-requirejs';

			return {
				get: function () {
					return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
				},

				put: function (todos) {
					localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
				}
			};
		});
	return moduleName;
});

```


Your task is to migrate this code to Angular 14.x.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
Here is the translated codebase:

---

**index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx - TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Styles -->
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">

</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

**src/app/app.module.ts**

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './store/todo.effects';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoEscapeDirective,
    TodoFocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    RouterModule.forRoot([]) // Add routes if needed
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

**src/app/app.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadTodos } from './store/todo.actions';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-list></app-todo-list>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Credits:
          <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
          <a href="http://ericbidelman.com">Eric Bidelman</a>,
          <a href="http://jacobmumm.com">Jacob Mumm</a>,
          <a href="http://blog.igorminar.com">Igor Minar</a> and
          <a href="http://twitter.com/passy">Pascal Hartig</a>
      </p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new LoadTodos());
  }
}
```

---

**src/app/components/todo-list/todo-list.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { AddTodo, ToggleAll, ClearCompleted, SetFilter } from '../../store/todo.actions';
import { getTodos, getRemainingCount, getDoneCount, getAllChecked, getFilter } from '../../store/todo.selectors';
import { ActivatedRoute } from '@angular/router';
import { Filter } from '../../store/todo.reducer';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  newTodo: string = '';
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;
  allChecked$: Observable<boolean>;
  currentFilter$: Observable<Filter>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.todos$ = store.pipe(select(getTodos));
    this.remainingCount$ = store.pipe(select(getRemainingCount));
    this.doneCount$ = store.pipe(select(getDoneCount));
    this.allChecked$ = store.pipe(select(getAllChecked));
    this.currentFilter$ = store.pipe(select(getFilter));
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      let filter: Filter;
      switch (fragment) {
        case 'active':
          filter = 'ACTIVE';
          break;
        case 'completed':
          filter = 'COMPLETED';
          break;
        default:
          filter = 'ALL';
      }
      this.store.dispatch(new SetFilter(filter));
    });
  }

  addTodo() {
    const title = this.newTodo.trim();
    if (title.length) {
      this.store.dispatch(new AddTodo({ title }));
      this.newTodo = '';
    }
  }

  markAll(completed: boolean) {
    this.store.dispatch(new ToggleAll({ completed }));
  }

  clearCompleted() {
    this.store.dispatch(new ClearCompleted());
  }
}
```

---

**src/app/components/todo-list/todo-list.component.html**

```html
<header class="header">
  <h1>todos</h1>
  <form (submit)="addTodo()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
  </form>
</header>
<section class="main" *ngIf="(todos$ | async)?.length">
  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allChecked$ | async" (click)="markAll(!(allChecked$ | async))">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let todo of todos$ | async" [ngClass]="{'completed': todo.completed}">
      <app-todo-item [todo]="todo"></app-todo-item>
    </li>
  </ul>
</section>
<footer class="footer" *ngIf="(todos$ | async)?.length">
  <span class="todo-count"><strong>{{ remainingCount$ | async }}</strong>
    <ng-container *ngIf="(remainingCount$ | async) === 1">item left</ng-container>
    <ng-container *ngIf="(remainingCount$ | async) !== 1">items left</ng-container>
  </span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/']" fragment="" [ngClass]="{'selected': (currentFilter$ | async) === 'ALL'}">All</a>
    </li>
    <li>
      <a [routerLink]="['/']" fragment="active" [ngClass]="{'selected': (currentFilter$ | async) === 'ACTIVE'}">Active</a>
    </li>
    <li>
      <a [routerLink]="['/']" fragment="completed" [ngClass]="{'selected': (currentFilter$ | async) === 'COMPLETED'}">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>
</footer>
```

---

**src/app/components/todo-item/todo-item.component.ts**

```typescript
import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { UpdateTodo, RemoveTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit, AfterViewInit {
  @Input() todo: Todo;
  editedTitle: string;
  editing: boolean = false;
  @ViewChild('editInput') editInput: ElementRef;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.editedTitle = this.todo.title;
  }

  ngAfterViewInit() {
    if (this.editing && this.editInput) {
      this.editInput.nativeElement.focus();
    }
  }

  toggle() {
    this.store.dispatch(new UpdateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));
  }

  editTodo() {
    this.editing = true;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    });
  }

  doneEditing() {
    if (this.editedTitle.trim()) {
      this.store.dispatch(new UpdateTodo({ id: this.todo.id, changes: { title: this.editedTitle.trim() } }));
    } else {
      this.removeTodo();
    }
    this.editing = false;
  }

  revertEditing() {
    this.editedTitle = this.todo.title;
    this.editing = false;
  }

  removeTodo() {
    this.store.dispatch(new RemoveTodo({ id: this.todo.id }));
  }
}
```

---

**src/app/components/todo-item/todo-item.component.html**

```html
<div class="view" *ngIf="!editing">
  <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggle()">
  <label (dblclick)="editTodo()">{{ todo.title }}</label>
  <button class="destroy" (click)="removeTodo()"></button>
</div>
<input class="edit"
       *ngIf="editing"
       #editInput
       [(ngModel)]="editedTitle"
       (blur)="doneEditing()"
       (keyup.enter)="doneEditing()"
       (keyup.escape)="revertEditing()">
```

---

**src/app/directives/todo-escape.directive.ts**

```typescript
import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter<void>();

  @HostListener('keyup', ['$event'])
  onKeyup($event: KeyboardEvent) {
    if ($event.key === 'Escape' || $event.keyCode === 27) {
      this.todoEscape.emit();
    }
  }
}
```

---

**src/app/directives/todo-focus.directive.ts**

```typescript
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus: boolean;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    if (this.todoFocus) {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

---

**src/app/models/todo.model.ts**

```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

---

**src/app/store/index.ts**

```typescript
import { ActionReducerMap } from '@ngrx/store';
import { todoReducer, TodoState } from './todo.reducer';

export interface AppState {
  todos: TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: todoReducer
};
```

---

**src/app/store/todo.actions.ts**

```typescript
import { Action } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export enum TodoActionTypes {
  ADD_TODO = '[Todo] Add Todo',
  REMOVE_TODO = '[Todo] Remove Todo',
  UPDATE_TODO = '[Todo] Update Todo',
  TOGGLE_ALL = '[Todo] Toggle All',
  CLEAR_COMPLETED = '[Todo] Clear Completed',
  LOAD_TODOS = '[Todo] Load Todos',
  LOAD_TODOS_SUCCESS = '[Todo] Load Todos Success',
  SET_FILTER = '[Todo] Set Filter'
}

export class AddTodo implements Action {
  readonly type = TodoActionTypes.ADD_TODO;
  constructor(public payload: { title: string }) {}
}

export class RemoveTodo implements Action {
  readonly type = TodoActionTypes.REMOVE_TODO;
  constructor(public payload: { id: number }) {}
}

export class UpdateTodo implements Action {
  readonly type = TodoActionTypes.UPDATE_TODO;
  constructor(public payload: { id: number; changes: Partial<Todo> }) {}
}

export class ToggleAll implements Action {
  readonly type = TodoActionTypes.TOGGLE_ALL;
  constructor(public payload: { completed: boolean }) {}
}

export class ClearCompleted implements Action {
  readonly type = TodoActionTypes.CLEAR_COMPLETED;
}

export class LoadTodos implements Action {
  readonly type = TodoActionTypes.LOAD_TODOS;
}

export class LoadTodosSuccess implements Action {
  readonly type = TodoActionTypes.LOAD_TODOS_SUCCESS;
  constructor(public payload: { todos: Todo[] }) {}
}

export class SetFilter implements Action {
  readonly type = TodoActionTypes.SET_FILTER;
  constructor(public payload: string) {}
}

export type TodoActions =
  | AddTodo
  | RemoveTodo
  | UpdateTodo
  | ToggleAll
  | ClearCompleted
  | LoadTodos
  | LoadTodosSuccess
  | SetFilter;
```

---

**src/app/store/todo.reducer.ts**

```typescript
import { Todo } from '../models/todo.model';
import { TodoActions, TodoActionTypes } from './todo.actions';

export type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED';

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}

const initialState: TodoState = {
  todos: [],
  filter: 'ALL'
};

let nextId = 0;

export function todoReducer(state = initialState, action: TodoActions): TodoState {
  switch (action.type) {
    case TodoActionTypes.ADD_TODO:
      const newTodo: Todo = {
        id: nextId++,
        title: action.payload.title,
        completed: false
      };
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };

    case TodoActionTypes.REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case TodoActionTypes.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload.changes } : todo
        )
      };

    case TodoActionTypes.TOGGLE_ALL:
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: action.payload.completed }))
      };

    case TodoActionTypes.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    case TodoActionTypes.LOAD_TODOS_SUCCESS:
      return {
        ...state,
        todos: action.payload.todos
      };

    case TodoActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload as Filter
      };

    default:
      return state;
  }
}
```

---

**src/app/store/todo.effects.ts**

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TodoActionTypes, LoadTodosSuccess, LoadTodos } from './todo.actions';
import { of } from 'rxjs';
import { Todo } from '../models/todo.model';
import { Store } from '@ngrx/store';
import { AppState } from './index';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActionTypes.LOAD_TODOS),
      switchMap(() => {
        const todos: Todo[] = JSON.parse(localStorage.getItem('todos-angular') || '[]');
        return of(new LoadTodosSuccess({ todos }));
      })
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActionTypes.ADD_TODO,
          TodoActionTypes.REMOVE_TODO,
          TodoActionTypes.UPDATE_TODO,
          TodoActionTypes.TOGGLE_ALL,
          TodoActionTypes.CLEAR_COMPLETED
        ),
        withLatestFrom(this.store.select(state => state.todos.todos)),
        tap(([action, todos]) => {
          localStorage.setItem('todos-angular', JSON.stringify(todos));
        })
      ),
    { dispatch: false }
  );
}
```

---

**src/app/store/todo.selectors.ts**

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodosState = createFeatureSelector<TodoState>('todos');

export const getTodos = createSelector(
  selectTodosState,
  (state: TodoState) => {
    switch (state.filter) {
      case 'ACTIVE':
        return state.todos.filter(todo => !todo.completed);
      case 'COMPLETED':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }
);

export const getRemainingCount = createSelector(
  selectTodosState,
  (state: TodoState) => state.todos.filter(todo => !todo.completed).length
);

export const getDoneCount = createSelector(
  selectTodosState,
  (state: TodoState) => state.todos.filter(todo => todo.completed).length
);

export const getAllChecked = createSelector(
  getRemainingCount,
  (remainingCount) => remainingCount === 0
);

export const getFilter = createSelector(
  selectTodosState,
  (state: TodoState) => state.filter
);
```

---

This completes the migration of the provided AngularJS code to Angular 14 using @ngrx/store and @ngrx/effects, split into separate components, and optimized where possible.

### Tokens: {'input_tokens': 2401, 'output_tokens': 9490, 'reasoning_tokens': 5568}
### Execution time: 95.32423996925354
