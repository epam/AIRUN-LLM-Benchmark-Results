import React from 'react';

interface TodoProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  onToggle: () => void;
  onRemove: () => void;
}

function Todo({ todo, onToggle, onRemove }: TodoProps) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <div className="view">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="toggle"
        />
        <label>{todo.title}</label>
        <button className="destroy" onClick={onRemove} />
      </div>
    </li>
  );
}

export default Todo;