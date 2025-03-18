import { nanoid } from 'nanoid';

export const pluralize = (count: number, word: string): string => 
  count === 1 ? word : `${word}s`;

export const generateId = (): string => nanoid();

export const store = (namespace: string, data?: any): any => {
  if (data) {
    localStorage.setItem(namespace, JSON.stringify(data));
    return;
  }

  const storedData = localStorage.getItem(namespace);
  return (storedData && JSON.parse(storedData)) || [];
};

export const extend = (...objs: any[]): any => {
  return Object.assign({}, ...objs);
};