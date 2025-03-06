export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  status: FilterStatus;
  editedTodoId: string | null;
}
