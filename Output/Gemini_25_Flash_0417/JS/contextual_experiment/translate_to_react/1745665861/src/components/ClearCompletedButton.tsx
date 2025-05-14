import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted } from '../store/todosSlice';
import { RootState } from '../store/store';

const ClearCompletedButton: React.FC = () => {
  const dispatch = useDispatch();
  const completedCount = useSelector((state: RootState) =>
    state.todos.filter(todo => todo.completed).length
  );

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (completedCount === 0) {
    return null;
  }

  return (
    <button className="clear-completed" onClick={handleClearCompleted}>
      Clear completed
    </button>
  );
};

export default ClearCompletedButton;
