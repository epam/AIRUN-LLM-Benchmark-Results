import { nanoid } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export const createTodo = (title: string): Todo => ({
  id: nanoid(),
  title,
  completed: false,
});
