import { Todo } from '../types/todo';

const STORAGE_ID = 'todos-react';

export const todoStorage = {
  get: (): Todo[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    } catch {
      return [];
    }
  },

  put: (todos: Todo[]): void => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }
};
