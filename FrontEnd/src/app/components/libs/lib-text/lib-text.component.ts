import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type LibTextTag =
  | 'p'
  | 'span'
  | 'strong'
  | 'em'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5';

@Component({
  selector: 'lib-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lib-text.component.html',
})
export class LibTextComponent {
  text = input<string>('');
  tag = input<LibTextTag>('p');
  className = input('');
  styles = input<Record<string, string> | null>(null);
}