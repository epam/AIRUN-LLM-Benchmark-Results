export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodosState {
  todos: Todo[];
  filter: TodoFilter;
}