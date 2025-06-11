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
Below is a complete migration of your AngularJS + RequireJS TodoMVC app into a modern Angular 14.x application with NgRx state management, ES modules, a proper component/directive/service architecture, and performance‑minded best practices.  We remove RequireJS entirely, split the monolithic controller into components, convert directives and services, wire up NgRx (@ngrx/store + @ngrx/effects), and keep the original look & feel via the official TodoMVC styles.

---

## 1. Scaffold a new Angular 14 application

First, create the base Angular 14 project and install NgRx plus the TodoMVC CSS packages:

```bash
# 1) Create a new Angular 14 app (no router, CSS styling)
ng new todomvc-ng --routing=false --style=css
cd todomvc-ng

# 2) Install NgRx store, effects, and devtools
ng add @ngrx/store@14
ng add @ngrx/effects@14
ng add @ngrx/store-devtools@14

# 3) Install the official TodoMVC styles
npm install todomvc-common todomvc-app-css
```

---

## 2. Include the TodoMVC styles in angular.json

Edit **angular.json** so that the TodoMVC CSS files are loaded globally:

```jsonc
// angular.json
{
  …
  "projects": {
    "todomvc-ng": {
      …
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css",
              "src/styles.css"
            ],
            …
          },
          …
        },
        …
      }
    }
  }
}
```

---

## 3. Update src/index.html

Replace the default content with a minimal shell hosting `<app-root>`:

```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular 14 TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

## 4. Bootstrap in main.ts

No changes needed beyond the CLI default; for completeness:

```ts
// src/main.ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

---

## 5. Application file structure

