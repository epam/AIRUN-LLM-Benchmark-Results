I have the following application code that needs to migrate:

<source_code>
```html
// index.html
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

```js
// js/main.js
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

```js
// js/app.js
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

```js
// js/directives/todoFocus.js
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

```js
// js/directives/todoEscape.js
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

```js
// js/controllers/todo.js
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

```js
// js/services/todoStorage.js
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

</source_code>

Please follow these steps:

1. Migrate the provided AngularJS application with RequireJS to Angular 14.x:
   - Convert all AngularJS components, directives, and services to Angular 14.x syntax
   - Remove RequireJS dependency and implement ES modules
   - Implement proper Angular module structure

2. Implement state management:
   - Use @ngrx/store for state management
   - Use @ngrx/effects for side effects
   - Create appropriate actions, reducers, selectors, and effects

3. Component architecture:
   - Split monolithic controller into separate components
   - Create dedicated components for each logical UI section
   - Implement proper component communication using inputs/outputs

4. Implement Angular services:
   - Convert AngularJS services to injectable Angular services
   - Maintain the same functionality for data persistence
   - Use appropriate Angular dependency injection

5. Update HTML templates:
   - Convert AngularJS template syntax to Angular template syntax
   - Replace ng-* directives with Angular equivalents
   - Implement proper event binding and property binding

6. Implement Angular directives:
   - Convert custom AngularJS directives to Angular directives
   - Maintain the same functionality for custom behaviors
   - Use appropriate lifecycle hooks

7. Optimize the codebase:
   - Apply Angular best practices
   - Remove deprecated patterns
   - Implement performance optimizations where applicable

8. Ensure code quality:
   - No TODOs in the final code
   - Follow Angular style guide
   - Use TypeScript features appropriately

## Run 1:
### Answer:
Certainly! Below is a step-by-step migration of the provided AngularJS application with RequireJS to Angular 14.x, following all the specified requirements.

### Step 1: Setup Angular Project
First, create a new Angular project:
```bash
ng new todomvc-angular --style=css
cd todomvc-angular
```

### Step 2: Convert Components, Directives, and Services

#### app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './store/todo.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### app.component.html
```html
<todo-app></todo-app>
```

#### app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todomvc-angular';
}
```

### Step 3: Implement State Management

#### store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const removeTodo = createAction(
  '[Todo] Remove Todo',
  props<{ index: number }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ index: number }>()
);

export const markAll = createAction(
  '[Todo] Mark All',
  props<{ done: boolean }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');
```

#### store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

export interface Todo {
  title: string;
  completed: boolean;
}

export interface State {
  todos: Todo[];
}

export const initialState: State = {
  todos: JSON.parse(localStorage.getItem('todos-angular') || '[]')
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { title, completed: false }]
  })),
  on(TodoActions.removeTodo, (state, { index }) => ({
    ...state,
    todos: state.todos.filter((_, i) => i !== index)
  })),
  on(TodoActions.toggleTodo, (state, { index }) => ({
    ...state,
    todos: state.todos.map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo))
  })),
  on(TodoActions.markAll, (state, { done }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: done }))
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  }))
);
```

#### store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from './todo.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoEffects {
  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.removeTodo,
      TodoActions.toggleTodo,
      TodoActions.markAll,
      TodoActions.clearCompleted
    ),
    map(() => {
      localStorage.setItem('todos-angular', JSON.stringify(this.store.getValue().todos));
      return { type: '[Todo Effects] Todos Saved' };
    })
  ));

  constructor(private actions$: Actions, private store: Store) {}
}
```

### Step 4: Component Architecture

#### todo/todo.component.html
```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form (submit)="addTodo($event)">
      <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" autofocus>
    </form>
  </header>
  <section class="main" *ngIf="todos.length">
    <input id="toggle-all" class="toggle-all" type="checkbox" [(ngModel)]="allChecked" (click)="markAll(allChecked)">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <li *ngFor="let todo of todos | todoFilter:statusFilter; let i = index" [class.completed]="todo.completed" [class.editing]="todo === editedTodo">
        <div class="view">
          <input class="toggle" type="checkbox" [(ngModel)]="todo.completed">
          <label (dblclick)="editTodo(todo)">{{todo.title}}</label>
          <button class="destroy" (click)="removeTodo(i)"></button>
        </div>
        <form (submit)="doneEditing(todo)">
          <input class="edit" [(ngModel)]="todo.title" (blur)="doneEditing(todo)" todoFocus [todoEscape]="revertEditing(todo)">
        </form>
      </li>
    </ul>
  </section>
  <footer class="footer" *ngIf="todos.length">
    <span class="todo-count"><strong>{{remainingCount}}</strong> item(s) left</span>
    <ul class="filters">
      <li>
        <a [class.selected]="location.path() === '/'" href="#/">All</a>
      </li>
      <li>
        <a [class.selected]="location.path() === '/active'" href="#/active">Active</a>
      </li>
      <li>
        <a [class.selected]="location.path() === '/completed'" href="#/completed">Completed</a>
      </li>
    </ul>
    <button class="clear-completed" (click)="clearDoneTodos()" *ngIf="remainingCount < todos.length">Clear completed</button>
  </footer>
</section>
```

#### todo/todo.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromTodo from '../../store/todo.reducer';
import * as TodoActions from '../../store/todo.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'todo-app',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  newTodo = '';
  editedTodo: any = null;
  todos: any[] = [];
  remainingCount = 0;
  allChecked = false;
  statusFilter: any = null;
  location: any;

  constructor(private store: Store<fromTodo.State>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.select(fromTodo.getTodos).subscribe(todos => {
      this.todos = todos;
      this.remainingCount = todos.filter(todo => !todo.completed).length;
      this.allChecked = this.remainingCount === 0;
    });

    this.route.url.subscribe(url => {
      this.statusFilter = url[0] === 'active' ? { completed: false } : url[0] === 'completed' ? { completed: true } : null;
    });
  }

  addTodo(event: Event) {
    event.preventDefault();
    const newTodo

### Tokens: {'input_tokens': 2693, 'output_tokens': 2000}
### Execution time: 23.72889804840088
