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
Okay, let's migrate the AngularJS TodoMVC application to Angular 14.x with NgRx state management.

**1. Project Setup**

First, create a new Angular project using the Angular CLI:

```bash
ng new angular-todomvc --style=css --routing=true
cd angular-todomvc
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools --save
# Optional: For unique IDs if needed, though not strictly required for this migration
# npm install uuid
# npm install @types/uuid --save-dev
```

Copy the CSS files (`node_modules/todomvc-common/base.css`, `node_modules/todomvc-app-css/index.css`) into the `src/` directory of your new project. Then, update `angular.json` to include them:

```json
// angular.json
...
"styles": [
  "src/styles.css",
  "src/base.css", // Add this
  "src/index.css" // Add this
],
...
```

Also, copy `node_modules/todomvc-common/base.js` into `src/assets/` and include it in `angular.json`:

```json
// angular.json
...
"scripts": [
  "src/assets/base.js" // Add this
]
...
```

**2. Define Models**

Create models for `Todo` and `Filter`.

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  id: string; // Use a unique ID
  title: string;
  completed: boolean;
}

// src/app/models/filter.model.ts
export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
```

*(Self-correction: Added a unique `id` to the Todo model, which is good practice even if the original used array index. We'll generate this when adding todos.)*

**3. NgRx State Management Setup**

*   **State Interface:**

    ```typescript
    // src/app/store/todo.state.ts
    import { Todo } from '../models/todo.model';
    import { Filter } from '../models/filter.model';

    export interface TodoState {
      todos: Todo[];
      filter: Filter;
      loading: boolean; // To track loading state
      error: string | null; // To track potential errors
    }

    export const initialState: TodoState = {
      todos: [],
      filter: Filter.ALL,
      loading: false,
      error: null,
    };
    ```

*   **Actions:**

    ```typescript
    // src/app/store/todo.actions.ts
    import { createAction, props } from '@ngrx/store';
    import { Todo } from '../models/todo.model';
    import { Filter } from '../models/filter.model';

    export const loadTodos = createAction('[Todo] Load Todos');
    export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
    export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: string }>());

    // Action to trigger saving (used by effect)
    export const saveTodos = createAction('[Todo] Save Todos');
    export const saveTodosSuccess = createAction('[Todo] Save Todos Success');
    export const saveTodosFailure = createAction('[Todo] Save Todos Failure', props<{ error: string }>());

    export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
    export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
    export const updateTodo = createAction('[Todo] Update Todo', props<{ id: string, title: string }>());
    export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
    export const toggleAllTodos = createAction('[Todo] Toggle All Todos', props<{ completed: boolean }>());
    export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');
    export const setFilter = createAction('[Todo] Set Filter', props<{ filter: Filter }>());
    ```

*   **Reducer:**

    ```typescript
    // src/app/store/todo.reducer.ts
    import { createReducer, on } from '@ngrx/store';
    import * as TodoActions from './todo.actions';
    import { initialState, TodoState } from './todo.state';
    import { Todo } from '../models/todo.model';
    // Consider using a library like uuid or a simple counter for IDs
    // For simplicity here, we'll use Date.now() + random number, but UUID is better for production
    const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    export const todoReducer = createReducer(
      initialState,

      // Load Todos
      on(TodoActions.loadTodos, (state): TodoState => ({
        ...state,
        loading: true,
        error: null,
      })),
      on(TodoActions.loadTodosSuccess, (state, { todos }): TodoState => ({
        ...state,
        todos: todos,
        loading: false,
      })),
      on(TodoActions.loadTodosFailure, (state, { error }): TodoState => ({
        ...state,
        loading: false,
        error: error,
      })),

       // Save Todos (only handles potential errors, actual saving is an effect)
      on(TodoActions.saveTodos, (state): TodoState => ({
        ...state // No state change needed here, just triggers effect
      })),
      on(TodoActions.saveTodosFailure, (state, { error }): TodoState => ({
        ...state,
        error: `Failed to save todos: ${error}`, // Log save error
      })),
      on(TodoActions.saveTodosSuccess, (state): TodoState => ({
        ...state, // Optionally clear error or add success flag
      })),

      // Add Todo
      on(TodoActions.addTodo, (state, { title }): TodoState => ({
        ...state,
        todos: [
          ...state.todos,
          { id: generateId(), title: title.trim(), completed: false },
        ],
      })),

      // Remove Todo
      on(TodoActions.removeTodo, (state, { id }): TodoState => ({
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
      })),

      // Update Todo
      on(TodoActions.updateTodo, (state, { id, title }): TodoState => ({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, title: title.trim() } : todo
        ),
      })),

      // Toggle Todo
      on(TodoActions.toggleTodo, (state, { id }): TodoState => ({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),

      // Toggle All Todos
      on(TodoActions.toggleAllTodos, (state, { completed }): TodoState => ({
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed })),
      })),

      // Clear Completed Todos
      on(TodoActions.clearCompletedTodos, (state): TodoState => ({
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      })),

      // Set Filter
      on(TodoActions.setFilter, (state, { filter }): TodoState => ({
        ...state,
        filter: filter,
      }))
    );
    ```

*   **Selectors:**

    ```typescript
    // src/app/store/todo.selectors.ts
    import { createFeatureSelector, createSelector } from '@ngrx/store';
    import { TodoState } from './todo.state';
    import { Filter } from '../models/filter.model';
    import { Todo } from '../models/todo.model';

    export const selectTodoState = createFeatureSelector<TodoState>('todos'); // Matches the key in StoreModule.forRoot

    export const selectAllTodos = createSelector(
      selectTodoState,
      (state: TodoState) => state.todos
    );

    export const selectCurrentFilter = createSelector(
      selectTodoState,
      (state: TodoState) => state.filter
    );

    export const selectLoading = createSelector(
      selectTodoState,
      (state: TodoState) => state.loading
    );

    export const selectError = createSelector(
      selectTodoState,
      (state: TodoState) => state.error
    );

    export const selectFilteredTodos = createSelector(
      selectAllTodos,
      selectCurrentFilter,
      (todos: Todo[], filter: Filter): Todo[] => {
        switch (filter) {
          case Filter.ACTIVE:
            return todos.filter(todo => !todo.completed);
          case Filter.COMPLETED:
            return todos.filter(todo => todo.completed);
          default: // Filter.ALL
            return todos;
        }
      }
    );

    export const selectRemainingCount = createSelector(
      selectAllTodos,
      (todos: Todo[]) => todos.filter(todo => !todo.completed).length
    );

    export const selectCompletedCount = createSelector(
      selectAllTodos,
      (todos: Todo[]) => todos.filter(todo => todo.completed).length
    );

     export const selectHasTodos = createSelector(
      selectAllTodos,
      (todos: Todo[]) => todos.length > 0
    );

    export const selectIsAllCompleted = createSelector(
      selectAllTodos,
      selectRemainingCount,
      (todos: Todo[], remainingCount: number) => todos.length > 0 && remainingCount === 0
    );

    export const selectHasCompletedTodos = createSelector(
        selectCompletedCount,
        (completedCount: number) => completedCount > 0
    );
    ```

*   **Service (for localStorage):**

    ```typescript
    // src/app/services/todo-storage.service.ts
    import { Injectable } from '@angular/core';
    import { Todo } from '../models/todo.model';
    import { Observable, of, throwError } from 'rxjs';

    @Injectable({
      providedIn: 'root' // Provide globally
    })
    export class TodoStorageService {
      private readonly STORAGE_ID = 'todos-angular-ngrx';

      getTodos(): Observable<Todo[]> {
        try {
          const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
          return of(todos); // Return as an Observable
        } catch (e) {
          console.error('Error reading todos from localStorage', e);
          return throwError(() => new Error('Failed to load todos from storage.'));
        }
      }

      saveTodos(todos: Todo[]): Observable<void> {
        try {
          localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
          return of(undefined); // Indicate success
        } catch (e) {
          console.error('Error saving todos to localStorage', e);
          return throwError(() => new Error('Failed to save todos to storage.'));
        }
      }
    }
    ```

*   **Effects:**

    ```typescript
    // src/app/store/todo.effects.ts
    import { Injectable } from '@angular/core';
    import { Actions, createEffect, ofType } from '@ngrx/effects';
    import { Store, select } from '@ngrx/store';
    import { map, switchMap, catchError, withLatestFrom, debounceTime, tap } from 'rxjs/operators';
    import { of } from 'rxjs';
    import * as TodoActions from './todo.actions';
    import { TodoStorageService } from '../services/todo-storage.service';
    import { TodoState } from './todo.state';
    import { selectAllTodos } from './todo.selectors';
    import { Router, NavigationEnd } from '@angular/router';
    import { filter as rxFilter } from 'rxjs/operators'; // Alias to avoid conflict
    import { Filter } from '../models/filter.model';

    @Injectable()
    export class TodoEffects {

      // Load todos from storage on initial action
      loadTodos$ = createEffect(() => this.actions$.pipe(
        ofType(TodoActions.loadTodos),
        switchMap(() => this.todoStorageService.getTodos().pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
        ))
      ));

      // Save todos to storage whenever the list changes
      // Debounce to avoid excessive writes on rapid changes
      saveTodos$ = createEffect(() => this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.removeTodo,
          TodoActions.updateTodo,
          TodoActions.toggleTodo,
          TodoActions.toggleAllTodos,
          TodoActions.clearCompletedTodos
          // Note: loadTodosSuccess also implies potential change if storage was out of sync,
          // but saving immediately after load might be redundant unless merging logic exists.
          // Let's keep it simple and save only on user-initiated modifications.
        ),
        debounceTime(300), // Wait 300ms after the last change before saving
        withLatestFrom(this.store.pipe(select(selectAllTodos))), // Get the current todos array
        switchMap(([action, todos]) => this.todoStorageService.saveTodos(todos).pipe(
            map(() => TodoActions.saveTodosSuccess()), // Dispatch success action
            catchError(error => of(TodoActions.saveTodosFailure({ error: error.message })))
          )
        )
      ));

      // Update filter based on route changes
      updateFilter$ = createEffect(() => this.router.events.pipe(
        rxFilter((event): event is NavigationEnd => event instanceof NavigationEnd), // Use aliased filter
        map(event => {
          const path = event.urlAfterRedirects; // Use urlAfterRedirects for consistency
          let newFilter = Filter.ALL;
          if (path === '/active') {
            newFilter = Filter.ACTIVE;
          } else if (path === '/completed') {
            newFilter = Filter.COMPLETED;
          }
          return TodoActions.setFilter({ filter: newFilter });
        })
      ));

      constructor(
        private actions$: Actions,
        private todoStorageService: TodoStorageService,
        private store: Store<TodoState>, // Inject Store to get current state
        private router: Router
      ) {}
    }
    ```

**4. Update Modules**

*   **App Module:**

    ```typescript
    // src/app/app.module.ts
    import { NgModule, isDevMode } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { FormsModule } from '@angular/forms'; // Needed for ngModel
    import { HttpClientModule } from '@angular/common/http'; // Often useful, though not strictly needed here

    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';

    // NgRx Imports
    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';
    import { StoreDevtoolsModule } from '@ngrx/store-devtools';
    import { todoReducer } from './store/todo.reducer';
    import { TodoEffects } from './store/todo.effects';

    // Components
    import { TodoWrapperComponent } from './components/todo-wrapper/todo-wrapper.component';
    import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
    import { TodoListComponent } from './components/todo-list/todo-list.component';
    import { TodoItemComponent } from './components/todo-item/todo-item.component';
    import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

    // Directives
    import { TodoFocusDirective } from './directives/todo-focus.directive';
    import { TodoEscapeDirective } from './directives/todo-escape.directive';

    @NgModule({
      declarations: [
        AppComponent,
        TodoWrapperComponent,
        TodoHeaderComponent,
        TodoListComponent,
        TodoItemComponent,
        TodoFooterComponent,
        TodoFocusDirective,
        TodoEscapeDirective
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule, // Add FormsModule
        HttpClientModule,
        StoreModule.forRoot({ todos: todoReducer }, {}), // Register reducer with 'todos' key
        EffectsModule.forRoot([TodoEffects]), // Register effects
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }), // DevTools
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

*   **App Routing Module:** Define routes. All paths point to the main wrapper component.

    ```typescript
    // src/app/app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { TodoWrapperComponent } from './components/todo-wrapper/todo-wrapper.component';

    const routes: Routes = [
      // Redirect root path to '/all' for clarity, though our effect handles '/'
      { path: '', component: TodoWrapperComponent, pathMatch: 'full' },
      { path: 'active', component: TodoWrapperComponent },
      { path: 'completed', component: TodoWrapperComponent },
      // Optional: Redirect unknown paths back to root
      { path: '**', redirectTo: '' }
    ];

    @NgModule({
      imports: [RouterModule.forRoot(routes, { useHash: true })], // Use hash strategy like original
      exports: [RouterModule]
    })
    export class AppRoutingModule { }
    ```

**5. Implement Components**

*   **`app.component.html` (Shell):**

    ```html
    <!-- src/app/app.component.html -->
    <router-outlet></router-outlet> <!-- Let routing handle showing TodoWrapperComponent -->

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

*   **`app.component.ts` (Minimal):**

    ```typescript
    // src/app/app.component.ts
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'] // Keep if you have specific app styles
    })
    export class AppComponent {
      // Title is not needed as it's set in index.html
    }
    ```

*   **`TodoWrapperComponent` (Container):** Orchestrates child components and interacts with the store.

    ```typescript
    // src/app/components/todo-wrapper/todo-wrapper.component.ts
    import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
    import { Store } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { Todo } from '../../models/todo.model';
    import { Filter } from '../../models/filter.model';
    import * as TodoActions from '../../store/todo.actions';
    import * as TodoSelectors from '../../store/todo.selectors';
    import { TodoState } from '../../store/todo.state';

    @Component({
      selector: 'app-todo-wrapper',
      templateUrl: './todo-wrapper.component.html',
      // styleUrls: ['./todo-wrapper.component.css'] // Add if needed
      changeDetection: ChangeDetectionStrategy.OnPush // Optimize change detection
    })
    export class TodoWrapperComponent implements OnInit {

      // Selectors for template binding
      todos$: Observable<Todo[]>;
      filteredTodos$: Observable<Todo[]>;
      remainingCount$: Observable<number>;
      hasTodos$: Observable<boolean>;
      isAllCompleted$: Observable<boolean>;
      currentFilter$: Observable<Filter>;
      hasCompletedTodos$: Observable<boolean>;

      // For editing state - managed locally in this component for simplicity
      // Alternatively, could be in NgRx state if needed globally
      editingTodoId: string | null = null;

      constructor(private store: Store<TodoState>) {
        this.todos$ = this.store.select(TodoSelectors.selectAllTodos);
        this.filteredTodos$ = this.store.select(TodoSelectors.selectFilteredTodos);
        this.remainingCount$ = this.store.select(TodoSelectors.selectRemainingCount);
        this.hasTodos$ = this.store.select(TodoSelectors.selectHasTodos);
        this.isAllCompleted$ = this.store.select(TodoSelectors.selectIsAllCompleted);
        this.currentFilter$ = this.store.select(TodoSelectors.selectCurrentFilter);
        this.hasCompletedTodos$ = this.store.select(TodoSelectors.selectHasCompletedTodos);
      }

      ngOnInit(): void {
        // Load initial todos when the component initializes
        this.store.dispatch(TodoActions.loadTodos());
      }

      // Event Handlers (Dispatching Actions)
      onAddTodo(title: string): void {
        if (title.trim().length > 0) {
          this.store.dispatch(TodoActions.addTodo({ title }));
        }
      }

      onToggleAll(completed: boolean): void {
        this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
      }

      onSetEditingId(id: string | null): void {
        this.editingTodoId = id;
      }

      onToggleTodo(id: string): void {
        this.store.dispatch(TodoActions.toggleTodo({ id }));
      }

      onUpdateTodo({ id, title }: { id: string, title: string }): void {
         const trimmedTitle = title.trim();
         if (trimmedTitle.length === 0) {
           // If title is empty after trim, remove the todo
           this.onRemoveTodo(id);
         } else {
           this.store.dispatch(TodoActions.updateTodo({ id, title: trimmedTitle }));
         }
         this.editingTodoId = null; // Exit editing mode
      }

      onRemoveTodo(id: string): void {
        this.store.dispatch(TodoActions.removeTodo({ id }));
        if (this.editingTodoId === id) {
            this.editingTodoId = null; // Ensure we exit editing if deleted
        }
      }

      onSetFilter(filter: Filter): void {
        // This is now handled by the routing effect, but keep for potential direct calls
        this.store.dispatch(TodoActions.setFilter({ filter }));
      }

      onClearCompleted(): void {
        this.store.dispatch(TodoActions.clearCompletedTodos());
      }

      // TrackBy function for *ngFor optimization
      trackById(index: number, item: Todo): string {
        return item.id;
      }
    }
    ```

    ```html
    <!-- src/app/components/todo-wrapper/todo-wrapper.component.html -->
    <section class="todoapp">
      <app-todo-header (addTodo)="onAddTodo($event)"></app-todo-header>

      <!-- Main section: Only show if there are todos -->
      <ng-container *ngIf="(hasTodos$ | async)">
        <section class="main">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            [checked]="(isAllCompleted$ | async)"
            (change)="onToggleAll($any($event.target).checked)">
          <label for="toggle-all">Mark all as complete</label>

          <app-todo-list
            [todos]="(filteredTodos$ | async)!"
            [editingId]="editingTodoId"
            (toggleTodo)="onToggleTodo($event)"
            (updateTodo)="onUpdateTodo($event)"
            (deleteTodo)="onRemoveTodo($event)"
            (setEditingId)="onSetEditingId($event)"
            [trackByFn]="trackById">
          </app-todo-list>
        </section>

        <app-todo-footer
          [remainingCount]="(remainingCount$ | async)!"
          [currentFilter]="(currentFilter$ | async)!"
          [hasCompletedTodos]="(hasCompletedTodos$ | async)!"
          (clearCompleted)="onClearCompleted()">
          <!-- (setFilter) event is not strictly needed as routing handles it -->
        </app-todo-footer>
      </ng-container>
    </section>
    ```

*   **`TodoHeaderComponent`:**

    ```typescript
    // src/app/components/todo-header/todo-header.component.ts
    import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

    @Component({
      selector: 'app-todo-header',
      templateUrl: './todo-header.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TodoHeaderComponent {
      @Output() addTodo = new EventEmitter<string>();
      newTodoTitle = '';

      onAddTodo(): void {
        if (this.newTodoTitle.trim()) {
          this.addTodo.emit(this.newTodoTitle);
          this.newTodoTitle = ''; // Clear input
        }
      }
    }
    ```

    ```html
    <!-- src/app/components/todo-header/todo-header.component.html -->
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="onAddTodo()">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="newTodoTitle"
          name="newTodoInput"
          autofocus>
      </form>
    </header>
    ```

*   **`TodoListComponent`:**

    ```typescript
    // src/app/components/todo-list/todo-list.component.ts
    import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
    import { Todo } from '../../models/todo.model';

    @Component({
      selector: 'app-todo-list',
      templateUrl: './todo-list.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TodoListComponent {
      @Input() todos: Todo[] = [];
      @Input() editingId: string | null = null;
      @Input() trackByFn!: TrackByFunction<Todo>; // Pass trackBy from parent

      @Output() toggleTodo = new EventEmitter<string>();
      @Output() updateTodo = new EventEmitter<{ id: string, title: string }>();
      @Output() deleteTodo = new EventEmitter<string>();
      @Output() setEditingId = new EventEmitter<string | null>();

      // Propagate events from TodoItemComponent
      onItemToggle(id: string): void {
        this.toggleTodo.emit(id);
      }

      onItemUpdate(update: { id: string, title: string }): void {
        this.updateTodo.emit(update);
      }

      onItemDelete(id: string): void {
        this.deleteTodo.emit(id);
      }

      onItemSetEditing(id: string | null): void {
        this.setEditingId.emit(id);
      }
    }
    ```

    ```html
    <!-- src/app/components/todo-list/todo-list.component.html -->
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of todos; trackBy: trackByFn"
        [todo]="todo"
        [isEditing]="todo.id === editingId"
        (toggle)="onItemToggle($event)"
        (update)="onItemUpdate($event)"
        (delete)="onItemDelete($event)"
        (startEdit)="onItemSetEditing($event)">
        <!-- Pass editingId down -->
      </app-todo-item>
    </ul>
    ```

*   **`TodoItemComponent`:**

    ```typescript
    // src/app/components/todo-item/todo-item.component.ts
    import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
    import { Todo } from '../../models/todo.model';

    @Component({
      selector: 'app-todo-item',
      templateUrl: './todo-item.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TodoItemComponent implements OnChanges {
      @Input() todo!: Todo;
      @Input() isEditing: boolean = false;

      @Output() toggle = new EventEmitter<string>();
      @Output() update = new EventEmitter<{ id: string, title: string }>();
      @Output() delete = new EventEmitter<string>();
      @Output() startEdit = new EventEmitter<string | null>(); // Emit ID to start, null to stop

      // Local state for editing
      editedTitle: string = '';
      originalTitle: string = ''; // To revert on escape

      // Reference to the edit input element for focus
      @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

      ngOnChanges(changes: SimpleChanges): void {
        // When editing starts, copy the title and store original
        if (changes['isEditing'] && this.isEditing) {
          this.editedTitle = this.todo.title;
          this.originalTitle = this.todo.title;
          // Focus needs to happen after the view updates
          // setTimeout(() => this.editInput?.nativeElement.focus(), 0);
          // Using the directive is cleaner now
        }
      }

      onToggle(): void {
        this.toggle.emit(this.todo.id);
      }

      onStartEdit(): void {
        this.startEdit.emit(this.todo.id);
      }

      onSaveEdit(): void {
        if (this.isEditing) {
           const newTitle = this.editedTitle.trim();
           // Only emit update if title actually changed
           if (newTitle !== this.todo.title) {
               this.update.emit({ id: this.todo.id, title: newTitle });
           } else if (newTitle.length === 0) {
               // Handle case where title is trimmed to empty (will trigger delete in parent)
               this.update.emit({ id: this.todo.id, title: newTitle });
           } else {
               // No change, just exit editing mode
               this.startEdit.emit(null);
           }
           // Parent component (wrapper) will handle setting editingId to null
        }
      }

      onCancelEdit(): void {
        // Revert title and exit editing mode
        this.editedTitle = this.originalTitle;
        this.startEdit.emit(null);
      }

      onDelete(): void {
        this.delete.emit(this.todo.id);
      }
    }
    ```

    ```html
    <!-- src/app/components/todo-item/todo-item.component.html -->
    <li [ngClass]="{completed: todo.completed, editing: isEditing}">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="onToggle()">
        <label (dblclick)="onStartEdit()">{{ todo.title }}</label>
        <button class="destroy" (click)="onDelete()"></button>
      </div>
      <!-- Edit Input: Use ngIf to add/remove from DOM -->
      <form *ngIf="isEditing" (ngSubmit)="onSaveEdit()">
         <input
            #editInput
            class="edit"
            type="text"
            [(ngModel)]="editedTitle"
            name="editTitleInput"
            (blur)="onSaveEdit()"
            appTodoFocus
            [shouldFocus]="isEditing"
            appTodoEscape
            (escapePressed)="onCancelEdit()">
            <!-- Use custom directives -->
      </form>
    </li>
    ```

*   **`TodoFooterComponent`:**

    ```typescript
    // src/app/components/todo-footer/todo-footer.component.ts
    import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
    import { Filter } from '../../models/filter.model';

    @Component({
      selector: 'app-todo-footer',
      templateUrl: './todo-footer.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class TodoFooterComponent {
      @Input() remainingCount: number = 0;
      @Input() currentFilter: Filter = Filter.ALL;
      @Input() hasCompletedTodos: boolean = false;

      @Output() clearCompleted = new EventEmitter<void>();
      // @Output() setFilter = new EventEmitter<Filter>(); // Not needed due to routing effect

      // Expose Filter enum to template
      Filter = Filter;

      onClearCompleted(): void {
        this.clearCompleted.emit();
      }

      // onSetFilter(filter: Filter): void {
      //   this.setFilter.emit(filter);
      // }
    }
    ```

    ```html
    <!-- src/app/components/todo-footer/todo-footer.component.html -->
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong>
        {{ remainingCount === 1 ? ' item' : ' items' }} left
      </span>
      <ul class="filters">
        <li>
          <!-- Use routerLink for navigation -->
          <a routerLink="/" [ngClass]="{selected: currentFilter === Filter.ALL}">All</a>
        </li>
        <li>
          <a routerLink="/active" [ngClass]="{selected: currentFilter === Filter.ACTIVE}">Active</a>
        </li>
        <li>
          <a routerLink="/completed" [ngClass]="{selected: currentFilter === Filter.COMPLETED}">Completed</a>
        </li>
      </ul>
      <button
        *ngIf="hasCompletedTodos"
        class="clear-completed"
        (click)="onClearCompleted()">
        Clear completed
      </button>
    </footer>
    ```

**6. Implement Directives**

*   **`TodoFocusDirective`:**

    ```typescript
    // src/app/directives/todo-focus.directive.ts
    import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

    @Directive({
      selector: '[appTodoFocus]'
    })
    export class TodoFocusDirective implements OnChanges {
      // Renamed input for clarity, matches usage in template
      @Input('appTodoFocus') shouldFocus: boolean = false;

      constructor(private elementRef: ElementRef<HTMLInputElement>) {}

      ngOnChanges(changes: SimpleChanges): void {
        if (changes['shouldFocus'] && this.shouldFocus) {
          // Use setTimeout to ensure focus happens after the element is rendered/visible
          setTimeout(() => {
            this.elementRef.nativeElement.focus();
            // Optional: Select text when focusing for easier editing
            this.elementRef.nativeElement.select();
          }, 0);
        }
      }
    }
    ```

*   **`TodoEscapeDirective`:**

    ```typescript
    // src/app/directives/todo-escape.directive.ts
    import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

    @Directive({
      selector: '[appTodoEscape]'
    })
    export class TodoEscapeDirective {
      // Renamed output for clarity, matches usage in template
      @Output('appTodoEscape') escapePressed = new EventEmitter<void>();

      @HostListener('keydown.escape', ['$event'])
      onEscape(event: KeyboardEvent): void {
        this.escapePressed.emit();
        // Optional: Prevent event propagation if needed
        // event.stopPropagation();
      }
    }
    ```

**7. Final Steps**

*   **Run the App:** `ng serve -o`
*   **Testing:** Add unit tests for components, services, reducers, selectors, and effects. Add e2e tests.
*   **Optimization:**
    *   `OnPush` change detection is used in presentational components.
    *   `trackBy` is implemented for the `*ngFor` loop.
    *   NgRx selectors provide memoization.
    *   `debounceTime` in the effect prevents excessive localStorage writes.
*   **Code Quality:**
    *   TypeScript is used throughout.
    *   Follows Angular style guide conventions.
    *   No `TODO` comments left.
    *   Clear separation of concerns (components, services, state management).

This completes the migration from the AngularJS/RequireJS version to Angular 14.x using NgRx for state management, component architecture, and modern best practices.

### Tokens: {'input_tokens': 2824, 'output_tokens': 8811}
### Execution time: 85.04774308204651
