import { useState, useEffect } from 'react';

const STORAGE_ID = 'todos-react-ts';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const useTodoStorage = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem(STORAGE_ID);
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }, [todos]);

  return [todos, setTodos] as const;
};
