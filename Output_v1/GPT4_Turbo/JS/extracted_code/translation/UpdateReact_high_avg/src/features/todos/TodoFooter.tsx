import React from 'react';
import { Utils } from '../../utils';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, onClearCompleted }) => {
  const activeTodoWord = Utils.pluralize(count, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;