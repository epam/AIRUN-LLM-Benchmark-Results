export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's';
}

export function store<T = any>(namespace: string, data?: T): T[] | void {
  if (data !== undefined) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  const store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}
