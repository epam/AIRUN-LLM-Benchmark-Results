import { useEffect } from 'react';
import { useAppSelector } from '../store/store';

export default function usePersistTodos() {
  const todos = useAppSelector(state => state.todos);

  useEffect(() => {
    localStorage.setItem('todos-angularjs-requirejs', JSON.stringify(todos));
  }, [todos]);
}
