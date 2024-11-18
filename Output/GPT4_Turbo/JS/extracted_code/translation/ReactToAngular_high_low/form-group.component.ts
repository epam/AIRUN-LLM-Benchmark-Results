import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() control: FormControl;
  @Input() placeholder: string;

  get isValid() { return this.control.touched && !this.control.errors; }
  get isInvalid() { return this.control.touched && this.control.errors; }
}