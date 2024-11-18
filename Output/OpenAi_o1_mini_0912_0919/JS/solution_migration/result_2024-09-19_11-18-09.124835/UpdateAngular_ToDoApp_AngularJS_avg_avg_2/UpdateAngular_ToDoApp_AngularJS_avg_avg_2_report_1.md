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
### `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx • TodoMVC</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### `src/main.ts`

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

### `src/app/app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { storeReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';

import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

import { TodoStorageService } from './services/todo-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: storeReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [TodoStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### `src/app/app.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from './store/actions/todo.actions';
import { Observable } from 'rxjs';
import { selectRemainingCount, selectTodos } from './store/selectors/todo.selectors';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  newTodo: string = '';
  todos$: Observable<Todo[]>;
  remainingCount$: Observable<number>;

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
    this.remainingCount$ = this.store.select(selectRemainingCount);
  }

  ngOnInit(): void {}

  addTodo(): void {
    const title = this.newTodo.trim();
    if (title) {
      this.store.dispatch(addTodo({ title }));
      this.newTodo = '';
    }
  }
}
```

### `src/app/app.component.html`

```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form class="todo-form" (ngSubmit)="addTodo()">
      <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
    </form>
  </header>
  <app-todo-list></app-todo-list>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</section>
```

### `src/app/app.component.css`

```css
/* Styles specific to the app component */
```

### `src/app/components/todo-list/todo-list.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { toggleAllTodos, clearCompletedTodos } from '../../store/actions/todo.actions';
import { selectTodos, selectAllChecked, selectRemainingCount } from '../../store/selectors/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  allChecked$: Observable<boolean>;
  remainingCount$: Observable<number>;

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
    this.allChecked$ = this.store.select(selectAllChecked);
    this.remainingCount$ = this.store.select(selectRemainingCount);
  }

  ngOnInit(): void {}

  toggleAll(checked: boolean): void {
    this.store.dispatch(toggleAllTodos({ completed: checked }));
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompletedTodos());
  }
}
```

### `src/app/components/todo-list/todo-list.component.html`

```html
<section class="main" *ngIf="(todos$ | async)?.length">
  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allChecked$ | async" (change)="toggleAll($event.target.checked)">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item *ngFor="let todo of (todos$ | async)" [todo]="todo"></app-todo-item>
  </ul>
</section>
<footer class="footer" *ngIf="(todos$ | async)?.length">
  <span class="todo-count"><strong>{{ remainingCount$ | async }}</strong>
    <ng-container [ngPlural]="remainingCount$ | async">
      <ng-template ngPluralCase="1">item left</ng-template>
      <ng-template ngPluralCase="other">items left</ng-template>
    </ng-container>
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
  <button class="clear-completed" (click)="clearCompleted()" *ngIf="(remainingCount$ | async) < (todos$ | async)?.length">Clear completed</button>
</footer>
```

### `src/app/components/todo-list/todo-list.component.css`

```css
/* Styles specific to the todo list component */
```

### `src/app/components/todo-item/todo-item.component.ts`

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { toggleTodo, removeTodo, editTodo, updateTodo, revertEditTodo } from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  editing: boolean = false;
  editedTitle: string = '';
  originalTitle: string = '';

  constructor(private store: Store) { }

  ngOnInit(): void {}

  toggleCompletion(): void {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  startEditing(): void {
    this.editing = true;
    this.editedTitle = this.todo.title;
    this.originalTitle = this.todo.title;
  }

  doneEditing(): void {
    const title = this.editedTitle.trim();
    if (title) {
      this.store.dispatch(updateTodo({ id: this.todo.id, title }));
      this.editing = false;
    } else {
      this.store.dispatch(removeTodo({ id: this.todo.id }));
    }
  }

  revertEditing(): void {
    this.editedTitle = this.originalTitle;
    this.editing = false;
    this.store.dispatch(revertEditTodo({ id: this.todo.id }));
  }

  remove(): void {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }
}
```

### `src/app/components/todo-item/todo-item.component.html`

