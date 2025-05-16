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
Okay, I will migrate the AngularJS TodoMVC application to Angular 14.x with NgRx for state management.

Here's the plan:
1.  **Set up the Angular Project Structure**: Create necessary folders and files.
2.  **Define the Todo Model**.
3.  **Implement NgRx Store**: Actions, Reducers, Selectors, Effects for todos and filters.
4.  **Create `TodoStorageService`**: For localStorage interaction.
5.  **Develop Components**:
    *   `AppComponent` (root)
    *   `TodoAppComponent` (main container, analogous to `TodoController`)
    *   `TodoHeaderComponent` (for adding new todos)
    *   `TodoListComponent` (displays the list of todos)
    *   `TodoItemComponent` (for individual todo item display and editing)
    *   `TodoFooterComponent` (for counts, filters, and clear completed)
6.  **Create Directives**: `TodoFocusDirective` and `TodoEscapeDirective`.
7.  **Set up Routing**: For filtering (All, Active, Completed).
8.  **Update `index.html` and `styles.css`**.
9.  **Assemble in `AppModule`**.

Let's begin.

**1. Project Setup (Conceptual - assuming Angular CLI was used)**

An Angular project would be created using `ng new todo-angular-ngrx`.
The necessary NgRx packages would be installed:
`npm install @ngrx/store @ngrx/effects @ngrx/store-devtools` (store-devtools is optional for development).

**2. `src/app/models/todo.model.ts`**
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

**3. NgRx Store Implementation**

**`src/app/store/todo.actions.ts`**
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

// Initial Load
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

// Todo CUD
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>()); // For title and completion

// Batch operations
export const toggleAllTodos = createAction('[Todo] Toggle All Todos', props<{ completed: boolean }>());
export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');

// Editing
export const startEditTodo = createAction('[Todo] Start Edit Todo', props<{ id: string }>());
export const saveEditedTodo = createAction('[Todo] Save Edited Todo', props<{ id: string, title: string }>());
export const cancelEditTodo = createAction('[Todo] Cancel Edit Todo');

// Filter
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: 'all' | 'active' | 'completed' }>());
```

**`src/app/store/todo.state.ts`** (Helper for reducer and initial state)
```typescript
import { Todo } from '../models/todo.model';

export interface TodoState {
  todos: Todo[];
  editedTodoId: string | null;
  error: any | null;
  loading: boolean;
}

export interface FilterState {
  currentFilter: 'all' | 'active' | 'completed';
}

export interface AppState {
  todoFeature: TodoState;
  filterFeature: FilterState;
}

export const initialTodoState: TodoState = {
  todos: [],
  editedTodoId: null,
  error: null,
  loading: false,
};

export const initialFilterState: FilterState = {
  currentFilter: 'all',
};
```

**`src/app/store/todo.reducer.ts`**
```typescript
import { createReducer, on, Action } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { TodoState, initialTodoState, FilterState, initialFilterState } from './todo.state';
import { Todo } from '../models/todo.model';

// Utility for generating IDs (simple for this example)
const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const todoReducer = createReducer(
  initialTodoState,
  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      { id: generateId(), title: title.trim(), completed: false },
    ],
  })),
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  })),
  on(TodoActions.updateTodo, (state, { todo: updatedTodo }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
    ),
    editedTodoId: state.editedTodoId === updatedTodo.id ? null : state.editedTodoId, // Clear edit mode if this todo was updated
  })),
  on(TodoActions.toggleAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed })),
  })),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  })),
  on(TodoActions.startEditTodo, (state, { id }) => ({
    ...state,
    editedTodoId: id,
  })),
  on(TodoActions.saveEditedTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title: title.trim() } : todo
    ),
    editedTodoId: null, // Exit edit mode
  })),
  on(TodoActions.cancelEditTodo, state => ({
    ...state,
    editedTodoId: null,
  }))
);

export const filterReducer = createReducer(
  initialFilterState,
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    currentFilter: filter,
  }))
);

export function todosFeatureReducer(state: TodoState | undefined, action: Action) {
  return todoReducer(state, action);
}

