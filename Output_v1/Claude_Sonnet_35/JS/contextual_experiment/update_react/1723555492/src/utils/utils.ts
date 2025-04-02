export const pluralize = (count: number, word: string): string => {
  return count === 1 ? word : word + 's';
};

export const store = (namespace: string, data?: any): any => {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
};
