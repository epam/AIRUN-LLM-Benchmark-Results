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
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <app-header></app-header>
      <app-main></app-main>
      <app-footer></app-footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>
        Credits:
        <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
        <a href="http://ericbidelman.com">Eric Bidelman</a>,
        <a href="http://jacobmumm.com">Jacob Mumm</a>,
        <a href="http://blog.igorminar.com">Igor Minar</a> and
        <a href="http://twitter.com/passy">Pascal Hartig</a>
      </p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  `,
  styles: [],
})
export class AppComponent {}

```

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { todoReducer } from './state/todo.reducer';
import { TodoEffects } from './state/todo.effects';
import { TodoService } from './services/todo.service';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':filter', component: MainComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFocusDirective,
    TodoEscapeDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
  ],
  providers: [TodoService],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

```typescript
// src/app/state/todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ id: number; title: string }>());
export const updateTodoSuccess = createAction('[Todo] Update Todo Success', props<{ id: number; title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());
export const removeTodoSuccess = createAction('[Todo] Remove Todo Success', props<{ id: number }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const clearCompletedSuccess = createAction('[Todo] Clear Completed Success', props<{ todos: Todo[] }>());
export const markAll = createAction('[Todo] Mark All', props<{ completed: boolean }>());
export const markAllSuccess = createAction('[Todo] Mark All Success', props<{ todos: Todo[] }>());

```

```typescript
// src/app/state/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
}

export const initialState: TodoState = {
  todos: [],
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodoSuccess, (state, { todo }) => ({ ...state, todos: [...state.todos, todo] })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  })),
  on(TodoActions.updateTodoSuccess, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
  })),
  on(TodoActions.removeTodoSuccess, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  on(TodoActions.clearCompletedSuccess, (state, {todos}) => ({ ...state, todos: todos })),
  on(TodoActions.markAllSuccess, (state, {todos}) => ({ ...state, todos: todos})),
);

```

```typescript
// src/app/state/todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import * as TodoActions from './todo.actions';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.todoService.getTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError(() => of({ type: 'Load Todos Failed' })),
        ),
      ),
    ),
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      switchMap(({ title }) => {
        const newTodo: Todo = {
          id: Date.now(), // Use timestamp as a unique ID
          title: title,
          completed: false,
        };
        return this.todoService.addTodo(newTodo).pipe(
          map(() => TodoActions.addTodoSuccess({ todo: newTodo })),
          catchError(() => of({ type: 'Add Todo Failed' })),
        );
      }),
    ),
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      switchMap(({ id, title }) =>
        this.todoService.updateTodo(id, title).pipe(
          map(() => TodoActions.updateTodoSuccess({ id, title })),
          catchError(() => of({ type: 'Update Todo Failed' })),
        ),
      ),
    ),
  );

  removeTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.removeTodo),
      switchMap(({ id }) =>
        this.todoService.removeTodo(id).pipe(
          map(() => TodoActions.removeTodoSuccess({ id })),
          catchError(() => of({ type: 'Remove Todo Failed' })),
        ),
      ),
    ),
  );

  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearCompleted),
      switchMap(() =>
        this.todoService.clearCompleted().pipe(
          map((todos) => TodoActions.clearCompletedSuccess({ todos })),
          catchError(() => of({ type: 'Clear Completed Failed' })),
        ),
      ),
    ),
  );

    markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.markAll),
      switchMap(({ completed }) =>
        this.todoService.markAll(completed).pipe(
          map((todos) => TodoActions.markAllSuccess({ todos })),
          catchError(() => of({ type: 'Mark All Failed' })),
        ),
      ),
    ),
  );

  persistTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodoSuccess,
          TodoActions.toggleTodo,
          TodoActions.updateTodoSuccess,
          TodoActions.removeTodoSuccess,
          TodoActions.clearCompletedSuccess,
          TodoActions.markAllSuccess
        ),
        tap(() => {
          this.todoService.persistTodos();
        }),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}

```

