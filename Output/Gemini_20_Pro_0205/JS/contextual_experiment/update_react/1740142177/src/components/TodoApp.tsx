import React, { useState, useCallback } from 'react';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addTodo, toggleAll } from '../store/todoSlice';

const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos);
  const [nowShowing, setNowShowing] = useState('all');

  const handleNewTodoKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const input = event.currentTarget;
        const val = input.value.trim();
        if (val) {
          dispatch(addTodo(val));
          input.value = '';
        }
      }
    },
    [dispatch]
  );

  const filteredTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={(e) => dispatch(toggleAll(e.target.checked))}
          checked={activeTodoCount === 0}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
      <TodoFooter nowShowing={nowShowing} onFilterChange={setNowShowing} />
    </div>
  );
};

export default TodoApp;