export function filterFeatureReducer(state: FilterState | undefined, action: Action) {
  return filterReducer(state, action);
}
```

**`src/app/store/todo.selectors.ts`**
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState, FilterState, AppState } from './todo.state';
import { Todo } from '../models/todo.model';

export const selectTodoFeatureState = createFeatureSelector<AppState, TodoState>('todoFeature');
export const selectFilterFeatureState = createFeatureSelector<AppState, FilterState>('filterFeature');

export const selectAllTodos = createSelector(
  selectTodoFeatureState,
  (state: TodoState) => state.todos
);

export const selectEditedTodoId = createSelector(
  selectTodoFeatureState,
  (state: TodoState) => state.editedTodoId
);

export const selectCurrentFilter = createSelector(
  selectFilterFeatureState,
  (state: FilterState) => state.currentFilter
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectCurrentFilter,
  (todos: Todo[], filter: 'all' | 'active' | 'completed') => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }
    return todos;
  }
);

export const selectRemainingCount = createSelector(
  selectAllTodos, // Based on all todos, not filtered ones for this count
  (todos: Todo[]) => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.filter(todo => todo.completed).length
);

export const selectAreAllCompleted = createSelector(
  selectAllTodos,
  selectRemainingCount,
  (todos: Todo[], remainingCount: number) => todos.length > 0 && remainingCount === 0
);

export const selectHasTodos = createSelector(
  selectAllTodos,
  (todos: Todo[]) => todos.length > 0
);
```

**4. `src/app/services/todo-storage.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStorageService {
  private readonly STORAGE_ID = 'todos-angular-ngrx';

  getTodos(): Observable<Todo[]> {
    try {
      const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
      return of(todos);
    } catch (e) {
      return throwError(() => new Error('Failed to parse todos from localStorage'));
    }
  }

  saveTodos(todos: Todo[]): Observable<void> {
    try {
      localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
      return of(undefined);
    } catch (e) {
      return throwError(() => new Error('Failed to save todos to localStorage'));
    }
  }
}
```

**`src/app/store/todo.effects.ts`**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TodoActions from './todo.actions';
import { TodoStorageService } from '../services/todo-storage.service';
import { AppState } from './todo.state';
import { selectAllTodos } from './todo.selectors';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoStorageService: TodoStorageService,
    private store: Store<AppState>
  ) {}

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

  // Persist todos to localStorage after relevant actions
  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.removeTodo,
          TodoActions.updateTodo,
          TodoActions.toggleAllTodos,
          TodoActions.clearCompletedTodos,
          TodoActions.saveEditedTodo
        ),
        withLatestFrom(this.store.select(selectAllTodos)),
        switchMap(([action, todos]) => this.todoStorageService.saveTodos(todos))
      ),
    { dispatch: false } // No action dispatched from this effect
  );
}
```

**5. Components**

**`src/app/app.component.ts`** (Root component)
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp-container">
      <app-todo-app></app-todo-app>
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
  `,
  styles: [
    // Minimal styles for centering, actual TodoMVC styles will be global
    `.todoapp-container { display: flex; justify-content: center; }`
  ]
})
export class AppComponent {}
```

**`src/app/components/todo-header/todo-header.component.ts`**
```typescript
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="onAddTodo()" #todoForm="ngForm">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="newTodoTitle"
          name="newTodoTitle"
          autofocus
        />
      </form>
    </header>
  `,
})
export class TodoHeaderComponent {
  newTodoTitle: string = '';
  @Output() addTodo = new EventEmitter<string>();

  onAddTodo(): void {
    if (this.newTodoTitle.trim().length > 0) {
      this.addTodo.emit(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }
}
```

**`src/app/directives/todo-focus.directive.ts`**
```typescript
import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]',
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') shouldFocus: boolean = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shouldFocus'] && this.shouldFocus) {
      // Use timeout to ensure element is visible and focusable in the DOM
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

**`src/app/directives/todo-escape.directive.ts`**
```typescript
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]',
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    this.appTodoEscape.emit();
  }
}
```

**`src/app/components/todo-item/todo-item.component.ts`**
```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [ngClass]="{ completed: todo.completed, editing: isEditing }">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="onToggleCompletion()"
        />
        <label (dblclick)="onStartEdit()">{{ todo.title }}</label>
        <button class="destroy" (click)="onRemove()"></button>
      </div>
      <form *ngIf="isEditing" (ngSubmit)="onSaveEdit()">
        <input
          #editInput
          class="edit"
          [value]="editingTitle"
          (input)="editingTitle = $any($event.target).value"
          (blur)="onSaveEdit()"
          appTodoFocus
          [appTodoFocus]="isEditing"
          appTodoEscape
          (appTodoEscape)="onCancelEdit()"
        />
      </form>
    </li>
  `,
})
export class TodoItemComponent implements OnChanges {
  @Input() todo!: Todo;
  @Input() isEditing: boolean = false;

  @Output() toggleCompletion = new EventEmitter<string>(); // id
  @Output() remove = new EventEmitter<string>(); // id
  @Output() startEdit = new EventEmitter<string>(); // id
  @Output() saveEdit = new EventEmitter<{ id: string; title: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  editingTitle: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditing'] && this.isEditing) {
      this.editingTitle = this.todo.title;
    }
  }

  onToggleCompletion(): void {
    this.toggleCompletion.emit(this.todo.id);
  }

  onRemove(): void {
    this.remove.emit(this.todo.id);
  }

  onStartEdit(): void {
    this.editingTitle = this.todo.title; // Ensure fresh title on edit start
    this.startEdit.emit(this.todo.id);
  }

  onSaveEdit(): void {
    if (!this.isEditing) return; // Avoid multiple calls from blur and submit

    const newTitle = this.editingTitle.trim();
    if (newTitle.length === 0) {
      this.remove.emit(this.todo.id); // Remove if title is empty
    } else if (newTitle !== this.todo.title) {
      this.saveEdit.emit({ id: this.todo.id, title: newTitle });
    } else {
      // Title hasn't changed, just cancel edit mode
      this.cancelEdit.emit();
    }
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}
```

