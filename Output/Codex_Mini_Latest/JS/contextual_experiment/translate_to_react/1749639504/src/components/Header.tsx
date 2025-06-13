```tsx
import React, { useState, FormEvent, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../features/todos/todosSlice'

const Header: React.FC = () => {
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    dispatch(addTodo(trimmedTitle))
    setTitle('')
  }

  return (
    <header className='header'>
      <h1>todos</h1>
      <form className='todo-form' onSubmit={handleSubmit}>
        <input
          className='new-todo'
          placeholder='What needs to be done?'
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  )
}

export default Header
```