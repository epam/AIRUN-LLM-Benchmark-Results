import React from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoFooter from "./TodoFooter";

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <TodoForm />
      </header>
      <TodoList />
      <TodoFooter />
    </section>
  );
};

export default TodoApp;
