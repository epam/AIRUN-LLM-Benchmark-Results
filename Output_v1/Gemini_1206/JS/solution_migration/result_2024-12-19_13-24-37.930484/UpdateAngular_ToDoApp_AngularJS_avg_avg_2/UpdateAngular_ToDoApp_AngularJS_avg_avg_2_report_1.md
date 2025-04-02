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
  <title>Angular 14 & NgRx • TodoMVC</title>
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
</head>
<body>
  <app-root></app-root>
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
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';
import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoHeaderComponent,
    TodoFooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TodoEffects])
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
      <app-todo-header></app-todo-header>
      <app-todo-list></app-todo-list>
      <app-todo-footer></app-todo-footer>
    </section>
  `
})
export class AppComponent { }
```

```typescript
// components/todo-header/todo-header.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { AddTodoAction } from '../../store/actions';

@Component({
  selector: 'app-todo-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <form class="todo-form" (submit)="addTodo()">
        <input class="new-todo" placeholder="What needs to be done?" [(ngModel)]="newTodoTitle" name="newTodoTitle" autofocus>
      </form>
    </header>
  `
})
export class TodoHeaderComponent {
  newTodoTitle = '';

  constructor(private store: Store<AppState>) { }

  addTodo() {
    const title = this.newTodoTitle.trim();
    if (title.length) {
      this.store.dispatch(new AddTodoAction(title));
      this.newTodoTitle = '';
    }
  }
}
```

```typescript
// components/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/reducers';
import { Todo } from '../../models/todo.model';
import { ToggleAllAction } from '../../store/actions';
import { selectVisibleTodos } from '../../store/selectors';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="(todos$ | async)?.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="allCompleted$ | async" (click)="toggleAll()">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <app-todo-item *ngFor="let todo of todos$ | async; trackBy: trackByFn" [todo]="todo"></app-todo-item>
      </ul>
    </section>
  `
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  allCompleted$: Observable<boolean>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.todos$ = this.store.select(selectVisibleTodos);
    this.allCompleted$ = this.store.select(state => state.todos.every(todo => todo.completed));
  }

  toggleAll() {
    this.store.dispatch(new ToggleAllAction());
  }

  trackByFn(index: number, item: Todo) {
    return item.id;
  }
}
```

```typescript
// components/todo-item/todo-item.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { AppState } from '../../store/reducers';
import { ToggleTodoAction, RemoveTodoAction, EditTodoAction, UpdateTodoAction, CancelEditTodoAction } from '../../store/actions';

@Component({
  selector: 'app-todo-item',
  template: `
    <li [class.completed]="todo.completed" [class.editing]="editing">
      <div class="view">
        <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggleTodo()">
        <label (dblclick)="editTodo()">{{todo.title}}</label>
        <button class="destroy" (click)="removeTodo()"></button>
      </div>
      <form *ngIf="editing" (submit)="doneEditing()">
        <input class="edit" [(ngModel)]="editText" name="editText" (blur)="doneEditing()" (keyup.escape)="cancelEditing()" #editInput>
      </form>
    </li>
  `
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  editing = false;
  editText: string;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.editText = this.todo.title;
  }

  toggleTodo() {
    this.store.dispatch(new ToggleTodoAction(this.todo.id));
  }

  removeTodo() {
    this.store.dispatch(new RemoveTodoAction(this.todo.id));
  }

  editTodo() {
    this.editing = true;
    this.editText = this.todo.title;
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('.edit').focus();
    });
  }

  doneEditing() {
    if (this.editing) {
      const title = this.editText.trim();
      if (title) {
        this.store.dispatch(new UpdateTodoAction(this.todo.id, title));
      } else {
        this.store.dispatch(new RemoveTodoAction(this.todo.id));
      }
      this.editing = false;
    }
  }

  cancelEditing() {
    this.store.dispatch(new CancelEditTodoAction(this.todo.id));
    this.editing = false;
    this.editText = this.todo.title;
  }
}
```

