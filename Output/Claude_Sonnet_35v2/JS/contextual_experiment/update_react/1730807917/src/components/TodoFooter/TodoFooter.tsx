import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { FILTER_MODES } from '../../constants/constants';
import { pluralize } from '../../utils/utils';
import { clearCompleted, setFilter } from '../../store/todoSlice';
import { RootState } from '../../store/store';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { items: todos, filter } = useSelector((state: RootState) => state.todos);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const activeTodoWord = pluralize(activeTodoCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === FILTER_MODES.ALL })}
            onClick={() => dispatch(setFilter(FILTER_MODES.ALL))}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === FILTER_MODES.ACTIVE })}
            onClick={() => dispatch(setFilter(FILTER_MODES.ACTIVE))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === FILTER_MODES.COMPLETED })}
            onClick={() => dispatch(setFilter(FILTER_MODES.COMPLETED))}
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