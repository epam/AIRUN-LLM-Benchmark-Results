import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.css']
})
export class TodoFooterComponent {
  @Input() nowShowing: string;
  @Output() clearCompleted = new EventEmitter<void>();
  @Output() updateNowShowing = new EventEmitter<string>();

  clearCompletedTodos() {
    this.clearCompleted.emit();
  }

  setNowShowing(showing: string) {
    this.updateNowShowing.emit(showing);
  }
}