Your task is to create a project start configuration
Please follow these steps:

1. Project Setup Requirements:
   - Create a complete project configuration using Vite as the build tool
   - Implement full TypeScript support throughout the project
   - Configure React as the primary UI library
   - Set up Redux for state management
   - Integrate React Router for navigation
   - Include appropriate testing library configuration

2. Package Configuration:
   - Provide a complete package.json file with all necessary dependencies
   - Include appropriate scripts for development, building, and testing
   - Specify correct version compatibility for all dependencies

3. Project Documentation:
   - Document all available CLI commands
   - Include explanations for each command's purpose and usage

4. Code Quality Standards:
   - Ensure all configuration is production-ready
   - Do not include placeholder comments or TODOs in the code
   - Follow established best practices for each technology

5. Deliverable Format:
   - Provide complete, ready-to-use code files
   - Present code without explanatory comments within the implementation
   - Structure the project according to modern development conventions
## Run 1:
### Answer:
Project structure

.
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ vitest.config.ts
├─ setupTests.ts
└─ src
   ├─ main.tsx
   ├─ App.tsx
   ├─ store
   │  ├─ index.ts
   │  └─ hooks.ts
   ├─ routes
   │  └─ AppRouter.tsx
   ├─ features
   │  └─ counter
   │     ├─ counterSlice.ts
   │     └─ Counter.tsx
   └─ tests
      └─ App.test.tsx


package.json
```json
{
  "name": "vite-react-ts-redux-router-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run --coverage",
    "test:watch": "vitest",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.18.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^14.1.0",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.2.0",
    "jsdom": "^23.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.7",
    "vitest": "^1.1.2"
  }
}
```

vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false
  }
})
```

vitest.config.ts
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html']
    }
  }
})
```

tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  },
  "include": ["src", "setupTests.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

setupTests.ts
```ts
import '@testing-library/jest-dom'
```

index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

src/main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

src/routes/AppRouter.tsx
```tsx
import { Routes, Route } from 'react-router-dom'
import App from '../App'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  )
}
```

src/App.tsx
```tsx
import Counter from './features/counter/Counter'

export default function App() {
  return <Counter />
}
```

src/store/index.ts
```ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

src/store/hooks.ts
```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

src/features/counter/counterSlice.ts
```ts
import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = { value: 0 }

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1
    },
    decrement(state) {
      state.value -= 1
    }
  }
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
```

src/features/counter/Counter.tsx
```tsx
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { decrement, increment } from './counterSlice'

export default function Counter() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  )
}
```

src/tests/App.test.tsx
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'
import App from '../App'

describe('App', () => {
  it('renders counter', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
```

CLI commands

1. npm run dev  
   • Starts a development server with hot module replacement.  
   • Accessible by default at http://localhost:5173.

2. npm run build  
   • Produces an optimized, production-ready build in the dist directory.

3. npm run preview  
   • Serves the contents of the dist directory for local production verification.

4. npm run test  
   • Executes the full test suite once and generates coverage reports.

5. npm run test:watch  
   • Runs tests in watch mode, re-executing on file changes.

6. npm run type-check  
   • Performs a strict TypeScript compilation without emitting artifacts to validate type safety.

All configurations are self-contained and require only an npm install (or yarn/pnpm) to become fully operational.

### Tokens: {'input_tokens': 275, 'output_tokens': 4299, 'reasoning_tokens': 2432}
### Execution time: 244.10659790039062
