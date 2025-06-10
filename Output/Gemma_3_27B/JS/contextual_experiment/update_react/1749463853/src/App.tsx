import React from 'react';
import { useSelector } from 'react-redux';
import { TodoList } from './features/todos/TodoList';
import { Footer } from './components/Footer';
import { selectTodos } from './features/todos/todoSlice';

function App() {
  const todos = useSelector(selectTodos);

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus={true}
        />
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={todos.length === 0 || todos.every(todo => todo.completed)}
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <ul className="todo-list">
          <TodoList />
        </ul>
      </section>
      <Footer />
    </div>
  );
}

export default App;