import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <section className="todoapp">
          <Header />
          <Routes>
            <Route path="/" element={<MainSection />} />
            <Route path="/active" element={<MainSection />} />
            <Route path="/completed" element={<MainSection />} />
          </Routes>
          <Footer />
        </section>
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
      </Router>
    </Provider>
  );
};

export default App;
