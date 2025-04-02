Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Here's a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and a testing library:

### package.json
```json
{
  "name": "vite-react-redux",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "redux": "^4.0.0",
    "react-redux": "^8.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^4.0.0",
    "vite-plugin-react": "^2.0.0",
    "vitest": "^0.1.0",
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.0.0"
  }
}
```

### Additional Files

1. **vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

2. **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

3. **src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';

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

4. **src/App.tsx**
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
);

export default App;
```

5. **src/store.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {},
});

export default store;
```

6. **src/test/App.test.tsx**
```typescript
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

test('renders home link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/home/i);
  expect(linkElement).toBeInTheDocument();
});
```

### Commands Description
- `dev`: Starts the development server with Vite.
- `build`: Compiles the application for production.
- `serve`: Serves the built application for previewing.
- `test`: Runs the test suite using Vitest.

### Tokens: {'input_tokens': 132, 'output_tokens': 811, 'reasoning_tokens': 0}
### Execution time: 11.267734050750732
