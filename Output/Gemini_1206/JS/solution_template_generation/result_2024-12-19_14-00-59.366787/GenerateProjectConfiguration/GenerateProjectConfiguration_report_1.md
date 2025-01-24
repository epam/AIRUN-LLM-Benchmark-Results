Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Okay, I will help you set up a Vite project with React, Redux, React-Router, TypeScript, and testing library support.

Here's the breakdown of the commands, the `package.json` file, and the basic project structure:

**Commands:**

*   **`npm create vite@latest my-react-app -- --template react-ts`**

    *   This command uses `npm create` (a package runner) to initialize a new project using the `vite` build tool.
    *   `my-react-app` is the name of your project directory. You can change it to whatever you like.
    *   `-- --template react-ts` tells Vite to use the React and TypeScript template.
*   **`cd my-react-app`**

    *   Navigates into your newly created project directory.
*   **`npm install`**

    *   Installs all the dependencies specified in the `package.json` file that was created by the Vite template.
*   **`npm install react-router-dom @reduxjs/toolkit react-redux @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`**

    *   Installs the additional packages we need:
        *   `react-router-dom`: For routing and navigation.
        *   `@reduxjs/toolkit`: For efficient Redux development.
        *   `react-redux`: React bindings for Redux.
        *   `@testing-library/react`: For testing React components.
        *   `@testing-library/jest-dom`: Provides custom matchers to extend Jest's assertion capabilities.
        *   `@testing-library/user-event`: Simulates user interactions for more realistic testing.
        *   `jsdom`: A JavaScript implementation of the DOM, necessary for testing in a Node.js environment.
*   **`npm run dev`**

    *   Starts the development server. You can view your app in the browser (usually at `http://localhost:5173/`).
*   **`npm run build`**

    *   Builds your app for production, creating optimized files in the `dist` directory.
*   **`npm run test`**

    *   Runs your tests using Jest and the testing libraries.

**package.json:**

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.21.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.6",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.11",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jsdom": "^23.2.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

**Project Structure:**

```
my-react-app/
├── index.html
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── components/
│   │   └── Counter.tsx
│   ├── main.tsx
│   ├── redux/
│   │   ├── store.ts
│   │   └── rootReducer.ts
│   │   └── slices/
│   │       └── counterSlice.ts
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── vite-env.d.ts
│   └── __tests__/
│       └── components/
│           └── Counter.test.tsx
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

**File Contents:**

**index.html:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**src/App.css:**

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

**src/App.tsx:**

```tsx
import { Provider } from 'react-redux';
import store from './redux/store';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
```

**src/components/Counter.tsx:**

```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../redux/slices/counterSlice';

const Counter: React.FC = () => {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Counter;
```

**src/main.tsx:**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**src/redux/slices/counterSlice.ts:**

```ts
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
```

**src/redux/rootReducer.ts:**

```ts
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
```

**src/redux/store.ts:**

```ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
```

**src/routes/AppRoutes.tsx:**

```tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Counter from '../components/Counter';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Counter />} />
    </Routes>
  );
};

export default AppRoutes;
```

**src/vite-env.d.ts:**

```ts
/// <reference types="vite/client" />
```

**tsconfig.json:**

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

**tsconfig.node.json:**

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

**vite.config.ts:**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

**src/setupTests.ts:**

```ts
import '@testing-library/jest-dom';
```

**src/\_\_tests\_\_/components/Counter.test.tsx:**

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Counter from '../../components/Counter';

const mockStore = configureStore([]);

describe('Counter Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      counter: {
        value: 0,
      },
    });
  });

  it('renders initial count', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  it('increments count on button click', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByText('Increment'));
    const actions = store.getActions();
    expect(actions[0].type).toBe('counter/increment');
  });

  it('decrements count on button click', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByText('Decrement'));
    const actions = store.getActions();
    expect(actions[0].type).toBe('counter/decrement');
  });
});
```

Now you can run `npm run dev` to start the development server and `npm run test` to run your tests. Let me know if you have any other questions.


### Tokens: {'input_tokens': 126, 'output_tokens': 2989}
### Execution time: 70.72736382484436
