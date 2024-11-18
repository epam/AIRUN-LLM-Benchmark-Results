import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon: string = '';
  @Input() spin: boolean = false;

  get classes(): string[] {
    return ['fa', `fa-${this.icon}`, { 'fa-spin': this.spin }];
  }
}