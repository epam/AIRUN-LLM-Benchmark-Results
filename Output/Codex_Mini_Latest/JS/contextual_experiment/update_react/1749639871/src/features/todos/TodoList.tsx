import React, { ChangeEvent } from 'react';
import { Todo } from './types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  onToggleAll: (checked: boolean) => void;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  editingId,
  onToggleAll,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleAll(e.target.checked);
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <section className='main'>
      <input
        id='toggle-all'
        className='toggle-all'
        type='checkbox'
        checked={allCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor='toggle-all'>Mark all as complete</label>
      <ul className='todo-list'>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={editingId === todo.id}
            onToggle={() => onToggle(todo.id)}
            onDestroy={() => onDestroy(todo.id)}
            onEdit={() => onEdit(todo.id)}
            onSave={text => onSave(todo.id, text)}
            onCancel={onCancel}
          />
        ))}
      </ul>
    </section>
  );
};