import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { addTodo, selectFilteredTodos } from '../app/todoSlice';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);
  const [, setStoredTodos] = useLocalStorage('todos-react', todos);

  useEffect(() => setStoredTodos(todos), [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) dispatch(addTodo(newTodo.trim()));
    setNewTodo('');
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            autoFocus
          />
        </form>
      </header>
      <TodoList />
      <TodoFooter />
    </section>
  );
};

export default TodoApp;