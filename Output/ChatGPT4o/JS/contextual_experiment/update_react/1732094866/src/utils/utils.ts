import { nanoid } from 'nanoid';

class Utils {
  public static uuid(): string {
    return nanoid();
  }

  public static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace: string, data?: any): any {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend<T>(...objs: T[]): T {
    return Object.assign({}, ...objs);
  }
}

export { Utils };
