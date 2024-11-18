import React from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import TodoItem from './TodoItem';

interface TodoListProps {
  filter: (todo: { completed: boolean }) => boolean;
}

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
  const todos = useAppSelector((state) => state.todos.todos);
  const filteredTodos = todos.filter(filter);

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} />
      ))}
    </ul>
  );
};

export default TodoList;
