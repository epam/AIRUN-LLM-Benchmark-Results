import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTodo, editTodo, doneEditing, revertEditing, removeTodo } from '../store/todoSlice';
import { Todo } from '../models/Todo';
import { RootState } from '../store/store';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const editedTodo = useSelector((state: RootState) => state.todos.editedTodo);
  const [title, setTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    dispatch(editTodo(todo));
  };

  const handleBlur = () => {
    dispatch(doneEditing({ ...todo, title }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(doneEditing({ ...todo, title }));
    } else if (e.key === 'Escape') {
      dispatch(revertEditing());
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${todo === editedTodo ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={() => dispatch(toggleTodo(todo.id))}/>
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))}/>
      </div>
      {todo === editedTodo && (
        <input className="edit" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus/>
      )}
    </li>
  );
};

export default TodoItem;