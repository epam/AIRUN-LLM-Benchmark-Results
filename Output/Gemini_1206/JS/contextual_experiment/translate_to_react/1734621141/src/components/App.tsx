import { useState } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { Filter } from '../types';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
  };

  return (
    <section className="todoapp">
      <TodoInput />
      <TodoList activeFilter={activeFilter} />
      <TodoFooter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
    </section>
  );
};

export default App;
