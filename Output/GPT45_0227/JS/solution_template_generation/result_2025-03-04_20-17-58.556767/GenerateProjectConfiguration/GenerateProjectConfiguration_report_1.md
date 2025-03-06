Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
### Step 1: Initialize the project using Vite with React and TypeScript

Run the following command to initialize the project:

```bash
npm create vite@latest my-react-app -- --template react-ts
```

Navigate into the project directory:

```bash
cd my-react-app
```

### Step 2: Install dependencies

Install React Router, Redux Toolkit, React Redux, and testing libraries:

```bash
npm install react-router-dom @reduxjs/toolkit react-redux
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Step 3: Configure scripts and testing environment in `package.json`

Replace your `package.json` with the following configuration:

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.21.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "jsdom": "^22.1.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "vitest": "^1.2.2"
  }
}
```

### Step 4: Configure Vite and Vitest

Create or update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts'
  }
});
```

Create `tsconfig.json`:

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
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `src/setupTests.ts`:

```typescript
import '@testing-library/jest-dom';
```

### Step 5: Setup Redux store

Create `src/app/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Create `src/app/hooks.ts`:

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Create `src/features/counter/counterSlice.ts`:

```typescript
import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

### Step 6: Setup React Router and Redux Provider

Update `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

Update `src/App.tsx`:

```typescript
import { Routes, Route, Link } from 'react-router-dom';
import Counter from './features/counter/Counter';

function Home() {
  return <h2>Home Page</h2>;
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/counter">Counter</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </div>
  );
}

export default App;
```

Create `src/features/counter/Counter.tsx`:

```typescript
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { increment, decrement } from './counterSlice';

function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### Step 7: Example test file

Create `src/App.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';

test('renders navigation links', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Counter/i)).toBeInTheDocument();
});

test('navigates to counter page and increments counter', async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  await userEvent.click(screen.getByText(/Counter/i));
  expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Increment/i));
  expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();
});
```

### Commands Explanation:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Serves the production build locally.
- `npm run test`: Runs the tests using Vitest.

### Tokens: {'input_tokens': 132, 'output_tokens': 1810, 'reasoning_tokens': 0}
### Execution time: 61.97832012176514
