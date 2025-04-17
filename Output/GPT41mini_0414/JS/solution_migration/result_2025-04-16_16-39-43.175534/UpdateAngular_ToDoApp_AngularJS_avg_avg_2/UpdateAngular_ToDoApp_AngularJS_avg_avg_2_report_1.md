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
Below is a complete migration of your AngularJS + RequireJS TodoMVC app to Angular 14.x with NgRx state management, modular components, Angular services, directives, and updated templates.

---

# 1. Angular Project Setup

Assuming you have an Angular 14 project created via Angular CLI:

```bash
ng new todomvc-ng --routing=false --style=css
cd todomvc-ng
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
```

---

# 2. File Structure

```
src/
  app/
    store/
      actions/
        todo.actions.ts
      reducers/
        todo.reducer.ts
      selectors/
        todo.selectors.ts
      effects/
        todo.effects.ts
    directives/
      todo-escape.directive.ts
      todo-focus.directive.ts
    services/
      todo-storage.service.ts
    components/
      todo-app/
        todo-app.component.ts
        todo-app.component.html
        todo-app.component.css
      todo-header/
        todo-header.component.ts
        todo-header.component.html
        todo-header.component.css
      todo-list/
        todo-list.component.ts
        todo-list.component.html
        todo-list.component.css
      todo-item/
        todo-item.component.ts
        todo-item.component.html
        todo-item.component.css
      todo-footer/
        todo-footer.component.ts
        todo-footer.component.html
        todo-footer.component.css
    app.module.ts
    app.component.ts
    app.component.html
```

---

# 3. Code Implementation

---

### 3.1. Store: Actions (src/app/store/actions/todo.actions.ts)

```typescript
import { createAction, props } from '@ngrx/store';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

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
  props<{ id: string }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: string; title: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);

export const clearCompleted = createAction('[Todo] Clear Completed');

export const toggleAll = createAction(
  '[Todo] Toggle All',
  props<{ completed: boolean }>()
);
```

---

### 3.2. Store: Reducer (src/app/store/reducers/todo.reducer.ts)

```typescript
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo.actions';
import { Todo } from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: []
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),

  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      {
        id: crypto.randomUUID(),
        title,
        completed: false
      }
    ]
  })),

  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),

  on(TodoActions.updateTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    )
  })),

  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),

  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),

  on(TodoActions.toggleAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  }))
);
```

---

### 3.3. Store: Selectors (src/app/store/selectors/todo.selectors.ts)

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectRemainingCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.completed).length
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => todo.completed).length
);

export const selectAllCompleted = createSelector(
  selectAllTodos,
  (todos) => todos.length > 0 && todos.every(todo => todo.completed)
);

export const selectFilteredTodos = (filter: 'all' | 'active' | 'completed') =>
  createSelector(selectAllTodos, (todos) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  });
```

---

### 3.4. Store: Effects (src/app/store/effects/todo.effects.ts)

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/todo.actions';
import { TodoStorageService } from '../../services/todo-storage.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoStorage: TodoStorageService
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = this.todoStorage.get();
        return of(TodoActions.loadTodosSuccess({ todos }));
      })
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.updateTodo,
        TodoActions.deleteTodo,
        TodoActions.clearCompleted,
        TodoActions.toggleAll
      ),
      tap(() => {
        this.todoStorage.putCurrentState();
      })
    ),
    { dispatch: false }
  );
}
```

---

