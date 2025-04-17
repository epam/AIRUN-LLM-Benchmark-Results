export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  items: ITodo[];
  filter: string;
}

export interface RootState {
  todos: TodosState;
}