```typescript
// src/app/state/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(selectTodoState, (state) => state.todos);

export const selectRemainingCount = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => !todo.completed).length,
);

export const selectDoneCount = createSelector(
  selectTodos,
  (todos) => todos.filter((todo) => todo.completed).length
);

export const selectAllChecked = createSelector(selectRemainingCount, (remainingCount) => remainingCount === 0);

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

```typescript
// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';
import { selectTodos } from '../state/todo.selectors';
import { TodoState } from '../state/todo.reducer';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private STORAGE_ID = 'todos-angular';
  private todos: Todo[] = [];

  constructor(private store: Store<TodoState>) {
    this.store.select(selectTodos).subscribe(todos => this.todos = todos);
  }

  getTodos(): Observable<Todo[]> {
     const storedTodos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
     return of(storedTodos);
  }

  addTodo(todo: Todo): Observable<void> {
    return of(undefined);
  }

  updateTodo(id: number, title: string): Observable<void> {
    return of(undefined);
  }


  removeTodo(id: number): Observable<void> {
    return of(undefined);
  }

  clearCompleted(): Observable<Todo[]> {
    const updatedTodos = this.todos.filter((val) => !val.completed);
    return of(updatedTodos);
  }

  markAll(completed: boolean): Observable<Todo[]> {
    const updatedTodos = this.todos.map((todo) => ({
        ...todo,
        completed: completed
    }));
    return of(updatedTodos);
  }

  persistTodos() {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.todos));
  }
}

```

```typescript
// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form class="todo-form" (submit)="onAddTodo()">
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          [(ngModel)]="newTodoTitle"
          name="newTodo"
          autofocus
        />
      </form>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  newTodoTitle = '';

  constructor(private store: Store) {}

  onAddTodo() {
    if (this.newTodoTitle.trim().length) {
      this.store.dispatch(addTodo({ title: this.newTodoTitle.trim() }));
      this.newTodoTitle = '';
    }
  }
}

```

```typescript
// src/app/components/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectAllChecked, selectFilteredTodos } from '../../state/todo.selectors';
import { markAll, loadTodos } from '../../state/todo.actions';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  template: `
    <section class="main" *ngIf="(todos$ | async)?.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        [checked]="allChecked$ | async"
        (change)="onMarkAllChange($event)"
      />
      <label for="toggle-all">Mark all as complete</label>
      <app-todo-list [filter]="currentFilter"></app-todo-list>
    </section>
  `,
  styles: [],
})
export class MainComponent implements OnInit{
  todos$: Observable<Todo[]>;
  allChecked$: Observable<boolean>;
  currentFilter: string = 'all';

  constructor(private store: Store, private route: ActivatedRoute) {
    this.allChecked$ = this.store.select(selectAllChecked);
    this.todos$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.currentFilter = params.get('filter') || 'all';
        return this.store.select(selectFilteredTodos, { filter: this.currentFilter });
      })
    );
  }

    ngOnInit(): void {
        this.store.dispatch(loadTodos());
    }

  onMarkAllChange(event: any) {
    this.store.dispatch(markAll({ completed: event.target.checked }));
  }
}

```

```typescript
// src/app/components/todo-list/todo-list.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectFilteredTodos } from '../../state/todo.selectors';

@Component({
  selector: 'app-todo-list',
  template: `
    <ul class="todo-list">
      <app-todo-item
        *ngFor="let todo of todos$ | async; trackBy: trackByFn"
        [todo]="todo"
      ></app-todo-item>
    </ul>
  `,
  styles: [],
})
export class TodoListComponent implements OnChanges {
  todos$: Observable<Todo[]>;
  @Input() filter: string = 'all';

  constructor(private store: Store) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter']) {
            this.todos$ = this.store.select(selectFilteredTodos, { filter: this.filter });
        }
    }

  trackByFn(index: number, item: Todo) {
    return item.id;
  }
}

