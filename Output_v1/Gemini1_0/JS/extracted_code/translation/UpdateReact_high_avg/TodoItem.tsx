import { useState } from "react";
import { useDispatch } from "react-redux";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";
import { save, destroy } from "./todoSlice";

const TodoItem = ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);

  const handleEdit = () => {
    onEdit();
    setEditText(todo.title);
  };

  const handleKeyDown = (event) => {
    console.log(event.key)
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event) => {
    setEditText(event.target.value);
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(save({ ...todo, title: val }));
      setEditText(val);
    } else {
      dispatch(destroy(todo));
    }
  };

  return (
    <li className={editing ? "editing" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <input
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;