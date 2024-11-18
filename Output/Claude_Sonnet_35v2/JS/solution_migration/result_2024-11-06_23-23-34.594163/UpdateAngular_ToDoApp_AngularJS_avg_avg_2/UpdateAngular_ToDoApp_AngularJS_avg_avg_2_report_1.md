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

`app.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoEffects } from './store/todo.effects';
import { todoReducer } from './store/todo.reducer';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoItemComponent,
    TodoFocusDirective,
    TodoEscapeDirective
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

`app.component.ts`:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-header></app-todo-header>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  `
})
export class AppComponent { }
```

`models/todo.model.ts`:
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

`store/todo.actions.ts`:
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

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
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ todo: Todo }>()
);
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);
export const clearCompleted = createAction('[Todo] Clear Completed');
export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);
```

`store/todo.reducer.ts`:
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
}

const initialState: TodoState = {
  todos: [],
  loading: false
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now(), title, completed: false }]
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => (t.id === todo.id ? todo : t))
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  }))
);
```

`store/todo.effects.ts`:
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService
          .getTodos()
          .pipe(map(todos => TodoActions.loadTodosSuccess({ todos })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}
}
```

`services/todo.service.ts`:
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

`components/todo-header/todo-header.component.ts`:
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (ngSubmit)="addTodo()">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="newTodo"
          name="newTodo"
          autofocus>
      </form>
    </header>
  `
})
export class TodoHeaderComponent {
  newTodo = '';

  constructor(private store: Store) {}

  addTodo(): void {
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }
}
```

`components/todo-list/todo-list.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { toggleAll } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="(todos$ | async)?.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        [checked]="allCompleted$ | async"
        (click)="toggleAllTodos($event)">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item
          *ngFor="let todo of filteredTodos$ | async"
          [todo]="todo">
        </app-todo-item>
      </ul>
    </section>
  `
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  filteredTodos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;

  constructor(private store: Store) {
    this.todos$ = store.pipe(select(state => state.todos.todos));
    this.filteredTodos$ = this.todos$;
    this.allCompleted$ = store.pipe(
      select(state => state.todos.todos.every(todo => todo.completed))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }

  toggleAllTodos(event: any): void {
    this.store.dispatch(toggleAll({ completed: event.target.checked }));
  }
}
```

`components/todo-item/todo-item.component.ts`:
```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { toggleTodo, updateTodo, deleteTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="toggleComplete()">
        <label (dblclick)="startEditing()">{{todo.title}}</label>
        <button class="destroy" (click)="removeTodo()"></button>
      </div>
      <form (ngSubmit)="doneEditing()">
        <input
          class="edit"
          *ngIf="editing"
          [value]="todo.title"
          #editedtodo
          (blur)="doneEditing()"
          todoFocus="editing"
          todoEscape="cancelEditing()">
      </form>
    </li>
  `
})
export class TodoItemComponent {
  @Input() todo: Todo;
  editing = false;
  originalTitle: string;

  constructor(private store: Store) {}

  toggleComplete(): void {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  startEditing(): void {
    this.editing = true;
    this.originalTitle = this.todo.title;
  }

  doneEditing(): void {
    if (!this.editing) return;
    this.editing = false;
    const title = this.todo.title.trim();
    if (title) {
      this.store.dispatch(updateTodo({ todo: { ...this.todo, title } }));
    } else {
      this.store.dispatch(deleteTodo({ id: this.todo.id }));
    }
  }

  cancelEditing(): void {
    this.editing = false;
    this.todo.title = this.originalTitle;
  }

  removeTodo(): void {
    this.store.dispatch(deleteTodo({ id: this.todo.id }));
  }
}
```

`components/todo-footer/todo-footer.component.ts`:
```typescript
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { clearCompleted } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(todoCount$ | async) > 0">
      <span class="todo-count">
        <strong>{{ activeCount$ | async }}</strong>
        {{ (activeCount$ | async) === 1 ? 'item' : 'items' }} left
      </span>
      <ul class="filters">
        <li>
          <a [routerLink]="['/']" [class.selected]="(filter$ | async) === 'all'">
            All
          </a>
        </li>
        <li>
          <a [routerLink]="['/active']" [class.selected]="(filter$ | async) === 'active'">
            Active
          </a>
        </li>
        <li>
          <a [routerLink]="['/completed']" [class.selected]="(filter$ | async) === 'completed'">
            Completed
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        *ngIf="(completedCount$ | async) > 0"
        (click)="clearCompleted()">
        Clear completed
      </button>
    </footer>
  `
})
export class TodoFooterComponent {
  todoCount$: Observable<number>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  filter$: Observable<string>;

  constructor(private store: Store) {
    this.todoCount$ = store.pipe(
      select(state => state.todos.todos.length)
    );
    this.activeCount$ = store.pipe(
      select(state => state.todos.todos.filter(todo => !todo.completed).length)
    );
    this.completedCount$ = store.pipe(
      select(state => state.todos.todos.filter(todo => todo.completed).length)
    );
    this.filter$ = store.pipe(
      select(state => state.router.state.url.replace('/', '') || 'all')
    );
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}
```

`directives/todo-focus.directive.ts`:
```typescript
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(): void {
    if (this.todoFocus) {
      this.elementRef.nativeElement.focus();
    }
  }
}
```

`directives/todo-escape.directive.ts`:
```typescript
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[todoEscape]'
})
export class TodoEscapeDirective {
  @Output() todoEscape = new EventEmitter();

  @HostListener('keydown.escape') onEscapeKey() {
    this.todoEscape.emit();
  }
}
```

### Tokens: {'input_tokens': 2794, 'output_tokens': 3931}
### Execution time: 66.7068932056427
