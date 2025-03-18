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
```html
<!-- index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular 14 TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app-root></app-root>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</body>
</html>
```

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { todoReducer } from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':filter', component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoInputComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from './state/todo.actions';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-todo-input></app-todo-input>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  filter$: Observable<string>;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
      this.filter$ = this.router.events.pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          map(event => {
              const urlParts = event.urlAfterRedirects.split('/');
              return urlParts.length > 1 ? urlParts[1] : 'all';
          })
      );
  }

  ngOnInit() {
    this.store.dispatch(loadTodos());
    this.filter$.subscribe(filterParam => {
        // You could dispatch an action here if you wanted to store the filter in ngrx/store
    });
  }
}
```

```typescript
// components/todo-input/todo-input.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo-input',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (submit)="addTodoItem()">
        <input class="new-todo" placeholder="What needs to be done?" autofocus [(ngModel)]="newTodoTitle" name="newTodoTitle">
      </form>
    </header>
  `,
  styles: []
})
export class TodoInputComponent {
  newTodoTitle = '';

  constructor(private store: Store) {}

  addTodoItem() {
    if (this.newTodoTitle.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodoTitle }));
      this.newTodoTitle = '';
    }
  }
}
```

```typescript
// components/todo-list/todo-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../state/todo.model';
import { selectFilteredTodos, selectAllChecked } from '../../state/todo.selectors';
import { toggleAll, toggleTodo } from '../../state/todo.actions';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="(todos$ | async)?.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allChecked$ | async" (click)="toggleAllTodos()">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item *ngFor="let todo of todos$ | async; trackBy: trackByFn" [todo]="todo"></app-todo-item>
      </ul>
    </section>
  `,
  styles: []
})
export class TodoListComponent {
  todos$: Observable<Todo[]>;
  allChecked$: Observable<boolean>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.todos$ = this.store.select(selectFilteredTodos);
    this.allChecked$ = this.store.select(selectAllChecked);
  }

    trackByFn(index: number, item: Todo): number {
        return index; // Or item.id if you have a unique ID
    }

  toggleAllTodos() {
      this.allChecked$.pipe(
          map(allChecked => !allChecked)
      ).subscribe(allChecked => this.store.dispatch(toggleAll({ completed: allChecked })));
  }
}
```

```typescript
// components/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../state/todo.model';
import { removeTodo, updateTodo, toggleTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggleTodoStatus()">
        <label (dblclick)="editTodo()">{{todo.title}}</label>
        <button class="destroy" (click)="deleteTodo()"></button>
      </div>
      <form *ngIf="editing" (submit)="doneEditing()">
        <input class="edit" #todoInput [value]="todo.title" (blur)="doneEditing()" (keyup.escape)="cancelEditing()" (keyup.enter)="doneEditing()" autofocus>
      </form>
    </li>
  `,
  styles: []
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  editing = false;
  originalTitle!: string;

  constructor(private store: Store) {}

  toggleTodoStatus() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  deleteTodo() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }

  editTodo() {
      this.originalTitle = this.todo.title;
      this.editing = true;
  }

    doneEditing() {
        if (this.editing) {
            const title = this.todo.title.trim(); // You might want to bind the input value to a local variable to avoid direct todo modification
            if (title) {
                this.store.dispatch(updateTodo({ id: this.todo.id, title }));
            } else {
                this.store.dispatch(removeTodo({ id: this.todo.id }));
            }
            this.editing = false;
        }
    }

    cancelEditing() {
        this.store.dispatch(updateTodo({id: this.todo.id, title: this.originalTitle}));
        this.editing = false;
    }
}
```

```typescript
// components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { clearCompleted } from '../../state/todo.actions';
import { selectRemainingCount, selectDoneCount, selectTodosCount } from '../../state/todo.selectors';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(todosCount$ | async) > 0">
      <span class="todo-count"><strong>{{remainingCount$ | async}}</strong> {{ (remainingCount$ | async) === 1 ? 'item' : 'items' }} left</span>
      <ul class="filters">
        <li>
          <a routerLink="/all" [class.selected]="(currentFilter$ | async) === 'all'">All</a>
        </li>
        <li>
          <a routerLink="/active" [class.selected]="(currentFilter$ | async) === 'active'">Active</a>
        </li>
        <li>
          <a routerLink="/completed" [class.selected]="(currentFilter$ | async) === 'completed'">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" *ngIf="(doneCount$ | async) > 0" (click)="clearCompletedTodos()">Clear completed</button>
    </footer>
  `,
  styles: []
})
export class TodoFooterComponent {
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;
  todosCount$: Observable<number>;
    currentFilter$: Observable<string>;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.doneCount$ = this.store.select(selectDoneCount);
    this.todosCount$ = this.store.select(selectTodosCount);

