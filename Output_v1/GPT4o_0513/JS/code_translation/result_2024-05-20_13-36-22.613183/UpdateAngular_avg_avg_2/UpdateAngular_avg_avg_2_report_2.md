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

## Run 2:
### Answer:
```typescript
// index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx • TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
  <style>[ng-cloak] { display: none; }</style>
</head>
<body>
  <app-root></app-root>
  <script src="node_modules/todomvc-common/base.js"></script>
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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/todo.module';
import { todoReducer } from './todo/store/todo.reducer';
import { TodoEffects } from './todo/store/todo.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    TodoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-todo></app-todo>',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
```

```typescript
// src/app/todo/todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoHeaderComponent } from './todo-header/todo-header.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoHeaderComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TodoComponent
  ]
})
export class TodoModule { }
```

```typescript
// src/app/todo/todo.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent { }
```

```html
<!-- src/app/todo/todo.component.html -->
<section class="todoapp">
  <app-todo-header></app-todo-header>
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
```

```typescript
// src/app/todo/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../store/todo.actions';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodo: string = '';

  constructor(private store: Store) { }

  addTodo() {
    if (this.newTodo.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }
}
```

```html
<!-- src/app/todo/todo-header/todo-header.component.html -->
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="addTodo()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
  </form>
</header>
```

```typescript
// src/app/todo/todo-list/todo-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../todo.model';
import { editTodo, removeTodo, toggleTodo, setEditedTodo, doneEditing, revertEditing } from '../store/todo.actions';
import { selectTodos, selectEditedTodo } from '../store/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  editedTodo$: Observable<Todo | null>;

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
    this.editedTodo$ = this.store.select(selectEditedTodo);
  }

  editTodo(todo: Todo) {
    this.store.dispatch(setEditedTodo({ todo }));
  }

  doneEditing(todo: Todo) {
    this.store.dispatch(doneEditing({ todo }));
  }

  revertEditing(todo: Todo) {
    this.store.dispatch(revertEditing({ todo }));
  }

  removeTodo(todo: Todo) {
    this.store.dispatch(removeTodo({ todo }));
  }

  toggleTodo(todo: Todo) {
    this.store.dispatch(toggleTodo({ todo }));
  }
}
```

```html
<!-- src/app/todo/todo-list/todo-list.component.html -->
<section class="main">
  <input id="toggle-all" class="toggle-all" type="checkbox" (click)="markAll($event.target.checked)">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let todo of todos$ | async" [ngClass]="{completed: todo.completed, editing: (editedTodo$ | async) === todo}">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggleTodo(todo)">
        <label (dblclick)="editTodo(todo)">{{todo.title}}</label>
        <button class="destroy" (click)="removeTodo(todo)"></button>
      </div>
      <form (ngSubmit)="doneEditing(todo)">
        <input class="edit" [(ngModel)]="todo.title" name="title" (blur)="doneEditing(todo)" appTodoEscape="revertEditing(todo)" appTodoFocus="(editedTodo$ | async) === todo">
      </form>
    </li>
  </ul>
</section>
```

```typescript
// src/app/todo/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { clearCompleted } from '../store/todo.actions';
import { selectRemainingCount, selectTodosCount } from '../store/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  todosCount$: Observable<number>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.todosCount$ = this.store.select(selectTodosCount);
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```html
<!-- src/app/todo/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count"><strong>{{ remainingCount$ | async }}</strong> <ng-pluralize [count]="remainingCount$ | async" [when]="{ one: 'item left', other: 'items left' }"></ng-pluralize></span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/']" routerLinkActive="selected" [routerLinkActiveOptions]="{ exact: true }">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']" routerLinkActive="selected">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']" routerLinkActive="selected">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" (click)="clearCompleted()">Clear completed</button>
</footer>
```

```typescript
// src/app/todo/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') isFocused: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFocused'] && this.isFocused) {
      this.el.nativeElement.focus();
    }
  }
}
```

```typescript
// src/app/todo/directives/todo-escape.directive.ts
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.appTodoEscape.emit();
    }
  }
}
```

```typescript
// src/app/todo/store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ todo: Todo }>());
export const setEditedTodo = createAction('[Todo] Set Edited Todo', props<{ todo: Todo }>());
export const doneEditing = createAction('[Todo] Done Editing', props<{ todo: Todo }>());
export const revertEditing = createAction('[Todo] Revert Editing', props<{ todo: Todo }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
```

```typescript
// src/app/todo/store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, removeTodo, toggleTodo, setEditedTodo, doneEditing, revertEditing, clearCompleted } from './todo.actions';
import { Todo } from '../todo.model';

export interface TodoState {
  todos: Todo[];
  editedTodo: Todo | null;
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem('todos-angular') || '[]'),
  editedTodo: null
};

const _todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { title, completed: false }]
  })),
  on(removeTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(t => t !== todo)
  })),
  on(toggleTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t === todo ? { ...t, completed: !t.completed } : t)
  })),
  on(setEditedTodo, (state, { todo }) => ({
    ...state,
    editedTodo: todo
  })),
  on(doneEditing, (state, { todo }) => ({
    ...state,
    editedTodo: null,
    todos: state.todos.map(t => t === state.editedTodo ? { ...t, title: t.title.trim() } : t)
  })),
  on(revertEditing, (state, { todo }) => ({
    ...state,
    editedTodo: null,
    todos: state.todos.map(t => t === state.editedTodo ? { ...t, title: state.editedTodo!.title } : t)
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(t => !t.completed)
  }))
);

export function todoReducer(state: any, action: any) {
  return _todoReducer(state, action);
}
```

```typescript
// src/app/todo/store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { addTodo, removeTodo, toggleTodo, doneEditing, clearCompleted } from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) { }

  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo, removeTodo, toggleTodo, doneEditing, clearCompleted),
      tap(() => {
        const todos = JSON.parse(localStorage.getItem('todos-angular') || '[]');
        localStorage.setItem('todos-angular', JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );
}
```

```typescript
// src/app/todo/store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectEditedTodo = createSelector(
  selectTodoState,
  (state: TodoState) => state.editedTodo
);

export const selectRemainingCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectTodosCount = createSelector(
  selectTodos,
  (todos) => todos.length
);
```

```typescript
// src/app/todo/todo.model.ts
export interface Todo {
  title: string;
  completed: boolean;
}
```

### Tokens: {'input_tokens': 2275, 'output_tokens': 3261}
### Execution time: 53.8989040851593
