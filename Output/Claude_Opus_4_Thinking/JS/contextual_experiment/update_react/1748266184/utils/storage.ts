import { ITodo } from '../types';

export const loadTodos = (key: string): ITodo[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (key: string, todos: ITodo[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};