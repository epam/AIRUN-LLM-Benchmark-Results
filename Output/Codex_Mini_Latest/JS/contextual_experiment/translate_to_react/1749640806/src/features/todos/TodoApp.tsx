```tsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../app/store'
import { toggleAll, clearCompleted } from './todosSlice'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

type Filter = 'all' | 'active' | 'completed'

const TodoApp: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch()
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '')
      if (hash === 'active' || hash === 'completed') {
        setFilter(hash as Filter)
      } else {
        setFilter('all')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const remainingCount = todos.filter(todo => !todo.completed).length
  const allCompleted = todos.length > 0 && remainingCount === 0

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAll(e.target.checked))
  }

  const handleClearCompleted = () => {
    dispatch(clearCompleted())
  }

  return (
    <section className='todoapp'>
      <header className='header'>
        <h1>todos</h1>
        <TodoForm />
      </header>

      <section className='main'>
        {todos.length > 0 && (
          <>
            <input
              id='toggle-all'
              className='toggle-all'
              type='checkbox'
              checked={allCompleted}
              onChange={handleToggleAll}
            />
            <label htmlFor='toggle-all'>Mark all as complete</label>
            <TodoList todos={filteredTodos} />
          </>
        )}
      </section>

      <footer className='footer'>
        {todos.length > 0 && (
          <>
            <span className='todo-count'>
              <strong>{remainingCount}</strong>
              {remainingCount === 1 ? ' item left' : ' items left'}
            </span>
            <ul className='filters'>
              <li>
                <a className={filter === 'all' ? 'selected' : ''} href='#/'>All</a>
              </li>
              <li>
                <a className={filter === 'active' ? 'selected' : ''} href='#/active'>Active</a>
              </li>
              <li>
                <a className={filter === 'completed' ? 'selected' : ''} href='#/completed'>Completed</a>
              </li>
            </ul>
            {remainingCount < todos.length && (
              <button className='clear-completed' onClick={handleClearCompleted}>
                Clear completed
              </button>
            )}
          </>
        )}
      </footer>
    </section>
  )
}

export default TodoApp
```