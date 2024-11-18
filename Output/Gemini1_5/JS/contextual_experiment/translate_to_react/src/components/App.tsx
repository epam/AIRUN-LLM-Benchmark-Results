```tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTodo } from '../store/todos/todosSlice';
import TodoList from './TodoList';
import Footer from './Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FilterValues } from '../types';

const App: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState('');
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodoText.trim() !== '') {
      dispatch(addTodo(newTodoText.trim()));
      setNewTodoText('');
    }
  };

  useEffect(() => {
    setNewTodoText('');
  }, [location]);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTodoText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </header>
      <Routes>
        <Route path="/" element={<TodoList filter={FilterValues.All} />} />
        <Route
          path="/active"
          element={<TodoList filter={FilterValues.Active} />}
        />
        <Route
          path="/completed"
          element={<TodoList filter={FilterValues.Completed} />}
        />
      </Routes>
      <Footer />
    </section>
  );
};

export default App;

```