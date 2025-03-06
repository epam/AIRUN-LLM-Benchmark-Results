import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { Todo } from '../types';

export const filterTodos = (todos: Todo[], filter: string): Todo[] => {
  switch (filter) {
    case ACTIVE_TODOS:
      return todos.filter(todo => !todo.completed);
    case COMPLETED_TODOS:
      return todos.filter(todo => todo.completed);
    case ALL_TODOS:
    default:
      return todos;
  }
};

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};