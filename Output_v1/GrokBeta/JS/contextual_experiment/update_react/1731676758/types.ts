```typescript
export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface IAppState {
  nowShowing: string;
  editing: string | null;
}

export interface ITodoItemProps {
  todo: ITodo;
  onToggle: (todo: ITodo) => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: (event: React.FormEvent) => void;
}

export interface ITodoItemState {
  editText: string;
}

export interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

export interface IAppProps {
  model: {
    todos: ITodo[];
    addTodo: (title: string) => void;
    toggleAll: (checked: boolean) => void;
    toggle: (todo: ITodo) => void;
    destroy: (todo: ITodo) => void;
    save: (todo: ITodo, text: string) => void;
    clearCompleted: () => void;
  };
}
```