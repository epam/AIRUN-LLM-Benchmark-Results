// Todo model
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Redux related types
export interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}