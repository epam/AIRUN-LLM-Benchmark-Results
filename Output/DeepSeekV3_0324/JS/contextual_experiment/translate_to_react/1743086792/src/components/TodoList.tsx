import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';

type TodoListProps = {
  filter?: 'all' | 'active' | 'completed';
};

const TodoList: React.FC<TodoListProps> = ({ filter = 'all' }) => {
  const todos = useSelector((state: RootState) => {
    switch (filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  });

  if (todos.length === 0) return null;

  return (
    <section className="main">
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;