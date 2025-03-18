import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { addTodo, clearCompleted, markAll, removeTodo, updateTodo } from './store/todoSlice';
import Header from './components/Header';
import MainSection from './components/MainSection';
import TodoFooter from './components/TodoFooter';

function App() {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const handleNewTodo = (title: string) => {
    if (title.trim()) {
      dispatch(addTodo(title));
    }
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleMarkAll = (completed: boolean) => {
    dispatch(markAll(completed));
  };

  return (
    <div className="todoapp">
      <Header onNewTodo={handleNewTodo} />
      <MainSection
        todos={todos}
        onToggleAll={handleMarkAll}
        onUpdateTodo={(id, updates) => dispatch(updateTodo({ id, updates }))}
        onRemoveTodo={id => dispatch(removeTodo(id))}
      />
      {todos.length > 0 && (
        <TodoFooter
          todos={todos}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
}

export default App;