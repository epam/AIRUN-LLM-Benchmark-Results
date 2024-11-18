import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from './features/page/Page';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Page />} />
        {/* Define other routes here */}
      </Routes>
    </div>
  );
}

export default App;