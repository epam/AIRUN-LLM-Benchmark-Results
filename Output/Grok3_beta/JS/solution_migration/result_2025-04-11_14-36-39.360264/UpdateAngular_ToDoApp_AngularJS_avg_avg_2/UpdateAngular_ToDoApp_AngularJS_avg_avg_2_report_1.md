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
I'll migrate the provided AngularJS application to Angular 14.x with a modern architecture. I'll break this down into multiple files following Angular best practices and the requirements specified.

### 1. Project Structure
First, let's define the new project structure following Angular conventions:

```
src/
├── app/
│   ├── components/
│   │   ├── todo-app/
│   │   ├── todo-header/
│   │   ├── todo-list/
│   │   ├── todo-item/
│   │   └── todo-footer/
│   ├── directives/
│   ├── services/
│   ├── state/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── app.module.ts
├── assets/
└── styles.css
```

### 2. Core Application Files

**src/app/app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { TodoStorageService } from './services/todo-storage.service';
import { todoReducer } from './state/reducers/todo.reducer';
import { TodoEffects } from './state/effects/todo.effects';

const routes: Routes = [
  { path: '', component: TodoAppComponent },
  { path: 'active', component: TodoAppComponent },
  { path: 'completed', component: TodoAppComponent }
];

@NgModule({
  declarations: [
    TodoAppComponent,
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
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [TodoStorageService],
  bootstrap: [TodoAppComponent]
})
export class AppModule { }
```

**src/app/app.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<todo-app></todo-app>`,
})
export class AppComponent { }
```

### 3. State Management with NgRx

**src/app/state/actions/todo.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: number, title: string }>());
```

**src/app/state/reducers/todo.reducer.ts**
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

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false }]
  })),
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  }))
);
```

**src/app/state/selectors/todo.selectors.ts**
```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';
import { Todo } from '../../models/todo.model';

export const selectTodoState = createFeatureSelector<TodoState>('todos');
export const selectAllTodos = createSelector(selectTodoState, state => state.todos);
export const selectActiveTodos = createSelector(selectAllTodos, todos => todos.filter(todo => !todo.completed));
export const selectCompletedTodos = createSelector(selectAllTodos, todos => todos.filter(todo => todo.completed));
export const selectRemainingCount = createSelector(selectActiveTodos, todos => todos.length);
export const selectAllChecked = createSelector(selectRemainingCount, count => count === 0);
```

**src/app/state/effects/todo.effects.ts**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap, mergeMap } from 'rxjs/operators';
import * as TodoActions from '../actions/todo.actions';
import { TodoStorageService } from '../../services/todo-storage.service';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    mergeMap(() => this.storageService.get().pipe(
      map(todos => TodoActions.loadTodosSuccess({ todos }))
    ))
  ));

  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.removeTodo,
      TodoActions.toggleTodo,
      TodoActions.toggleAll,
      TodoActions.clearCompleted,
      TodoActions.editTodo
    ),
    tap(() => this.storageService.save())
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private storageService: TodoStorageService
  ) {}
}
```

### 4. Model Definition

**src/app/models/todo.model.ts**
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

### 5. Components

**src/app/components/todo-app/todo-app.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from '../../state/actions/todo.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { selectAllTodos, selectActiveTodos, selectCompletedTodos } from '../../state/selectors/todo.selectors';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit {
  todos$!: Observable<Todo[]>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.dispatch(loadTodos());
    this.route.url.subscribe(url => {
      const path = url.length ? url[0].path : '';
      switch (path) {
        case 'active':
          this.todos$ = this.store.select(selectActiveTodos);
          break;
        case 'completed':
          this.todos$ = this.store.select(selectCompletedTodos);
          break;
        default:
          this.todos$ = this.store.select(selectAllTodos);
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
```

**src/app/components/todo-app/todo-app.component.html**
```html
<section class="todoapp">
  <todo-header></todo-header>
  <section class="main" *ngIf="(todos$ | async)?.length">
    <todo-list [todos]="todos$ | async"></todo-list>
  </section>
  <todo-footer *ngIf="(todos$ | async)?.length" (navigate)="navigate($event)"></todo-footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

**src/app/components/todo-header/todo-header.component.ts**
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, toggleAll } from '../../state/actions/todo.actions';
import { selectAllChecked } from '../../state/selectors/todo.selectors';

@Component({
  selector: 'todo-header',
  templateUrl: './todo-header.component.html'
})
export class TodoHeaderComponent {
  newTodo = '';
  allChecked$ = this.store.select(selectAllChecked);

  constructor(private store: Store) {}

  addTodoItem() {
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo }));
      this.newTodo = '';
    }
  }

  toggleAllTodos() {
    this.allChecked$.subscribe(checked => {
      this.store.dispatch(toggleAll({ completed: !checked }));
    });
  }
}
```

**src/app/components/todo-header/todo-header.component.html**
```html
<header class="header">
  <h1>todos</h1>
  <form class="todo-form" (ngSubmit)="addTodoItem()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" autofocus>
  </form>
  <input id="toggle-all" class="toggle-all" type="checkbox" [ngModel]="allChecked$ | async" (click)="toggleAllTodos()">
  <label for="toggle-all">Mark all as complete</label>
