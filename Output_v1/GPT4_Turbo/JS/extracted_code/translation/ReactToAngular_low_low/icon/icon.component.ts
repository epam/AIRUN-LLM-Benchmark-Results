import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i class="icon-{{icon}}"></i>`,
  styles: []
})
export class IconComponent {
  @Input() icon: string = '';
}