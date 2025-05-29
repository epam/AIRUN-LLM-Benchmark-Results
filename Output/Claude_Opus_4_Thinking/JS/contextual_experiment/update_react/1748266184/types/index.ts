export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoItemProps {
  todo: ITodo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}