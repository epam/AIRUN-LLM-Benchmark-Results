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
```typescript
// src/index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Angular & NgRx • TodoMVC</title>
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
import { todoReducer } from './todo/store/todo.reducer';
import { TodoEffects } from './todo/store/todo.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TodoModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-header></app-todo-header>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
  `,
  styles: []
})
export class AppComponent {}
```

```typescript
// src/app/todo/todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoItemComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [CommonModule, FormsModule],
  exports: [TodoHeaderComponent, TodoListComponent, TodoFooterComponent]
})
export class TodoModule {}
```

```typescript
// src/app/todo/components/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="onSubmit()">
        <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" name="newTodo" autofocus>
      </form>
    </header>
  `,
  styles: []
})
export class TodoHeaderComponent {
  newTodo = '';

  constructor(private store: Store) {}

  onSubmit() {
    if (this.newTodo.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }
}
```

```typescript
// src/app/todo/components/todo-list/todo-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectFilteredTodos } from '../../store/todo.selectors';
import { markAllTodos } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todos$ | async as todos">
      <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allChecked" (click)="markAll($event)">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item *ngFor="let todo of todos" [todo]="todo"></app-todo-item>
      </ul>
    </section>
  `,
  styles: []
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  allChecked = false;

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectFilteredTodos);
  }

  markAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(markAllTodos({ completed: checked }));
  }
}
```

```typescript
// src/app/todo/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { clearCompletedTodos } from '../../store/todo.actions';
import { selectRemainingCount, selectTodosCount } from '../../store/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="todosCount$ | async as todosCount">
      <span class="todo-count"><strong>{{ remainingCount$ | async }}</strong> <ng-container *ngIf="remainingCount$ | async as remainingCount">{{ remainingCount === 1 ? 'item' : 'items' }} left</ng-container></span>
      <ul class="filters">
        <li><a [routerLink]="['/']" routerLinkActive="selected" [routerLinkActiveOptions]="{ exact: true }">All</a></li>
        <li><a [routerLink]="['/active']" routerLinkActive="selected">Active</a></li>
        <li><a [routerLink]="['/completed']" routerLinkActive="selected">Completed</a></li>
      </ul>
      <button class="clear-completed" *ngIf="remainingCount$ | async < todosCount" (click)="clearCompleted()">Clear completed</button>
    </footer>
  `,
  styles: []
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  todosCount$: Observable<number>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.todosCount$ = this.store.select(selectTodosCount);
  }

  clearCompleted() {
    this.store.dispatch(clearCompletedTodos());
  }
}
```

```typescript
// src/app/todo/components/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { editTodo, removeTodo, toggleTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [ngClass]="{ completed: todo.completed, editing: editing }">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggle()">
        <label (dblclick)="edit()">{{ todo.title }}</label>
        <button class="destroy" (click)="remove()"></button>
      </div>
      <input class="edit" *ngIf="editing" [(ngModel)]="todo.title" (blur)="doneEditing()" (keyup.enter)="doneEditing()" (keyup.esc)="revertEditing()">
    </li>
  `,
  styles: []
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  editing = false;
  originalTitle = '';

  constructor(private store: Store) {}

  toggle() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  edit() {
    this.editing = true;
    this.originalTitle = this.todo.title;
  }

  doneEditing() {
    if (this.todo.title.trim()) {
      this.store.dispatch(editTodo({ id: this.todo.id, title: this.todo.title.trim() }));
    } else {
      this.remove();
    }
    this.editing = false;
  }

  revertEditing() {
    this.todo.title = this.originalTitle;
    this.editing = false;
  }

  remove() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }
}
```

```typescript
// src/app/todo/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') isFocused = false;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFocused'] && this.isFocused) {
      this.el.nativeElement.focus();
    }
  }
}
```

```typescript
// src/app/todo/directives/todo-escape.directive.ts
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.appTodoEscape.emit();
    }
  }
}
```

```typescript
// src/app/todo/models/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

```typescript
// src/app/todo/store/todo.actions.ts
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: number, title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');
export const markAllTodos = createAction('[Todo] Mark All Todos', props<{ completed: boolean }>());
```

```typescript
// src/app/todo/store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, editTodo, removeTodo, clearCompletedTodos, markAllTodos } from './todo.actions';
import { Todo } from '../models/todo.model';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => [
    ...state,
    { id: Date.now(), title, completed: false }
  ]),
  on(toggleTodo, (state, { id }) => state.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  on(editTodo, (state, { id, title }) => state.map(todo => todo.id === id ? { ...todo, title } : todo)),
  on(removeTodo, (state, { id }) => state.filter(todo => todo.id !== id)),
  on(clearCompletedTodos, state => state.filter(todo => !todo.completed)),
  on(markAllTodos, (state, { completed }) => state.map(todo => ({ ...todo, completed })))
);
```

```typescript
// src/app/todo/store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { addTodo, toggleTodo, editTodo, removeTodo, clearCompletedTodos, markAllTodos } from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) {}

  persistTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo, toggleTodo, editTodo, removeTodo, clearCompletedTodos, markAllTodos),
      tap(() => {
        const todos = JSON.parse(localStorage.getItem('todos-angular-ngrx') || '[]');
        localStorage.setItem('todos-angular-ngrx', JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );
}
```

```typescript
// src/app/todo/store/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const selectTodos = createFeatureSelector<Todo[]>('todos');

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectTodosCount = createSelector(
  selectTodos,
  todos => todos.length
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (todos, props) => {
    const path = props.path;
    if (path === '/active') {
      return todos.filter(todo => !todo.completed);
    } else if (path === '/completed') {
      return todos.filter(todo => todo.completed);
    } else {
      return todos;
    }
  }
);
```

### Tokens: {'input_tokens': 2275, 'output_tokens': 3095}
### Execution time: 34.93477201461792
