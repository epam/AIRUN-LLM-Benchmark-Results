export const STORAGE_KEY = 'todos-redux';

export function loadTodos<T = unknown[]>(): T {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        return serialized ? (JSON.parse(serialized) as T) : ([] as unknown as T);
    } catch {
        return [] as unknown as T;
    }
}

export function saveTodos<T>(todos: T): void {
    try {
        const serialized = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
        // ignore write errors
    }
}
