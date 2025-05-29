import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todoSlice';
import { TodoItem } from './TodoItem';
import { FilterType } from '../types/todo';

interface TodoListProps {
  filter: FilterType;
}

export const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const dispatch = useDispatch();
  const { todos, allCompleted } = useSelector((state: RootState) => {
    const allTodos = state.todos.todos;
    const remainingCount = allTodos.filter(todo => !todo.completed).length;
    return {
      todos: allTodos,
      allCompleted: remainingCount === 0 && allTodos.length > 0
    };
  });

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleToggleAll = () => {
    dispatch(toggleAll(!allCompleted));
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};
