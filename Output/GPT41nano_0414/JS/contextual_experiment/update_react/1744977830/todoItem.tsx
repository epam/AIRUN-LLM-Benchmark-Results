import * as React from 'react';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

interface ITodoItemState {
  editText: string;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => {
  const [editText, setEditText] = React.useState(todo.title);
  const editRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  return (
    <li className={
      'completed' in todo && todo.completed ? 'completed' : '' + (editing ? ' editing' : '')
    }>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      {editing && (
        <input
          ref={editRef}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export { TodoItem };
