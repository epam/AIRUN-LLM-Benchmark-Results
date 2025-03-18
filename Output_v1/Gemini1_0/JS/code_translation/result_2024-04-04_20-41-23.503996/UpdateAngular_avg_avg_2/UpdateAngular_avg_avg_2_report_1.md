I have the following React app code:

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

js/main.js
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

js/app.js
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

js/directives/todoFocus.js
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

js/directives/todoEscape.js
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

js/controllers/todo.js
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

js/services/todoStorage.js
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
**app.component.html**
```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form class="todo-form" (ngSubmit)="addTodo()">
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        [(ngModel)]="newTodo"
        autofocus
      />
    </form>
  </header>
  <section class="main" *ngIf="todos.length" [ngClass]="{ hidden: todos.length === 0 }">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [(ngModel)]="allChecked"
      (click)="markAll(allChecked)"
    />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <li
        *ngFor="let todo of todos | filter:statusFilter trackBy: trackByFn"
        [ngClass]="{ completed: todo.completed, editing: todo === editedTodo }"
      >
        <div class="view">
          <input class="toggle" type="checkbox" [(ngModel)]="todo.completed" />
          <label (dblclick)="editTodo(todo)">{{ todo.title }}</label>
          <button class="destroy" (click)="removeTodo(todo)"></button>
        </div>
        <form (ngSubmit)="doneEditing(todo)">
          <input
            class="edit"
            [(ngModel)]="todo.title"
            (blur)="doneEditing(todo)"
            todoEscape="revertEditing(todo)"
            todoFocus="todo === editedTodo"
          />
        </form>
      </li>
    </ul>
  </section>
  <footer class="footer" *ngIf="todos.length" [ngClass]="{ hidden: todos.length === 0 }">
    <span class="todo-count">
      <strong>{{ remainingCount }}</strong>
      <ng-pluralize count="remainingCount" when="{ one: 'item left', other: 'items left' }"></ng-pluralize>
    </span>
    <ul class="filters">
      <li>
        <a [ngClass]="{ selected: location.path() === '/' }" href="#/">All</a>
      </li>
      <li>
        <a [ngClass]="{ selected: location.path() === '/active' }" href="#/active">Active</a>
      </li>
      <li>
        <a [ngClass]="{ selected: location.path() === '/completed' }" href="#/completed">Completed</a>
      </li>
    </ul>
    <button class="clear-completed" (click)="clearDoneTodos()" *ngIf="remainingCount < todos.length">
      Clear completed
    </button>
  </footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>
    Credits:
    <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
    <a href="http://ericbidelman.com">Eric Bidelman</a>,
    <a href="http://jacobmumm.com">Jacob Mumm</a>,
    <a href="http://blog.igorminar.com">Igor Minar</a> and
    <a href="http://twitter.com/passy">Pascal Hartig</a>
  </p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

**app.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from './models/todo.model';
import {
  addTodo,
  clearDoneTodos,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from './store/todo.actions';
import { selectTodos, selectStatusFilter } from './store/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  statusFilter$: Observable<string>;
  newTodo = '';
  editedTodo: Todo | null = null;
  remainingCount: number = 0;
  allChecked: boolean = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.todos$ = this.store.select(selectTodos);
    this.statusFilter$ = this.store.select(selectStatusFilter);
  }

  trackByFn(index: number, todo: Todo): number {
    return todo.id;
  }

  addTodo(): void {
    if (this.newTodo.trim().length === 0) {
      return;
    }
    this.store.dispatch(addTodo({ title: this.newTodo }));
    this.newTodo = '';
  }

  editTodo(todo: Todo): void {
    this.editedTodo = todo;
  }

  doneEditing(todo: Todo): void {
    this.editedTodo = null;
    if (todo.title.trim().length === 0) {
      this.store.dispatch(deleteTodo({ id: todo.id }));
    } else {
      this.store.dispatch(editTodo({ todo }));
    }
  }

  revertEditing(todo: Todo): void {
    this.store.dispatch(editTodo({ todo: { ...todo, title: todo.title } }));
    this.editedTodo = null;
  }

  removeTodo(todo: Todo): void {
    this.store.dispatch(deleteTodo({ id: todo.id }));
  }

  toggleTodo(todo: Todo): void {
    this.store.dispatch(toggleTodo({ id: todo.id }));
  }

  markAll(checked: boolean): void {
    this.store.dispatch(markAll({ checked }));
  }

  clearDoneTodos(): void {
    this.store.dispatch(clearDoneTodos());
  }
}
```

