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
Okay, let's migrate this AngularJS application to Angular 14.x using NgRx for state management.

We will follow the steps outlined, creating a standard Angular CLI project structure.

**Project Setup:**

1.  Create a new Angular project:
    ```bash
    ng new angular-ngrx-todomvc --style css --routing false
    cd angular-ngrx-todomvc
    ```
    (We'll add routing manually later to control the filter state via the URL).
2.  Install NgRx:
    ```bash
    ng add @ngrx/store@14 @ngrx/effects@14 @ngrx/store-devtools@14
    ```
3.  Install the original TodoMVC CSS:
    ```bash
    npm install todomvc-common todomvc-app-css --save-dev
    ```
4.  Update `angular.json` to include the CSS files:
    Find the `architect.build.options.styles` array and add:
    ```json
    "styles": [
      "src/styles.css",
      "node_modules/todomvc-common/base.css",
      "node_modules/todomvc-app-css/index.css"
    ],
    ```
5.  Remove the old AngularJS/RequireJS files (`js/`, `node_modules/angular`, `node_modules/requirejs`).

**Angular Structure & Code:**

We'll create the following structure:

```
src/
├── app/
│   ├── core/             // Core services, state management
│   │   ├── state/        // NgRx state
│   │   │   ├── todo/
│   │   │   │   ├── todo.actions.ts
│   │   │   │   ├── todo.effects.ts
│   │   │   │   ├── todo.reducer.ts
│   │   │   │   ├── todo.selectors.ts
│   │   │   │   └── todo.state.ts     // State interface
│   │   │   └── app.state.ts      // Root state interface
│   │   ├── services/
│   │   │   └── todo-storage.service.ts // LocalStorage service
│   │   └── core.module.ts        // Module for core services/state
│   ├── shared/           // Shared components, directives, pipes
│   │   ├── directives/
│   │   │   ├── todo-escape.directive.ts
│   │   │   └── todo-focus.directive.ts
│   │   └── shared.module.ts      // Module for shared items
│   ├── todo/             // Feature module for TodoMVC
│   │   ├── components/
│   │   │   ├── todo-app-container/ // Smart container
│   │   │   ├── todo-footer/        // Presentational footer
│   │   │   ├── todo-header/        // Presentational header
│   │   │   ├── todo-item/          // Presentational single item
│   │   │   └── todo-list/          // Presentational list
│   │   ├── models/
│   │   │   └── todo.model.ts       // Todo interface
│   │   ├── todo-routing.module.ts  // Feature routing
│   │   └── todo.module.ts          // Feature module
│   ├── app-routing.module.ts     // Root routing
│   ├── app.component.html        // Main app shell
│   ├── app.component.ts
│   ├── app.module.ts             // Root module
│   └── ...
```

Let's implement the files:

**1. Interfaces/Models:**

`src/app/todo/models/todo.model.ts`
```typescript
export interface Todo {
  id: string; // Add a unique ID
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';
```
*Self-correction:* The original didn't have IDs. Adding IDs is crucial for efficient updates and tracking in Angular and NgRx, especially with `trackBy`.

**2. Core State Management (NgRx):**

`src/app/core/state/app.state.ts`
```typescript
import { TodoState } from './todo/todo.state';

export interface AppState {
  todos: TodoState;
  // Add other feature states here if needed
}
```

`src/app/core/state/todo/todo.state.ts`
```typescript
import { Todo, TodoFilter } from '../../../todo/models/todo.model';

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean; // Optional: Add loading state
  error: any;     // Optional: Add error state
}

export const initialTodoState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null,
};
```

`src/app/core/state/todo/todo.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo, TodoFilter } from '../../../todo/models/todo.model';

// Load Todos
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

// Save Todos (Triggered by effects after changes)
export const saveTodos = createAction('[Todo] Save Todos');

// CRUD Actions
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: string, changes: { title?: string, completed?: boolean } }>());

// Bulk Actions
export const toggleAllComplete = createAction('[Todo] Toggle All Complete', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');

// Filter Action
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: TodoFilter }>());
```
*Self-correction:* Added `loadTodos`, `loadTodosSuccess`, `loadTodosFailure`, and `saveTodos` actions to manage the persistence flow explicitly via effects. Added `id` to update/remove actions.

`src/app/core/state/todo/todo.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { initialTodoState } from './todo.state';
import * as TodoActions from './todo.actions';
import { Todo } from '../../../todo/models/todo.model';

// Helper to generate unique IDs (simple timestamp + random)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const todoReducer = createReducer(
  initialTodoState,

  // --- Loading ---
  on(TodoActions.loadTodos, (state) => ({ ...state, loading: true, error: null })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos, loading: false })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // --- CRUD ---
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: generateId(), // Generate ID here
      title: title.trim(),
      completed: false,
    };
    return {
      ...state,
      todos: [...state.todos, newTodo],
    };
  }),

  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  })),

  on(TodoActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, ...changes } : todo
    ),
  })),

  // --- Bulk Actions ---
  on(TodoActions.toggleAllComplete, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed })),
  })),

  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  })),

  // --- Filter ---
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter,
  }))
);
```
*Self-correction:* Added a simple ID generator. The reducer logic is purely functional, creating new state objects/arrays.

`src/app/core/state/todo/todo.selectors.ts`
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.state';
import { Todo } from '../../../todo/models/todo.model';

// Select the feature state
export const selectTodoState = createFeatureSelector<TodoState>('todos'); // 'todos' matches the key in AppState

// Select the array of todos
export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

// Select the current filter
export const selectTodoFilter = createSelector(
  selectTodoState,
  (state: TodoState) => state.filter
);

// Select filtered todos based on the current filter
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectTodoFilter,
  (todos: Todo[], filter: TodoFilter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }
);

// Select count of remaining (active) todos
export const selectRemainingCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.filter(todo => !todo.completed).length
);

// Select count of completed todos
export const selectCompletedCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.filter(todo => todo.completed).length
);

// Select total count of todos
export const selectTotalCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.length
);

