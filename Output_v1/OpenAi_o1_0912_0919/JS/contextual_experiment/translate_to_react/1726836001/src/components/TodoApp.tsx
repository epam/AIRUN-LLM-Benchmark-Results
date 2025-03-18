import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleAll } from '../slices/todosSlice';
import { RootState } from '../store';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos);
    const [newTodo, setNewTodo] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodo(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTodo = newTodo.trim();
        if (trimmedTodo) {
            dispatch(addTodo(trimmedTodo));
            setNewTodo('');
        }
    };

    const handleToggleAll = () => {
        dispatch(toggleAll());
    };

    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

    return (
        <section className=\"todoapp\">
            <header className=\"header\">
                <h1>todos</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className=\"new-todo\"
                        placeholder=\"What needs to be done?\"
                        value={newTodo}
                        onChange={handleChange}
                        autoFocus
                    />
                </form>
            </header>
            {todos.length > 0 && (
                <section className=\"main\">
                    <input
                        id=\"toggle-all\"
                        className=\"toggle-all\"
                        type=\"checkbox\"
                        checked={allCompleted}
                        onChange={handleToggleAll}
                    />
                    <label htmlFor=\"toggle-all\">Mark all as complete</label>
                    <TodoList />
                </section>
            )}
            <TodoFooter />
        </section>
    );
};

export default TodoApp;
