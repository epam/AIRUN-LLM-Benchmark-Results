import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteTodo, editTodo, toggleTodo } from '../features/todos/todosSlice';

const TodoList: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleEditTodo = (id: string, title: string) => {
    dispatch(editTodo({ id, title }));
  };

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <label onDoubleClick={() => handleEditTodo(todo.id, prompt('Edit todo', todo.title) || todo.title)}>
              {todo.title}
            </label>
            <button className="destroy" onClick={() => handleDeleteTodo(todo.id)}></button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;