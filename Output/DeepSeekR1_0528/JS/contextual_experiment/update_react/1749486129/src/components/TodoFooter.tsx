import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { clearCompleted } from '../features/todo/todoSlice';
import { useDispatch } from 'react-redux';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

const TodoFooter = () => {
  const dispatch = useDispatch();
  const todos = useAppSelector(state => state.todos);
  const location = useLocation();
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const nowShowing = location.pathname.substring(1) || ALL_TODOS;
  
  const pluralize = (count: number, word: string) => {
    return count === 1 ? word : `${word}s`;
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
          >
            All
          </Link>
        </li>
        <li>
          <Link
            to="/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
          >
            Active
          </Link>
        </li>
        <li>
          <Link
            to="/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </Link>
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