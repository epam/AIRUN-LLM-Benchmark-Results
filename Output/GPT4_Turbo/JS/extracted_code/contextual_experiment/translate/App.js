import React from 'react';
import { PageProvider } from './contexts/PageContext';
import { UserProvider } from './contexts/UserContext';
import PageEditor from './components/PageEditor/PageEditor';

function App() {
  return (
    <UserProvider>
      <PageProvider>
        <div className="App">
          <PageEditor />
        </div>
      </PageProvider>
    </UserProvider>
  );
}

export default App;