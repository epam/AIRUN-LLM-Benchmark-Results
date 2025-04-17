import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleAll } from '../features/todos/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state: RootState) => state.todos);

  if (items.length === 0) {
    return null;
  }

  const remainingCount = items.filter((todo) => !todo.completed).length;

  const filteredItems = items.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={remainingCount === 0}
        onChange={(e) => dispatch(toggleAll(e.target.checked))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredItems.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
