import { nanoid } from 'nanoid';
import { Todo } from '../types';

const STORAGE_KEY = 'todos-react-ts';

const delay = () => new Promise(resolve => setTimeout(resolve, 500));

const getTodos = (): Todo[] => {
  const todos = localStorage.getItem(STORAGE_KEY);
  return todos ? JSON.parse(todos) : [];
};

export const todoStorage = {
  async get() {
    await delay();
    return getTodos();
  },

  async put(todo: Todo) {
    await delay();
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === todo.id);
    
    if (index === -1) {
      todos.push({ ...todo, id: todo.id || nanoid() });
    } else {
      todos[index] = todo;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return todo;
  },

  async delete(todo: Todo) {
    await delay();
    const todos = getTodos().filter(t => t.id !== todo.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return todo;
  }
};