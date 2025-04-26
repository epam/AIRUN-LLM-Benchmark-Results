import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const TodoCount: React.FC = () => {
  const remainingCount = useSelector((state: RootState) =>
    state.todos.filter(todo => !todo.completed).length
  );

  const itemText = remainingCount === 1 ? 'item' : 'items';

  return (
    <span className="todo-count">
      <strong>{remainingCount}</strong> {itemText} left
    </span>
  );
};

export default TodoCount;