**`src/app/components/todo-list/todo-list.component.ts`**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="hasTodos">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        [checked]="allCompleted"
        (change)="onToggleAll($any($event.target).checked)"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item
          *ngFor="let todo of todos; trackBy: trackById"
          [todo]="todo"
          [isEditing]="editedTodoId === todo.id"
          (toggleCompletion)="onToggleCompletion($event)"
          (remove)="onRemove($event)"
          (startEdit)="onStartEdit($event)"
          (saveEdit)="onSaveEdit($event)"
          (cancelEdit)="onCancelEdit()"
        ></app-todo-item>
      </ul>
    </section>
  `,
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() editedTodoId: string | null = null;
  @Input() allCompleted: boolean = false;
  @Input() hasTodos: boolean = false;

  @Output() toggleAll = new EventEmitter<boolean>();
  @Output() toggleCompletion = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
  @Output() startEdit = new EventEmitter<string>();
  @Output() saveEdit = new EventEmitter<{ id: string; title: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  trackById(index: number, todo: Todo): string {
    return todo.id;
  }

  onToggleAll(completed: boolean): void {
    this.toggleAll.emit(completed);
  }

  onToggleCompletion(id: string): void {
    this.toggleCompletion.emit(id);
  }

  onRemove(id: string): void {
    this.remove.emit(id);
  }

  onStartEdit(id: string): void {
    this.startEdit.emit(id);
  }

  onSaveEdit(data: { id: string; title: string }): void {
    this.saveEdit.emit(data);
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}
```

**`src/app/components/todo-footer/todo-footer.component.ts`**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="hasTodos">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong>
        <ng-container [ngPlural]="remainingCount">
          <ng-template ngPluralCase="=1"> item left</ng-template>
          <ng-template ngPluralCase="other"> items left</ng-template>
        </ng-container>
      </span>
      <ul class="filters">
        <li>
          <a [class.selected]="currentFilter === 'all'" routerLink="/all">All</a>
        </li>
        <li>
          <a [class.selected]="currentFilter === 'active'" routerLink="/active">Active</a>
        </li>
        <li>
          <a [class.selected]="currentFilter === 'completed'" routerLink="/completed">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        *ngIf="completedCount > 0"
        (click)="onClearCompleted()"
      >
        Clear completed
      </button>
    </footer>
  `,
})
export class TodoFooterComponent {
  @Input() remainingCount: number = 0;
  @Input() completedCount: number = 0;
  @Input() currentFilter: 'all' | 'active' | 'completed' = 'all';
  @Input() hasTodos: boolean = false;

  @Output() clearCompleted = new EventEmitter<void>();

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }
}
```

**`src/app/components/todo-app/todo-app.component.ts`** (Main smart component)
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../store/todo.actions';
import * as fromRoot from '../../store/todo.selectors'; // Using alias for selectors
import { AppState } from '../../store/todo.state';

