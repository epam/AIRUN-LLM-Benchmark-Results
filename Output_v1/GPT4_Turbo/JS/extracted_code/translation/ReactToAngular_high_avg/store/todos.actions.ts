import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: string }>());
export const destroyTodo = createAction('[Todo] Destroy Todo', props<{ id: string }>());
export const editTodo = createAction('[Todo] Edit Todo', props<{ id: string, title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ completed: boolean }>());
export const clearCompleted = createAction('[Todo] Clear Completed');