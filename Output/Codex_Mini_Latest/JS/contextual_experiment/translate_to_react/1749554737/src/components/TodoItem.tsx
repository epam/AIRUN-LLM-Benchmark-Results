```tsx
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, FormEvent } from 'react'
import { useAppDispatch } from '../store'
import { toggleCompleted, removeTodo, editTodo } from '../store/todosSlice'
import { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const handleDoubleClick = () => {
    setEditing(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleBlur = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      dispatch(removeTodo(todo.id))
    } else {
      dispatch(editTodo({ id: todo.id, title: trimmed }))
    }
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setTitle(todo.title)
      setEditing(false)
    }
  }

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className='view'>
        <input
          className='toggle'
          type='checkbox'
          checked={todo.completed}
          onChange={() => dispatch(toggleCompleted(todo.id))}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button
          className='destroy'
          onClick={() => dispatch(removeTodo(todo.id))}
        />
      </div>
      {editing && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            inputRef.current?.blur()
          }}
        >
          <input
            className='edit'
            ref={inputRef}
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}
    </li>
  )
}

export default TodoItem
```