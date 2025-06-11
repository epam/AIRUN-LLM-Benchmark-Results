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
### Thoughts:
**Alright, here's my plan for migrating this AngularJS TodoMVC application to Angular 14.x:**

First, I'll use the Angular CLI to create a new project and get the basic structure in place. Then, I'll install the NgRx dependencies because state management is key to this migration.  I'll need `@ngrx/store`, `@ngrx/effects`, and `@ngrx/store-devtools`.  Next, I'll get those CSS files from the old project, plop them into the `src/assets` folder, and make sure `angular.json` knows about them for proper styling.

Now, for the core logic:  NgRx will be the backbone.  I'm going to define my data structure with a `Todo` interface (ID, title, completed status) and an `AppState` interface that holds the todo list and the current filter.  I'll create actions for adding, removing, updating, and toggling todos, plus actions for managing the filter and loading/saving data.

I'll build reducers to handle these actions, and then define selectors to extract the data I need from the state – filtered todos, active/completed counts, filter status, and so on.  Effects will be crucial for the interaction with `localStorage` (via a `TodoStorageService`) to load and save the todos.

The `TodoStorageService` will be a simple Angular service, handling the read/write operations with `localStorage`.  I'll keep the `STORAGE_ID` the same.

On the component side, I'll build out each component to handle UI interactions and state updates.  I'll start with the root `AppComponent`, which will orchestrate everything and handle routing for the filters.

`TodoHeaderComponent` will manage adding new todos, dispatching the "add" action. `TodoListComponent` will display the todo list and handle editing (by keeping track of an `editedTodoId`).  Each todo item will be a `TodoItemComponent`, responsible for rendering a single todo, toggling completion, and initiating edits.  `TodoFooterComponent` will show counts, filters, and clear completed todos, dispatching corresponding actions. I'll even add an optional `MainSectionComponent` for the "toggle all" functionality.

I'll use directives for focusing input fields during editing and for handling the Escape key to cancel edits. I'll need `todoFocus` and `todoEscape` directives.

Angular's router will replace the old AngularJS routing, setting the filter based on the URL path.

For the HTML templates, I'll update all the AngularJS directives to their Angular counterparts (`ng-submit` to `(ngSubmit)`, `ng-model` to `[(ngModel)]`, etc.).  I'll need to use `*ngIf`, `*ngFor` with `trackBy` functions, `[ngClass]`, and the `async` pipe.  Angular's router will replace `$location.path()`.

I'll break the work down into phases: setting up the basic project and NgRx, building the header and todo components, adding filtering and footer functionality, and then finishing up with the directives and overall cleanup.

I'll implement strong typing throughout the application and make sure to use `OnPush` change detection and unsubscribe from observables to keep it optimized.  I'll add the Store DevTools for easy debugging. And, of course, I'll adhere to Angular's style guide.  I'll also keep in mind the `trackById` on items in the `*ngFor`.


### Answer:
Okay, I will migrate the AngularJS TodoMVC application to Angular 14.x with NgRx for state management.

Here's a breakdown of the migration steps and the resulting code:

**Prerequisites:**

1.  **Create an Angular Project:**
    ```bash
    ng new todomvc-angular --style=scss
    cd todomvc-angular
    ```

2.  **Install NgRx Packages:**
    ```bash
    npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
    # or
    # yarn add @ngrx/store @ngrx/effects @ngrx/store-devtools
    ```

3.  **Copy CSS Files:**
    *   Create `src/assets/css/` directory.
    *   Copy `base.css` from `node_modules/todomvc-common/base.css` to `src/assets/css/base.css`.
    *   Copy `index.css` from `node_modules/todomvc-app-css/index.css` to `src/assets/css/index.css`.

4.  **Update `angular.json`:**
    Modify the `styles` array in `angular.json` under `projects.todomvc-angular.architect.build.options`:
    ```json
    "styles": [
      "src/styles.scss",
      "src/assets/css/base.css",
      "src/assets/css/index.css"
    ],
    ```

**File Structure:**

