import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearCompleted, selectTodos } from '../slices/todosSlice';
import FilterLink from './FilterLink';

const Footer: React.FC = () => {
    const dispatch = useAppDispatch();
    const todos = useAppSelector(selectTodos);

    const remainingCount = todos.filter(t => !t.completed).length;
    const totalCount = todos.length;

    if (totalCount === 0) {
        return null;
    }

    const itemText = remainingCount === 1 ? 'item left' : 'items left';

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{remainingCount}</strong> {itemText}
            </span>
            <ul className="filters">
                <FilterLink filter="all">All</FilterLink>
                <FilterLink filter="active">Active</FilterLink>
                <FilterLink filter="completed">Completed</FilterLink>
            </ul>
            {remainingCount < totalCount && (
                <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </button>
            )}
        </footer>
    );
};

export default Footer;
