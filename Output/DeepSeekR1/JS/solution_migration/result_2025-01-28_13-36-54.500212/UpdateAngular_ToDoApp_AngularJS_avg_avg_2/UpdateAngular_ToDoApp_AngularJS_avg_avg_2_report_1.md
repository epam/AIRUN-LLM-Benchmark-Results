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
<think>
Okay, I need to migrate this AngularJS (Angular 1.x) code to Angular 14.x. Let me start by understanding the original code structure and functionality.

First, looking at the index.html, there's a TodoMVC app with sections for adding todos, listing them, and filtering. The main controller is TodoController, which handles adding, editing, removing todos, and syncing with localStorage via a service. Directives like todoFocus and todoEscape are used for focus management and handling the escape key. The app uses RequireJS for module loading, but Angular 14 uses Angular CLI and ES modules, so I'll need to adjust that.

The user instructions say to use @ngrx/store and @ngrx/effects. So, I should set up NgRx for state management. The original app uses a service (todoStorage) to interact with localStorage. In NgRx, this would translate to effects handling side effects like storage operations, and the store holding the state.

Next, splitting into components. The original HTML has sections for the header, main list, and footer. I can create components like TodoListComponent, TodoItemComponent, FooterComponent, etc.

Let me outline the steps:

1. Set up Angular 14 project with NgRx.
2. Create a Todo model interface.
3. Set up NgRx actions for adding, removing, toggling todos, etc.
4. Create reducers to handle state changes.
5. Implement effects to persist to localStorage.
6. Replace the AngularJS directives with Angular equivalents. For example, todoFocus can be an attribute directive, and todoEscape can be a host listener.
7. Convert the controller into components using Angular's component decorator.
8. Update the template to use Angular syntax (e.g., *ngFor, *ngIf, [(ngModel)]).
9. Handle routing for the filters (All, Active, Completed) using Angular Router.
10. Replace the $scope and $watch with observables and selectors from NgRx.

Starting with the model. Create a Todo interface:

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

Then, set up the state structure. The state might include a list of todos and a filter (all, active, completed).

Actions would include loadTodos, addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, etc.

The reducer will handle these actions to update the state. The effect will listen for certain actions to save to localStorage.

In the components, instead of $scope, we'll use the store to dispatch actions and select state.

For the directives:

- todoFocus: In Angular, create a directive that focuses the element when a condition is met. Use @Input() and ElementRef.
- todoEscape: Use a host listener for the keydown event and emit an event when Escape is pressed.

The original service todoStorage becomes part of the effects. The effect will listen for actions that change the todos and then save to localStorage.

Now, the components:

AppComponent: Main container, includes header, todo list, footer.

TodoListComponent: Displays the list of todos, uses *ngFor over the todos from the store.

TodoItemComponent: Each todo item, handles editing, toggling, and removing.

FooterComponent: Shows the remaining count, filter links, and clear completed button.

Routing: Configure routes for '/', '/active', '/completed'. The filter is determined by the current route.

In the original code, the filter is handled by checking $location.path(). In Angular, use the ActivatedRoute or router events to determine the current filter.

Replace ng-submit with (submit) event bindings. Use Angular forms for the input elements.

Testing each part step by step to ensure functionality matches the original.

Also, since Angular 14 uses standalone components or modules, I'll need to set up the necessary modules and imports for NgRx, directives, and components.

Finally, ensure that all dependencies are properly imported and that the app is bootstrapped correctly without RequireJS, using Angular's default setup.
</think>

```markdown
app.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addTodo, clearCompleted, loadTodos, markAll, removeTodo, updateTodo } from './store/todo.actions';
import { selectTodos, selectFilteredTodos, selectRemainingCount } from './store/todo.selectors';
import { Todo } from './todo.model';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  template: `
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <form class="todo-form" (submit)="onAddTodo($event)">
          <input class="new-todo" placeholder="What needs to be done?" 
                 [(ngModel)]="newTodo" name="newTodo" autofocus>
        </form>
      </header>
      <app-todo-list 
        *ngIf="todos$ | async as todos"
        [todos]="todos"
        (toggle)="onToggleTodo($event)"
        (edit)="onEditTodo($event)"
        (remove)="onRemoveTodo($event)"
        (markAll)="onMarkAll($event)">
      </app-todo-list>
      <app-footer 
        *ngIf="(todos$ | async)?.length"
        [remainingCount]="remainingCount$ | async"
        (clearCompleted)="onClearCompleted()">
      </app-footer>
    </section>
  `
})
export class AppComponent implements OnInit {
  newTodo = '';
  todos$: Observable<Todo[]>;
  remainingCount$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.todos$ = this.store.select(selectFilteredTodos);
    this.remainingCount$ = this.store.select(selectRemainingCount);
  }

  ngOnInit() {
    this.store.dispatch(loadTodos());
  }

  onAddTodo(event: Event) {
    event.preventDefault();
    if (this.newTodo.trim()) {
      this.store.dispatch(addTodo({ title: this.newTodo.trim() }));
      this.newTodo = '';
    }
  }

  onToggleTodo(id: string) {
    this.store.dispatch(updateTodo({ id, changes: { completed: !this.todos } }));
  }

  onEditTodo({ id, title }: { id: string; title: string }) {
    this.store.dispatch(updateTodo({ id, changes: { title: title.trim() } }));
  }

  onRemoveTodo(id: string) {
    this.store.dispatch(removeTodo({ id }));
  }

  onMarkAll(completed: boolean) {
    this.store.dispatch(markAll({ completed }));
  }

  onClearCompleted() {
    this.store.dispatch(clearCompleted());
  }
}
```

