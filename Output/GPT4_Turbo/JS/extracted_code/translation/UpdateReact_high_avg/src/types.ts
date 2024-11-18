export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoModel {
  key: string;
  todos: ITodo[];
  onChanges: any[];
}