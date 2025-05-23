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
The migration from AngularJS with RequireJS to Angular 14.x involves a complete architectural shift, moving from a controller-centric, imperative approach to a component-based, reactive one with NgRx for state management.

Here's the migrated application code, following all the specified requirements:

**Project Setup:**

First, create a new Angular project:

```bash
ng new angular-todomvc --routing --style=css --skip-tests
cd angular-todomvc
npm install @ngrx/store @ngrx/effects @ngrx/router-store @ngrx/entity
```

Then, copy the original CSS files. Create `src/styles/base.css` and `src/styles/index.css` and paste the content from `node_modules/todomvc-common/base.css` and `node_modules/todomvc-app-css/index.css` respectively.

Update `angular.json` to include these styles:

```json
// angular.json
"styles": [
  "src/styles/base.css",
  "src/styles/index.css",
  "src/styles.css" // Keep default if you have other global styles
],
```

---

**1. `src/index.html`**
This is the standard Angular `index.html`. The application content is rendered by `<app-root>`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

**2. `src/app/app.module.ts`**
The main Angular module, configuring NgRx, routing, and declaring all components and directives.

```typescript
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// NgRx Modules
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

// Components
import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

// NgRx State Management
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';
import { CustomSerializer } from './store/router.serializer';

// Directives
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

// Define application routes
const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' }, // Default route
  { path: ':filter', component: AppComponent } // For /active, /completed
];

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
    FormsModule, // Required for [(ngModel)]
    RouterModule.forRoot(routes, { useHash: true }), // Use hash routing to match original AngularJS behavior
    StoreModule.forRoot({
      todos: todoReducer, // Register the todo reducer
    }),
    EffectsModule.forRoot([TodoEffects]), // Register todo effects
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }), // Connect router to NgRx store
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }), // NgRx DevTools for debugging
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer } // Provide custom router state serializer
  ],
  bootstrap: [AppComponent] // Bootstrap the root component
})
export class AppModule { }
```

---

**3. `src/app/models/todo.model.ts`**
Defines the `Todo` interface. An `id` is added for better state management with NgRx Entity.

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

---

**4. `src/app/services/todo-storage.service.ts`**
An injectable Angular service to persist and retrieve todos from `localStorage`.

```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

const STORAGE_ID = 'todos-angularjs-requirejs'; // Maintain the same storage ID for data consistency

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class TodoStorageService {
  getTodos(): Todo[] {
    try {
      const storedTodos = localStorage.getItem(STORAGE_ID);
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (e) {
      console.error('Error parsing todos from localStorage', e);
      return []; // Return empty array on error
    }
  }

  putTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage', e);
    }
  }
}
```

---

**5. NgRx State Management (`src/app/store/`)**

**5.1. `src/app/store/todo.actions.ts`**
Defines all actions related to Todo operations.

```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

// Actions for loading todos from storage
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

// Actions for modifying individual todos
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const updateTodoTitle = createAction('[Todo] Update Todo Title', props<{ id: string, title: string }>());

// Actions for bulk operations
export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
```

**5.2. `src/app/store/todo.reducer.ts`**
Manages the `Todo` state using `@ngrx/entity` for efficient collection management.

```typescript
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

// Define the TodoState interface, extending EntityState
export interface TodoState extends EntityState<Todo> {
  // No additional properties needed for this simple app
}

// Create an entity adapter for Todo
export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

// Define the initial state using the adapter's getInitialState method
export const initialState: TodoState = adapter.getInitialState();

// Create the todo reducer
export const todoReducer = createReducer(
  initialState,
  // Handle successful loading of todos
  on(TodoActions.loadTodosSuccess, (state, { todos }) => adapter.setAll(todos, state)),

  // Handle adding a new todo
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: Date.now().toString(), // Simple unique ID generation
      title: title.trim(),
      completed: false
    };
    return adapter.addOne(newTodo, state); // Add the new todo to the state
  }),

  // Handle removing a todo
  on(TodoActions.removeTodo, (state, { id }) => adapter.removeOne(id, state)),

  // Handle toggling a todo's completion status
  on(TodoActions.toggleTodo, (state, { id }) => adapter.mapOne({
    id,
    changes: { completed: !state.entities[id]?.completed } // Toggle completed status
  }, state)),

  // Handle updating a todo's title
  on(TodoActions.updateTodoTitle, (state, { id, title }) => adapter.mapOne({
    id,
    changes: { title: title.trim() } // Update title and trim whitespace
  }, state)),

  // Handle clearing all completed todos
  on(TodoActions.clearCompletedTodos, (state) => {
    const completedIds = state.ids.filter(id => state.entities[id]?.completed);
    return adapter.removeMany(completedIds, state); // Remove all completed todos
  }),

  // Handle toggling all todos' completion status
  on(TodoActions.toggleAll, (state, { completed }) => {
    const changes = state.ids.map(id => ({
      id,
      changes: { completed } // Set completed status for all todos
    }));
    return adapter.updateMany(changes, state); // Update multiple todos
  })
);
```

