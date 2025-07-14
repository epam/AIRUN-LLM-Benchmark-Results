import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  shownTodos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ shownTodos }) => {
  return (
    <ul className="todo-list">
      {shownTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;