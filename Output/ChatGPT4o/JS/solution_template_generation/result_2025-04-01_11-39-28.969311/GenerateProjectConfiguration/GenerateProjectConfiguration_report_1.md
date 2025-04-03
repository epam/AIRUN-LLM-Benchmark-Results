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
Sure. Below is a complete, production-ready React + TypeScript project setup using Vite, Redux, React Router, and testing libraries. The project includes:

- Vite for fast development and build
- TypeScript support
- React with Redux Toolkit
- React Router v6
- Vitest and React Testing Library for unit testing
- ESLint and Prettier for code quality

---

📁 Project Structure

```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── app/
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── features/
│   │   └── counter/
│   │       ├── Counter.tsx
│   │       └── counterSlice.ts
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

📦 package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.0",
    "typescript": "^5.1.6",
    "vite": "^4.4.9",
    "vitest": "^0.34.6"
  }
}
```

---

🛠 vite.config.ts

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  }
})
```

---

🧪 vitest.setup.ts

```ts
import '@testing-library/jest-dom'
```

---

📄 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vitest.setup.ts"]
}
```

---

📄 .eslintrc.cjs

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
```

---

📄 .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 80
}
```

---

📄 public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

📄 src/main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

---

📄 src/App.tsx

```tsx
import AppRoutes from './routes/AppRoutes'

function App() {
  return <AppRoutes />
}

export default App
```

---

📄 src/routes/AppRoutes.tsx

```tsx
import { Routes, Route } from 'react-router-dom'
import Counter from '../features/counter/Counter'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Counter />} />
    </Routes>
  )
}

export default AppRoutes
```

---

📄 src/app/store.ts

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

---

📄 src/app/hooks.ts

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

---

📄 src/features/counter/counterSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

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

---

📄 src/features/counter/Counter.tsx

```tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { increment, decrement } from './counterSlice'

function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}

export default Counter
```

---

📄 src/features/counter/Counter.test.tsx

```tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import Counter from './Counter'

describe('Counter', () => {
  it('renders counter value', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    )
    expect(screen.getByText(/Counter:/)).toBeInTheDocument()
  })
})
```

---

📄 src/index.css

```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

---

📘 CLI Commands Documentation

| Command         | Description                                      |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Starts the Vite development server               |
| `npm run build` | Builds the app for production                    |
| `npm run preview` | Serves the production build locally            |
| `npm run test`  | Runs unit tests using Vitest                     |
| `npm run lint`  | Runs ESLint to check for code issues             |
| `npm run format`| Formats code using Prettier                      |

---

✅ This setup is ready for production and follows modern best practices for React + TypeScript development.

### Tokens: {'input_tokens': 276, 'output_tokens': 2064, 'reasoning_tokens': 0}
### Execution time: 14.645311117172241
