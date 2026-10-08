import { Component, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

@Component({
  selector: 'lib-skeleton',
  standalone: true,
  templateUrl: './lib-skeleton.component.html',
  styleUrl: './lib-skeleton.component.scss',
})
export class LibSkeletonComponent {
  width = input('100%');
  height = input('1rem');
  borderRadius = input('0.5rem');
  variant = input<SkeletonVariant>('rect');
  animated = input(true);
  customClass = input('');
}