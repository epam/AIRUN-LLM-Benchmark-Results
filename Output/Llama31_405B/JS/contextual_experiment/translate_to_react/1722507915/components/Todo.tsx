import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted } from '../store/todoSlice';

function Todo() {
  const todos = useSelector((state: any) => state.todos);
  const dispatch = useDispatch();

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <div>
      <TodoForm />
      <TodoList />
      {todos.length > 0 && (
        <div>
          <p>{todos.filter((todo: any) => !todo.completed).length} items left</p>
          <button onClick={handleClearCompleted}>Clear completed</button>
        </div>
      )}
    </div>
  );
}

export default Todo;