**5.3. `src/app/store/router.serializer.ts`**
A custom serializer for `@ngrx/router-store` to simplify the router state stored in NgRx.

```typescript
import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

// Define the simplified router state URL interface
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string | null;
}

// Custom serializer class
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url, root: { queryParams, fragment } } = routerState;
    const { params } = route;

    // Return a simplified object containing only necessary router information
    return { url, params, queryParams, fragment };
  }
}
```

**5.4. `src/app/store/todo.selectors.ts`**
Defines selectors to derive various pieces of state from the NgRx store.

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState, adapter } from './todo.reducer';
import { getSelectors as getRouterSelectors } from '@ngrx/router-store';
import { RouterStateUrl } from './router.serializer';

// Select the feature state for todos
export const selectTodoState = createFeatureSelector<TodoState>('todos');

// Selectors generated by the entity adapter
export const {
  selectIds,         // Select the array of todo IDs
  selectEntities,    // Select the dictionary of todo entities
  selectAll,         // Select the array of all todos
  selectTotal,       // Select the total count of todos
} = adapter.getSelectors(selectTodoState);

// Select the router state
export const selectRouter = createFeatureSelector<any, RouterStateUrl>('router');
export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectRouteParams,
  selectUrl, // Select the current URL from router state
} = getRouterSelectors(selectRouter);

// Selector to determine the current filter based on the URL
export const selectFilter = createSelector(
  selectUrl,
  (url) => {
    if (url === '/active') {
      return 'active';
    } else if (url === '/completed') {
      return 'completed';
    }
    return 'all'; // Default filter
  }
);

// Selector to get the filtered list of todos
export const selectFilteredTodos = createSelector(
  selectAll, // All todos
  selectFilter, // Current filter
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos; // Return all todos if filter is 'all' or unknown
    }
  }
);

// Selector to get the count of remaining (active) todos
export const selectRemainingCount = createSelector(
  selectAll,
  (todos) => todos.filter(todo => !todo.completed).length
);

// Selector to get the count of completed todos
export const selectDoneCount = createSelector(
  selectAll,
  (todos) => todos.filter(todo => todo.completed).length
);

// Selector to determine if all todos are checked (completed)
export const selectAllChecked = createSelector(
  selectRemainingCount,
  selectTotal,
  (remaining, total) => total > 0 && remaining === 0 // All checked if total > 0 and remaining is 0
);
```

**5.5. `src/app/store/todo.effects.ts`**
Handles side effects like loading and saving todos to `localStorage`.

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import * as TodoSelectors from './todo.selectors';
import { TodoStorageService } from '../services/todo-storage.service';
import { Store } from '@ngrx/store';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoStorageService: TodoStorageService,
    private store: Store // Inject Store to select current state
  ) {}

  // Effect to load todos from localStorage when the app starts
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos), // Listen for loadTodos action
      switchMap(() => {
        try {
          const todos = this.todoStorageService.getTodos(); // Get todos from storage service
          return of(TodoActions.loadTodosSuccess({ todos })); // Dispatch success action
        } catch (error) {
          return of(TodoActions.loadTodosFailure({ error })); // Dispatch failure action on error
        }
      })
    )
  );

  // Effect to save todos to localStorage whenever the todo state changes
  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.removeTodo,
        TodoActions.toggleTodo,
        TodoActions.updateTodoTitle,
        TodoActions.clearCompletedTodos,
        TodoActions.toggleAll,
        TodoActions.loadTodosSuccess // Also save after initial load if it changes the state
      ),
      withLatestFrom(this.store.select(TodoSelectors.selectAll)), // Get the latest state of all todos
      tap(([action, todos]) => {
        this.todoStorageService.putTodos(todos); // Save the current todos to localStorage
      })
    ),
    { dispatch: false } // This effect does not dispatch any new actions
  );
}
```

