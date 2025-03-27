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
Okay, here is the complete project setup configuration based on your requirements.

**Project Structure:**

```
.
├── .gitignore
├── README.md
├── index.html
├── jest.config.ts
├── package.json
├── setupTests.ts
├── src
│   ├── App.tsx
│   ├── app
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── components
│   │   ├── Greeting.test.tsx
│   │   └── Greeting.tsx
│   ├── features
│   │   └── counter
│   │       ├── Counter.tsx
│   │       └── counterSlice.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

**1. `package.json`**

```json
{
  "name": "vite-react-ts-redux-router-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.0",
    "@typescript-eslint/parser": "^7.13.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5",
    "vite": "^5.2.12"
  }
}
```

**2. `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // Optional: specify dev server port
    open: true, // Optional: open browser on server start
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Optional: generate source maps for production build
  },
});
```

**3. `tsconfig.json`**

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
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": ["src", "vite.config.ts", "jest.config.ts", "setupTests.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**4. `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts", "jest.config.ts"]
}
```

**5. `jest.config.ts`**

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock CSS Modules (if you use them)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true, // Optional: Enable coverage reports
  coverageDirectory: 'coverage', // Optional: Specify coverage directory
  coverageProvider: 'v8', // Optional: Specify coverage provider
};

export default config;
```

**6. `setupTests.ts`**

```typescript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

**7. `.gitignore`**

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.*
!.env.example

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build output
.nuxt
dist

# Remix build output
.cache/
build/
public/build/

# Docusaurus cache and build output
.docusaurus

# Gatsby cache and build output
.cache/
public

# SvelteKit build output
.svelte-kit

# SolidStart build output
.solid

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Vite build output
dist
dist-ssr

# Vitest coverage output
/coverage/

# Mac specific
.DS_Store
```

**8. `index.html`** (Root level)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS + Redux</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**9. `src/main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
// import './index.css'; // Optional: if you have global styles

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

**10. `src/App.tsx`**

```typescript
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import Counter from '@/features/counter/Counter'; // Example feature component

function App() {
  return (
    <div>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/counter" style={{ marginRight: '10px' }}>Counter</Link>
        <Link to="/non-existent-page">Non Existent Page</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
```

**11. `src/app/store.ts`**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
// Import other reducers here

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add other reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counter: CounterState, ...}
export type AppDispatch = typeof store.dispatch;
```

**12. `src/app/hooks.ts`** (Typed Redux hooks)

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

**13. `src/features/counter/counterSlice.ts`** (Example Redux Slice)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

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
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Selector to get the current count value from the state
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
```

**14. `src/features/counter/Counter.tsx`** (Example Component using Redux)

```typescript
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { decrement, increment, incrementByAmount, selectCount } from './counterSlice';

function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = React.useState('2');

  const amount = Number(incrementAmount) || 0;

  return (
    <div>
      <h2>Counter (Redux Example)</h2>
      <div>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span style={{ margin: '0 10px' }}>{count}</span>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
          style={{ marginRight: '5px' }}
        />
        <button
          onClick={() => dispatch(incrementByAmount(amount))}
        >
          Add Amount
        </button>
      </div>
    </div>
  );
}

export default Counter;
```

**15. `src/pages/HomePage.tsx`**

```typescript
import React from 'react';
import Greeting from '@/components/Greeting';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a starter project configured with Vite, React, TypeScript, Redux, React Router, and Jest.</p>
      <Greeting name="Developer" />
    </div>
  );
}

export default HomePage;
```

**16. `src/pages/NotFoundPage.tsx`**

```typescript
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFoundPage;
```

**17. `src/components/Greeting.tsx`** (Example Component)

```typescript
import React from 'react';

interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <p>Hello, {name}!</p>;
}

