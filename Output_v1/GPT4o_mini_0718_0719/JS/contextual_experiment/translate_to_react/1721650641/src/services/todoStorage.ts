import { Todo } from '../types/todo';

const STORAGE_ID = 'todos-react-ts';

export const todoStorage = {
    get: (): Todo[] => {
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },
    put: (todos: Todo[]) => {
        localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }
};