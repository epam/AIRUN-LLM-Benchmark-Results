export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoItemProps {
  todo: ITodo;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (text: string) => void;
}

export interface FooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}
