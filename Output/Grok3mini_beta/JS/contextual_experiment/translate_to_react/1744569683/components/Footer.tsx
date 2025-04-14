import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setVisibilityFilter, clearCompleted } from '../store';

const Footer: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todo.todos);
    const filter = useSelector((state: RootState) => state.todo.filter);
    const remainingCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.length - remainingCount;
    const itemsLeftText = remainingCount === 1 ? 'item left' : 'items left';
    return (
        <footer className="footer" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
            <span className="todo-count">
                <strong>{remainingCount}</strong> {itemsLeftText}
            </span>
            <ul className="filters">
                <li>
                    <a
                        href="#/"
                        onClick={(e) => { e.preventDefault(); dispatch(setVisibilityFilter('all')); }}
                        className={filter === 'all' ? 'selected' : ''}
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        href="#/active"
                        onClick={(e) => { e.preventDefault(); dispatch(setVisibilityFilter('active')); }}
                        className={filter === 'active' ? 'selected' : ''}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        href="#/completed"
                        onClick={(e) => { e.preventDefault(); dispatch(setVisibilityFilter('completed')); }}
                        className={filter === 'completed' ? 'selected' : ''}
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

export default Footer;
