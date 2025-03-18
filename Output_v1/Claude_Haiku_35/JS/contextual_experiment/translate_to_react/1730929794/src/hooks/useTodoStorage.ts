import { useEffect } from 'react';

const STORAGE_ID = 'todos-react';

export const useTodoStorage = (todos: Todo[]) => {
  useEffect(() => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }, [todos]);

  const getTodos = (): Todo[] => {
    const storedTodos = localStorage.getItem(STORAGE_ID);
    return storedTodos ? JSON.parse(storedTodos) : [];
  };

  return { getTodos };
};

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}