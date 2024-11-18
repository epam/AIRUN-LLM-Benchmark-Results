import React from 'react';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import { markAll } from './store/todoSlice';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();
  const allChecked = todos.length > 0 && todos.every((todo) => todo.completed);

  return (
    <Router>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoForm />
        </header>
        {todos.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={allChecked}
              onChange={(e) => dispatch(markAll(e.target.checked))}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <Routes>
              <Route path="/" element={<TodoList filter={() => true} />} />
              <Route path="/active" element={<TodoList filter={(todo) => !todo.completed} />} />
              <Route path="/completed" element={<TodoList filter={(todo) => todo.completed} />} />
            </Routes>
          </section>
        )}
        {todos.length > 0 && <Footer />}
      </section>
    </Router>
  );
};

export default App;
