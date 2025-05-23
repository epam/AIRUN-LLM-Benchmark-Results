import { Todo } from '../types';

const STORAGE_ID = 'todos-angularjs-requirejs';

export const getTodosFromLocalStorage = (): Todo[] => {
  const storedTodos = localStorage.getItem(STORAGE_ID);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

export const setTodosInLocalStorage = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};
