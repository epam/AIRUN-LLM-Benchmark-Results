import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { TodoApp } from './components/TodoApp';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <TodoApp />
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>Credits:
            <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,
            <a href="http://ericbidelman.com">Eric Bidelman</a>,
            <a href="http://jacobmumm.com">Jacob Mumm</a>,
            <a href="http://blog.igorminar.com">Igor Minar</a> and
            <a href="http://twitter.com/passy">Pascal Hartig</a>
          </p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    </Provider>
  );
};

export default App;
