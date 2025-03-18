import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { markAll } from '../store/todosSlice';
import TodoItem from './TodoItem';
import { Todo } from '../types';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, status } = useAppSelector((state) => state.todos);
  
  if (todos.length === 0) {
    return null;
  }
  
  const filteredTodos = todos.filter((todo: Todo) => {
    if (status === 'active') {
      return !todo.completed;
    } else if (status === 'completed') {
      return todo.completed;
    }
    return true; // 'all' filter
  });
  
  const allChecked = todos.every(todo => todo.completed);
  
  const handleToggleAll = () => {
    dispatch(markAll(!allChecked));
  };
  
  return (
    <section className="main">
      <input 
        id="toggle-all" 
        className="toggle-all" 
        type="checkbox" 
        checked={allChecked} 
        onChange={handleToggleAll} 
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
