const STORAGE_ID = 'todos-react-typescript';

export const getTodos = (): Array<{id: string, title: string, completed: boolean}> => {
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
};

export const saveTodos = (todos: Array<{id: string, title: string, completed: boolean}>) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};