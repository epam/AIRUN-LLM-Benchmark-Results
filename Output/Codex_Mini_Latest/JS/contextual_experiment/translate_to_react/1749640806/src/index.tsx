```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import TodoApp from './features/todos/TodoApp'
import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)

root.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>
)
```