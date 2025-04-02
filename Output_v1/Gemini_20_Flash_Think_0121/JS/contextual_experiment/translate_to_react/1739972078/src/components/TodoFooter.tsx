import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted } from '../features/todos/todosSlice';
import {
  selectCompletedTodosCount,
  selectRemainingTodosCount 
} from '../features/todos/selectors';

const TodoFooter: React.FC = () => {
  const remainingCount = useSelector(selectRemainingTodosCount);
  const completedCount = useSelector(selectCompletedTodosCount);
  const dispatch = useDispatch();

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> item{remainingCount !== 1 && 's'} left
      </span>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
