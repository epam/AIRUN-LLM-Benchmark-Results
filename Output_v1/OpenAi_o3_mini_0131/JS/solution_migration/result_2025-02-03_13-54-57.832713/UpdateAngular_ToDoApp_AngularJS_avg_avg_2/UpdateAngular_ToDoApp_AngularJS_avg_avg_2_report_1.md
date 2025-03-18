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
```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>TodoMVC Angular 14</title>
    <base href="/">
    <link rel="stylesheet" href="assets/base.css">
    <link rel="stylesheet" href="assets/index.css">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoInputComponent,
    TodoListComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-input></app-todo-input>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
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
export class AppComponent {}
```

```typescript
// src/app/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

```typescript
// src/app/store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: number; title: string }>()
);
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const markAll = createAction(
  '[Todo] Mark All',
  props<{ completed: boolean }>()
);
```

```typescript
// src/app/store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../todo.model';
import * as TodoActions from './todo.actions';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (_state, { todos }) => [...todos]),
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: state.length ? Math.max(...state.map(t => t.id)) + 1 : 1,
      title: title.trim(),
      completed: false
    };
    return [...state, newTodo];
  }),
  on(TodoActions.toggleTodo, (state, { id }) =>
    state.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  ),
  on(TodoActions.editTodo, (state, { id, title }) =>
    state.map(todo => (todo.id === id ? { ...todo, title: title.trim() } : todo))
  ),
  on(TodoActions.removeTodo, (state, { id }) =>
    state.filter(todo => todo.id !== id)
  ),
  on(TodoActions.clearCompleted, state =>
    state.filter(todo => !todo.completed)
  ),
  on(TodoActions.markAll, (state, { completed }) =>
    state.map(todo => ({ ...todo, completed }))
  )
);
```

```typescript
// src/app/store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { Store } from '@ngrx/store';
import { Todo } from '../todo.model';

@Injectable()
export class TodoEffects implements OnInitEffects {
  private STORAGE_KEY = 'todos-angular14-ngrx';

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        const todos: Todo[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.editTodo,
        TodoActions.removeTodo,
        TodoActions.clearCompleted,
        TodoActions.markAll
      ),
      withLatestFrom(this.store.select('todos')),
      tap(([_, todos]) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<{ todos: Todo[] }>) {}

  ngrxOnInitEffects() {
    return TodoActions.loadTodos();
  }
}
```

```typescript
// src/app/store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Todo } from '../todo.model';

export const selectTodos = createFeatureSelector<Todo[]>('todos');

export const selectActiveTodos = createSelector(
  selectTodos,
  (todos: Todo[]) => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectTodos,
  (todos: Todo[]) => todos.filter(todo => todo.completed)
);

export const selectRemainingCount = createSelector(
  selectActiveTodos,
  (todos: Todo[]) => todos.length
);
```

```typescript
// src/app/components/todo-input/todo-input.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html'
})
export class TodoInputComponent {
  newTodo = '';

  constructor(private store: Store) {}

  addTodo() {
    if (this.newTodo.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newTodo }));
      this.newTodo = '';
    }
  }
}
```

```html
<!-- src/app/components/todo-input/todo-input.component.html -->
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="addTodo()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      name="newTodo"
      autofocus>
  </form>
</header>
```

```typescript
// src/app/components/todo-list/todo-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../todo.model';
import { selectTodos } from '../../store/todo.selectors';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  editedTodoId: number | null = null;
  originalTitle = '';

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
  }

  toggleTodo(todo: Todo) {
    this.store.dispatch(TodoActions.toggleTodo({ id: todo.id }));
  }

  editTodo(todo: Todo) {
    this.editedTodoId = todo.id;
    this.originalTitle = todo.title;
  }

  doneEditing(todo: Todo, newTitle: string) {
    this.editedTodoId = null;
    const title = newTitle.trim();
    if (title) {
      this.store.dispatch(TodoActions.editTodo({ id: todo.id, title }));
    } else {
      this.removeTodo(todo);
    }
  }

  cancelEditing(todo: Todo) {
    this.editedTodoId = null;
    this.store.dispatch(TodoActions.editTodo({ id: todo.id, title: this.originalTitle }));
  }

  removeTodo(todo: Todo) {
    this.store.dispatch(TodoActions.removeTodo({ id: todo.id }));
  }
}
```

```html
<!-- src/app/components/todo-list/todo-list.component.html -->
<section class="main" *ngIf="(todos$ | async)?.length">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="(todos$ | async)?.length && ((todos$ | async)?.every(t => t.completed))"
    (change)="store.dispatch(TodoActions.markAll({ completed: $event.target.checked }))">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let todo of todos$ | async"
        [ngClass]="{'completed': todo.completed, 'editing': editedTodoId === todo.id}">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="toggleTodo(todo)">
        <label (dblclick)="editTodo(todo)">{{ todo.title }}</label>
        <button class="destroy" (click)="removeTodo(todo)"></button>
      </div>
      <form *ngIf="editedTodoId === todo.id" (ngSubmit)="doneEditing(todo, tempTitle.value)">
        <input
          class="edit"
          #tempTitle
          [value]="todo.title"
          (blur)="doneEditing(todo, tempTitle.value)"
          (keydown.escape)="cancelEditing(todo)"
          autofocus>
      </form>
    </li>
  </ul>
</section>
```

```typescript
// src/app/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../todo.model';
import { selectRemainingCount, selectTodos } from '../../store/todo.selectors';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  todos$: Observable<Todo[]>;
  currentFilter: string = 'all';

  constructor(private store: Store) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.todos$ = this.store.select(selectTodos);
  }

  clearCompleted() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
  }
}
```

```html
<!-- src/app/components/todo-footer/todo-footer.component.html -->
<footer class="footer" *ngIf="(todos$ | async)?.length">
  <span class="todo-count">
    <strong>{{ remainingCount$ | async }}</strong>
    <ng-container *ngIf="(remainingCount$ | async) === 1">item left</ng-container>
    <ng-container *ngIf="(remainingCount$ | async) !== 1">items left</ng-container>
  </span>
  <ul class="filters">
    <li>
      <a [ngClass]="{'selected': currentFilter === 'all'}" (click)="setFilter('all')">All</a>
    </li>
    <li>
      <a [ngClass]="{'selected': currentFilter === 'active'}" (click)="setFilter('active')">Active</a>
    </li>
    <li>
      <a [ngClass]="{'selected': currentFilter === 'completed'}" (click)="setFilter('completed')">Completed</a>
    </li>
  </ul>
  <button class="clear-completed"
          (click)="clearCompleted()"
          *ngIf="(todos$ | async)?.length > (remainingCount$ | async)">
    Clear completed
  </button>
</footer>
```

### Tokens: {'input_tokens': 2274, 'output_tokens': 6778, 'reasoning_tokens': 3776}
### Execution time: 28.05679488182068
