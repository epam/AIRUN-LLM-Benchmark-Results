```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { Todo, Filter } from '../types'

const initialTodos: Todo[] = JSON.parse(localStorage.getItem('todos-react-ts') ?? '[]')

interface TodosState {
  todos: Todo[]
  filter: Filter
}

const initialState: TodosState = {
  todos: initialTodos,
  filter: 'all'
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload)
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } }
      }
    },
    toggleCompleted(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((t) => t.id === action.payload.id)
      if (todo) {
        todo.title = action.payload.title
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload)
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed)
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((t) => {
        t.completed = action.payload
      })
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload
    }
  }
})

export const {
  addTodo,
  toggleCompleted,
  editTodo,
  removeTodo,
  clearCompleted,
  toggleAll,
  setFilter
} = todosSlice.actions

export default todosSlice.reducer
```