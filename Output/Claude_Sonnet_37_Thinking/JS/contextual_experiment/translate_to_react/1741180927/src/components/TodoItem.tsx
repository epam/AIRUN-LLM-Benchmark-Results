import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleTodo, removeTodo, updateTodo, setEditedTodoId } from '../store/todosSlice';
import useTodoFocus from '../hooks/useTodoFocus';
import useTodoEscape from '../hooks/useTodoEscape';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const editedTodoId = useAppSelector((state) => state.todos.editedTodoId);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = editedTodoId === todo.id;
  
  useTodoFocus(editInputRef, isEditing);
  useTodoEscape(editInputRef, () => {
    setEditText(todo.title); // Revert to original
    dispatch(setEditedTodoId(null));
  });
  
  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };
  
  const handleDelete = () => {
    dispatch(removeTodo(todo.id));
  };
  
  const handleEdit = () => {
    dispatch(setEditedTodoId(todo.id));
    setEditText(todo.title);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateTodo({ id: todo.id, title: editText }));
  };
  
  const handleBlur = () => {
    dispatch(updateTodo({ id: todo.id, title: editText }));
  };
  
  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input 
          className="toggle" 
          type="checkbox" 
          checked={todo.completed} 
          onChange={handleToggle} 
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete}></button>
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            className="edit"
            ref={editInputRef}
            value={editText}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
