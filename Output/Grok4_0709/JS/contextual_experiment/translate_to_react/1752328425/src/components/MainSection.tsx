import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAll, selectTodos, selectFilteredTodos } from '../features/todos/todoSlice';
import TodoItem from './TodoItem';

const MainSection: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const filteredTodos = useSelector(selectFilteredTodos);

  if (todos.length === 0) {
    return null;
  }

  const allCompleted = todos.every((todo) => todo.completed);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

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
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default MainSection;