```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../slices/todosSlice';
import TodoList from './TodoList';
import Footer from './Footer';

const App: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState('');
  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmedText = newTodoText.trim();
    if (trimmedText) {
      dispatch(addTodo(trimmedText));
      setNewTodoText('');
    }
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </header>
      <TodoList />
      <Footer />
    </section>
  );
};

export default App;

```