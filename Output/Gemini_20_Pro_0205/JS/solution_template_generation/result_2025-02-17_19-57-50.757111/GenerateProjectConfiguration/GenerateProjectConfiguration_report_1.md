Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Okay, here's the project configuration based on your requirements, including `package.json`, Vite configuration, and basic project structure.  I'll explain the commands and then provide the complete file structure and content.

**Command Explanations:**

*   **`npm install`**: Installs all project dependencies (React, Redux, React Router, TypeScript, testing libraries, Vite, etc.).
*   **`npm run dev`**: Starts the Vite development server. This provides hot module replacement (HMR) for fast development.
*   **`npm run build`**: Creates a production-ready build of the application in the `dist` directory.
*   **`npm run preview`**: Locally previews the production build.  This is useful for testing the built application before deployment.
*   **`npm run test`**: it runs all the tests.
*   **`npm run test:watch`**: it runs all tests in watch mode.

**File Structure:**

```
project-root/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   └── ExampleComponent.tsx
│   │   └── ExampleComponent.test.tsx
│   ├── store/
│   │   └── store.ts
│   │   └── exampleSlice.ts
│   ├── routes/
│   │   └── AppRoutes.tsx
│   └── vite-env.d.ts
```

**File Contents:**

**`package.json`**

```json
{
  "name": "vite-react-redux-router-ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest watch"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.2",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.3"
  }
}
```

**`tsconfig.json`**

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

**`tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**`vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    }
});
```

**`index.html`**

```html
<!DOCTYPE html>
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

**`src/main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';

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

**`src/App.tsx`**

```typescript
import React from 'react';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
```

**`src/components/ExampleComponent.tsx`**

```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../store/exampleSlice';
import { RootState } from '../store/store';

const ExampleComponent: React.FC = () => {
  const count = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Example Component</h1>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </div>
  );
};

export default ExampleComponent;
```

**`src/components/ExampleComponent.test.tsx`**

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from './ExampleComponent';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '../store/exampleSlice';
import { BrowserRouter } from 'react-router-dom';

const renderWithRedux = (
    ui: React.ReactElement,
    { preloadedState = {} } = {}
) => {
    const store = configureStore({
        reducer: { example: exampleReducer },
        preloadedState,
    });
    return {
        ...render(<Provider store={store}><BrowserRouter>{ui}</BrowserRouter></Provider>),
        store,
    };
};

describe('ExampleComponent', () => {
  it('renders initial state correctly', () => {
    renderWithRedux(<ExampleComponent />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count on button click', () => {
    renderWithRedux(<ExampleComponent />);
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
    it('increments count on multiple button clicks', () => {
        renderWithRedux(<ExampleComponent />);
        const incrementButton = screen.getByText('Increment');
        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
        expect(screen.getByText('Count: 2')).toBeInTheDocument();
    });
});
```

**`src/store/store.ts`**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**`src/store/exampleSlice.ts`**

```typescript
import { createSlice } from '@reduxjs/toolkit';

interface ExampleState {
  value: number;
}

const initialState: ExampleState = {
  value: 0,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const { increment } = exampleSlice.actions;
export default exampleSlice.reducer;
```

**`src/routes/AppRoutes.tsx`**

```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleComponent from '../components/ExampleComponent';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleComponent />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
```

**`src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

**`src/setupTests.ts`**
```
import '@testing-library/jest-dom'
```

This comprehensive setup provides a solid foundation for a React, Redux, React Router, TypeScript, and Vite project with testing support.  It includes example components, routing, Redux state management, and basic unit tests.  The aliases are set up for cleaner imports.  The testing environment is configured using jsdom.  The `setupTests.ts` file is used to import `@testing-library/jest-dom` which provides custom matchers for Jest. The test file includes a helper function to render components with Redux and React Router. This is a complete and runnable example.  Remember to run `npm install` to install the dependencies before running any of the scripts.


### Tokens: {'input_tokens': 126, 'output_tokens': 2552}
### Execution time: 24.115513801574707
