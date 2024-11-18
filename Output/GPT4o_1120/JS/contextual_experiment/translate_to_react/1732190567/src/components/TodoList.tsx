import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { toggleAll } from '../store/todoSlice';
import TodoItem from './TodoItem';
import { useLocation } from 'react-router-dom';

const TodoList: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const activeFilter = location.pathname;

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === '/active') return !todo.completed;
    if (activeFilter === '/completed') return todo.completed;
    return true;
  });

  const allChecked = todos.length > 0 && todos.every((todo) => todo.completed);

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked));
  };

  return (
    <section className="main">
      {todos.length > 0 && (
        <>
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={allChecked}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
        </>
      )}
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
          />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;