---

**6. Components (`src/app/components/`)**

**6.1. `src/app/app.component.ts`**
The root component, responsible for orchestrating child components and dispatching actions based on user interactions.

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from './models/todo.model';
import * as TodoActions from './store/todo.actions';
import * as TodoSelectors from './store/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Observables to get state from NgRx store
  todos$: Observable<Todo[]>;
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;
  totalCount$: Observable<number>;
  allChecked$: Observable<boolean>;
  currentFilter$: Observable<string>;

  constructor(private store: Store) {
    // Select relevant parts of the state using NgRx selectors
    this.todos$ = this.store.select(TodoSelectors.selectFilteredTodos);
    this.remainingCount$ = this.store.select(TodoSelectors.selectRemainingCount);
    this.doneCount$ = this.store.select(TodoSelectors.selectDoneCount);
    this.totalCount$ = this.store.select(TodoSelectors.selectTotal);
    this.allChecked$ = this.store.select(TodoSelectors.selectAllChecked);
    this.currentFilter$ = this.store.select(TodoSelectors.selectFilter);
  }

  ngOnInit(): void {
    // Dispatch action to load todos when the component initializes
    this.store.dispatch(TodoActions.loadTodos());
  }

  // Event handlers for actions dispatched from child components
  onAddTodo(title: string): void {
    this.store.dispatch(TodoActions.addTodo({ title }));
  }

  onToggleAll(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }

  onClearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompletedTodos());
  }
}
```

**6.2. `src/app/app.component.html`**
The main template structure, using child components and `async` pipe for observables.

```html
<section class="todoapp">
  <!-- Todo Header Component for adding new todos -->
  <app-todo-header (addTodo)="onAddTodo($event)"></app-todo-header>

  <!-- Main section for todo list and toggle all, shown only if there are todos -->
  <section class="main" *ngIf="(totalCount$ | async) > 0">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      [checked]="allChecked$ | async"
      (change)="onToggleAll($event.target.checked)"
    />
    <label for="toggle-all">Mark all as complete</label>
    <!-- Todo List Component to display filtered todos -->
    <app-todo-list [todos]="todos$ | async"></app-todo-list>
  </section>

  <!-- Todo Footer Component for counts, filters, and clear completed button, shown only if there are todos -->
  <app-todo-footer
    *ngIf="(totalCount$ | async) > 0"
    [remainingCount]="remainingCount$ | async"
    [doneCount]="doneCount$ | async"
    [totalCount]="totalCount$ | async"
    [currentFilter]="currentFilter$ | async"
    (clearCompleted)="onClearCompleted()"
  ></app-todo-footer>
</section>

<!-- Info footer -->
<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>
    Credits:
    <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
    <a href="http://ericbidelman.com">Eric Bidelman</a>,
    <a href="http://jacobmumm.com">Jacob Mumm</a>,
    <a href="http://blog.igorminar.com">Igor Minar</a> and
    <a href="http://twitter.com/passy">Pascal Hartig</a>
  </p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

**6.3. `src/app/components/todo-header/todo-header.component.ts`**
Handles the input for adding new todos.

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodoTitle: string = ''; // Local state for the new todo input

  @Output() addTodo = new EventEmitter<string>(); // Emits the new todo title

  onAddTodo(): void {
    const title = this.newTodoTitle.trim();
    if (title) {
      this.addTodo.emit(title); // Emit event to parent (AppComponent)
      this.newTodoTitle = ''; // Clear the input field
    }
  }
}
```

**6.4. `src/app/components/todo-header/todo-header.component.html`**
Template for the todo header.

```html
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="onAddTodo()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
      [(ngModel)]="newTodoTitle"
      name="newTodoTitle"
    />
  </form>
