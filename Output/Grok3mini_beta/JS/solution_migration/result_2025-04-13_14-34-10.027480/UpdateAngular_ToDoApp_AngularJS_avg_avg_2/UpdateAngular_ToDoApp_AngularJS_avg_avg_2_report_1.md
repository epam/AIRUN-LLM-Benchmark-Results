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
First, the user wants me to migrate an AngularJS app with RequireJS to Angular 14.x. The app is a TodoMVC example. I need to follow specific steps: migrate components, remove RequireJS, use ES modules, implement @ngrx/store for state management, split into components, update services, convert directives, update HTML, and ensure code quality.

Key changes:

- AngularJS (old) to Angular 14.x (modern)

- Remove RequireJS and use ES modules

- Add @ngrx/store and @ngrx/effects for state management

- Break down the monolithic controller into separate Angular components

- Convert services and directives to Angular equivalents

- Update the HTML template to Angular syntax

- Optimize and follow best practices

Start by understanding the current structure:

- index.html has AngularJS directives and is bootstrapped manually.

- RequireJS is used for module loading.

- There's a main controller (TodoController) handling all logic.

- Custom directives: todoFocus and todoEscape

- A service: todoStorage for localStorage persistence

After migration, I need:

- An Angular app with components like AppComponent, TodoListComponent, TodoItemComponent, etc.

- State managed with @ngrx/store: actions for add, remove, edit todos; reducer to handle state; selectors to get data.

- Effects might be needed for side effects, but in this case, persistence is simple localStorage, so perhaps handle it in the service or reducer. Since it's side-effecty, effects could be used.

- Services: Convert todoStorage to an Angular service.

- Directives: Convert todoFocus and todoEscape to Angular directives.

- HTML: Update to use Angular's template syntax, like *ngFor instead of ng-repeat, etc.

Steps to implement:

1. **Set up the Angular project:** Since this is a migration, I'll assume we're starting from scratch in Angular 14. I need to create an Angular project with necessary modules.

2. **Remove RequireJS:** Switch to ES modules. In Angular, we use TypeScript and import modules directly.

3. **Migrate to Angular components:**

   - The main controller has logic for adding, editing, removing todos, filtering, etc.

   - Split into:

     - AppComponent: Maybe the root component.

     - TodoInputComponent: For adding new todos.

     - TodoListComponent: For the list of todos.

     - TodoItemComponent: For each todo item, handling edit, delete, etc.

     - FooterComponent: For the filters and clear completed.

4. **State Management with @ngrx/store:**

   - Define actions: e.g., AddTodo, RemoveTodo, UpdateTodo, CompleteTodo, SetFilter, etc.

   - Define reducer: Handle the todo list state.

   - Define selectors: For getting todos, remaining count, etc.

   - Effects: Perhaps for persistence, but since localStorage is synchronous, it might not be necessary. However, to follow the instruction, I should use effects for side effects like saving to localStorage.

5. **Services:**

   - Convert todoStorage to an Angular service that uses localStorage.

   - Inject it where needed, probably in effects or components.

6. **Directives:**

   - todoFocus: Becomes a directive that focuses an element based on an input.

   - todoEscape: Catches escape key and calls a function.

7. **Update HTML:**

   - Change ng-repeat to *ngFor

   - ng-model to [(ngModel)] or forms

   - ng-click to (click), etc.

   - Use Angular's router for the filter links instead of $location.

   The filters are using hash-based routing with $location. In Angular, I should use Angular Router for that.

   So, add routing to the app.

8. **Code Quality:**

   - Use TypeScript.

   - Follow Angular style guide.

   - No TODOs.

   - Optimize: Use OnPush change detection if possible, but might be overkill for this simple app.

Outline the new structure:

- app.module.ts: Import necessary modules, declare components, provide services.

- Components:

  - app.component.ts: The root component, perhaps containing the todoapp section.

  - todo-input.component.ts: For the input form.

  - todo-list.component.ts: Contains the list and filter logic.

  - todo-item.component.ts: For each todo, with edit mode.

  - footer.component.ts: For the bottom filters and counts.

- State Management:

  - store.module.ts or similar, with StoreModule.forRoot or forFeature.

  - actions/todo.actions.ts

  - reducers/todo.reducer.ts

  - selectors/todo.selectors.ts

  - effects/todo.effects.ts: For handling persistence.

- Services:

  - todo-storage.service.ts: Injectable service for localStorage.

- Directives:

  - todo-focus.directive.ts

  - todo-escape.directive.ts

- Routing: Set up routes for '/', '/active', '/completed' to handle filtering.

In @ngrx/store, the filtering can be handled in selectors based on the current route or a filter state.

I need to manage the filter state as well.

Add a filter state to the store.

Actions for setting filter.

Routing can dispatch actions or the store can be used directly.

To keep it simple, use the router to change the filter, and have a selector that filters based on route params.

But since we're using @ngrx, it's better to have the filter in the store.

Define the state:

- todos: array of todo items

- filter: 'all' | 'active' | 'completed'

Then selectors for filteredTodos, remainingCount, etc.

Effects for loading and saving todos to localStorage.

When the app starts, load from localStorage, and whenever todos change, save to localStorage.

In @ngrx/effects, listen to actions that modify todos and save.

On init, load the initial state.

Reducers handle the state, so initial state can be loaded in the reducer or via an effect.

Common pattern is to have an effect that loads data on app start.

But for simplicity, the service can provide the initial state.

In the reducer, set initial state from localStorage.

But reducers should be pure, so better to handle side effects in effects.

So, perhaps:

- On app init, dispatch a LoadTodos action.

- Effect listens to LoadTodos, gets from storage, dispatches LoadTodosSuccess with the data.

- For save, listen to actions that modify todos, like AddTodo, RemoveTodo, etc., and save to storage.

To avoid saving on every action, perhaps have a single effect that listens to state changes, but @ngrx/effects typically listen to actions.

I can have effects that listen to specific actions and perform side effects.

Define actions: AddTodo, RemoveTodo, UpdateTodo, ToggleTodo, SetFilter, etc.

Then an effect that listens to these actions and saves the todos.

But to save, I need the current state. Effects can inject the store.

Yes, effects can use the store to get the current state.

So, in the effect, on AddTodo, RemoveTodo, etc., get the current todos from store and save.

But that might lead to multiple saves if multiple actions are dispatched.

Have a single action for state changes, but it's fine.

Now, for the components:

- AppComponent: Can hold the router outlet or directly the todoapp.

Since it's a single page, perhaps no need for router outlet; handle filter in the store.

But the original uses hash routing for filters. To migrate properly, I should use Angular Router.

Set up routes:

- Path '' or 'all' -> show all

- 'active' -> show active

- 'completed' -> show completed

Then, when route changes, dispatch SetFilter action.

Or, have the filter derived from the route.

In @ngrx, it's better to have the filter in the state, so when route changes, dispatch SetFilter.

Use a resolver or guard to set the filter.

Simplest is to subscribe to route params in a component and dispatch action.

Perhaps in the TodoListComponent or AppComponent.

Now, for the directives:

- todoFocus: In Angular, create a directive with @Directive, and use HostListener or input to focus.

- todoEscape: Similarly, use HostListener for keydown.

Update the template:

- Use *ngFor instead of ng-repeat

- Use (ngModel) for two-way binding, but better to use forms.

In Angular, for forms, use ReactiveForms or Template-driven.

For simplicity, can use template-driven with ngModel.

But best practice is ReactiveForms for more control.

Since the original uses ngModel, I can stick with it for now.

Now, component communication:

- The state is in the store, so components can select from store and dispatch actions.

- For example, TodoItemComponent can dispatch RemoveTodo, UpdateTodo actions.

- TodoInputComponent dispatches AddTodo.

- The filter is handled by the store, so TodoListComponent uses a selector for filtered todos.

Now, about the custom directives in the template:

In the li, there's todo-focus and todo-escape on the input.

So, in Angular, I'll have similar directives.

Also, ng-cloak is used; in Angular, we can use *ngIf or other ways, but perhaps not necessary.

Now, to implement ES modules: In Angular, we use import/export, so no RequireJS.

All files will be TypeScript files with .ts extension.

I need to provide the complete code, similar to how it was provided.

Finally, ensure no TODOs, follow style guide.

Start sketching the code.

First, set up the Angular module.

app.module.ts:

Import BrowserModule, FormsModule (for ngModel), RouterModule, StoreModule, EffectsModule.

