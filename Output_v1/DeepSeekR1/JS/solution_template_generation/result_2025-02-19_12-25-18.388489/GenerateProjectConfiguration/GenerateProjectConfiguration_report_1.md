Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
<think>
Okay, I need to set up a Vite project with React, Redux, React-Router, TypeScript, and Testing Library. Let me start by recalling the necessary steps.

First, creating a Vite project with the React-TS template. The command is something like npm create vite@latest and then selecting React and TypeScript. But maybe there's a direct command. Oh right, you can use `npm create vite@latest my-app -- --template react-ts` to scaffold the project.

Next, installing Redux and React-Router. For Redux, I'll need redux, react-redux, and redux-thunk for middleware. React-Router is now version 6, so I should install react-router-dom. Also, types for these might be needed, but since we're using TypeScript, maybe some are included. Let me check. Redux and react-redux have their own types, but react-router-dom might need @types/react-router-dom. Wait, no, react-router-dom v6 includes TypeScript types, so no need for separate installation.

Testing libraries: The user mentioned testing library, so probably @testing-library/react and @testing-library/jest-dom. Also, Vitest is the testing framework for Vite, so install vitest, jsdom for the DOM environment, and @testing-library/user-event for simulating user events. Need to configure Vitest in vite.config.ts.

Now, package.json. The scripts should include dev, build, preview, and test. The test script should use vitest with watch mode maybe. Dependencies include react, react-dom, react-redux, redux, redux-thunk, react-router-dom. Dev dependencies: @types/react, @types/react-dom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, vitest, jsdom, typescript, vite, etc.

Wait, the Vite template already includes some dev dependencies like @vitejs/plugin-react, so I need to include that in the devDependencies. Also, TypeScript is already a dev dependency. So in the package.json, I need to list all the required dependencies and devDependencies correctly.

Then, setting up the test environment. In vite.config.ts, add a test section with environment: 'jsdom', globals: true, and setupFiles: './src/setupTests.ts'. The setupTests.ts file should import '@testing-library/jest-dom'.

Creating a basic Redux store. In src/app/store.ts, configure the store with combineReducers and applyMiddleware for thunk. Export the store and the RootState and AppDispatch types.

Setting up React-Router in main.tsx. Wrap the App component with BrowserRouter. Also, provide the Redux store using the Provider.

Example components and tests: Maybe a simple component that uses routing and Redux. But the user didn't ask for that, just the configuration. So perhaps just the basic setup without example code.

Wait, the user wants the codebase without TODOs, so all necessary files should be complete. So setupTests.ts, store.ts, main.tsx, App.tsx with routes, etc.

App.tsx should have some routes. Maybe a basic structure with Home and About pages. Also, a test for the App component to check if it renders correctly.

Let me outline the files:

1. package.json with all dependencies and scripts.
2. vite.config.ts with Vitest configuration.
3. src/setupTests.ts importing jest-dom.
4. src/main.tsx with React-Router and Redux setup.
5. src/app/store.ts with Redux store configuration.
6. src/App.tsx with basic routing.
7. A test file for App, like App.test.tsx.

Check that all dependencies are correctly listed. Let me think again about the exact package names and versions. For example, react-redux is version 8.x, redux is 4.x, react-router-dom is 6.x. Testing libraries: @testing-library/react 13.x or 14.x, vitest 0.x or 1.x.

Also, in package.json, the "type" should be "module" because Vite uses ESM. And the test script is "vitest".

Putting it all together, making sure there are no TODOs and all configurations are correct. Now, generate each file's content as per these steps.
</think>

**package.json**
```json
{
  "name": "vite-react-redux-starter",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.16.0",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.1"
  }
}
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
```

**src/setupTests.ts**
```typescript
import '@testing-library/jest-dom'
```

**src/main.tsx**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'

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

**src/app/store.ts**
```typescript
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({})

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**src/App.tsx**
```typescript
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/about" element={<div>About Page</div>} />
    </Routes>
  )
}
```

**src/App.test.tsx**
```typescript
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App component', () => {
  it('renders home page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByText(/home page/i)).toBeInTheDocument()
  })
})
```

**Commands Description:**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm test`: Run unit tests with Vitest

### Tokens: {'input_tokens': 125, 'output_tokens': 1758}
### Execution time: 25.936792850494385
