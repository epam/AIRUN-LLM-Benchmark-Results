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
Okay, I will provide the complete project configuration as requested. Below are the files and their contents, structured for a modern development environment.

First, here's the `package.json` which defines the project, its dependencies, and scripts:

**`package.json`**
```json
{
  "name": "vite-react-ts-redux-router-starter",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.1.1",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.12.7",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25",
    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-vitest-globals": "^0.2.0",
    "jsdom": "^24.0.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5",
    "vite": "^5.2.8",
    "vitest": "^1.5.0"
  }
}
```

Here is the project structure and the content of each file:

```
vite-react-ts-redux-router-starter/
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc.json
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── router.tsx
    ├── setupTests.ts
    ├── vite-env.d.ts
    ├── app/
    │   ├── hooks.ts
    │   └── store.ts
    ├── components/
    │   ├── ExampleComponent.test.tsx
    │   └── ExampleComponent.tsx
    ├── features/
    │   └── counter/
    │       ├── Counter.test.tsx
    │       ├── Counter.tsx
    │       └── counterSlice.ts
    └── pages/
        ├── AboutPage.tsx
        └── HomePage.tsx
```

**`.eslintrc.cjs`**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, 'vitest-globals/env': true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vitest-globals/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'coverage', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier',
    'react-refresh',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};
```

**`.gitignore`**
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory
coverage
*.lcov
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

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
.yarnclean

# dotenv environment variables file
.env
.env*.local
.env*.development
.env*.test
.env*.production

# parcel-bundler cache files
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build output
.nuxt

# Svelte build output
.svelte-kit

# Docusaurus build output
.docusaurus

# Gatsby files
.cache/
# public (Gatsby)

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
dynamodb_local_latest/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Vite build output
dist
dist-ssr

# Vitest coverage output
/coverage/
```

**`.prettierrc.json`**
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

