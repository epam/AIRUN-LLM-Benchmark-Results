```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

const todosSlice = createSlice({
  name: 'todos',
  initialState: [] as Todo[],
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.push(action.payload)
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } }
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find(todo => todo.id === action.payload.id)
      if (todo) {
        todo.title = action.payload.title
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      return state.filter(todo => todo.id !== action.payload)
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.forEach(todo => {
        todo.completed = action.payload
      })
    },
    clearCompleted(state) {
      return state.filter(todo => !todo.completed)
    }
  }
})

export const { addTodo, toggleTodo, updateTodo, deleteTodo, toggleAll, clearCompleted } = todosSlice.actions
export default todosSlice.reducer
```