import { Todo } from '../types/todo';

export function loadTodos(key: string): Todo[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function saveTodos(key: string, todos: Todo[]): void {
  localStorage.setItem(key, JSON.stringify(todos));
}