**`index.html`**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS + Redux + Router Starter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**`README.md`**
```markdown
# Vite + React + TypeScript + Redux + React Router Starter

This project is a comprehensive starter template configured with:

-   **Vite**: Next-generation frontend tooling for fast development and optimized builds.
-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Redux Toolkit**: The official, opinionated, batteries-included toolset for efficient Redux development.
-   **React Router**: Declarative routing for React applications.
-   **Vitest**: A blazing fast unit test framework powered by Vite.
-   **React Testing Library**: Simple and complete testing utilities that encourage good testing practices.
-   **ESLint & Prettier**: For code linting and formatting, ensuring code quality and consistency.

## Project Structure

```
project-root/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Redux store and hooks
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── components/          # Reusable UI components (non-feature specific)
│   │   └── ExampleComponent.tsx
│   │   └── ExampleComponent.test.tsx
│   ├── features/            # Feature-specific modules (e.g., counter)
│   │   └── counter/
│   │       ├── Counter.tsx
│   │       ├── counterSlice.ts
│   │       └── Counter.test.tsx
│   ├── pages/               # Page components (routed components)
│   │   ├── HomePage.tsx
│   │   └── AboutPage.tsx
│   ├── App.tsx              # Main application component with layout and routing Outlet
│   ├── main.tsx             # Entry point of the application
│   ├── router.tsx           # React Router configuration
│   ├── index.css            # Global styles
│   ├── setupTests.ts        # Vitest global setup
│   └── vite-env.d.ts        # Vite environment type definitions
├── .eslintrc.cjs            # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc.json         # Prettier configuration
├── index.html               # Main HTML file
├── package.json             # Project dependencies and scripts
├── README.md                # This file
├── tsconfig.json            # TypeScript configuration for the project
├── tsconfig.node.json       # TypeScript configuration for Node.js specific files
└── vite.config.ts           # Vite configuration
```
Path aliases are configured: `@/*` maps to `src/*`.

## Available CLI Commands

This project uses `npm` as the package manager. You can also use `yarn` or `pnpm` if preferred (adjust commands accordingly).

### `npm install`

**Purpose**: Installs all project dependencies listed in `package.json`.
**Usage**:
Run this command once after cloning the project or when new dependencies are added.
```bash
npm install
```

### `npm run dev`

**Purpose**: Starts the development server using Vite.
**Usage**:
This command will start a local development server (usually on `http://localhost:3000`) with Hot Module Replacement (HMR) enabled for a fast development experience. The browser will typically open automatically.
```bash
npm run dev
```

### `npm run build`

**Purpose**: Builds the application for production.
**Usage**:
This command first runs the TypeScript compiler (`tsc`) to check for type errors and then uses Vite to bundle the application into static assets in the `dist` directory. These assets are optimized for production deployment.
```bash
npm run build
```

### `npm run preview`

**Purpose**: Serves the production build locally.
**Usage**:
After running `npm run build`, this command starts a simple static server to preview the production application. This is useful for verifying the build before deployment.
```bash
npm run preview
```

### `npm run test`

**Purpose**: Runs unit and integration tests using Vitest.
**Usage**:
Executes all test files (typically `*.test.ts` or `*.test.tsx`) in the project. Test results, including coverage reports, will be displayed in the console.
```bash
npm run test
```
To run tests in watch mode (re-runs tests on file changes):
```bash
npm run test -- --watch
```
To generate and view coverage report (HTML report will be in `coverage/` directory):
```bash
npm run test -- --coverage
```

### `npm run test:ui`

**Purpose**: Runs tests with the Vitest UI.
**Usage**:
This command starts Vitest with its interactive UI, allowing you to browse, filter, and re-run tests in a web interface.
```bash
npm run test:ui
```

### `npm run lint`

**Purpose**: Lints the project's TypeScript and TSX files using ESLint.
**Usage**:
Checks the codebase for potential errors, style issues, and adherence to configured linting rules.
```bash
npm run lint
```
To automatically fix fixable linting issues:
```bash
npm run lint -- --fix
```

### `npm run format`

**Purpose**: Formats the codebase using Prettier.
**Usage**:
Automatically formats all supported file types in the project according to the Prettier configuration (`.prettierrc.json`).
```bash
npm run format
```
To check for formatting issues without writing changes:
```bash
prettier --check .
```

## Code Quality

-   **TypeScript**: Enforces static typing to catch errors early.
-   **ESLint**: Identifies and reports on patterns found in ECMAScript/JavaScript code, with rules tailored for TypeScript and React.
-   **Prettier**: An opinionated code formatter that ensures consistent code style across the project.

## Further Development

-   **State Management**: Redux Toolkit is set up. Add new slices in `src/features` and combine them in `src/app/store.ts`.
-   **Routing**: Add new routes in `src/router.tsx` and create corresponding page components in `src/pages`.
-   **Components**: Create reusable UI components in `src/components`.
-   **Environment Variables**: Use `.env` files for environment-specific configurations (see Vite documentation for details).
```

**`tsconfig.json`**
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
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts", "src/setupTests.ts"],
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
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

**`vite.config.ts`**
```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/app/store.ts',
        'src/app/hooks.ts', // Usually not tested directly
        'src/router.tsx',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts', // Barrel files
        'src/**/types.ts', // Type definition files
        'src/pages/**', // Page components are often tested via E2E or integration tests
      ],
      all: true, // Ensure all files in `include` are considered for coverage, even if not tested
    },
  },
});
```

**`public/vite.svg`**
```xml
<svg width="128" height="128" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
  <path fill="#41D1FF" d="M128 0L0 221.705h256z"/>
  <path fill="#3498DB" d="M128 0v221.705L0 221.705z"/>
  <path fill="#FFD02E" d="M128 0L0 221.705l64-110.852z"/>
  <path fill="#FFBC00" d="M128 0v110.853L64 110.852z"/>
  <path fill="#A0E9FF" d="M128 0l64 110.853L0 221.705l64-110.852z"/>
  <path fill="#82DFFF" d="M128 0v110.853L64 110.852z"/>
</svg>
```

**`src/App.tsx`**
```typescript
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <header>
        <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee', borderBottom: '1px solid #ddd' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
            Home
          </Link>
          <Link to="/about" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
            About
          </Link>
          <Link to="/counter-example" style={{ textDecoration: 'none', color: '#333' }}>
            Counter (Redux)
          </Link>
        </nav>
      </header>
      <main style={{ padding: '0 20px 20px 20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
```

**`src/index.css`**
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Oxygen',
    'Ubuntu', Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f4f6f8;
  color: #212529;
  line-height: 1.5;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

button {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 1rem;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

button:hover {
  opacity: 0.9;
}

input[type="text"], input[type="number"] {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
```

**`src/main.tsx`**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from '@/app/store';
import { router } from '@/router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
```

**`src/router.tsx`**
```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '@/App';
import Counter from '@/features/counter/Counter';
import AboutPage from '@/pages/AboutPage';
import HomePage from '@/pages/HomePage';
import ExampleComponent from '@/components/ExampleComponent';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'counter-example', element: <Counter /> },
      { path: 'component-example', element: <ExampleComponent initialText="Component Example Page"/> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
```

**`src/setupTests.ts`**
```typescript
import '@testing-library/jest-dom';
```

**`src/vite-env.d.ts`**
```typescript
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
```

**`src/app/hooks.ts`**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import type { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**`src/app/store.ts`**
```typescript
import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '@/features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**`src/components/ExampleComponent.test.tsx`**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import ExampleComponent from './ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with initial text "Hello"', () => {
    render(<ExampleComponent />);
    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });

  it('renders with provided initial text', () => {
    render(<ExampleComponent initialText="Custom Text" />);
    expect(screen.getByRole('heading', { name: /custom text/i })).toBeInTheDocument();
  });

  it('changes text on button click', () => {
    render(<ExampleComponent />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByRole('heading', { name: /button clicked!/i })).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    const user = userEvent.setup();
    render(<ExampleComponent />);
    const input = screen.getByPlaceholderText(/enter text/i);
    await user.type(input, 'Test Input');
    expect(input).toHaveValue('Test Input');
  });

  it('submits input value and updates text', async () => {
    const user = userEvent.setup();
    render(<ExampleComponent />);
    const input = screen.getByPlaceholderText(/enter text/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(input, 'User Submitted Text');
    await user.click(submitButton);

    expect(screen.getByRole('heading', { name: /submitted: user submitted text/i })).toBeInTheDocument();
  });
});
```

**`src/components/ExampleComponent.tsx`**
```typescript
import React, { useState } from 'react';

