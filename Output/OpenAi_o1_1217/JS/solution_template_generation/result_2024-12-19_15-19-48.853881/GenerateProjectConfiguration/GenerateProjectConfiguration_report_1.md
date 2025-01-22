Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Commands:
• npm run dev: Starts the development server.  
• npm run build: Builds the project for production.  
• npm run preview: Previews the production build.  
• npm run test: Runs tests with Vitest.

-------------------
package.json
-------------------
{
  "name": "vite-react-redux-router-ts-testing",
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
    "react-router-dom": "^6.14.2"
  },
  "devDependencies": {
    "@types/jest": "^29.5.2",
    "@types/react": "^18.2.8",
    "@types/react-dom": "^18.2.4",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.4.0",
    "c8": "^8.0.1",
    "eslint": "^8.43.0",
    "eslint-plugin-react": "^7.33.1",
    "typescript": "^5.1.6",
    "vite": "^4.4.9",
    "vitest": "^0.34.1"
  }
}

-------------------
vite.config.ts
-------------------
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})

-------------------
tsconfig.json
-------------------
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}

-------------------
src/main.tsx
-------------------
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)

-------------------
src/App.tsx
-------------------
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </div>
  )
}

export default App

-------------------
src/store.ts
-------------------
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {}
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

-------------------
src/index.css
-------------------
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

-------------------
tests/setup.ts
-------------------
import '@testing-library/jest-dom'

-------------------
tests/example.test.tsx
-------------------
import { render, screen } from '@testing-library/react'
import React from 'react'
import App from '../src/App'

test('renders home link', () => {
  render(<App />)
  expect(screen.getByText(/Home/i)).toBeInTheDocument()
})

### Tokens: {'input_tokens': 131, 'output_tokens': 2097, 'reasoning_tokens': 1152}
### Execution time: 18.905693292617798
