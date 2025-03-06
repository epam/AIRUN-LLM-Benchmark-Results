import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Todo, toggleTodo, removeTodo, editTodo, setEditingId } from '../store/todoSlice';
import { RootState } from '../store/store';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const editingId = useSelector((state: RootState) => state.todos.editingId);
  const isEditing = editingId === todo.id;
  
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useTodoFocus(isEditing);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    dispatch(setEditingId(null));
  };

  const handleEdit = () => {
    dispatch(setEditingId(todo.id));
  };

  const handleCancel = () => {
    setEditText(todo.title);
    dispatch(setEditingId(null));
  };

  useTodoEscape(handleCancel);

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input 
          className="toggle" 
          type="checkbox" 
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button 
          className="destroy" 
          onClick={() => dispatch(removeTodo(todo.id))}
        />
      </div>
      {isEditing && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            className="edit"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSubmit}
            ref={inputRef}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;