</header>
```

**src/app/components/todo-list/todo-list.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
}
```

**src/app/components/todo-list/todo-list.component.html**
```html
<ul class="todo-list">
  <todo-item *ngFor="let todo of todos; trackBy: trackById" [todo]="todo"></todo-item>
</ul>
```

**src/app/components/todo-item/todo-item.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { toggleTodo, removeTodo, editTodo } from '../../state/actions/todo.actions';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  editing = false;
  editedTitle = '';

  constructor(private store: Store) {}

  toggleCompleted() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  startEditing() {
    this.editing = true;
    this.editedTitle = this.todo.title;
  }

  doneEditing() {
    if (this.editedTitle.trim()) {
      this.store.dispatch(editTodo({ id: this.todo.id, title: this.editedTitle }));
    } else {
      this.remove();
    }
    this.editing = false;
  }

  revertEditing() {
    this.editing = false;
  }

  remove() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }
}
```

**src/app/components/todo-item/todo-item.component.html**
```html
<li [ngClass]="{completed: todo.completed, editing: editing}">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggleCompleted()">
    <label (dblclick)="startEditing()">{{todo.title}}</label>
    <button class="destroy" (click)="remove()"></button>
  </div>
  <form (ngSubmit)="doneEditing()">
    <input class="edit" [(ngModel)]="editedTitle" (blur)="doneEditing()" todoFocus="editing" todoEscape="revertEditing()">
  </form>
</li>
```

**src/app/components/todo-footer/todo-footer.component.ts**
```typescript
import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCompleted } from '../../state/actions/todo.actions';
import { selectRemainingCount } from '../../state/selectors/todo.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  @Output() navigate = new EventEmitter<string>();
  remainingCount$ = this.store.select(selectRemainingCount);
  currentPath = this.router.url;

  constructor(private store: Store, private router: Router) {}

  clearCompletedTodos() {
    this.store.dispatch(clearCompleted());
  }

  navigateTo(path: string) {
    this.navigate.emit(path);
  }
}
```

**src/app/components/todo-footer/todo-footer.component.html**
```html
<footer class="footer">
  <span class="todo-count">
    <strong>{{remainingCount$ | async}}</strong>
    {{(remainingCount$ | async) === 1 ? 'item left' : 'items left'}}
  </span>
  <ul class="filters">
    <li>
      <a [class.selected]="currentPath === '/'" (click)="navigateTo('')">All</a>
    </li>
    <li>
      <a [class.selected]="currentPath === '/active'" (click)="navigateTo('active')">Active</a>
    </li>
    <li>
      <a [class.selected]="currentPath === '/completed'" (click)="navigateTo('completed')">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" (click)="clearCompletedTodos()" *ngIf="(remainingCount$ | async) < (todos$ | async)?.length">
    Clear completed
  </button>
</footer>
```

### 6. Directives

**src/app/directives/todo-focus.directive.ts**
```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('todoFocus') condition!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['condition'] && this.condition) {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

**src/app/directives/todo-escape.directive.ts**
```typescript
import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output('todoEscape') escape = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.escape.emit();
    }
  }
}
```

### 7. Services

**src/app/services/todo-storage.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { selectAllTodos } from '../state/selectors/todo.selectors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {
  private STORAGE_ID = 'todos-angularjs-requirejs';

  constructor(private store: Store) {}

  get(): Observable<Todo[]> {
    return new Observable(observer => {
      const todos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
      observer.next(todos);
      observer.complete();
    });
  }

  save(): void {
    this.store.select(selectAllTodos).subscribe(todos => {
      localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    });
  }
}
```

### 8. Styles and Assets
Ensure the original CSS files from `todomvc-common` and `todomvc-app-css` are copied to the `src/assets` folder and referenced in `angular.json`:

**angular.json (partial)**
```json
"styles": [
  "src/styles.css",
  "src/assets/base.css",
  "src/assets/index.css"
]
```

### Summary of Changes and Optimizations
1. **Migration to Angular 14.x**: Converted AngularJS components, directives, and services to Angular syntax, removed RequireJS, and implemented ES modules.
2. **State Management**: Implemented NgRx for state management with actions, reducers, selectors, and effects for handling side effects like localStorage persistence.
3. **Component Architecture**: Split the monolithic controller into separate components for header, list, item, and footer with proper input/output communication.
4. **Services**: Converted AngularJS services to Angular injectable services with proper dependency injection.
5. **Templates**: Updated HTML templates to use Angular syntax with proper event and property bindings.
6. **Directives**: Converted custom directives to Angular directives using modern lifecycle hooks.
7. **Optimizations**: Applied Angular best practices, used TypeScript features, implemented trackBy for lists, and used async pipe for observables to prevent memory leaks.
8. **Code Quality**: Followed Angular style guide, removed deprecated patterns, and ensured no TODOs remain in the code.

This implementation provides a modern, maintainable, and performant TodoMVC application in Angular 14.x. You can further enhance it by adding unit tests, additional error handling, or lazy loading for routes if needed.

### Tokens: {'input_tokens': 2478, 'output_tokens': 4018, 'reasoning_tokens': 0}
### Execution time: 44.03921914100647
