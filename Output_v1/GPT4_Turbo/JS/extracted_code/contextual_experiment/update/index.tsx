import React from 'react';
import ReactDOM from 'react-dom/client';
import { TodoApp } from './components/TodoApp';
import { TodoModel } from './models/TodoModel';
import './index.css'; // Assuming you have some global styles

const model = new TodoModel('react-todos');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <TodoApp model={model} />
  </React.StrictMode>
);

model.subscribe(() => {
  root.render(
    <React.StrictMode>
      <TodoApp model={model} />
    </React.StrictMode>
  );
});