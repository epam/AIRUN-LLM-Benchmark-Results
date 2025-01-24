import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Todo, Filter } from '../types';
import { editTodo, removeTodo, toggleTodo } from '../slices/todoSlice';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface Props {
  todo: Todo;
  activeFilter: Filter;
}

const TodoItem: React.FC<Props> = ({ todo, activeFilter }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const inputRef = useTodoFocus<HTMLInputElement>(isEditing);
  useTodoEscape(() => {
    setIsEditing(false);
    setEditText(todo.title);
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim().length === 0) {
      dispatch(removeTodo(todo.id));
    } else {
      dispatch(editTodo({ id: todo.id, title: editText }));
    }
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  const shouldShow = () => {
    if (activeFilter === 'all') {
      return true;
    }
    return activeFilter === 'active' ? !todo.completed : todo.completed;
  };

  if (!shouldShow()) {
    return null;
  }

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove} />
      </div>
      {isEditing && (
        <input
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={handleInputChange}
          onBlur={handleSave}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSave();
            }
          }}
        />
      )}
    </li>
  );
};

export default TodoItem;
