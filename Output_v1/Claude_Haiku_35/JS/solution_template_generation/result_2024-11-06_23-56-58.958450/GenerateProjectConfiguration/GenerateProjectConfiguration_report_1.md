Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
I'll help you set up a Vite project with React, Redux, React Router, TypeScript, and testing library. Here's a comprehensive project configuration:

Project Structure:
```
project-root/
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── store/
    │   ├── index.ts
    │   └── store.ts
    ├── routes/
    │   └── index.tsx
    └── types/
        └── index.ts
```

1. package.json:
```json
{
  "name": "vite-react-redux-typescript-starter",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "@typescript-eslint/eslint-plugin": "^5.61.0",
    "@typescript-eslint/parser": "^5.61.0",
    "@vitejs/plugin-react": "^4.0.1",
    "@vitest/coverage-v8": "^0.32.2",
    "eslint": "^8.44.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.1",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.0",
    "vitest": "^0.32.2"
  }
}
```

2. vite.config.ts:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

3. tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

4. tsconfig.node.json:
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

5. .eslintrc.cjs:
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

6. index.html:
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

7. src/main.tsx:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import App from './App'

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

8. src/App.tsx:
```typescript
import React from 'react'
import Routes from './routes'

const App: React.FC = () => {
  return <Routes />
}

export default App
```

9. src/routes/index.tsx:
```typescript
import React from 'react'
import { Routes as RouterRoutes, Route } from 'react-router-dom'

const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home</div>} />
    </RouterRoutes>
  )
}

export default Routes
```

10. src/store/store.ts:
```typescript
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

11. src/store/index.ts:
```typescript
export * from './store'
```

Commands Description:
- `npm run dev`: Starts the development server
- `npm run build`: Compiles TypeScript and builds the production version
- `npm run preview`: Previews the production build
- `npm run test`: Runs unit tests
- `npm run test:coverage`: Runs tests with coverage report
- `npm run lint`: Runs ESLint to check code quality

This configuration provides a robust setup for a React application with TypeScript, Redux, React Router, and testing capabilities using Vite as the build tool.

### Tokens: {'input_tokens': 140, 'output_tokens': 1972}
### Execution time: 30.271748781204224
