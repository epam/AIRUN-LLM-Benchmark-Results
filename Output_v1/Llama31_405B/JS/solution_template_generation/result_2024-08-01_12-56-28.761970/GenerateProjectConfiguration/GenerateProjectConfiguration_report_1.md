Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
**Project Configuration**

This project configuration is based on Vite builder with support for React, Redux, React-Router, TypeScript, and Jest testing library.

**Commands**

* `npm run dev`: Starts the development server with Vite.
* `npm run build`: Builds the application for production with Vite.
* `npm run test`: Runs the unit tests with Jest.
* `npm run test:watch`: Runs the unit tests in watch mode with Jest.

**package.json**
```json
{
  "name": "vite-react-redux-router-typescript",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "redux": "^8.0.2",
    "typescript": "^4.6.3"
  },
  "devDependencies": {
    "@types/react": "^18.0.15",
    "@types/react-dom": "^18.0.6",
    "@types/react-redux": "^7.1.24",
    "@types/react-router-dom": "^5.3.3",
    "@types/redux": "^3.6.0",
    "@vitejs/plugin-react": "^2.0.0",
    "jest": "^28.1.3",
    "ts-jest": "^28.0.5",
    "vite": "^3.0.0"
  }
}
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**jest.config.ts**
```typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
};

export default config;
```

**src/index.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
```

**src/App.tsx**
```typescript
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
```

**src/store.ts**
```typescript
import { createStore, combineReducers } from 'redux';
import counterReducer from './reducers/counterReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
});

const store = createStore(rootReducer);

export default store;
```

**src/reducers/counterReducer.ts**
```typescript
const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export default counterReducer;
```

**src/pages/Home.tsx**
```typescript
import React from 'react';

const Home = () => {
  return <h1>Home Page</h1>;
};

export default Home;
```

**src/pages/About.tsx**
```typescript
import React from 'react';

const About = () => {
  return <h1>About Page</h1>;
};

export default About;
```

**src/components/Counter.tsx**
```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Counter = () => {
  const count = useSelector((state: any) => state.counter.count);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch({ type: 'INCREMENT' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'DECREMENT' });
  };

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
};

export default Counter;
```

**tests/Counter.test.tsx**
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Counter from '../src/components/Counter';

describe('Counter component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Counter />);
    expect(getByText('Counter: 0')).toBeInTheDocument();
  });

  it('increments counter', () => {
    const { getByText } = render(<Counter />);
    const incrementButton = getByText('+');
    fireEvent.click(incrementButton);
    expect(getByText('Counter: 1')).toBeInTheDocument();
  });

  it('decrements counter', () => {
    const { getByText } = render(<Counter />);
    const decrementButton = getByText('-');
    fireEvent.click(decrementButton);
    expect(getByText('Counter: -1')).toBeInTheDocument();
  });
});
```

### Tokens: {'input_tokens': 134, 'output_tokens': 1310}
### Execution time: 24.759560346603394
