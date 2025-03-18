import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="text-center" style="margin-top: 50px;">
      <h1 style="font-family: 'GoodDog';"><app-icon [icon]="'spinner'" [spin]="true"></app-icon> loading...</h1>
    </div>
  `,
})
export class LoadingComponent {}