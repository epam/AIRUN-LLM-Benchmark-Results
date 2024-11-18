Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Here is the codebase for a Vite project configured with React, Redux, React-Router, TypeScript, and testing library:

### Commands:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build the project for production**:
   ```bash
   npm run build
   ```

4. **Preview the production build**:
   ```bash
   npm run preview
   ```

5. **Run tests**:
   ```bash
   npm run test
   ```

### `package.json`:

```json
{
  "name": "vite-react-redux-router-ts",
  "version": "1.0.0",
  "description": "A Vite project with React, Redux, React-Router, TypeScript, and testing library",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.3",
    "redux": "^4.2.0",
    "typescript": "^4.8.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.3",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@vitejs/plugin-react": "^2.1.0",
    "jest": "^29.2.1",
    "ts-jest": "^29.0.3",
    "typescript": "^4.8.4",
    "vite": "^3.2.3",
    "vitest": "^0.24.3"
  }
}
```

### `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

### `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
import './index.css';

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

### `src/App.tsx`:

```tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
```

### `src/pages/Home.tsx`:

```tsx
import React from 'react';

const Home: React.FC = () => {
  return <h1>Home Page</h1>;
};

export default Home;
```

### `src/pages/About.tsx`:

```tsx
import React from 'react';

const About: React.FC = () => {
  return <h1>About Page</h1>;
};

export default About;
```

### `src/store/index.ts`:

```ts
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

### `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom';
```

### `src/index.css`:

```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders Home page', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
});
```

This codebase provides a basic setup for a Vite project with React, Redux, React-Router, TypeScript, and testing library.

### Tokens: {'input_tokens': 132, 'output_tokens': 1084, 'reasoning_tokens': 0}
### Execution time: 10.765032768249512