Define routes.

Components: AppComponent, TodoInputComponent, TodoListComponent, TodoItemComponent, FooterComponent.

In the original, the footer has credits, which might not need to be a component, but for splitting, perhaps make a separate component for the todo footer.

But to keep it simple, perhaps AppComponent contains everything, and split the sections.

Define components:

- AppComponent: The root, with the section.todoapp and the info footer.

- Inside todoapp, have child components.

Better to have:

- AppComponent template has <app-todo-app></app-todo-app> and the static info footer.

Then TodoAppComponent has the header, main, and footer sections as child components.

But perhaps overkill. Since the info footer is static, keep it in AppComponent.

Define:

- AppComponent: Contains the todoapp section and the info footer.

- TodoAppComponent: Not necessary; make TodoInputComponent, TodoListComponent, TodoFooterComponent as children of AppComponent or directly.

In the template, the ng-controller is on the todoapp section, so perhaps make a TodoComponent that encapsulates that.

Yes, create a TodoComponent that has the selector 'app-todo', and in its template, have the header, main, footer.

Then split those into subcomponents.

For now:

- TodoComponent: Main component with template similar to the original, but with child components.

- TodoInputComponent: For the form in header.

- TodoListComponent: For the ul.todo-list.

- TodoItemComponent: For each li.

- TodoFooterComponent: For the footer with counts and filters.

Also, directives: TodoFocusDirective, TodoEscapeDirective.

Services: TodoStorageService.

State: Use @ngrx.

First, define the state interface.

In todo.reducer.ts:

interface Todo {

  id: number; // need to add id, original doesn't have id, but for key, better to have.

  Original todos don't have id, they use index. But in Angular, for *ngFor, better to have trackBy with id.

  So, add id to todos.

  When adding todo, assign an id.

  Use a counter or something.

  In the store, handle id generation.

}

interface State {

  todos: Todo[];

  filter: 'all' | 'active' | 'completed';

}

Actions:

- LoadTodos

- LoadTodosSuccess

- AddTodo

- RemoveTodo

- UpdateTodo (for title and completed)

- SetFilter

Reducer handles these.

Selectors: selectAllTodos, selectFilteredTodos, selectRemainingCount, etc.

Effects: TodoEffects, with loadTodos and saveTodos.

For loadTodos: on LoadTodos, get from storage, dispatch LoadTodosSuccess.

But when to dispatch LoadTodos? On app init.

Can dispatch it in APP_INITIALIZER or in a component.

Easier to dispatch in the AppComponent ngOnInit.

For save, effect listens to AddTodo, RemoveTodo, UpdateTodo, and saves the todos.

Now, for the filter, when route changes, dispatch SetFilter.

Set up routing.

In app-routing.module.ts, define routes with path and data for filter.

Or use route params.

Paths: '', 'active', 'completed'.

In a component, subscribe to route and dispatch SetFilter.

Perhaps in TodoComponent or AppComponent.

Now, code the directives first, as they are simple.

TodoFocusDirective:

@Directive({ selector: '[todoFocus]' })

export class TodoFocusDirective {

  @Input() todoFocus: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2, private cdRef: ChangeDetectorRef) {}

  @HostListener('change', ['$event']) // wait, better to watch the input.

  In ngOnChanges, if todoFocus changes to true, focus the element.

  Use setTimeout or requestAnimationFrame to focus after render.

  Similar to the original with $timeout.

code:

ngOnChanges(changes: SimpleChanges) {

  if (changes['todoFocus'] && changes['todoFocus'].currentValue) {

    setTimeout(() => {

      this.el.nativeElement.focus();

    }, 0);

  }

}

TodoEscapeDirective:

@Directive({ selector: '[todoEscape]' })

export class TodoEscapeDirective {

  @Input() todoEscape: () => void; // or string to evaluate, but better function.

  In original, it's attrs.todoEscape, which is an expression to evaluate.

  In Angular, better to bind a function.

  So, in the template, use (todoEscape)="revertEditing(todo)" or something.

  Then in directive:

  @HostListener('keydown', ['$event'])

  onKeydown(event: KeyboardEvent) {

    if (event.key === 'Escape') {

      this.todoEscape(); // assume it's a function

    }

  }

}

In the component, provide the function.

Now, for the service:

@Injectable({ providedIn: 'root' })

export class TodoStorageService {

  private STORAGE_KEY = 'todos-angular';

  getTodos(): Todo[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    return data ? JSON.parse(data) : [];

  }

  setTodos(todos: Todo[]): void {

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));

  }

}

Now, for state management.

First, define Todo interface.

export interface Todo {

  id: number;

  title: string;

  completed: boolean;

}

Actions:

import { createAction, props } from '@ngrx/store';

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());

export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());

export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number, changes: Partial<Todo> }>());

export const setFilter = createAction('[Todo] Set Filter', props<{ filter: 'all' | 'active' | 'completed' }>());

Reducer:

import { createReducer, on, Action } from '@ngrx/store';

import * as TodoActions from './todo.actions';

export interface State {

  todos: Todo[];

  filter: 'all' | 'active' | 'completed';

}

export const initialState: State = {

  todos: [],

  filter: 'all'

};

const _reducer = createReducer(

  initialState,

  on(loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),

  on(addTodo, (state, { title }) => {

    const id = state.todos.length > 0 ? Math.max(...state.todos.map(t => t.id)) + 1 : 1;

    const todo: Todo = { id, title, completed: false };

    return { ...state, todos: [...state.todos, todo] };

  }),

  on(removeTodo, (state, { id }) => ({ ...state, todos: state.todos.filter(t => t.id !== id) })),

  on(updateTodo, (state, { id, changes }) => ({

    ...state,

    todos: state.todos.map(t => t.id === id ? { ...t, ...changes } : t)

  })),

  on(setFilter, (state, { filter }) => ({ ...state, filter }))

);

export function reducer(state: State | undefined, action: Action) {

  return _reducer(state, action);

}

Selectors:

import { createSelector } from '@ngrx/store';

export const selectTodoState = state => state.todo; // assume feature state

In app.module, use StoreModule.forRoot({ todo: reducer }), or better to use feature module.

Create a TodoModule that includes the store, effects, etc.

Yes, better.

So, create todo.module.ts that imports StoreModule.forFeature('todo', reducer), EffectsModule.forFeature([TodoEffects]), and declares the components and directives related to todo.

Then in app.module, import TodoModule and set up routing.

Now, effects:

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { TodoStorageService } from './todo-storage.service';

import * as TodoActions from './todo.actions';

@Injectable()

export class TodoEffects {

  loadTodos$ = createEffect(() =>

    this.actions$.pipe(

      ofType(TodoActions.loadTodos),

      // since load is synchronous, but to handle side effect

      // actually, in effect, we can call the service

      map(() => {

        const todos = this.todoStorage.getTodos();

        return TodoActions.loadTodosSuccess({ todos });

      })

    )

  , { dispatch: true }); // wait, effects usually don't dispatch if no action, but here we dispatch loadTodosSuccess

In this case, since it's synchronous, we can do it in the effect and dispatch the success action.

But typically, effects are for async, but it can be used for sync too.

For save, we need to save after actions.

saveTodos$ = createEffect(() =>

    this.actions$.pipe(

      ofType(TodoActions.addTodo, TodoActions.removeTodo, TodoActions.updateTodo), // add more if needed

      withLatestFrom(this.store.select(selectAllTodos)), // get current todos

      tap(([action, todos]) => this.todoStorage.setTodos(todos))

    )

  , { dispatch: false } // no dispatch, just side effect

);

constructor(

  private actions$: Actions,

  private todoStorage: TodoStorageService,

  private store: Store // need to select todos

) {}

import { withLatestFrom } from 'rxjs/operators';

and import { selectAllTodos } from './todo.selectors';

Define selectAllTodos in selectors.

export const selectAllTodos = createSelector(selectTodoState, state => state.todos);

Now, for the components.

First, AppComponent.

In ngOnInit, dispatch loadTodos.

Set up routing.

app-routing.module.ts:

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', redirectTo: '/all', pathMatch: 'full' },