### 3.5. Service: TodoStorageService (src/app/services/todo-storage.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoState } from '../store/reducers/todo.reducer';
import { selectAllTodos } from '../store/selectors/todo.selectors';
import { Todo } from '../store/actions/todo.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {
  private STORAGE_ID = 'todos-angular-ngrx';
  private todos: Todo[] = [];
  private subscription: Subscription;

  constructor(private store: Store<TodoState>) {
    this.subscription = this.store.select(selectAllTodos).subscribe(todos => {
      this.todos = todos;
    });
  }

  get(): Todo[] {
    const saved = localStorage.getItem(this.STORAGE_ID);
    if (saved) {
      try {
        return JSON.parse(saved) as Todo[];
      } catch {
        return [];
      }
    }
    return [];
  }

  put(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
  }

  putCurrentState(): void {
    this.put(this.todos);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

---

### 3.6. Directives

---

#### 3.6.1. todo-focus.directive.ts

```typescript
import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') isFocused = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isFocused'] && this.isFocused) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```

---

#### 3.6.2. todo-escape.directive.ts

```typescript
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.appTodoEscape.emit();
    }
  }
}
```

---

### 3.7. Components

---

#### 3.7.1. todo-app.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoState } from '../../store/reducers/todo.reducer';
import * as TodoActions from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit {
  filter: 'all' | 'active' | 'completed' = 'all';

  constructor(private store: Store<TodoState>) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.filter = filter;
  }
}
```

---

#### 3.7.2. todo-app.component.html

```html
<section class="todoapp">
  <app-todo-header (add)="onAdd($event)"></app-todo-header>

  <app-todo-list
    [filter]="filter"
  ></app-todo-list>

  <app-todo-footer
    [filter]="filter"
    (filterChange)="setFilter($event)"
  ></app-todo-footer>
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

---

#### 3.7.3. todo-header.component.ts

```typescript
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent {
  newTodo = '';

  @Output() add = new EventEmitter<string>();

  onSubmit(): void {
    const title = this.newTodo.trim();
    if (title.length === 0) {
      return;
    }
    this.add.emit(title);
    this.newTodo = '';
  }
}
```

---

#### 3.7.4. todo-header.component.html

```html
<header class="header">
  <h1>todos</h1>
  <form class="todo-form" (ngSubmit)="onSubmit()">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      [(ngModel)]="newTodo"
      name="newTodo"
      autofocus
      autocomplete="off"
    />
  </form>
</header>
```

---

#### 3.7.5. todo-list.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../store/actions/todo.actions';
import { TodoState } from '../../store/reducers/todo.reducer';
import * as TodoSelectors from '../../store/selectors/todo.selectors';
import * as TodoActions from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  @Input() filter: 'all' | 'active' | 'completed' = 'all';

  todos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;

  constructor(private store: Store<TodoState>) {
    this.allCompleted$ = this.store.select(TodoSelectors.selectAllCompleted);
  }

  ngOnChanges(): void {
    this.todos$ = this.store.select(TodoSelectors.selectFilteredTodos(this.filter));
  }

  toggleAll(completed: boolean): void {
    this.store.dispatch(TodoActions.toggleAll({ completed }));
  }
}
```

---

#### 3.7.6. todo-list.component.html

```html
<section class="main" *ngIf="(todos$ | async)?.length > 0">
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="allCompleted$ | async"
    (change)="toggleAll($event.target.checked)"
  />
  <label for="toggle-all">Mark all as complete</label>

  <ul class="todo-list">
    <li *ngFor="let todo of todos$ | async" [class.completed]="todo.completed">
      <app-todo-item [todo]="todo"></app-todo-item>
    </li>
  </ul>
