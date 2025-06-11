```tsx
import React from 'react'
import TodoHeader from './components/TodoHeader'
import TodoList from './components/TodoList'
import TodoFooter from './components/TodoFooter'

const App: React.FC = () => (
  <div className="todoapp">
    <TodoHeader />
    <TodoList />
    <TodoFooter />
  </div>
)

export default App
```