  { path: 'all', component: TodoComponent }, // but wait, the component doesn't change, only filter.

Since the component is the same, perhaps no need for routing per filter.

Have a single route, and handle filter in the store.

But the links are to different paths.

Have the TodoComponent, and in its ngOnInit or via a service, subscribe to route changes and dispatch setFilter.

Yes.

So, routes can be:

{ path: '', component: TodoComponent }

{ path: 'active', component: TodoComponent }

{ path: 'completed', component: TodoComponent }

Then in TodoComponent, in ngOnInit, subscribe to route params or data, and dispatch setFilter based on the path.

Use the router events.

Inject ActivatedRoute and Router.

In ngOnInit:

this.route.url.subscribe(url => {

  let filter: 'all' | 'active' | 'completed';

  if (url[0].path === 'active') filter = 'active';

  else if (url[0].path === 'completed') filter = 'completed';

  else filter = 'all';

  this.store.dispatch(setFilter({ filter }));

});

url is an array, so check the first segment.

Use this.route.snapshot.url or subscribe to paramMap.

But since the path changes, better to subscribe.

Now, for the TodoComponent template.

Similar to original, but with child components.

<template>

<section class="todoapp">

  <header class="header">

    <h1>todos</h1>

    <app-todo-input></app-todo-input> <!-- or whatever selector -->

  </header>

  <section class="main" *ngIf="todos.length > 0">

    <!-- toggle all, etc. -->

    Better to have a TodoListComponent that handles the list and the toggle.

  </section>

  <footer class="footer" *ngIf="todos.length > 0">

    <app-todo-footer></app-todo-footer>

  </footer>

</section>

<footer class="info">...</footer> <!-- static, can be in AppComponent or here -->

</template>

In the original, the toggle all and the list are in the same section.

Define TodoListComponent that includes the input for toggle all and the ul.

But the toggle all is part of the main section.

Perhaps:

In TodoComponent:

- Header with TodoInput

- Main section with TodoToggle and TodoList

- Footer with TodoFooter

But TodoToggle might not be necessary; can be in TodoList.

To match the template:

Create TodoMainComponent for the <section class="main">, which includes the toggle all and the ul with *ngFor TodoItem.

And TodoFooterComponent.

First, TodoInputComponent: for adding new todo.

Template:

<form (ngSubmit)="addTodo()">

  <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodoTitle" name="newTodo" autofocus>

</form>

In component, newTodoTitle: string;

addTodo() { this.store.dispatch(addTodo({ title: this.newTodoTitle.trim() })); this.newTodoTitle = ''; }

But need to handle the submit.

Also, autofocus can be handled with a directive or attribute.

Now, for TodoItemComponent: represents each todo.

Template:

<li [class.completed]="todo.completed" [class.editing]="isEditing">

  <div class="view">

    <input class="toggle" type="checkbox" (change)="toggleCompleted()" [checked]="todo.completed">

    <label (dblclick)="startEditing()">{{todo.title}}</label>

    <button class="destroy" (click)="removeTodo()"></button>

  </div>

  <input class="edit" *ngIf="isEditing" [(ngModel)]="todo.title" (blur)="doneEditing()" (keydown.escape)="revertEditing()" todoEscape="revertEditing()" todoFocus="isEditing">

</li>

In the original, the form is there with ng-submit.

Also, todo-escape and todo-focus.

In Angular, I can use the directives.

In component, need isEditing, and methods.

But since state is in store, the editing state should be in the store or handled locally.

In original, editedTodo is in the scope.

In @ngrx, better to have it in the state.

Add to state: editedTodoId: number | null;

Then actions: StartEdit, DoneEdit, RevertEdit.

Then in reducer, handle setting editedTodoId.

Selectors for isEditing a todo.

But might be overkill for this app.

Handle editing locally in the component.

But then, when editing, the title change should be reflected.

In original, when editing, ng-model is bound, and on blur or enter, save.

In Angular, can do similar.

For simplicity, handle the editing state in the TodoItemComponent.

Have a local isEditing flag, and when startEditing, set it, focus, etc.

On doneEditing, dispatch updateTodo with new title.

Similarly for revert.

But the todo object is in the store, so when updating title locally, need to bind it.

Use a local copy or something.

In TodoItemComponent, have an input for the todo, and when editing, have a local editTitle.

Code:

@Component({

  selector: 'app-todo-item',

  template: `...`

})

export class TodoItemComponent {

  @Input() todo: Todo;

  isEditing = false;

  editTitle: string;

  constructor(private store: Store) {}

  startEditing() {

    this.isEditing = true;

    this.editTitle = this.todo.title;

    // focus will be handled by directive

  }

  doneEditing() {

    const title = this.editTitle.trim();

    if (title) {

      this.store.dispatch(updateTodo({ id: this.todo.id, changes: { title } }));

    } else {

      this.store.dispatch(removeTodo({ id: this.todo.id }));

    }

    this.isEditing = false;

  }

  revertEditing() {

    this.isEditing = false; // and title is not changed

  }

  toggleCompleted() {

    this.store.dispatch(updateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));

  }

  removeTodo() {

    this.store.dispatch(removeTodo({ id: this.todo.id }));

  }

}

In template, for the input: <input class="edit" *ngIf="isEditing" [(ngModel)]="editTitle" (blur)="doneEditing()" todoEscape="revertEditing()" todoFocus="isEditing">

todoFocus should be bound to isEditing.

And todoEscape calls revertEditing.

Now, for the list, in TodoListComponent:

Template:

<section class="main" *ngIf="(todos$ | async)?.length > 0">

  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted" (change)="toggleAll()">

  <label for="toggle-all">Mark all as complete</label>

  <ul class="todo-list">

    <app-todo-item *ngFor="let todo of filteredTodos$ | async" [todo]="todo"></app-todo-item>

  </ul>

</section>

In component, select filteredTodos and allCompleted from store.

import { Observable } from 'rxjs';

filteredTodos$: Observable<Todo[]>;

allCompleted: boolean; // or observable

Better to use async pipe.

For allCompleted, it's when all are completed, but in original, it's bound to allChecked which is inverse of remainingCount.

In selector, have selectAllCompleted.

Define selectors.

In todo.selectors.ts:

export const selectFilter = createSelector(selectTodoState, state => state.filter);

export const selectFilteredTodos = createSelector(

  selectTodoState,

  state => {

    if (state.filter === 'active') {

      return state.todos.filter(t => !t.completed);

    } else if (state.filter === 'completed') {

      return state.todos.filter(t => t.completed);

    } else {

      return state.todos;

    }

  }

);

export const selectRemainingCount = createSelector(selectTodoState, state => state.todos.filter(t => !t.completed).length);

export const selectDoneCount = createSelector(selectTodoState, state => state.todos.filter(t => t.completed).length);

export const selectAllCompleted = createSelector(selectRemainingCount, count => count === 0 && state.todos.length > 0); // need full state or combine

Better: export const selectAllCompleted = createSelector(selectTodoState, state => state.todos.every(t => t.completed));

In TodoListComponent:

filteredTodos$ = this.store.select(selectFilteredTodos);

For toggle all, need a method.

