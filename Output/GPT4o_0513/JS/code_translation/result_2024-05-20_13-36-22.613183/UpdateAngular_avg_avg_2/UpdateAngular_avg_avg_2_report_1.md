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
index.html
```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Angular 14 TodoMVC</title>
		<link rel="stylesheet" href="node_modules/todomvc-common/base.css">
		<link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
	</head>
	<body>
		<app-root></app-root>
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
	</body>
</html>
```

app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';
import { FormsModule } from '@angular/forms';

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
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo></app-todo>
    </section>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
```

components/todo/todo.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, clearCompleted, markAll, setFilter } from '../../store/todo.actions';
import { AppState } from '../../store/todo.reducer';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  newTodo = '';

  constructor(private store: Store<AppState>) {}

  addTodo() {
    if (this.newTodo.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  markAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(markAll({ completed: target.checked }));
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  setFilter(filter: string) {
    this.store.dispatch(setFilter({ filter }));
  }
}
```

components/todo/todo.component.html
```html
<header class="header">
  <h1>todos</h1>
  <form (submit)="addTodo()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
  </form>
</header>
<section class="main">
  <input id="toggle-all" class="toggle-all" type="checkbox" (click)="markAll($event)">
  <label for="toggle-all">Mark all as complete</label>
  <app-todo-list></app-todo-list>
</section>
<footer class="footer">
  <app-todo-footer></app-todo-footer>
</footer>
```

components/todo-list/todo-list.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, Todo } from '../../store/todo.reducer';
import { Observable } from 'rxjs';
import { editTodo, removeTodo, toggleTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;

  constructor(private store: Store<AppState>) {
    this.todos$ = store.select('todos');
  }

  toggle(todo: Todo) {
    this.store.dispatch(toggleTodo({ id: todo.id }));
  }

  edit(todo: Todo, title: string) {
    this.store.dispatch(editTodo({ id: todo.id, title }));
  }

  remove(todo: Todo) {
    this.store.dispatch(removeTodo({ id: todo.id }));
  }
}
```

components/todo-list/todo-list.component.html
```html
<ul class="todo-list">
  <li *ngFor="let todo of todos$ | async" [ngClass]="{completed: todo.completed, editing: todo.editing}">
    <div class="view">
      <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggle(todo)">
      <label (dblclick)="edit(todo, todo.title)">{{todo.title}}</label>
      <button class="destroy" (click)="remove(todo)"></button>
    </div>
    <input class="edit" [(ngModel)]="todo.title" (blur)="edit(todo, todo.title)">
  </li>
</ul>
```

components/todo-footer/todo-footer.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/todo.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.remainingCount$ = store.select(state => state.todos.filter(todo => !todo.completed).length);
    this.doneCount$ = store.select(state => state.todos.filter(todo => todo.completed).length);
  }
}
```

components/todo-footer/todo-footer.component.html
```html
<span class="todo-count"><strong>{{remainingCount$ | async}}</strong> <ng-pluralize [count]="remainingCount$ | async" [when]="{ one: 'item left', other: 'items left' }"></ng-pluralize></span>
<ul class="filters">
  <li>
    <a (click)="setFilter('all')" [ngClass]="{selected: filter === 'all'}">All</a>
  </li>
  <li>
    <a (click)="setFilter('active')" [ngClass]="{selected: filter === 'active'}">Active</a>
  </li>
  <li>
    <a (click)="setFilter('completed')" [ngClass]="{selected: filter === 'completed'}">Completed</a>
  </li>
</ul>
<button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>
```

store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: number, title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const markAll = createAction('[Todo] Mark All', props<{ completed: boolean }>());
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
```

store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, markAll, setFilter } from './todo.actions';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  editing: boolean;
}

export interface AppState {
  todos: Todo[];
  filter: string;
}

const initialState: AppState = {
  todos: [],
  filter: 'all'
};

export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false, editing: false }]
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
  })),
  on(editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, title, editing: false } : todo)
  })),
  on(removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(markAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(setFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);
```

store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, markAll } from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) {}

  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, markAll),
      tap(() => {
        const todos = JSON.parse(localStorage.getItem('todos-angular') || '[]');
        localStorage.setItem('todos-angular', JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );
}
```
```

### Tokens: {'input_tokens': 2275, 'output_tokens': 2390}
### Execution time: 39.14052391052246
