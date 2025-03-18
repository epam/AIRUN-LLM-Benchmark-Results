import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleAll } from './TodoModel';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

const TodoApp = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [newTodo, setNewTodo] = useState('');

  const handleNewTodoKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  const handleChange = (event) => {
    setNewTodo(event.target.value);
  };

  const toggleAllTodos = (checked) => {
    dispatch(toggleAll(checked));
  };

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onKeyDown={handleNewTodoKeyDown}
          onChange={handleChange}
          autoFocus={true}
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(event) => toggleAllTodos(event.target.checked)}
            checked={todos.every((todo) => todo.completed)}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      {todos.length > 0 && <TodoFooter />}
    </div>
  );
};

export default TodoApp;