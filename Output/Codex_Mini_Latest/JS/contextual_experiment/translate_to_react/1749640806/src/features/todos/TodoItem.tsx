```tsx
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toggleTodo, updateTodo, deleteTodo } from './todosSlice'

interface TodoItemProps {
  id: string
  title: string
  completed: boolean
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleToggle = () => {
    dispatch(toggleTodo(id))
  }

  const handleDelete = () => {
    dispatch(deleteTodo(id))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
  }

  const handleSubmit = () => {
    const newTitle = editedTitle.trim()
    if (newTitle) {
      dispatch(updateTodo({ id, title: newTitle }))
    } else {
      dispatch(deleteTodo(id))
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(title)
      setIsEditing(false)
    } else if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className='view'>
        <input className='toggle' type='checkbox' checked={completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{title}</label>
        <button className='destroy' onClick={handleDelete} />
      </div>
      {isEditing && (
        <input
          ref={inputRef}
          className='edit'
          value={editedTitle}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  )
}

export default TodoItem
```