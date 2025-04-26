import React from 'react';
import NewTodoInput from './NewTodoInput';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>todos</h1>
      <NewTodoInput />
    </header>
  );
};

export default Header;