```

```typescript
// src/app/components/todo-item/todo-item.component.ts
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { removeTodo, toggleTodo, updateTodo } from '../../state/todo.actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          [checked]="todo.completed"
          (change)="onToggle()"
        />
        <label (dblclick)="editTodo()">{{ todo.title }}</label>
        <button class="destroy" (click)="onRemove()"></button>
      </div>
      <form *ngIf="editing" (submit)="doneEditing()">
        <input
          class="edit"
          [(ngModel)]="editText"
          name="editText"
          #todoInput
          (blur)="doneEditing()"
          todoEscape
          (todoEscape)="revertEditing()"
          todoFocus
          [todoFocus]="editing"
        />
      </form>
    </li>
  `,
  styles: [],
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  editing = false;
  editText = '';

  constructor(private store: Store) {}

  onToggle() {
    this.store.dispatch(toggleTodo({ id: this.todo.id }));
  }

  onRemove() {
    this.store.dispatch(removeTodo({ id: this.todo.id }));
  }

  editTodo() {
    this.editing = true;
    this.editText = this.todo.title;
  }

  doneEditing() {
    if (this.editing) {
      this.store.dispatch(updateTodo({ id: this.todo.id, title: this.editText.trim() }));
      this.editing = false;
    }
  }

  revertEditing() {
    this.editing = false;
    this.editText = this.todo.title;
  }
}

```

```typescript
// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRemainingCount, selectDoneCount } from '../../state/todo.selectors';
import { clearCompleted } from '../../state/todo.actions';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer" *ngIf="(remainingCount$ | async) > 0 || (doneCount$ | async) > 0">
        <span class="todo-count">
          <strong>{{ remainingCount$ | async }}</strong>
          {{ (remainingCount$ | async) === 1 ? 'item' : 'items' }} left
        </span>
      <ul class="filters">
        <li>
          <a [class.selected]="currentFilter === 'all'" [routerLink]="['/all']">All</a>
        </li>
        <li>
          <a [class.selected]="currentFilter === 'active'" [routerLink]="['/active']">Active</a>
        </li>
        <li>
          <a [class.selected]="currentFilter === 'completed'" [routerLink]="['/completed']">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        *ngIf="(doneCount$ | async) > 0"
        (click)="onClearCompleted()"
      >
        Clear completed
      </button>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {
  remainingCount$: Observable<number>;
  doneCount$: Observable<number>;
    currentFilter: string = 'all';

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    this.remainingCount$ = this.store.select(selectRemainingCount);
    this.doneCount$ = this.store.select(selectDoneCount);
    this.route.params.subscribe(params => {
        this.currentFilter = params['filter'] || 'all';
    });
  }

  onClearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}

```

```typescript
// src/app/directives/todo-focus.directive.ts
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]',
})
export class TodoFocusDirective implements OnChanges {
  @Input() todoFocus!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todoFocus'] && this.todoFocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}

```

```typescript
// src/app/directives/todo-escape.directive.ts
import { Directive, ElementRef, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[todoEscape]',
})
export class TodoEscapeDirective implements OnDestroy {
  @Output() todoEscape = new EventEmitter<void>();
  private ESCAPE_KEY = 27;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEY) {
      this.todoEscape.emit();
    }
  }

    ngOnDestroy(): void {
        // No need to unbind keydown as Angular handles it for HostListener
    }
}

```

```typescript
// src/app/models/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

```

```
// src/index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular & NgRx • TodoMVC</title>
  <link rel="stylesheet" href="assets/base.css">
  <link rel="stylesheet" href="assets/index.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>

```

Key changes and explanations:

