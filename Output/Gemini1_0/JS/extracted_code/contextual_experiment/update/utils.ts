// utils.ts
import { v4 as uuid } from "uuid";

export class Utils {
  public static uuid(): string {
    return uuid();
  }

  public static pluralize(count: number, word: string): string {
    return count === 1 ? word : word + "s";
  }

  public static store(namespace: string, data?: any): any {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return store && JSON.parse(store) ? JSON.parse(store) : [];
  }

  public static extend(...objs: any[]): any {
    const newObj = {};
    for (const obj of objs) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}