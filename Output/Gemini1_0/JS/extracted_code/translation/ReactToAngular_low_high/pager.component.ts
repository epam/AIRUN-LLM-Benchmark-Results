import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Page } from '../models/page.model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent {
  @Input() page: Page | null = null;
  @Output() onSelectPage = new EventEmitter<number>();

  get isFirstPage(): boolean {
    return this.page?.page <= 1;
  }

  get isLastPage(): boolean {
    return this.page?.page >= this.page?.numPages;
  }

  handleFirstPage(): void {
    this.onSelectPage.emit(1);
  }

  handleLastPage(): void {
    this.onSelectPage.emit(this.page?.numPages);
  }

  handlePreviousPage(): void {
    this.onSelectPage.emit(this.page?.page - 1);
  }

  handleNextPage(): void {
    this.onSelectPage.emit(this.page?.page + 1);
  }
}