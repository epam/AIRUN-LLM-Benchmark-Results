import { Todo } from '../types';

const STORAGE_KEY = 'react-todos';

export function loadTodos(): Todo[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return [];
    }
    return JSON.parse(serialized) as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore write errors
  }
}

export { STORAGE_KEY };
