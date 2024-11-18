import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { useTodoFilter } from '../hooks/useTodoFilter';
import { FilterStatus } from '../types/todo';

interface TodoListProps {
  filterStatus: FilterStatus;
}

const TodoList: React.FC<TodoListProps> = ({ filterStatus }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.list);
  const filteredTodos = useTodoFilter(filterStatus);

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    dispatch(toggleAll(!areAllCompleted));
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
        onChange={handleToggleAll}
        checked={todos.every(todo => todo.completed)}
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

export default TodoList;
