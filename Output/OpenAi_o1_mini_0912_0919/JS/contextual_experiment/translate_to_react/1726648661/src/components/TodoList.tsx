import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TodoItem from './TodoItem';
import { useLocation } from 'react-router-dom';
import { Todo } from '../services/todoStorage';

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const location = useLocation();

    const filterTodos = (todos: Todo[]) => {
        switch(location.pathname) {
            case '/active':
                return todos.filter(todo => !todo.completed);
            case '/completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };

    const filteredTodos = filterTodos(todos);

    if (!todos.length) {
        return null;
    }

    return (
        <section className="main">
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;