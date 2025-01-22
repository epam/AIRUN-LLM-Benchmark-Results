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
# angular.json

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "todo-app": {
      "projectType": "application",
      "schematics": {},
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
              "node_modules/todomvc-common/base.css",
              "node_modules/todomvc-app-css/index.css",
              "src/styles.css"
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
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "todo-app:build:production"
            }
          }
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
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    }
  },
  "defaultProject": "todo-app"
}
```

```markdown
# package.json

```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^14.0.0",
    "@angular/common": "^14.0.0",
    "@angular/compiler": "^14.0.0",
    "@angular/core": "^14.0.0",
    "@angular/forms": "^14.0.0",
    "@angular/platform-browser": "^14.0.0",
    "@angular/platform-browser-dynamic": "^14.0.0",
    "@ngrx/effects": "^14.3.0",
    "@ngrx/store": "^14.3.0",
    "rxjs": "~7.4.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4",
    "todomvc-app-css": "^2.4.2",
    "todomvc-common": "^1.0.5"
  },
  "devDependencies": {
    "@angular/cli": "^14.0.0",
    "@angular/compiler-cli": "^14.0.0",
    "@types/jasmine": "~3.10.0",
    "@types/node": "^12.11.1",
    "typescript": "~4.6.2"
  }
}
```

```markdown
# tsconfig.json

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2020",
    "module": "ES2020",
    "lib": [
      "ES2020",
      "dom"
    ],
    "skipLibCheck": true
  }
}
```

```markdown
# src/main.ts

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```markdown
# src/polyfills.ts

```typescript
import 'zone.js';  // Included with Angular CLI.
```

