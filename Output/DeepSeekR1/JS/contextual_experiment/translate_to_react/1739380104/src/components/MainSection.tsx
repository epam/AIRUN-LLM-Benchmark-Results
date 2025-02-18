import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoItem } from './TodoItem';
import { markAllCompleted, selectFilteredTodos, selectItemsLeft } from '../store/todoSlice';

export const MainSection = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);
  const itemsLeft = useSelector(selectItemsLeft);

  return (
    <section className="main">
      {todos.length > 0 && (
        <>
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={itemsLeft === 0}
            onChange={() => dispatch(markAllCompleted())}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
        </>
      )}
      
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};