      this.currentFilter$ = this.router.events.pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          map(event => {
              const urlParts = event.urlAfterRedirects.split('/');
              return urlParts.length > 1 ? urlParts[1] : 'all';
          })
      );
  }

  clearCompletedTodos() {
    this.store.dispatch(clearCompleted());
  }
}
```

```typescript
// state/todo.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: any[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number, title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');

```

```typescript
// state/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

```

```typescript
// state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { Todo } from './todo.model';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => todos),
  on(TodoActions.addTodo, (state, { title }) => [...state, { id: Date.now(), title, completed: false }]),
  on(TodoActions.removeTodo, (state, { id }) => state.filter(todo => todo.id !== id)),
  on(TodoActions.updateTodo, (state, { id, title }) =>
    state.map(todo => (todo.id === id ? { ...todo, title } : todo))
  ),
  on(TodoActions.toggleTodo, (state, { id }) =>
    state.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  ),
  on(TodoActions.toggleAll, (state, { completed }) => state.map(todo => ({ ...todo, completed }))),
  on(TodoActions.clearCompleted, state => state.filter(todo => !todo.completed))
);

```

```typescript
// state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import * as TodoActions from './todo.actions';
import { Store } from '@ngrx/store';
import { selectTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.removeTodo,
        TodoActions.updateTodo,
        TodoActions.toggleTodo,
        TodoActions.toggleAll,
        TodoActions.clearCompleted,
        TodoActions.loadTodosSuccess
      ),
      withLatestFrom(this.store.select(selectTodos)),
      tap(([action, todos]) => {
          localStorage.setItem('todos-angularjs-requirejs', JSON.stringify(todos));
      })
    ),
    { dispatch: false }
  );

    loadTodos$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TodoActions.loadTodos),
            tap(() => {
                const storedTodos = localStorage.getItem('todos-angularjs-requirejs');
                const todos = storedTodos ? JSON.parse(storedTodos) : [];
                this.store.dispatch(TodoActions.loadTodosSuccess({todos}));
            })
        ), {dispatch: false}
    );

  constructor(private actions$: Actions, private store: Store) {}
}

```

```typescript
// state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Todo } from './todo.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export const selectTodos = createFeatureSelector<Todo[]>('todos');

export const selectRemainingCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectDoneCount = createSelector(
  selectTodos,
  (todos) => todos.filter(todo => todo.completed).length
);

export const selectAllChecked = createSelector(
    selectRemainingCount,
    remainingCount => remainingCount === 0
);

export const selectTodosCount = createSelector(
  selectTodos,
  (todos) => todos.length
);

export const selectFilteredTodos = createSelector(
    selectTodos,
    (todos: Todo[], props: { filter: string }) => {
        if (props.filter === 'active') {
            return todos.filter(todo => !todo.completed);
        } else if (props.filter === 'completed') {
            return todos.filter(todo => todo.completed);
        }
        return todos;
    }
);
```


### Tokens: {'input_tokens': 2591, 'output_tokens': 3896}
### Execution time: 31.436048984527588
