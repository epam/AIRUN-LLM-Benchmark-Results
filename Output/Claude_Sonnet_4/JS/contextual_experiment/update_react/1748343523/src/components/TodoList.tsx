import React from 'react';
import { TodoItem } from './TodoItem';
import { TodoListProps } from '../types';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  editingId,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={editingId === todo.id}
          onToggle={onToggle}
          onDestroy={onDestroy}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      ))}
    </ul>
  );
};