// Select whether all todos are completed
export const selectIsAllCompleted = createSelector(
  selectTotalCount,
  selectRemainingCount,
  (total: number, remaining: number) => total > 0 && remaining === 0
);
```
*Self-correction:* Created selectors for filtered todos, counts, and the "all completed" state, mirroring the logic from the AngularJS controller.

**3. Core Service:**

`src/app/core/services/todo-storage.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../../todo/models/todo.model';

@Injectable({
  providedIn: 'root' // Makes the service a singleton available throughout the app
})
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular-ngrx';

  get(): Todo[] {
    try {
      const todos = localStorage.getItem(this.STORAGE_ID);
      return todos ? JSON.parse(todos) : [];
    } catch (e) {
      console.error('Error loading todos from localStorage', e);
      return [];
    }
  }

  put(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage', e);
    }
  }
}
```
*Self-correction:* Converted the factory service to an injectable class service. Added basic error handling for localStorage.

**4. Core Effects:**

`src/app/core/state/todo/todo.effects.ts`
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TodoActions from './todo.actions';
import { TodoStorageService } from '../../services/todo-storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectAllTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {

  constructor(
    private actions$: Actions,
    private todoStorageService: TodoStorageService,
    private store: Store<AppState> // Inject store to get current state
  ) {}

  // Effect to load todos from storage on app start
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = this.todoStorageService.get();
        return of(TodoActions.loadTodosSuccess({ todos }));
      }),
      catchError((error) => of(TodoActions.loadTodosFailure({ error })))
    )
  );

  // Effect to save todos to storage whenever the list changes
  // Listens to actions that modify the todo list
  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.removeTodo,
        TodoActions.updateTodo,
        TodoActions.toggleAllComplete,
        TodoActions.clearCompleted,
        TodoActions.loadTodosSuccess // Save after loading too, ensures initial state is saved if empty
      ),
      // Get the current state of todos after the action has been processed by the reducer
      withLatestFrom(this.store.select(selectAllTodos)),
      // Use tap for side effects that don't dispatch new actions
      tap(([action, todos]) => {
        this.todoStorageService.put(todos);
      })
    ),
    { dispatch: false } // This effect does not dispatch a new action
  );
}
```
*Self-correction:* Created effects for loading and saving. The `saveTodos$` effect listens to *all* actions that change the list and uses `withLatestFrom` to get the *updated* state from the store before saving. `tap` is used because saving is a side effect that doesn't result in a new state change action.

**5. Core Module:**

`src/app/core/core.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { todoReducer } from './state/todo/todo.reducer';
import { TodoEffects } from './state/todo/todo.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ todos: todoReducer }), // Register root reducer
    EffectsModule.forRoot([TodoEffects]),       // Register root effects
    // Instrumentation must be imported after StoreModule and EffectsModule
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    // TodoStorageService is providedIn: 'root', so no need to list here
  ]
})
export class CoreModule { }
```
*Self-correction:* Configured NgRx Store and Effects in the root module. Added StoreDevtools.

**6. Shared Directives:**

`src/app/shared/directives/todo-focus.directive.ts`
```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus!: boolean; // The condition to trigger focus

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if the todoFocus input changed and is now true
    if (changes['todoFocus'] && changes['todoFocus'].currentValue === true) {
      // Use a small timeout to ensure the element is visible/rendered
      // before attempting to focus. Similar to AngularJS $timeout(0).
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```
*Self-correction:* Converted AngularJS directive to Angular. Uses `@Input` for the condition and `ElementRef` to access the DOM element. `ngOnChanges` is used to react to input changes. `setTimeout(0)` mimics the AngularJS `$timeout(0)` behavior for focusing after render.

`src/app/shared/directives/todo-escape.directive.ts`
```typescript
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter<void>(); // Event emitter for escape key

  // Listen for the keydown event on the host element
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const ESCAPE_KEY = 27;
    if (event.keyCode === ESCAPE_KEY) {
      this.todoEscape.emit(); // Emit the event
    }
  }

  constructor(private el: ElementRef) { }
}
```
*Self-correction:* Converted AngularJS directive to Angular. Uses `@Output` to emit an event and `@HostListener` to listen for the `keydown` event.

**7. Shared Module:**

`src/app/shared/shared.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    CommonModule,
    FormsModule // Import FormsModule here
  ],
  exports: [
    CommonModule, // Export CommonModule for components using this module
    FormsModule,  // Export FormsModule
    TodoFocusDirective,
    TodoEscapeDirective
  ]
})
export class SharedModule { }
```
*Self-correction:* Created a shared module to group directives and common Angular modules like `CommonModule` and `FormsModule`.

**8. Feature Components (Todo):**

