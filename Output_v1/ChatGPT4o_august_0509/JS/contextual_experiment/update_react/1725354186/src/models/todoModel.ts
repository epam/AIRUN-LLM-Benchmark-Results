import { nanoid } from 'nanoid';
import { ITodo } from '../types';
import { Utils } from '../utils/utils';

class TodoModel {
  public key: string;
  public todos: ITodo[];
  public onChanges: Array<() => void>;

  constructor(key: string) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange: () => void) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach((cb) => cb());
  }

  public addTodo(title: string) {
    this.todos = this.todos.concat({
      id: nanoid(),
      title,
      completed: false,
    });
    this.inform();
  }

  public toggleAll(checked: boolean) {
    this.todos = this.todos.map((todo) => ({
      ...todo,
      completed: checked,
    }));
    this.inform();
  }

  public toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map((todo) =>
      todo !== todoToToggle ? todo : { ...todo, completed: !todo.completed }
    );
    this.inform();
  }

  public destroy(todo: ITodo) {
    this.todos = this.todos.filter((candidate) => candidate !== todo);
    this.inform();
  }

  public save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map((todo) =>
      todo !== todoToSave ? todo : { ...todo, title: text }
    );
    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.inform();
  }
}

export { TodoModel };
