```typescript
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { clearCompleted, setFilter } from "./todoSlice";
import { RootState } from "./store";

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const nowShowing = useSelector((state: RootState) => state.todo.nowShowing);

  const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
  const completedCount = todos.length - activeTodoCount;
  const activeTodoWord = activeTodoCount === 1 ? 'item' : 'items';

  let clearButton = null;
  if (completedCount > 0) {
    clearButton = (
      <button
        className="clear-completed"
        onClick={() => dispatch(clearCompleted())}
      >
        Clear completed
      </button>
    );
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
            className={classNames({ selected: nowShowing === ALL_TODOS })}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter(ALL_TODOS));
            }}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter(ACTIVE_TODOS));
            }}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilter(COMPLETED_TODOS));
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export { TodoFooter };```