**todo.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: number }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const markAll = createAction('[Todo] Mark All', props<{ checked: boolean }>());
export const clearDoneTodos = createAction('[Todo] Clear Done Todos');
```

**todo.effects.ts**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import {
  addTodo,
  clearDoneTodos,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from './todo.actions';

@Injectable()
export class TodoEffects {
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo),
      switchMap(({ title }) =>
        this.todoService.addTodo(title).pipe(
          map((todo) => addTodo({ todo })),
          catchError((error) => of(error))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTodo),
      switchMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => deleteTodo({ id })),
          catchError((error) => of(error))
        )
      )
    )
  );

  editTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editTodo),
      switchMap(({ todo }) =>
        this.todoService.editTodo(todo).pipe(
          map(() => editTodo({ todo })),
          catchError((error) => of(error))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleTodo),
      switchMap(({ id }) =>
        this.todoService.toggleTodo(id).pipe(
          map(() => toggleTodo({ id })),
          catchError((error) => of(error))
        )
      )
    )
  );

  markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markAll),
      switchMap(({ checked }) =>
        this.todoService.markAll(checked).pipe(
          map(() => markAll({ checked })),
          catchError((error) => of(error))
        )
      )
    )
  );

  clearDoneTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearDoneTodos),
      switchMap(() =>
        this.todoService.clearDoneTodos().pipe(
          map(() => clearDoneTodos()),
          catchError((error) => of(error))
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}
```

**todo.model.ts**
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

**todo.reducer.ts**
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import {
  addTodo,
  clearDoneTodos,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from './todo.actions';

export const initialState: Todo[] = [];

const _todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { todo }) => [...state, todo]),
  on(deleteTodo, (state, { id }) => state.filter((todo) => todo.id !== id)),
  on(editTodo, (state, { todo }) => {
    const index = state.findIndex((t) => t.id === todo.id);
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  }),
  on(toggleTodo, (state, { id }) => {
    const index = state.findIndex((t) => t.id === id);
    const updatedTodo = { ...state[index], completed: !state[index].completed };
    return [...state.slice(0, index), updatedTodo, ...state.slice(index + 1)];
  }),
  on(markAll, (state, { checked }) => {
    return state.map((todo) => ({ ...todo, completed: checked }));
  }),
  on(clearDoneTodos, (state) => state.filter((todo) => !todo.completed))
);

export function todoReducer(state: Todo[] | undefined, action: any) {
  return _todoReducer(state, action);
}
```

**todo.selectors.ts**
```typescript
import { createSelector } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { AppState } from './app.state';

export const selectTodos = (state: AppState) => state.todos;

export const selectStatusFilter = (state: AppState) => state.statusFilter;

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectStatusFilter,
  (todos, statusFilter) => {
    switch (statusFilter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
);
```

**todo.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly API_URL = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.API_URL);
  }

  addTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.API_URL, { title, completed: false });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  editTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.API_URL}/${todo.id}`, todo);
  }

  toggleTodo(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.API_URL}/${id}`, { completed: !this.http.get<Todo>(`${this.API_URL}/${id}`).subscribe((todo) => todo.completed) });
  }

  markAll(checked: boolean): Observable<Todo[]> {
    return this.http.patch<Todo[]>(this.API_URL, { completed: checked });
  }

  clearDoneTodos(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/completed`);
  }
}
```

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoEffects } from './store/todo.effects';
import { todoReducer } from './store/todo.reducer';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
### Tokens: {'prompt_tokens': 2589, 'completion_tokens': 3475, 'total_tokens': 6064}
### Execution time: 20.506963968276978
