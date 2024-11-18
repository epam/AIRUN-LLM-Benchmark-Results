// todoModel.ts
import { EventEmitter } from "events";
import { ITodo } from "./todo";

class TodoModel extends EventEmitter {
  public todos: Array<ITodo>;

  constructor(key: string) {
    super();
    this.todos = this.load(key);
  }

  public subscribe(event: string, callback: Function) {
    this.on(event, callback);
  }

  public addTodo(title: string) {
    const id = this.nextId();
    const todo = {
      id: id,
      title: title,
      completed: false,
    };

    this.todos.push(todo);
    this.save();
    this.emit("add", todo);
  }

  public toggle(todo: ITodo) {
    todo.completed = !todo.completed;
    this.save();
    this.emit("update", todo);
  }

  public toggleAll(checked: boolean) {
    this.todos.forEach((todo) => {
      todo.completed = checked;
    });

    this.save();
    this.emit("updateAll", this.todos);
  }

  public destroy(todo: ITodo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
    this.save();
    this.emit("destroy", todo);
  }

  public save(key: string = "react-todos") {
    localStorage.setItem(key, JSON.stringify(this.todos));
  }

  public load(key: string = "react-todos") {
    const todos = localStorage.getItem(key);
    return todos ? JSON.parse(todos) : [];
  }

  public clearCompleted() {
    const completed = this.todos.filter((todo) => {
      return todo.completed;
    });

    completed.forEach((todo) => {
      this.destroy(todo);
    });
  }

  public nextId() {
    let max = 0;
    this.todos.forEach((todo) => {
      max = Math.max(max, todo.id);
    });

    return max + 1;
  }
}

export { TodoModel };