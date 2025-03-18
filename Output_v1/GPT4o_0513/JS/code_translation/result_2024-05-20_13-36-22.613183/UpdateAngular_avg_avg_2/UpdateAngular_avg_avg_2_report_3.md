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

## Run 3:
### Answer:
```typescript
// index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & RequireJS • TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
  <style>[ng-cloak] { display: none; }</style>
</head>
<body>
  <app-root></app-root>
  <script src="node_modules/todomvc-common/base.js"></script>
</body>
</html>
```

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoModule } from './todo/todo.module';
import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects/todo.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TodoModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-todo></app-todo>',
  styles: []
})
export class AppComponent { }
```

```typescript
// src/app/todo/todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoItemComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TodoComponent
  ]
})
export class TodoModule { }
```

```typescript
// src/app/todo/todo.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { AppState } from '../store/app.state';
import { addTodo, clearCompleted, markAll, setFilter } from '../store/actions/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todos$: Observable<Todo[]>;
  newTodo: string = '';
  filter$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.todos$ = store.select('todos');
    this.filter$ = store.select('filter');
  }

  addTodo() {
    if (this.newTodo.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }

  markAll(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(markAll({ completed: target.checked }));
  }

  setFilter(filter: string) {
    this.store.dispatch(setFilter({ filter }));
  }
}
```

```html
<!-- src/app/todo/todo.component.html -->
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form (submit)="addTodo()">
      <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
    </form>
  </header>
  <section class="main" *ngIf="(todos$ | async)?.length">
    <input id="toggle-all" class="toggle-all" type="checkbox" (click)="markAll($event)">
    <label for="toggle-all">Mark all as complete</label>
    <app-todo-list [todos]="todos$ | async"></app-todo-list>
  </section>
  <footer class="footer" *ngIf="(todos$ | async)?.length">
    <app-todo-footer [todos]="todos$ | async" (clearCompleted)="clearCompleted()" (setFilter)="setFilter($event)"></app-todo-footer>
  </footer>
</section>
```

```typescript
// src/app/todo/todo-list/todo-list.component.ts
import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
}
```

```html
<!-- src/app/todo/todo-list/todo-list.component.html -->
<ul class="todo-list">
  <li *ngFor="let todo of todos" [ngClass]="{completed: todo.completed, editing: todo.editing}">
    <app-todo-item [todo]="todo"></app-todo-item>
  </li>
</ul>
```

```typescript
// src/app/todo/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { AppState } from '../../store/app.state';
import { editTodo, removeTodo, toggleTodo, updateTodo } from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo: Todo;
  editedTodo: Todo;

  constructor(private store: Store<AppState>) { }

  editTodo() {
    this.editedTodo = { ...this.todo };
    this.store.dispatch(editTodo({ todo: this.todo }));
  }

  doneEditing() {
    if (this.editedTodo.title.trim().length) {
      this.store.dispatch(updateTodo({ todo: this.editedTodo }));
    } else {
      this.store.dispatch(removeTodo({ todo: this.todo }));
    }
    this.editedTodo = null;
  }

  revertEditing() {
    this.editedTodo = null;
  }

  toggleTodo() {
    this.store.dispatch(toggleTodo({ todo: this.todo }));
  }

  removeTodo() {
    this.store.dispatch(removeTodo({ todo: this.todo }));
  }
}
```

```html
<!-- src/app/todo/todo-item/todo-item.component.html -->
<div class="view">
  <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggleTodo()">
  <label (dblclick)="editTodo()">{{todo.title}}</label>
  <button class="destroy" (click)="removeTodo()"></button>
</div>
<form *ngIf="todo.editing" (submit)="doneEditing()">
  <input class="edit" [(ngModel)]="editedTodo.title" name="title" (blur)="doneEditing()" appTodoEscape="revertEditing()">
