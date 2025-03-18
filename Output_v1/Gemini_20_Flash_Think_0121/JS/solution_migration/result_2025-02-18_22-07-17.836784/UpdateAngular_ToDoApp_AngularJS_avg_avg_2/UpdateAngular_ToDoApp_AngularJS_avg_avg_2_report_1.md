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

js/main.js
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

js/app.js
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

js/directives/todoFocus.js
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

js/directives/todoEscape.js
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

js/controllers/todo.js
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

js/services/todoStorage.js
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
```markdown
```typescript
// angular.json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "todo-app": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "css"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/todo-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css",
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "todo-app:build:production"
            },
            "development": {
              "browserTarget": "todo-app:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "todo-app:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css",
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css"
            ],
            "scripts": []
          }
        }
      }
    }
  },
  "cli": {
    "analytics": "1b64b39f-4467-4a9d-b7a8-295553a67c91"
  }
}
```

```typescript
// package.json
{
  "name": "todo-app",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^14.2.0",
    "@angular/common": "^14.2.0",
    "@angular/compiler": "^14.2.0",
    "@angular/core": "^14.2.0",
    "@angular/forms": "^14.2.0",
    "@angular/platform-browser": "^14.2.0",
    "@angular/platform-browser-dynamic": "^14.2.0",
    "@angular/router": "^14.2.0",
    "@ngrx/effects": "^14.3.0",
    "@ngrx/store": "^14.3.0",
    "@ngrx/store-devtools": "^14.3.0",
    "rxjs": "~7.5.0",
    "todomvc-app-css": "^2.3.0",
    "todomvc-common": "^1.0.5",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^14.2.1",
    "@angular/cli": "~14.2.1",
    "@angular/compiler-cli": "^14.2.0",
    "@ngrx/schematics": "^14.3.0",
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

```typescript
// src/index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular 14 • TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app-root></app-root>
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

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
```

```html
<!-- src/app/app.component.html -->
<section class="todoapp">
  <app-todo-header></app-todo-header>
  <app-todo-list></app-todo-list>
  <app-todo-footer></app-todo-footer>
</section>
```

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { TodoService } from './services/todo.service';
import { reducers, metaReducers } from './reducers';
import { TodoEffects } from './effects/todo.effects';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([TodoEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { isDevMode } from '@angular/core';
```

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: ':filter', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

```typescript
// src/app/components/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../actions/todo.actions';
import { AppState } from '../../reducers';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodoText: string = '';

  constructor(private store: Store<AppState>) { }

  addTodo(): void {
    if (this.newTodoText.trim().length > 0) {
      this.store.dispatch(addTodo({ text: this.newTodoText }));
      this.newTodoText = '';
    }
  }
}
```

```html
<!-- src/app/components/todo-header/todo-header.component.html -->
<header class="header">
  <h1>todos</h1>
  <input class="new-todo" placeholder="What needs to be done?" autofocus="" [(ngModel)]="newTodoText" (keyup.enter)="addTodo()">
</header>
```

```typescript
// src/app/components/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { toggleAll, updateTodo, removeTodo, toggleTodo, editTodo } from '../../actions/todo.actions';
import { selectVisibleTodos, selectAreAllTodosMarked } from '../../selectors/todo.selectors';
import { Todo } from '../../models/todo.model';
import { ActivatedRoute } from '@angular/router';
import { setFilter } from '../../actions/filter.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filter: string = 'all';
  allCompleted: boolean = false;
  editingTodoId: number | null = null;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.store.dispatch(setFilter({ filter: this.filter }));
    });

    this.store.select(selectVisibleTodos).subscribe(todos => this.todos = todos);
    this.store.select(selectAreAllTodosMarked).subscribe(allCompleted => this.allCompleted = allCompleted);
  }

  toggleAll(): void {
    this.store.dispatch(toggleAll({ completed: !this.allCompleted }));
  }

  toggleTodo(id: number): void {
    this.store.dispatch(toggleTodo({ id }));
  }

  removeTodo(id: number): void {
    this.store.dispatch(removeTodo({ id }));
  }

  editTodo(id: number): void {
    this.editingTodoId = id;
  }

  doneEditing(id: number, text: string): void {
    this.editingTodoId = null;
    if (text.trim().length === 0) {
      this.removeTodo(id);
    } else {
      this.store.dispatch(updateTodo({ id, text: text.trim() }));
    }
  }

  cancelEditing(): void {
    this.editingTodoId = null;
  }
}
```

```html
<!-- src/app/components/todo-list/todo-list.component.html -->
<section class="main" *ngIf="todos.length > 0">
  <input id="toggle-all" class="toggle-all" type="checkbox" [ngModel]="allCompleted" (ngModelChange)="toggleAll()">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let todo of todos; trackBy: trackByFn" [class.completed]="todo.completed" [class.editing]="editingTodoId === todo.id">
      <div class="view">
        <input class="toggle" type="checkbox" [ngModel]="todo.completed" (ngModelChange)="toggleTodo(todo.id!)">
        <label (dblclick)="editTodo(todo.id!)">{{ todo.text }}</label>
        <button class="destroy" (click)="removeTodo(todo.id!)"></button>
      </div>
      <input class="edit" *ngIf="editingTodoId === todo.id" appTodoFocus [value]="todo.text" #editInput
             (blur)="doneEditing(todo.id!, editInput.value)"
             (todoEscape)="cancelEditing()"
             (keyup.enter)="doneEditing(todo.id!, editInput.value)">
    </li>
  </ul>
