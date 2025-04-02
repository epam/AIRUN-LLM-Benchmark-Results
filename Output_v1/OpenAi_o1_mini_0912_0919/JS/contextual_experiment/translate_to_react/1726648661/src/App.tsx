import React from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => (
    <section className="todoapp">
        <Header />
        <TodoList />
        <Footer />
    </section>
);

export default App;