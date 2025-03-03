import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { Provider } from 'react-redux';
import { store } from './store/store';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <Provider store={store}>
      <section className="todoapp">
        <TodoInput />
        <TodoList activeFilter={activeFilter} />
        <TodoFooter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </section>
    </Provider>
  );
};

export default App;