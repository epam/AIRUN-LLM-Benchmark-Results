export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

const LOCAL_STORAGE_KEY = 'todos';

export const loadTodos = (): Todo[] => {
    const todosStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (todosStr) {
        try {
            return JSON.parse(todosStr);
        } catch {
            return [];
        }
    }
    return [];
};

export const saveTodos = (todos: Todo[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
};