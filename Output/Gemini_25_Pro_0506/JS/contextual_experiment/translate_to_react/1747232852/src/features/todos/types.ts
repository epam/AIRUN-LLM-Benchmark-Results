export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
