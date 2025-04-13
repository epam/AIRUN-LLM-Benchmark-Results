import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { markAll } from '../store';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
    const dispatch = useDispatch();
    const { todos, filter } = useSelector((state: RootState) => state.todo);
    const filteredTodos = useMemo(() => {
        if (filter === 'active') {
            return todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            return todos.filter(todo => todo.completed);
        } else {
            return todos;
        }
    }, [todos, filter]);
    const allChecked = useMemo(() => todos.every(todo => todo.completed), [todos]);
    return (
        <section className="main" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
            <input
                id="toggle-all"
                className="toggle-all"
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(markAll(e.target.checked))}
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
