import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TodoCount from './TodoCount';
import FilterLinks from './FilterLinks';
import ClearCompletedButton from './ClearCompletedButton';

const Footer: React.FC = () => {
  const todoCount = useSelector((state: RootState) => state.todos.length);

  if (todoCount === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <TodoCount />
      <FilterLinks />
      <ClearCompletedButton />
    </footer>
  );
};

export default Footer;
