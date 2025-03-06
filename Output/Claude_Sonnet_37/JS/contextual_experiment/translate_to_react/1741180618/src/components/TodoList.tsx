import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { markAllAs } from '../store/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state: RootState) => state.todos);
  
  const filteredTodos = todos.filter(todo => {
    if (status === 'active') {
      return !todo.completed;
    } else if (status === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input 
        id="toggle-all" 
        className="toggle-all" 
        type="checkbox" 
        checked={allCompleted}
        onChange={() => dispatch(markAllAs(!allCompleted))}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;