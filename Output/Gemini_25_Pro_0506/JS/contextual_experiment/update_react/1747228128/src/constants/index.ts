export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';

export type FilterType = typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS;

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

export const LOCAL_STORAGE_KEY = 'react-todos-modern';