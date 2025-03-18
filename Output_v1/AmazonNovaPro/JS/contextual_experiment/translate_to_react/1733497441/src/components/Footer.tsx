import React from 'react';
import { useAppSelector } from '../store/store';
import { selectTodos } from '../store/todoSlice';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const todos = useAppSelector(selectTodos);
  const location = useLocation();
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const doneCount = todos.length - remainingCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> item{remainingCount !== 1 && 's'} left
      </span>
      <TodoFilter />
      {doneCount > 0 && (
        <button className="clear-completed" onClick={() => console.log('Clear completed')}>Clear completed</button>
      )}
    </footer>
  );
};

export default Footer;