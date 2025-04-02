```ts
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface IAppState {
  nowShowing: string;
  editing: string | null;
}

export interface IFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

export interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (val: string) => void;
  onCancel: () => void;
}

export interface ITodoItemState {
  editText: string;
}
```