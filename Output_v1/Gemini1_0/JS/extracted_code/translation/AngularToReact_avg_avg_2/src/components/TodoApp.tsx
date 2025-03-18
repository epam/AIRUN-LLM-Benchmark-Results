import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, removeTodo, clearCompleted } from '../store';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const TodoApp = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAddTodo = (title: string) => {
    dispatch(addTodo(title));
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleRemoveTodo = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div className="todo-app">
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onRemoveTodo={handleRemoveTodo}
      />
      <button onClick={handleClearCompleted}>Clear Completed</button>
    </div>
  );
};

export default TodoApp;