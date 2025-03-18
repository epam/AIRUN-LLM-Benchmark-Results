```typescript
import { nanoid } from 'nanoid';

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const store = (namespace: string, data?: any): any => {
  if (data) {
    localStorage.setItem(namespace, JSON.stringify(data));
    return;
  }

  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
};

export const extend = (...objs: any[]): any => {
  return Object.assign({}, ...objs);
};

export const uuid = (): string => nanoid();
```