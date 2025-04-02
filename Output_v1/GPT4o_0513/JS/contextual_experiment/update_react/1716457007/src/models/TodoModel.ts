import { Utils } from '../utils';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

class TodoModel {
  public key: string;
  public todos: Todo[];
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
    this.todos = this.todos.map((todo) =>
      Utils.extend({}, todo, { completed: checked })
    );
    this.inform();
  }

  public toggle(todoToToggle: Todo) {
    this.todos = this.todos.map((todo) =>
      todo !== todoToToggle
        ? todo
        : Utils.extend({}, todo, { completed: !todo.completed })
    );
    this.inform();
  }

  public destroy(todo: Todo) {
    this.todos = this.todos.filter((candidate) => candidate !== todo);
    this.inform();
  }

  public save(todoToSave: Todo, text: string) {
    this.todos = this.todos.map((todo) =>
      todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text })
    );
    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.inform();
  }
}

export { TodoModel };