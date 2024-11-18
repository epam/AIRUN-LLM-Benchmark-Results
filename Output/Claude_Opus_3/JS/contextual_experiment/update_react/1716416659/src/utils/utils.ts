import { nanoid } from 'nanoid';

export const uuid = (): string => {
  return nanoid();
};

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const store = (namespace: string, data?: any): any => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const storedData = localStorage.getItem(namespace);
  return storedData ? JSON.parse(storedData) : [];
};
