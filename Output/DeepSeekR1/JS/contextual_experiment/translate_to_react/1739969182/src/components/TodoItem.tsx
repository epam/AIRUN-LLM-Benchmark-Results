import { useState, useEffect, useRef } from 'react';
import useKeyPress from '../hooks/useKeyPress';
import { Todo } from '../store/todoSlice';

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  editedTitle: string;
  onEdit: (todo: Todo) => void;
  onUpdate: (id: string) => void;
  onRemove: (id: string) => void;
  onTitleChange: (title: string) => void;
  onCancel: () => void;
};

export default function TodoItem({
  todo,
  isEditing,
  editedTitle,
  onEdit,
  onUpdate,
  onRemove,
  onTitleChange,
  onCancel
}: TodoItemProps) {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useKeyPress('Escape', () => {
    if (isEditing) onCancel();
  });

  const handleSubmit = () => {
    onUpdate(todo.id);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onTitleChange(e.target.checked.toString())}
        />
        <label onDoubleClick={() => onEdit(todo)}>{todo.title}</label>
        <button className="destroy" onClick={() => onRemove(todo.id)} />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editedTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={handleSubmit}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      )}
    </li>
  );
}
