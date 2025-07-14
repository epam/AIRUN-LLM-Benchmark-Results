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
```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoMainComponent } from './components/todo-main/todo-main.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';
import { FilterService } from './services/filter.service';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoMainComponent,
    TodoFooterComponent,
    TodoItemComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], { useHash: true }),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from './store/todo.actions';
import { selectTotalCount } from './store/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  totalCount$ = this.store.select(selectTotalCount);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }
}
```

```html
<!-- src/app/app.component.html -->
<section class="todoapp">
  <app-todo-header></app-todo-header>
  <app-todo-main *ngIf="(totalCount$ | async) > 0"></app-todo-main>
  <app-todo-footer *ngIf="(totalCount$ | async) > 0"></app-todo-footer>
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
```

```typescript
// src/app/app.component.css
/* Add any necessary styles or leave empty */
```

```typescript
// src/app/components/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html'
})
export class TodoHeaderComponent {
  newTodo = '';

  constructor(private store: Store) {}

  addTodo(): void {
    const title = this.newTodo.trim();
    if (title) {
      this.store.dispatch(addTodo({ title }));
      this.newTodo = '';
    }
  }
}
```

```html
<!-- src/app/components/todo-header/todo-header.component.html -->
<header class="header">
  <h1>todos</h1>
  <form (ngSubmit)="addTodo()">
    <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodo" autofocus>
  </form>
</header>
```

```typescript
// src/app/components/todo-main/todo-main.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleAll } from '../../store/todo.actions';
import { selectAllCompleted, selectFilteredTodos } from '../../store/todo.selectors';
import { FilterService } from '../../services/filter.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-main',
  templateUrl: './todo-main.component.html'
})
export class TodoMainComponent implements OnInit {
  allCompleted$ = this.store.select(selectAllCompleted);
  filteredTodos$!: Observable<any[]>;

  constructor(
    private store: Store,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filteredTodos$ = this.filterService.currentFilter$.pipe(
      switchMap(filter => this.store.select(selectFilteredTodos, { filter }))
    );
  }

  markAll(completed: boolean): void {
    this.store.dispatch(toggleAll({ completed }));
  }
}
```

```html
<!-- src/app/components/todo-main/todo-main.component.html -->
<section class="main">
  <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (change)="markAll($event.target.checked)">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item *ngFor="let todo of filteredTodos$ | async; trackBy: trackById" [todo]="todo"></app-todo-item>
  </ul>
</section>
```

```typescript
// src/app/components/todo-footer/todo-footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearCompleted } from '../../store/todo.actions';
import { selectHasCompleted, selectRemainingCount } from '../../store/todo.selectors';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  remainingCount$ = this.store.select(selectRemainingCount);
  hasCompleted$ = this.store.select(selectHasCompleted);
  currentFilter$ = this.filterService.currentFilter$;

  constructor(
    private store: Store,
    private filterService: FilterService
  ) {}

  clearCompleted(): void {
    this.store.dispatch(clearCompleted());
  }
}
```

```html
<!-- src/app/components/todo-footer/todo-footer.component.html -->
<footer class="footer">
  <span class="todo-count">
    <strong>{{ remainingCount$ | async }}</strong>
    <ng-container [ngPlural]="remainingCount$ | async">
      <ng-template ngPluralCase="=1">item left</ng-template>
      <ng-template ngPluralCase="other">items left</ng-template>
    </ng-container>
  </span>
  <ul class="filters">
    <li>
      <a [routerLink]="['/']" [class.selected]="(currentFilter$ | async) === 'all'">All</a>
    </li>
    <li>
      <a [routerLink]="['/active']" [class.selected]="(currentFilter$ | async) === 'active'">Active</a>
    </li>
    <li>
      <a [routerLink]="['/completed']" [class.selected]="(currentFilter$ | async) === 'completed'">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" (click)="clearCompleted()" *ngIf="hasCompleted$ | async">Clear completed</button>
</footer>
```

```typescript
// src/app/components/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { removeTodo, toggleTodo, updateTodo } from '../../store/todo.actions';
import { Todo } from '../../store/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  isEditing = false;
  editedTitle = '';

  constructor(private store: Store) {}

  edit(): void {
    this.isEditing = true;
    this.editedTitle = this.todo.title;
  }

  doneEditing(): void {
    const title = this.editedTitle.trim();
    this.isEditing = false;
    if (!title) {
      this.remove();
      return;
    }
    this.store.dispatch(updateTodo({ id: this.todo.id, title }));
  }

  revertEditing(): void {
    this.isEditing = false;
  }

  remove(): void {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }

  toggle(): void {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }
}
```

