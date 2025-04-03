# Evaluation Report

- **Pass** (100%): Verify that the todo list application displays all todo items
  
  The implementation uses the `*ngFor` directive in the todo-app.component.html to iterate over the todo items: 
  ```html
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of shownTodos$ | async"
      [todo]="todo"
      [editing]="(editing$ | async) === todo.id"
      ...
    ></app-todo-item>
  </ul>
  ```
  This correctly displays all todo items using the shownTodos$ observable from the store.

- **Pass** (100%): Ensure that adding new todo items functionality is implemented
  
  The code includes a complete implementation of adding new todo items in the TodoAppComponent with proper handling of the ENTER key and trimming the input value:
  ```typescript
  handleNewTodoKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = this.newTodoText.trim();
    if (val) {
      this.todoService.addTodo(val);
      this.newTodoText = '';
    }
  }
  ```

- **Pass** (100%): Confirm that toggling todo items as complete/incomplete works
  
  The implementation includes toggle functionality at both the individual item level and for all items:
  ```html
  <input
    class="toggle"
    type="checkbox"
    [checked]="todo.completed"
    (change)="toggle.emit()"
  />
  ```
  And in the main component:
  ```html
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="(activeTodoCount$ | async) === 0"
    (change)="todoService.toggleAll($event.target.checked)"
  />
  ```

- **Pass** (100%): Verify that editing todo items functionality is implemented
  
  The TodoItemComponent includes full editing functionality with keyboard support and proper focus handling:
  ```typescript
  handleEdit() {
    this.editText = this.todo.title;
    this.edit.emit();
  }
  
  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.cancel.emit();
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }
  ```

- **Pass** (100%): Ensure that deleting todo items functionality is implemented
  
  Delete functionality is implemented via the destroy button in the TodoItemComponent:
  ```html
  <button class="destroy" (click)="destroy.emit()"></button>
  ```
  This correctly emits an event to the parent component which calls:
  ```typescript
  (destroy)="todoService.destroy(todo)"
  ```

- **Pass** (100%): Verify that the 'Mark all as complete' functionality is implemented
  
  The toggle all functionality is implemented:
  ```html
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    [checked]="(activeTodoCount$ | async) === 0"
    (change)="todoService.toggleAll($event.target.checked)"
  />
  ```
  Connected to the service method and reducer that handles toggling all todo items.

- **Pass** (100%): Confirm that filtering todos by 'all', 'active', and 'completed' works
  
  The implementation includes filter functionality via the AppRoutingModule and the selectors:
  ```typescript
  export const selectShownTodos = createSelector(
    selectTodos,
    selectNowShowing,
    (todos, nowShowing) => {
      switch (nowShowing) {
        case ACTIVE_TODOS:
          return todos.filter(todo => !todo.completed);
        case COMPLETED_TODOS:
          return todos.filter(todo => todo.completed);
        default:
          return todos;
      }
    }
  );
  ```

- **Pass** (100%