Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
### Commands Description
- `npm install`: Installs all the necessary dependencies for the project.
- `npm run dev`: Starts the development server using Vite.
- `npm run build`: Builds the project for production.
- `npm run test`: Runs the test suite using Vitest.

### package.json
```json
{
  "name": "vite-react-redux-router-ts",
  "version": "1.0.0",
  "description": "A Vite project with React, Redux, React-Router, TypeScript, and Testing Library",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.8.1",
    "redux": "^4.2.1"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@types/react-redux": "^7.1.25",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.5",
    "vite": "^4.0.4",
    "vitest": "^0.29.0"
  }
}
```

### Project Structure
```
vite-react-redux-router-ts/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── HelloWorld.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── react-app-env.d.ts
│   ├── setupTests.ts
│   ├── store.ts
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### src/components/HelloWorld.tsx
```tsx
import React from 'react';

const HelloWorld: React.FC = () => {
  return <h1>Hello, World!</h1>;
};

export default HelloWorld;
```

### src/pages/Home.tsx
```tsx
import React from 'react';

const Home: React.FC = () => {
  return <div>Home Page</div>;
};

export default Home;
```

### src/pages/About.tsx
```tsx
import React from 'react';

const About: React.FC = () => {
  return <div>About Page</div>;
};

export default About;
```

### src/App.tsx
```tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
```

### src/index.css
```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}
```

### src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### src/react-app-env.d.ts
```typescript
/// <reference types="vite/client" />
```

### src/setupTests.ts
```typescript
import '@testing-library/jest-dom';
```

### src/store.ts
```typescript
import { createStore } from 'redux';

const initialState = {
  count: 0,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
```

### src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### tsconfig.json
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
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + Redux + React-Router + TypeScript</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### .gitignore
```
node_modules/
dist/
.env.local
.env.*.local
.env
*.log
```

### Tokens: {'input_tokens': 132, 'output_tokens': 1418}
### Execution time: 14.995996236801147
