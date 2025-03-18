import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store/store';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<TodoApp />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