@Component({
  selector: 'app-todo-app',
  template: `
    <div>
      <app-todo-header (addTodo)="onAddTodo($event)"></app-todo-header>
      <app-todo-list
        [todos]="(filteredTodos$ | async) || []"
        [editedTodoId]="(editedTodoId$ | async)"
        [allCompleted]="(allCompleted$ | async) || false"
        [hasTodos]="(hasTodos$ | async) || false"
        (toggleAll)="onToggleAll($event)"
        (toggleCompletion)="onToggleTodoCompletion($event)"
        (remove)="onRemoveTodo($event)"
        (startEdit)="onStartEditTodo($event)"
        (saveEdit)="onSaveEditedTodo($event)"
        (cancelEdit)="onCancelEditTodo()"
      ></app-todo-list>
      <app-todo-footer
        [remainingCount]="(remainingCount$ | async) || 0"
        [completedCount]="(completedCount$ | async) || 0"
        [currentFilter]="(currentFilter$ | async) || 'all'"
        [hasTodos]="(hasTodos$ | async) || false"
        (clearCompleted)="onClearCompletedTodos()"
      ></app-todo-footer>
    </div>
  `,
})
export class TodoAppComponent implements OnInit, OnDestroy {
  filteredTodos$: Observable<Todo[]>;
  editedTodoId$: Observable<string | null>;
  allCompleted$: Observable<boolean>;
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;
  currentFilter$: Observable<'all' | 'active' | 'completed'>;
  hasTodos$: Observable<boolean>;

  private routeSubscription!: Subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.filteredTodos$ = this.store.select(fromRoot.selectFilteredTodos);
    this.editedTodoId$ = this.store.select(fromRoot.selectEditedTodoId);
    this.allCompleted$ = this.store.select(fromRoot.selectAreAllCompleted);
    this.remainingCount$ = this.store.select(fromRoot.selectRemainingCount);
    this.completedCount$ = this.store.select(fromRoot.selectCompletedCount);
    this.currentFilter$ = this.store.select(fromRoot.selectCurrentFilter);
    this.hasTodos$ = this.store.select(fromRoot.selectHasTodos);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());

    // Handle initial route and subsequent route changes for filter
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route.firstChild?.snapshot.url[0]?.path || 'all') // Get path from child route or default
    ).subscribe(path => {
      const filterValue = (path === 'active' || path === 'completed') ? path : 'all';
      this.store.dispatch(TodoActions.setFilter({ filter: filterValue }));
    });

    // Handle initial filter based on current URL, in case of direct navigation
    const initialPath = this.route.firstChild?.snapshot.url[0]?.path || 'all';
    const initialFilter = (initialPath === 'active' || initialPath === 'completed') ? initialPath : 'all';
    this.store.dispatch(TodoActions.setFilter({ filter: initialFilter }));
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onAddTodo(title: string): void {
    this.store.dispatch(TodoActions.addTodo({ title }));
  }

  onToggleAll(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
  }

  onToggleTodoCompletion(id: string): void {
    // Need to get the current todo to toggle its 'completed' status
    this.store.select(fromRoot.selectAllTodos).pipe(
      map(todos => todos.find(t => t.id === id)),
      filter(todo => !!todo) // Ensure todo is found
    ).subscribe(todo => {
      if (todo) {
        this.store.dispatch(TodoActions.updateTodo({ todo: { ...todo, completed: !todo.completed } }));
      }
    });
  }

  onRemoveTodo(id: string): void {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  onStartEditTodo(id: string): void {
    this.store.dispatch(TodoActions.startEditTodo({ id }));
  }

  onSaveEditedTodo({ id, title }: { id: string; title: string }): void {
    if (title.trim().length === 0) {
        this.store.dispatch(TodoActions.removeTodo({ id }));
    } else {
        this.store.dispatch(TodoActions.saveEditedTodo({ id, title }));
    }
  }

  onCancelEditTodo(): void {
    this.store.dispatch(TodoActions.cancelEditTodo());
  }

  onClearCompletedTodos(): void {
    this.store.dispatch(TodoActions.clearCompletedTodos());
  }
}
```

**6. `src/app/app-routing.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoAppComponent } from './components/todo-app/todo-app.component'; // Placeholder for where TodoAppComponent is declared

// We need a component that can host the TodoAppComponent and react to routes,
// or TodoAppComponent itself can handle route changes if it's the routed component.
// For simplicity, let's make TodoAppComponent the component for these routes.
// A better approach might be a wrapper component if TodoAppComponent is complex.

