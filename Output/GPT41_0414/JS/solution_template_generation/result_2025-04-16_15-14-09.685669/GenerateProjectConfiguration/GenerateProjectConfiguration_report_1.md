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
Below is a complete, production-ready Vite + React + TypeScript + Redux + React Router project configuration, including a fully specified `package.json`, all essential configuration files, and a concise documentation section.

---

**package.json**
```json
{
  "name": "vite-react-ts-redux-router-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.62",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "jsdom": "^24.0.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5",
    "vite": "^5.2.8",
    "vitest": "^1.4.0"
  }
}
```

---

**vite.config.ts**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

---

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
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
  "include": ["src"]
}
```

---

**.eslintrc.json**
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {}
}
```

---

**.prettierrc**
```json
{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "all",
  "printWidth": 80
}
```

---

**vitest.config.ts**
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
```

---

**src/main.tsx**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
```

---

**src/App.tsx**
```tsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
```

---

**src/pages/Home.tsx**
```tsx
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { increment } from '../store/counterSlice'

export default function Home() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  return (
    <div>
      <h1>Home</h1>
      <div>
        <span>Count: {count}</span>
        <button onClick={() => dispatch(increment())}>Increment</button>
      </div>
    </div>
  )
}
```

---

**src/pages/About.tsx**
```tsx
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>About page content.</p>
    </div>
  )
}
```

---

**src/store/index.ts**
```ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

**src/store/counterSlice.ts**
```ts
import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
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
    }
  }
})

export const { increment } = counterSlice.actions
export default counterSlice.reducer
```

---

**src/store/hooks.ts**
```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

---

**src/setupTests.ts**
```ts
import '@testing-library/jest-dom'
```

---

**src/pages/Home.test.tsx**
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '../store'
import Home from './Home'

test('renders Home and increments counter', async () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  )
  expect(screen.getByText(/Count: 0/)).toBeInTheDocument()
  await userEvent.click(screen.getByText(/Increment/))
  expect(screen.getByText(/Count: 1/)).toBeInTheDocument()
})
```

---

**public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite React TS Redux Router App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## CLI Commands Documentation

| Command           | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `npm run dev`     | Start the development server with hot module replacement.                |
| `npm run build`   | Build the application for production.                                   |
| `npm run preview` | Preview the production build locally.                                   |
| `npm run test`    | Run all unit and component tests using Vitest.                          |
| `npm run test:coverage` | Run tests and generate a code coverage report.                    |
| `npm run lint`    | Lint all source files using ESLint and Prettier rules.                  |

**Usage:**

- `npm run dev`  
  Launches the Vite development server at [http://localhost:5173](http://localhost:5173) by default.

- `npm run build`  
  Compiles the app into the `dist` directory for deployment.

- `npm run preview`  
  Serves the production build locally for final testing.

- `npm run test`  
  Executes all tests in the `src` directory using Vitest.

- `npm run test:coverage`  
  Runs tests and outputs a coverage report in the `coverage` directory.

- `npm run lint`  
  Checks code for style and quality issues.

---

**This project is ready for immediate development, testing, and production deployment.**

### Tokens: {'input_tokens': 276, 'output_tokens': 2165, 'reasoning_tokens': 0}
### Execution time: 34.480501890182495
