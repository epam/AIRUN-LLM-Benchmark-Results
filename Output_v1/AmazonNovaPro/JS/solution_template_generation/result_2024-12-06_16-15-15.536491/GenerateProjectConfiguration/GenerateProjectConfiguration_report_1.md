Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
```json
{
  "name": "vite-react-redux-router-ts-test",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-redux": "^8.0.0",
    "redux": "^4.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/react-redux": "^7.0.0",
    "@types/redux": "^4.0.0",
    "@types/react-router-dom": "^5.0.0",
    "@vitejs/plugin-react": "^2.0.0",
    "typescript": "^4.0.0",
    "vite": "^3.0.0",
    "vitest": "^0.20.0",
    "@testing-library/react": "^12.0.0",
    "@testing-library/user-event": "^13.0.0"
  }
}
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import rootReducer from './reducers';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
```

```tsx
// src/App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';

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

```tsx
// src/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return <h1>Home Page</h1>;
};

export default Home;
```

```tsx
// src/About.tsx
import React from 'react';

const About: React.FC = () => {
  return <h1>About Page</h1>;
};

export default About;
```

```ts
// src/reducers/index.ts
import { combineReducers } from 'redux';

const rootReducer = combineReducers({});

export default rootReducer;
```

```tsx
// src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders home page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home Page/i);
  expect(linkElement).toBeInTheDocument();
});
```

### Tokens: {'input_tokens': 120, 'output_tokens': 720}
### Execution time: 18.47538995742798