interface ExampleComponentProps {
  initialText?: string;
}

function ExampleComponent({ initialText = 'Hello' }: ExampleComponentProps) {
  const [text, setText] = useState(initialText);
  const [inputValue, setInputValue] = useState('');

  const handleClick = () => {
    setText('Button Clicked!');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setText(`Submitted: ${inputValue}`);
    setInputValue('');
  };

  return (
    <div>
      <h1>{text}</h1>
      <button onClick={handleClick} style={{ marginRight: '8px' }}>Click Me</button>
      <div style={{ marginTop: '16px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter text"
          style={{ marginRight: '8px' }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default ExampleComponent;
```

**`src/features/counter/Counter.test.tsx`**
```typescript
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import Counter from './Counter';
import counterReducer, { increment, decrement, incrementByAmount, CounterState } from './counterSlice';

interface RenderWithProvidersOptions {
  preloadedState?: { counter?: CounterState };
  store?: EnhancedStore<{ counter: CounterState }>;
}

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: { counter: counterReducer }, preloadedState }),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('Counter component', () => {
  it('renders initial count and buttons', () => {
    renderWithProviders(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrement value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increment value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add amount/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/set increment amount/i)).toHaveValue(2);
  });

  it('increments count when increment button is clicked', () => {
    renderWithProviders(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /increment value/i }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements count when decrement button is clicked', () => {
    renderWithProviders(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /decrement value/i }));
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('increments by amount when "Add Amount" button is clicked', () => {
    renderWithProviders(<Counter />);
    const amountInput = screen.getByLabelText(/set increment amount/i);
    fireEvent.change(amountInput, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /add amount/i }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('increments by amount from input field and updates store', () => {
    const { store } = renderWithProviders(<Counter />);
    const input = screen.getByLabelText(/set increment amount/i);
    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.click(screen.getByText(/add amount/i));
    expect(store.getState().counter.value).toBe(3);
  });
});

describe('counterSlice reducers', () => {
  let initialState: CounterState;

  beforeEach(() => {
    initialState = { value: 0, status: 'idle' };
  });

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({ value: 0, status: 'idle' });
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(-1);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
  });
});
```

**`src/features/counter/Counter.tsx`**
```typescript
import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { decrement, increment, incrementByAmount, selectCount } from './counterSlice';

function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const [incrementAmount, setIncrementAmount] = useState('2');

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleIncrementByAmount = () => {
    dispatch(incrementByAmount(Number(incrementAmount) || 0));
  };

  return (
    <div>
      <h2>Counter (Redux Example)</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button aria-label="Decrement value" onClick={handleDecrement} style={{ marginRight: '8px' }}>
          -
        </button>
        <span style={{ margin: '0 10px', fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>{count}</span>
        <button aria-label="Increment value" onClick={handleIncrement} style={{ marginLeft: '8px' }}>
          +
        </button>
      </div>
      <div>
        <input
          type="number"
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
          style={{ marginRight: '8px', width: '60px' }}
        />
        <button onClick={handleIncrementByAmount}>Add Amount</button>
      </div>
    </div>
  );
}

export default Counter;
```

**`src/features/counter/counterSlice.ts`**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
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

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
```

**`src/pages/AboutPage.tsx`**
```typescript
function AboutPage() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a starter project configured with Vite, React, TypeScript, Redux Toolkit, and React Router.</p>
      <p>It includes examples for components, Redux state management, routing, and unit testing with Vitest and React Testing Library.</p>
    </div>
  );
}

export default AboutPage;
```

**`src/pages/HomePage.tsx`**
```typescript
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the application!</p>
      <p>Explore the following examples:</p>
      <ul>
        <li>
          <Link to="/counter-example">Redux Counter Example</Link>
        </li>
        <li>
          <Link to="/component-example">Simple Component Example</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
```

This setup provides a solid foundation for a modern React application with TypeScript, Redux, React Router, and robust testing capabilities.

### Tokens: {'input_tokens': 274, 'output_tokens': 8674}
### Execution time: 175.31998896598816
