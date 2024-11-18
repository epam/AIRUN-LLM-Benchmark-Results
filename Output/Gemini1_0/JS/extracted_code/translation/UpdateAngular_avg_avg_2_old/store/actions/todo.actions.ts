import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: number }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());
export const markAll = createAction('[Todo] Mark All', props<{ checked: boolean }>());
export const clearDoneTodos = createAction('[Todo] Clear Done Todos');