import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';
import { TodoFilter, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

declare var Router: any; // Assuming Router is still a global variable or imported elsewhere

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [nowShowing, setNowShowing] = useState<TodoFilter>(ALL_TODOS);

  useEffect(() => {
    // Initialize router for hash-based routing
    const router = Router({
      '/': () => setNowShowing(ALL_TODOS),
      '/active': () => setNowShowing(ACTIVE_TODOS),
      '/completed': () => setNowShowing(COMPLETED_TODOS),
    });
    router.init('/');

    // Cleanup router on component unmount
    return () => {
      // Assuming Router has a destroy or similar method
      // router.destroy(); // Or whatever cleanup is needed
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const handleFilterChange = (filter: TodoFilter) => {
    setNowShowing(filter);
  };

  return (
    <div>
      <Header />
      <MainSection nowShowing={nowShowing} />
      {(activeTodoCount > 0 || completedCount > 0) && (
        <Footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default App;
