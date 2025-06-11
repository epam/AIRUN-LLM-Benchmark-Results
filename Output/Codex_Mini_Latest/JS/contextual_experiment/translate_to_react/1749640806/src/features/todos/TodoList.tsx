```tsx
import React from 'react'
import type { Todo } from './todosSlice'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => (
  <ul className='todo-list'>
    {todos.map(todo => (
      <TodoItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} />
    ))}
  </ul>
)

export default TodoList
```