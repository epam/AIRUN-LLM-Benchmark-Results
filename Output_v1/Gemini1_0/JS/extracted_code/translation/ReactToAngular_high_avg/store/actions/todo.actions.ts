import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const toggleAll = createAction('[Todo] Toggle All', props<{ checked: boolean }>());
export const toggle = createAction('[Todo] Toggle', props<{ todo: Todo }>());
export const destroy = createAction('[Todo] Destroy', props<{ todo: Todo }>());
export const edit = createAction('[Todo] Edit', props<{ todo: Todo | null }>());
export const save = createAction('[Todo] Save', props<{ todo: Todo; text: string }>());
export const clearCompleted = createAction('[Todo] Clear Completed');