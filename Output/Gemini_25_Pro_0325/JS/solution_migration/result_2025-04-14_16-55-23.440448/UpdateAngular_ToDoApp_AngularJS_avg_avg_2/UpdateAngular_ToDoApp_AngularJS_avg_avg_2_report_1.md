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
Okay, let's migrate the AngularJS TodoMVC application to Angular 14+ using NgRx for state management and following modern Angular best practices.

**1. Project Setup (Using Angular CLI)**

First, create a new Angular project:

```bash
ng new angular-todomvc --style=css --routing=true --minimal=true --skip-tests=true
cd angular-todomvc
```

Install NgRx dependencies:

```bash
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools --save
```

Copy the necessary CSS files from the original project (`node_modules/todomvc-common/base.css`, `node_modules/todomvc-app-css/index.css`) into the `src/` directory of the new Angular project and reference them in `angular.json` or import them in `src/styles.css`.

```json
// angular.json (partial - under projects -> angular-todomvc -> architect -> build -> options -> styles)
"styles": [
  "src/styles.css",
  "src/base.css", // Add this
  "src/index.css" // Add this
],
```

**2. Define the Todo Model**

Create a file for the data model.

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  id: string; // Use a unique ID instead of relying on array index
  title: string;
  completed: boolean;
}

// Define the filter types
export type FilterType = 'all' | 'active' | 'completed';
```

**3. Implement NgRx State Management**

*   **Actions:** Define the actions that can modify the state.

    ```typescript
    // src/app/store/todo.actions.ts
    import { createAction, props } from '@ngrx/store';
    import { FilterType, Todo } from '../models/todo.model';

    export const loadTodos = createAction('[Todo Page] Load Todos');
    export const loadTodosSuccess = createAction('[Todo API] Load Todos Success', props<{ todos: Todo[] }>());
    export const loadTodosFailure = createAction('[Todo API] Load Todos Failure', props<{ error: any }>());

    export const addTodo = createAction('[Todo Page] Add Todo', props<{ title: string }>());
    export const addTodoSuccess = createAction('[Todo API] Add Todo Success', props<{ todo: Todo }>()); // Optional: if API returns the created todo

    export const removeTodo = createAction('[Todo Page] Remove Todo', props<{ id: string }>());
    export const removeTodoSuccess = createAction('[Todo API] Remove Todo Success', props<{ id: string }>()); // Optional

    export const toggleTodo = createAction('[Todo Page] Toggle Todo', props<{ id: string }>());
    export const toggleTodoSuccess = createAction('[Todo API] Toggle Todo Success', props<{ id: string, completed: boolean }>()); // Optional

    export const updateTodo = createAction('[Todo Page] Update Todo', props<{ id: string, title: string }>());
    export const updateTodoSuccess = createAction('[Todo API] Update Todo Success', props<{ id: string, title: string }>()); // Optional

    export const toggleAllTodos = createAction('[Todo Page] Toggle All Todos', props<{ completed: boolean }>());
    export const toggleAllTodosSuccess = createAction('[Todo API] Toggle All Todos Success', props<{ completed: boolean }>()); // Optional

    export const clearCompletedTodos = createAction('[Todo Page] Clear Completed Todos');
    export const clearCompletedTodosSuccess = createAction('[Todo API] Clear Completed Todos Success'); // Optional

    export const setFilter = createAction('[Todo Page] Set Filter', props<{ filter: FilterType }>());
    ```

*   **Reducer:** Define how the state changes in response to actions.

    ```typescript
    // src/app/store/todo.reducer.ts
    import { createReducer, on, Action } from '@ngrx/store';
    import { FilterType, Todo } from '../models/todo.model';
    import * as TodoActions from './todo.actions';

    export const todoFeatureKey = 'todos'; // Feature key for the state slice

    export interface TodoState {
      todos: Todo[];
      filter: FilterType;
      loading: boolean;
      error: any;
    }

    export const initialState: TodoState = {
      todos: [],
      filter: 'all',
      loading: false,
      error: null,
    };

    const todoReducerInternal = createReducer(
      initialState,

      // Load Todos
      on(TodoActions.loadTodos, (state) => ({ ...state, loading: true, error: null })),
      on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
        ...state,
        todos,
        loading: false,
      })),
      on(TodoActions.loadTodosFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
      })),

      // Add Todo (Optimistic Update - add immediately)
      on(TodoActions.addTodo, (state, { title }) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(), // Generate a temporary unique ID
          title: title.trim(),
          completed: false,
        };
        return {
          ...state,
          todos: [...state.todos, newTodo],
        };
      }),
      // Optional: Handle addTodoSuccess if API returns final data or ID

      // Remove Todo (Optimistic Update)
      on(TodoActions.removeTodo, (state, { id }) => ({
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
      })),

      // Toggle Todo (Optimistic Update)
      on(TodoActions.toggleTodo, (state, { id }) => ({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),

      // Update Todo (Optimistic Update)
      on(TodoActions.updateTodo, (state, { id, title }) => ({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, title: title.trim() } : todo
        ),
      })),

      // Toggle All Todos (Optimistic Update)
      on(TodoActions.toggleAllTodos, (state, { completed }) => ({
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed })),
      })),

      // Clear Completed Todos (Optimistic Update)
      on(TodoActions.clearCompletedTodos, (state) => ({
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      })),

      // Set Filter
      on(TodoActions.setFilter, (state, { filter }) => ({
        ...state,
        filter,
      }))
    );

    // Export the reducer function
    export function reducer(state: TodoState | undefined, action: Action) {
      return todoReducerInternal(state, action);
    }
    ```

*   **Selectors:** Define functions to query slices of the state.

    ```typescript
    // src/app/store/todo.selectors.ts
    import { createFeatureSelector, createSelector } from '@ngrx/store';
    import { FilterType, Todo } from '../models/todo.model';
    import * as fromTodo from './todo.reducer';

    // Select the entire todo state slice
    export const selectTodoState = createFeatureSelector<fromTodo.TodoState>(
      fromTodo.todoFeatureKey
    );

    // Select the array of todos
    export const selectAllTodos = createSelector(
      selectTodoState,
      (state) => state.todos
    );

    // Select the current filter
    export const selectCurrentFilter = createSelector(
      selectTodoState,
      (state) => state.filter
    );

    // Select loading state
    export const selectTodosLoading = createSelector(
      selectTodoState,
      (state) => state.loading
    );

    // Select error state
    export const selectTodosError = createSelector(
      selectTodoState,
      (state) => state.error
    );

    // Select filtered todos based on the current filter
    export const selectFilteredTodos = createSelector(
      selectAllTodos,
      selectCurrentFilter,
      (todos: Todo[], filter: FilterType): Todo[] => {
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed);
          case 'completed':
            return todos.filter((todo) => todo.completed);
          default: // 'all'
            return todos;
        }
      }
    );

    // Select the count of active (remaining) todos
    export const selectActiveTodoCount = createSelector(
      selectAllTodos,
      (todos) => todos.filter((todo) => !todo.completed).length
    );

    // Select the count of completed todos
    export const selectCompletedTodoCount = createSelector(
      selectAllTodos,
      (todos) => todos.filter((todo) => todo.completed).length
    );

    // Select whether all todos are completed (for toggle-all checkbox)
    export const selectAreAllTodosCompleted = createSelector(
      selectAllTodos,
      selectActiveTodoCount,
      (todos, activeCount) => todos.length > 0 && activeCount === 0
    );
    ```

*   **Service:** Create the service to interact with `localStorage`.

    ```typescript
    // src/app/services/todo-storage.service.ts
    import { Injectable } from '@angular/core';
    import { Todo } from '../models/todo.model';
    import { Observable, of, delay } from 'rxjs'; // Use Observable for async simulation

    @Injectable({
      providedIn: 'root', // Provide globally
    })
    export class TodoStorageService {
      private readonly STORAGE_ID = 'todos-angular-ngrx';

      // Simulate async operation (like an HTTP request)
      getTodos(): Observable<Todo[]> {
        const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        // Simulate network delay
        return of(todos).pipe(delay(100));
      }

      // Simulate async operation
      saveTodos(todos: Todo[]): Observable<boolean> {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        // Simulate network delay and return success
        return of(true).pipe(delay(50));
      }
    }
    ```

*   **Effects:** Handle side effects, like saving to `localStorage`.

    ```typescript
    // src/app/store/todo.effects.ts
    import { Injectable } from '@angular/core';
    import { Actions, createEffect, ofType } from '@ngrx/effects';
    import { Store, select } from '@ngrx/store';
    import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
    import { of } from 'rxjs';

    import { TodoStorageService } from '../services/todo-storage.service';
    import * as TodoActions from './todo.actions';
    import * as TodoSelectors from './todo.selectors';
    import { TodoState } from './todo.reducer'; // Import TodoState if needed for Store type

    @Injectable()
    export class TodoEffects {
      constructor(
        private actions$: Actions,
        private todoStorageService: TodoStorageService,
        private store: Store // Inject Store to get current state if needed
      ) {}

      // Effect to load todos from storage on initial action
      loadTodos$ = createEffect(() =>
        this.actions$.pipe(
          ofType(TodoActions.loadTodos),
          switchMap(() =>
            this.todoStorageService.getTodos().pipe(
              map((todos) => TodoActions.loadTodosSuccess({ todos })),
              catchError((error) => of(TodoActions.loadTodosFailure({ error })))
            )
          )
        )
      );

      // Effect to save the current state of todos to storage whenever a modification action occurs
      // We listen to the actions that modify the list and then save the *resulting* state
      saveTodos$ = createEffect(
        () =>
          this.actions$.pipe(
            ofType(
              TodoActions.addTodo, // Listen to the initiating action
              TodoActions.removeTodo,
              TodoActions.toggleTodo,
              TodoActions.updateTodo,
              TodoActions.toggleAllTodos,
              TodoActions.clearCompletedTodos
              // Note: We don't listen to the Success actions here to avoid potential loops
              // if the success actions themselves triggered saves.
            ),
            // Get the latest state *after* the reducer has processed the action
            withLatestFrom(this.store.pipe(select(TodoSelectors.selectAllTodos))),
            // We only need the todos array from the state
            switchMap(([action, todos]) => this.todoStorageService.saveTodos(todos))
            // Optional: Dispatch a save success/failure action if needed for UI feedback
            // map(() => TodoActions.saveTodosSuccess()),
            // catchError(error => of(TodoActions.saveTodosFailure({ error })))
          ),
        { dispatch: false } // This effect does not dispatch new actions
      );

      // --- Optional Effects for handling API success/failure if needed ---
      // If your storage service returned specific data on success (e.g., final ID),
      // you might have effects listening to the primary actions (addTodo, etc.),
      // calling the service, and then dispatching the corresponding Success action.
      // For simple localStorage, the optimistic updates in the reducer + the saveTodos$ effect are often sufficient.
      // Example for addTodo if API returned the final todo object:
      /*
      addTodo$ = createEffect(() =>
        this.actions$.pipe(
          ofType(TodoActions.addTodo),
          switchMap(action =>
            this.todoStorageService.addTodoApi(action.title).pipe( // Assume an API call
              map(savedTodo => TodoActions.addTodoSuccess({ todo: savedTodo })),
              catchError(error => of(TodoActions.addTodoFailure({ error }))) // Need Failure action
            )
          )
        )
      );
      */
    }

    ```

**4. Create Angular Components**

Break down the UI into logical components.

*   **`app.component` (Root Component)**

    ```typescript
    // src/app/app.component.ts
    import { Component, OnInit } from '@angular/core';
    import { Store } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { NavigationEnd, Router } from '@angular/router';
    import { filter, map } from 'rxjs/operators';

    import * as TodoActions from './store/todo.actions';
    import { FilterType } from './models/todo.model';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'],
    })
    export class AppComponent implements OnInit {
      constructor(private store: Store, private router: Router) {}

      ngOnInit(): void {
        // Load initial todos when the app starts
        this.store.dispatch(TodoActions.loadTodos());

        // Listen to route changes to set the filter state
        this.router.events
          .pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map((event: NavigationEnd) => {
              // Extract filter from URL path
              const path = event.urlAfterRedirects; // Use urlAfterRedirects for reliability
              if (path === '/active') return 'active';
              if (path === '/completed') return 'completed';
              return 'all';
            })
          )
          .subscribe((filterType: FilterType) => {
            this.store.dispatch(TodoActions.setFilter({ filter: filterType }));
          });
      }
    }
    ```

    ```html
    <!-- src/app/app.component.html -->
    <section class="todoapp">
      <app-todo-header></app-todo-header>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Credits: Migrated by AI to Angular & NgRx</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    ```

*   **`TodoHeaderComponent`**

    ```bash
    ng generate component components/todo-header --inline-template --inline-style --skip-tests=true
    ```

    ```typescript
    // src/app/components/todo-header/todo-header.component.ts
    import { Component } from '@angular/core';
    import { Store } from '@ngrx/store';
    import * as TodoActions from '../../store/todo.actions';

    @Component({
      selector: 'app-todo-header',
      template: `
        <header class="header">
          <h1>todos</h1>
          <input
            class="new-todo"
            placeholder="What needs to be done?"
            autofocus
            [(ngModel)]="newTodoTitle"
            (keyup.enter)="addTodo()"
          />
        </header>
      `,
      styles: [], // Keep empty or add specific styles if needed
    })
    export class TodoHeaderComponent {
      newTodoTitle: string = '';

      constructor(private store: Store) {}

      addTodo(): void {
        const title = this.newTodoTitle.trim();
        if (title) {
          this.store.dispatch(TodoActions.addTodo({ title }));
          this.newTodoTitle = ''; // Clear input
        }
      }
    }
    ```

*   **`TodoListComponent`**

    ```bash
    ng generate component components/todo-list --inline-template --inline-style --skip-tests=true
    ```

    ```typescript
    // src/app/components/todo-list/todo-list.component.ts
    import { Component } from '@angular/core';
    import { Store, select } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { Todo } from '../../models/todo.model';
    import * as TodoSelectors from '../../store/todo.selectors';
    import * as TodoActions from '../../store/todo.actions';

    @Component({
      selector: 'app-todo-list',
      template: `
        <section class="main" *ngIf="(todos$ | async)?.length">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            [checked]="areAllCompleted$ | async"
            (change)="toggleAll($event)"
          />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            <app-todo-item
              *ngFor="let todo of filteredTodos$ | async; trackBy: trackById"
              [todo]="todo"
            ></app-todo-item>
          </ul>
        </section>
      `,
      styles: [],
    })
    export class TodoListComponent {
      todos$: Observable<Todo[]>;
      filteredTodos$: Observable<Todo[]>;
      areAllCompleted$: Observable<boolean>;

      constructor(private store: Store) {
        this.todos$ = this.store.pipe(select(TodoSelectors.selectAllTodos));
        this.filteredTodos$ = this.store.pipe(select(TodoSelectors.selectFilteredTodos));
        this.areAllCompleted$ = this.store.pipe(select(TodoSelectors.selectAreAllTodosCompleted));
      }

      toggleAll(event: Event): void {
        const completed = (event.target as HTMLInputElement).checked;
        this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
      }

      // Optimization for *ngFor
      trackById(index: number, todo: Todo): string {
        return todo.id;
      }
    }
    ```

*   **`TodoItemComponent`**

    ```bash
    ng generate component components/todo-item --inline-template --inline-style --skip-tests=true
    ```

    ```typescript
    // src/app/components/todo-item/todo-item.component.ts
    import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
    import { Store } from '@ngrx/store';
    import { Todo } from '../../models/todo.model';
    import * as TodoActions from '../../store/todo.actions';

    @Component({
      selector: 'app-todo-item',
      template: `
        <li [ngClass]="{ completed: todo.completed, editing: editing }">
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleCompletion()"
            />
            <label (dblclick)="startEdit()">{{ todo.title }}</label>
            <button class="destroy" (click)="remove()"></button>
          </div>
          <input
            *ngIf="editing"
            #editInput
            class="edit"
            [value]="currentTitle"
            (input)="currentTitle = $any($event.target).value"
            (blur)="submitEdit()"
            (keyup.enter)="submitEdit()"
            (keyup.escape)="cancelEdit()"
            appTodoFocus
            [shouldFocus]="editing"
          />
        </li>
      `,
      styles: [],
    })
    export class TodoItemComponent implements OnInit {
      @Input() todo!: Todo;
      @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

      editing: boolean = false;
      currentTitle: string = ''; // For editing state

      constructor(private store: Store) {}

      ngOnInit(): void {
        this.currentTitle = this.todo.title; // Initialize edit title
      }

      toggleCompletion(): void {
        this.store.dispatch(TodoActions.toggleTodo({ id: this.todo.id }));
      }

      remove(): void {
        this.store.dispatch(TodoActions.removeTodo({ id: this.todo.id }));
      }

      startEdit(): void {
        this.currentTitle = this.todo.title; // Reset to current title before editing
        this.editing = true;
        // Focus handled by appTodoFocus directive
      }

      submitEdit(): void {
        if (!this.editing) return; // Prevent submitting if not editing

        this.editing = false;
        const newTitle = this.currentTitle.trim();
        if (newTitle && newTitle !== this.todo.title) {
          this.store.dispatch(
            TodoActions.updateTodo({ id: this.todo.id, title: newTitle })
          );
        } else if (!newTitle) {
          // If title is empty after trim, remove the todo
          this.remove();
        } else {
          // Title didn't change or was just whitespace, reset input value visually
          this.currentTitle = this.todo.title;
        }
      }

      cancelEdit(): void {
        if (!this.editing) return;
        this.editing = false;
        this.currentTitle = this.todo.title; // Revert input value
      }
    }

    ```

*   **`TodoFooterComponent`**

    ```bash
    ng generate component components/todo-footer --inline-template --inline-style --skip-tests=true
    ```

    ```typescript
    // src/app/components/todo-footer/todo-footer.component.ts
    import { Component } from '@angular/core';
    import { Store, select } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { FilterType } from '../../models/todo.model';
    import * as TodoSelectors from '../../store/todo.selectors';
    import * as TodoActions from '../../store/todo.actions';

    @Component({
      selector: 'app-todo-footer',
      template: `
        <footer class="footer" *ngIf="(totalTodos$ | async)! > 0">
          <span class="todo-count">
            <strong>{{ activeCount$ | async }}</strong>
            {{ (activeCount$ | async) === 1 ? ' item' : ' items' }} left
          </span>
          <ul class="filters">
            <li>
              <a
                routerLink="/"
                routerLinkActive="selected"
                [routerLinkActiveOptions]="{ exact: true }"
                >All</a
              >
            </li>
            <li>
              <a routerLink="/active" routerLinkActive="selected">Active</a>
            </li>
            <li>
              <a routerLink="/completed" routerLinkActive="selected">Completed</a>
            </li>
          </ul>
          <button
            class="clear-completed"
            *ngIf="(completedCount$ | async)! > 0"
            (click)="clearCompleted()"
          >
            Clear completed
          </button>
        </footer>
      `,
      styles: [],
    })
    export class TodoFooterComponent {
      activeCount$: Observable<number>;
      completedCount$: Observable<number>;
      currentFilter$: Observable<FilterType>;
      totalTodos$: Observable<number>;

      constructor(private store: Store) {
        this.activeCount$ = this.store.pipe(select(TodoSelectors.selectActiveTodoCount));
        this.completedCount$ = this.store.pipe(select(TodoSelectors.selectCompletedTodoCount));
        this.currentFilter$ = this.store.pipe(select(TodoSelectors.selectCurrentFilter));
        // Need total count to decide whether to show the footer at all
        this.totalTodos$ = this.store.pipe(select(TodoSelectors.selectAllTodos), map(todos => todos.length));
      }

      clearCompleted(): void {
        this.store.dispatch(TodoActions.clearCompletedTodos());
      }
    }
    ```

**5. Implement Angular Directives**

*   **`TodoFocusDirective`** (Replaces `todoFocus`)

    ```bash
    ng generate directive directives/todo-focus --skip-tests=true
    ```

    ```typescript
    // src/app/directives/todo-focus.directive.ts
    import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

    @Directive({
      selector: '[appTodoFocus]',
    })
    export class TodoFocusDirective implements OnChanges {
      @Input('appTodoFocus') shouldFocus: boolean = false; // Alias input name

      constructor(private el: ElementRef<HTMLInputElement>) {}

      ngOnChanges(changes: SimpleChanges): void {
        if (changes['shouldFocus'] && this.shouldFocus) {
          // Use setTimeout to ensure the element is rendered and visible
          // before trying to focus, especially with *ngIf
          setTimeout(() => {
            this.el.nativeElement.focus();
            // Optionally select the text as well
            // this.el.nativeElement.select();
          }, 0);
        }
      }
    }
    ```

*   **`TodoEscapeDirective`** (Replaced by `(keyup.escape)` in `TodoItemComponent`)
    The original `todoEscape` directive is simple enough that we can replace it directly with Angular's built-in `(keyup.escape)` event binding in the `TodoItemComponent` template. No separate directive is needed for this specific case, simplifying the code.

**6. Configure Modules**

*   **`AppRoutingModule`**

    ```typescript
    // src/app/app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { AppComponent } from './app.component'; // Or a placeholder component if needed

    const routes: Routes = [
      // Define routes that correspond to the filters
      // The actual filtering logic is handled by NgRx state based on URL
      { path: '', pathMatch: 'full', redirectTo: '/' }, // Redirect empty path
      { path: '', component: AppComponent, children: [ // Use children if AppComponent is the main layout
          // These paths don't need specific components if AppComponent handles the filter logic
          { path: '', component: undefined }, // Matches '/'
          { path: 'active', component: undefined }, // Matches '/active'
          { path: 'completed', component: undefined } // Matches '/completed'
      ]},
      // Optional: Add a wildcard route for 404 handling
      // { path: '**', component: PageNotFoundComponent },
    ];

    @NgModule({
      imports: [RouterModule.forRoot(routes, { useHash: true })], // Use hash routing like original
      exports: [RouterModule],
    })
    export class AppRoutingModule {}
    ```
    *Note*: We use `useHash: true` to mimic the original `#` based URLs. The `component: undefined` tells the router that these paths are valid, but the `AppComponent` itself (or a child component if structured differently) will react to the URL change rather than loading a distinct component for each filter state.