```markdown
# src/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Angular 14 Todo</title>
    <base href="/">
    <link rel="stylesheet" href="node_modules/todomvc-common/base.css" />
    <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

```markdown
# src/app/app.module.ts

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { ItemComponent } from './components/item/item.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    ItemComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ tasks: taskReducer }),
    EffectsModule.forRoot([TaskEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```markdown
# src/app/app.component.ts

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

```markdown
# src/app/app.component.html

```html
<section class="todoapp">
  <app-header></app-header>
  <app-main></app-main>
  <app-footer></app-footer>
</section>
<footer class="info">
  <p>Double-click to edit a task</p>
  <p>Part of <a href="https://todomvc.com">TodoMVC</a></p>
</footer>
```

```markdown
# src/app/models/task.model.ts

```typescript
export interface Task {
  title: string;
  completed: boolean;
}
```

```markdown
# src/app/services/task-storage.service.ts

```typescript
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly STORAGE_ID = 'tasks-angular14';

  load(): Task[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
  }

  save(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(tasks));
  }
}
```

```markdown
# src/app/store/task.actions.ts

```typescript
import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const loadTasks = createAction('[Task] Load');
export const loadTasksSuccess = createAction('[Task] Load Success', props<{ tasks: Task[] }>());
export const addTask = createAction('[Task] Add', props<{ title: string }>());
export const removeTask = createAction('[Task] Remove', props<{ index: number }>());
export const editTask = createAction('[Task] Edit', props<{ index: number; title: string }>());
export const toggleTask = createAction('[Task] Toggle', props<{ index: number }>());
export const markAll = createAction('[Task] Mark All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Task] Clear Completed');
```

```markdown
# src/app/store/task.reducer.ts

```typescript
import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
import {
  addTask, removeTask, editTask, toggleTask, loadTasksSuccess,
  markAll, clearCompleted
} from './task.actions';

export const initialState: Task[] = [];

export const taskReducer = createReducer(
  initialState,
  on(loadTasksSuccess, (_, { tasks }) => [...tasks]),
  on(addTask, (state, { title }) => [...state, { title, completed: false }]),
  on(removeTask, (state, { index }) => state.filter((_, i) => i !== index)),
  on(editTask, (state, { index, title }) => {
    return state.map((t, i) => i === index ? { ...t, title: title.trim() } : t);
  }),
  on(toggleTask, (state, { index }) => {
    return state.map((t, i) => i === index ? { ...t, completed: !t.completed } : t);
  }),
  on(markAll, (state, { completed }) => state.map(t => ({ ...t, completed }))),
  on(clearCompleted, (state) => state.filter(t => !t.completed))
);
```

```markdown
# src/app/store/task.effects.ts

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs/operators';
import { TaskStorageService } from '../services/task-storage.service';
import {
  loadTasks, loadTasksSuccess, addTask, removeTask, editTask,
  toggleTask, markAll, clearCompleted
} from './task.actions';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      mergeMap(() => {
        const data = this.storage.load();
        return of(loadTasksSuccess({ tasks: data }));
      })
    )
  );

  saveTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadTasksSuccess,
        addTask,
        removeTask,
        editTask,
        toggleTask,
        markAll,
        clearCompleted
      ),
      tap(action => {
        if (action.type !== '[Task] Load') {
          const tasks = (action as any).tasks ||
            this.storage.load().map((task, index) => {
              if (action.type === '[Task] Remove' && index === action.index) return null;
              if (action.type === '[Task] Edit' && index === action.index) {
                return { ...task, title: action.title.trim() };
              }
              if (action.type === '[Task] Toggle' && index === action.index) {
                return { ...task, completed: !task.completed };
              }
              if (action.type === '[Task] Mark All') {
                return { ...task, completed: action.completed };
              }
              if (action.type === '[Task] Clear Completed' && task.completed) return null;
              return task;
            })
            .filter((t: any) => t !== null);
          this.storage.save(tasks);
        }
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private storage: TaskStorageService
  ) {}
}
```

```markdown
# src/app/components/header/header.component.ts

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask } from '../../store/task.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  newTask = '';

  constructor(private store: Store) {}

  add(): void {
    const trimmed = this.newTask.trim();
    if (!trimmed) {
      return;
    }
    this.store.dispatch(addTask({ title: trimmed }));
    this.newTask = '';
  }
}
```

```markdown
# src/app/components/header/header.component.html

```html
<header class="header">
  <h1>Tasks</h1>
  <input
    class="new-todo"
    placeholder="What needs to be done?"
    autofocus
    [(ngModel)]="newTask"
    (keydown.enter)="add()"
  />
</header>
```

```markdown
# src/app/components/main/main.component.ts

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { markAll } from '../../store/task.actions';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  tasks$: Observable<Task[]>;
  allCompleted$: Observable<boolean>;

  constructor(private store: Store<{ tasks: Task[] }>) {
    this.tasks$ = this.store.select('tasks');
    this.allCompleted$ = this.tasks$.pipe(
      map(tasks => tasks.length > 0 && tasks.every(t => t.completed))
    );
  }

  toggleAll(checked: boolean): void {
    this.store.dispatch(markAll({ completed: checked }));
  }
}
```

```markdown
# src/app/components/main/main.component.html

```html
<section class="main" *ngIf="(tasks$ | async)?.length as total">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="(allCompleted$ | async)"
    (click)="toggleAll(! (allCompleted$ | async))"
  />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li *ngFor="let task of (tasks$ | async); let i = index;">
      <app-item [task]="task" [index]="i"></app-item>
    </li>
  </ul>
</section>
```

```markdown
# src/app/components/item/item.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../../models/task.model';
import { toggleTask, removeTask, editTask } from '../../store/task.actions';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html'
})
export class ItemComponent {
  @Input() task!: Task;
  @Input() index!: number;

  editing = false;
  editTitle = '';

  constructor(private store: Store) {}

  toggle(): void {
    this.store.dispatch(toggleTask({ index: this.index }));
  }

  remove(): void {
    this.store.dispatch(removeTask({ index: this.index }));
  }

  beginEdit(): void {
    this.editing = true;
    this.editTitle = this.task.title;
  }

  finishEdit(): void {
    this.editing = false;
    const trimmed = this.editTitle.trim();
    if (!trimmed) {
      this.remove();
    } else {
      this.store.dispatch(editTask({ index: this.index, title: trimmed }));
    }
  }

  cancelEdit(): void {
    this.editing = false;
    this.editTitle = this.task.title;
  }
}
```

```markdown
# src/app/components/item/item.component.html

```html
<div class="view" *ngIf="!editing; else editingBlock">
  <input class="toggle" type="checkbox" [checked]="task.completed" (change)="toggle()" />
  <label (dblclick)="beginEdit()">
    {{ task.title }}
  </label>
  <button class="destroy" (click)="remove()"></button>
</div>

<ng-template #editingBlock>
  <input
    class="edit"
    [(ngModel)]="editTitle"
    (blur)="finishEdit()"
    (keydown.enter)="finishEdit()"
    (keydown.escape)="cancelEdit()"
    autofocus
  />
</ng-template>
```

```markdown
# src/app/components/footer/footer.component.ts

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCompleted } from '../../store/task.actions';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  remainingCount$: Observable<number>;
  anyCompleted$: Observable<boolean>;

  constructor(private store: Store<{ tasks: Task[] }>) {
    const tasks$ = this.store.select('tasks');
    this.remainingCount$ = tasks$.pipe(
      map(tasks => tasks.filter(t => !t.completed).length)
    );
    this.anyCompleted$ = tasks$.pipe(
      map(tasks => tasks.some(t => t.completed))
    );
  }

  clearDone(): void {
    this.store.dispatch(clearCompleted());
  }
}
```

```markdown
# src/app/components/footer/footer.component.html

```html
<footer class="footer" *ngIf="(remainingCount$ | async) !== null">
  <span class="todo-count">
    <strong>{{ (remainingCount$ | async) }}</strong>
    <span>items left</span>
  </span>
  <ul class="filters">
    <li>
      <a routerLink="/">All</a>
    </li>
    <li>
      <a routerLink="/active">Active</a>
    </li>
    <li>
      <a routerLink="/completed">Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="(anyCompleted$ | async)"
    (click)="clearDone()"
  >
    Clear completed
  </button>
</footer>
```
```

### Tokens: {'input_tokens': 2274, 'output_tokens': 6719, 'reasoning_tokens': 2688}
### Execution time: 50.049870014190674
