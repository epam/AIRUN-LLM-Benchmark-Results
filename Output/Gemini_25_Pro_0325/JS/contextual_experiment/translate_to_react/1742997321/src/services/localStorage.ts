import { Todo } from '../types';

const STORAGE_ID = 'todos-angularjs-requirejs';

export const loadState = (): Todo[] => {
  try {
    const serializedState = localStorage.getItem(STORAGE_ID);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return [];
  }
};

export const saveState = (state: Todo[]): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_ID, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};
