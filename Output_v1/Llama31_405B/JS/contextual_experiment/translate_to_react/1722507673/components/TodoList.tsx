import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, toggleTodo } from '../store/todoSlice';
import Todo from './Todo';

function TodoList() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onRemove={() => dispatch(removeTodo(todo.id))}
          onToggle={() => dispatch(toggleTodo(todo.id))}
        />
      ))}
    </ul>
  );
}

export default TodoList;