`src/app/todo/components/todo-app-container/todo-app-container.component.ts`
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.state';
import {
  selectFilteredTodos,
  selectRemainingCount,
  selectCompletedCount,
  selectTotalCount,
  selectIsAllCompleted,
  selectTodoFilter
} from '../../../core/state/todo/todo.selectors';
import * as TodoActions from '../../../core/state/todo/todo.actions';
import { Todo, TodoFilter } from '../../models/todo.model';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-app-container',
  templateUrl: './todo-app-container.component.html',
  styleUrls: ['./todo-app-container.component.css'] // Assuming no specific styles needed, but keep structure
})
export class TodoAppContainerComponent implements OnInit, OnDestroy {
  filteredTodos$: Observable<Todo[]>;
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;
  totalCount$: Observable<number>;
  isAllCompleted$: Observable<boolean>;
  currentFilter$: Observable<TodoFilter>;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute // Inject ActivatedRoute to get route params
  ) {
    // Select data from the store
    this.filteredTodos$ = this.store.select(selectFilteredTodos);
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
    this.totalCount$ = this.store.select(selectTotalCount);
    this.isAllCompleted$ = this.store.select(selectIsAllCompleted);
    this.currentFilter$ = this.store.select(selectTodoFilter);
  }

  ngOnInit(): void {
    // Dispatch action to load todos when the component initializes
    this.store.dispatch(TodoActions.loadTodos());

    // Listen to route changes to update the filter state
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const filter = params['filter'] || 'all'; // Default to 'all'
        // Ensure the filter is a valid type before dispatching
        if (['all', 'active', 'completed'].includes(filter)) {
           this.store.dispatch(TodoActions.setFilter({ filter: filter as TodoFilter }));
        } else {
           // Handle invalid filter, maybe redirect or default? For now, just default.
           this.store.dispatch(TodoActions.setFilter({ filter: 'all' }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers that dispatch actions
  onAddTodo(title: string): void {
    if (title.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title }));
    }
  }

  onRemoveTodo(id: string): void {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  onUpdateTodo(todo: Todo): void {
     // Dispatch update action with the whole todo or just changes
     // Let's dispatch changes for clarity
     this.store.dispatch(TodoActions.updateTodo({ id: todo.id, changes: { title: todo.title } }));
  }

  onToggleComplete(todo: Todo): void {
    this.store.dispatch(TodoActions.updateTodo({ id: todo.id, changes: { completed: !todo.completed } }));
  }

  onToggleAllComplete(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAllComplete({ completed }));
  }

  onClearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  // Filter is handled by route params, dispatched in ngOnInit
}
```
*Self-correction:* This component acts as the "smart" container. It injects the `Store` and `ActivatedRoute`. It selects necessary data observables from the store and dispatches actions based on events received from its presentational children. It also reads the route parameter to set the filter.

`src/app/todo/components/todo-app-container/todo-app-container.component.html`
```html
<section class="todoapp">
  <app-todo-header (addTodo)="onAddTodo($event)"></app-todo-header>

  <section class="main" *ngIf="(totalCount$ | async) > 0">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="isAllCompleted$ | async"
      (change)="onToggleAllComplete($event.target?.checked)"
    >
    <label for="toggle-all">Mark all as complete</label>

    <app-todo-list
      [todos]="filteredTodos$ | async"
      (removeTodo)="onRemoveTodo($event)"
      (updateTodo)="onUpdateTodo($event)"
      (toggleComplete)="onToggleComplete($event)"
    ></app-todo-list>
  </section>

  <app-todo-footer
    *ngIf="(totalCount$ | async) > 0"
    [remainingCount]="remainingCount$ | async"
    [completedCount]="completedCount$ | async"
    [currentFilter]="currentFilter$ | async"
    (clearCompleted)="onClearCompleted()"
  ></app-todo-footer>
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
*Self-correction:* Replaced AngularJS directives (`ng-controller`, `ng-show`, `ng-cloak`, `ng-model`, `ng-click`, `ng-repeat`, `ng-class`, `ng-pluralize`, `ng-submit`, `ng-dblclick`, `ng-trim`, `ng-blur`) with Angular equivalents (`<app-...>`, `*ngIf`, `[checked]`, `(change)`, `[todos]`, `(removeTodo)`, `(updateTodo)`, `(toggleComplete)`, `[remainingCount]`, `[completedCount]`, `[currentFilter]`, `(clearCompleted)`). Used the `async` pipe to subscribe to observables.

`src/app/todo/components/todo-header/todo-header.component.ts`
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodoTitle = '';

  @Output() addTodo = new EventEmitter<string>();

  constructor() { }

  onFormSubmit(): void {
    const title = this.newTodoTitle.trim();
    if (title) {
      this.addTodo.emit(title);
      this.newTodoTitle = ''; // Clear input after emitting
    }
  }
}
```
*Self-correction:* Simple presentational component. Manages its own input state (`newTodoTitle`) and emits an event (`addTodo`) when the form is submitted.

`src/app/todo/components/todo-header/todo-header.component.html`
```html
<header class="header">
  <h1>todos</h1>
  <form (submit)="onFormSubmit()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
      [(ngModel)]="newTodoTitle"
      name="newTodoTitle"
    >
  </form>
</header>
```
*Self-correction:* Uses `[(ngModel)]` for two-way binding and `(submit)` for form submission.

`src/app/todo/components/todo-list/todo-list.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = []; // Input list of todos
  @Output() removeTodo = new EventEmitter<string>();
  @Output() updateTodo = new EventEmitter<Todo>(); // Emits the todo with updated title after editing
  @Output() toggleComplete = new EventEmitter<Todo>(); // Emits the todo after toggling completed state

  constructor() { }

  // TrackBy function for *ngFor performance
  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }

  onRemoveTodo(id: string): void {
    this.removeTodo.emit(id);
  }

  onUpdateTodo(todo: Todo): void {
    this.updateTodo.emit(todo);
  }

  onToggleComplete(todo: Todo): void {
    this.toggleComplete.emit(todo);
  }
}
```
*Self-correction:* Presentational component. Receives the `todos` array as input. Emits events for actions on individual todos. Added `trackBy` function for `*ngFor`. Used `ChangeDetectionStrategy.OnPush` as the component only depends on its inputs.

`src/app/todo/components/todo-list/todo-list.component.html`
```html
<ul class="todo-list">
  <app-todo-item
    *ngFor="let todo of todos; trackBy: trackByTodoId"
    [todo]="todo"
    (remove)="onRemoveTodo($event)"
    (update)="onUpdateTodo($event)"
    (toggleComplete)="onToggleComplete($event)"
  ></app-todo-item>
