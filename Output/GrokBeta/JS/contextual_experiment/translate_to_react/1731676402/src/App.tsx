```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
    return (
        <Provider store={store}>
            <TodoApp />
        </Provider>
    );
};
```