import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, selectFilteredTodos } from '../features/todos/todoSlice';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </header>
{todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={activeTodoCount === 0}
            readOnly
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
      {activeTodoCount > 0 || todos.length - activeTodoCount > 0 ? <TodoFooter /> : null}
    </div>
  );
};

export default TodoApp;