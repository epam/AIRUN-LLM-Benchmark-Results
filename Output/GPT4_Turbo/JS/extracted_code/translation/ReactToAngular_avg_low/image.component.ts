import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image',
  template: `
    <img [src]="src" (error)="handleError($event)" [attr.alt]="imgProps?.alt" [height]="imgProps?.height" [width]="imgProps?.width">
  `,
  styles: []
})
export class ImageComponent implements OnChanges {
  @Input() src!: string;
  @Input() errSrc!: string;
  @Input() imgProps?: { alt?: string; height?: number; width?: number };
  isError: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && !changes['src'].isFirstChange()) {
      this.isError = false; // Reset error state on src change
      this.src = this.src || this.errSrc;
    }
  }

  handleError(event: Event): void {
    event.preventDefault();
    if (!this.isError) {
      this.isError = true;
      this.src = this.errSrc;
    }
  }
}