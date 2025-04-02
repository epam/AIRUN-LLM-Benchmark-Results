import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
    return (
        <Router>
            <section className=\"todoapp\">
                <TodoForm />
                <TodoList />
                <TodoFooter />
            </section>
        </Router>
    );
};

export default TodoApp;