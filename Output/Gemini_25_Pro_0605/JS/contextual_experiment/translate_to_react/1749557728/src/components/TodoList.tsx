import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleAll } from '../store/todosSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.todos);
    const filter = useSelector((state: RootState) => state.todos.filter);

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') {
            return !todo.completed;
        }
        if (filter === 'completed') {
            return todo.completed;
        }
        return true;
    });

    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

    const handleToggleAll = () => {
        dispatch(toggleAll(!allCompleted));
    };

    if (todos.length === 0) {
        return null;
    }

    return (
        <section className="main">
            <input
                id="toggle-all"
                className="toggle-all"
                type="checkbox"
                checked={allCompleted}
                onChange={handleToggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;
