class Utils {
  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }
}

export { Utils };