</ul>
```
*Self-correction:* Uses `*ngFor` with `trackBy` and renders `app-todo-item` for each todo.

`src/app/todo/components/todo-item/todo-item.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: Todo; // Input single todo item
  @Output() remove = new EventEmitter<string>();
  @Output() update = new EventEmitter<Todo>(); // Emits the todo with updated title
  @Output() toggleComplete = new EventEmitter<Todo>(); // Emits the todo after toggling completed state

  isEditing = false;
  editedTitle = '';
  originalTitle = ''; // Store original title for reverting

  // Reference to the edit input element for focusing
  @ViewChild('editInput') editInput!: ElementRef;

  constructor() { }

  // Use ngOnChanges to update internal state when the input todo changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && this.todo) {
      this.editedTitle = this.todo.title;
      this.originalTitle = this.todo.title;
    }
  }

  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo);
  }

  onRemove(): void {
    this.remove.emit(this.todo.id);
  }

  onEdit(): void {
    this.isEditing = true;
    this.editedTitle = this.todo.title; // Ensure editedTitle is fresh
    this.originalTitle = this.todo.title; // Store original
    // Focus is handled by the todoFocus directive triggered by isEditing
  }

  doneEditing(): void {
    if (!this.isEditing) {
      return; // Prevent multiple calls
    }

    const trimmedTitle = this.editedTitle.trim();

    if (!trimmedTitle) {
      // If title is empty after trimming, remove the todo
      this.onRemove();
    } else if (trimmedTitle !== this.originalTitle) {
      // If title changed, emit update
      this.update.emit({ ...this.todo, title: trimmedTitle });
    }
    // If title didn't change but wasn't empty, do nothing

    this.isEditing = false;
  }

  revertEditing(): void {
    this.isEditing = false;
    // No need to emit update, just reset internal state
    this.editedTitle = this.originalTitle;
  }

  // Handle blur event - triggers doneEditing
  onBlur(): void {
    this.doneEditing();
  }

  // Handle escape key event - triggers revertEditing
  onEscape(): void {
    this.revertEditing();
  }
}
```
*Self-correction:* This component manages the state and logic for a single todo item, including the editing state. It uses `isEditing` to toggle between view and edit modes. `editedTitle` holds the value during editing. `originalTitle` is stored to revert changes on escape. `ngOnChanges` ensures internal state is updated if the input `todo` object reference changes (less likely with NgRx, but good practice). `ChangeDetectionStrategy.OnPush` is used.

`src/app/todo/components/todo-item/todo-item.component.html`
```html
<li [ngClass]="{completed: todo.completed, editing: isEditing}">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggleComplete()"
    >
    <label (dblclick)="onEdit()">{{todo.title}}</label>
    <button class="destroy" (click)="onRemove()"></button>
  </div>
  <!-- Use a form to handle submit on Enter key -->
  <form (submit)="doneEditing()">
    <input
      #editInput
      class="edit"
      [(ngModel)]="editedTitle"
      name="editedTitle"
      (blur)="onBlur()"
      (todoEscape)="onEscape()"
      [todoFocus]="isEditing"
    >
  </form>
</li>
```
*Self-correction:* Uses `[ngClass]` for conditional classes. `[checked]` and `(change)` for the checkbox. `(dblclick)` on the label. `(click)` on the destroy button. The edit input uses `[(ngModel)]`, `(blur)`, the custom `(todoEscape)` output, and the custom `[todoFocus]` input. The input is wrapped in a `<form>` so pressing Enter triggers the `submit` event, calling `doneEditing()`.

`src/app/todo/components/todo-footer/todo-footer.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoFooterComponent {
  @Input() remainingCount: number | null = 0;
  @Input() completedCount: number | null = 0;
  @Input() currentFilter: TodoFilter | null = 'all';

  @Output() clearCompleted = new EventEmitter<void>();

  constructor() { }

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }

  // Helper to determine if 'Clear completed' button should be shown
  get showClearCompleted(): boolean {
    return (this.completedCount || 0) > 0;
  }

  // Helper for pluralization (simple version)
  get remainingText(): string {
    const count = this.remainingCount || 0;
    return `${count} item${count === 1 ? '' : 's'} left`;
  }
}
```
*Self-correction:* Presentational component. Receives counts and filter as inputs. Emits `clearCompleted` event. Added helper getters for showing the clear button and for the remaining items text (simple pluralization). `ChangeDetectionStrategy.OnPush` is used.

`src/app/todo/components/todo-footer/todo-footer.component.html`
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong> {{ remainingText }}
  </span>
  <ul class="filters">
    <li>
      <a routerLink="/all" routerLinkActive="selected" [class.selected]="currentFilter === 'all'">All</a>
    </li>
    <li>
      <a routerLink="/active" routerLinkActive="selected" [class.selected]="currentFilter === 'active'">Active</a>
    </li>
    <li>
      <a routerLink="/completed" routerLinkActive="selected" [class.selected]="currentFilter === 'completed'">Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    (click)="onClearCompleted()"
    *ngIf="showClearCompleted"
  >
    Clear completed
  </button>
</footer>
```
*Self-correction:* Uses `routerLink` and `routerLinkActive` for navigation and active class. Also explicitly binds `[class.selected]` based on the `currentFilter` input, which comes from the store (set by the route). `(click)` for the button and `*ngIf` based on the helper getter. Replaced `ng-pluralize` with the simple `remainingText` getter.

**9. Feature Module (Todo):**

`src/app/todo/todo.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { TodoAppContainerComponent } from './components/todo-app-container/todo-app-container.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { SharedModule } from '../shared/shared.module'; // Import shared module
import { TodoRoutingModule } from './todo-routing.module'; // Import feature routing

@NgModule({
  declarations: [
    TodoAppContainerComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    SharedModule, // Import SharedModule which includes CommonModule and FormsModule
    TodoRoutingModule // Import feature routing
  ],
  exports: [
    // Export the container component if it's used outside this module (e.g., in AppRoutingModule)
    TodoAppContainerComponent
  ]
})
export class TodoModule { }
```
*Self-correction:* Created a feature module to group all todo-related components and import necessary shared modules and routing.

**10. Feature Routing:**

`src/app/todo/todo-routing.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppContainerComponent } from './components/todo-app-container/todo-app-container.component';

const routes: Routes = [
  // Route with optional filter parameter
  { path: ':filter', component: TodoAppContainerComponent },
  // Default route redirects to /all
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  // Catch-all for invalid paths, redirect to /all
  { path: '**', redirectTo: '/all' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild for feature modules
  exports: [RouterModule]
})
export class TodoRoutingModule { }
```
*Self-correction:* Configured feature routes. The `:filter` parameter captures 'all', 'active', or 'completed'. Added redirects for the root path and any invalid paths.

