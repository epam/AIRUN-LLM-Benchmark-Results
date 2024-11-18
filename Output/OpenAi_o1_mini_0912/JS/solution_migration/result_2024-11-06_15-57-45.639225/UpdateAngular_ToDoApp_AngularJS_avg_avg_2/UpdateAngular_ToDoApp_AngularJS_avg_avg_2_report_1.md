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

js\app.js
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

js\main.js
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

js\controllers\todo.js
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

js\directives\todoEscape.js
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

js\directives\todoFocus.js
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

js\services\todoStorage.js
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
```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Angular5 TodoMVC</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
    <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

```typescript
// src/main.ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```typescript
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './store/reducers';
import { TodoEffects } from './store/effects';
import { TodoStorageService } from './services/todo-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [TodoStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from './store/actions';
import { Observable } from 'rxjs';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-header></app-todo-header>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadTodos());
  }
}
```

```typescript
// src/app/components/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/actions';

@Component({
  selector: 'app-todo-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="addTodo()">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="title"
          name="title"
          autofocus
        />
      </form>
    </header>
  `
})
export class TodoHeaderComponent {
  title: string = '';

  constructor(private store: Store) {}

  addTodo() {
    const trimmedTitle = this.title.trim();
    if (trimmedTitle) {
      this.store.dispatch(addTodo({ title: trimmedTitle }));
      this.title = '';
    }
  }
}
```

```typescript
// src/app/components/todo-list/todo-list.component.ts
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { toggleTodo, editTodo, deleteTodo } from '../../store/actions';
import { selectFilteredTodos } from '../../store/selectors';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todos$ | async as todos">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        [checked]="allChecked"
        (change)="markAll($event.target.checked)"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          *ngFor="let todo of todos; trackBy: trackByFn"
          [ngClass]="{ completed: todo.completed, editing: editedTodo === todo }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              [(ngModel)]="todo.completed"
              (change)="toggle(todo)"
            />
            <label (dblclick)="startEdit(todo)">{{ todo.title }}</label>
            <button class="destroy" (click)="delete(todo)"></button>
          </div>
          <input
            class="edit"
            [(ngModel)]="editedTitle"
            (blur)="doneEdit(todo)"
            (keyup.enter)="doneEdit(todo)"
            (keyup.escape)="cancelEdit()"
            *ngIf="editedTodo === todo"
            autofocus
          />
        </li>
      </ul>
    </section>
  `
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  allChecked: boolean = false;
  editedTodo: Todo | null = null;
  editedTitle: string = '';

  constructor(private store: Store) {
    this.todos$ = this.store.pipe(select(selectFilteredTodos));
    this.store.select('todos').subscribe(todos => {
      this.allChecked = todos.every(todo => todo.completed);
    });
  }

  toggle(todo: Todo) {
    this.store.dispatch(toggleTodo({ id: todo.id }));
  }

  startEdit(todo: Todo) {
    this.editedTodo = todo;
    this.editedTitle = todo.title;
  }

  doneEdit(todo: Todo) {
    if (this.editedTitle.trim()) {
      this.store.dispatch(editTodo({ id: todo.id, title: this.editedTitle.trim() }));
    } else {
      this.store.dispatch(deleteTodo({ id: todo.id }));
    }
    this.editedTodo = null;
    this.editedTitle = '';
  }

  cancelEdit() {
    this.editedTodo = null;
    this.editedTitle = '';
  }

  delete(todo: Todo) {
    this.store.dispatch(deleteTodo({ id: todo.id }));
  }

  markAll(checked: boolean) {
    this.store.dispatch({ type: '[Todo] Mark All', completed: checked });
  }

  trackByFn(index: number, todo: Todo) {
    return todo.id;
  }
}
```

```typescript
// src/app/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { clearCompleted, setFilter } from '../../store/actions';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectRemaining, selectCompleted, selectFilter } from '../../store/selectors';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(todos$ | async)?.length">
      <span class="todo-count">
        <strong>{{ remaining$ | async }}</strong>
        <ng-container *ngIf="(remaining$ | async) === 1">item left</ng-container>
        <ng-container *ngIf="(remaining$ | async) !== 1">items left</ng-container>
      </span>
      <ul class="filters">
        <li>
          <a href="#/"
             [class.selected]="filter$ | async === 'ALL'"
             (click)="setFilter('ALL')">All</a>
        </li>
        <li>
          <a href="#/active"
             [class.selected]="filter$ | async === 'ACTIVE'"
             (click)="setFilter('ACTIVE')">Active</a>
        </li>
        <li>
          <a href="#/completed"
             [class.selected]="filter$ | async === 'COMPLETED'"
             (click)="setFilter('COMPLETED')">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        *ngIf="(completed$ | async) > 0"
        (click)="clearCompleted()">Clear completed
      </button>
    </footer>
  `
})
export class TodoFooterComponent {
  remaining$: Observable<number>;
  completed$: Observable<number>;
  filter$: Observable<string>;
  todos$: Observable<Todo[]>;

  constructor(private store: Store) {
    this.todos$ = this.store.pipe(select(state => state.todos));
    this.remaining$ = this.store.pipe(select(selectRemaining));
    this.completed$ = this.store.pipe(select(selectCompleted));
    this.filter$ = this.store.pipe(select(selectFilter));
  }

  setFilter(filter: string) {
    this.store.dispatch(setFilter({ filter }));
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

```typescript
// src/app/store/actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: number; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');

export const setFilter = createAction(
  '[Filter] Set Filter',
  props<{ filter: string }>()
);

export const markAll = createAction(
  '[Todo] Mark All',
  props<{ completed: boolean }>()
);
```

```typescript
// src/app/store/reducers.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import {
  loadTodos,
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  clearCompleted,
  markAll
} from './actions';

