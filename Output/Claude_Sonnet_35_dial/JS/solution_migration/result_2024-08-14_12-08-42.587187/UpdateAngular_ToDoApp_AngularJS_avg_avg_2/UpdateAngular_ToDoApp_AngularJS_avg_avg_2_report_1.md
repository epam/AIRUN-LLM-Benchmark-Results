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
Here's the migrated Angular 14.x code:

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
               (change)="toggleComplete()">
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

  toggleComplete() {
    this.store.dispatch(updateTodo({ id: this.todo.id, changes: { completed: !this.todo.completed } }));
  }

  removeTodo() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
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
}
```

components/todo-footer/todo-footer.component.ts
```typescript
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRemainingCount, selectCompletedCount } from '../../store/todo.selectors';
import { clearCompletedTodos, setVisibilityFilter } from '../../store/todo.actions';
import { VisibilityFilter } from '../../models/visibility-filter.model';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(remainingCount$ | async)! > 0">
      <span class="todo-count">
        <strong>{{ remainingCount$ | async }}</strong> 
        {{ (remainingCount$ | async) === 1 ? 'item' : 'items' }} left
      </span>
      <ul class="filters">
        <li>
          <a [class.selected]="(currentFilter$ | async) === 'SHOW_ALL'"
             (click)="setFilter('SHOW_ALL')">All</a>
        </li>
        <li>
          <a [class.selected]="(currentFilter$ | async) === 'SHOW_ACTIVE'"
             (click)="setFilter('SHOW_ACTIVE')">Active</a>
        </li>
        <li>
          <a [class.selected]="(currentFilter$ | async) === 'SHOW_COMPLETED'"
             (click)="setFilter('SHOW_COMPLETED')">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" 
              *ngIf="(completedCount$ | async)! > 0"
              (click)="clearCompleted()">
        Clear completed
      </button>
    </footer>
  `
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;
  currentFilter$: Observable<VisibilityFilter>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.pipe(select(selectRemainingCount));
    this.completedCount$ = this.store.pipe(select(selectCompletedCount));
    this.currentFilter$ = this.store.pipe(select(state => state['visibilityFilter']));
  }

  setFilter(filter: VisibilityFilter) {
    this.store.dispatch(setVisibilityFilter({ filter }));
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

models/visibility-filter.model.ts
```typescript
export type VisibilityFilter = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';
```

store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { VisibilityFilter } from '../models/visibility-filter.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number, changes: Partial<Todo> }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const toggleAllTodos = createAction('[Todo] Toggle All Todos');
export const clearCompletedTodos = createAction('[Todo] Clear Completed Todos');
export const setVisibilityFilter = createAction('[Todo] Set Visibility Filter', props<{ filter: VisibilityFilter }>());
```

store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { VisibilityFilter } from '../models/visibility-filter.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  visibilityFilter: VisibilityFilter;
}

export const initialState: TodoState = {
  todos: [],
  visibilityFilter: 'SHOW_ALL'
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: state.todos.length + 1, title, completed: false }]
  })),
  on(TodoActions.updateTodo, (state, { id, changes }) => ({
    ...state,
    todos: state.todos.map(todo => todo.id === id ? { ...todo, ...changes } : todo)
  })),
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.toggleAllTodos, state => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed: !state.todos.every(t => t.completed) }))
  })),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.setVisibilityFilter, (state, { filter }) => ({
    ...state,
    visibilityFilter: filter
  }))
);
```

store/todo.selectors.ts
```typescript
import { createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodos = (state: TodoState) => state.todos;
export const selectVisibilityFilter = (state: TodoState) => state.visibilityFilter;

export const selectVisibleTodos = createSelector(
  selectTodos,
  selectVisibilityFilter,
  (todos, filter) => {
    switch (filter) {
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
);

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);

export const selectAllCompleted = createSelector(
  selectTodos,
  todos => todos.every(todo => todo.completed)
);
```

store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  saveTodos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TodoActions.addTodo,
      TodoActions.updateTodo,
      TodoActions.removeTodo,
      TodoActions.toggleAllTodos,
      TodoActions.clearCompletedTodos
    ),
    tap(() => {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      localStorage.setItem('todos', JSON.stringify(todos));
    })
  ), { dispatch: false });

  constructor(private actions$: Actions) {}
}
```

### Tokens: {'input_tokens': 2794, 'output_tokens': 3812}
### Execution time: 60.318174839019775