**11. Root App Module & Routing:**

`src/app/app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Root routing
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module'; // Core module with NgRx
import { TodoModule } from './todo/todo.module'; // Feature module

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Root routing module
    CoreModule,       // Core services and NgRx setup
    TodoModule        // Feature module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
*Self-correction:* The root module imports the necessary feature and core modules.

`src/app/app-routing.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Lazy load the TodoModule or load it eagerly.
  // Since it's the main app content, eager loading is fine here.
  // The actual routes are defined within TodoRoutingModule.
  {
    path: '',
    loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Use hash routing like original
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
*Self-correction:* Configured root routing. It points the root path to the `TodoModule`. Used `useHash: true` in `RouterModule.forRoot` to match the original AngularJS app's hash-based routing (`#/`).

`src/app/app.component.html`
```html
<!-- The router outlet will render the component associated with the current route -->
<router-outlet></router-outlet>
```
*Self-correction:* Simple root component template containing only the router outlet.

`src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ngrx-todomvc';
}
```
*Self-correction:* Default root component.

**12. Update `index.html`:**

Replace the content of `src/index.html` with a minimal Angular bootstrap:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx • TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- CSS is included via angular.json -->
</head>
<body>
  <app-root></app-root> <!-- Your root Angular component -->
</body>
</html>
```
*Self-correction:* Removed all AngularJS/RequireJS specific tags and included the `<app-root>` selector.

**13. Final Checks and Optimizations:**

*   **TypeScript:** Ensure strict mode is enabled in `tsconfig.json` for better type safety.
*   **NgRx Best Practices:** Selectors are memoized by default, which is good for performance. Effects handle side effects cleanly. Reducers are pure functions.
*   **Component Architecture:** The container/presentational pattern is applied, improving testability and separation of concerns. `OnPush` change detection is used where appropriate.
*   **Directives:** Custom directives are implemented using Angular's `@Directive`.
*   **Services:** Services are injectable and follow Angular DI.
*   **Routing:** Angular Router is used for navigation and filter state.
*   **No TODOs:** All logic from the original app is migrated.
*   **Style Guide:** Follows standard Angular style guide conventions (naming, structure).

**To Run:**

1.  Make sure you have Angular CLI installed (`npm install -g @angular/cli`).
2.  Navigate to the project directory (`cd angular-ngrx-todomvc`).
3.  Install dependencies (`npm install`).
4.  Start the development server (`ng serve -o`).

The application should now run in your browser, functionally equivalent to the original AngularJS version but built with Angular 14 and NgRx. You can navigate between `/`, `/active`, and `/completed` using the footer links, and the list will filter accordingly. Todos will persist in localStorage.Okay, let's migrate the provided AngularJS application to Angular 14.x using NgRx.

We will create a new Angular project and translate the functionality piece by piece.

**1. Project Setup**

First, ensure you have the Angular CLI installed (`npm install -g @angular/cli`).

Create a new Angular project:

```bash
ng new angular-ngrx-todomvc --style css --routing false
cd angular-ngrx-todomvc
```

Install NgRx:

```bash
ng add @ngrx/store@14 @ngrx/effects@14 @ngrx/store-devtools@14
```

Install the original TodoMVC CSS (used for styling):

```bash
npm install todomvc-common todomvc-app-css --save-dev
```

Update `angular.json` to include the CSS files in the build process. Find the `architect.build.options.styles` array and add the paths:

```json
"styles": [
  "src/styles.css",
  "node_modules/todomvc-common/base.css",
  "node_modules/todomvc-app-css/index.css"
],
```

Remove the old AngularJS/RequireJS specific files and folders (`js/`, `node_modules/angular`, `node_modules/requirejs`).

**2. Core State Management (NgRx)**

We'll define the state structure, actions, reducer, selectors, and effects for the todos.

`src/app/core/state/todo/todo.state.ts`
```typescript
import { Todo } from '../../../todo/models/todo.model';
import { TodoFilter } from '../../../todo/models/todo.model';

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean; // Optional: Add loading state
  error: any;     // Optional: Add error state
}

export const initialTodoState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null,
};
```

`src/app/core/state/app.state.ts`
```typescript
import { TodoState } from './todo/todo.state';

export interface AppState {
  todos: TodoState;
  // Add other feature states here if needed
}
```

`src/app/core/state/todo/todo.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo, TodoFilter } from '../../../todo/models/todo.model';

// Load Todos
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

// Save Todos (Triggered by effects after changes)
export const saveTodos = createAction('[Todo] Save Todos');

// CRUD Actions
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: string, changes: { title?: string, completed?: boolean } }>());

// Bulk Actions
export const toggleAllComplete = createAction('[Todo] Toggle All Complete', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');

// Filter Action
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: TodoFilter }>());
```

`src/app/core/state/todo/todo.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { initialTodoState } from './todo.state';
import * as TodoActions from './todo.actions';
import { Todo } from '../../../todo/models/todo.model';

// Helper to generate unique IDs (simple timestamp + random)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const todoReducer = createReducer(
  initialTodoState,

  // --- Loading ---
  on(TodoActions.loadTodos, (state) => ({ ...state, loading: true, error: null })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos, loading: false })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // --- CRUD ---
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: generateId(), // Generate ID here
      title: title.trim(),
      completed: false,
    };
    return {
      ...state,
      todos: [...state.todos, newTodo],
    };
  }),

  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  })),

  on(TodoActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, ...changes } : todo
    ),
  })),

  // --- Bulk Actions ---
  on(TodoActions.toggleAllComplete, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed })),
  })),

  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  })),

  // --- Filter ---
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter,
  }))
);
```

`src/app/core/state/todo/todo.selectors.ts`
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.state';
import { Todo, TodoFilter } from '../../../todo/models/todo.model';

// Select the feature state
export const selectTodoState = createFeatureSelector<TodoState>('todos'); // 'todos' matches the key in AppState

// Select the array of todos
export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

// Select the current filter
export const selectTodoFilter = createSelector(
  selectTodoState,
  (state: TodoState) => state.filter
);

// Select filtered todos based on the current filter
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectTodoFilter,
  (todos: Todo[], filter: TodoFilter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }
);

// Select count of remaining (active) todos
export const selectRemainingCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.filter(todo => !todo.completed).length
);

// Select count of completed todos
export const selectCompletedCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.filter(todo => todo.completed).length
);

// Select total count of todos
export const selectTotalCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.length
);

// Select whether all todos are completed
export const selectIsAllCompleted = createSelector(
  selectTotalCount,
  selectRemainingCount,
  (total: number, remaining: number) => total > 0 && remaining === 0
);
```

