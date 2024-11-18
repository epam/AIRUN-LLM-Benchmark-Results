class Utils {
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

  public static extend<T, U>(first: T, second: U): T & U {
    const result = {} as T & U;
    for (const key in first) {
      if (first.hasOwnProperty(key)) {
        (result as any)[key] = first[key];
      }
    }
    for (const key in second) {
      if (second.hasOwnProperty(key)) {
        (result as any)[key] = second[key];
      }
    }
    return result;
  }
}

export { Utils };
