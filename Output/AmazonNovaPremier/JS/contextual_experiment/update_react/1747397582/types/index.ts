export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface FilterState {
  status: 'all' | 'active' | 'completed';
}

export interface TodosState {
  todos: Todo[];
}