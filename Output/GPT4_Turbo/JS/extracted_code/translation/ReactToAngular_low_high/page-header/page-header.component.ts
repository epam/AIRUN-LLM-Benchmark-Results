import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header text-center">
      <h3>{{header}}</h3>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() header: string;
}