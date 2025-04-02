import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <section className=\"todoapp\">
        <Header />
        <TodoList />
        <Footer />
      </section>
      <footer className=\"info\">
        <p>Double-click to edit a todo</p>
        <p>Credits:
          <a href=\"http://twitter.com/cburgdorf\">Christoph Burgdorf</a>,
          <a href=\"http://ericbidelman.com\">Eric Bidelman</a>,
          <a href=\"http://jacobmumm.com\">Jacob Mumm</a>,
          <a href=\"http://blog.igorminar.com\">Igor Minar</a> and
          <a href=\"http://twitter.com/passy\">Pascal Hartig</a>
        </p>
        <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>
      </footer>
    </Router>
  </Provider>
);

export default App;
