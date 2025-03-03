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
<think>
Okay, I need to migrate this AngularJS (Angular 1.x) code to Angular 14.x. Let me start by understanding the original code structure and functionality.

First, looking at the index.html, it's using AngularJS directives like ng-controller, ng-repeat, and services. The main app is defined in app.js with RequireJS, but Angular 14 uses modules and doesn't require RequireJS. So I'll need to switch to Angular modules and components.

The original code uses a TodoController which handles adding, editing, removing todos, and interacts with a service (todoStorage) that uses localStorage. Since the user wants to use @ngrx/store and @ngrx/effects, I should implement state management using NgRx.

Let me outline the steps:

1. **Set up Angular Modules and Components**: Split the single controller into components. The main sections are the header, todo list, footer, etc. So create components like AppComponent, TodoListComponent, TodoItemComponent, FooterComponent.

2. **Implement NgRx Store**: Create actions, reducers, and effects for handling todos. The current service (todoStorage) can be replaced with effects that handle side effects like saving to localStorage.

3. **Update Services**: The original todoStorage service uses localStorage. In NgRx, effects can handle saving to localStorage when the state changes.

4. **Routing**: The original uses $location for filtering todos (all, active, completed). In Angular, I'll set up routing with RouterModule to handle these paths.

5. **Directives Conversion**: The original has custom directives todoFocus and todoEscape. These can be converted into Angular attribute directives.

6. **Update Templates**: Replace AngularJS directives with Angular syntax. For example, ng-repeat becomes *ngFor, ng-model becomes [(ngModel)], etc.

7. **Dependency Injection**: Update how services are provided. Instead of AngularJS factories, use Angular services with providedIn root or modules.

Starting with the store:

- **Actions**: Define actions for adding, removing, toggling, editing todos, clearing completed, and marking all.
- **Reducer**: Create a reducer to handle these actions, managing the state of todos.
- **Effects**: Create an effect that listens for changes to the todos and saves them to localStorage.

Next, the components:

- **AppComponent**: Main container, dispatches initial load action, subscribes to todos from the store.
- **TodoListComponent**: Displays the list of todos, uses *ngFor over the filtered todos.
- **TodoItemComponent**: Each todo item, handles editing, toggling, removing.
- **FooterComponent**: Shows remaining count, filters links, clear completed button.

For the directives:

- **TodoFocusDirective**: Uses @Input to check when to focus, uses Angular's Renderer2 to focus the element.
- **TodoEscapeDirective**: Listens for escape key events and triggers a callback.

Routing:

- Set up routes for '/', '/active', '/completed'. Use the routerLink directive in the footer links.
- The filter is determined based on the current route, which can be accessed via the ActivatedRoute.

Services:

- The original todoStorage is replaced by NgRx effects. An effect will listen for any todo-related actions and persist the state to localStorage.

Testing each part:

- Ensure that when a todo is added, it's dispatched to the store, the reducer updates the state, and the effect saves to localStorage.
- Editing a todo should update the state and trigger a save.
- Routing should filter the todos correctly based on the active route.

Potential issues:

- The original code uses $scope.$watch to react to changes. In Angular, this is handled through observables and the async pipe.
- The double-click to edit and pressing escape to revert needs to be handled in the TodoItemComponent with event listeners.
- The focus directive needs to conditionally focus an element when editing starts.

Now, translating each file step by step, ensuring all dependencies are properly imported and modules are set up correctly.
</think>

Here's the converted Angular 14 code:

app.component.html
```html
<section class="todoapp">
  <app-header (addTodo)="addTodo($event)"></app-header>
  <app-todo-list
    *ngIf="todos$ | async as todos"
    [todos]="todos"
    (toggleAll)="toggleAll($event)"
    (updateTodo)="updateTodo($event)"
    (deleteTodo)="deleteTodo($event)"
  ></app-todo-list>
  <app-footer
    *ngIf="(todos$ | async)?.length"
    [remainingCount]="remainingCount$ | async"
    [completedCount]="completedCount$ | async"
    (clearCompleted)="clearCompleted()"
  ></app-footer>
</section>
```