</header>
```

**6.5. `src/app/components/todo-list/todo-list.component.ts`**
Manages the list of todo items and their editing state.

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { Store } from '@ngrx/store';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize for immutable inputs
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = []; // Input property for the list of todos
  editedTodoId: string | null = null; // Tracks which todo is currently being edited

  constructor(private store: Store) {}

  // trackBy function for *ngFor to improve performance
  trackById(index: number, todo: Todo): string {
    return todo.id;
  }

  // Event handlers for actions from TodoItemComponent
  onToggleTodo(id: string): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  onRemoveTodo(id: string): void {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  onEditTodo(id: string): void {
    this.editedTodoId = id; // Set the ID of the todo being edited
  }

  onDoneEditing(todo: Todo, newTitle: string): void {
    this.editedTodoId = null; // Exit editing mode
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      this.store.dispatch(TodoActions.removeTodo({ id: todo.id })); // Remove if title is empty
    } else if (trimmedTitle !== todo.title) {
      this.store.dispatch(TodoActions.updateTodoTitle({ id: todo.id, title: trimmedTitle })); // Update if title changed
    }
    // If title is same and not empty, just exit editing mode (handled by setting editedTodoId to null)
  }

  onRevertEditing(): void {
    this.editedTodoId = null; // Exit editing mode without saving changes
  }
}
```

**6.6. `src/app/components/todo-list/todo-list.component.html`**
Template for the todo list, iterating over `todos` and rendering `app-todo-item` for each.

```html
<ul class="todo-list">
  <li
    *ngFor="let todo of todos; trackBy: trackById"
    [class.completed]="todo.completed"
    [class.editing]="todo.id === editedTodoId"
  >
    <!-- Todo Item Component for each individual todo -->
    <app-todo-item
      [todo]="todo"
      [isEditing]="todo.id === editedTodoId"
      (toggle)="onToggleTodo(todo.id)"
      (remove)="onRemoveTodo(todo.id)"
      (edit)="onEditTodo(todo.id)"
      (doneEditing)="onDoneEditing(todo, $event)"
      (revertEditing)="onRevertEditing()"
    ></app-todo-item>
  </li>
</ul>
```

**6.7. `src/app/components/todo-item/todo-item.component.ts`**
Represents a single todo item, handling its display and editing logic.

```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: Todo; // Input for the todo object
  @Input() isEditing: boolean = false; // Input to determine if this item is in editing mode

  @Output() toggle = new EventEmitter<void>(); // Emits when toggle checkbox is clicked
  @Output() remove = new EventEmitter<void>(); // Emits when destroy button is clicked
  @Output() edit = new EventEmitter<void>(); // Emits when label is double-clicked
  @Output() doneEditing = new EventEmitter<string>(); // Emits new title when editing is done
  @Output() revertEditing = new EventEmitter<void>(); // Emits when editing is reverted (Escape key)

  editingTitle: string = ''; // Local state for the title being edited
  originalTitle: string = ''; // Stores original title for reverting

  @ViewChild('editInput') editInput!: ElementRef; // Reference to the edit input element

  ngOnChanges(changes: SimpleChanges): void {
    // When isEditing becomes true, set editingTitle and focus the input
    if (changes['isEditing'] && changes['isEditing'].currentValue === true) {
      this.editingTitle = this.todo.title;
      this.originalTitle = this.todo.title;
      // Use setTimeout to ensure the input is rendered and ready before focusing
      // The todoFocus directive also handles this, but this is a fallback/alternative
      setTimeout(() => {
        this.editInput.nativeElement.focus();
      }, 0);
    }
  }

  onToggle(): void {
    this.toggle.emit();
  }

  onRemove(): void {
    this.remove.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDoneEditing(): void {
    this.doneEditing.emit(this.editingTitle); // Emit the current editing title
  }

  onRevertEditing(): void {
    this.editingTitle = this.originalTitle; // Reset title to original
    this.revertEditing.emit(); // Emit to parent to exit editing mode
  }
}
```

**6.8. `src/app/components/todo-item/todo-item.component.html`**
Template for a single todo item.

```html
<div class="view">
  <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="onToggle()" />
  <label (dblclick)="onEdit()">{{ todo.title }}</label>
  <button class="destroy" (click)="onRemove()"></button>
</div>
<form (ngSubmit)="onDoneEditing()">
  <input
    class="edit"
    #editInput
    [(ngModel)]="editingTitle"
    (blur)="onDoneEditing()"
    (todoEscape)="onRevertEditing()"
    [todoFocus]="isEditing" <!-- Apply custom focus directive -->
    name="editingTitle"
  />
</form>
```

**6.9. `src/app/components/todo-footer/todo-footer.component.ts`**
Displays counts, filter links, and the "Clear completed" button.

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize for immutable inputs
})
export class TodoFooterComponent {
  @Input() remainingCount: number | null = 0; // Count of active todos
  @Input() doneCount: number | null = 0; // Count of completed todos
  @Input() totalCount: number | null = 0; // Total count of todos
  @Input() currentFilter: string | null = 'all'; // Current filter ('all', 'active', 'completed')

