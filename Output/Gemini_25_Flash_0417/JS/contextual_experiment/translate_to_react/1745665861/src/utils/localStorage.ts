import { Todo } from '../types';

const STORAGE_ID = 'todos-angularjs-requirejs';

export const getTodos = (): Todo[] => {
  try {
    const todos = localStorage.getItem(STORAGE_ID);
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};
