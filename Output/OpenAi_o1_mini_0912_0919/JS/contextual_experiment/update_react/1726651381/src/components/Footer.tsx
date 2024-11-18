import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState } from '../store/store';
import { setFilter, clearCompleted, TodoFilters } from '../store/todosSlice';
import { pluralize } from '../utils/utils';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const activeCount = useSelector((state: RootState) => state.todos.todos.filter(todo => !todo.completed).length);
  const completedCount = useSelector((state: RootState) => state.todos.todos.filter(todo => todo.completed).length);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleSetFilter = (filter: TodoFilters) => {
    dispatch(setFilter(filter));
  };

  const activeTodoWord = pluralize(activeCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: currentFilter === TodoFilters.ALL })}
            onClick={() => handleSetFilter(TodoFilters.ALL)}>
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: currentFilter === TodoFilters.ACTIVE })}
            onClick={() => handleSetFilter(TodoFilters.ACTIVE)}>
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: currentFilter === TodoFilters.COMPLETED })}
            onClick={() => handleSetFilter(TodoFilters.COMPLETED)}>
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
