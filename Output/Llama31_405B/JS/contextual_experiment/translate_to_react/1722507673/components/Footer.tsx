import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted } from '../store/todoSlice';

function Footer() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> item{remainingCount === 1 ? '' : 's'} left
      </span>
      <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
        Clear completed
      </button>
    </footer>
  );
}

export default Footer;