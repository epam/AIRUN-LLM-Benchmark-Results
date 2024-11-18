import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { clearCompleted, markAll } from '../store';
import { Todo } from '../types/todo';

const TodoApp: React.FC = () => {
    const todos = useSelector((state: any) => state.todos);
    const dispatch = useDispatch();
    const remainingCount = todos.filter((todo: Todo) => !todo.completed).length;

    return (
        <section className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <TodoForm />
            </header>
            <section className="main">
                <input
                    id="toggle-all"
                    className="toggle-all"
                    type="checkbox"
                    onChange={(e) => dispatch(markAll(e.target.checked))}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">
                    {todos.map((todo: Todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </ul>
            </section>
            <footer className="footer">
                <span className="todo-count"><strong>{remainingCount}</strong> item{remainingCount !== 1 ? 's' : ''} left</span>
                <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </button>
            </footer>
        </section>
    );
};

export default TodoApp;