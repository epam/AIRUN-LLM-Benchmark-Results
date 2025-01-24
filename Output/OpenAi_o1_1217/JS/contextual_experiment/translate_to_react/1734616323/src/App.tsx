```tsx
import React from 'react';
import { TodoForm } from './features/todos/TodoForm';
import { TodoList } from './features/todos/TodoList';
import { TodoFooter } from './features/todos/TodoFooter';

export function App() {
  return (
    <section className="todoapp">
      <TodoForm />
      <TodoList />
      <TodoFooter />
    </section>
  );
}
```