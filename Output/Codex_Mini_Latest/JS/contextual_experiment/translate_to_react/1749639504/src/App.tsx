```tsx
import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './store'
import { setFilter, selectTodos } from './features/todos/todosSlice'
import Header from './components/Header'
import TodoList from './features/todos/TodoList'
import Footer from './components/Footer'

const AppContent: React.FC = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === '/active') {
        dispatch(setFilter('active'))
      } else if (hash === '/completed') {
        dispatch(setFilter('completed'))
      } else {
        dispatch(setFilter('all'))
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <section className="todoapp">
      <Header />
      <TodoList />
      <Footer />
    </section>
  )
}

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
)

export default App
```