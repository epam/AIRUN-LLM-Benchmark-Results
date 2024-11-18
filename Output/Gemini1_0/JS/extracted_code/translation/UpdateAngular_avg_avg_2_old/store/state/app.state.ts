import { Todo } from '../models/todo.model';

export interface AppState {
  todos: Todo[];
  statusFilter: string;
}