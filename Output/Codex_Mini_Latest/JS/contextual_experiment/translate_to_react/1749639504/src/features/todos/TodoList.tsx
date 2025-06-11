```tsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredTodos, selectTodos, toggleAll } from './todosSlice'
import TodoItem from './TodoItem'

const TodoList: React.FC = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectFilteredTodos)
  const allTodos = useSelector(selectTodos)
  const allCompleted = allTodos.length > 0 && allTodos.every(todo => todo.completed)

  const handleToggleAll = () => {
    dispatch(toggleAll(!allCompleted))
  }

  if (allTodos.length === 0) {
    return null
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  )
}

export default TodoList
```