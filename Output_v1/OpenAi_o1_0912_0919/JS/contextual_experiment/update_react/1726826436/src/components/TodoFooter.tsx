import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState } from '../store';
import { clearCompleted } from '../store/todosSlice';
import { FilterType } from '../constants';

interface TodoFooterProps {
  filter: FilterType;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ filter }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const activeTodoWord = activeTodoCount === 1 ? 'item' : 'items';

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === FilterType.All })}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === FilterType.Active })}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === FilterType.Completed })}
          >
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

export default TodoFooter;
