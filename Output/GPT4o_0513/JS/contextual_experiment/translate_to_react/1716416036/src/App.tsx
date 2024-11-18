import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';
import './styles/base.css';
import './styles/index.css';

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
      </Router>
    </Provider>
  );
};

export default App;
