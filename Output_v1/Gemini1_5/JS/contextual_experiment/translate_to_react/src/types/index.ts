```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export enum FilterValues {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
```