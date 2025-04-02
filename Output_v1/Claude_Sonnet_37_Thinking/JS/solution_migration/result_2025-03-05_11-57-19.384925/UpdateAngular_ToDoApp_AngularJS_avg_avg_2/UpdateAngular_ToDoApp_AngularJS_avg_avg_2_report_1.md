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
### Thoughts:
Alright, I'm tasked with migrating an AngularJS (1.x) application to Angular 14.x, implementing some modern patterns with @ngrx/store and @ngrx/effects, and splitting the code into separate components. Let me outline my approach:

1. **Project structure**: Create a standard Angular 14.x project structure
2. **Components**: Break down the monolithic TodoController into smaller components
3. **NgRx store implementation**: Define actions, reducers, effects, and selectors
4. **Services**: Update the todoStorage service to work with modern Angular
5. **Directives**: Rewrite directives as Angular directives
6. **Routing**: Implement Angular Router

Let's start by defining the project structure:

```
src/
├── app/
│   ├── components/
│   │   ├── todo-list/
│   │   ├── todo-item/
│   │   ├── todo-footer/
│   │   ├── todo-header/
│   │   └── todo-main/
│   ├── directives/
│   │   ├── todo-escape.directive.ts
│   │   └── todo-focus.directive.ts
│   ├── models/
│   │   └── todo.model.ts
│   ├── services/
│   │   └── todo-storage.service.ts
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   ├── app-routing.module.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
├── environments/
├── index.html
└── main.ts
```

Now, let's start by defining the basic model for a Todo:

**todo.model.ts**
```typescript
export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
}
```

Next, let's implement the NgRx store with actions, reducers, effects, and selectors:

**actions/todo.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ todo: Todo }>()
);
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ todo: Todo }>()
);
export const clearCompletedTodos = createAction(
  '[Todo] Clear Completed Todos'
);
export const markAllTodos = createAction(
  '[Todo] Mark All Todos',
  props<{ completed: boolean }>()
);
```

**reducers/todo.reducer.ts**
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
}

export const initialState: TodoState = {
  todos: [],
  loading: false
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      { 
        id: Date.now().toString(), // Simple id generation
        title, 
        completed: false 
      }
    ]
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(item => 
      item.id === todo.id ? { ...todo } : item
    )
  })),
  on(TodoActions.deleteTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.filter(item => item.id !== todo.id)
  })),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.markAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({
      ...todo,
      completed
    }))
  }))
);
```

**reducers/index.ts**
```typescript
import { ActionReducerMap } from '@ngrx/store';
import * as fromTodo from './todo.reducer';

export interface AppState {
  todos: fromTodo.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodo.todoReducer
};
```

**selectors/todo.selectors.ts**
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => todo.completed)
);

export const selectActiveCount = createSelector(
  selectActiveTodos,
  todos => todos.length
);

export const selectCompletedCount = createSelector(
  selectCompletedTodos,
  todos => todos.length
);

export const selectAllCompleted = createSelector(
  selectActiveCount,
  count => count === 0
);
```

**effects/todo.effects.ts**
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { TodoStorageService } from '../../services/todo-storage.service';
import * as TodoActions from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => 
        of(this.todoStorage.getTodos()).pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(() => of(TodoActions.loadTodosSuccess({ todos: [] })))
        )
      )
    )
  );

  saveTodos$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.updateTodo,
        TodoActions.deleteTodo,
        TodoActions.clearCompletedTodos,
        TodoActions.markAllTodos
      ),
      tap(() => {
        this.todoStorage.saveTodos();
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoStorage: TodoStorageService
  ) {}
}
```

Now, let's implement the storage service:

**todo-storage.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { selectAllTodos } from '../store/selectors/todo.selectors';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {
  private STORAGE_KEY = 'todos-angular';
  private todos: Todo[] = [];

  constructor(private store: Store) {
    // Subscribe to todos in the store to keep track of current state
    this.store.select(selectAllTodos).subscribe(todos => {
      this.todos = todos;
    });
  }

  getTodos(): Todo[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  saveTodos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
  }
}
```

Now, let's implement the directives:

**todo-focus.directive.ts**
```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') shouldFocus!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shouldFocus'] && this.shouldFocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```

**todo-escape.directive.ts**
```typescript
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.appTodoEscape.emit();
  }
}
```

Now, let's implement the components:

**app.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from './store/actions/todo.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }
}
```

**app.component.html**
```html
<section class="todoapp">
  <app-todo-header></app-todo-header>
  <app-todo-main></app-todo-main>
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
<router-outlet></router-outlet>
```

**todo-header.component.ts**
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss']
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