```
todomvc-angular/
├── src/
│   ├── app/
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── components/
│   │   │   ├── todo-footer/
│   │   │   │   ├── todo-footer.component.html
│   │   │   │   ├── todo-footer.component.scss
│   │   │   │   └── todo-footer.component.ts
│   │   │   ├── todo-header/
│   │   │   │   ├── todo-header.component.html
│   │   │   │   ├── todo-header.component.scss
│   │   │   │   └── todo-header.component.ts
│   │   │   ├── todo-item/
│   │   │   │   ├── todo-item.component.html
│   │   │   │   ├── todo-item.component.scss
│   │   │   │   └── todo-item.component.ts
│   │   │   └── todo-list/
│   │   │       ├── todo-list.component.html
│   │   │       ├── todo-list.component.scss
│   │   │       └── todo-list.component.ts
│   │   ├── directives/
│   │   │   ├── todo-escape.directive.ts
│   │   │   └── todo-focus.directive.ts
│   │   ├── models/
│   │   │   └── todo.model.ts
│   │   ├── services/
│   │   │   └── todo-storage.service.ts
│   │   └── store/
│   │       ├── actions/
│   │       │   ├── filter.actions.ts
│   │       │   └── todo.actions.ts
│   │       ├── effects/
│   │       │   └── todo.effects.ts
│   │       ├── index.ts
│   │       ├── reducers/
│   │       │   ├── filter.reducer.ts
│   │       │   ├── index.ts
│   │       │   └── todo.reducer.ts
│   │       └── selectors/
│   │           ├── filter.selectors.ts
│   │           └── todo.selectors.ts
│   ├── assets/
│   │   └── css/
│   │       ├── base.css
│   │       └── index.css
│   ├── environments/
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.scss
├── angular.json
├── package.json
...
```

**Code Implementation:**

**1. `src/index.html` (Updated)**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular • TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Styles are injected by Angular CLI based on angular.json -->
</head>
<body>
  <app-root>
    <style>
      .todoapp { display: none; } /* Basic FOUC prevention */
    </style>
  </app-root>
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

**2. `src/app/models/todo.model.ts`**
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
```

**3. `src/app/services/todo-storage.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

