import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, updateTodo, removeTodo } from '../features/todos/todosSlice';
import { Todo } from '../types';
import useFocus from '../hooks/useFocus';
import useEscape from '../hooks/useEscape';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.title);

  const inputRef = useFocus<HTMLInputElement>(isEditing);

  const cancelEditing = () => {
    setIsEditing(false);
    setText(todo.title);
  };

  useEscape(() => {
    if (isEditing) {
      cancelEditing();
    }
  });

  const handleSubmit = () => {
    const trimmed = text.trim();

    if (!trimmed) {
      dispatch(removeTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: trimmed }));
    }

    setIsEditing(false);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`.trim()}>
      {!isEditing && (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <label onDoubleClick={() => setIsEditing(true)}>{todo.title}</label>
          <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
        </div>
      )}
      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={inputRef}
            className="edit"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSubmit}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
