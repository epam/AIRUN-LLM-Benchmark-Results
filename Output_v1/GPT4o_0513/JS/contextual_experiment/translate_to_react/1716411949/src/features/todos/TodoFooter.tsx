import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearCompleted } from './TodoSlice';
import TodoFilters from './TodoFilters';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <TodoFilters />
      {completedCount > 0 && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
