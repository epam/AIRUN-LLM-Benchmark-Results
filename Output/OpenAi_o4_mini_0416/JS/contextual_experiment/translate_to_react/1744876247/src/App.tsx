```tsx
import React from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => (
  <section className="todoapp">
    <TodoInput />
    <TodoList />
    <Footer />
  </section>
);

export default App;
```