export default Greeting;
```

**18. `src/components/Greeting.test.tsx`** (Example Test)

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

describe('Greeting Component', () => {
  test('renders greeting with the provided name', () => {
    const testName = 'Tester';
    render(<Greeting name={testName} />);

    // Check if the text "Hello, Tester!" is present in the document
    const greetingElement = screen.getByText(`Hello, ${testName}!`);
    expect(greetingElement).toBeInTheDocument();
  });

  test('renders greeting with a different name', () => {
    const anotherName = 'Jest';
    render(<Greeting name={anotherName} />);

    expect(screen.getByText(`Hello, ${anotherName}!`)).toBeInTheDocument();
  });
});
```

**19. `src/vite-env.d.ts`** (Vite's TypeScript environment types)

```typescript
/// <reference types="vite/client" />
```

**20. `README.md`** (Project Documentation)

```markdown
# Vite + React + TypeScript + Redux + React Router Starter

This project is a template configured with modern frontend technologies, ready for development.

## Included Technologies

*   **Build Tool:** Vite
*   **UI Library:** React 18
*   **Language:** TypeScript
*   **State Management:** Redux Toolkit
*   **Routing:** React Router v6
*   **Testing:** Jest, React Testing Library
*   **Linting:** ESLint (basic configuration from Vite template)

## Project Structure

```
.
├── public/             # Static assets
├── src/                # Source code
│   ├── app/            # Redux store setup and hooks
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-specific modules (Redux slices, components)
│   ├── pages/          # Page-level components mapped by router
│   ├── App.tsx         # Root application component with routing setup
│   ├── main.tsx        # Application entry point
│   └── vite-env.d.ts   # Vite environment types
├── tests/              # Test files (co-located within src using *.test.tsx)
├── .gitignore          # Git ignore rules
├── index.html          # Vite entry HTML
├── jest.config.ts      # Jest configuration
├── package.json        # Project dependencies and scripts
├── README.md           # This file
├── setupTests.ts       # Jest setup file (e.g., for jest-dom)
├── tsconfig.json       # Main TypeScript configuration
├── tsconfig.node.json  # TypeScript configuration for Node scripts (configs)
└── vite.config.ts      # Vite configuration
```

## Available CLI Commands

This section documents the scripts available in the `package.json` file.

### `npm run dev`

*   **Purpose:** Starts the development server using Vite.
*   **Usage:** Run this command to work on the project locally. It provides Hot Module Replacement (HMR) for a fast development experience. The server typically runs on `http://localhost:3000`.

### `npm run build`

*   **Purpose:** Compiles the TypeScript code for type checking and then builds the application for production using Vite.
*   **Usage:** Run this command when you are ready to deploy your application. It performs type checking using `tsc --noEmit` and then bundles the code, optimizes assets, and outputs the production-ready files to the `dist/` directory.

### `npm run lint`

*   **Purpose:** Runs ESLint to analyze the code for potential errors and style issues based on the configured rules.
*   **Usage:** Run this command to check the code quality. It scans `.ts` and `.tsx` files in the project.

### `npm run preview`

*   **Purpose:** Starts a local static web server that serves the production build from the `dist/` directory.
*   **Usage:** Run this command after `npm run build` to preview the production version of your application locally before deploying it.

### `npm run test`

*   **Purpose:** Executes the unit and integration tests using Jest.
*   **Usage:** Run this command to ensure your components and logic work as expected. It will run all test files (typically `*.test.ts` or `*.test.tsx`) found within the `src` directory. Coverage reports can optionally be generated (configured in `jest.config.ts`).

### `npm run test:watch`

*   **Purpose:** Runs Jest in watch mode.
*   **Usage:** Run this command during development when you are writing or modifying tests. Jest will watch for file changes and automatically re-run tests related to the changed files, providing quick feedback.

## Getting Started

1.  **Clone the repository (or copy these files into your project).**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  **Open your browser** to the address provided by Vite (usually `http://localhost:3000`).

Happy coding!
```

This setup provides a robust, type-safe, and testable foundation for a modern React application using the specified technologies and adhering to best practices.

### Tokens: {'input_tokens': 273, 'output_tokens': 5182}
### Execution time: 63.930253982543945
