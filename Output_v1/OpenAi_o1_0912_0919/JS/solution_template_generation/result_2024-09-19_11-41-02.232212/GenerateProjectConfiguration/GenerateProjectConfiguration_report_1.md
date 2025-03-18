Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
**Description of the Provided Commands:**

- **dev**: Starts the development server using Vite.
- **build**: Builds the application for production.
- **preview**: Previews the production build locally.
- **test**: Runs the test suite using Vitest.
- **lint**: Lints the codebase using ESLint.
- **format**: Formats the code using Prettier.

---

**package.json:**

```json
{
  "name": "vite-react-redux-router-typescript-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@types/jest": "^29.1.2",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@vitejs/plugin-react": "^2.1.0",
    "eslint": "^8.25.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-react": "^7.31.8",
    "jest": "^29.2.1",
    "prettier": "^2.7.1",
    "typescript": "^4.8.4",
    "vite": "^3.2.0",
    "vitest": "^0.24.4"
  }
}
```

---

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

---

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

---

**.eslintrc.js:**

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
};
```

---

**.prettierrc:**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
```

---

**src/main.tsx:**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
```

---

**src/App.tsx:**

```tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
```

---

**src/pages/Home.tsx:**

```tsx
import React from 'react';

function Home() {
  return <h1>Home Page</h1>;
}

export default Home;
```

---

**src/store/index.ts:**

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

**src/setupTests.ts:**

```typescript
import '@testing-library/jest-dom';
```

---

**src/App.test.tsx:**

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

**index.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite React Redux Router TypeScript App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

**Directory Structure:**

```
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
└── src
    ├── App.test.tsx
    ├── App.tsx
    ├── main.tsx
    ├── setupTests.ts
    ├── store
    │   └── index.ts
    └── pages
        └── Home.tsx
```

---

This configuration sets up a project with Vite as the bundler, supporting React, Redux (with Redux Toolkit), React Router, TypeScript, and testing using Vitest and Testing Library. The ESLint and Prettier configurations are included for code linting and formatting.

### Tokens: {'input_tokens': 95, 'output_tokens': 3630, 'reasoning_tokens': 2112}
### Execution time: 33.299408197402954
