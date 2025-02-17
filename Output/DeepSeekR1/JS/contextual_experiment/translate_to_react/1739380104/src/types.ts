export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export type RootState = {
  todos: Todo[];
  filter: FilterType;
  editingId: string | null;
};