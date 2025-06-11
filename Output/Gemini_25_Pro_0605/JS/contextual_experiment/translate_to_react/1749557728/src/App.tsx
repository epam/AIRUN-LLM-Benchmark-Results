import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from './store/todosSlice';
import { Filter } from './types';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace(/^#\//, '');
            let filter: Filter = 'all';
            if (hash === 'active' || hash === 'completed') {
                filter = hash;
            }
            dispatch(setFilter(filter));
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [dispatch]);

    return (
        <>
            <section className="todoapp">
                <Header />
                <TodoList />
                <Footer />
            </section>
            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Created by the TodoMVC Team</p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
        </>
    );
};

export default App;
