import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todosSlice';

const Footer: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.todos);
    const currentFilter = useSelector((state: RootState) => state.todos.filter);

    const todosCount = todos.length;
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todosCount - activeCount;

    const handleClearCompleted = () => {
        dispatch(clearCompleted());
    };

    if (todosCount === 0) {
        return null;
    }

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
            </span>
            <ul className="filters">
                <li>
                    <a
                        href="#/"
                        className={currentFilter === 'all' ? 'selected' : ''}
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        href="#/active"
                        className={currentFilter === 'active' ? 'selected' : ''}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        href="#/completed"
                        className={currentFilter === 'completed' ? 'selected' : ''}
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

export default Footer;