**3. Core Service**

This service handles the `localStorage` interaction.

`src/app/core/services/todo-storage.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../../todo/models/todo.model';

@Injectable({
  providedIn: 'root' // Makes the service a singleton available throughout the app
})
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular-ngrx';

  get(): Todo[] {
    try {
      const todos = localStorage.getItem(this.STORAGE_ID);
      return todos ? JSON.parse(todos) : [];
    } catch (e) {
      console.error('Error loading todos from localStorage', e);
      return [];
    }
  }

  put(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage', e);
    }
  }
}
```

**4. Core Effects**

Effects handle side effects like loading from and saving to `localStorage`.

`src/app/core/state/todo/todo.effects.ts`
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TodoActions from './todo.actions';
import { TodoStorageService } from '../../services/todo-storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectAllTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {

  constructor(
    private actions$: Actions,
    private todoStorageService: TodoStorageService,
    private store: Store<AppState> // Inject store to get current state
  ) {}

  // Effect to load todos from storage on app start
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = this.todoStorageService.get();
        return of(TodoActions.loadTodosSuccess({ todos }));
      }),
      catchError((error) => of(TodoActions.loadTodosFailure({ error })))
    )
  );

  // Effect to save todos to storage whenever the list changes
  // Listens to actions that modify the todo list
  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.removeTodo,
        TodoActions.updateTodo,
        TodoActions.toggleAllComplete,
        TodoActions.clearCompleted,
        TodoActions.loadTodosSuccess // Save after loading too, ensures initial state is saved if empty
      ),
      // Get the current state of todos after the action has been processed by the reducer
      withLatestFrom(this.store.select(selectAllTodos)),
      // Use tap for side effects that don't dispatch new actions
      tap(([action, todos]) => {
        this.todoStorageService.put(todos);
      })
    ),
    { dispatch: false } // This effect does not dispatch a new action
  );
}
```

**5. Core Module**

Group the core NgRx setup and services.

`src/app/core/core.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { todoReducer } from './state/todo/todo.reducer';
import { TodoEffects } from './state/todo/todo.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ todos: todoReducer }), // Register root reducer
    EffectsModule.forRoot([TodoEffects]),       // Register root effects
    // Instrumentation must be imported after StoreModule and EffectsModule
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    // TodoStorageService is providedIn: 'root', so no need to list here
  ]
})
export class CoreModule { }
```

**6. Shared Directives**

Convert the custom AngularJS directives.

`src/app/shared/directives/todo-focus.directive.ts`
```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus!: boolean; // The condition to trigger focus

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if the todoFocus input changed and is now true
    if (changes['todoFocus'] && changes['todoFocus'].currentValue === true) {
      // Use a small timeout to ensure the element is visible/rendered
      // before attempting to focus. Similar to AngularJS $timeout(0).
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```

`src/app/shared/directives/todo-escape.directive.ts`
```typescript
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter<void>(); // Event emitter for escape key

  // Listen for the keydown event on the host element
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const ESCAPE_KEY = 27;
    if (event.keyCode === ESCAPE_KEY) {
      this.todoEscape.emit(); // Emit the event
    }
  }

  constructor(private el: ElementRef) { }
}
```

**7. Shared Module**

Group shared directives and common Angular modules.

`src/app/shared/shared.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    CommonModule,
    FormsModule // Import FormsModule here
  ],
  exports: [
    CommonModule, // Export CommonModule for components using this module
    FormsModule,  // Export FormsModule
    TodoFocusDirective,
    TodoEscapeDirective
  ]
})
export class SharedModule { }
```

**8. Feature Components (Todo)**

Break down the UI into smaller components.

`src/app/todo/models/todo.model.ts`
```typescript
export interface Todo {
  id: string; // Add a unique ID
  title: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';
```

`src/app/todo/components/todo-app-container/todo-app-container.component.ts`
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.state';
import {
  selectFilteredTodos,
  selectRemainingCount,
  selectCompletedCount,
  selectTotalCount,
  selectIsAllCompleted,
  selectTodoFilter
} from '../../../core/state/todo/todo.selectors';
import * as TodoActions from '../../../core/state/todo/todo.actions';
import { Todo, TodoFilter } from '../../models/todo.model';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-app-container',
  templateUrl: './todo-app-container.component.html',
  styleUrls: ['./todo-app-container.component.css']
})
export class TodoAppContainerComponent implements OnInit, OnDestroy {
  filteredTodos$: Observable<Todo[]>;
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;
  totalCount$: Observable<number>;
  isAllCompleted$: Observable<boolean>;
  currentFilter$: Observable<TodoFilter>;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute // Inject ActivatedRoute to get route params
  ) {
    // Select data from the store
    this.filteredTodos$ = this.store.select(selectFilteredTodos);
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
    this.totalCount$ = this.store.select(selectTotalCount);
    this.isAllCompleted$ = this.store.select(selectIsAllCompleted);
    this.currentFilter$ = this.store.select(selectTodoFilter);
  }

  ngOnInit(): void {
    // Dispatch action to load todos when the component initializes
    this.store.dispatch(TodoActions.loadTodos());

    // Listen to route changes to update the filter state
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const filter = params['filter'] || 'all'; // Default to 'all'
        // Ensure the filter is a valid type before dispatching
        if (['all', 'active', 'completed'].includes(filter)) {
           this.store.dispatch(TodoActions.setFilter({ filter: filter as TodoFilter }));
        } else {
           // Handle invalid filter, maybe redirect or default? For now, just default.
           this.store.dispatch(TodoActions.setFilter({ filter: 'all' }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers that dispatch actions
  onAddTodo(title: string): void {
    if (title.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title }));
    }
  }

  onRemoveTodo(id: string): void {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  onUpdateTodo(todo: Todo): void {
     // Dispatch update action with the whole todo or just changes
     // Let's dispatch changes for clarity
     this.store.dispatch(TodoActions.updateTodo({ id: todo.id, changes: { title: todo.title } }));
  }

  onToggleComplete(todo: Todo): void {
    this.store.dispatch(TodoActions.updateTodo({ id: todo.id, changes: { completed: !todo.completed } }));
  }

  onToggleAllComplete(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAllComplete({ completed }));
  }

  onClearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

`src/app/todo/components/todo-app-container/todo-app-container.component.html`
```html
<section class="todoapp">
  <app-todo-header (addTodo)="onAddTodo($event)"></app-todo-header>

