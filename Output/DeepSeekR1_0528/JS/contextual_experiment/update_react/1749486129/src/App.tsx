import { Routes, Route } from 'react-router-dom';
import TodoApp from './components/TodoApp';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TodoApp filter={ALL_TODOS} />} />
      <Route path="/active" element={<TodoApp filter={ACTIVE_TODOS} />} />
      <Route path="/completed" element={<TodoApp filter={COMPLETED_TODOS} />} />
    </Routes>
  );
};

export default App;