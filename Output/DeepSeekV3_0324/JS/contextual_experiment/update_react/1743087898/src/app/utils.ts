export const uuid = () => {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    const random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
};

export const pluralize = (count: number, word: string) => {
  return count === 1 ? word : word + 's';
};

export const store = (namespace: string, data?: any) => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
};

export const extend = (...objs: any[]) => {
  const newObj: any = {};
  for (const obj of objs) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};