import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompletedTodos, selectTodos, selectRemainingCount } from '../store/todoSlice';
import { Link } from 'react-router-dom';

const TodoFooter: React.FC = () => {
    const todos = useSelector(selectTodos);
    const remainingCount = useSelector(selectRemainingCount);
    const dispatch = useDispatch();

    const doneCount = todos.length - remainingCount;

    return (
        <footer className=\"footer\" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
            <span className=\"todo-count\">
                <strong>{remainingCount}</strong>
                {remainingCount === 1 ? ' item left' : ' items left'}
            </span>
            <ul className=\"filters\">
                <li>
                    <Link to=\"/\" className={window.location.hash === '#/' ? 'selected' : ''}>All</Link>
                </li>
                <li>
                    <Link to=\"/active\" className={window.location.hash === '#/active' ? 'selected' : ''}>Active</Link>
                </li>
                <li>
                    <Link to=\"/completed\" className={window.location.hash === '#/completed' ? 'selected' : ''}>Completed</Link>
                </li>
            </ul>
            {doneCount > 0 && (
                <button
                    className=\"clear-completed\"
                    onClick={() => dispatch(clearCompletedTodos())}
                >
                    Clear completed
                </button>
            )}
        </footer>
    );
};

export default TodoFooter;