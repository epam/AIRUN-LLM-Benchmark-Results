import React, { useState, useRef, useEffect } from 'react';\nimport { useDispatch } from 'react-redux';\nimport { toggleTodo, destroyTodo, saveTodo } from '../../store/todoSlice';\nimport { ENTER_KEY, ESCAPE_KEY } from '../../constants';\nimport classNames from 'classnames';\n\ninterface ITodoItemProps {\n  todo: any;\n  editing: boolean;\n  onEdit: () => void;\n  onCancel: (event: React.KeyboardEvent) => void;\n}\n\nconst TodoItem: React.FC<ITodoItemProps> = ({ todo, editing, onEdit, onCancel }) => {\n  const dispatch = useDispatch();\n  const [editText, setEditText] = useState(todo.title);\n  const editFieldRef = useRef<HTMLInputElement>(null);\n\n  const handleSubmit = (event: React.FormEvent) => {\n    event.preventDefault();\n    const val = editText.trim();\n    if (val) {\n      dispatch(saveTodo({ id: todo.id, title: val }));\n      setEditText(val);\n    } else {\n      dispatch(destroyTodo(todo.id));\n    }\n  };\n\n  const handleEdit = () => {\n    onEdit();\n    setEditText(todo.title);\n  };\n\n  const handleKeyDown = (event: React.KeyboardEvent) => {\n    if (event.keyCode === ESCAPE_KEY) {\n      setEditText(todo.title);\n      onCancel(event);\n    } else if (event.keyCode === ENTER_KEY) {\n      handleSubmit(event);\n    }\n  };\n\n  const handleChange = (event: React.FormEvent) => {\n    const input = event.target as HTMLInputElement;\n    setEditText(input.value);\n  };\n\n  useEffect(() => {\n    if (editing && editFieldRef.current) {\n      editFieldRef.current.focus();\n      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);\n    }\n  }, [editing]);\n\n  return (\n    <li className={classNames({ completed: todo.completed, editing })}>\n      <div className='view'>\n        <input\n          className='toggle'\n          type='checkbox'\n          checked={todo.completed}\n          onChange={() => dispatch(toggleTodo(todo.id))}\n        />\n        <label onDoubleClick={handleEdit}>{todo.title}</label>\n        <button className='destroy' onClick={() => dispatch(destroyTodo(todo.id))} />\n      </div>\n      <input\n        ref={editFieldRef}\n        className='edit'\n        value={editText}\n        onBlur={handleSubmit}\n        onChange={handleChange}\n        onKeyDown={handleKeyDown}\n      />\n    </li>\n  );\n};\n\nexport default TodoItem;