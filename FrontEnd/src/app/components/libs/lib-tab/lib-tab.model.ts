import { TemplateRef } from '@angular/core';

export interface Tab<T> {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
  lazy?: boolean;
  content?: TemplateRef<T>;
}