</section>
```

```typescript
// src/app/components/todo-item/todo-item.component.ts (Not needed, integrated into todo-list-component)
// src/app/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { clearCompleted } from '../../actions/todo.actions';
import { setFilter } from '../../actions/filter.actions';
import { selectActiveTodosCount, selectCompletedTodosCount, selectFilter } from '../../selectors/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  activeCount: number = 0;
  completedCount: number = 0;
  currentFilter: string = 'all';

  constructor(private store: Store<AppState>) {
    this.store.select(selectActiveTodosCount).subscribe(count => this.activeCount = count);
    this.store.select(selectCompletedTodosCount).subscribe(count => this.completedCount = count);
    this.store.select(selectFilter).subscribe(filter => this.currentFilter = filter);
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }

  changeFilter(filter: string): void {
    this.store.dispatch(setFilter({ filter }));
  }
}
```

```html
<!-- src/app/components/todo-footer/todo-footer.component.html -->
<footer class="footer" *ngIf="(activeCount + completedCount) > 0">
  <span class="todo-count"><strong>{{ activeCount }}</strong> item left</span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/']" [class.selected]="currentFilter === 'all'">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']" [class.selected]="currentFilter === 'active'">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']" [class.selected]="currentFilter === 'completed'">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" *ngIf="completedCount > 0" (click)="clearCompleted()">Clear completed</button>
