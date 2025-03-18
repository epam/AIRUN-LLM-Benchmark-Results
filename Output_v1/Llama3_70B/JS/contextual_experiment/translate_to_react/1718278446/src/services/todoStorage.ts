import { createStore } from 'redux';
import { todoReducer } from '../redux/todoReducer';

const STORAGE_ID = 'todos-react';

const todoStorage = {
  get: () => JSON.parse(localStorage.getItem(STORAGE_ID) || '[]'),
  set: (todos: any[]) => localStorage.setItem(STORAGE_ID, JSON.stringify(todos)),
};

export default todoStorage;
