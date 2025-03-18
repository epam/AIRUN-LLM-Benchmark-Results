import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted } from '../store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils/filterTodos';

interface TodoFooterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ filter, setFilter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const activeTodoWord = pluralize(activeTodoCount, 'item');

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === ALL_TODOS ? 'selected' : ''}
            onClick={() => setFilter(ALL_TODOS)}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={filter === ACTIVE_TODOS ? 'selected' : ''}
            onClick={() => setFilter(ACTIVE_TODOS)}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={filter === COMPLETED_TODOS ? 'selected' : ''}
            onClick={() => setFilter(COMPLETED_TODOS)}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;