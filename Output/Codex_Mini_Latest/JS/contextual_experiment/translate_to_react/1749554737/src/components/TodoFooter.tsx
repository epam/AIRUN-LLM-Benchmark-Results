```tsx
import React from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { clearCompleted } from '../store/todosSlice'
import TodoFilters from './TodoFilters'

const TodoFooter: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos)
  const remainingCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - remainingCount
  const dispatch = useAppDispatch()

  if (todos.length === 0) {
    return null
  }

  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
      </span>
      <TodoFilters />
      {completedCount > 0 && (
        <button
          className='clear-completed'
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  )
}

export default TodoFooter
```