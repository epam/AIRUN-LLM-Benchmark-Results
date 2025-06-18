import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    selectTodos,
    selectFilter,
    toggleAll,
    Filter,
} from '../slices/todosSlice';
import TodoItem from './TodoItem';

const filterTodos = (todos: ReturnType<typeof selectTodos>, filter: Filter) => {
    switch (filter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
};

const TodoList: React.FC = () => {
    const dispatch = useAppDispatch();
    const todos = useAppSelector(selectTodos);
    const filter = useAppSelector(selectFilter);

    const visibleTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);

    if (todos.length === 0) {
        return null;
    }

    const allChecked = todos.length > 0 && todos.every(t => t.completed);

    const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAll(e.target.checked));
    };

    return (
        <section className="main">
            <input
                id="toggle-all"
                className="toggle-all"
                type="checkbox"
                checked={allChecked}
                onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {visibleTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;