</section>
```

---

#### 3.7.7. todo-item.component.ts

```typescript
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Todo } from '../../store/actions/todo.actions';
import { Store } from '@ngrx/store';
import { TodoState } from '../../store/reducers/todo.reducer';
import * as TodoActions from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;

  editing = false;
  editTitle = '';

  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  constructor(private store: Store<TodoState>) {}

  ngOnInit(): void {
    this.editTitle = this.todo.title;
  }

  toggleCompleted(): void {
    this.store.dispatch(TodoActions.toggleTodo({ id: this.todo.id }));
  }

  remove(): void {
    this.store.dispatch(TodoActions.deleteTodo({ id: this.todo.id }));
  }

  edit(): void {
    this.editing = true;
    this.editTitle = this.todo.title;
    setTimeout(() => this.editInput.nativeElement.focus(), 0);
  }

  doneEditing(): void {
    const title = this.editTitle.trim();
    if (!title) {
      this.remove();
    } else {
      if (title !== this.todo.title) {
        this.store.dispatch(TodoActions.updateTodo({ id: this.todo.id, title }));
      }
    }
    this.editing = false;
  }

  cancelEditing(): void {
    this.editing = false;
    this.editTitle = this.todo.title;
  }
}
```

---

#### 3.7.8. todo-item.component.html

```html
<div class="view" *ngIf="!editing">
  <input
    class="toggle"
    type="checkbox"
    [checked]="todo.completed"
    (change)="toggleCompleted()"
  />
  <label (dblclick)="edit()">{{ todo.title }}</label>
  <button class="destroy" (click)="remove()"></button>
</div>

<input
  #editInput
  class="edit"
  *ngIf="editing"
  [(ngModel)]="editTitle"
  (blur)="doneEditing()"
  (keyup.enter)="doneEditing()"
  appTodoEscape
  (appTodoEscape)="cancelEditing()"
  [appTodoFocus]="editing"
/>
```

---

#### 3.7.9. todo-footer.component.ts

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoState } from '../../store/reducers/todo.reducer';
import * as TodoSelectors from '../../store/selectors/todo.selectors';
import * as TodoActions from '../../store/actions/todo.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() filter: 'all' | 'active' | 'completed' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'active' | 'completed'>();

  remainingCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(private store: Store<TodoState>) {
    this.remainingCount$ = this.store.select(TodoSelectors.selectRemainingCount);
    this.completedCount$ = this.store.select(TodoSelectors.selectCompletedCount);
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.filterChange.emit(filter);
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
```

---

#### 3.7.10. todo-footer.component.html

```html
<footer class="footer" *ngIf="(remainingCount$ | async) !== null">
  <span class="todo-count">
    <strong>{{ remainingCount$ | async }}</strong>
    {{ (remainingCount$ | async) === 1 ? 'item left' : 'items left' }}
  </span>

  <ul class="filters">
    <li>
      <a
        href="#/"
        [class.selected]="filter === 'all'"
        (click)="setFilter('all'); $event.preventDefault()"
        >All</a
      >
    </li>
    <li>
      <a
        href="#/active"
        [class.selected]="filter === 'active'"
        (click)="setFilter('active'); $event.preventDefault()"
        >Active</a
      >
    </li>
    <li>
      <a
        href="#/completed"
        [class.selected]="filter === 'completed'"
        (click)="setFilter('completed'); $event.preventDefault()"
        >Completed</a
      >
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

---

### 3.8. app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';

import { todoReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';

import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

@NgModule({
  declarations: [
    AppComponent,
    TodoAppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective
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
export class AppModule {}
```

---

### 3.9. app.component.ts

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-todo-app></app-todo-app>'
})
export class AppComponent {}
```

---

### 3.10. Styles

You can reuse your existing CSS from `todomvc-common/base.css` and `todomvc-app-css/index.css` by copying them into your Angular project styles or importing them in `angular.json` styles array.

---

# 4. Summary of Migration

- Removed RequireJS, replaced with ES modules and Angular CLI build system.
- Converted AngularJS controller to multiple Angular components.
- Converted AngularJS services to Angular injectable services.
- Used NgRx for state management with actions, reducers, selectors, and effects.
- Converted AngularJS directives to Angular directives with lifecycle hooks.
- Updated templates to Angular syntax with property/event binding.
- Used Angular best practices and TypeScript features.
- No TODOs remain; code is modular, maintainable, and optimized.

---

If you want, I can provide the full code files in a zip or GitHub repo structure. Let me know!

### Tokens: {'input_tokens': 2505, 'output_tokens': 4794, 'reasoning_tokens': 0}
### Execution time: 71.77415323257446
