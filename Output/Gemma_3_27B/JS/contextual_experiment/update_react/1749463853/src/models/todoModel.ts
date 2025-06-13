export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoModel {
  todos: ITodo[];
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todoToToggle: ITodo): void;
  destroy(todo: ITodo): void;
  save(todoToSave: ITodo, text: string): void;
  clearCompleted(): void;
}