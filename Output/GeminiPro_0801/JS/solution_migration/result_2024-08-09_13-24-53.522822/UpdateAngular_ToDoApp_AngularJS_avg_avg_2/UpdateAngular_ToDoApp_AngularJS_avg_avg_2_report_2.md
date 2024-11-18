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

## Run 2:
### Answer:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-header></app-header>
      <app-main *ngIf="todos$ | async as todos; else noTodos">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          [checked]="allChecked$ | async"
          (change)="markAll($event.target.checked)"
        />
        <label for="toggle-all">Mark all as complete</label>
        <app-todo-list [todos]="todos"></app-todo-list>
      </app-main>
      <app-footer *ngIf="todos$ | async as todos" [todos]="todos"></app-footer>
      <ng-template #noTodos>
        <app-no-todos></app-no-todos>
      </ng-template>
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
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos$ = this.store.select(selectTodos);
  allChecked$ = this.store.select(selectAllChecked);

  constructor(private store: Store<AppState>) {}

  markAll(done: boolean): void {
    this.store.dispatch(markAll({ completed: done }));
  }
}

```

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo, clearCompleted } from './store/actions/todo.actions';
import { AppState } from './store/state/app.state';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form class="todo-form" (ngSubmit)="addTodo(newTodo.value); newTodo.value = ''">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          #newTodo
          autofocus
        />
      </form>
    </header>
  `,
})
export class HeaderComponent {
  constructor(private store: Store<AppState>) {}

  addTodo(title: string): void {
    if (title.trim() === '') {
      return;
    }
    this.store.dispatch(addTodo({ title }));
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}

```

```typescript
import { Component, Input } from '@angular/core';
import { Todo } from './store/models/todo.model';

@Component({
  selector: 'app-main',
  template: `
    <section class="main" *ngIf="todos.length">
      <ng-content></ng-content>
      <ul class="todo-list">
        <app-todo-item
          *ngFor="let todo of todos; trackBy: trackById"
          [todo]="todo"
        ></app-todo-item>
      </ul>
    </section>
  `,
})
export class MainComponent {
  @Input() todos: Todo[] = [];

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}

```

```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from './store/models/todo.model';
import {
  deleteTodo,
  editTodo,
  toggleTodo,
} from './store/actions/todo.actions';
import { AppState } from './store/state/app.state';

@Component({
  selector: 'app-todo-item',
  template: `
    <li
      [class.completed]="todo.completed"
      [class.editing]="editing"
    >
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="toggleTodo()"
        />
        <label (dblclick)="editTodo()">{{ todo.title }}</label>
        <button class="destroy" (click)="deleteTodo()"></button>
      </div>
      <input
        class="edit"
        *ngIf="editing"
        [value]="todo.title"
        (blur)="saveTodo($event.target.value)"
        (keyup.enter)="saveTodo($event.target.value)"
        (keyup.escape)="cancelEdit()"
        #editInput
      />
    </li>
  `,
})
export class TodoItemComponent {
  @Input() todo: Todo;
  editing = false;

  constructor(private store: Store<AppState>) {}

  toggleTodo(): void {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  editTodo(): void {
    this.editing = true;
  }

  deleteTodo(): void {
    this.store.dispatch(deleteTodo({ id: this.todo.id }));
  }

  saveTodo(newTitle: string): void {
    if (newTitle.trim() === '') {
      this.deleteTodo();
    } else {
      this.store.dispatch(editTodo({ id: this.todo.id, title: newTitle }));
    }
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
  }
}

```

```typescript
import { Component, Input } from '@angular/core';
import { Todo } from './store/models/todo.model';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ remainingTodos }}</strong>
        <ng-pluralize [count]="remainingTodos" [when]="pluralMapping">
        </ng-pluralize>
      </span>
      <ul class="filters">
        <li>
          <a [routerLink]="['/']" routerLinkActive="selected">All</a>
        </li>
        <li>
          <a [routerLink]="['/active']" routerLinkActive="selected"
            >Active</a
          >
        </li>
        <li>
          <a [routerLink]="['/completed']" routerLinkActive="selected"
            >Completed</a
          >
        </li>
      </ul>
      <button
        class="clear-completed"
        *ngIf="hasCompletedTodos"
        (click)="clearCompleted.emit()"
      >
        Clear completed
      </button>
    </footer>
  `,
})
export class FooterComponent {
  @Input() todos: Todo[] = [];

  pluralMapping = {
    '=1': 'item left',
    other: 'items left',
  };

  get remainingTodos(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  get hasCompletedTodos(): boolean {
    return this.todos.some((todo) => todo.completed);
  }
}

```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-no-todos',
  template: '',
})
export class NoTodosComponent {}

```

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { NoTodosComponent } from './components/no-todos/no-todos.component';
import { todoReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    TodoItemComponent,
    FooterComponent,
    NoTodosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

```typescript
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'active', component: MainComponent },
  { path: 'completed', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```

```typescript
import { Todo } from './models/todo.model';

export interface AppState {
  todos: Todo[];
}

```

```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: number; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');

export const markAll = createAction(
  '[Todo] Mark All',
  props<{ completed: boolean }>()
);

```

```typescript
import { createReducer, on } from '@ngrx/store';
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from '../actions/todo.actions';
import { Todo } from '../models/todo.model';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => [
    ...state,
    { id: Date.now(), title, completed: false },
  ]),
  on(editTodo, (state, { id, title }) =>
    state.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    )
  ),
  on(deleteTodo, (state, { id }) =>
    state.filter((todo) => todo.id !== id)
  ),
  on(toggleTodo, (state, { id }) =>
    state.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  ),
  on(clearCompleted, (state) => state.filter((todo) => !todo.completed)),
  on(markAll, (state, { completed }) =>
    state.map((todo) => ({ ...todo, completed }))
  )
);

```

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  editTodo,
  markAll,
  toggleTodo,
} from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          addTodo,
          editTodo,
          deleteTodo,
          toggleTodo,
          clearCompleted,
          markAll
        ),
        tap(() => {
          // Retrieve todos from store
          // Save todos to local storage
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}

```

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Todo } from './models/todo.model';

export const selectTodosState = createFeatureSelector<Todo[]>('todos');

export const selectTodos = createSelector(
  selectTodosState,
  (state: Todo[]) => state
);

export const selectAllChecked = createSelector(
  selectTodosState,
  (state: Todo[]) => state.every((todo) => todo.completed)
);

```

### Tokens: {'input_tokens': 2589, 'output_tokens': 3156}
### Execution time: 61.419313192367554