  <section class="main" *ngIf="(totalCount$ | async) > 0">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="isAllCompleted$ | async"
      (change)="onToggleAllComplete($event.target?.checked)"
    >
    <label for="toggle-all">Mark all as complete</label>

    <app-todo-list
      [todos]="filteredTodos$ | async"
      (removeTodo)="onRemoveTodo($event)"
      (updateTodo)="onUpdateTodo($event)"
      (toggleComplete)="onToggleComplete($event)"
    ></app-todo-list>
  </section>

  <app-todo-footer
    *ngIf="(totalCount$ | async) > 0"
    [remainingCount]="remainingCount$ | async"
    [completedCount]="completedCount$ | async"
    [currentFilter]="currentFilter$ | async"
    (clearCompleted)="onClearCompleted()"
  ></app-todo-footer>
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

`src/app/todo/components/todo-header/todo-header.component.ts`
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodoTitle = '';

  @Output() addTodo = new EventEmitter<string>();

  constructor() { }

  onFormSubmit(): void {
    const title = this.newTodoTitle.trim();
    if (title) {
      this.addTodo.emit(title);
      this.newTodoTitle = ''; // Clear input after emitting
    }
  }
}
```

`src/app/todo/components/todo-header/todo-header.component.html`
```html
<header class="header">
  <h1>todos</h1>
  <form (submit)="onFormSubmit()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
      [(ngModel)]="newTodoTitle"
      name="newTodoTitle"
    >
  </form>
</header>
```

`src/app/todo/components/todo-list/todo-list.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = []; // Input list of todos
  @Output() removeTodo = new EventEmitter<string>();
  @Output() updateTodo = new EventEmitter<Todo>(); // Emits the todo with updated title after editing
  @Output() toggleComplete = new EventEmitter<Todo>(); // Emits the todo after toggling completed state

  constructor() { }

  // TrackBy function for *ngFor performance
  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }

  onRemoveTodo(id: string): void {
    this.removeTodo.emit(id);
  }

  onUpdateTodo(todo: Todo): void {
    this.updateTodo.emit(todo);
  }

  onToggleComplete(todo: Todo): void {
    this.toggleComplete.emit(todo);
  }
}
```

`src/app/todo/components/todo-list/todo-list.component.html`
```html
<ul class="todo-list">
  <app-todo-item
    *ngFor="let todo of todos; trackBy: trackByTodoId"
    [todo]="todo"
    (remove)="onRemoveTodo($event)"
    (update)="onUpdateTodo($event)"
    (toggleComplete)="onToggleComplete($event)"
  ></app-todo-item>
</ul>
```

`src/app/todo/components/todo-item/todo-item.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: Todo; // Input single todo item
  @Output() remove = new EventEmitter<string>();
  @Output() update = new EventEmitter<Todo>(); // Emits the todo with updated title
  @Output() toggleComplete = new EventEmitter<Todo>(); // Emits the todo after toggling completed state

  isEditing = false;
  editedTitle = '';
  originalTitle = ''; // Store original title for reverting

  // Reference to the edit input element for focusing
  @ViewChild('editInput') editInput!: ElementRef;

  constructor() { }

  // Use ngOnChanges to update internal state when the input todo changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && this.todo) {
      this.editedTitle = this.todo.title;
      this.originalTitle = this.todo.title;
    }
  }

  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo);
  }

  onRemove(): void {
    this.remove.emit(this.todo.id);
  }

  onEdit(): void {
    this.isEditing = true;
    this.editedTitle = this.todo.title; // Ensure editedTitle is fresh
    this.originalTitle = this.todo.title; // Store original
    // Focus is handled by the todoFocus directive triggered by isEditing
  }

  doneEditing(): void {
    if (!this.isEditing) {
      return; // Prevent multiple calls
    }

    const trimmedTitle = this.editedTitle.trim();

    if (!trimmedTitle) {
      // If title is empty after trimming, remove the todo
      this.onRemove();
    } else if (trimmedTitle !== this.originalTitle) {
      // If title changed, emit update
      this.update.emit({ ...this.todo, title: trimmedTitle });
    }
    // If title didn't change but wasn't empty, do nothing

    this.isEditing = false;
  }

  revertEditing(): void {
    this.isEditing = false;
    // No need to emit update, just reset internal state
    this.editedTitle = this.originalTitle;
  }

  // Handle blur event - triggers doneEditing
  onBlur(): void {
    this.doneEditing();
  }

  // Handle escape key event - triggers revertEditing
  onEscape(): void {
    this.revertEditing();
  }
}
```

`src/app/todo/components/todo-item/todo-item.component.html`
```html
<li [ngClass]="{completed: todo.completed, editing: isEditing}">
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="onToggleComplete()"
    >
    <label (dblclick)="onEdit()">{{todo.title}}</label>
    <button class="destroy" (click)="onRemove()"></button>
  </div>
  <!-- Use a form to handle submit on Enter key -->
  <form (submit)="doneEditing()">
    <input
      #editInput
      class="edit"
      [(ngModel)]="editedTitle"
      name="editedTitle"
      (blur)="onBlur()"
      (todoEscape)="onEscape()"
      [todoFocus]="isEditing"
    >
  </form>
