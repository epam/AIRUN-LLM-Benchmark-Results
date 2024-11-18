import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo, updateTodo, clearCompleted, markAll } from '../store';
import { todoStorage } from '../services/todoStorage';
import { Todo } from '../types/todo';

export const useTodos = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state: any) => state.todos);

    useEffect(() => {
        const storedTodos = todoStorage.get();
        storedTodos.forEach((todo: Todo) => dispatch(addTodo(todo)));
    }, [dispatch]);

    const saveTodos = () => {
        todoStorage.put(todos);
    };

    useEffect(() => {
        saveTodos();
    }, [todos]);

    return { todos, addTodo, removeTodo, updateTodo, clearCompleted, markAll };
};