```html
<li [ngClass]="{'completed': todo.completed, 'editing': editing}">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggleCompletion()">
    <label (dblclick)="startEditing()">{{ todo.title }}</label>
    <button class="destroy" (click)="remove()"></button>
  </div>
  <input *ngIf="editing" class="edit"
         [(ngModel)]="editedTitle"
         (blur)="doneEditing()"
         (keyup.escape)="revertEditing()"
         (keyup.enter)="doneEditing()"
         autofocus>
</li>
```

### `src/app/components/todo-item/todo-item.component.css`

```css
/* Styles specific to the todo item component */
```

### `src/app/models/todo.model.ts`

```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

### `src/app/services/todo-storage.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular-ngrx';

  getTodos(): Todo[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
  }

  setTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
  }
}
```

### `src/app/store/actions/todo.actions.ts`

```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

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

export const removeTodo = createAction(
  '[Todo] Remove Todo',
  props<{ id: number }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: number, title: string }>()
);

export const toggleAllTodos = createAction(
  '[Todo] Toggle All Todos',
  props<{ completed: boolean }>()
);

export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');

export const revertEditTodo = createAction(
  '[Todo] Revert Edit Todo',
  props<{ id: number }>()
);
```

### `src/app/store/reducers/todo.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: []
};

export const storeReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: new Date().getTime(),
      title,
      completed: false
    };
    return { ...state, todos: [...state.todos, newTodo] };
  }),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.updateTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(TodoActions.toggleAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.revertEditTodo, (state, { id }) => ({
    ...state
    // Logic for reverting can be handled via effects or additional state
  }))
);
```

### `src/app/store/selectors/todo.selectors.ts`

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectRemainingCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectAllChecked = createSelector(
  selectTodos,
  (todos) => todos.length > 0 && todos.every(todo => todo.completed)
);
```

### `src/app/store/effects/todo.effects.ts`

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/todo.actions';
import { TodoStorageService } from '../../services/todo-storage.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() => {
        const todos = this.todoStorage.getTodos();
        return of(TodoActions.loadTodosSuccess({ todos }));
      })
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.removeTodo,
        TodoActions.updateTodo,
        TodoActions.toggleAllTodos,
        TodoActions.clearCompletedTodos
      ),
      tap(() => {
        this.todoStorage.setTodos(this.todoStorage.getTodos());
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoStorage: TodoStorageService
  ) {}
}
```

### `src/environments/environment.ts`

```typescript
export const environment = {
  production: false
};
```

### `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true
};
```

### `angular.json`

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "todomvc-ngrx": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/todomvc-ngrx",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css",
              "src/styles.css"
            ],
            "scripts": []
          }
        },
        "serve": {
          "options": {
            "browserTarget": "todomvc-ngrx:build"
          }
        }
      }
    }
  },
  "defaultProject": "todomvc-ngrx"
}
```

### `package.json`

```json
{
  "name": "todomvc-ngrx",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~14.0.0",
    "@angular/common": "~14.0.0",
    "@angular/compiler": "~14.0.0",
    "@angular/core": "~14.0.0",
    "@angular/forms": "~14.0.0",
    "@angular/platform-browser": "~14.0.0",
    "@angular/platform-browser-dynamic": "~14.0.0",
    "@angular/router": "~14.0.0",
    "@ngrx/effects": "^14.0.0",
    "@ngrx/store": "^14.0.0",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "todomvc-app-css": "^2.3.0",
    "todomvc-common": "^1.0.0",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~14.0.0",
    "@angular/cli": "~14.0.0",
    "@angular/compiler-cli": "~14.0.0",
    "@types/jasmine": "~4.0.0",
    "jasmine-core": "~4.3.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.0.0",
    "typescript": "~4.7.2"
  }
}
```

### `tsconfig.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "module": "es2020",
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}
```

### `src/styles.css`

```css
/* You can add global styles to this file, and also import other style files */
```

### Tokens: {'input_tokens': 2401, 'output_tokens': 4829, 'reasoning_tokens': 640}
### Execution time: 25.655272006988525
