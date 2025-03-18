import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() src: string = '';
  @Input() errSrc: string = '';
  @Input() imgProps: any;

  isError: boolean = false;

  ngOnInit(): void {
    this.src = this.src || this.errSrc;
  }

  handleError(event: Event): void {
    event.preventDefault();
    if (this.isError) {
      return;
    }
    this.isError = true;
    this.src = this.errSrc;
  }
}