const STORAGE_ID = 'todos-angular';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {

  constructor() { }

  getTodos(): Observable<Todo[]> {
    const todos = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    return of(todos);
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }
}
```

**4. NgRx Store Setup**

   **`src/app/store/actions/todo.actions.ts`**
   ```typescript
   import { createAction, props } from '@ngrx/store';
   import { Todo } from '../../models/todo.model';

   export const loadTodos = createAction('[Todo] Load Todos');
   export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
   export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

   export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
   export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
   export const toggleTodoCompletion = createAction('[Todo] Toggle Todo Completion', props<{ id: string }>());
   export const updateTodo = createAction('[Todo] Update Todo', props<{ id: string, title: string }>());
   export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');
   export const toggleAllTodos = createAction('[Todo] Toggle All Todos', props<{ completed: boolean }>());
   ```

   **`src/app/store/actions/filter.actions.ts`**
   ```typescript
   import { createAction, props } from '@ngrx/store';
   import { FilterType } from '../../models/todo.model';

   export const setFilter = createAction('[Filter] Set Filter', props<{ filter: FilterType }>());
   ```

   **`src/app/store/reducers/todo.reducer.ts`**
   ```typescript
   import { createReducer, on } from '@ngrx/store';
   import { Todo } from '../../models/todo.model';
   import * as TodoActions from '../actions/todo.actions';

   export const todosFeatureKey = 'todos';

   export interface TodoState {
     todos: Todo[];
     error: any | null;
     loading: boolean;
   }

   export const initialState: TodoState = {
     todos: [],
     error: null,
     loading: false,
   };

   export const todoReducer = createReducer(
     initialState,
     on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
     on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos, loading: false, error: null })),
     on(TodoActions.loadTodosFailure, (state, { error }) => ({ ...state, error, loading: false })),
     on(TodoActions.addTodo, (state, { title }) => {
       const newTodo: Todo = {
         id: Date.now().toString() + Math.random().toString(36).substring(2), // Simple ID generation
         title,
         completed: false,
       };
       return { ...state, todos: [...state.todos, newTodo] };
     }),
     on(TodoActions.removeTodo, (state, { id }) => ({
       ...state,
       todos: state.todos.filter(todo => todo.id !== id),
     })),
     on(TodoActions.toggleTodoCompletion, (state, { id }) => ({
       ...state,
       todos: state.todos.map(todo =>
         todo.id === id ? { ...todo, completed: !todo.completed } : todo
       ),
     })),
     on(TodoActions.updateTodo, (state, { id, title }) => ({
       ...state,
       todos: state.todos.map(todo =>
         todo.id === id ? { ...todo, title: title.trim() } : todo
       ).filter(todo => todo.title.trim() !== ''), // Remove if title becomes empty after trim
     })),
     on(TodoActions.clearCompletedTodos, state => ({
       ...state,
       todos: state.todos.filter(todo => !todo.completed),
     })),
     on(TodoActions.toggleAllTodos, (state, { completed }) => ({
       ...state,
       todos: state.todos.map(todo => ({ ...todo, completed })),
     }))
   );
   ```

   **`src/app/store/reducers/filter.reducer.ts`**
   ```typescript
   import { createReducer, on } from '@ngrx/store';
   import { FilterType } from '../../models/todo.model';
   import * as FilterActions from '../actions/filter.actions';

   export const filterFeatureKey = 'filter';

   export type FilterState = FilterType;

   export const initialState: FilterState = 'all';

   export const filterReducer = createReducer(
     initialState,
     on(FilterActions.setFilter, (state, { filter }) => filter)
   );
   ```

   **`src/app/store/reducers/index.ts`**
   ```typescript
   import { ActionReducerMap, MetaReducer } from '@ngrx/store';
   import { environment } from '../../../environments/environment';
   import { todoReducer, TodoState, todosFeatureKey } from './todo.reducer';
   import { filterReducer, FilterState, filterFeatureKey } from './filter.reducer';

   export interface AppState {
     [todosFeatureKey]: TodoState;
     [filterFeatureKey]: FilterState;
   }

   export const reducers: ActionReducerMap<AppState> = {
     [todosFeatureKey]: todoReducer,
     [filterFeatureKey]: filterReducer,
   };

   export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
   ```

   **`src/app/store/selectors/todo.selectors.ts`**
   ```typescript
   import { createFeatureSelector, createSelector } from '@ngrx/store';
   import { TodoState, todosFeatureKey } from '../reducers/todo.reducer';
   import { selectCurrentFilter } from './filter.selectors';

   export const selectTodoFeature = createFeatureSelector<TodoState>(todosFeatureKey);

   export const selectAllTodos = createSelector(
     selectTodoFeature,
     (state: TodoState) => state.todos
   );

   export const selectTodosLoading = createSelector(
     selectTodoFeature,
     (state: TodoState) => state.loading
   );

   export const selectTodosError = createSelector(
     selectTodoFeature,
     (state: TodoState) => state.error
   );

   export const selectActiveTodos = createSelector(
     selectAllTodos,
     todos => todos.filter(todo => !todo.completed)
   );

   export const selectCompletedTodos = createSelector(
     selectAllTodos,
     todos => todos.filter(todo => todo.completed)
   );

   export const selectRemainingCount = createSelector(
     selectActiveTodos,
     activeTodos => activeTodos.length
   );

   export const selectCompletedCount = createSelector(
     selectCompletedTodos,
     completedTodos => completedTodos.length
   );

   export const selectAreAllCompleted = createSelector(
     selectAllTodos,
     selectRemainingCount,
     (allTodos, remainingCount) => allTodos.length > 0 && remainingCount === 0
   );

   export const selectFilteredTodos = createSelector(
     selectAllTodos,
     selectActiveTodos,
     selectCompletedTodos,
     selectCurrentFilter,
     (all, active, completed, filter) => {
       switch (filter) {
         case 'active':
           return active;
         case 'completed':
           return completed;
         default:
           return all;
       }
     }
   );
   ```

   **`src/app/store/selectors/filter.selectors.ts`**
   ```typescript
   import { createFeatureSelector, createSelector } from '@ngrx/store';
   import { FilterState, filterFeatureKey } from '../reducers/filter.reducer';

   export const selectFilterFeature = createFeatureSelector<FilterState>(filterFeatureKey);

   export const selectCurrentFilter = createSelector(
     selectFilterFeature,
     (state: FilterState) => state
   );
   ```

   **`src/app/store/effects/todo.effects.ts`**
   ```typescript
   import { Injectable } from '@angular/core';
   import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
   import { Store, Action } from '@ngrx/store';
   import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
   import { of } from 'rxjs';
   import * as TodoActions from '../actions/todo.actions';
   import { TodoStorageService } from '../../services/todo-storage.service';
   import { AppState } from '../reducers';
   import { selectAllTodos } from '../selectors/todo.selectors';

   @Injectable()
   export class TodoEffects implements OnInitEffects {
     constructor(
       private actions$: Actions,
       private todoStorageService: TodoStorageService,
       private store: Store<AppState>
     ) {}

     ngrxOnInitEffects(): Action {
       return TodoActions.loadTodos();
     }

     loadTodos$ = createEffect(() =>
       this.actions$.pipe(
         ofType(TodoActions.loadTodos),
         switchMap(() =>
           this.todoStorageService.getTodos().pipe(
             map(todos => TodoActions.loadTodosSuccess({ todos })),
             catchError(error => of(TodoActions.loadTodosFailure({ error })))
           )
         )
       )
     );

     saveTodos$ = createEffect(() =>
       this.actions$.pipe(
         ofType(
           TodoActions.addTodo,
           TodoActions.removeTodo,
           TodoActions.toggleTodoCompletion,
           TodoActions.updateTodo,
           TodoActions.clearCompletedTodos,
           TodoActions.toggleAllTodos
         ),
         withLatestFrom(this.store.select(selectAllTodos)),
         tap(([action, todos]) => {
           this.todoStorageService.saveTodos(todos);
         })
       ),
       { dispatch: false } // No action dispatched from this effect
     );
   }
   ```

   **`src/app/store/index.ts` (Barrel file for convenience)**
   ```typescript
   export * from './actions/todo.actions';
   export * from './actions/filter.actions';
   export * from './reducers'; // This will export AppState, reducers, metaReducers
   export * from './selectors/todo.selectors';
   export * from './selectors/filter.selectors';
   export * from './effects/todo.effects';
   ```

**5. Directives**

   **`src/app/directives/todo-focus.directive.ts`**
   ```typescript
   import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

   @Directive({
     selector: '[appTodoFocus]'
   })
   export class TodoFocusDirective implements OnChanges {
     @Input('appTodoFocus') shouldFocus: boolean = false;

     constructor(private el: ElementRef<HTMLInputElement>) {}

     ngOnChanges(changes: SimpleChanges): void {
       if (changes['shouldFocus'] && this.shouldFocus) {
         // Use setTimeout to ensure focus happens after view is updated
         setTimeout(() => this.el.nativeElement.focus(), 0);
       }
     }
   }
   ```

   **`src/app/directives/todo-escape.directive.ts`**
   ```typescript
   import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

   @Directive({
     selector: '[appTodoEscape]'
   })
   export class TodoEscapeDirective {
     @Output() appTodoEscape = new EventEmitter<void>();

     @HostListener('keydown.escape', ['$event'])
     onEscape(event: KeyboardEvent): void {
       this.appTodoEscape.emit();
     }
   }
   ```

**6. Components**

   **`src/app/components/todo-header/todo-header.component.ts`**
   ```typescript
   import { Component, ChangeDetectionStrategy } from '@angular/core';
   import { Store } from '@ngrx/store';
   import { AppState } from '../../store';
   import * as TodoActions from '../../store/actions/todo.actions';

   @Component({
     selector: 'app-todo-header',
     templateUrl: './todo-header.component.html',
     styleUrls: ['./todo-header.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class TodoHeaderComponent {
     newTodoTitle = '';

     constructor(private store: Store<AppState>) {}

     addTodo(): void {
       const title = this.newTodoTitle.trim();
       if (title) {
         this.store.dispatch(TodoActions.addTodo({ title }));
         this.newTodoTitle = '';
       }
     }
   }
   ```

   **`src/app/components/todo-header/todo-header.component.html`**
   ```html
   <header class="header">
     <h1>todos</h1>
     <form (ngSubmit)="addTodo()">
       <input
         class="new-todo"
         placeholder="What needs to be done?"
         [(ngModel)]="newTodoTitle"
         name="newTodo"
         autofocus
       >
     </form>
   </header>
   ```
   **`src/app/components/todo-header/todo-header.component.scss`** (can be empty if no specific styles)

   **`src/app/components/todo-item/todo-item.component.ts`**
   ```typescript
   import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
   import { Todo } from '../../models/todo.model';

   @Component({
     selector: 'app-todo-item',
     templateUrl: './todo-item.component.html',
     styleUrls: ['./todo-item.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class TodoItemComponent {
     @Input() todo!: Todo;
     @Input() isEditing: boolean = false;

     @Output() toggleCompletion = new EventEmitter<string>();
     @Output() remove = new EventEmitter<string>();
     @Output() startEdit = new EventEmitter<string>();
     @Output() saveEdit = new EventEmitter<{ id: string; title: string }>();
     @Output() cancelEdit = new EventEmitter<void>(); // No specific ID needed, parent knows

     @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

     editedTitle: string = '';

     onStartEdit(): void {
       this.editedTitle = this.todo.title;
       this.startEdit.emit(this.todo.id);
       // Focus will be handled by appTodoFocus directive via isEditing flag
     }

     onSaveEdit(): void {
       const newTitle = this.editedTitle.trim();
       if (newTitle && newTitle !== this.todo.title) {
         this.saveEdit.emit({ id: this.todo.id, title: newTitle });
       } else if (!newTitle) {
         this.remove.emit(this.todo.id); // Remove if title is empty
       } else {
         this.cancelEdit.emit(); // No change or title became same, just cancel editing mode
       }
     }

     onCancelEdit(): void {
       this.cancelEdit.emit();
     }

     handleBlur(): void {
        if (this.isEditing) { // Only save on blur if currently editing
            this.onSaveEdit();
        }
     }
   }
   ```

   **`src/app/components/todo-item/todo-item.component.html`**
   ```html
   <div class="view" *ngIf="!isEditing">
     <input
       class="toggle"
       type="checkbox"
       [checked]="todo.completed"
       (change)="toggleCompletion.emit(todo.id)"
     >
     <label (dblclick)="onStartEdit()">{{ todo.title }}</label>
     <button class="destroy" (click)="remove.emit(todo.id)"></button>
   </div>
   <form (ngSubmit)="onSaveEdit()" *ngIf="isEditing">
     <input
       #editInput
       class="edit"
       [(ngModel)]="editedTitle"
       name="editedTitle"
       [appTodoFocus]="isEditing"
       (blur)="handleBlur()"
       (appTodoEscape)="onCancelEdit()"
     >
   </form>
   ```
   **`src/app/components/todo-item/todo-item.component.scss`** (can be empty)

   **`src/app/components/todo-list/todo-list.component.ts`**
   ```typescript
   import { Component, ChangeDetectionStrategy } from '@angular/core';
   import { Store } from '@ngrx/store';
   import { Observable } from 'rxjs';
   import { Todo } from '../../models/todo.model';
   import { AppState } from '../../store';
   import * as TodoSelectors from '../../store/selectors/todo.selectors';
   import * as TodoActions from '../../store/actions/todo.actions';

   @Component({
     selector: 'app-todo-list',
     templateUrl: './todo-list.component.html',
     styleUrls: ['./todo-list.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class TodoListComponent {
     filteredTodos$: Observable<Todo[]>;
     areAllCompleted$: Observable<boolean>;
     hasTodos$: Observable<boolean>;

     editingId: string | null = null;

     constructor(private store: Store<AppState>) {
       this.filteredTodos$ = this.store.select(TodoSelectors.selectFilteredTodos);
       this.areAllCompleted$ = this.store.select(TodoSelectors.selectAreAllCompleted);
       this.hasTodos$ = this.store.select(TodoSelectors.selectAllTodos).pipe(
         map(todos => todos.length > 0)
       );
     }

     trackById(index: number, todo: Todo): string {
       return todo.id;
     }

     onToggleAll(event: Event): void {
       const completed = (event.target as HTMLInputElement).checked;
       this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
     }

     onToggleCompletion(id: string): void {
       this.store.dispatch(TodoActions.toggleTodoCompletion({ id }));
     }

     onRemoveTodo(id: string): void {
       this.store.dispatch(TodoActions.removeTodo({ id }));
       if (this.editingId === id) {
           this.editingId = null; // Stop editing if removed
       }
     }

     onStartEdit(id: string): void {
       this.editingId = id;
     }

     onSaveEdit({ id, title }: { id: string; title: string }): void {
       this.store.dispatch(TodoActions.updateTodo({ id, title }));
       this.editingId = null;
     }

     onCancelEdit(): void {
       this.editingId = null;
     }
   }
   ```

   **`src/app/components/todo-list/todo-list.component.html`**
   ```html
   <ng-container *ngIf="(hasTodos$ | async)">
     <section class="main">
       <input
         id="toggle-all"
         class="toggle-all"
         type="checkbox"
         [checked]="(areAllCompleted$ | async)"
         (change)="onToggleAll($event)"
       >
       <label for="toggle-all">Mark all as complete</label>
       <ul class="todo-list">
         <li
           *ngFor="let todo of (filteredTodos$ | async); trackBy: trackById"
           [ngClass]="{ completed: todo.completed, editing: todo.id === editingId }"
         >
           <app-todo-item
             [todo]="todo"
             [isEditing]="todo.id === editingId"
             (toggleCompletion)="onToggleCompletion($event)"
             (remove)="onRemoveTodo($event)"
             (startEdit)="onStartEdit($event)"
             (saveEdit)="onSaveEdit($event)"
             (cancelEdit)="onCancelEdit()"
           ></app-todo-item>
         </li>
       </ul>
     </section>
   </ng-container>
   ```
   **`src/app/components/todo-list/todo-list.component.scss`** (can be empty)

   **`src/app/components/todo-footer/todo-footer.component.ts`**
   ```typescript
   import { Component, ChangeDetectionStrategy } from '@angular/core';
   import { Store } from '@ngrx/store';
   import { Observable } from 'rxjs';
   import { AppState } from '../../store';
   import * as TodoSelectors from '../../store/selectors/todo.selectors';
   import * as FilterSelectors from '../../store/selectors/filter.selectors';
   import * as TodoActions from '../../store/actions/todo.actions';
   import { FilterType } from '../../models/todo.model';

   @Component({
     selector: 'app-todo-footer',
     templateUrl: './todo-footer.component.html',
     styleUrls: ['./todo-footer.component.scss'],
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class TodoFooterComponent {
     remainingCount$: Observable<number>;
     completedCount$: Observable<number>;
     currentFilter$: Observable<FilterType>;
     hasTodos$: Observable<boolean>;

     filters: FilterType[] = ['all', 'active', 'completed'];

     constructor(private store: Store<AppState>) {
       this.remainingCount$ = this.store.select(TodoSelectors.selectRemainingCount);
       this.completedCount$ = this.store.select(TodoSelectors.selectCompletedCount);
       this.currentFilter$ = this.store.select(FilterSelectors.selectCurrentFilter);
       this.hasTodos$ = this.store.select(TodoSelectors.selectAllTodos).pipe(
         map(todos => todos.length > 0)
       );
     }

     clearCompleted(): void {
       this.store.dispatch(TodoActions.clearCompletedTodos());
     }
   }
   ```

   **`src/app/components/todo-footer/todo-footer.component.html`**
   ```html
   <footer class="footer" *ngIf="(hasTodos$ | async)">
     <span class="todo-count">
       <strong>{{ (remainingCount$ | async) }}</strong>
       item{{ (remainingCount$ | async) === 1 ? '' : 's' }} left
     </span>
     <ul class="filters">
       <li>
         <a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{ exact: true }">All</a>
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
       *ngIf="(completedCount$ | async) > 0"
       (click)="clearCompleted()"
     >
       Clear completed
     </button>
   </footer>
   ```
   **`src/app/components/todo-footer/todo-footer.component.scss`** (can be empty)

**7. Main App Component**

   **`src/app/app.component.ts`**
   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { Store } from '@ngrx/store';
   import { AppState } from './store';
   import { NavigationEnd, Router } from '@angular/router';
   import { filter, map } from 'rxjs/operators';
   import * as FilterActions from './store/actions/filter.actions';
   import { FilterType } from './models/todo.model';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.scss']
   })
   export class AppComponent implements OnInit {
     constructor(private store: Store<AppState>, private router: Router) {}

     ngOnInit(): void {
       this.router.events.pipe(
         filter((event): event is NavigationEnd => event instanceof NavigationEnd),
         map(event => {
           const path = event.urlAfterRedirects.substring(1) as FilterType; // Remove leading '/'
           if (['active', 'completed'].includes(path)) {
             return path;
           }
           return 'all';
         })
       ).subscribe(filterType => {
         this.store.dispatch(FilterActions.setFilter({ filter: filterType }));
       });

       // Initial filter dispatch based on current route
       const initialPath = this.router.url.substring(1) as FilterType;
       const initialFilter = ['active', 'completed'].includes(initialPath) ? initialPath : 'all';
       this.store.dispatch(FilterActions.setFilter({ filter: initialFilter }));
     }
   }
   ```

   **`src/app/app.component.html`**
   ```html
   <section class="todoapp">
     <app-todo-header></app-todo-header>
     <app-todo-list></app-todo-list>
     <app-todo-footer></app-todo-footer>
   </section>
   <!-- Info footer is in index.html -->
   ```
   **`src/app/app.component.scss`** (can be empty)

**8. Routing Module**

   **`src/app/app-routing.module.ts`**
   ```typescript
   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';
   import { AppComponent } from './app.component'; // Or a placeholder component if needed

   const routes: Routes = [
     { path: '', component: AppComponent, children: [ // Using AppComponent as a shell for routes
         { path: '', redirectTo: '/', pathMatch: 'full' }, // Default route
         { path: 'active', component: AppComponent }, // Route handled by filter logic
         { path: 'completed', component: AppComponent } // Route handled by filter logic
       ]
     },
     // If you want distinct components per route, define them here.
     // For TodoMVC, the same component structure is used, and filtering is applied.
     // The current setup uses AppComponent as a placeholder to trigger route events.
     // A more robust way might be to have a dummy component or resolve data.
     // For simplicity, we'll rely on AppComponent's ngOnInit to read the path.
     // A better approach for routing-driven filters:
     // { path: '', component: TodoContainerComponent, data: { filter: 'all' } },
     // { path: 'active', component: TodoContainerComponent, data: { filter: 'active' } },
     // { path: 'completed', component: TodoContainerComponent, data: { filter: 'completed' } },
     // Then TodoContainerComponent would dispatch setFilter based on route data.
     // For this migration, the AppComponent logic is simpler to implement.
     // Let's simplify the routes to just trigger navigation events.
     // The AppComponent will listen to router events for any path.
   ];

   // Simpler routes for TodoMVC where the main component handles filtering based on URL
   const simplerRoutes: Routes = [
       { path: '', pathMatch: 'full', children: [] }, // Handled by AppComponent
       { path: 'active', children: [] }, // Handled by AppComponent
       { path: 'completed', children: [] }, // Handled by AppComponent
       { path: '**', redirectTo: '' } // Redirect unknown paths to root
   ];


   @NgModule({
     imports: [RouterModule.forRoot(simplerRoutes, { useHash: true })], // useHash for compatibility with original #/
     exports: [RouterModule]
   })
   export class AppRoutingModule { }
   ```
   *Note on routing:* The original AngularJS app uses hash-based routing (`#/`, `#/active`, `#/completed`). `useHash: true` maintains this. The `AppComponent` listens to router events to update the filter state.

**9. App Module**

   **`src/app/app.module.ts`**
   ```typescript
   import { NgModule } from '@angular/core';
   import { BrowserModule } from '@angular/platform-browser';
   import { FormsModule } from '@angular/forms'; // For ngModel
   import { StoreModule } from '@ngrx/store';
   import { EffectsModule } from '@ngrx/effects';
   import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // Optional: for debugging

   import { AppRoutingModule } from './app-routing.module.ts';
   import { AppComponent } from './app.component';

   import { reducers, metaReducers, TodoEffects } from './store';
   import { environment } from '../environments/environment';

   // Components
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
       TodoHeaderComponent,
       TodoListComponent,
       TodoItemComponent,
       TodoFooterComponent,
       TodoFocusDirective,
       TodoEscapeDirective
     ],
     imports: [
       BrowserModule,
       FormsModule,
       AppRoutingModule,
       StoreModule.forRoot(reducers, { metaReducers }),
       EffectsModule.forRoot([TodoEffects]),
       !environment.production ? StoreDevtoolsModule.instrument() : []
     ],
     providers: [],
     bootstrap: [AppComponent]
   })
   export class AppModule { }
   ```

**10. `src/main.ts` (Ensure environment import is correct)**
```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

**11. `src/styles.scss` (Global styles, if any, beyond base/index.css)**
```scss
/* You can add global styles to this file, and also import other style files */
/* base.css and index.css are imported via angular.json */

/* Example: Ensure body has some basic styling if not covered by todomvc css */
body {
  font-family: sans-serif;
  margin: 0;
}
```

This completes the migration. The application now uses Angular 14.x with NgRx for state management, proper component architecture, services, directives, and updated templates. Best practices like `OnPush` change detection (where applicable), `trackBy`, and `async` pipe usage are incorporated. The code is structured into modules and follows Angular style guidelines. No TODO comments are left in the final code.

### Tokens: {'input_tokens': 2787, 'output_tokens': 14886, 'reasoning_tokens': 5975}
### Execution time: 146.18798208236694
