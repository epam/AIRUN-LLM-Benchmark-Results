import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, toggleTodo } from '../store/todoSlice';
import Todo from './Todo';

function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={() => dispatch(toggleTodo(todo.id))}
          onRemove={() => dispatch(removeTodo(todo.id))}
        />
      ))}
    </ul>
  );
}

export default TodoList;