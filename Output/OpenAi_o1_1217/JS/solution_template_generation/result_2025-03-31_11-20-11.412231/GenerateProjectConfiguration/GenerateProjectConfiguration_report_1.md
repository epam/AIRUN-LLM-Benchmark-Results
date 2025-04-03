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
Below is a complete, minimal project structure meeting all requirements.

--------------------------------------------------------------------------------
package.json
--------------------------------------------------------------------------------
{
  "name": "vite-react-ts-redux-router-testing",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "@reduxjs/toolkit": "^1.9.5",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "vite": "^4.3.9",
    "@types/node": "^20.2.5",
    "@types/react": "^18.2.13",
    "@types/react-dom": "^18.2.5",
    "@types/react-redux": "^7.1.25",
    "@types/react-router-dom": "^5.3.3",
    "vitest": "^0.31.4",
    "@vitejs/plugin-react": "^4.0.1",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5"
  }
}

--------------------------------------------------------------------------------
tsconfig.json
--------------------------------------------------------------------------------
{
  "compilerOptions": {
    "target": "ESNext",
    "useUnknownInCatchVariables": false,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "esModuleInterop": true
  },
  "include": ["src"]
}

--------------------------------------------------------------------------------
vite.config.ts
--------------------------------------------------------------------------------
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom"
  }
});

--------------------------------------------------------------------------------
src/store.ts
--------------------------------------------------------------------------------
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

--------------------------------------------------------------------------------
src/features/counter/counterSlice.ts
--------------------------------------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;

--------------------------------------------------------------------------------
src/features/counter/Counter.tsx
--------------------------------------------------------------------------------
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { increment, decrement } from "./counterSlice";

export function Counter() {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.counter.value);
  return (
    <div>
      <div>{value}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

--------------------------------------------------------------------------------
src/App.tsx
--------------------------------------------------------------------------------
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Counter } from "./features/counter/Counter";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/counter">Counter</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </>
  );
}

--------------------------------------------------------------------------------
src/main.tsx
--------------------------------------------------------------------------------
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

--------------------------------------------------------------------------------
tests/App.test.tsx
--------------------------------------------------------------------------------
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "../src/App";
import { store } from "../src/store";

describe("App", () => {
  it("renders Home link", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});

--------------------------------------------------------------------------------
README.md
--------------------------------------------------------------------------------
Project Setup

1) Install dependencies:
   npm install

2) Development server:
   npm run dev
   Serves the application in development mode.

3) Production build:
   npm run build
   Creates an optimized production build.

4) Preview production build:
   npm run preview
   Serves the production build locally.

5) Run tests:
   npm test
   Executes all tests using Vitest.

### Tokens: {'input_tokens': 275, 'output_tokens': 2954, 'reasoning_tokens': 1664}
### Execution time: 42.69319200515747