app.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { addTodo, toggleAll, clearCompleted, deleteTodo, updateTodo } from './store/todo.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  todos$ = this.store.select(state => state.todos);
  remainingCount$ = this.store.select(state => state.todos.filter(todo => !todo.completed).length);
  completedCount$ = this.store.select(state => state.todos.filter(todo => todo.completed).length);

  constructor(private store: Store<AppState>) {}

  addTodo(title: string) {
    if (title.trim()) {
      this.store.dispatch(addTodo({ title }));
    }
  }

  toggleAll(completed: boolean) {
    this.store.dispatch(toggleAll({ completed }));
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  deleteTodo(id: number) {
    this.store.dispatch(deleteTodo({ id }));
  }

  updateTodo(todo: { id: number; title: string; completed: boolean }) {
    this.store.dispatch(updateTodo({ todo }));
  }
}
```

todo-list.component.html
```html
<section class="main" *ngIf="todos.length">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="allChecked"
    (change)="toggleAll.emit(!allChecked)"
  >
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of todos"
      [todo]="todo"
      (update)="updateTodo.emit($event)"
      (delete)="deleteTodo.emit($event)"
    ></app-todo-item>
  </ul>
</section>
```

todo-item.component.html
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view" *ngIf="!editing">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="toggleCompleted()"
    >
    <label (dblclick)="startEditing()">{{ todo.title }}</label>
    <button class="destroy" (click)="delete.emit(todo.id)"></button>
  </div>
  <form *ngIf="editing" (submit)="finishEditing()">
    <input
      class="edit"
      [value]="todo.title"
      (input)="editedTitle = $event.target.value"
      (blur)="finishEditing()"
      (keydown.escape)="cancelEditing()"
      appTodoFocus
    >
  </form>
</li>
```

footer.component.html
```html
<footer class="footer" *ngIf="remainingCount !== undefined">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong>
    {{ remainingCount === 1 ? 'item left' : 'items left' }}
  </span>
  <ul class="filters">
    <li><a routerLink="/" routerLinkActive="selected">All</a></li>
    <li><a routerLink="/active" routerLinkActive="selected">Active</a></li>
    <li><a routerLink="/completed" routerLinkActive="selected">Completed</a></li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="completedCount"
    (click)="clearCompleted.emit()"
  >
    Clear completed
  </button>
</footer>
```

todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add', props<{ title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const deleteTodo = createAction('[Todo] Delete', props<{ id: number }>());
export const updateTodo = createAction('[Todo] Update', props<{ todo: { id: number; title: string; completed: boolean } }>());
export const loadTodos = createAction('[Todo] Load');
export const loadTodosSuccess = createAction('[Todo] Load Success', props<{ todos: any[] }>());
```

todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Array<{ id: number; title: string; completed: boolean }>;
}

export const initialState: TodoState = {
  todos: []
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false }]
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t)
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos }))
);
```

todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

const STORAGE_KEY = 'todos-angular-ngrx';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return of(TodoActions.loadTodosSuccess({ todos }));
      }),
      catchError(error => of({ type: 'LOAD_ERROR', error }))
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleAll,
        TodoActions.clearCompleted,
        TodoActions.deleteTodo,
        TodoActions.updateTodo
      ),
      tap(action => {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newState = todoReducer({ todos: state }, action);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.todos));
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```

todo-focus.directive.ts
```typescript
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective {
  @Input() set appTodoFocus(condition: boolean) {
    if (condition) {
      this.renderer.selectRootElement(this.el.nativeElement).focus();
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
```

app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';
import { HeaderComponent } from './header.component';
import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item.component';
import { FooterComponent } from './footer.component';
import { TodoFocusDirective } from './todo-focus.directive';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    FooterComponent,
    TodoFocusDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Tokens: {'input_tokens': 2416, 'output_tokens': 2975}
### Execution time: 54.468039989471436
