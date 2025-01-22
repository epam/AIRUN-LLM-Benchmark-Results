```typescript
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { useTodo } from './hooks/useTodo';
import { useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
    const { todos, toggleAll } = useTodo();
    const location = useLocation();
    const allChecked = useSelector((state: RootState) => state.todos.every(todo => todo.completed));
    const dispatch = useDispatch();

    const filter = location.pathname === '/active' ? 'active' : 
                   location.pathname === '/completed' ? 'completed' : 'all';

    return (
        <section className="todoapp">
            <TodoForm />
            <section className="main" style={{ display: todos.length ? 'block' : 'none' }}>
                <input 
                    id="toggle-all" 
                    className="toggle-all" 
                    type="checkbox" 
                    checked={allChecked} 
                    onChange={() => dispatch(toggleAll(!allChecked))} 
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <TodoList filter={filter} />
            </section>
            <TodoFooter />
        </section>
    );
};

const App: React.FC = () => (
    <Provider store={store}>
        <AppContent />
    </Provider>
);

export default App;
```