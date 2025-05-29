export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  filter: string;
  editingId: string | null;
}

export interface TodoItemProps {
  todo: Todo;
  editing: boolean;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}

export interface TodoFooterProps {
  count: number;
  completedCount: number;
  filter: string;
  onClearCompleted: () => void;
}

export interface TodoInputProps {
  onAddTodo: (title: string) => void;
}

export interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  onToggle: (id: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}