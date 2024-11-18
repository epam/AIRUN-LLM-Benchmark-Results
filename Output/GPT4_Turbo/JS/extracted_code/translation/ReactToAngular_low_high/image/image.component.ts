import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `<img [src]="src" [attr.alt]="alt" (error)="handleError()" [ngStyle]="imgStyles">`,
})
export class ImageComponent implements OnChanges {
  @Input() src: string;
  @Input() errSrc: string;
  @Input() alt: string = '';
  @Input() imgStyles: any = {};
  isError: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src && changes.src.currentValue !== changes.src.previousValue) {
      this.isError = false;
      this.src = this.src || this.errSrc;
    }
  }

  handleError(): void {
    if (this.isError) {
      return;
    }
    this.isError = true;
    this.src = this.errSrc;
  }
}