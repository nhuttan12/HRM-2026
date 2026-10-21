import { Component, input, output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { LibTextComponent } from '../lib-text/lib-text.component';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputTextModule, LibTextComponent],
  templateUrl: './lib-input.component.html',
})
export class LibInputComponent {
  inputId = input(`lib-input-${Math.random().toString(36).slice(2)}`);
  label = input('');
  placeholder = input('');
  value = input('');
  type = input('text');
  disabled = input(false);
  required = input(false);
  isView = input(false);

  valueChange = output<string>();
}