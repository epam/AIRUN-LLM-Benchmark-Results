import React from 'react';
import { useSelector } from 'react-redux';
import { selectTodos } from '../features/todos/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

function Footer() {
  const todos = useSelector(selectTodos);
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> items left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={ALL_TODOS === 'all' ? 'selected' : ''}>
            All
          </a>
        </li>
        <li>
          <a href="#/active" className={ACTIVE_TODOS === 'active' ? 'selected' : ''}>
            Active
          </a>
        </li>
        <li>
          <a href="#/completed" className={COMPLETED_TODOS === 'completed' ? 'selected' : ''}>
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed">Clear completed</button>
      )}
    </footer>
  );
}

export default Footer;