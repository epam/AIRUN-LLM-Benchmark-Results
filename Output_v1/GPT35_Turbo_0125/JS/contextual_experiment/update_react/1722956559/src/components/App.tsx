```tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTodo } from '../store/todoSlice';
import TodoItem from './TodoItem';
import Footer from './Footer';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch<AppDispatch>();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch(addTodo({
        title: newTodo,
        completed: false,
      }));
      setNewTodo('');
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input type='text' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={handleAddTodo}>Add Todo</button>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <Footer />
    </div>
  );
};

export default App;
```