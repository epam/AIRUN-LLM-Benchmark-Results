```tsx
import React from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { setFilter } from '../store/todosSlice'
import { Filter } from '../types'

const FILTER_TITLES: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

const TodoFilters: React.FC = () => {
  const filter = useAppSelector((state) => state.todos.filter)
  const dispatch = useAppDispatch()

  return (
    <ul className='filters'>
      {(Object.keys(FILTER_TITLES) as Filter[]).map((key) => (
        <li key={key}>
          <a
            href='#'
            className={filter === key ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault()
              dispatch(setFilter(key))
            }}
          >
            {FILTER_TITLES[key]}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default TodoFilters
```