toggleAll() {

  const allCompleted = // get from store, but better to select

  Actually, dispatch an action to set all completed or not.

  In original, markAll(done), where done is the checked state.

  In the checkbox, ng-model="allChecked" which is set when no remaining.

  But in change, call markAll with the checked value.

  So, in Angular, <input type="checkbox" [checked]="allCompleted$ | async" (change)="onToggleAll($event.target.checked)">

  Then onToggleAll(checked: boolean) { this.store.dispatch(markAll({ done: checked })); }

  Add action: markAll = createAction('[Todo] Mark All', props<{ done: boolean }>());

  In reducer: on(markAll, (state, { done }) => ({ ...state, todos: state.todos.map(t => ({ ...t, completed: done })) }))

Now, for the footer.

TodoFooterComponent:

Template:

<footer class="footer">

  <span class="todo-count">

    <strong>{{ remainingCount$ | async }}</strong>

    <ng-container [ngPlural]="remainingCount$ | async">

      <ng-template ngPluralCase="one">item left</ng-template>

      <ng-template ngPluralCase="other">items left</ng-template>

    </ng-container>

  </span>

  <ul class="filters">

    <li><a [class.selected]="filter === 'all'" [routerLink]="['/']">All</a></li>

    <li><a [class.selected]="filter === 'active'" [routerLink]="['/active']">Active</a></li>

    <li><a [class.selected]="filter === 'completed'" [routerLink]="['/completed']">Completed</a></li>

  </ul>

  <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>

</footer>

In component, remainingCount$ = this.store.select(selectRemainingCount);

doneCount$ = this.store.select(selectDoneCount);

filter$ = this.store.select(selectFilter); // but need the value for [class.selected]

Can use async pipe in the template, but for multiple uses, better to subscribe or use a variable.

For simplicity, use async pipe.

For [class.selected], can do [class.selected]="(filter$ | async) === 'all'"

Similarly for others.

And clearCompleted: dispatch clearDoneTodos action.

Add action: clearCompleted = createAction('[Todo] Clear Completed');

Reducer: on(clearCompleted, state => ({ ...state, todos: state.todos.filter(t => !t.completed) }))

Now, for the TodoInputComponent, as above.

In AppComponent, template:

<router-outlet></router-outlet>

In the routes, the TodoComponent is the one with the content.

In app.component.html:

<section class="todoapp">

  <app-todo-header></app-todo-header> <!-- or directly the components -->

Better to have the TodoComponent as the routed component.

Define AppComponent with <router-outlet>, and routes to TodoComponent for different paths, but since the component is the same, it's fine.

In TodoComponent, have the full template with child components.

Don't forget to dispatch loadTodos in AppComponent or TodoComponent.

In TodoComponent ngOnInit, dispatch loadTodos, and set up the route subscription.

Code for TodoComponent:

import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { ActivatedRoute, Router } from '@angular/router';

import * as TodoActions from '../store/todo.actions';

@Component({

  selector: 'app-todo',

  templateUrl: './todo.component.html',

})

export class TodoComponent implements OnInit {

  constructor(

    private store: Store,

    private route: ActivatedRoute,

    private router: Router // might not need

  ) {}

  ngOnInit() {

    this.store.dispatch(TodoActions.loadTodos());

    this.route.url.subscribe(urlSegments => {

      let filter: 'all' | 'active' | 'completed' = 'all';

      if (urlSegments.length > 0) {

        const path = urlSegments[0].path;

        if (path === 'active') filter = 'active';

        else if (path === 'completed') filter = 'completed';

        // else if path === '' or 'all', filter = 'all'

      }

      this.store.dispatch(TodoActions.setFilter({ filter }));

    });

  }

}

Template for TodoComponent:

<header class="header">

  <h1>todos</h1>

  <app-todo-input></app-todo-input>

</header>

<section class="main" *ngIf="(todoCount$ | async) > 0">

  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (change)="onToggleAll($event.target.checked)">

  <label for="toggle-all">Mark all as complete</label>

  <ul class="todo-list">

    <app-todo-item *ngFor="let todo of filteredTodos$ | async" [todo]="todo"></app-todo-item>

  </ul>

</section>

<footer class="footer" *ngIf="(todoCount$ | async) > 0">

  <span class="todo-count">

    <strong>{{ remainingCount$ | async }}</strong>

    <ng-container [ngPlural]="remainingCount$ | async">

      <ng-template ngPluralCase="one">item left</ng-template>

      <ng-template ngPluralCase="other">items left</ng-template>

    </ng-container>

  </span>

  <ul class="filters">

    <li><a [class.selected]="(filter$ | async) === 'all'" [routerLink]="['/']">All</a></li>

    <li><a [class.selected]="(filter$ | async) === 'active'" [routerLink]="['/active']">Active</a></li>

    <li><a [class.selected]="(filter$ | async) === 'completed'" [routerLink]="['/completed']">Completed</a></li>

  </ul>

  <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>

</footer>

I am considering moving the footer content to a separate component if needed, but for now, it's fine.

In the code above, I have the logic in TodoComponent, but I can extract TodoList and TodoFooter if desired.

For simplicity, keep it in one component, but the task says to split into separate components.

So, better to have TodoListComponent and TodoFooterComponent.

Define TodoListComponent:

template:

<input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (change)="toggleAll($event.target.checked)">

<label for="toggle-all">Mark all as complete</label>

<ul class="todo-list">

  <app-todo-item *ngFor="let todo of todos$ | async" [todo]="todo"></app-todo-item>

</ul>

In component, todos$ = this.store.select(selectFilteredTodos); // since filter is set, use filtered

allCompleted$ = this.store.select(selectAllCompleted);

toggleAll(checked: boolean) { this.store.dispatch(markAll({ done: checked })); }

Then in TodoComponent template:

<header class="header">...</header>

<section class="main" *ngIf="(remainingCount$ | async) > 0 || something, but original uses todos.length, but with filter, might be tricky.

Original ng-show="todos.length", but todos is all, not filtered.

In the main section, it's shown if there are todos, regardless of filter.

In original: ng-show="todos.length"

And inside, the list is filtered.

In Angular, with store, select total todos count.

Add selector selectTodoCount = createSelector(selectTodoState, state => state.todos.length);

Then in TodoComponent:

<app-todo-list *ngIf="todoCount$ | async as todoCount" [todoCount]="todoCount"></app-todo-list> no, better to pass the observables or handle in child.

Since the *ngIf is on the section, and TodoListComponent can handle its own visibility, but the input and toggle are part of it.

Make TodoListComponent have the whole <section class="main">, and in its template, use *ngIf with the count.

But the count is in store.

In TodoListComponent, inject store, and use async pipe.

Code TodoListComponent:

template:

<section class="main" *ngIf="todoCount$ | async as todoCount; else noTodos">

  <input id="toggle-all" ... [checked]="allCompleted$ | async" (change)="toggleAll($event.target.checked)">

  <label for="toggle-all">Mark all as complete</label>

  <ul class="todo-list">

    <app-todo-item *ngFor="let todo of filteredTodos$ | async" [todo]="todo"></app-todo-item>

  </ul>

</section>

<ng-template #noTodos></ng-template> // or nothing

todoCount$ = this.store.select(selectTodoCount); // but the *ngIf should be based on total todos, not filtered.

Yes.

filteredTodos$ for the list.

allCompleted$ for the checkbox.

Now for TodoFooterComponent, similar to above.

In TodoComponent, just compose them.

template:

<app-todo-input></app-todo-input> wait no, the input is in header.

In TodoComponent template:

<header class="header">

  <h1>todos</h1>

  <app-todo-input></app-todo-input>

</header>

<app-todo-list></app-todo-list>

<app-todo-footer></app-todo-footer>

And in CSS or something, handle the ng-cloak equivalent, but in Angular, with *ngIf, it should be fine.

Now, for the directives, as defined earlier.

In the TodoItem template, the edit input has todo-escape and todo-focus.

In Angular, selector should match, e.g., [todoEscape] and [todoFocus].

In the directive code, as above.

Also, in the input, ng-trim="false", so in Angular, when using ngModel, it trims by default? No, ngModel doesn't trim, but we can handle it in the doneEditing.

In original, ng-trim="false" on the input, so don't trim on model update, but trim when saving.

In Angular, with [(ngModel)], it binds directly, so perhaps use (ngModelChange) or a form control.

To mimic, in the directive or in the component, don't trim until save.

In TodoItemComponent, when binding, use [ngModel] and (ngModelChange), but it's two-way.

Use a template reference variable or something.

Simplest is to use [(ngModel)] and in doneEditing, trim the editTitle.

In the code above, I have editTitle, and in doneEditing, trim it.

And in the input, [(ngModel)]="editTitle", with ng-trim="false" not directly available, but since it's a string, it doesn't trim automatically, so it should be fine.

ngModel in Angular doesn't add trim, so it should work similarly.

Now, for the autofocus, the todoFocus directive will handle it when isEditing is true.

In original, there's todo-escape="revertEditing(todo)", but in Angular, since it's a method in the component, and the directive is on the same element, it should work with todoEscape="revertEditing()"

In the directive, @Input() todoEscape: () => void;

Then call it.

Similarly for todoFocus.

Now, about the index in ng-repeat: original has track by $index, but in Angular, with *ngFor, we can use trackBy function.

Since we have id now, use trackBy todo.id.

In TodoListComponent, in *ngFor, add trackBy: trackById

And define trackById(index, todo) { return todo.id; }

Good.

Finally, in app.module.ts, set up everything.

Import necessary modules: BrowserModule, FormsModule, RouterModule.forRoot(routes), StoreModule.forRoot({ todo: todoReducer }), EffectsModule.forRoot([TodoEffects]), and TodoModule or declare components.

Better to have a TodoModule that encapsulates the todo features.

Create todo.module.ts:

@NgModule({

  imports: [

    CommonModule,

    FormsModule, // for ngModel

    StoreModule.forFeature('todo', todoReducer),

    EffectsModule.forFeature([TodoEffects]),

  ],

  declarations: [

    TodoComponent,

    TodoInputComponent,

    TodoListComponent,

    TodoItemComponent,

    TodoFooterComponent,

    TodoFocusDirective,

    TodoEscapeDirective

  ],

  exports: [TodoComponent] // if needed, but probably not

})

export class TodoModule {}

Then in app.module.ts:

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms'; // might be imported in TodoModule

import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';

import { TodoComponent } from './todo/todo.component';

import { TodoModule } from './todo/todo.module';

import { TodoEffects } from './store/todo.effects';

const routes: Routes = [

  { path: '', component: TodoComponent },

  { path: 'active', component: TodoComponent },

  { path: 'completed', component: TodoComponent }

];

@NgModule({

  declarations: [

    AppComponent

  ],

  imports: [

    BrowserModule,

    FormsModule, // if not in TodoModule, but better to import in feature modules

    RouterModule.forRoot(routes),

    TodoModule,

    StoreModule.forRoot({}), // or if no other reducers

    EffectsModule.forRoot([]), // or forRoot if global effects

  ],

  providers: [],

  bootstrap: [AppComponent]

})

export class AppModule { }

In AppComponent, template should have <router-outlet></router-outlet>, and perhaps the static footer.

In the original index.html, there's a footer with credits outside the todoapp.

So, in AppComponent template:

<router-outlet></router-outlet>

<footer class="info">

  <p>Double-click to edit a todo</p>

  <p>Credits: ...</p>

  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>

</footer>

And in the head, the CSS links, but in Angular, we can add them in angular.json or styles.css.

For the migration, assume we handle the assets.

Now, for the store, in StoreModule.forRoot, if only todo reducer, use forRoot({ todo: todoReducer }), but since it's a feature, better to use forFeature in TodoModule.

In TodoModule, I have StoreModule.forFeature('todo', todoReducer), so in app.module, StoreModule.forRoot({}), or if there are other reducers.

Similarly for effects.

Also, need to handle the initial filter; when route changes, we set it.

In the reducer, initial filter is 'all', and redirect if necessary, but in original, it redirects to '/' if empty.

In Angular router, we have { path: '', redirectTo: '/all', pathMatch: 'full' }, but I set path: '' to component, better to redirect.

In routes, set:

const routes: Routes = [

  { path: '', redirectTo: 'all', pathMatch: 'full' },

  { path: 'all', component: TodoComponent },

  { path: 'active', component: TodoComponent },

  { path: 'completed', component: TodoComponent }

];

In the link, use [routerLink]="['/all']", etc., but in the path, it's 'all', not '', but in original, it's href="#/" for all.

In routerLink, for path 'all', use ['/all'], and for active ['/active'], etc.

In the class selected, based on current filter.

To make the link reflect the current route, Angular router will handle the active state, but here we use [class.selected] based on store filter, which should match the route.

Now, about the CSS: in original, there are links to CSS files. In Angular, we can add them in index.html or import in styles.

For the code, I'll assume it's handled.

Finally, ensure all is in TypeScript.

For the directives, in TodoEscapeDirective, in original, it unbinds on $destroy, in Angular, we can use ngOnDestroy to remove event listeners, but with HostListener, it's handled by Angular.

In TodoEscapeDirective, I used HostListener, so no need to unbind.

Similarly for others.

Now, I think that's mostly it.

To provide the code, I need to write all the files.

Since it's a lot, I'll outline the files and code.

First, index.html: similar, but remove the script tags for RequireJS and AngularJS, and add the Angular app.

In Angular, the index.html will have the app root, and Angular handles the rest.

So, updated index.html:

<!doctype html>

<html lang="en">

<head>

  <meta charset="utf-8">

  <title>Angular TodoMVC</title>

  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">

  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">

</head>

<body>

  <app-root></app-root>

  <script src="runtime.js"></script> <!-- assuming Angular build -->

  <script src="polyfills.js"></script>

  <script src="main.js"></script> <!-- or whatever the build outputs -->

</body>

</html>

But since this is code, perhaps not needed.

Now, for the Angular code.

I'll write the key files.

First, app.module.ts

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';

import { TodoModule } from './todo/todo.module';

const routes: Routes = [

  { path: '', redirectTo: 'all', pathMatch: 'full' },

  { path: 'all', component: TodoComponent }, // need to import TodoComponent or handle in TodoModule

Since TodoComponent is declared in TodoModule, and routes might need to be in a routing module.

Better to have a AppRoutingModule.

Create app-routing.module.ts:

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { TodoComponent } from './todo/todo.component';

const routes: Routes = [

  { path: '', redirectTo: 'all', pathMatch: 'full' },

  { path: 'all', component: TodoComponent },

  { path: 'active', component: TodoComponent },

  { path: 'completed', component: TodoComponent }

];

@NgModule({

  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]

})

export class AppRoutingModule { }

Then in app.module.ts:

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { TodoModule } from './todo/todo.module';

import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

import { todoReducer } from './store/todo.reducer'; // assume path

import { TodoEffects } from './store/todo.effects';

@NgModule({

  declarations: [

    AppComponent

  ],

  imports: [

    BrowserModule,

    AppRoutingModule,

    TodoModule,

    StoreModule.forRoot({ todo: todoReducer }), // or use forFeature if in TodoModule

I have StoreModule.forFeature in TodoModule, so in app.module, StoreModule.forRoot({}), and EffectsModule.forRoot([])

But if todo is a feature, better to have it in TodoModule with forFeature.

In TodoModule, I can import StoreModule.forFeature('todo', todoReducer), but then in app.module, need to import StoreModule.forRoot with some reducer, even if empty.

StoreModule.forRoot({}) is fine.

Similarly for effects.

Code:

import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

// ...

imports: [

  BrowserModule,

  AppRoutingModule,

  TodoModule,

  StoreModule.forRoot({}),

  EffectsModule.forRoot([]),

],

If there are global effects or reducers, but here none.

Now, in TodoModule:

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

import { todoReducer } from '../store/todo.reducer';

import { TodoEffects } from '../store/todo.effects';

import { TodoComponent } from './todo.component';

import { TodoInputComponent } from './todo-input.component';

import { TodoListComponent } from './todo-list.component';

import { TodoItemComponent } from './todo-item.component';

import { TodoFooterComponent } from './todo-footer.component';

import { TodoFocusDirective } from '../directives/todo-focus.directive';

import { TodoEscapeDirective } from '../directives/todo-escape.directive';

@NgModule({

  imports: [

    CommonModule,

    FormsModule,

    StoreModule.forFeature('todo', todoReducer),

    EffectsModule.forFeature([TodoEffects]),

  ],

  declarations: [

    TodoComponent,

    TodoInputComponent,

    TodoListComponent,

    TodoItemComponent,

    TodoFooterComponent,

    TodoFocusDirective,

    TodoEscapeDirective

  ]

})

export class TodoModule { }

I am considering the store and directives might be in different folders.

Assume a structure: src/app/store for actions, reducer, effects, selectors.

src/app/todo for components.

src/app/directives for directives.

And TodoStorageService can be in src/app/services.

In TodoModule, import the service if needed, but since it's injected in effects, and provided in root, it's fine.

TodoStorageService should be provided, @Injectable({ providedIn: 'root' }), so no need to provide in module.

Now, write the code for each.

First, interfaces and store files.

Create todo.model.ts:

export interface Todo {

  id: number;

  title: string;

  completed: boolean;

}

Then todo.actions.ts:

import { createAction, props } from '@ngrx/store';

import { Todo } from '../todo.model'; // adjust path

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());

export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());

export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number, changes: Partial<Todo> }>());

