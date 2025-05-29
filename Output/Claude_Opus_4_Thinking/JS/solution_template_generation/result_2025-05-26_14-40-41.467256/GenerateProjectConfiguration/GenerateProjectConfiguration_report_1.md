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
### Thoughts:
The user wants me to create a complete project setup for a React application with TypeScript, using Vite as the build tool, Redux for state management, React Router for navigation, and including testing configuration. I need to provide:

1. Complete package.json with all dependencies
2. TypeScript configuration (tsconfig.json)
3. Vite configuration (vite.config.ts)
4. Project structure
5. Basic setup files for Redux, React Router
6. Testing configuration
7. Documentation for CLI commands

Let me create a production-ready setup without placeholder comments or TODOs.

### Answer:
I'll create a complete project configuration for a React + TypeScript application with Vite, Redux, React Router, and testing setup.

## package.json

```json
{
  "name": "react-vite-project",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,scss}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.21.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.1.0",
    "@vitest/ui": "^1.1.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.0.1",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "vitest": "^1.1.0"
  }
}
```

## tsconfig.json

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
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## tsconfig.node.json

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

## vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
})
```

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
})
```

## .eslintrc.cjs

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

## .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/main.tsx

```typescript
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

## src/App.tsx

```typescript
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
```

## src/store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## src/store/slices/counterSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
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
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

## src/hooks/redux.ts

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## src/components/Layout.tsx

```typescript
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
    </div>
  )
}

export default Layout
```

## src/pages/Home.tsx

```typescript
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { increment, decrement } from '@/store/slices/counterSlice'

const Home = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h2>Counter: {count}</h2>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  )
}

export default Home
```

## src/pages/About.tsx

```typescript
const About = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a React application built with Vite, TypeScript, Redux, and React Router.</p>
    </div>
  )
}

export default About
```

## src/index.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 0 0.5em;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  justify-content: center;
}

nav {
  margin-bottom: 2rem;
}
```

## src/test/setup.ts

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

## src/components/Layout.test.tsx

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'

describe('Layout', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})
```

## .gitignore

```
node_modules
dist
dist-ssr
*.local
coverage
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
.idea
.vscode/*
!.vscode/extensions.json
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## CLI Commands Documentation

### Development Commands

- **`npm run dev`** - Starts the development server with hot module replacement on http://localhost:3000
- **`npm run build`** - Runs TypeScript compiler and builds the production bundle to the `dist` folder
- **`npm run preview`** - Serves the production build locally for testing

### Testing Commands

- **`npm run test`** - Runs all test suites using Vitest in watch mode
- **`npm run test:ui`** - Opens Vitest UI for interactive test debugging
- **`npm run test:coverage`** - Generates test coverage report

### Code Quality Commands

- **`npm run lint`** - Runs ESLint to check for code quality issues and potential errors
- **`npm run format`** - Formats all TypeScript, TSX, JSON, and CSS files using Prettier
- **`npm run type-check`** - Runs TypeScript compiler in no-emit mode to check for type errors

### Project Structure

```
.
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── Layout.test.tsx
│   ├── hooks/
│   │   └── redux.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── store/
│   │   ├── index.ts
│   │   └── slices/
│   │       └── counterSlice.ts
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

### Tokens: {'input_tokens': 321, 'output_tokens': 4405}
### Execution time: 44.353235960006714
