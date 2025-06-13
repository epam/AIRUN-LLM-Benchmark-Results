import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../store';
import { addTodo, toggleAll } from '../features/todo/todoSlice';
import { useDispatch } from 'react-redux';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { ENTER_KEY } from '../constants';

const TodoApp = () => {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState<string | null>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY) return;
    event.preventDefault();
    
    const val = newTodoInputRef.current?.value.trim();
    if (val) {
      dispatch(addTodo(val));
      if (newTodoInputRef.current) {
        newTodoInputRef.current.value = '';
      }
    }
  };

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(event.target.checked));
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          ref={newTodoInputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={handleToggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editing === todo.id}
                onEdit={() => setEditing(todo.id)}
                onCancel={() => setEditing(null)}
              />
            ))}
          </ul>
        </section>
      )}
      
      <TodoFooter />
    </div>
  );
};

export default TodoApp;