export const markAll = createAction('[Todo] Mark All', props<{ done: boolean }>());

export const clearCompleted = createAction('[Todo] Clear Completed');

export const setFilter = createAction('[Todo] Set Filter', props<{ filter: 'all' | 'active' | 'completed' }>());

Then todo.reducer.ts:

import { createReducer, on } from '@ngrx/store';

import { Todo } from '../todo.model';

import * as TodoActions from './todo.actions';

export interface State {

  todos: Todo[];

  filter: 'all' | 'active' | 'completed';

}

export const initialState: State = {

  todos: [],

  filter: 'all'

};

export const todoReducer = createReducer(

  initialState,

  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),

  on(TodoActions.addTodo, (state, { title }) => {

    const id = state.todos.length > 0 ? Math.max(...state.todos.map(t => t.id)) + 1 : 1;

    const todo: Todo = { id, title, completed: false };

    return { ...state, todos: [...state.todos, todo] };

  }),

  on(TodoActions.removeTodo, (state, { id }) => ({ ...state, todos: state.todos.filter(t => t.id !== id) })),

  on(TodoActions.updateTodo, (state, { id, changes }) => ({

    ...state,

    todos: state.todos.map(todo => todo.id === id ? { ...todo, ...changes } : todo)

  })),

  on(TodoActions.markAll, (state, { done }) => ({

    ...state,

    todos: state.todos.map(todo => ({ ...todo, completed: done }))

  })),

  on(TodoActions.clearCompleted, state => ({

    ...state,

    todos: state.todos.filter(todo => !todo.completed)

  })),

  on(TodoActions.setFilter, (state, { filter }) => ({ ...state, filter }))

);

