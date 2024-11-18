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
Here's the migrated code for Angular 14.x:

app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFormComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-form></app-todo-form>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
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
  `
})
export class AppComponent { }
```

components/todo-form/todo-form.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-form',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="addTodo()">
        <input class="new-todo" 
               placeholder="What needs to be done?" 
               [(ngModel)]="newTodo" 
               name="newTodo"
               autofocus>
      </form>
    </header>
  `
})
export class TodoFormComponent {
  newTodo = '';

  constructor(private store: Store) {}

  addTodo() {
    if (this.newTodo.trim().length === 0) return;
    this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
    this.newTodo = '';
  }
}
```

components/todo-list/todo-list.component.ts
```typescript
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectVisibleTodos, selectAllCompleted } from '../../store/todo.selectors';
import { toggleAllTodos } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="(todos$ | async)?.length > 0">
      <input id="toggle-all" 
             class="toggle-all" 
             type="checkbox" 
             [checked]="allCompleted$ | async"
             (change)="toggleAll()">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item *ngFor="let todo of todos$ | async" 
                       [todo]="todo">
        </app-todo-item>
      </ul>
    </section>
  `
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;

  constructor(private store: Store) {
    this.todos$ = this.store.pipe(select(selectVisibleTodos));
    this.allCompleted$ = this.store.pipe(select(selectAllCompleted));
  }

  toggleAll() {
    this.store.dispatch(toggleAllTodos());
  }
}
```

components/todo-item/todo-item.component.ts
```typescript
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { updateTodo, removeTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input class="toggle" 
               type="checkbox" 
               [checked]="todo.completed"
               (change)="toggleCompletion()">
        <label (dblclick)="startEditing()">{{todo.title}}</label>
        <button class="destroy" (click)="removeTodo()"></button>
      </div>
      <input class="edit" 
             #editInput
             [value]="todo.title"
             (blur)="doneEditing($event)"
             (keyup.enter)="doneEditing($event)"
             (keyup.escape)="cancelEditing()">
    </li>
  `
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @ViewChild('editInput') editInput!: ElementRef;

  editing = false;
  originalTitle = '';

  constructor(private store: Store) {}

  toggleCompletion() {
    this.store.dispatch(updateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));
  }

  startEditing() {
    this.editing = true;
    this.originalTitle = this.todo.title;
    setTimeout(() => this.editInput.nativeElement.focus(), 0);
  }

  doneEditing(event: Event) {
    const input = event.target as HTMLInputElement;
    const title = input.value.trim();
    if (this.editing) {
      if (title) {
        this.store.dispatch(updateTodo({ id: this.todo.id, changes: { title } }));
      } else {
        this.removeTodo();
      }
      this.editing = false;
    }
  }

  cancelEditing() {
    this.editing = false;
  }

  removeTodo() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }
}
```

components/todo-footer/todo-footer.component.ts
```typescript
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRemainingCount, selectCompletedCount } from '../../store/todo.selectors';
import { clearCompletedTodos } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(remainingCount$ | async) as remainingCount">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong> 
        {{ remainingCount === 1 ? 'item' : 'items' }} left
      </span>
      <ul class="filters">
        <li><a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{exact: true}">All</a></li>
        <li><a routerLink="/active" routerLinkActive="selected">Active</a></li>
        <li><a routerLink="/completed" routerLinkActive="selected">Completed</a></li>
      </ul>
      <button class="clear-completed" 
              *ngIf="(completedCount$ | async) > 0"
              (click)="clearCompleted()">
        Clear completed
      </button>
    </footer>
  `
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.pipe(select(selectRemainingCount));
    this.completedCount$ = this.store.pipe(select(selectCompletedCount));
  }

  clearCompleted() {
    this.store.dispatch(clearCompletedTodos());
  }
}
```

models/todo.model.ts
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number, changes: Partial<Todo> }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const toggleAllTodos = createAction('[Todo] Toggle All Todos');
export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());
```

store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: any;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false }]
  })),
  on(TodoActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, ...changes } : todo)
  })),
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.toggleAllTodos, state => {
    const areAllCompleted = state.todos.every(todo => todo.completed);
    return {
      ...state,
      todos: state.todos.map(todo => ({ ...todo, completed: !areAllCompleted }))
    };
  }),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
```

store/todo.selectors.ts
```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectVisibleTodos = createSelector(
  selectAllTodos,
  (todos, props) => {
    switch (props?.filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectRemainingCount = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => todo.completed).length
);

export const selectAllCompleted = createSelector(
  selectAllTodos,
  todos => todos.every(todo => todo.completed)
);
```

store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { TodoService } from '../services/todo.service';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}
}
```

services/todo.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private STORAGE_KEY = 'todos-angular';

  getTodos(): Observable<Todo[]> {
    const todos = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return of(todos);
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

### Tokens: {'input_tokens': 2794, 'output_tokens': 3859}
### Execution time: 36.87809205055237