export interface AppState {
  todos: Todo[];
}

export const initialState: Todo[] = [];

const _todoReducer = createReducer(
  initialState,
  on(loadTodos, (state, action) => []),
  on(addTodo, (state, { title }) => [
    ...state,
    { id: state.length ? Math.max(...state.map(t => t.id)) + 1 : 1, title, completed: false }
  ]),
  on(toggleTodo, (state, { id }) =>
    state.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  ),
  on(editTodo, (state, { id, title }) =>
    state.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  ),
  on(deleteTodo, (state, { id }) =>
    state.filter(todo => todo.id !== id)
  ),
  on(clearCompleted, state =>
    state.filter(todo => !todo.completed)
  ),
  on(markAll, (state, { completed }) =>
    state.map(todo => ({ ...todo, completed }))
  )
);

export function todoReducer(state: Todo[] | undefined, action: any) {
  return _todoReducer(state, action);
}
```

```typescript
// src/app/store/effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadTodos, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, markAll } from './actions';
import { TodoStorageService } from '../services/todo-storage.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() =>
        this.todoStorage.get().pipe(
          map(todos => ({ type: '[Todo] Load Todos Success', todos }))
        )
      )
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompleted,
        markAll
      ),
      mergeMap(() =>
        this.todoStorage.save().pipe(
          map(() => ({ type: '[Todo] Save Todos Success' }))
        )
      )
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoStorage: TodoStorageService
  ) {}
}
```

```typescript
// src/app/store/selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './reducers';
import { Todo } from '../models/todo.model';

export const selectTodos = createFeatureSelector<AppState, Todo[]>('todos');

export const selectFilter = createSelector(
  selectTodos,
  todos => todos['filter'] || 'ALL'
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state: AppState) => state,
  (todos, state) => {
    const filter = state['filter'] || 'ALL';
    switch (filter) {
      case 'ACTIVE':
        return todos.filter(todo => !todo.completed);
      case 'COMPLETED':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectRemaining = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompleted = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);
```

```typescript
// src/app/services/todo-storage.service.ts
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular15';

  get(): Observable<Todo[]> {
    const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    return of(todos);
  }

  save(): Observable<void> {
    const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    return of();
  }
}
```

```css
/* src/styles.css */
[ng-cloak] { display: none; }
```

```json
// angular.json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "projects": {
    "todomvc": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

```json
// package.json
{
  "name": "todomvc",
  "version": "0.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  },
  "dependencies": {
    "@angular/animations": "~14.2.0",
    "@angular/common": "~14.2.0",
    "@angular/compiler": "~14.2.0",
    "@angular/core": "~14.2.0",
    "@angular/forms": "~14.2.0",
    "@angular/platform-browser": "~14.2.0",
    "@angular/platform-browser-dynamic": "~14.2.0",
    "@ngrx/effects": "^14.0.0",
    "@ngrx/store": "^14.0.0",
    "rxjs": "~7.5.0",
    "todomvc-app-css": "^2.3.0",
    "todomvc-common": "^1.0.0",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular/cli": "~14.2.0",
    "@angular/compiler-cli": "~14.2.0",
    "@types/node": "^12.11.1",
    "typescript": "~4.7.2"
  }
}
```

```typescript
// src/app/store/actions.ts (updated for Load Success)
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: number; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');

export const setFilter = createAction(
  '[Filter] Set Filter',
  props<{ filter: string }>()
);

export const markAll = createAction(
  '[Todo] Mark All',
  props<{ completed: boolean }>()
);
```

```typescript
// src/app/store/reducers.ts (updated for Load Success)
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import {
  loadTodosSuccess,
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  clearCompleted,
  markAll
} from './actions';

export interface AppState {
  todos: Todo[];
  filter: string;
}

export const initialState: AppState = {
  todos: [],
  filter: 'ALL'
};

const _todoReducer = createReducer(
  initialState,
  on(loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      { id: state.todos.length ? Math.max(...state.todos.map(t => t.id)) + 1 : 1, title, completed: false }
    ]
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(markAll, state => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: markAll.completed }))
  }))
);

export function todoReducer(state: AppState | undefined, action: any) {
  return _todoReducer(state, action);
}
```

```typescript
// src/app/store/effects.ts (updated for Load and Save)
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadTodos, loadTodosSuccess, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, markAll } from './actions';
import { TodoStorageService } from '../services/todo-storage.service';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() =>
        this.todoStorage.get().pipe(
          map(todos => loadTodosSuccess({ todos }))
        )
      )
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompleted,
        markAll
      ),
      withLatestFrom(this.store.pipe(select('todos'))),
      mergeMap(([action, state]) =>
        this.todoStorage.saveState(state.todos).pipe(
          map(() => ({ type: '[Todo] Save Todos Success' }))
        )
      )
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoStorage: TodoStorageService,
    private store: Store<AppState>
  ) {}
}
```

```typescript
// src/app/services/todo-storage.service.ts (updated)
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular15';

  get(): Observable<Todo[]> {
    const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    return of(todos);
  }

  saveState(todos: Todo[]): Observable<void> {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    return of();
  }
}
```

### Tokens: {'input_tokens': 2401, 'output_tokens': 5676, 'reasoning_tokens': 832}
### Execution time: 30.817461013793945
