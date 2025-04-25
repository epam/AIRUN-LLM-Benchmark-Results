import { Utils } from './utils';
import { ITodo, ITodoModel } from './todoModelInterfaces';

class TodoModel implements ITodoModel {
  public key: string;
  public todos: ITodo[];
  public onChanges: Array<() => void>;

  constructor(key: string) {
    this.key = key;
    this.todos = Utils.store(this.key);
    this.onChanges = [];
  }

  public subscribe(onChange: () => void): void {
    this.onChanges.push(onChange);
  }

  private inform(): void {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(cb => cb());
  }

  public addTodo(title: string): void {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });
    this.inform();
  }

  public toggleAll(checked: boolean): void {
    this.todos = this.todos.map<ITodo>(todo => {
      return Utils.extend({}, todo, { completed: checked });
    });
    this.inform();
  }

  public toggle(todoToToggle: ITodo): void {
    this.todos = this.todos.map<ITodo>(todo => {
      return todo !== todoToToggle ? todo : Utils.extend({}, todo, { completed: !todo.completed });
    });
    this.inform();
  }

  public destroy(todo: ITodo): void {
    this.todos = this.todos.filter(candidate => candidate !== todo);
    this.inform();
  }

  public save(todoToSave: ITodo, text: string): void {
    this.todos = this.todos.map(todo => {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text });
    });
    this.inform();
  }

  public clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.inform();
  }
}

export { TodoModel };
