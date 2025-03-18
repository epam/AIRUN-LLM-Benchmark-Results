class Utils {
  public static store(namespace: string, data?: any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }
    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }
}

export { Utils };