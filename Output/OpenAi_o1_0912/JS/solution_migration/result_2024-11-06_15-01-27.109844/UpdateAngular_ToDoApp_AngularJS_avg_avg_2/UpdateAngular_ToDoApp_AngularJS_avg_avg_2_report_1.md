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

js\app.js
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

js\main.js
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

js\controllers\todo.js
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

js\directives\todoEscape.js
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

js\directives\todoFocus.js
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

js\services\todoStorage.js
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
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { todoReducer } from './reducers/todo.reducer';
import { TodoEffects } from './effects/todo.effects';

import { AppComponent } from './app.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoFormComponent,
    TodoListComponent,
    TodoItemComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    RouterModule.forRoot([
      { path: '', component: TodoListComponent },
      { path: ':filter', component: TodoListComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-form></app-todo-form>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
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
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
```

```typescript
// models/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

```typescript
// actions/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const editTodo = createAction(
  '[Todo] Edit Todo',
  props<{ id: number; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
```

```typescript
// reducers/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: []
};

let nextId = 0;

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: ++nextId, title, completed: false }]
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodoActions.editTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  }))
);
```

```typescript
// effects/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/todo.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { Store } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<{ todos: TodoState }>
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = this.localStorageService.getTodos();
        return of(TodoActions.loadTodosSuccess({ todos }));
      })
    )
  );

  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.toggleTodo,
          TodoActions.editTodo,
          TodoActions.deleteTodo,
          TodoActions.toggleAll,
          TodoActions.clearCompleted
        ),
        withLatestFrom(this.store.select('todos')),
        map(([action, todosState]) => {
          this.localStorageService.setTodos(todosState.todos);
        })
      ),
    { dispatch: false }
  );
}
```

```typescript
// services/local-storage.service.ts
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

const STORAGE_ID = 'todos-angular-ngrx';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getTodos(): Todo[] {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

  setTodos(todos: Todo[]): void {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }
}
```

```typescript
// components/todo-form/todo-form.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../actions/todo.actions';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html'
})
export class TodoFormComponent {
  newTodo: string = '';

  constructor(private store: Store) {}

  addTodo() {
    if (this.newTodo.trim().length === 0) {
      return;
    }
    this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
    this.newTodo = '';
  }
}
```

```html
<!-- components/todo-form/todo-form.component.html -->
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="addTodo()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      name="newTodo"
      autofocus
    />
  </form>
</header>
```

```typescript
// components/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { toggleAll, loadTodos } from '../../actions/todo.actions';
import { selectTodos } from '../../selectors/todo.selectors';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  allCompleted: boolean;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(loadTodos());

    this.route.params.subscribe(params => {
      const filter = params['filter'] || 'all';
      this.todos$ = this.store.pipe(
        select(selectTodos),
        map(todos => this.filterTodos(todos, filter))
      );
    });

    this.store.pipe(select(selectTodos)).subscribe(todos => {
      this.allCompleted = todos.length > 0 && todos.every(t => t.completed);
    });
  }

  filterTodos(todos: Todo[], filter: string): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  toggleAll(completed: boolean) {
    this.store.dispatch(toggleAll({ completed }));
  }
}
```

```html
<!-- components/todo-list/todo-list.component.html -->
<section class="main" *ngIf="(todos$ | async)?.length">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="allCompleted"
    (click)="toggleAll(!allCompleted)"
  />
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <li
      *ngFor="let todo of todos$ | async"
      [ngClass]="{ completed: todo.completed }"
    >
      <app-todo-item [todo]="todo"></app-todo-item>
    </li>
  </ul>
</section>
```

```typescript
// components/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { Store } from '@ngrx/store';
import { toggleTodo, editTodo, deleteTodo } from '../../actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  @Input() todo: Todo;
  editing: boolean = false;
  editedTitle: string;

  constructor(private store: Store) {}

  toggle() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  editTodo() {
    this.editing = true;
    this.editedTitle = this.todo.title;
  }

  doneEditing() {
    if (this.editedTitle.trim().length === 0) {
      this.store.dispatch(deleteTodo({ id: this.todo.id }));
    } else {
      this.store.dispatch(
        editTodo({ id: this.todo.id, title: this.editedTitle.trim() })
      );
    }
    this.editing = false;
  }

  cancelEditing() {
    this.editing = false;
  }

  deleteTodo() {
    this.store.dispatch(deleteTodo({ id: this.todo.id }));
  }
}
```

```html
<!-- components/todo-item/todo-item.component.html -->
<div *ngIf="!editing" class="view">
  <input
    class="toggle"
    type="checkbox"
    [checked]="todo.completed"
    (change)="toggle()"
  />
  <label (dblclick)="editTodo()">{{ todo.title }}</label>
  <button class="destroy" (click)="deleteTodo()"></button>
</div>
<input
  *ngIf="editing"
  class="edit"
  [(ngModel)]="editedTitle"
  (blur)="doneEditing()"
  (keyup.enter)="doneEditing()"
  (keyup.escape)="cancelEditing()"
  autofocus
/>
```

```typescript
// components/footer/footer.component.ts
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { Observable } from 'rxjs';
import { clearCompleted } from '../../actions/todo.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;
  hasTodos$: Observable<boolean>;

  constructor(private store: Store<{ todos: { todos: Todo[] } }>) {
    this.remainingCount$ = store.pipe(
      select('todos'),
      map(state => state.todos.filter(todo => !todo.completed).length)
    );
    this.completedCount$ = store.pipe(
      select('todos'),
      map(state => state.todos.filter(todo => todo.completed).length)
    );
    this.hasTodos$ = store.pipe(
      select('todos'),
      map(state => state.todos.length > 0)
    );
  }

  clearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

```html
<!-- components/footer/footer.component.html -->
<footer class="footer" *ngIf="hasTodos$ | async">
  <span class="todo-count"
    ><strong>{{ remainingCount$ | async }}</strong>
    {{ (remainingCount$ | async) === 1 ? 'item' : 'items' }} left</span
  >
  <ul class="filters">
    <li>
      <a
        routerLink="/"
        routerLinkActive="selected"
        [routerLinkActiveOptions]="{ exact: true }"
        >All</a
      >
    </li>
    <li>
      <a routerLink="/active" routerLinkActive="selected">Active</a>
    </li>
    <li>
      <a routerLink="/completed" routerLinkActive="selected">Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    *ngIf="(completedCount$ | async) > 0"
    (click)="clearCompleted()"
  >
    Clear completed
  </button>
</footer>
```

```typescript
// selectors/todo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodosState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodosState,
  (state: TodoState) => state.todos
);
```

```css
/* app.component.css */
@import url('node_modules/todomvc-app-css/index.css');
```

```
// angular.json (partial configuration to include styles)
{
  ...
  "projects": {
    "your-project-name": {
      ...
      "architect": {
        "build": {
          ...
          "options": {
            ...
            "styles": [
              "node_modules/todomvc-app-css/index.css",
              "src/styles.css"
            ],
            ...
          },
          ...
        },
        ...
      }
    }
  }
  ...
}
```

Add the necessary styles and ensure your `styles.css` includes any custom styles you may need.

This codebase migrates your AngularJS application to Angular 14, using @ngrx/store and @ngrx/effects for state management, and splits the app into separate, optimized components.

### Tokens: {'input_tokens': 2401, 'output_tokens': 9592, 'reasoning_tokens': 6144}
### Execution time: 87.00236392021179