**todo-header.component.html**
```html
<header class="header">
  <h1>todos</h1>
  <form class="todo-form" (ngSubmit)="addTodo()">
    <input 
      class="new-todo" 
      placeholder="What needs to be done?" 
      [(ngModel)]="newTodo" 
      name="newTodo"
      autofocus>
  </form>
</header>
```

**todo-main.component.ts**
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { selectAllCompleted, selectAllTodos } from '../../store/selectors/todo.selectors';
import { markAllTodos } from '../../store/actions/todo.actions';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-main',
  templateUrl: './todo-main.component.html',
  styleUrls: ['./todo-main.component.scss']
})
export class TodoMainComponent {
  todos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;
  filteredTodos$: Observable<Todo[]>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.todos$ = this.store.select(selectAllTodos);
    this.allCompleted$ = this.store.select(selectAllCompleted);
    
    // Filter todos based on the current route
    this.filteredTodos$ = this.todos$.pipe(
      map(todos => {
        const filter = this.route.snapshot.url[0]?.path;
        if (filter === 'active') {
          return todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
          return todos.filter(todo => todo.completed);
        }
        return todos;
      })
    );
  }

  markAll(completed: boolean): void {
    this.store.dispatch(markAllTodos({ completed }));
  }
}
```

**todo-main.component.html**
```html
<section class="main" *ngIf="(todos$ | async)?.length">
  <input 
    id="toggle-all" 
    class="toggle-all" 
    type="checkbox" 
    [checked]="allCompleted$ | async" 
    (click)="markAll(!(allCompleted$ | async))">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item 
      *ngFor="let todo of filteredTodos$ | async" 
      [todo]="todo">
    </app-todo-item>
  </ul>
</section>
```

**todo-item.component.ts**
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { deleteTodo, updateTodo } from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  editing = false;
  originalTitle = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (!this.todo) {
      throw new Error('TodoItemComponent: todo input is required');
    }
  }

  editTodo(): void {
    this.editing = true;
    this.originalTitle = this.todo.title;
  }

  updateTodoStatus(): void {
    this.store.dispatch(updateTodo({ 
      todo: { ...this.todo }
    }));
  }

  removeTodo(): void {
    this.store.dispatch(deleteTodo({ todo: this.todo }));
  }

  doneEditing(): void {
    if (!this.editing) return;
    
    this.editing = false;
    this.todo.title = this.todo.title.trim();
    
    if (this.todo.title) {
      this.store.dispatch(updateTodo({ todo: { ...this.todo } }));
    } else {
      this.removeTodo();
    }
  }

  revertEditing(): void {
    this.editing = false;
    this.todo.title = this.originalTitle;
  }
}
```

**todo-item.component.html**
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input 
      class="toggle" 
      type="checkbox" 
      [checked]="todo.completed" 
      (change)="todo.completed = !todo.completed; updateTodoStatus()">
    <label (dblclick)="editTodo()">{{ todo.title }}</label>
    <button class="destroy" (click)="removeTodo()"></button>
  </div>
  <form (ngSubmit)="doneEditing()">
    <input 
      class="edit" 
      [(ngModel)]="todo.title" 
      name="title"
      [appTodoFocus]="editing"
      (blur)="doneEditing()"
      (appTodoEscape)="revertEditing()">
  </form>
</li>
```

**todo-footer.component.ts**
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectActiveCount, selectCompletedCount } from '../../store/selectors/todo.selectors';
import { clearCompletedTodos } from '../../store/actions/todo.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent {
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompletedTodos());
  }

  getRouteClass(path: string): { selected: boolean } {
    return { 
      selected: this.router.url === path 
    };
  }
}
```

**todo-footer.component.html**
```html
<footer class="footer" *ngIf="(activeCount$ | async)! + (completedCount$ | async)! > 0">
  <span class="todo-count">
    <strong>{{ activeCount$ | async }}</strong>
    <ng-container *ngIf="(activeCount$ | async) === 1; else pluralItems">
      item left
    </ng-container>
    <ng-template #pluralItems>
      items left
    </ng-template>
  </span>
  <ul class="filters">
    <li>
      <a [ngClass]="getRouteClass('/')" routerLink="/">All</a>
    </li>
    <li>
      <a [ngClass]="getRouteClass('/active')" routerLink="/active">Active</a>
    </li>
    <li>
      <a [ngClass]="getRouteClass('/completed')" routerLink="/completed">Completed</a>
    </li>
  </ul>
  <button 
    class="clear-completed" 
    (click)="clearCompleted()" 
    *ngIf="(completedCount$ | async)! > 0">
    Clear completed
  </button>
</footer>
```

Now, let's implement the app module and routing:

**app-routing.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'active', redirectTo: '/active', pathMatch: 'full' },
  { path: 'completed', redirectTo: '/completed', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoMainComponent } from './components/todo-main/todo-main.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoMainComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Finally, let's update the main index.html:

