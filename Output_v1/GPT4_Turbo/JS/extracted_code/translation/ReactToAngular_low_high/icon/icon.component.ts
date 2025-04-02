import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [ngClass]="classes"></i>`,
})
export class IconComponent {
  @Input() icon: string;
  @Input() spin: boolean = false;

  get classes(): string[] {
    return ['fa', `fa-${this.icon}`, this.spin ? 'fa-spin' : ''];
  }
}