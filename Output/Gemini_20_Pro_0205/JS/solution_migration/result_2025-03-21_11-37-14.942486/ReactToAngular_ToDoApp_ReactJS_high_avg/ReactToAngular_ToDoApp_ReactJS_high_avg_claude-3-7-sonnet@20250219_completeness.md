# Evaluation Report

- **Pass** (100%): Verify that the todo list application displays all todo items
  
  The code properly displays todo items using the `ngFor` directive in the `todo-app.component.html` file:
  ```html
  <ul class="todo-list">
    <app-todo-item
      *ngFor="let todo of visibleTodos$ | async"
      [todo]="todo"
    ></app-todo-item>
  </ul>
  ```
  The component also retrieves todos from the store via the `visibleTodos$` observable.

- **Pass** (100%): Ensure that adding new todo items functionality is implemented
  
  Adding new todo items is implemented through the `TodoInputComponent` which emits an event when the user enters a new todo and presses Enter:
  ```typescript
  onAddTodo(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const title = this.newTodoTitle.trim();
      if (title) {
        this.addTodo.emit(title);
        this.newTodoTitle = '';
      }
    }
  }
  ```
  The parent `TodoAppComponent` then dispatches the appropriate action to the store:
  ```typescript
  onAddTodo(title: string): void {
    this.store.dispatch(TodoActions.addTodo({title}));
  }
  ```

- **Pass** (100%): Confirm that toggling todo items as complete/incomplete works
  
  The `TodoItemComponent` handles toggling through its `toggle` method:
  ```typescript
  toggle(id: string) {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }
  ```
  This dispatches the appropriate action to the store.

- **Pass** (100%): Verify that editing todo items functionality is implemented
  
  Editing is implemented in the `TodoItemComponent`:
  ```typescript
  edit() {
    this.editing = true;
    this.editText = this.todo.title;
  }

  save(id: string, newTitle: string) {
    if (this.editing) {
      this.store.dispatch(TodoActions.updateTodo({ id, title: newTitle }));
      this.editing = false;
    }
  }
  ```
  The component also includes methods for canceling edits and handling keyboard events.

- **Pass** (100%): Ensure that deleting todo items functionality is implemented
  
  The `TodoItemComponent` implements deletion through its `destroy` method:
  ```typescript
  destroy(id: string) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
  ```

- **Pass** (100%): Verify that the 'Mark all as complete' functionality is implemented
  
  This functionality is implemented in the `TodoAppComponent`:
  ```typescript
  toggleAll(completed: boolean) {
    this.store.dispatch(TodoActions.toggleAllTodos({ completed }));
  }
  ```
  And the corresponding HTML in `todo-app.component.html`:
  ```html
  <input
    id="toggle-all"
    class="toggle-all"
    type="checkbox"
    (change)="toggleAll($event.target.checked)"
    [checked]="(activeCount$ | async) === 0"
  />
  ```

- **Pass** (100%): Confirm that filtering todos by 'all', 'active', and 'completed' works
  
  Filtering is implemented in the `TodoFooterComponent`:
  ```typescript
  setFilter(filter: TodoFilter): void {
    this.store.dispatch(TodoActions.setVisibilityFilter({ filter }));
  }
  ```
  The state is handled in the reducer and the filtering logic is implemented in the `selectVisibleTodos` selector:
  ```typescript
  export const selectVisibleTodos = createSelector(
    selectTodos,
    selectFilter,
    (todos: ITodo[], filter: string) => {
      switch (filter) {
        case 'active':
          return todos.filter(todo => !todo.completed);
        case 'completed':
          return todos.filter(todo => todo.completed);
        default:
          return todos;