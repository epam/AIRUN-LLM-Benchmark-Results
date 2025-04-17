import React from "react";
import TodoList from "./features/todos/TodoList";
import TodoFooter from "./features/todos/TodoFooter";

const App: React.FC = () => (
  <div className="todoapp">
    <TodoList />
    <TodoFooter />
  </div>
);

export default App;
