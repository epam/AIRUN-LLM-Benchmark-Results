import { createAction, props } from '@ngrx/store';
import { Todo } from './todos.model';

export const addTodo = createAction('[Todos] Add Todo', props<{ title: string }>());
export const deleteTodo = createAction('[Todos] Delete Todo', props<{ id: number }>());
export const editTodo = createAction('[Todos] Edit Todo', props<{ todo: Todo }>());
export const toggleTodo = createAction('[Todos] Toggle Todo', props<{ id: number }>());
export const markAll = createAction('[Todos] Mark All', props<{ checked: boolean }>());
export const clearDoneTodos = createAction('[Todos] Clear Done Todos');