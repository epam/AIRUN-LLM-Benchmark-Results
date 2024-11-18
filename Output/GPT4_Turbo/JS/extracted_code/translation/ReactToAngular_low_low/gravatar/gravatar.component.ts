import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gravatar',
  template: `<img [src]="gravatarUrl" />`,
  styles: []
})
export class GravatarComponent {
  @Input() email: string = '';
  get gravatarUrl(): string {
    // Implement your gravatar URL generation logic here
    return '';
  }
}