const routes: Routes = [
  // TodoAppComponent will be rendered inside AppComponent's router-outlet (if it had one)
  // or directly if AppComponent's template is just <router-outlet>
  // For this setup, AppComponent has <app-todo-app>, so routing will affect its internal state.
  // Let's adjust this. AppComponent should have <router-outlet> and TodoAppComponent is routed.

  // If AppComponent has <app-todo-app>, then TodoAppComponent needs to listen to router events.
  // If AppComponent has <router-outlet>, then we define routes like this:
  {
    path: '',
    component: TodoAppComponent, // TodoAppComponent will be the view for the root path
    children: [ // Children routes to set the filter, TodoAppComponent will read this
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: undefined }, // No actual component, just for path matching
        { path: 'active', component: undefined },
        { path: 'completed', component: undefined },
    ]
  },
  { path: '**', redirectTo: '/all' } // Redirect any other path to /all
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // useHash for # routes
  exports: [RouterModule],
})
export class AppRoutingModule {}
```
To make the routing work as intended with `TodoAppComponent` reacting to child route changes, `AppComponent`'s template should be:
```html
<!-- src/app/app.component.html -->
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
```
And `AppComponent.ts` would be simpler:
```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // Assuming the above HTML is in app.component.html
  // styleUrls: ['./app.component.css'] // If you have specific styles for app-root
})
export class AppComponent {}
```

**7. `src/app/app.module.ts`**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For ngModel
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // Optional

import { AppRoutingModule } from './app-routing.module.ts';
import { AppComponent } from './app.component';

import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

import { TodoStorageService } from './services/todo-storage.service';
import { TodoEffects } from './store/todo.effects';
import { todosFeatureReducer, filterFeatureReducer } from './store/todo.reducer';
import { environment } from '../environments/environment'; // For StoreDevtools

@NgModule({
  declarations: [
    AppComponent,
    TodoAppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot({
      todoFeature: todosFeatureReducer,
      filterFeature: filterFeatureReducer,
    }),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [TodoStorageService], // Services are usually providedIn: 'root' now
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**8. `src/index.html`**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular • TodoMVC</title>
  <base href="/"> <!-- Important for Angular Router -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- TodoMVC styles will be loaded via angular.json or styles.scss -->
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**9. Styles**
*   Copy `node_modules/todomvc-common/base.css` and `node_modules/todomvc-app-css/index.css` to `src/assets/`.
*   Update `angular.json` to include these global styles:
    ```json
    // angular.json
    // ...
    "projects": {
      "your-project-name": {
        // ...
        "architect": {
          "build": {
            // ...
            "options": {
              // ...
              "styles": [
                "src/styles.css", // or .scss
                "src/assets/base.css",
                "src/assets/index.css"
              ],
              // ...
            }
            // ...
          }
          // ...
        }
      }
    }
    // ...
    ```
    Or import them in `src/styles.css` (or `src/styles.scss`):
    ```css
    /* src/styles.css */
    @import '~todomvc-common/base.css'; /* If installed via npm and path configured */
    @import '~todomvc-app-css/index.css'; /* Or use relative paths to assets folder */
    /* @import './assets/base.css'; */
    /* @import './assets/index.css'; */
    ```
    For this example, assuming they are copied to `src/assets/` and linked in `angular.json` is cleaner.

**10. `src/main.ts`** (Standard Angular main file)
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

**Summary of Changes and Key Points:**

*   **ES Modules**: RequireJS is completely removed. TypeScript/ES modules are used.
*   **Angular Modules**: `AppModule` organizes the application.
*   **NgRx for State Management**:
    *   Actions define state changes.
    *   Reducers handle state transitions immutably.
    *   Selectors provide memoized data slices from the store.
    *   Effects manage side effects like localStorage interaction.
*   **Component Architecture**:
    *   `TodoAppComponent` is the main smart component, connecting to the store.
    *   Other components (`TodoHeader`, `TodoList`, `TodoItem`, `TodoFooter`) are mostly presentational, receiving data via `@Input` and emitting events via `@Output`.
*   **Angular Services**: `TodoStorageService` is an injectable service.
*   **Template Syntax**: AngularJS directives (`ng-model`, `ng-submit`, `ng-show`, `ng-repeat`, `ng-class`, etc.) are replaced with Angular equivalents (`[(ngModel)]`, `(ngSubmit)`, `*ngIf`, `*ngFor`, `[ngClass]`, etc.).
*   **Angular Directives**: `TodoFocusDirective` and `TodoEscapeDirective` are created using Angular's directive API.
*   **Routing**: Angular Router (`AppRoutingModule`) is used for navigation and filtering, replacing AngularJS `$location` service. Hash-based routing (`useHash: true`) mimics the original `#` behavior.
*   **Optimization**:
    *   `trackBy` is used in `*ngFor` for better rendering performance.
    *   NgRx selectors are memoized.
    *   OnPush change detection could be added to presentational components for further optimization but is omitted here for brevity unless specifically requested.
*   **Code Quality**:
    *   TypeScript is used throughout.
    *   Follows general Angular style guidelines.
    *   No TODO comments left in the final code.

This migration provides a modern, maintainable, and scalable Angular application structure using NgRx for robust state management.

### Tokens: {'input_tokens': 2787, 'output_tokens': 9263}
### Execution time: 133.56832575798035
