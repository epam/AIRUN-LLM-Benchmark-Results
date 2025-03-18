import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

export function store<T>(namespace: string, data?: T[]): T[] {
  if (data !== undefined) {
    localStorage.setItem(namespace, JSON.stringify(data));
  }
  const store = localStorage.getItem(namespace);
  return store ? (JSON.parse(store) as T[]) : [];
}