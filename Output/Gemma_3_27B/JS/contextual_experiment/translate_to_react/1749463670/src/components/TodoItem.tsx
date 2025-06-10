import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTodo, editTodo, updateTodo, removeTodo } from '../store/todoSlice';
import { RootState } from '../store/store';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();
  const editedTodo = useSelector((state: RootState) => state.todos.editedTodo);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleEdit = () => {
    dispatch(editTodo(todo.id));
  };

  const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTodo({ id: todo.id, title: event.target.value }));
  };

  const handleBlur = () => {
    dispatch(editTodo(null));
  };

  const handleDestroy = () => {
    dispatch(removeTodo(todo.id));
  };

  return (
    <li className={`todo ${todo.completed ? 'completed' : ''} ${editedTodo === todo.id ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      {editedTodo === todo.id && (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="edit"
            value={todo.title}
            onChange={handleUpdate}
            onBlur={handleBlur}
          />
        </form>
      )}
    </li>
  );
}

export default TodoItem;