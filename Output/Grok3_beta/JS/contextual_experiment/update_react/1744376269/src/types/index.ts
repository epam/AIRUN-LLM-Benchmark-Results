export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoState {
  todos: ITodo[];
}

export interface ITodoItemProps {
  todo: ITodo;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  editing: boolean;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}

export interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

export interface ITodoHeaderProps {
  onAddTodo: (title: string) => void;
}