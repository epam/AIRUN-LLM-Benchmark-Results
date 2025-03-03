import { nanoid } from 'nanoid';

export const uuid = () => nanoid();

export function pluralize(count: number, word: string) {
  return count === 1 ? word : `${word}s`;
}

export function store<T>(namespace: string, data?: T): T | void {
  if (data) {
    localStorage.setItem(namespace, JSON.stringify(data));
    return;
  }
  const stored = localStorage.getItem(namespace);
  return stored ? JSON.parse(stored) : [];
}

export function extend<T extends object>(...objs: T[]): T {
  return objs.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
}
