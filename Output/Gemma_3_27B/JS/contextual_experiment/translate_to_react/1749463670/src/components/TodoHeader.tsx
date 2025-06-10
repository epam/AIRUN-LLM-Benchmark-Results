import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../store/todoSlice';
import { RootState } from '../store/store';

function TodoHeader() {
  const dispatch = useDispatch();
  const newTodo = useSelector((state: RootState) => state.todos.newTodo);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(addTodo(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTodo.trim() !== '') {
      dispatch(addTodo(newTodo.trim()));
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleChange}
          autoFocus
        />
      </form>
    </header>
  );
}

export default TodoHeader;