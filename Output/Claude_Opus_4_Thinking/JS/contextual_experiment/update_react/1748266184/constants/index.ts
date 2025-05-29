export const ALL_TODOS = 'all' as const;
export const ACTIVE_TODOS = 'active' as const;
export const COMPLETED_TODOS = 'completed' as const;
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

export type FilterType = typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS;