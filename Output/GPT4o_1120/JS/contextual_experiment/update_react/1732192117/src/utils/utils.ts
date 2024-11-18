export const Utils = {
  uuid: (): string => {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      const random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
  },

  pluralize: (count: number, word: string): string => {
    return count === 1 ? word : `${word}s`;
  },

  store: (namespace: string, data?: any): any => {
    if (data) {
      localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      const store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    }
  },

  extend: <T, U>(obj1: T, obj2: U): T & U => {
    return { ...obj1, ...obj2 };
  },
};