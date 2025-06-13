```tsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCompleted, setFilter, selectRemainingCount, selectTodosCount, selectFilter } from '../features/todos/todosSlice'

const Footer: React.FC = () => {
  const dispatch = useDispatch()
  const remainingCount = useSelector(selectRemainingCount)
  const todosCount = useSelector(selectTodosCount)
  const currentFilter = useSelector(selectFilter)

  const itemWord = remainingCount === 1 ? 'item' : 'items'

  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{remainingCount}</strong> {itemWord} left
      </span>
      <ul className='filters'>
        <li>
          <a
            href='#/'
            className={currentFilter === 'all' ? 'selected' : undefined}
            onClick={e => {
              e.preventDefault()
              dispatch(setFilter('all'))
            }}
          >
            All
          </a>
        </li>
        <li>
          <a
            href='#/active'
            className={currentFilter === 'active' ? 'selected' : undefined}
            onClick={e => {
              e.preventDefault()
              dispatch(setFilter('active'))
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href='#/completed'
            className={currentFilter === 'completed' ? 'selected' : undefined}
            onClick={e => {
              e.preventDefault()
              dispatch(setFilter('completed'))
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {remainingCount < todosCount && (
        <button className='clear-completed' onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  )
}

export default Footer
```