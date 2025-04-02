export class Utils {
  static pluralize(count: number, word: string): string {
    return count === 1 ? word : `${word}s`;
  }

  static store(namespace: string, data?: any): any {
    if (data) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }
    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }
}