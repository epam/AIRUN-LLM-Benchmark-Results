import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TodoApp from './components/TodoApp';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => (
    <Provider store={store}>
        <Router>
            <TodoApp />
        </Router>
    </Provider>
);

export default App;
