import { Todo } from '../types';

const STORAGE_KEY = 'react-todos';

export const loadTodos = (): Todo[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    return serialized ? (JSON.parse(serialized) as Todo[]) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore write errors
  }
};
