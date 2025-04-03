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
# React TypeScript Project Starter with Vite, Redux, and React Router

Here's a complete project configuration following your requirements:

## 1. Project Structure

```
my-react-app/
├── public/
├── src/
│   ├── app/
│   │   └── store.ts
│   ├── features/
│   ├── pages/
│   ├── routes/
│   │   └── Router.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

## 2. Configuration Files

### package.json

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.16.0",
    "@reduxjs/toolkit": "^1.9.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.49.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "prettier": "^3.0.3",
    "typescript": "^5.2.2",
    "vite": "^4.4.9",
    "vitest": "^0.34.3",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/user-event": "^14.5.1",
    "jsdom": "^22.1.0"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'istanbul'
    }
  }
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
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
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
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### .eslintrc.cjs

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
```

## 3. Core Application Files

### src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
```

### src/App.tsx

```typescript
import { Router } from './routes/Router'

function App() {
  return <Router />
}

export default App
```

### src/app/store.ts

```typescript
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### src/routes/Router.tsx

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home Page</div>,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}
```

### src/setupTests.ts

```typescript
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

## 4. Documentation

### Available CLI Commands

1. `npm run dev` - Starts the development server
   - Purpose: Run the app in development mode with hot module replacement
   - Usage: Primary command for development

2. `npm run build` - Builds the app for production
   - Purpose: Creates optimized production build
   - Usage: Run before deploying to production

3. `npm run preview` - Locally preview production build
   - Purpose: Test production build locally
   - Usage: Run after `build` to verify production build

4. `npm run test` - Runs unit tests
   - Purpose: Execute all test suites
   - Usage: Run during development or in CI pipeline

5. `npm run coverage` - Generates test coverage report
   - Purpose: Measure code coverage by tests
   - Usage: Run periodically to check test coverage

6. `npm run lint` - Runs ESLint
   - Purpose: Check code for style and quality issues
   - Usage: Run before commits or in CI pipeline

7. `npm run format` - Formats code with Prettier
   - Purpose: Maintain consistent code style
   - Usage: Run before commits to format code

## 5. Initial Setup Instructions

1. Create a new project folder and initialize it:
```bash
mkdir my-react-app
cd my-react-app
npm init -y
```

2. Install all dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

This configuration provides a complete, production-ready setup with:
- Vite for fast development and builds
- TypeScript for type safety
- React 18 with modern JSX transform
- Redux Toolkit for state management
- React Router v6 for navigation
- Vitest for testing with React Testing Library
- ESLint and Prettier for code quality
- Proper type definitions and path aliases

### Tokens: {'input_tokens': 269, 'output_tokens': 1915}
### Execution time: 57.00471496582031
