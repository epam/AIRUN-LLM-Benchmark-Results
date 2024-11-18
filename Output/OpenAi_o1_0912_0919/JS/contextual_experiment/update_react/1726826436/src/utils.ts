import { nanoid } from 'nanoid';

export const Utils = {
  uuid: (): string => nanoid(),

  pluralize: (count: number, word: string): string => {
    return count === 1 ? word : `${word}s`;
  },

  store: (namespace: string, data?: any): any => {
    if (data !== undefined) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }
    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  },

  extend: (...objs: any[]): any => {
    return Object.assign({}, ...objs);
  }
};
