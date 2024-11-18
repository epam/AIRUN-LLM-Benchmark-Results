import { useEffect, useState } from 'react';

const STORAGE_ID = 'todos-react-hooks';

const useTodoStorage = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem(STORAGE_ID);
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }, [todos]);

  return [todos, setTodos] as const;
};

export default useTodoStorage;

interface Todo {
  title: string;
  completed: boolean;
}