todo.model.ts
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';
```

todo-list.component.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-list',
  template: `
    <section class="main" *ngIf="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox"
             [checked]="allChecked" (change)="markAll.emit(toggleAll.checked)">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li *ngFor="let todo of todos" [class.completed]="todo.completed" [class.editing]="editingTodo === todo.id">
          <app-todo-item 
            [todo]="todo"
            (toggle)="toggle.emit($event)"
            (edit)="edit.emit($event)"
            (remove)="remove.emit($event)">
          </app-todo-item>
        </li>
      </ul>
    </section>
  `
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<{ id: string; title: string }>();
  @Output() remove = new EventEmitter<string>();
  @Output() markAll = new EventEmitter<boolean>();

  editingTodo: string | null = null;
  get allChecked(): boolean {
    return this.todos.every(todo => todo.completed);
  }
}
```

todo-item.component.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-item',
  template: `
    <div class="view">
      <input class="toggle" type="checkbox" 
             [checked]="todo.completed" (change)="toggle.emit(todo.id)">
      <label (dblclick)="startEditing()">{{todo.title}}</label>
      <button class="destroy" (click)="remove.emit(todo.id)"></button>
    </div>
    <form (submit)="finishEditing($event)">
      <input class="edit" [(ngModel)]="editingTitle" 
             (blur)="finishEditing($event)" 
             (keydown.escape)="cancelEditing()"
             todoFocus [isEditing]="isEditing"
             name="editTodo">
    </form>
  `
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<{ id: string; title: string }>();
  @Output() remove = new EventEmitter<string>();

  isEditing = false;
  editingTitle = '';

  startEditing() {
    this.isEditing = true;
    this.editingTitle = this.todo.title;
  }

  finishEditing(event: Event) {
    event.preventDefault();
    this.isEditing = false;
    if (this.editingTitle.trim()) {
      this.edit.emit({ id: this.todo.id, title: this.editingTitle });
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingTitle = this.todo.title;
  }
}
```

footer.component.ts
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span class="todo-count">
        <strong>{{remainingCount}}</strong>
        {{remainingCount === 1 ? 'item left' : 'items left'}}
      </span>
      <ul class="filters">
        <li><a [class.selected]="router.url === '/'" href="/">All</a></li>
        <li><a [class.selected]="router.url === '/active'" href="/active">Active</a></li>
        <li><a [class.selected]="router.url === '/completed'" href="/completed">Completed</a></li>
      </ul>
      <button class="clear-completed" (click)="clearCompleted.emit()">Clear completed</button>
    </footer>
  `
})
export class FooterComponent {
  @Input() remainingCount = 0;
  @Output() clearCompleted = new EventEmitter<void>();

  constructor(public router: Router) {}
}
```

todo-focus.directive.ts
```typescript
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[todoFocus]'
})
export class TodoFocusDirective implements OnChanges {
  @Input() isEditing = false;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.isEditing) {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
```

app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todoReducer } from './store/todo.reducer';
import { TodoEffects } from './store/todo.effects';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item.component';
import { FooterComponent } from './footer.component';
import { TodoFocusDirective } from './todo-focus.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'all' },
      { path: ':filter', component: AppComponent }
    ]),
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects])
  ],
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    FooterComponent,
    TodoFocusDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

store/todo.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Todo } from '../todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: string; title: string }>());
export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: string }>());
export const markAll = createAction('[Todo] Mark All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');
export const setFilter = createAction('[Todo] Set Filter', props<{ filter: string }>());
```

store/todo.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: []
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: Date.now().toString(), title, completed: false }]
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
  on(TodoActions.removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  on(TodoActions.markAll, (state, { completed }) => ({
    ...state,
    todos: state.todos.map(todo => ({ ...todo, completed }))
  })),
  on(TodoActions.clearCompleted, state => ({
    ...state,
    todos: state.todos.filter(todo => !todo.completed)
  }))
);
```

store/todo.effects.ts
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

const STORAGE_KEY = 'todos-angular-ngrx';

@Injectable()
export class TodoEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => {
        const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return of(TodoActions.loadTodosSuccess({ todos }));
      }),
      catchError(error => of({ type: '[Todo] Load Todos Failure', error }))
    )
  );

  saveTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.addTodo,
        TodoActions.toggleTodo,
        TodoActions.editTodo,
        TodoActions.removeTodo,
        TodoActions.markAll,
        TodoActions.clearCompleted
      ),
      switchMap(action => {
        const todos = JSON.stringify((action as any).payload || (action as any).todos);
        localStorage.setItem(STORAGE_KEY, todos);
        return of({ type: '[Todo] Save Todos Success' });
      })
    )
  );

  constructor(private actions$: Actions) {}
}
```

store/todo.selectors.ts
```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';
import { Todo } from '../todo.model';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectRemainingCount = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed).length
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (todos, props) => {
    switch (props.filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
    }
  }
);
```

store/app.state.ts
```typescript
import { TodoState } from './todo.reducer';

export interface AppState {
  todos: TodoState;
}
```

### Tokens: {'input_tokens': 2416, 'output_tokens': 3993}
### Execution time: 230.29207015037537