todo.selectors.ts:

import { createSelector } from '@ngrx/store';

import { State } from './todo.reducer';

export const selectTodoState = (state: any) => state.todo; // assuming feature key 'todo'

export const selectTodos = createSelector(selectTodoState, state => state.todos);

export const selectFilter = createSelector(selectTodoState, state => state.filter);

export const selectFilteredTodos = createSelector(

  selectTodos,

  selectFilter,

  (todos, filter) => {

    if (filter === 'active') {

      return todos.filter((todo: Todo) => !todo.completed);

    } else if (filter === 'completed') {

      return todos.filter((todo: Todo) => todo.completed);

    } else {

      return todos;

    }

  }

);

export const selectTodoCount = createSelector(selectTodos, todos => todos.length);

export const selectRemainingCount = createSelector(selectTodos, todos => todos.filter(t => !t.completed).length);

export const selectDoneCount = createSelector(selectTodos, todos => todos.filter(t => t.completed).length);

export const selectAllCompleted = createSelector(selectTodos, todos => todos.every(t => t.completed));

todo.effects.ts:

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap, withLatestFrom, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { TodoStorageService } from '../services/todo-storage.service';

import * as TodoActions from './todo.actions';

import { selectTodos } from './todo.selectors';

@Injectable()

export class TodoEffects {

  loadTodos$ = createEffect(() =>

    this.actions$.pipe(

      ofType(TodoActions.loadTodos),

      map(() => {

        const todos = this.todoStorage.getTodos();

        return TodoActions.loadTodosSuccess({ todos });

      })

    )

  );

  saveTodos$ = createEffect(() =>

    this.actions$.pipe(

      ofType(TodoActions.addTodo, TodoActions.removeTodo, TodoActions.updateTodo, TodoActions.markAll, TodoActions.clearCompleted),

      withLatestFrom(this.store.select(selectTodos)),

      tap(([action, todos]) => this.todoStorage.setTodos(todos))

    ),

    { dispatch: false }

  );

  constructor(

    private actions$: Actions,

    private todoStorage: TodoStorageService,

    private store: Store

  ) {}

}

Now, services/todo-storage.service.ts:

import { Injectable } from '@angular/core';

import { Todo } from '../todo.model';

@Injectable({

  providedIn: 'root'

})

export class TodoStorageService {

  private STORAGE_KEY = 'todos-angular';

  getTodos(): Todo[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    return data ? JSON.parse(data) : [];

  }

  setTodos(todos: Todo[]): void {

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));

  }

}

Now, directives.

directives/todo-focus.directive.ts:

import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({

  selector: '[todoFocus]'

})

export class TodoFocusDirective implements OnChanges {

  @Input() todoFocus: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {

    if (changes['todoFocus'] && changes['todoFocus'].currentValue) {

      setTimeout(() => {

        this.el.nativeElement.focus();

      }, 0);

    }

  }

}

directives/todo-escape.directive.ts:

import { Directive, Input, HostListener } from '@angular/core';

@Directive({

  selector: '[todoEscape]'

})

export class TodoEscapeDirective {

  @Input() todoEscape: () => void; // expect a function

  @HostListener('keydown', ['$event'])

  onKeydown(event: KeyboardEvent) {

    if (event.key === 'Escape') {

      if (this.todoEscape) {

        this.todoEscape();

      }

    }

  }

}

Now, components.

todo/todo.component.ts:

import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';

import * as TodoActions from '../store/todo.actions';

@Component({

  selector: 'app-todo',

  templateUrl: './todo.component.html'

})

export class TodoComponent implements OnInit {

  constructor(

    private store: Store,

    private route: ActivatedRoute

  ) {}

  ngOnInit() {

    this.store.dispatch(TodoActions.loadTodos());

    this.route.url.subscribe(urlSegments => {

      let filter: 'all' | 'active' | 'completed' = 'all';

      if (urlSegments.length > 0) {

        const path = urlSegments[0].path;

        if (path === 'active') filter = 'active';

        else if (path === 'completed') filter = 'completed';

        else if (path !== 'all') filter = 'all'; // default

      }

      this.store.dispatch(TodoActions.setFilter({ filter }));

    });

  }

}

templateUrl: './todo.component.html'

In html:

<header class="header">

  <h1>todos</h1>

  <app-todo-input></app-todo-input>

</header>

<app-todo-list></app-todo-list>

<app-todo-footer></app-todo-footer>

todo/todo-input.component.ts:

import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import * as TodoActions from '../store/todo.actions';

@Component({

  selector: 'app-todo-input',

  template: `

    <form (ngSubmit)="addTodo()">

      <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>

    </form>

  `

})

export class TodoInputComponent {

  newTodo = '';

  constructor(private store: Store) {}

  addTodo() {

    const title = this.newTodo.trim();

    if (title) {

      this.store.dispatch(TodoActions.addTodo({ title }));

      this.newTodo = '';

    }

  }

}

In the form, ngSubmit will call addTodo even if empty, but in code, check trim.

autofocus might not work well, but it's fine.

todo/todo-list.component.ts:

import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { Todo } from '../todo.model';

import * as TodoActions from '../store/todo.actions';

import { selectFilteredTodos, selectAllCompleted, selectTodoCount } from '../store/todo.selectors';

@Component({

  selector: 'app-todo-list',

  template: `

    <section class="main" *ngIf="todoCount$ | async as todoCount; else noTodos">

      <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (change)="toggleAll($event.target.checked)">

      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">

        <app-todo-item *ngFor="let todo of filteredTodos$ | async; trackBy: trackById" [todo]="todo"></app-todo-item>

      </ul>

    </section>

    <ng-template #noTodos></ng-template>

  `

})

export class TodoListComponent {

  filteredTodos$: Observable<Todo[]>;

  allCompleted$: Observable<boolean>;

  todoCount$: Observable<number>;

  constructor(private store: Store) {

    this.filteredTodos$ = this.store.select(selectFilteredTodos);

    this.allCompleted$ = this.store.select(selectAllCompleted);

    this.todoCount$ = this.store.select(selectTodoCount);

  }

  toggleAll(checked: boolean) {

    this.store.dispatch(TodoActions.markAll({ done: checked }));

  }

  trackById(index: number, todo: Todo) {

    return todo.id;

  }

}

todo/todo-item.component.ts:

import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as TodoActions from '../store/todo.actions';

import { Todo } from '../todo.model';

@Component({

  selector: 'app-todo-item',

  template: `

    <li [class.completed]="todo.completed" [class.editing]="isEditing">

      <div class="view">

        <input class="toggle" type="checkbox" (change)="toggleCompleted()" [checked]="todo.completed">

        <label (dblclick)="startEditing()">{{todo.title}}</label>

        <button class="destroy" (click)="removeTodo()"></button>

      </div>

      <input *ngIf="isEditing" class="edit" [(ngModel)]="editTitle" (blur)="doneEditing()" todoFocus="isEditing" todoEscape="revertEditing()">

    </li>

  `

})

export class TodoItemComponent {

  @Input() todo: Todo;

  isEditing = false;

  editTitle: string;

  constructor(private store: Store) {}

  startEditing() {

    this.isEditing = true;

    this.editTitle = this.todo.title;

  }

  doneEditing() {

    const title = this.editTitle.trim();

    if (title) {

      this.store.dispatch(TodoActions.updateTodo({ id: this.todo.id, changes: { title } }));

    } else {

      this.store.dispatch(TodoActions.removeTodo({ id: this.todo.id }));

    }

    this.isEditing = false;

  }

