```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => (
  <Provider store={store}>
    <TodoApp />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```