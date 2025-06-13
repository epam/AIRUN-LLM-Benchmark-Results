```ts
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { RootState } from '../../store'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export type Filter = 'all' | 'active' | 'completed'

interface TodosState {
  todos: Todo[]
  filter: Filter
}

const initialState: TodosState = {
  todos: JSON.parse(localStorage.getItem('todos') || '[]'),
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
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(todo => todo.id === action.payload.id)
      if (todo) {
        todo.title = action.payload.title
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed)
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload
      })
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload
    }
  }
})

export const {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  clearCompleted,
  toggleAll,
  setFilter
} = todosSlice.actions

export default todosSlice.reducer

export const selectTodos = (state: RootState) => state.todos.todos
export const selectFilter = (state: RootState) => state.todos.filter

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }
)

export const selectRemainingCount = createSelector(selectTodos, todos =>
  todos.filter(todo => !todo.completed).length
)
export const selectTodosCount = createSelector(selectTodos, todos => todos.length)
```