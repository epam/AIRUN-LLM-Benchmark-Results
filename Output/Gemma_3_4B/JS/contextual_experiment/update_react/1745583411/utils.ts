export const uuid = (): string => {
  let i;
  let random;
  let uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
};

export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const store = (namespace: string, data?: any): any => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const storeValue = localStorage.getItem(namespace);
  return (storeValue && JSON.parse(storeValue)) || [];
};

export const extend = (...objs: any[]) => {
  const newObj = {};

  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
};
