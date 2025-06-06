```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementsByClassName('todoapp')[0];
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```