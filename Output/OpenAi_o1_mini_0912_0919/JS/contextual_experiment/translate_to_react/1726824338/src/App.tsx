```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store/store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <TodoApp />
    </Router>
  </Provider>
);

export default App;
```