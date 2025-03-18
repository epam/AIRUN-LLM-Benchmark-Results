import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pager',
  template: `
    <div *ngIf="page && onSelectPage && page.numPages > 1">
      <button (click)="handleFirstPage()" [disabled]="isFirstPage"><app-icon icon="fast-backward"></app-icon></button>
      <button (click)="handlePreviousPage()" [disabled]="isFirstPage"><app-icon icon="backward"></app-icon></button>
      <button (click)="handleNextPage()" [disabled]="isLastPage"><app-icon icon="forward"></app-icon></button>
      <button (click)="handleLastPage()" [disabled]="isLastPage"><app-icon icon="fast-forward"></app-icon></button>
    </div>
  `,
})
export class PagerComponent {
  @Input() page: any;
  @Output() onSelectPage = new EventEmitter<number>();

  get isFirstPage(): boolean {
    return this.page.page <= 1;
  }

  get isLastPage(): boolean {
    return this.page.page >= this.page.numPages;
  }

  handleFirstPage() {
    this.onSelectPage.emit(1);
  }

  handleLastPage() {
    this.onSelectPage.emit(this.page.numPages);
  }

  handlePreviousPage() {
    this.onSelectPage.emit(this.page.page - 1);
  }

  handleNextPage() {
    this.onSelectPage.emit(this.page.page + 1);
  }
}