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
## package.json

```json
{
  "name": "react-typescript-vite-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.0.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.0.4"
  }
}
```

## vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
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
    "noFallthroughCasesInSwitch": true
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

## .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
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

## src/test/setup.ts

```typescript
import '@testing-library/jest-dom'
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
import type { RootState, AppDispatch } from '../store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## src/components/Counter.tsx

```typescript
import React from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { increment, decrement, incrementByAmount } from '../store/slices/counterSlice'

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div>
        <button onClick={() => dispatch(incrementByAmount(5))}>
          +5
        </button>
      </div>
    </div>
  )
}

export default Counter
```

## src/pages/Home.tsx

```typescript
import React from 'react'
import Counter from '../components/Counter'

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Counter />
    </div>
  )
}

export default Home
```

## src/pages/About.tsx

```typescript
import React from 'react'

const About: React.FC = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a React TypeScript application with Vite, Redux, and React Router.</p>
    </div>
  )
}

export default About
```

## src/components/Navigation.tsx

```typescript
import React from 'react'
import { Link } from 'react-router-dom'

const Navigation: React.FC = () => {
  return (
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
  )
}

export default Navigation
```

## src/App.tsx

```typescript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
```

## src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
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
  -webkit-text-size-adjust: 100%;
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
  color: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
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
```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React TypeScript Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/__tests__/Counter.test.tsx

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Counter from '../components/Counter'
import counterReducer from '../store/slices/counterSlice'

const createTestStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
  })
}

describe('Counter', () => {
  it('renders initial count', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    )
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments count when increment button is clicked', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    )
    
    const incrementButton = screen.getByLabelText('Increment value')
    fireEvent.click(incrementButton)
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('decrements count when decrement button is clicked', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    )
    
    const decrementButton = screen.getByLabelText('Decrement value')
    fireEvent.click(decrementButton)
    
    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  it('increments by 5 when +5 button is clicked', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    )
    
    const incrementBy5Button = screen.getByText('+5')
    fireEvent.click(incrementBy5Button)
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
```

## CLI Commands Documentation

### Development Commands

**`npm run dev`**
Starts the development server with hot module replacement. The application will be available at `http://localhost:5173` by default.

**`npm run build`**
Builds the application for production. First runs TypeScript compilation, then creates optimized production bundles in the `dist` directory.

**`npm run preview`**
Serves the production build locally for testing purposes. Must run `npm run build` first.

### Code Quality Commands

**`npm run lint`**
Runs ESLint to check for code quality issues, TypeScript errors, and React-specific problems. Reports unused disable directives and fails on any warnings.

### Testing Commands

**`npm test`**
Runs all tests in watch mode using Vitest. Tests will re-run automatically when files change.

**`npm run test:ui`**
Launches Vitest's web-based UI for interactive test running and debugging.

**`npm run test:coverage`**
Runs all tests and generates a coverage report showing which parts of the codebase are tested.

### Installation

```bash
npm install
```

Installs all project dependencies as specified in package.json.

### Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to `http://localhost:5173`
4. Run tests: `npm test`

### Tokens: {'input_tokens': 292, 'output_tokens': 3897}
### Execution time: 37.899010181427
