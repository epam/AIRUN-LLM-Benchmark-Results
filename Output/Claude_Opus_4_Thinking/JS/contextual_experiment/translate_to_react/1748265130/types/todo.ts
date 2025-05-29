export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';