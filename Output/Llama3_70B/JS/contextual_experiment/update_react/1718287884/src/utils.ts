export function uuid(){return nanoid()} export function pluralize(count:number,word:string){return count===1?word:word+'s'} export function store(namespace:string,data?:any){if(data){localStorage.setItem(namespace,JSON.stringify(data))}else{const store=localStorage.getItem(namespace);return store?JSON.parse(store):[]}} export function extend(...objs:any[]){const newObj={};for(const obj of objs){for(const key in obj){if(obj.hasOwnProperty(key)){newObj[key]=obj[key]}}}}