  revertEditing() {

    this.isEditing = false;

    // title is not changed, as it's local

  }

  toggleCompleted() {

    this.store.dispatch(TodoActions.updateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));

  }

  removeTodo() {

    this.store.dispatch(TodoActions.removeTodo({ id: this.todo.id }));

  }

}

In the template, the input should have a form or handle enter key for submit, but in original, there's a form with ng-submit="doneEditing(todo)".

In Angular, I can add a form.

Modify template:

<div *ngIf="isEditing" class="edit-form">

  <form (ngSubmit)="doneEditing()">

    <input class="edit" [(ngModel)]="editTitle" name="editTitle" (blur)="doneEditing()" todoFocus="isEditing" todoEscape="revertEditing()">

  </form>

</div>

And in doneEditing, same as above.

To handle enter key, ngSubmit will trigger on enter.

Also, blur will also call doneEditing, might be called twice, but in practice, it should be fine, or remove (blur) if ngSubmit handles it.

In original, ng-submit on the form, and ng-blur on input.

In Angular, can keep both, but might redundant.

For now, keep (blur) and ngSubmit.

Now, todo-footer.component.ts:

import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as TodoActions from '../store/todo.actions';

import { selectRemainingCount, selectDoneCount, selectFilter } from '../store/todo.selectors';

@Component({

  selector: 'app-todo-footer',

  template: `

    <footer class="footer">

      <span class="todo-count">

        <strong>{{ remainingCount$ | async }}</strong>

        <ng-container [ngPlural]="remainingCount$ | async">

          <ng-template ngPluralCase="one">item left</ng-template>

          <ng-template ngPluralCase="other">items left</ng-template>

        </ng-container>

      </span>

      <ul class="filters">

        <li><a [class.selected]="(filter$ | async) === 'all'" [routerLink]="['/all']">All</a></li>

        <li><a [class.selected]="(filter$ | async) === 'active'" [routerLink]="['/active']">Active</a></li>

        <li><a [class.selected]="(filter$ | async) === 'completed'" [routerLink]="['/completed']">Completed</a></li>

      </ul>

      <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>

    </footer>

  `

})

export class TodoFooterComponent {

  remainingCount$: Observable<number>;

  doneCount$: Observable<number>;

  filter$: Observable<'all' | 'active' | 'completed'>;

  constructor(private store: Store) {

    this.remainingCount$ = this.store.select(selectRemainingCount);

    this.doneCount$ = this.store.select(selectDoneCount);

    this.filter$ = this.store.select(selectFilter);

  }

  clearCompleted() {

    this.store.dispatch(TodoActions.clearCompleted());

  }

}

Finally, app.component.ts:

import { Component } from '@angular/core';

@Component({

  selector: 'app-root',

  template: `

    <router-outlet></router-outlet>

    <footer class="info">

      <p>Double-click to edit a todo</p>

      <p>Credits: <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>, <a href="http://ericbidelman.com">Eric Bidelman</a>, <a href="http://jacobmumm.com">Jacob Mumm</a>, <a href="http://blog.igorminar.com">Igor Minar</a> and <a href="http://twitter.com/passy">Pascal Hartig</a></p>

      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>

    </footer>

  `

})

export class AppComponent {}

And in index.html, as minimal as possible, with the styles.

This should cover the migration.

For code quality, used TypeScript, followed Angular style, no TODOs.

Performance: using OnPush change detection could be an option, but not necessary for this simple app.

In the store, the id generation is simple, might have issues if removing items, but for this app, it's fine.

### Answer:
Below is the complete migration of the provided AngularJS application (using RequireJS) to Angular 14.x. I have followed all the steps outlined in your query:

1. **Migrated AngularJS components, directives, and services to Angular 14.x syntax**: Converted the monolithic `TodoController` into separate Angular components, updated directives to use Angular's directive API, and transformed services to use Angular's dependency injection.
2. **Removed RequireJS and implemented ES modules**: Switched to ES modules with TypeScript imports/exports, eliminating the need for RequireJS configuration.
3. **Implemented proper Angular module structure**: Created a feature module (`TodoModule`) for better organization and used Angular's core modules (e.g., `CommonModule`, `FormsModule`).
4. **Implemented state management with @ngrx/store and @ngrx/effects**: Added actions, reducers, selectors, and effects. Used `@ngrx/store` for managing the todo list and filter state, and `@ngrx/effects` for handling side effects like loading and saving data to localStorage.
5. **Split monolithic controller into separate components**: Created dedicated components for logical UI sections (e.g., `TodoInputComponent`, `TodoListComponent`, `TodoItemComponent`, `TodoFooterComponent`) and implemented communication using inputs/outputs and the store.
6. **Converted AngularJS services to injectable Angular services**: Transformed `todoStorage` into an Angular service with dependency injection, maintaining the same functionality.
7. **Updated HTML templates**: Converted AngularJS template syntax (e.g., `ng-repeat` to `*ngFor`, `ng-click` to `(click)`) and implemented proper event and property binding. Also integrated Angular Router for handling filter states.
8. **Converted custom AngularJS directives to Angular directives**: Updated `todoFocus` and `todoEscape` to use Angular's `@Directive`, lifecycle hooks, and event binding.
9. **Optimized the codebase**: Applied Angular best practices (e.g., using async pipe for observables, trackBy for *ngFor, and immutable state updates). Removed deprecated patterns, ensured no TODOs, and followed the Angular style guide. Used TypeScript features like interfaces and type safety.

### Key Changes and Rationale:
- **State Management**: Used `@ngrx/store` to manage the todo list and filter state. Added an `id` field to the `Todo` interface for better tracking in `*ngFor`. Effects handle persistence to avoid impure reducer functions.
- **Routing**: Implemented Angular Router to handle filter changes (e.g., `/all`, `/active`, `/completed`), dispatching actions to update the store.
- **Component Architecture**: Broke down the single controller into reusable components with clear responsibilities. Components interact with the store for state changes.
- **Directives**: Converted to Angular directives with proper input handling and lifecycle methods.
- **Code Quality**: Ensured TypeScript usage, followed Angular style guide (e.g., consistent naming, separation of concerns), and applied optimizations like `trackBy` for performance in lists.
- **ES Modules**: All files use ES module syntax with `import` and `export`.
- **HTML Updates**: Removed `ng-cloak` as Angular's `*ngIf` and change detection handle visibility. Updated all bindings to Angular syntax.

### File Structure:
- `app.module.ts`: Root module.
- `app-routing.module.ts`: Routing configuration.
- `app.component.ts`: Root component with router outlet and static footer.
- `todo.module.ts`: Feature module for todo-related components, directives, and store.
- `store/`: Contains actions, reducer, selectors, and effects.
- `services/todo-storage.service.ts`: Persistence service.
- `directives/`: Custom directives.
- `todo/`: Todo-related components.

### Complete Code:

#### `src/app/app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TodoModule } from './todo/todo.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TodoModule,
    StoreModule.forRoot({}), // No global reducers; feature reducers in TodoModule
    EffectsModule.forRoot([]), // No global effects; feature effects in TodoModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### `src/app/app-routing.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: TodoComponent },
  { path: 'active', component: TodoComponent },
  { path: 'completed', component: TodoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

#### `src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
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
  styles: [],
})
export class AppComponent {}
```

#### `src/app/todo/todo.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todoReducer } from '../store/todo.reducer';
import { TodoEffects } from '../store/todo.effects';
import { TodoComponent } from './todo.component';
import { TodoInputComponent } from './todo-input.component';
import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFooterComponent } from './todo-footer.component';
import { TodoFocusDirective } from '../directives/todo-focus.directive';
import { TodoEscapeDirective } from '../directives/todo-escape.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('todo', todoReducer),
    EffectsModule.forFeature([TodoEffects]),
  ],
  declarations: [
    TodoComponent,
    TodoInputComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective,
  ],
})
export class TodoModule {}
```

#### `src/app/todo/todo.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as TodoActions from '../store/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
    this.route.url.subscribe(urlSegments => {
      let filter: 'all' | 'active' | 'completed' = 'all';
      if (urlSegments.length > 0) {
        const path = urlSegments[0].path;
        if (path === 'active') filter = 'active';
        else if (path === 'completed') filter = 'completed';
      }
      this.store.dispatch(TodoActions.setFilter({ filter }));
    });
  }
}
```

#### `src/app/todo/todo.component.html`
```html
<header class="header">
  <h1>todos</h1>
  <app-todo-input></app-todo-input>
