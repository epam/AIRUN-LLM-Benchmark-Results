export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}

export interface TodoItemProps {
  todo: Todo;
}

export interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  filter: Filter;
}
