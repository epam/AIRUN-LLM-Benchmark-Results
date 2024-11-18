import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addTodo, clearCompleted, setFilter, toggleTodo, deleteTodo } from './todosSlice';

function TodoApp() {
  const [text, setText] = useState('');
  const todos = useAppSelector(state => state.todos.todos);
  const filter = useAppSelector(state => state.todos.filter);
  const dispatch = useAppDispatch();

  const handleAddTodo = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    todos.forEach(todo => {
      dispatch(toggleTodo(todo.id));
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <header>
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleAddTodo}
        />
      </header>
      <section>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={handleToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul>
          {filteredTodos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                />
                <label>{todo.title}</label>
                <button className="destroy" onClick={() => dispatch(deleteTodo(todo.id))}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <footer>
        <span>{`${todos.filter(todo => !todo.completed).length} items left`}</span>
        <button onClick={() => dispatch(setFilter('all'))}>All</button>
        <button onClick={() => dispatch(setFilter('active'))}>Active</button>
        <button onClick={() => dispatch(setFilter('completed'))}>Completed</button>
        <button onClick={() => dispatch(clearCompleted())}>Clear completed</button>
      </footer>
    </div>
  );
}

export default TodoApp;