</footer>
```

```typescript
// src/app/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
  }
}
```

```typescript
// src/app/directives/todo-escape.directive.ts
import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter<void>();

  @HostListener('keyup.escape') onEscape() {
    this.todoEscape.emit();
  }
}
```

```typescript
// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoService {
  private static readonly STORAGE_KEY = 'todos-angular-ngrx';

  getTodos(): Todo[] {
    const todosString = localStorage.getItem(TodoService.STORAGE_KEY);
    return todosString ? JSON.parse(todosString) : [];
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(TodoService.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

```typescript
// src/app/actions/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[TODO] Add Todo',
  props<{ text: string }>()
);

export const toggleTodo = createAction(
  '[TODO] Toggle Todo',
  props<{ id: number }>()
);

export const updateTodo = createAction(
  '[TODO] Update Todo',
  props<{ id: number, text: string }>()
);

export const removeTodo = createAction(
  '[TODO] Remove Todo',
  props<{ id: number }>()
);

export const toggleAll = createAction(
  '[TODO] Toggle All',
  props<{ completed: boolean }>()
);

export const clearCompleted = createAction(
  '[TODO] Clear Completed'
);

export const setTodos = createAction(
  '[TODO] Set Todos',
  props<{ todos: Todo[] }>()
);
```

```typescript
// src/app/actions/filter.actions.ts
import { createAction, props } from '@ngrx/store';

export const setFilter = createAction(
  '[Filter] Set Filter',
  props<{ filter: string }>()
);
```

```typescript
// src/app/reducers/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { addTodo, toggleTodo, updateTodo, removeTodo, toggleAll, clearCompleted, setTodos } from '../actions/todo.actions';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(setTodos, (state, { todos }) => todos),
  on(addTodo, (state, { text }) => [...state, new Todo(text)]),
  on(toggleTodo, (state, { id }) => {
    return state.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        };
      } else {
        return todo;
      }
    });
  }),
  on(updateTodo, (state, { id, text }) => {
    return state.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          text: text
        };
      } else {
        return todo;
      }
    });
  }),
  on(removeTodo, (state, { id }) => state.filter(todo => todo.id !== id)),
  on(toggleAll, (state, { completed }) => {
    return state.map(todo => {
      return {
        ...todo,
        completed: completed
      };
    });
  }),
  on(clearCompleted, (state) => state.filter(todo => !todo.completed)),
);
import { setFilter } from '../actions/filter.actions';
```

```typescript
// src/app/reducers/filter.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setFilter } from '../actions/filter.actions';

export const initialState: string = 'all';

export const filterReducer = createReducer(
  initialState,
  on(setFilter, (state, { filter }) => filter),
);
```

```typescript
// src/app/reducers/index.ts
import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { todoReducer } from './todo.reducer';
import { filterReducer } from './filter.reducer';
import { Todo } from '../models/todo.model';
import { Filter } from '../models/filter.model';

export interface AppState {
  todos: Todo[];
  filter: Filter;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: todoReducer,
  filter: filterReducer
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
```

```typescript
// src/app/effects/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import * as TodoActions from '../actions/todo.actions';
import { TodoService } from '../services/todo.service';

@Injectable()
export class TodoEffects {

  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.setTodos), // Could be any action to trigger load
    map(() => TodoActions.setTodos({ todos: this.todoService.getTodos() }))
  ));


  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.toggleTodo,
      TodoActions.updateTodo,
      TodoActions.removeTodo,
      TodoActions.toggleAll,
      TodoActions.clearCompleted
    ),
    tap(actions => this.todoService.saveTodos(this.todoService.getTodos())) // Re-save all todos after any change
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) { }

}
```

```typescript
// src/app/models/todo.model.ts
export class Todo {
  public id?: number;
  public completed: boolean;

  constructor(public text: string) {
    this.text = text.trim();
    this.completed = false;
    this.id = new Date().getTime(); // Simple ID generation
  }
}
```

```typescript
// src/app/models/filter.model.ts
export type Filter = 'all' | 'active' | 'completed';
```

```typescript
// src/app/selectors/todo.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { Filter } from '../models/filter.model';

export const selectTodos = (state: AppState) => state.todos;
export const selectFilterType = (state: AppState) => state.filter;

export const selectVisibleTodos = createSelector(
  selectTodos,
  selectFilterType,
  (todos, filter: Filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveTodosCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedTodosCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);

export const selectAreAllTodosMarked = createSelector(
  selectTodos,
  todos => todos.every(todo => todo.completed)
);

export const selectFilter = createSelector(
  selectFilterType,
  (filter) => filter
);
```

```typescript
// src/app/pipes/filter.pipe.ts (Not needed, filter logic is in selector)
```

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```typescript
// src/polyfills.ts
import 'zone.js/plugins/browser';
```

```typescript
// src/styles.css
/* You can add global styles to this file, and also import other style files */
```


### Tokens: {'input_tokens': 2591, 'output_tokens': 6425}
### Execution time: 26.242817163467407