Below is the recommended **src/app/** layout after migration:

```
src/app/
├── app.module.ts
├── app.component.ts
├── app.component.html
├── app.component.css

├── core/
│   └── services/
│       └── todo-storage.service.ts

└── todos/
    ├── models/
    │   └── todo.model.ts
    │
    ├── state/
    │   ├── todo.actions.ts
    │   ├── todo.reducer.ts
    │   ├── todo.selectors.ts
    │   └── todo.effects.ts
    │
    ├── directives/
    │   ├── todo-focus.directive.ts
    │   └── todo-escape.directive.ts
    │
    ├── components/
    │   ├── todo-form/
    │   │   ├── todo-form.component.ts
    │   │   ├── todo-form.component.html
    │   │   └── todo-form.component.css
    │   │
    │   ├── todo-list/
    │   │   ├── todo-list.component.ts
    │   │   ├── todo-list.component.html
    │   │   └── todo-list.component.css
    │   │
    │   ├── todo-item/
    │   │   ├── todo-item.component.ts
    │   │   ├── todo-item.component.html
    │   │   └── todo-item.component.css
    │   │
    │   ├── todo-footer/
    │   │   ├── todo-footer.component.ts
    │   │   ├── todo-footer.component.html
    │   │   └── todo-footer.component.css
    │   │
    │   └── todo-info/
    │       ├── todo-info.component.ts
    │       ├── todo-info.component.html
    │       └── todo-info.component.css
    │
    └── todos.module.ts
```

---

## 6. Core service: localStorage persistence

```ts
// src/app/core/services/todo-storage.service.ts
import { Injectable } from '@angular/core';
import { Todo } from '../../todos/models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoStorageService {
  private readonly STORAGE_KEY = 'todos-angularjs-requirejs';

  get(): Todo[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  put(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

---

## 7. Todo model and filter type

```ts
// src/app/todos/models/todo.model.ts
export interface Todo {
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
```

---

## 8. NgRx state management

### 8.1 Actions

```ts
// src/app/todos/state/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo, FilterType } from '../models/todo.model';

export const loadTodos     = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo       = createAction('[Todo] Add Todo', props<{ title: string }>());
export const updateTodo    = createAction('[Todo] Update Todo', props<{ index: number; changes: Partial<Todo> }>());
export const removeTodo    = createAction('[Todo] Remove Todo', props<{ index: number }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const toggleAll     = createAction('[Todo] Toggle All', props<{ completed: boolean }>());

export const setFilter     = createAction('[Todo] Set Filter', props<{ filter: FilterType }>());
```

---

### 8.2 Reducer

```ts
// src/app/todos/state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo, FilterType } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

export const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),

  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { title, completed: false }],
  })),

  on(TodoActions.updateTodo, (state, { index, changes }) => ({
    ...state,
    todos: state.todos.map((t, i) => (i === index ? { ...t, ...changes } : t)),
  })),

  on(TodoActions.removeTodo, (state, { index }) => ({
    ...state,
    todos: state.todos.filter((_, i) => i !== index),
  })),

  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(t => !t.completed),
  })),

  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(t => ({ ...t, completed })),
  })),

  on(TodoActions.setFilter, (state, { filter }) => ({ ...state, filter }))
);
```

---

### 8.3 Selectors

```ts
// src/app/todos/state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoFeature = createFeatureSelector<TodoState>('todos');

export const selectTodos        = createSelector(selectTodoFeature, s => s.todos);
export const selectFilter       = createSelector(selectTodoFeature, s => s.filter);

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'active':    return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default:          return todos;
    }
  }
);

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(t => !t.completed).length
);

export const selectDoneCount = createSelector(
  selectTodos,
  selectRemainingCount,
  (todos, remaining) => todos.length - remaining
);

export const selectAllChecked = createSelector(
  selectRemainingCount,
  remaining => remaining === 0
);
```

---

### 8.4 Effects

```ts
// src/app/todos/state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as TodoActions from './todo.actions';
import { TodoStorageService } from '../../core/services/todo-storage.service';
import * as TodoSelectors from './todo.selectors';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private todoStorage: TodoStorageService
  ) {}

  // Load from localStorage on app init
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT, TodoActions.loadTodos),
      map(() => {
        const todos = this.todoStorage.get();
        return TodoActions.loadTodosSuccess({ todos });
      })
    )
  );

  // Persist to localStorage on relevant actions
  persistTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.updateTodo,
          TodoActions.removeTodo,
          TodoActions.clearCompleted,
          TodoActions.toggleAll
        ),
        withLatestFrom(this.store.select(TodoSelectors.selectTodos)),
        tap(([, todos]) => this.todoStorage.put(todos))
      ),
    { dispatch: false }
  );
}
```

---

## 9. Custom directives

### 9.1 todoFocus (sets focus when editing)

```ts
// src/app/todos/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') isFocused!: boolean;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnChanges(): void {
    if (this.isFocused) {
      // delay to ensure the element is rendered
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

---

### 9.2 todoEscape (catches Escape key)

```ts
// src/app/todos/directives/todo-escape.directive.ts
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output('appTodoEscape') escape = new EventEmitter<void>();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.escape.emit();
    }
  }
}
```

---

## 10. Todos feature module

```ts
// src/app/todos/todos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { todoReducer } from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';

import { TodoFormComponent }    from './components/todo-form/todo-form.component';
import { TodoListComponent }    from './components/todo-list/todo-list.component';
import { TodoItemComponent }    from './components/todo-item/todo-item.component';
import { TodoFooterComponent }  from './components/todo-footer/todo-footer.component';
import { TodoInfoComponent }    from './components/todo-info/todo-info.component';

import { TodoFocusDirective }   from './directives/todo-focus.directive';
import { TodoEscapeDirective }  from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoFormComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoInfoComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects])
  ],
  exports: [
    TodoFormComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoInfoComponent
  ]
})
export class TodosModule {}
```

---

## 11. Root AppModule

```ts
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';

import { TodosModule } from './todos/todos.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TodosModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 25 })
      : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## 12. Root component: dispatch initial load, compose features

```ts
// src/app/app.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from './todos/state/todo.actions';
import { Observable } from 'rxjs';
import { Todo } from './todos/models/todo.model';
import * as TodoSelectors from './todos/state/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos$!: Observable<Todo[]>;

  constructor(private store: Store) {
    // trigger initial load from localStorage
    this.store.dispatch(TodoActions.loadTodos());
    this.todos$ = this.store.select(TodoSelectors.selectTodos);
  }
}
```

```html
<!-- src/app/app.component.html -->
<section class="todoapp">
  <!-- Header / Add form -->
  <app-todo-form></app-todo-form>

  <!-- Main list (only if there are todos) -->
  <app-todo-list *ngIf="(todos$ | async)?.length > 0"></app-todo-list>

  <!-- Footer / filters (only if there are todos) -->
  <app-todo-footer *ngIf="(todos$ | async)?.length > 0"></app-todo-footer>
</section>

<!-- Info footer always shown -->
<app-todo-info></app-todo-info>
```

---

## 13. Feature components

### 13.1 todo-form.component

```ts
// src/app/todos/components/todo-form/todo-form.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TodoActions from '../../state/todo.actions';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
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

```html
<!-- src/app/todos/components/todo-form/todo-form.component.html -->
<header class="header">
  <h1>todos</h1>
  <form class="todo-form" (ngSubmit)="addTodo()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      name="newTodo"
      autofocus
    />
  </form>
</header>
```

---

### 13.2 todo-list.component

```ts
// src/app/todos/components/todo-list/todo-list.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Todo } from '../../models/todo.model';
import * as TodoSelectors from '../../state/todo.selectors';
import * as TodoActions from '../../state/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  todos$: Observable<Todo[]>      = this.store.select(TodoSelectors.selectFilteredTodos);
  allChecked$: Observable<boolean> = this.store.select(TodoSelectors.selectAllChecked);

  constructor(private store: Store) {}

  toggleAll(checked: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed: checked }));
  }

  trackByIndex(_: number, __: Todo): number {
    return _;
  }
}
```

```html
<!-- src/app/todos/components/todo-list/todo-list.component.html -->
<section class="main">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="allChecked$ | async"
    (change)="toggleAll($event.target.checked)"
  />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of todos$ | async; let i = index; trackBy: trackByIndex"
      [todo]="todo"
      [index]="i"
    ></app-todo-item>
  </ul>
</section>
```

---

### 13.3 todo-item.component

```ts
// src/app/todos/components/todo-item/todo-item.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../state/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() index!: number;

  editing     = false;
  editedTitle = '';

  constructor(private store: Store) {}

  toggleCompleted(): void {
    this.store.dispatch(
      TodoActions.updateTodo({
        index: this.index,
        changes: { completed: !this.todo.completed }
      })
    );
  }

  startEdit(): void {
    this.editing = true;
    this.editedTitle = this.todo.title;
  }

  doneEdit(): void {
    const title = this.editedTitle.trim();
    if (title) {
      this.store.dispatch(
        TodoActions.updateTodo({ index: this.index, changes: { title } })
      );
    } else {
      this.remove();
    }
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  remove(): void {
    this.store.dispatch(TodoActions.removeTodo({ index: this.index }));
  }
}
```

```html
<!-- src/app/todos/components/todo-item/todo-item.component.html -->
<li [ngClass]="{ completed: todo.completed, editing: editing }">
  <div class="view" *ngIf="!editing">
    <input
      class="toggle"
      type="checkbox"
      [checked]="todo.completed"
      (change)="toggleCompleted()"
    />
    <label (dblclick)="startEdit()">{{ todo.title }}</label>
    <button class="destroy" (click)="remove()"></button>
  </div>

  <input
    class="edit"
    *ngIf="editing"
    [(ngModel)]="editedTitle"
    (blur)="doneEdit()"
    appTodoEscape
    (appTodoEscape)="cancelEdit()"
    appTodoFocus
    [appTodoFocus]="editing"
  />
</li>
```

---

### 13.4 todo-footer.component

```ts
// src/app/todos/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FilterType } from '../../models/todo.model';
import * as TodoSelectors from '../../state/todo.selectors';
import * as TodoActions from '../../state/todo.actions';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  remainingCount$: Observable<number> = this.store.select(TodoSelectors.selectRemainingCount);
  doneCount$:      Observable<number> = this.store.select(TodoSelectors.selectDoneCount);
  filter$:         Observable<FilterType> = this.store.select(TodoSelectors.selectFilter);

  constructor(private store: Store) {}

  setFilter(filter: FilterType): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

```html
<!-- src/app/todos/components/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ remainingCount$ | async }}</strong>
    {{ (remainingCount$ | async) === 1 ? 'item left' : 'items left' }}
  </span>
  <ul class="filters">
    <li>
      <a href="#"
         [ngClass]="{ selected: (filter$ | async) === 'all' }"
         (click)="setFilter('all')"
      >All</a>
    </li>
    <li>
      <a href="#"
         [ngClass]="{ selected: (filter$ | async) === 'active' }"
         (click)="setFilter('active')"
      >Active</a>
    </li>
    <li>
      <a href="#"
         [ngClass]="{ selected: (filter$ | async) === 'completed' }"
         (click)="setFilter('completed')"
      >Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="(doneCount$ | async) > 0"
    (click)="clearCompleted()"
  >
    Clear completed
  </button>
</footer>
```

---

### 13.5 todo-info.component

```ts
// src/app/todos/components/todo-info/todo-info.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-info',
  templateUrl: './todo-info.component.html',
  styleUrls: ['./todo-info.component.css']
})
export class TodoInfoComponent {}
```

```html
<!-- src/app/todos/components/todo-info/todo-info.component.html -->
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

---

## 14. Final notes & best practices

- **No RequireJS** remains; everything is pure ES modules/TypeScript.
- **NgRx** manages all state (todos, filter) and side effects (load/save).
- Components are **OnPush** where feasible for performance.
- Custom directives replace the AngularJS `todo-focus` & `todo-escape` behaviors.
- The **FormsModule** is used only for the simple two-way binding on inputs.
- We use the **Angular CLI**–recommended structure (Core vs. Feature modules).
- All original TodoMVC CSS is preserved via the global styles.
- No `// TODO:` comments remain; code adheres to the Angular Style Guide.
- This migration targets **Angular 14.x**, leverages RxJS properly, and uses TypeScript throughout.

You now have a fully migrated Angular 14 TodoMVC app with NgRx state management, modular architecture, and the same user experience as before. Enjoy!

### Tokens: {'input_tokens': 2504, 'output_tokens': 16006, 'reasoning_tokens': 10368}
### Execution time: 111.81879115104675
