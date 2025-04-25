const Utils = {
  uuid(): string {
    let i: number, random: number;
    let uuid = '';
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  },
  pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's';
  },
  store(namespace: string, data?: any): any {
    if (data !== undefined) {
      localStorage.setItem(namespace, JSON.stringify(data));
      return;
    }
    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  },
  extend(...objs: any[]): any {
    const newObj: any = {};
    objs.forEach(obj => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = obj[key];
        }
      }
    });
    return newObj;
  }
};

export { Utils };
