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
Below is a complete project configuration that meets the requirements. The file structure is as follows:

Project Root
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src
    ├── index.tsx
    ├── App.tsx
    ├── router
    │   └── AppRouter.tsx
    ├── pages
    │   ├── Home.tsx
    │   └── About.tsx
    └── store
        ├── index.ts
        └── slices
            └── counterSlice.ts

Below are the complete code files:

──────────────────────────────
File: package.json
──────────────────────────────
{
  "name": "vite-react-ts-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.10.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@types/node": "^18.11.0",
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^4.9.0",
    "vite": "^4.0.0",
    "vitest": "^0.30.0",
    "jsdom": "^21.1.0"
  }
}
──────────────────────────────
File: tsconfig.json
──────────────────────────────
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
──────────────────────────────
File: tsconfig.node.json
──────────────────────────────
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowJs": true,
    "checkJs": false
  },
  "include": ["vite.config.ts"]
}
──────────────────────────────
File: vite.config.ts
──────────────────────────────
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
──────────────────────────────
File: README.md
──────────────────────────────
# Vite React TypeScript App

## Available CLI Commands

• npm run dev  
  Launches the development server with hot module replacement.

• npm run build  
  Bundles the application for production.

• npm run preview  
  Serves the production build locally for preview and verification.

• npm run test  
  Executes the test suite using Vitest.

This project uses Vite as the build tool, React with TypeScript for the UI, Redux for state management, and React Router for navigation. Vitest and Testing Library are configured for testing.
──────────────────────────────
File: src/index.tsx
──────────────────────────────
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
──────────────────────────────
File: src/App.tsx
──────────────────────────────
import React from 'react';
import AppRouter from './router/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
──────────────────────────────
File: src/router/AppRouter.tsx
──────────────────────────────
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default AppRouter;
──────────────────────────────
File: src/pages/Home.tsx
──────────────────────────────
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">Go to About</Link>
    </div>
  );
}

export default Home;
──────────────────────────────
File: src/pages/About.tsx
──────────────────────────────
import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default About;
──────────────────────────────
File: src/store/index.ts
──────────────────────────────
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
──────────────────────────────
File: src/store/slices/counterSlice.ts
──────────────────────────────
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
──────────────────────────────

This project configuration is production-ready and follows modern development conventions.

### Tokens: {'input_tokens': 275, 'output_tokens': 3525, 'reasoning_tokens': 1984}
### Execution time: 36.893548011779785
