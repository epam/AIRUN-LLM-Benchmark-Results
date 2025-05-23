export function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any): any {
  if (data) {
    localStorage.setItem(namespace, JSON.stringify(data));
    return;
  }

  const storedData = localStorage.getItem(namespace);
  return (storedData && JSON.parse(storedData)) || [];
}
