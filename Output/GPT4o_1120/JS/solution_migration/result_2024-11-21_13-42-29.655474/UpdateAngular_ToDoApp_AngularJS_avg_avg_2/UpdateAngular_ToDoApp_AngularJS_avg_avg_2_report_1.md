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
import { AppComponent } from './components/app.component';
import { TodoModule } from './todo/todo.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    TodoModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// src/app/components/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-todo></app-todo>`,
})
export class AppComponent {}
```

```typescript
// src/app/todo/todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TodoComponent } from './components/todo.component';
import { TodoListComponent } from './components/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer.component';
import { TodoInputComponent } from './components/todo-input.component';
import { todoReducer } from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TodoComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects])
  ],
  exports: [TodoComponent]
})
export class TodoModule {}
```

```typescript
// src/app/todo/components/todo.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-todo',
  template: `
    <section class="todoapp">
      <app-todo-input></app-todo-input>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
  `,
})
export class TodoComponent {}
```

```typescript
// src/app/todo/components/todo-input.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../state/todo.actions';

@Component({
  selector: 'app-todo-input',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="onAddTodo()">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="newTodo"
          name="newTodo"
          autofocus
        />
      </form>
    </header>
  `,
})
export class TodoInputComponent {
  newTodo = '';

  constructor(private store: Store) {}

  onAddTodo() {
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }
}
```

```typescript
// src/app/todo/components/todo-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { toggleTodo, editTodo, removeTodo } from '../state/todo.actions';
import { selectTodos } from '../state/todo.selectors';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todos$ | async as todos">
      <ul class="todo-list">
        <li
          *ngFor="let todo of todos"
          [ngClass]="{ completed: todo.completed }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              [checked]="todo.completed"
              (change)="onToggle(todo.id)"
            />
            <label (dblclick)="onEdit(todo.id, todo.title)">{{ todo.title }}</label>
            <button class="destroy" (click)="onRemove(todo.id)"></button>
          </div>
        </li>
      </ul>
    </section>
  `,
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;

  constructor(private store: Store) {
    this.todos$ = this.store.select(selectTodos);
  }

  onToggle(id: string) {
    this.store.dispatch(toggleTodo({ id }));
  }

  onEdit(id: string, title: string) {
    const newTitle = prompt('Edit todo', title);
    if (newTitle !== null) {
      this.store.dispatch(editTodo({ id, title: newTitle.trim() }));
    }
  }

  onRemove(id: string) {
    this.store.dispatch(removeTodo({ id }));
  }
}
```

```typescript
// src/app/todo/components/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { clearCompleted } from '../state/todo.actions';
import { selectRemainingCount, selectCompletedCount } from '../state/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ remainingCount$ | async }}</strong> items left
      </span>
      <button
        class="clear-completed"
        (click)="onClearCompleted()"
        *ngIf="(completedCount$ | async) > 0"
      >
        Clear completed
      </button>
    </footer>
  `,
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(private store: Store) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  onClearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```typescript
// src/app/todo/models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

```typescript
// src/app/todo/state/todo.actions.ts
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: string; title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
```

```typescript
// src/app/todo/state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, editTodo, removeTodo, clearCompleted } from './todo.actions';
import { Todo } from '../models/todo.model';
import { v4 as uuid } from 'uuid';

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: uuid(), title, completed: false }],
  })),
  on(toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  on(editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    ),
  })),
  on(removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed),
  }))
);
```

```typescript
// src/app/todo/state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(selectTodoState, state => state.todos);

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed).length
);
```

```typescript
// src/app/todo/state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) {}
}
```

### Tokens: {'input_tokens': 2275, 'output_tokens': 2017, 'reasoning_tokens': 0}
### Execution time: 16.15990924835205
