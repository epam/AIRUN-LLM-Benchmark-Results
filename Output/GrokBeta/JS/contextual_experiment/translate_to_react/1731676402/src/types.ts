```typescript
export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

export type TodoFilter = 'all' | 'active' | 'completed';
```