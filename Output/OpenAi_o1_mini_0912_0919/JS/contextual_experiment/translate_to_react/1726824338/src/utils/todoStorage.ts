```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_ID = 'todos-react-redux-ts';

export const getTodos = (): Todo[] => {
  const todosJSON = localStorage.getItem(STORAGE_ID);
  return todosJSON ? JSON.parse(todosJSON) : [];
};

export const putTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};
```