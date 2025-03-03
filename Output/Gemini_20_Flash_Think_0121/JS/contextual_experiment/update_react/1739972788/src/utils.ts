import { nanoid } from 'nanoid';

export const generateId = () => nanoid();

export const pluralize = (count: number, word: string) => {
  return count === 1 ? word : `${word}s`;
};

export const loadTodos = (namespace: string) => {
  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
};

export const saveTodos = (namespace: string, data: any) => {
  localStorage.setItem(namespace, JSON.stringify(data));
};
