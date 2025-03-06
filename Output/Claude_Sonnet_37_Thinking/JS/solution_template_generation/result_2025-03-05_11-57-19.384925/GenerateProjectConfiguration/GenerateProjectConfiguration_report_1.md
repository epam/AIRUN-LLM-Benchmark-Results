Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Thoughts:
I'll create a project configuration based on Vite for a React application with support for Redux, React-Router, TypeScript, and testing library. Let's break this down step by step:

1. First, I'll describe the commands that would be used to set up such a project.
2. I'll provide a package.json file with all the necessary dependencies.
3. I'll ensure there are no TODOs in the code.
4. I'll provide the codebase without additional comments.

Let's start with describing the commands:

```bash
# Create a new Vite project with React and TypeScript template
npm create vite@latest my-app --template react-ts

# Navigate to the project directory
cd my-app

# Install Redux related packages
npm install @reduxjs/toolkit react-redux

# Install React Router
npm install react-router-dom

# Install testing libraries
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install additional dev dependencies
npm install --save-dev eslint eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Now, let's create the package.json file. It should include:

1. Basic project information
2. Scripts for development, building, testing, etc.
3. Dependencies for React, Redux, React-Router
4. Development dependencies for TypeScript, testing libraries, and linting

Here's the package.json:

```json
{
  "name": "vite-react-redux-router-ts",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.1",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.4.0",
    "@vitejs/plugin-react": "^4.0.4",
    "eslint": "^8.47.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.9",
    "vitest": "^0.34.2"
  }
}
```

Now, I'll create the core configuration files needed for this setup:

1. vite.config.ts - Configuration for Vite
2. tsconfig.json - TypeScript configuration
3. .eslintrc.cjs - ESLint configuration
4. vitest.setup.ts - Setup file for Vitest
5. .gitignore - Standard Git ignore file

Let's start with vite.config.ts:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
```

Next, tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

tsconfig.node.json:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

.eslintrc.cjs:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

vitest.setup.ts:

```typescript
import '@testing-library/jest-dom'
```

.gitignore:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage
```

Let's also add a basic sample directory structure for the React application with Redux and React Router:

src/main.tsx:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './store'
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

src/App.tsx:
```tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
```

src/store/index.ts:
```typescript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

src/store/slices/counterSlice.ts:
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

src/hooks/useAppDispatch.ts:
```typescript
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
```

src/hooks/useAppSelector.ts:
```typescript
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '../store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

src/components/Layout.tsx:
```tsx
import { Outlet, Link } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2023 Your App</p>
      </footer>
    </div>
  )
}

export default Layout
```

src/pages/Home.tsx:
```tsx
import { useAppSelector, useAppDispatch } from '../hooks/useAppSelector'
import { increment, decrement } from '../store/slices/counterSlice'

const Home = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Home Page</h1>
      <p>Counter: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}

export default Home
```

src/pages/About.tsx:
```tsx
const About = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of our application.</p>
    </div>
  )
}

export default About
```

src/pages/NotFound.tsx:
```tsx
const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
```

Let's also add a basic test to demonstrate the testing setup:

src/__tests__/App.test.tsx:
```tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { store } from '../store'

describe('App', () => {
  it('renders home page by default', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
    
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })
})
```

I've created a comprehensive setup for a Vite-based React application with TypeScript, Redux, React Router, and testing support. This setup includes:

1. Package.json with all required dependencies
2. Configuration files for Vite, TypeScript, ESLint, and Vitest
3. Basic application structure with Redux store and slices
4. React Router setup with example pages
5. A sample test

This should provide a solid foundation for starting a new project with the specified technologies.

### Answer:
# Vite React Project with Redux, React-Router, TypeScript, and Testing Library

## Commands to Set Up the Project

```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest my-app --template react-ts

# Navigate to project directory
cd my-app

# Install Redux packages
npm install @reduxjs/toolkit react-redux

# Install React Router
npm install react-router-dom

# Install testing libraries
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install additional developer dependencies
npm install --save-dev eslint eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## package.json

```json
{
  "name": "vite-react-redux-router-ts",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.1",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.4.0",
    "@vitejs/plugin-react": "^4.0.4",
    "eslint": "^8.47.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.9",
    "vitest": "^0.34.2"
  }
}
```

## Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### vitest.setup.ts
```typescript
import '@testing-library/jest-dom'
```

### .gitignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage
```

## Application Structure

### src/main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './store'
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

### src/App.tsx
```tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
```

### src/store/index.ts
```typescript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### src/store/slices/counterSlice.ts
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

### src/hooks/useAppDispatch.ts
```typescript
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
```

### src/hooks/useAppSelector.ts
```typescript
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '../store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### src/components/Layout.tsx
```tsx
import { Outlet, Link } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2023 Your App</p>
      </footer>
    </div>
  )
}

export default Layout
```

### src/pages/Home.tsx
```tsx
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { increment, decrement } from '../store/slices/counterSlice'

const Home = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Home Page</h1>
      <p>Counter: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}

export default Home
```

### src/pages/About.tsx
```tsx
const About = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of our application.</p>
    </div>
  )
}

export default About
```

### src/pages/NotFound.tsx
```tsx
const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
```

### src/__tests__/App.test.tsx
```tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { store } from '../store'

describe('App', () => {
  it('renders home page by default', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
    
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })
})
```

### Tokens: {'input_tokens': 169, 'output_tokens': 6106}
### Execution time: 65.96764802932739