</form>
```

```typescript
// src/app/todo/todo-footer/todo-footer.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() todos: Todo[] = [];
  @Output() clearCompleted = new EventEmitter<void>();
  @Output() setFilter = new EventEmitter<string>();

  get remainingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get doneCount(): number {
    return this.todos.length - this.remainingCount;
  }

  clearCompletedTodos() {
    this.clearCompleted.emit();
  }

  changeFilter(filter: string) {
    this.setFilter.emit(filter);
  }
}
```

```html
<!-- src/app/todo/todo-footer/todo-footer.component.html -->
<span class="todo-count"><strong>{{remainingCount}}</strong> <ng-pluralize [count]="remainingCount" [when]="{ one: 'item left', other: 'items left' }"></ng-pluralize></span>
<ul class="filters">
  <li>
    <a href="#/" (click)="changeFilter('all')" [ngClass]="{selected: filter === 'all'}">All</a>
  </li>
  <li>
    <a href="#/active" (click)="changeFilter('active')" [ngClass]="{selected: filter === 'active'}">Active</a>
  </li>
  <li>
    <a href="#/completed" (click)="changeFilter('completed')" [ngClass]="{selected: filter === 'completed'}">Completed</a>
  </li>
</ul>
<button class="clear-completed" (click)="clearCompletedTodos()" *ngIf="doneCount">Clear completed</button>
```

```typescript
// src/app/todo/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') isFocused: boolean;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFocused'] && this.isFocused) {
      this.el.nativeElement.focus();
    }
  }
}
```

```typescript
// src/app/todo/directives/todo-escape.directive.ts
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.appTodoEscape.emit();
    }
  }
}
```

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  title: string;
  completed: boolean;
  editing?: boolean;
}
```

```typescript
// src/app/store/app.state.ts
import { Todo } from '../models/todo.model';

export interface AppState {
  todos: Todo[];
  filter: string;
}
```

```typescript
// src/app/store/reducers/index.ts
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../app.state';
import { todoReducer } from './todo.reducer';
import { filterReducer } from './filter.reducer';

export const reducers: ActionReducerMap<AppState> = {
  todos: todoReducer,
  filter: filterReducer
};
```

```typescript
// src/app/store/reducers/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { addTodo, clearCompleted, editTodo, markAll, removeTodo, toggleTodo, updateTodo } from '../actions/todo.actions';

export const initialState: Todo[] = [];

const _todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => [...state, { title, completed: false }]),
  on(removeTodo, (state, { todo }) => state.filter(t => t !== todo)),
  on(toggleTodo, (state, { todo }) => state.map(t => t === todo ? { ...t, completed: !t.completed } : t)),
  on(editTodo, (state, { todo }) => state.map(t => t === todo ? { ...t, editing: true } : t)),
  on(updateTodo, (state, { todo }) => state.map(t => t === todo ? { ...todo, editing: false } : t)),
  on(clearCompleted, state => state.filter(t => !t.completed)),
  on(markAll, (state, { completed }) => state.map(t => ({ ...t, completed })))
);

export function todoReducer(state, action) {
  return _todoReducer(state, action);
}
```

```typescript
// src/app/store/reducers/filter.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setFilter } from '../actions/todo.actions';

export const initialState = 'all';

const _filterReducer = createReducer(
  initialState,
  on(setFilter, (state, { filter }) => filter)
);

export function filterReducer(state, action) {
  return _filterReducer(state, action);
}
```

```typescript
// src/app/store/actions/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ todo: Todo }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ todo: Todo }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const markAll = createAction('[Todo] Mark All', props<{ completed: boolean }>());
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
```

```typescript
// src/app/store/effects/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { addTodo, clearCompleted, markAll, removeTodo, toggleTodo, updateTodo } from '../actions/todo.actions';
import { Todo } from '../../models/todo.model';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) { }

  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo, removeTodo, toggleTodo, updateTodo, clearCompleted, markAll),
      tap(action => {
        const todos: Todo[] = JSON.parse(localStorage.getItem('todos-angularjs-requirejs') || '[]');
        localStorage.setItem('todos-angularjs-requirejs', JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );
}
```

### Tokens: {'input_tokens': 2275, 'output_tokens': 3294}
### Execution time: 64.28110980987549
