```typescript
import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Footer from './Footer';

const TodoApp: React.FC = () => {
  return (
    <section className="todoapp">
      <TodoForm />
      <TodoList />
      <Footer />
    </section>
  );
};

export default TodoApp;
```