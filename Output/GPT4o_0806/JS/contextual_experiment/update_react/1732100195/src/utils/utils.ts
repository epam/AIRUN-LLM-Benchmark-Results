export class Utils {
  static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  static extend<T>(...objs: T[]): T {
    return Object.assign({}, ...objs);
  }
}