</header>
<app-todo-list></app-todo-list>
<app-todo-footer></app-todo-footer>
```

#### `src/app/todo/todo-input.component.ts`
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from '../store/todo.actions';

@Component({
  selector: 'app-todo-input',
  template: `
    <form (ngSubmit)="addTodo()">
      <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
    </form>
  `,
})
export class TodoInputComponent {
  newTodo = '';

  constructor(private store: Store) {}

  addTodo(): void {
    const title = this.newTodo.trim();
    if (title) {
      this.store.dispatch(TodoActions.addTodo({ title }));
      this.newTodo = '';
    }
  }
}
```

#### `src/app/todo/todo-list.component.ts`
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../todo.model';
import * as TodoActions from '../store/todo.actions';
import { selectFilteredTodos, selectAllCompleted, selectTodoCount } from '../store/todo.selectors';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todoCount$ | async as todoCount; else noTodos">
      <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (change)="toggleAll($event.target.checked)">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item *ngFor="let todo of filteredTodos$ | async; trackBy: trackById" [todo]="todo"></app-todo-item>
      </ul>
    </section>
    <ng-template #noTodos></ng-template>
  `,
})
export class TodoListComponent {
  filteredTodos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;
  todoCount$: Observable<number>;

  constructor(private store: Store) {
    this.filteredTodos$ = this.store.select(selectFilteredTodos);
    this.allCompleted$ = this.store.select(selectAllCompleted);
    this.todoCount$ = this.store.select(selectTodoCount);
  }

  toggleAll(checked: boolean): void {
    this.store.dispatch(TodoActions.markAll({ done: checked }));
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}
```

#### `src/app/todo/todo-item.component.ts`
```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from '../store/todo.actions';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="isEditing">
      <div class="view">
        <input class="toggle" type="checkbox" (change)="toggleCompleted()" [checked]="todo.completed">
        <label (dblclick)="startEditing()">{{ todo.title }}</label>
        <button class="destroy" (click)="removeTodo()"></button>
      </div>
      <form *ngIf="isEditing" (ngSubmit)="doneEditing()" (blur)="doneEditing()">
        <input class="edit" [(ngModel)]="editTitle" name="editTitle" todoFocus="isEditing" todoEscape="revertEditing()">
      </form>
    </li>
  `,
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  isEditing = false;
  editTitle = '';

  constructor(private store: Store) {}

  startEditing(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
  }

  doneEditing(): void {
    const title = this.editTitle.trim();
    if (title) {
      this.store.dispatch(TodoActions.updateTodo({ id: this.todo.id, changes: { title } }));
    } else {
      this.store.dispatch(TodoActions.removeTodo({ id: this.todo.id }));
    }
    this.isEditing = false;
  }

  revertEditing(): void {
    this.isEditing = false;
  }

  toggleCompleted(): void {
    this.store.dispatch(TodoActions.updateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));
  }

  removeTodo(): void {
    this.store.dispatch(TodoActions.removeTodo({ id: this.todo.id }));
  }
}
```

#### `src/app/todo/todo-footer.component.ts`
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TodoActions from '../store/todo.actions';
import { selectRemainingCount, selectDoneCount, selectFilter } from '../store/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ remainingCount$ | async }}</strong>
        <ng-container [ngPlural]="remainingCount$ | async">
          <ng-template ngPluralCase="one">item left</ng-template>
          <ng-template ngPluralCase="other">items left</ng-template>
        </ng-container>
      </span>
      <ul class="filters">
        <li><a [class.selected]="(filter$ | async) === 'all'" [routerLink]="['/all']">All</a></li>
        <li><a [class.selected]="(filter$ | async) === 'active'" [routerLink]="['/active']">Active</a></li>
        <li><a [class.selected]="(filter$ | async) === 'completed'" [routerLink]="['/completed']">Completed</a></li>
      </ul>
      <button class="clear-completed" (click)="clearCompleted()" *ngIf="(doneCount$ | async) > 0">Clear completed</button>
    </footer>
  `,
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;
  filter$: Observable<'all' | 'active' | 'completed'>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.doneCount$ = this.store.select(selectDoneCount);
    this.filter$ = this.store.select(selectFilter);
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

#### `src/app/store/todo.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number; changes: Partial<Todo> }>());
export const markAll = createAction('[Todo] Mark All', props<{ done: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: 'all' | 'active' | 'completed' }>());
```

#### `src/app/store/todo.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { Todo } from '../todo.model';

export interface State {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

export const initialState: State = {
  todos: [],
  filter: 'all',
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => {
    const id = state.todos.length > 0 ? Math.max(...state.todos.map(t => t.id)) + 1 : 1;
    const todo: Todo = { id, title, completed: false };
    return { ...state, todos: [...state.todos, todo] };
  }),
  on(TodoActions.removeTodo, (state, { id }) => ({ ...state, todos: state.todos.filter(todo => todo.id !== id) })),
  on(TodoActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map(todo => (todo.id === id ? { ...todo, ...changes } : todo)),
  })),
  on(TodoActions.markAll, (state, { done }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: done })),
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  })),
  on(TodoActions.setFilter, (state, { filter }) => ({ ...state, filter }))
);
```

#### `src/app/store/todo.selectors.ts`
```typescript
import { createSelector } from '@ngrx/store';
import { State } from './todo.reducer';
import { Todo } from '../todo.model';

export const selectTodoState = (state: any) => state.todo;

export const selectTodos = createSelector(selectTodoState, (state: State) => state.todos);
export const selectFilter = createSelector(selectTodoState, (state: State) => state.filter);
export const selectFilteredTodos = createSelector(selectTodos, selectFilter, (todos, filter) => {
  if (filter === 'active') return todos.filter((todo: Todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo: Todo) => todo.completed);
  return todos;
});
export const selectTodoCount = createSelector(selectTodos, (todos: Todo[]) => todos.length);
export const selectRemainingCount = createSelector(selectTodos, (todos: Todo[]) => todos.filter(todo => !todo.completed).length);
export const selectDoneCount = createSelector(selectTodos, (todos: Todo[]) => todos.filter(todo => todo.completed).length);
export const selectAllCompleted = createSelector(selectTodos, (todos: Todo[]) => todos.every(todo => todo.completed));
```

#### `src/app/store/todo.effects.ts`
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TodoStorageService } from '../services/todo-storage.service';
import * as TodoActions from './todo.actions';
import { selectTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        const todos = this.todoStorage.getTodos();
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodoActions.addTodo, TodoActions.removeTodo, TodoActions.updateTodo, TodoActions.markAll, TodoActions.clearCompleted),
        withLatestFrom(this.store.select(selectTodos)),
        tap(([, todos]) => this.todoStorage.setTodos(todos))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private todoStorage: TodoStorageService, private store: Store) {}
}
```

#### `src/app/services/todo-storage.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStorageService {
  private STORAGE_KEY = 'todos-angular';

  getTodos(): Todo[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  setTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

#### `src/app/directives/todo-focus.directive.ts`
```typescript
import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]',
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todoFocus']?.currentValue) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```

#### `src/app/directives/todo-escape.directive.ts`
```typescript
import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[todoEscape]',
})
export class TodoEscapeDirective {
  @Input() todoEscape!: () => void;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.todoEscape();
    }
  }
}
```

#### `src/app/todo.model.ts`
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

### Updated `index.html`
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Additional Notes:
- **Build and Dependencies**: Ensure you have Angular 14.x installed. Run `ng new` to create a project, then add `@ngrx/store`, `@ngrx/effects`, and other dependencies via `npm install`. The CSS files are assumed to be handled via Angular's build process or directly in `angular.json`.
- **Testing**: The migrated app should function identically to the original but with improved structure and state management. Test for routing, state changes, and directive behavior.
- **Optimizations**: Used async pipe to avoid manual subscriptions, reducing memory leaks. The `trackBy` function improves `*ngFor` performance. Change detection is default but can be optimized with `OnPush` if needed.
- **Edge Cases**: Handled empty todo lists, editing, and filtering. The `id` generation in the reducer is simple and sufficient for this app; consider UUIDs for larger applications.

This migration ensures a clean, modern, and maintainable codebase adhering to Angular best practices. If you need further adjustments or have specific requirements, let me know!

### Tokens: {'input_tokens': 2479, 'output_tokens': 4990, 'reasoning_tokens': 14389}
### Execution time: 125.93669295310974