*   **Complete Component Structure:** The application is broken down into smaller, manageable components:
    *   `AppComponent`: The root component.
    *   `HeaderComponent`: Handles adding new todos.
    *   `MainComponent`:  Contains the main todo list and toggle-all functionality.
    *   `TodoListComponent`:  Renders the list of todos.
    *   `TodoItemComponent`:  Renders a single todo item, handling editing, toggling, and deletion.
    *   `FooterComponent`: Displays statistics and filtering options.

*   **NgRx Store Implementation:**
    *   **Actions (`todo.actions.ts`):**  Defines all possible actions that can affect the todo state (load, add, toggle, update, remove, clear completed, mark all).  Uses `createAction` for type safety.
    *   **Reducer (`todo.reducer.ts`):**  Handles state transitions based on actions.  Uses `createReducer` and `on` to handle actions immutably.  The reducer now manages an array of `Todo` objects.
    *   **Effects (`todo.effects.ts`):**  Handles side effects, primarily interacting with `TodoService` for persistence.  Uses `createEffect` and RxJS operators (`switchMap`, `map`, `catchError`, `tap`) to manage asynchronous operations.  The `persistTodos$` effect saves the state to local storage after any state-changing action.
    *   **Selectors (`todo.selectors.ts`):**  Provides efficient ways to select slices of the state.  Uses `createFeatureSelector` and `createSelector` for memoization and performance.  Includes selectors for the todo list, remaining count, done count, all checked status, and filtered todos.
    *   **Service Interaction:** Effects now delegate data persistence logic to the `TodoService`.  This keeps the effects focused on managing the asynchronous flow and dispatching actions.

*   **`TodoService`:**  Handles data persistence to local storage.  It's now an injectable service, and the effects use it to load and save todos.  The service methods return Observables, even though some operations are synchronous, to maintain consistency with asynchronous operations and allow for potential future changes (e.g., switching to an API).

*   **Directives:**
    *   `TodoFocusDirective`:  Focuses on the input element when `todoFocus` is true. Uses `ngOnChanges` lifecycle hook.
    *   `TodoEscapeDirective`:  Emits an event when the Escape key is pressed. Uses `@HostListener` for a cleaner way to listen to DOM events.

*   **Routing:** Basic routing is implemented to handle filtering (all, active, completed). The `MainComponent` uses `ActivatedRoute` to get the current filter from the URL.

*   **Templates:**  Angular template syntax is used throughout:
    *   `*ngFor`:  Replaces `ng-repeat`.
    *   `[class.completed]`:  Replaces `ng-class="{completed: todo.completed}"`.
    *   `(click)`, `(change)`, `(submit)`:  Replaces `ng-click`, `ng-change`, `ng-submit`.
    *   `[(ngModel)]`:  Replaces `ng-model` for two-way data binding.
    *   `| async`:  The `async` pipe is used to subscribe to Observables directly in the template.
    *   `trackBy`: Added to `*ngFor` for performance optimization.

*   **ES Modules:**  The code uses ES modules (`import`/`export`) instead of RequireJS.

*   **Type Safety:**  TypeScript is used throughout, providing type safety and better code maintainability.

*   **Immutability:** The reducer uses immutable operations (e.g., spread operator, `map`, `filter`) to update the state, which is crucial for NgRx.

*   **Best Practices:**
    *   Component architecture for better organization and reusability.
    *   NgRx for predictable state management.
    *   Separation of concerns (services for data, effects for side effects).
    *   Use of Observables and RxJS for asynchronous operations.
    *   Angular template syntax and directives.
    *   Type safety with TypeScript.

* **Removed RequireJS:** The entire application is now structured using ES Modules, eliminating the need for RequireJS.

* **index.html:** Simplified to load only the necessary CSS and the Angular application.

This comprehensive refactoring provides a robust, maintainable, and scalable TodoMVC application built with Angular 14 and NgRx, adhering to modern best practices.  It addresses all the requirements of the prompt, including state management, componentization, service usage, template updates, directive conversions, and code optimization.


### Tokens: {'input_tokens': 2825, 'output_tokens': 6526}
### Execution time: 96.13717794418335