</li>
```

`src/app/todo/components/todo-footer/todo-footer.component.ts`
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize rendering
})
export class TodoFooterComponent {
  @Input() remainingCount: number | null = 0;
  @Input() completedCount: number | null = 0;
  @Input() currentFilter: TodoFilter | null = 'all';

  @Output() clearCompleted = new EventEmitter<void>();

  constructor() { }

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }

  // Helper to determine if 'Clear completed' button should be shown
  get showClearCompleted(): boolean {
    return (this.completedCount || 0) > 0;
  }

  // Helper for pluralization (simple version)
  get remainingText(): string {
    const count = this.remainingCount || 0;
    return `${count} item${count === 1 ? '' : 's'} left`;
  }
}
```

`src/app/todo/components/todo-footer/todo-footer.component.html`
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong> {{ remainingText }}
  </span>
  <ul class="filters">
    <li>
      <a routerLink="/all" routerLinkActive="selected" [class.selected]="currentFilter === 'all'">All</a>
    </li>
    <li>
      <a routerLink="/active" routerLinkActive="selected" [class.selected]="currentFilter === 'active'">Active</a>
    </li>
    <li>
      <a routerLink="/completed" routerLinkActive="selected" [class.selected]="currentFilter === 'completed'">Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    (click)="onClearCompleted()"
    *ngIf="showClearCompleted"
  >
    Clear completed
  </button>
</footer>
```

**9. Feature Module (Todo)**

Group all todo-related components and modules.

`src/app/todo/todo.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { TodoAppContainerComponent } from './components/todo-app-container/todo-app-container.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { SharedModule } from '../shared/shared.module'; // Import shared module
import { TodoRoutingModule } from './todo-routing.module'; // Import feature routing

@NgModule({
  declarations: [
    TodoAppContainerComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent
  ],
  imports: [
    SharedModule, // Import SharedModule which includes CommonModule and FormsModule
    TodoRoutingModule // Import feature routing
  ],
  exports: [
    // Export the container component if it's used outside this module (e.g., in AppRoutingModule)
    TodoAppContainerComponent
  ]
})
export class TodoModule { }
```

**10. Feature Routing**

Configure routing for the filter states.

`src/app/todo/todo-routing.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppContainerComponent } from './components/todo-app-container/todo-app-container.component';

const routes: Routes = [
  // Route with optional filter parameter
  { path: ':filter', component: TodoAppContainerComponent },
  // Default route redirects to /all
  { path: '', redirectTo: '/all', pathMatch: 'full' },
  // Catch-all for invalid paths, redirect to /all
  { path: '**', redirectTo: '/all' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild for feature modules
  exports: [RouterModule]
})
export class TodoRoutingModule { }
```

**11. Root App Module & Routing**

Set up the main application module and root routing.

`src/app/app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Root routing
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module'; // Core module with NgRx
import { TodoModule } from './todo/todo.module'; // Feature module

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Root routing module
    CoreModule,       // Core services and NgRx setup
    TodoModule        // Feature module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

`src/app/app-routing.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Lazy load the TodoModule or load it eagerly.
  // Since it's the main app content, eager loading is fine here.
  // The actual routes are defined within TodoRoutingModule.
  {
    path: '',
    loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Use hash routing like original
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

`src/app/app.component.html`
```html
<!-- The router outlet will render the component associated with the current route -->
<router-outlet></router-outlet>
```

`src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ngrx-todomvc';
}
```

**12. Update `index.html`**

Replace the content of `src/index.html` with a minimal Angular bootstrap:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx • TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- CSS is included via angular.json -->
</head>
<body>
  <app-root></app-root> <!-- Your root Angular component -->
</body>
</html>
```

**Summary of Changes and Optimizations:**

1.  **Module System:** Replaced RequireJS with standard ES Modules and Angular's module system (`NgModule`).
2.  **State Management:** Replaced `$scope` and controller state with NgRx Store, Actions, Reducers, Selectors, and Effects.
3.  **Component Architecture:** Broke down the single `TodoController` and its template into a container component (`TodoAppContainerComponent`) and several presentational components (`TodoHeaderComponent`, `TodoListComponent`, `TodoItemComponent`, `TodoFooterComponent`). Communication uses `@Input` and `@Output`.
4.  **Services:** Converted the `todoStorage` factory service into an injectable Angular service (`TodoStorageService`) used by NgRx Effects.
5.  **HTML Templates:** Translated AngularJS directives (`ng-controller`, `ng-submit`, `ng-model`, `ng-show`, `ng-cloak`, `ng-repeat`, `ng-class`, `ng-click`, `ng-dblclick`, `ng-trim`, `ng-blur`, `ng-pluralize`) to Angular equivalents (`<app-...>`, `(submit)`, `[(ngModel)]`, `*ngIf`, `*ngFor`, `[ngClass]`, `(click)`, `(dblclick)`, `(blur)`, `routerLink`, `routerLinkActive`, `[class.selected]`). Used the `async` pipe for observables.
6.  **Directives:** Converted custom directives (`todoFocus`, `todoEscape`) to Angular `@Directive` classes using `ElementRef`, `@Input`, `@Output`, and `@HostListener`.
7.  **Routing:** Replaced `$location.path()` logic with Angular Router, using route parameters to manage the filter state. Used hash routing (`useHash: true`) to match the original app's URL style.
8.  **Optimization:** Used `ChangeDetectionStrategy.OnPush` on presentational components. Implemented `trackBy` for `*ngFor`. NgRx selectors provide memoization.
9.  **Code Quality:** Used TypeScript, followed Angular structure and conventions. Removed AngularJS-specific patterns. Added unique IDs to todos for better tracking.

This completes the migration to Angular 14.x with NgRx. You can now build and serve the application using the Angular CLI.

### Tokens: {'input_tokens': 2787, 'output_tokens': 19353}
### Execution time: 93.83473610877991
