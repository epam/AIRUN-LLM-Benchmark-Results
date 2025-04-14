import React from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <section className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <AddTodo />
            </header>
            <TodoList />
            <Footer />
        </section>
    );
};

export default App;