**index.html**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular • TodoMVC</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="stylesheet" href="https://unpkg.com/todomvc-common@1.0.5/base.css">
  <link rel="stylesheet" href="https://unpkg.com/todomvc-app-css@2.4.1/index.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

And the main.ts file:

**main.ts**
```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

This covers the migration from AngularJS to Angular 14.x, implementing NgRx store and effects, and splitting the monolithic controller into smaller, more manageable components. The functionality should be the same as the original application but with a more modern architecture.

### Answer:
# Migrated Angular 14 TodoMVC Application

## Project Structure

### Models

#### src/app/models/todo.model.ts
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### Store Implementation

#### src/app/store/actions/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ todo: Todo }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);

export const clearCompletedTodos = createAction(
  '[Todo] Clear Completed Todos'
);

export const markAllTodos = createAction(
  '[Todo] Mark All Todos',
  props<{ completed: boolean }>()
);
```

#### src/app/store/reducers/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
}

export const initialState: TodoState = {
  todos: [],
  loading: false
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [
      ...state.todos,
      {
        id: Date.now().toString(),
        title,
        completed: false
      }
    ]
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(item => 
      item.id === todo.id ? todo : item
    )
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.clearCompletedTodos, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  })),
  on(TodoActions.markAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({
      ...todo,
      completed
    }))
  }))
);
```

#### src/app/store/reducers/index.ts
```typescript
import { ActionReducerMap } from '@ngrx/store';
import * as fromTodo from './todo.reducer';

export interface AppState {
  todos: fromTodo.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodo.todoReducer
};
```

#### src/app/store/selectors/todo.selectors.ts
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => todo.completed)
);

export const selectTodoCount = createSelector(
  selectAllTodos,
  todos => todos.length
);

export const selectActiveCount = createSelector(
  selectActiveTodos,
  todos => todos.length
);

export const selectCompletedCount = createSelector(
  selectCompletedTodos,
  todos => todos.length
);

export const selectAllCompleted = createSelector(
  selectTodoCount,
  selectActiveCount,
  (total, active) => total > 0 && active === 0
);

export const selectFilteredTodos = (filter: string) => createSelector(
  selectAllTodos,
  todos => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);
```

#### src/app/store/effects/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TodoStorageService } from '../../services/todo-storage.service';
import * as TodoActions from '../actions/todo.actions';
import { selectAllTodos } from '../selectors/todo.selectors';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = this.todoStorage.getTodos();
        return of(TodoActions.loadTodosSuccess({ todos }));
      })
    )
  );

  saveTodos$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.updateTodo,
        TodoActions.deleteTodo,
        TodoActions.clearCompletedTodos,
        TodoActions.markAllTodos
      ),
      withLatestFrom(this.store.select(selectAllTodos)),
      map(([_, todos]) => {
        this.todoStorage.saveTodos(todos);
        return { type: '[Todo] Save Success' };
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private todoStorage: TodoStorageService
  ) {}
}
```

### Services

#### src/app/services/todo-storage.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoStorageService {
  private STORAGE_KEY = 'todos-angular';

  getTodos(): Todo[] {
    try {
      const storedTodos = localStorage.getItem(this.STORAGE_KEY);
      const todos = storedTodos ? JSON.parse(storedTodos) : [];
      
      // Add IDs to legacy todos if they don't have them
      return todos.map((todo: any) => ({
        id: todo.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        title: todo.title,
        completed: todo.completed
      }));
    } catch (e) {
      console.error('Error loading todos from localStorage', e);
      return [];
    }
  }

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }
}
```

### Directives

#### src/app/directives/todo-focus.directive.ts
```typescript
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTodoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input('appTodoFocus') shouldFocus!: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shouldFocus'] && this.shouldFocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
```

#### src/app/directives/todo-escape.directive.ts
```typescript
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTodoEscape]'
})
export class TodoEscapeDirective {
  @Output() appTodoEscape = new EventEmitter<void>();

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.appTodoEscape.emit();
  }
}
```

### Components

#### src/app/components/todo-header/todo-header.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTodo } from '../../store/actions/todo.actions';

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

#### src/app/components/todo-header/todo-header.component.html
```html
<header class="header">
  <h1>todos</h1>
  <form class="todo-form" (ngSubmit)="addTodo()">
    <input 
      class="new-todo" 
      placeholder="What needs to be done?" 
      [(ngModel)]="newTodo" 
      name="newTodo"
      autofocus>
  </form>
</header>
```

