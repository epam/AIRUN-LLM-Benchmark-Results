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
  <section class="main" *ngIf="todos.length" [ngClass]="{ hidden: !todos.length }">
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
          <input
            class="toggle"
            type="checkbox"
            [(ngModel)]="todo.completed"
          />
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
  <footer class="footer" *ngIf="todos.length" [ngClass]="{ hidden: !todos.length }">
    <span class="todo-count">
      <strong>{{ remainingCount }}</strong>
      <ng-pluralize
        [count]="remainingCount"
        when="{ one: 'item left', other: 'items left' }"
      ></ng-pluralize>
    </span>
    <ul class="filters">
      <li>
        <a [ngClass]="{ selected: location.path() === '/' }" href="#/">All</a>
      </li>
      <li>
        <a [ngClass]="{ selected: location.path() === '/active' }" href="#/active"
          >Active</a
        >
      </li>
      <li>
        <a [ngClass]="{ selected: location.path() === '/completed' }" href="#/completed"
          >Completed</a
        >
      </li>
    </ul>
    <button
      class="clear-completed"
      (click)="clearDoneTodos()"
      *ngIf="remainingCount < todos.length"
    >
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
import {
  addTodo,
  clearDoneTodos,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from './todos.actions';
import { Todo } from './todos.model';
import { selectTodos, selectStatusFilter } from './todos.selectors';

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
  remainingCount = 0;
  allChecked = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.todos$ = this.store.select(selectTodos);
    this.statusFilter$ = this.store.select(selectStatusFilter);
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
    todo.title = todo.title.trim();
    if (todo.title.length === 0) {
      this.store.dispatch(deleteTodo({ id: todo.id }));
    } else {
      this.store.dispatch(editTodo({ todo }));
    }
  }

  revertEditing(todo: Todo): void {
    this.store.dispatch(editTodo({ todo: { ...todo, title: todo.title } }));
    this.doneEditing(todo);
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

  trackByFn(index: number, todo: Todo): number {
    return todo.id;
  }
}
```

**todos.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from './todos.model';

export const addTodo = createAction('[Todos] Add Todo', props<{ title: string }>());
export const deleteTodo = createAction('[Todos] Delete Todo', props<{ id: number }>());
export const editTodo = createAction('[Todos] Edit Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todos] Toggle Todo', props<{ id: number }>());
export const markAll = createAction('[Todos] Mark All', props<{ checked: boolean }>());
export const clearDoneTodos = createAction('[Todos] Clear Done Todos');
```

**todos.effects.ts**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoService } from './todos.service';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodosEffects {
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.addTodo),
      switchMap(({ title }) =>
        this.todoService.addTodo(title).pipe(
          map((todo) => TodosActions.addTodoSuccess({ todo })),
          catchError((error) => of(TodosActions.addTodoFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      switchMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodosActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodosActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  editTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.editTodo),
      switchMap(({ todo }) =>
        this.todoService.editTodo(todo).pipe(
          map(() => TodosActions.editTodoSuccess({ todo })),
          catchError((error) => of(TodosActions.editTodoFailure({ error })))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.toggleTodo),
      switchMap(({ id }) =>
        this.todoService.toggleTodo(id).pipe(
          map(() => TodosActions.toggleTodoSuccess({ id })),
          catchError((error) => of(TodosActions.toggleTodoFailure({ error })))
        )
      )
    )
  );

  markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.markAll),
      switchMap(({ checked }) =>
        this.todoService.markAll(checked).pipe(
          map(() => TodosActions.markAllSuccess({ checked })),
          catchError((error) => of(TodosActions.markAllFailure({ error })))
        )
      )
    )
  );

  clearDoneTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.clearDoneTodos),
      switchMap(() =>
        this.todoService.clearDoneTodos().pipe(
          map(() => TodosActions.clearDoneTodosSuccess()),
          catchError((error) => of(TodosActions.clearDoneTodosFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}
```

**todos.model.ts**
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

**todos.reducer.ts**
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from './todos.model';
import * as TodosActions from './todos.actions';

export const initialState: Todo[] = [];

export const todosReducer = createReducer(
  initialState,
  on(TodosActions.addTodoSuccess, (state, { todo }) => [...state, todo]),
  on(TodosActions.deleteTodoSuccess, (state, { id }) => state.filter((todo) => todo.id !== id)),
  on(TodosActions.editTodoSuccess, (state, { todo }) => {
    const index = state.findIndex((t) => t.id === todo.id);
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  }),
  on(TodosActions.toggleTodoSuccess, (state, { id }) => {
    const index = state.findIndex((t) => t.id === id);
    return [...state.slice(0, index), { ...state[index], completed: !state[index].completed }, ...state.slice(index + 1)];
  }),
  on(TodosActions.markAllSuccess, (state, { checked }) => state.map((todo) => ({ ...todo, completed: checked }))),
  on(TodosActions.clearDoneTodosSuccess, (state) => state.filter((todo) => !todo.completed))
);
```

**todos.selectors.ts**
```typescript
import { createSelector } from '@ngrx/store';
import { Todo } from './todos.model';
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

**todos.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todos.model';

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
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { todosReducer } from './todos.reducer';
import { TodosEffects } from './todos.effects';
import { TodoService } from './todos.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodosEffects]),
  ],
  providers: [TodoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
### Tokens: {'prompt_tokens': 2589, 'completion_tokens': 3516, 'total_tokens': 6105}
### Execution time: 20.910808086395264