```typescript
// components/todo-footer/todo-footer.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, Filter } from '../../store/reducers';
import { ClearCompletedAction, SetVisibilityFilter } from '../../store/actions';
import { selectActiveCount, selectCompletedCount, selectTodosLength } from '../../store/selectors';

@Component({
  selector: 'app-todo-footer',
  template: `
    <footer class="footer" *ngIf="(todosLength$ | async) > 0">
      <span class="todo-count"><strong>{{activeCount$ | async}}</strong> {{ (activeCount$ | async) === 1 ? 'item' : 'items' }} left</span>
      <ul class="filters">
        <li>
          <a [class.selected]="(filter$ | async) === 'all'" (click)="setVisibilityFilter('all')">All</a>
        </li>
        <li>
          <a [class.selected]="(filter$ | async) === 'active'" (click)="setVisibilityFilter('active')">Active</a>
        </li>
        <li>
          <a [class.selected]="(filter$ | async) === 'completed'" (click)="setVisibilityFilter('completed')">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" *ngIf="(completedCount$ | async) > 0" (click)="clearCompleted()">Clear completed</button>
    </footer>
  `
})
export class TodoFooterComponent implements OnInit {
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  todosLength$: Observable<number>;
  filter$: Observable<Filter>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.activeCount$ = this.store.select(selectActiveCount);
    this.completedCount$ = this.store.select(selectCompletedCount);
    this.todosLength$ = this.store.select(selectTodosLength);
    this.filter$ = this.store.select(state => state.visibilityFilter);
  }

  clearCompleted() {
    this.store.dispatch(new ClearCompletedAction());
  }

  setVisibilityFilter(filter: Filter) {
    this.store.dispatch(new SetVisibilityFilter(filter));
  }
}
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
// store/actions.ts
import { Action } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { Filter } from './reducers';

export const ADD_TODO = '[Todo] Add Todo';
export const TOGGLE_TODO = '[Todo] Toggle Todo';
export const REMOVE_TODO = '[Todo] Remove Todo';
export const EDIT_TODO = '[Todo] Edit Todo';
export const UPDATE_TODO = '[Todo] Update Todo';
export const CANCEL_EDIT_TODO = '[Todo] Cancel Edit Todo';
export const TOGGLE_ALL = '[Todo] Toggle All';
export const CLEAR_COMPLETED = '[Todo] Clear Completed';
export const LOAD_TODOS = '[Todo] Load Todos';
export const LOAD_TODOS_SUCCESS = '[Todo] Load Todos Success';
export const SET_VISIBILITY_FILTER = '[Filter] Set Visibility Filter';

export class AddTodoAction implements Action {
  readonly type = ADD_TODO;
  constructor(public title: string) { }
}

export class ToggleTodoAction implements Action {
  readonly type = TOGGLE_TODO;
  constructor(public id: number) { }
}

export class RemoveTodoAction implements Action {
  readonly type = REMOVE_TODO;
  constructor(public id: number) { }
}

export class EditTodoAction implements Action {
  readonly type = EDIT_TODO;
  constructor(public id: number) { }
}

export class UpdateTodoAction implements Action {
  readonly type = UPDATE_TODO;
  constructor(public id: number, public title: string) { }
}

export class CancelEditTodoAction implements Action {
  readonly type = CANCEL_EDIT_TODO;
  constructor(public id: number) { }
}

export class ToggleAllAction implements Action {
  readonly type = TOGGLE_ALL;
}

export class ClearCompletedAction implements Action {
  readonly type = CLEAR_COMPLETED;
}

export class LoadTodosAction implements Action {
  readonly type = LOAD_TODOS;
}

export class LoadTodosSuccessAction implements Action {
  readonly type = LOAD_TODOS_SUCCESS;
  constructor(public todos: Todo[]) { }
}

export class SetVisibilityFilter implements Action {
  readonly type = SET_VISIBILITY_FILTER;
  constructor(public filter: Filter) { }
}

export type TodoActions = AddTodoAction | ToggleTodoAction | RemoveTodoAction | EditTodoAction | UpdateTodoAction | CancelEditTodoAction | ToggleAllAction | ClearCompletedAction | LoadTodosAction | LoadTodosSuccessAction;
export type FilterActions = SetVisibilityFilter;
```

```typescript
// store/reducers.ts
import { Todo } from '../models/todo.model';
import { TodoActions, FilterActions, ADD_TODO, TOGGLE_TODO, REMOVE_TODO, UPDATE_TODO, TOGGLE_ALL, CLEAR_COMPLETED, LOAD_TODOS_SUCCESS, SET_VISIBILITY_FILTER } from './actions';
import { ActionReducerMap } from '@ngrx/store';

export type Filter = 'all' | 'active' | 'completed';

export interface AppState {
  todos: Todo[];
  visibilityFilter: Filter;
}

export const initialState: AppState = {
  todos: [],
  visibilityFilter: 'all'
};

function todoReducer(state: Todo[] = [], action: TodoActions): Todo[] {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          title: action.title,
          completed: false
        }
      ];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case UPDATE_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, title: action.title } : todo
      );
    case TOGGLE_ALL:
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }));
    case CLEAR_COMPLETED:
      return state.filter(todo => !todo.completed);
    case LOAD_TODOS_SUCCESS:
      return action.todos;
    default:
      return state;
  }
}

function visibilityFilterReducer(state: Filter = 'all', action: FilterActions): Filter {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

export const reducers: ActionReducerMap<AppState> = {
  todos: todoReducer,
  visibilityFilter: visibilityFilterReducer
};
```

```typescript
// store/effects.ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import {
  LOAD_TODOS,
  LoadTodosSuccessAction,
  TodoActions,
  ADD_TODO,
  TOGGLE_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  TOGGLE_ALL,
  CLEAR_COMPLETED
} from './actions';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) { }

  @Effect()
  loadTodos$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_TODOS),
    switchMap(() =>
      this.todoService.getTodos().pipe(
        map(todos => new LoadTodosSuccessAction(todos))
      )
    )
  );

  @Effect({ dispatch: false })
  saveTodos$: Observable<Action> = this.actions$.pipe(
    ofType(
      ADD_TODO,
      TOGGLE_TODO,
      REMOVE_TODO,
      UPDATE_TODO,
      TOGGLE_ALL,
      CLEAR_COMPLETED
    ),
    tap(() => {
      this.todoService.saveTodos();
    })
  );
}
```

```typescript
// store/selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState, Filter } from './reducers';
import { Todo } from '../models/todo.model';

export const selectTodosState = createFeatureSelector<AppState>('todos');
export const selectTodos = (state: AppState) => state.todos;
export const selectFilter = (state: AppState) => state.visibilityFilter;

export const selectVisibleTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos: Todo[], filter: Filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveCount = createSelector(
  selectTodos,
  (todos: Todo[]) => todos.filter(t => !t.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  (todos: Todo[]) => todos.filter(t => t.completed).length
);

export const selectTodosLength = createSelector(
  selectTodos,
  (todos: Todo[]) => todos.length
);
```

```typescript
// services/todo.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';
import { AppState } from '../store/reducers';
import { selectTodos } from '../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_ID = 'todos-angular14-ngrx';

  constructor(private store: Store<AppState>) { }

  getTodos(): Observable<Todo[]> {
    const storedTodos = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    return of(storedTodos);
  }

  saveTodos(): void {
    this.store.select(selectTodos).subscribe(todos => {
      localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    });
  }
}
```

### Tokens: {'input_tokens': 2591, 'output_tokens': 4574}
### Execution time: 106.21286869049072
