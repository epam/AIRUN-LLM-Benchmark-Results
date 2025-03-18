Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Below is a basic setup for a Vite project configured with React, Redux, React-Router, TypeScript, and a testing library. This setup includes a `package.json` file and the necessary commands to get started.

### package.json

```json
{
  "name": "vite-react-redux-router-ts",
  "version": "1.0.0",
  "description": "A Vite project with React, Redux, React-Router, TypeScript, and testing library support.",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.1",
    "redux": "^4.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@vitejs/plugin-react": "^3.0.0",
    "typescript": "^4.8.4",
    "vite": "^4.0.0",
    "vitest": "^0.25.8"
  }
}
```

### Commands Description

- **dev**: Starts the Vite development server, allowing you to work on your project with hot module replacement.
- **build**: Builds the project for production, outputting the files to the `dist` directory.
- **serve**: Serves the production build locally, useful for testing the production build.
- **test**: Runs the tests using Vitest, a Vite-native testing framework.

### Vite Configuration (vite.config.ts)

Create a `vite.config.ts` file in the root of your project:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  }
});
```

### TypeScript Configuration (tsconfig.json)

Create a `tsconfig.json` file in the root of your project:

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
  "include": ["src"]
}
```

### Project Structure

Create the following directory structure:

```
/src
  /components
  /redux
  /routes
  /tests
  App.tsx
  main.tsx
  setupTests.ts
```

### Example Files

- **src/main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

- **src/App.tsx**

```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  );
};

export default App;
```

- **src/redux/store.ts**

```typescript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

- **src/setupTests.ts**

```typescript
import '@testing-library/jest-dom';
```

This setup provides a basic structure to start developing a React application with Redux, React-Router, TypeScript, and testing capabilities using Vite.

### Tokens: {'input_tokens': 132, 'output_tokens': 991}
### Execution time: 9.381377696990967
