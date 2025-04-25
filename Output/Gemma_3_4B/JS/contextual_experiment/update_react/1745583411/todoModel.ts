import { nanoid } from 'nanoid';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

type ITodoModel = {
  todos: ITodo[];
  onChanges: () => void;
};

class TodoModel implements ITodoModel {
  public key: string;
  public todos: ITodo[] = [];
  public onChanges: () => void[] = [];

  constructor(key: string) {
    this.key = key;
  }

  public subscribe(onChange: () => void) {
    this.onChanges.push(onChange);
  }

  public addTodo(title: string) {
    const id = nanoid();
    this.todos.push({
      id, 
      title, 
      completed: false,
    });
    this.notifyChanges();
  }

  public toggleAll(checked: boolean) {
    this.todos = this.todos.map((todo) => ({ ...todo, completed: checked }));
    this.notifyChanges();
  }

  public toggle(todo: ITodo) {
    this.todos = this.todos.map((t) => (t.id !== todo.id ? t : { ...t, completed: !t.completed }));
    this.notifyChanges();
  }

  public destroy(todo: ITodo) {
    this.todos = this.todos.filter((t) => t.id !== todo.id);
    this.notifyChanges();
  }

  public save(todo: ITodo, text: string) {
    this.todos = this.todos.map((t) => (t.id === todo.id ? { ...t, title: text } : t));
    this.notifyChanges();
  }

  public clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.notifyChanges();
  }

  private notifyChanges() {
    this.onChanges.forEach((callback) => callback());
  }
}

export { TodoModel };