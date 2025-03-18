import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted } from './TodoModel';
import { pluralize } from './utils';

const TodoFooter = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {pluralize(activeCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className="selected">
            All
          </a>
        </li>
        <li>
          <a href="#/active">
            Active
          </a>
        </li>
        <li>
          <a href="#/completed">
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;