*   **`AppModule`**

    ```typescript
    // src/app/app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { FormsModule } from '@angular/forms'; // Needed for ngModel
    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';
    import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // Optional: for debugging

    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
    import { TodoListComponent } from './components/todo-list/todo-list.component';
    import { TodoItemComponent } from './components/todo-item/todo-item.component';
    import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
    import { TodoFocusDirective } from './directives/todo-focus.directive';

    import * as fromTodo from './store/todo.reducer';
    import { TodoEffects } from './store/todo.effects';
    import { environment } from '../environments/environment'; // For StoreDevtools conditional logic

    @NgModule({
      declarations: [
        AppComponent,
        TodoHeaderComponent,
        TodoListComponent,
        TodoItemComponent,
        TodoFooterComponent,
        TodoFocusDirective,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule, // Add FormsModule
        StoreModule.forRoot({ [fromTodo.todoFeatureKey]: fromTodo.reducer }, {}), // Register the reducer
        EffectsModule.forRoot([TodoEffects]), // Register the effects
        // Instrumentation must be imported after StoreModule
        StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
          logOnly: environment.production, // Restrict extension to log-only mode in production
          autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        }),
      ],
      providers: [], // Services provided in root don't need to be listed here
      bootstrap: [AppComponent],
    })
    export class AppModule {}
    ```

**7. Final Adjustments & Run**

*   Ensure `environment.ts` and `environment.prod.ts` exist in `src/environments/`.
*   Make sure the CSS files (`base.css`, `index.css`) are correctly placed and referenced.
*   Run the application: `ng serve -o`

This migration provides a modern Angular 14+ structure using NgRx for robust state management, breaking down the original controller into focused components, and replacing AngularJS directives/syntax with their Angular counterparts. The code follows Angular best practices and style guidelines.

### Tokens: {'input_tokens': 2787, 'output_tokens': 9907}
### Execution time: 91.20589280128479
