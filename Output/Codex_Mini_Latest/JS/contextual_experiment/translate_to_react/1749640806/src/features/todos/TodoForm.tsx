```tsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from './todosSlice'

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    dispatch(addTodo(trimmed))
    setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
    </form>
  )
}

export default TodoForm
```