```html
<!-- src/app/components/todo-item/todo-item.component.html -->
<li [class.completed]="todo.completed" [class.editing]="isEditing">
  <div class="view">
    <input class="toggle" type="checkbox" [checked]="todo.completed" (change)="toggle()">
    <label (dblclick)="edit()">{{todo.title}}</label>
    <button class="destroy" (click)="remove()"></button>
  </div>
  <input class="edit" *ngIf="isEditing" [(ngModel)]="editedTitle" (blur)="doneEditing()" (keyup.enter)="doneEditing()" appTodoEscape (appTodoEscape)="revertEditing()" appTodoFocus [appTodoFocus]="isEditing">
</li>
```

```typescript
// src/app/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() appTodoFocus!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appTodoFocus'] && this.appTodoFocus) {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

```typescript
// src/app/directives/todo-escape.directive.ts
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.appTodoEscape.emit();
    }
  }
}
```

```typescript
// src/app/services/filter.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class FilterService {
  currentFilter$: Observable<string>;

  constructor(private router: Router) {
    this.currentFilter$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getFilter()),
      startWith(this.getFilter()),
      shareReplay(1)
    );
  }

  private getFilter(): string {
    let url = this.router.url.split('?')[0]; // Ignore query params if any
    if (url.startsWith('/')) {
      url = url.slice(1);
    }
    return url || 'all';
  }
}
```

```typescript
// src/app/store/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  nextId: number;
}
```

```typescript
// src/app/store/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const loadTodos = createAction('[Todo] Load Todos');

export const todosLoaded = createAction(
  '[Todo] Todos Loaded',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const removeTodo = createAction(
  '[Todo] Remove Todo',
  props<{ id: number }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: number; title: string }>()
);

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');
```

```typescript
// src/app/store/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  toggleAll,
  clearCompleted,
  todosLoaded
} from './todo.actions';
import { TodoState } from './todo.model';

const initialState: TodoState = {
  todos: [],
  nextId: 1
};

export const todoReducer = createReducer(
  initialState,
  on(todosLoaded, (state, { todos }) => {
    const loadedTodos = todos.map((todo, index) => ({
      id: todo.id ?? index + 1,
      title: todo.title,
      completed: !!todo.completed
    }));
    const maxId = loadedTodos.reduce((max, t) => Math.max(max, t.id), 0);
    return { ...state, todos: loadedTodos, nextId: maxId + 1 };
  }),
  on(addTodo, (state, { title }) => {
    const newTodo = { id: state.nextId, title, completed: false };
    return {
      ...state,
      todos: [...state.todos, newTodo],
      nextId: state.nextId + 1
    };
  }),
  on(removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id)
  })),
  on(toggleTodo, (state, { id }) => {
    const index = state.todos.findIndex(t => t.id === id);
    if (index === -1) return state;
    const todo = state.todos[index];
    const updated = { ...todo, completed: !todo.completed };
    return {
      ...state,
      todos: [
        ...state.todos.slice(0, index),
        updated,
        ...state.todos.slice(index + 1)
      ]
    };
  }),
  on(updateTodo, (state, { id, title }) => {
    const index = state.todos.findIndex(t => t.id === id);
    if (index === -1) return state;
    const todo = state.todos[index];
    const updated = { ...todo, title };
    return {
      ...state,
      todos: [
        ...state.todos.slice(0, index),
        updated,
        ...state.todos.slice(index + 1)
      ]
    };
  }),
  on(toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(t => ({ ...t, completed }))
  })),
  on(clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(t => !t.completed)
  }))
);
```

```typescript
// src/app/store/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.model';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (todos, props: { filter: string }) => {
    switch (props.filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }
);

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(t => !t.completed).length
);

export const selectTotalCount = createSelector(
  selectTodos,
  todos => todos.length
);

export const selectAllCompleted = createSelector(
  selectRemainingCount,
  count => count === 0
);

export const selectHasCompleted = createSelector(
  selectRemainingCount,
  selectTotalCount,
  (remaining, total) => remaining < total
);
```

```typescript
// src/app/store/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadTodos,
  todosLoaded,
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  toggleAll,
  clearCompleted
} from './todo.actions';
import { selectTodos } from './todo.selectors';

const STORAGE_ID = 'todos-angularjs-requirejs';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() => {
        const storedTodos = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        return of(todosLoaded({ todos: storedTodos }));
      })
    )
  );

  persistTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          addTodo,
          removeTodo,
          toggleTodo,
          updateTodo,
          toggleAll,
          clearCompleted
        ),
        withLatestFrom(this.store.pipe(select(selectTodos))),
        tap(([, todos]) => {
          localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store) {}
}
```

```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Angular & TodoMVC</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
    <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

### Tokens: {'input_tokens': 2479, 'output_tokens': 4028, 'reasoning_tokens': 7252}
### Execution time: 255.16335678100586