  @Output() clearCompleted = new EventEmitter<void>(); // Emits when clear completed button is clicked

  // Getter to determine pluralization for "item/items left"
  get pluralizeText(): string {
    return (this.remainingCount === 1) ? 'item left' : 'items left';
  }

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }
}
```

**6.10. `src/app/components/todo-footer/todo-footer.component.html`**
Template for the todo footer.

```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{ remainingCount }}</strong> {{ pluralizeText }}
  </span>
  <ul class="filters">
    <li>
      <!-- routerLink and routerLinkActive for navigation and active class -->
      <a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{exact: true}">All</a>
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
    (click)="onClearCompleted()"
    *ngIf="doneCount && doneCount > 0"
  >
    Clear completed
  </button>
</footer>
```

---

**7. Directives (`src/app/directives/`)**

**7.1. `src/app/directives/todo-focus.directive.ts`**
Directive to programmatically focus an element based on an input condition.

```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[todoFocus]' // Selector for the directive
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus: boolean = false; // Input property to trigger focus

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    // When todoFocus input changes to true, focus the element
    if (changes['todoFocus'] && changes['todoFocus'].currentValue === true) {
      // Use Renderer2 for safer DOM manipulation
      // setTimeout ensures the element is rendered and ready to be focused
      setTimeout(() => {
        this.renderer.selectRootElement(this.el.nativeElement).focus();
      }, 0);
    }
  }
}
```

**7.2. `src/app/directives/todo-escape.directive.ts`**
Directive to emit an event when the Escape key is pressed on the host element.

```typescript
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[todoEscape]' // Selector for the directive
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter<void>(); // Emits when Escape key is pressed

  // HostListener listens for 'keydown.escape' event on the host element
  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.todoEscape.emit(); // Emit the event
  }
}
```

---

This comprehensive migration covers all the requirements:

1.  **Angular 14.x and ES Modules:** The entire application is rewritten in TypeScript using Angular's component, service, and directive architecture, leveraging ES modules (`import`/`export`). RequireJS is completely removed.
2.  **NgRx State Management:** `@ngrx/store` is used for central state management, `@ngrx/effects` for side effects (like `localStorage` interaction), and `@ngrx/router-store` for integrating router state. Actions, reducers, and selectors are properly defined.
3.  **Component Architecture:** The monolithic AngularJS controller is split into `AppComponent`, `TodoHeaderComponent`, `TodoListComponent`, `TodoItemComponent`, and `TodoFooterComponent`, promoting reusability and clear separation of concerns. Component communication uses `@Input()` and `@Output()`.
4.  **Angular Services:** The `todoStorage` AngularJS service is converted to an injectable `TodoStorageService` in Angular, maintaining its functionality.
5.  **HTML Templates:** All AngularJS template syntax (`ng-controller`, `ng-repeat`, `ng-model`, `ng-show`, `ng-class`, `ng-click`, `ng-submit`, `ng-dblclick`, `ng-pluralize`) is replaced with Angular equivalents (`<app-component>`, `*ngFor`, `[(ngModel)]`, `*ngIf`, `[ngClass]`, `(click)`, `(ngSubmit)`, `(dblclick)`, `routerLink`, `routerLinkActive`).
6.  **Angular Directives:** Custom AngularJS directives (`todoFocus`, `todoEscape`) are migrated to Angular directives using `@Directive`, `@Input()`, `@Output()`, `ElementRef`, `Renderer2`, and `@HostListener`.
7.  **Code Optimization:** Angular best practices like `ChangeDetectionStrategy.OnPush` for performance, `trackBy` for `*ngFor`, and proper module/component structuring are applied. Deprecated AngularJS patterns are removed.
8.  **Code Quality:** The code follows Angular style guidelines, uses TypeScript features (interfaces, types, access modifiers), and has no `TODO` comments.

To run this application:

1.  Save the files in the specified paths within your `angular-todomvc` project.
2.  Run `ng serve` in your terminal.
3.  Open your browser to `http://localhost:4200`.

### Tokens: {'input_tokens': 2787, 'output_tokens': 20675, 'reasoning_tokens': 9705}
### Execution time: 78.84664011001587
