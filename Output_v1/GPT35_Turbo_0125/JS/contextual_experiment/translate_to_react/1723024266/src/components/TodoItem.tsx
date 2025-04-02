import React from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../store/todoSlice';
import { toggleTodo } from '../store/todoSlice';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    return (
        <li className={todo.completed ? 'completed' : ''} onClick={handleToggle}>
            {todo.title}
        </li>
    );
};

export default TodoItem;