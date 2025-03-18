import { nanoid } from 'nanoid';

export const uuid = () => nanoid();

export const pluralize = (count: number, word: string) => count === 1 ? word : word + 's';

export const store = (namespace: string, data?: any) => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
};

export const extend = (...objs: any[]) => {
  const newObj = {};
  for (const obj of objs) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};