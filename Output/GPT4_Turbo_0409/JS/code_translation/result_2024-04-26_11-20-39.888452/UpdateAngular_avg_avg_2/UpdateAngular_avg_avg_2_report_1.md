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
```markdown
# Angular 14.x Migration

## app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoService } from './services/todo.service';
import { todosReducer } from './store/todos.reducer';
import { TodosEffects } from './store/todos.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodosEffects])
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## app.component.html
```html
<section class="todoapp">
  <app-todo></app-todo>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>Credits: ...</p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

## app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular & NgRx • TodoMVC';
}
```

## todo.component.html
```html
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="addTodo()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
  </form>
</header>
<section class="main" *ngIf="todos.length">
  <input id="toggle-all" class="toggle-all" type="checkbox" [(ngModel)]="allChecked" (click)="markAll(allChecked)">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let todo of todos | async" [ngClass]="{completed: todo.completed, editing: todo === editedTodo}">
      <div class="view">
        <input class="toggle" type="checkbox" [(ngModel)]="todo.completed">
        <label (dblclick)="editTodo(todo)">{{todo.title}}</label>
        <button class="destroy" (click)="removeTodo(todo)"></button>
      </div>
      <form (ngSubmit)="doneEditing(todo)">
        <input class="edit" [(ngModel)]="todo.title" name="title" (blur)="doneEditing(todo)">
      </form>
    </li>
  </ul>
</section>
<footer class="footer" *ngIf="todos.length">
  <span class="todo-count"><strong>{{remainingCount | async}}</strong> item(s) left</span>
  <ul class="filters">
    <li><a [class.selected]="filter === 'ALL'" (click)="updateFilter('ALL')">All</a></li>
    <li><a [class.selected]="filter === 'ACTIVE'" (click)="updateFilter('ACTIVE')">Active</a></li>
    <li><a [class.selected]="filter === 'COMPLETED'" (click)="updateFilter('COMPLETED')">Completed</a></li>
  </ul>
  <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount | async) > 0">Clear completed</button>
</footer>
```

## todo.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';
import { AppState } from '../store/app.state';
import { addTodo, clearCompleted, doneEditing, editTodo, markAll, removeTodo, updateFilter } from '../store/todos.actions';
import { selectTodos, selectRemainingCount, selectDoneCount } from '../store/todos.selectors';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Observable<Todo[]>;
  remainingCount: Observable<number>;
  doneCount: Observable<number>;
  newTodo = '';
  editedTodo: Todo | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.todos = this.store.select(selectTodos);
    this.remainingCount = this.store.select(selectRemainingCount);
    this.doneCount = this.store.select(selectDoneCount);
  }

  addTodo(): void {
    if (this.newTodo.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  editTodo(todo: Todo): void {
    this.editedTodo = todo;
  }

  doneEditing(todo: Todo): void {
    if (!todo.title.trim()) {
      this.removeTodo(todo);
    } else {
      this.store.dispatch(doneEditing({ id: todo.id, title: todo.title.trim() }));
      this.editedTodo = null;
    }
  }

  removeTodo(todo: Todo): void {
    this.store.dispatch(removeTodo({ id: todo.id }));
  }

  markAll(completed: boolean): void {
    this.store.dispatch(markAll({ completed }));
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }

  updateFilter(filter: string): void {
    this.store.dispatch(updateFilter({ filter }));
  }
}
```

## todos.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { addTodo, clearCompleted, doneEditing, editTodo, markAll, removeTodo, updateFilter } from './todos.actions';

export interface TodosState {
  todos: Todo[];
  filter: 'ALL' | 'ACTIVE' | 'COMPLETED';
}

export const initialState: TodosState = {
  todos: [],
  filter: 'ALL'
};

export const todosReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false }]
  })),
  on(removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(markAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(doneEditing, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, title } : todo)
  })),
  on(updateFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);
```

## todos.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import { loadTodos, loadTodosSuccess } from './todos.actions';

@Injectable()
export class TodosEffects {
  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(loadTodos),
    switchMap(() => this.todoService.getTodos().pipe(
      map(todos => loadTodosSuccess({ todos }))
    ))
  ));

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}
}
```

## todo.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } of 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'api/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }
}
```

## models/todo.model.ts
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

## app-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo.component';

const routes: Routes = [
  { path: '', component: TodoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
```

### Tokens: {'input_tokens': 2256, 'output_tokens': 1924}
### Execution time: 116.76894426345825
