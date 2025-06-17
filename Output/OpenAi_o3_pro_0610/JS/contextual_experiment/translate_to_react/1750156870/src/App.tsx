import React, { useEffect } from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import { useAppDispatch } from './hooks';
import { setFilter, Filter } from './slices/todosSlice';

const getFilterFromHash = (): Filter => {
    const hash = window.location.hash.replace('#', '');
    switch (hash) {
        case '/active':
            return 'active';
        case '/completed':
            return 'completed';
        default:
            return 'all';
    }
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const applyFilter = () => dispatch(setFilter(getFilterFromHash()));
        applyFilter();
        window.addEventListener('hashchange', applyFilter);
        return () => window.removeEventListener('hashchange', applyFilter);
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
                <p>
                    Credits: <a href="http://twitter.com/cburgdorf">Christoph Burgdorf</a>,{' '}
                    <a href="http://ericbidelman.com">Eric Bidelman</a>,{' '}
                    <a href="http://jacobmumm.com">Jacob Mumm</a>,{' '}
                    <a href="http://blog.igorminar.com">Igor Minar</a> and{' '}
                    <a href="http://twitter.com/passy">Pascal Hartig</a>
                </p>
                <p>
                    Part of <a href="http://todomvc.com">TodoMVC</a>
                </p>
            </footer>
        </>
    );
};

export default App;
