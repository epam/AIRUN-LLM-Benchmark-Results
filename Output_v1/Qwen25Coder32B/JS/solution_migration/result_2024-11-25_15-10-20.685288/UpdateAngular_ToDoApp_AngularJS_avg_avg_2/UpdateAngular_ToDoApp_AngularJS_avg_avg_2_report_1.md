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
## index.html
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
  <style>[ng-cloak] { display: none; }</style>
</head>
<body>
  <app-root></app-root>
  <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
  <script src="main.js" type="module"></script>
</body>
</html>
```

## src/main.ts
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

## src/app/app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoListComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## src/app/app.component.ts
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <form class="todo-form" (ngSubmit)="addTodo()">
          <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
        </form>
      </header>
      <section class="main" *ngIf="todos.length" ng-cloak>
        <input id="toggle-all" class="toggle-all" type="checkbox" [(ngModel)]="allChecked" (ngModelChange)="markAll($event)">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <app-todo *ngFor="let todo of filteredTodos" [todo]="todo" (remove)="removeTodo($event)" (toggle)="toggleTodo($event)" (edit)="editTodo($event)" (update)="updateTodo($event)"></app-todo>
        </ul>
      </section>
      <app-todo-footer *ngIf="todos.length" [remainingCount]="remainingCount" [todos]="todos" (clearCompleted)="clearDoneTodos()"></app-todo-footer>
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
  `,
  styles: []
})
export class AppComponent {
  newTodo = '';
  editedTodo: any = null;
  originalTodo: any = null;

  constructor(private router: Router) {
    if (this.router.url === '') {
      this.router.navigate(['/']);
    }
  }

  get todos() {
    return this.store.selectSnapshot(state => state.todos);
  }

  get remainingCount() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get allChecked() {
    return !this.remainingCount;
  }

  get filteredTodos() {
    const path = this.router.url;
    return this.todos.filter(todo => {
      if (path === '/active') {
        return !todo.completed;
      } else if (path === '/completed') {
        return todo.completed;
      } else {
        return true;
      }
    });
  }

  addTodo() {
    const newTodo = this.newTodo.trim();
    if (!newTodo.length) {
      return;
    }
    this.store.dispatch({ type: '[Todo] Add', payload: { title: newTodo, completed: false } });
    this.newTodo = '';
  }

  editTodo(todo) {
    this.editedTodo = todo;
    this.originalTodo = { ...todo };
  }

  updateTodo(todo) {
    this.editedTodo = null;
    todo.title = todo.title.trim();
    if (!todo.title) {
      this.removeTodo(todo);
    } else {
      this.store.dispatch({ type: '[Todo] Update', payload: todo });
    }
  }

  revertEditing(todo) {
    this.store.dispatch({ type: '[Todo] Update', payload: this.originalTodo });
    this.doneEditing();
  }

  doneEditing() {
    this.editedTodo = null;
  }

  removeTodo(todo) {
    this.store.dispatch({ type: '[Todo] Remove', payload: todo });
  }

  clearDoneTodos() {
    this.store.dispatch({ type: '[Todo] Clear Completed' });
  }

  markAll(done) {
    this.store.dispatch({ type: '[Todo] Mark All', payload: done });
  }
}
```

## src/app/todo/todo.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo',
  template: `
    <li [ngClass]="{ completed: todo.completed, editing: todo === editedTodo }">
      <div class="view">
        <input class="toggle" type="checkbox" [(ngModel)]="todo.completed" (ngModelChange)="toggle.emit(todo)">
        <label (dblclick)="edit.emit(todo)">{{ todo.title }}</label>
        <button class="destroy" (click)="remove.emit(todo)"></button>
      </div>
      <form (ngSubmit)="update.emit(todo)" *ngIf="todo === editedTodo">
        <input class="edit" [(ngModel)]="todo.title" name="title" (blur)="update.emit(todo)" (keydown.escape)="revertEditing.emit(todo)" autofocus>
      </form>
    </li>
  `,
  styles: []
})
export class TodoComponent {
  @Input() todo: any;
  @Output() remove = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() revertEditing = new EventEmitter<any>();
}
```

## src/app/todo-list/todo-list.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todos.length" ng-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" [(ngModel)]="allChecked" (ngModelChange)="markAll.emit($event)">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo *ngFor="let todo of todos" [todo]="todo" (remove)="removeTodo.emit($event)" (toggle)="toggleTodo.emit($event)" (edit)="editTodo.emit($event)" (update)="updateTodo.emit($event)"></app-todo>
      </ul>
    </section>
  `,
  styles: []
})
export class TodoListComponent {
  @Input() todos: any[];
  @Input() allChecked: boolean;
  @Output() removeTodo = new EventEmitter<any>();
  @Output() toggleTodo = new EventEmitter<any>();
  @Output() editTodo = new EventEmitter<any>();
  @Output() updateTodo = new EventEmitter<any>();
  @Output() markAll = new EventEmitter<boolean>();
}
```

## src/app/todo-footer/todo-footer.component.ts
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="todos.length" ng-cloak>
      <span class="todo-count"><strong>{{ remainingCount }}</strong>
        <ng-container *ngIf="remainingCount === 1; else other">
          item left
        </ng-container>
        <ng-template #other>
          items left
        </ng-template>
      </span>
      <ul class="filters">
        <li>
          <a [ngClass]="{ selected: path === '/' }" [routerLink]="['/']">All</a>
        </li>
        <li>
          <a [ngClass]="{ selected: path === '/active' }" [routerLink]="['/active']">Active</a>
        </li>
        <li>
          <a [ngClass]="{ selected: path === '/completed' }" [routerLink]="['/completed']">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" (click)="clearCompleted.emit()" *ngIf="remainingCount < todos.length">Clear completed</button>
    </footer>
  `,
  styles: []
})
export class TodoFooterComponent {
  @Input() remainingCount: number;
  @Input() todos: any[];
  @Input() path: string;
  @Output() clearCompleted = new EventEmitter<void>();
}
```

## src/app/store/todo.actions.ts
```typescript
export const ADD_TODO = '[Todo] Add';
export const REMOVE_TODO = '[Todo] Remove';
export const UPDATE_TODO = '[Todo] Update';
export const CLEAR_COMPLETED = '[Todo] Clear Completed';
export const MARK_ALL = '[Todo] Mark All';
```

## src/app/store/todo.reducer.ts
```typescript
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO, CLEAR_COMPLETED, MARK_ALL } from './todo.actions';

export interface Todo {
  title: string;
  completed: boolean;
}

export function todoReducer(state: Todo[] = [], action: any): Todo[] {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload];
    case REMOVE_TODO:
      return state.filter(todo => todo !== action.payload);
    case UPDATE_TODO:
      return state.map(todo => todo === action.payload ? action.payload : todo);
    case CLEAR_COMPLETED:
      return state.filter(todo => !todo.completed);
    case MARK_ALL:
      return state.map(todo => ({ ...todo, completed: action.payload }));
    default:
      return state;
  }
}
```

## src/app/store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class TodoEffects {
  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          '[Todo] Add',
          '[Todo] Remove',
          '[Todo] Update',
          '[Todo] Clear Completed',
          '[Todo] Mark All'
        ),
        tap(() => {
          const todos = localStorage.getItem('todos-angularjs-requirejs');
          localStorage.setItem('todos-angularjs-requirejs', todos);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```
```

### Tokens: {'input_tokens': 2262, 'output_tokens': 2631}
### Execution time: 27.213762044906616
