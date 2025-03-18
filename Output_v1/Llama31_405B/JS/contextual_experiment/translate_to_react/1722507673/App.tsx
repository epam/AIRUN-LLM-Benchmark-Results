import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Footer from './components/Footer';

function App() {
  return (
    <Provider store={store}>
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoForm />
        </header>
        <section className="main">
          <TodoList />
        </section>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;