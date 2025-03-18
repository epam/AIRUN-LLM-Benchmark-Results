Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
To set up and run the project, use the following commands:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Build the production bundle**:

   ```bash
   npm run build
   ```

4. **Run tests**:

   ```bash
   npm test
   ```

---

**package.json**:

```json
{
  "name": "vite-react-redux-router-typescript",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@types/jest": "^29.5.4",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^22.1.0",
    "typescript": "^5.2.2",
    "vite": "^4.4.9",
    "vitest": "^0.34.5"
  }
}
```

---

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

---

**index.html**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

**src/main.tsx**:

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
  </React.StrictMode>
);
```

---

**src/App.tsx**:

```tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
```

---

**src/pages/Home.tsx**:

```tsx
import React from 'react';

function Home() {
  return <h1>Home Page</h1>;
}

export default Home;
```

---

**src/pages/About.tsx**:

```tsx
import React from 'react';

function About() {
  return <h1>About Page</h1>;
}

export default About;
```

---

**src/store/index.ts**:

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

**src/vite-env.d.ts**:

```typescript
/// <reference types="vite/client" />
```

---

**src/tests/App.test.tsx**:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { store } from '../store';
import { BrowserRouter } from 'react-router-dom';

test('renders navigation links', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/About/i)).toBeInTheDocument();
});
```

---

**.gitignore**:

```
node_modules
dist
.vite
```

---

**Directory Structure**:

```
vite-react-redux-router-typescript/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── src
    ├── main.tsx
    ├── App.tsx
    ├── vite-env.d.ts
    ├── store
    │   └── index.ts
    ├── pages
    │   ├── Home.tsx
    │   └── About.tsx
    └── tests
        └── App.test.tsx
```

### Tokens: {'input_tokens': 95, 'output_tokens': 3336, 'reasoning_tokens': 2048}
### Execution time: 45.01711082458496