#### src/app/components/todo-list/todo-list.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';
import { markAllTodos } from '../../store/actions/todo.actions';
import { selectAllCompleted, selectFilteredTodos, selectTodoCount } from '../../store/selectors/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  allCompleted$!: Observable<boolean>;
  hasTodos$!: Observable<boolean>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.allCompleted$ = this.store.select(selectAllCompleted);
    this.hasTodos$ = this.store.select(selectTodoCount).pipe(
      map(count => count > 0)
    );

    this.todos$ = this.route.url.pipe(
      map(segments => segments.length ? segments[0].path : ''),
      switchMap(filter => this.store.select(selectFilteredTodos(filter)))
    );
  }

  toggleAll(completed: boolean): void {
    this.store.dispatch(markAllTodos({ completed }));
  }
}
```

#### src/app/components/todo-list/todo-list.component.html
```html
<section class="main" *ngIf="hasTodos$ | async">
  <input 
    id="toggle-all" 
    class="toggle-all" 
    type="checkbox" 
    [checked]="allCompleted$ | async" 
    (click)="toggleAll(!(allCompleted$ | async))">
  <label for="toggle-all">Mark all as complete</label>
  <ul class="todo-list">
    <app-todo-item 
      *ngFor="let todo of todos$ | async" 
      [todo]="todo">
    </app-todo-item>
  </ul>
</section>
```

#### src/app/components/todo-item/todo-item.component.ts
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { deleteTodo, updateTodo } from '../../store/actions/todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  editing = false;
  originalTitle = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (!this.todo) {
      throw new Error('TodoItemComponent requires a todo input');
    }
  }

  editTodo(): void {
    this.editing = true;
    this.originalTitle = this.todo.title;
  }

  saveTodo(): void {
    if (!this.editing) return;
    
    this.editing = false;
    const title = this.todo.title.trim();
    
    if (title) {
      this.store.dispatch(updateTodo({ 
        todo: { ...this.todo, title } 
      }));
    } else {
      this.removeTodo();
    }
  }

  cancelEdit(): void {
    this.editing = false;
    this.todo.title = this.originalTitle;
  }

  toggleCompleted(): void {
    this.store.dispatch(updateTodo({ 
      todo: { ...this.todo, completed: !this.todo.completed } 
    }));
  }

  removeTodo(): void {
    this.store.dispatch(deleteTodo({ id: this.todo.id }));
  }
}
```

#### src/app/components/todo-item/todo-item.component.html
```html
<li [class.completed]="todo.completed" [class.editing]="editing">
  <div class="view">
    <input 
      class="toggle" 
      type="checkbox" 
      [checked]="todo.completed" 
      (change)="toggleCompleted()">
    <label (dblclick)="editTodo()">{{ todo.title }}</label>
    <button class="destroy" (click)="removeTodo()"></button>
  </div>
  <form (ngSubmit)="saveTodo()">
    <input 
      class="edit" 
      [(ngModel)]="todo.title" 
      name="title"
      [appTodoFocus]="editing"
      (blur)="saveTodo()"
      (appTodoEscape)="cancelEdit()">
  </form>
</li>
```

#### src/app/components/todo-footer/todo-footer.component.ts
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { clearCompletedTodos } from '../../store/actions/todo.actions';
import { selectActiveCount, selectCompletedCount } from '../../store/selectors/todo.selectors';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html'
})
export class TodoFooterComponent {
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(private store: Store) {
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
  }

  clearCompleted(): void {
    this.store.dispatch(clearCompletedTodos());
  }
}
```

#### src/app/components/todo-footer/todo-footer.component.html
```html
<footer class="footer" *ngIf="(activeCount$ | async)! + (completedCount$ | async)! > 0">
  <span class="todo-count">
    <strong>{{ activeCount$ | async }}</strong>
    {{ (activeCount$ | async) === 1 ? 'item' : 'items' }} left
  </span>
  <ul class="filters">
    <li>
      <a routerLink="/" routerLinkActive="selected" [routerLinkActiveOptions]="{exact: true}">All</a>
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
    (click)="clearCompleted()" 
    *ngIf="(completedCount$ | async)! > 0">
    Clear completed
  </button>
</footer>
```

### App Component and Module

#### src/app/app.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTodos } from './store/actions/todo.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
  }
}
```

#### src/app/app.component.html
```html
<section class="todoapp">
  <app-todo-header></app-todo-header>
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
```

#### src/app/app-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full' },
  { path: 'active' },
  { path: 'completed' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

#### src/app/app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { TodoFocusDirective } from './directives/todo-focus.directive';
import { TodoEscapeDirective } from './directives/todo-escape.directive';

import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects/todo.effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoHeaderComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoFooterComponent,
    TodoFocusDirective,
    TodoEscapeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Entry Files

#### src/index.html
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular • TodoMVC</title>
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

#### src/main.ts
```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### Tokens: {'input_tokens': 2823, 'output_tokens': 11796}
### Execution time: 129.58901286125183
