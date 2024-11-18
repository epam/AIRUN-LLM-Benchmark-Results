import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FilterStatus, Todo } from '../types/todo';

export const useTodoFilter = (status: FilterStatus) => {
  const todos = useSelector((state: RootState) => state.todos.list);

  const filterTodos = useCallback((todos: Todo[], status: FilterStatus) => {
    switch (status) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, []);

  const filteredTodos = useMemo(() => filterTodos(todos, status), [filterTodos, todos, status]);

  return filteredTodos;
};
