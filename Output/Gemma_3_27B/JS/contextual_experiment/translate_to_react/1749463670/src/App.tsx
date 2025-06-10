import React from 'react';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import './App.css';

function App() {
  return (
    <section className="todoapp">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Credits: Christoph Burgdorf, Eric Bidelman, Jacob Mumm, Igor Minar and Pascal Hartig</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </section>
  );
}

export default App;