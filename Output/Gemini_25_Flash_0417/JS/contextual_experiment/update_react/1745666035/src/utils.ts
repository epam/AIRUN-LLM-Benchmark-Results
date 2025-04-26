import { nanoid } from 'nanoid';

export function uuid(): string {
  return nanoid();
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}

export function store<T>(namespace: string, data?: T): T | undefined {
  if (data !== undefined) {
    localStorage.setItem(namespace, JSON.stringify(data));
    return undefined; // Indicate no return value when setting
  }

  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}