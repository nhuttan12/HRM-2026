import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

export interface HrmTableColumn<T> {
  field: keyof T;
  header: string;
  width?: string;
}

@Component({
  selector: 'lib-hrm-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lib-hrm-table.component.html',
})
export class LibHrmTableComponent<T> {
  data = input<T[]>([]);
  columns = input<HrmTableColumn<T>[]>([]);
  selectable = input(false);
  
  selectedData = model<T[]>([]);
  selectionChange = output<T[]>();
  readonly rowClick = output<T>();
  readonly rowDoubleClick = output<T>();

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onRowDoubleClick(row: T): void {
    this.rowDoubleClick.emit(row);
  }

  isSelected(row: T): boolean {
    return this.selectedData().includes(row);
  }

  isAllSelected(): boolean {
    const data = this.data();
    const selected = this.selectedData();

    return data.length > 0 && data.every((row) => selected.includes(row));
  }

  toggleRow(row: T): void {
    const current = this.selectedData();

    const updated = this.isSelected(row)
      ? current.filter((item) => item !== row)
      : [...current, row];

    this.updateSelection(updated);
  }

  toggleAll(): void {
    const data = this.data();
    const current = this.selectedData();

    const updated = this.isAllSelected()
      ? current.filter((item) => !data.includes(item))
      : [...current, ...data.filter((row) => !current.includes(row))];

    this.updateSelection(updated);
  }

  private updateSelection(selection: T[]): void {
    this.selectedData.set(selection);
    this.selectionChange.emit(selection);
  }

  getCellValue(row: T, field: keyof T | string): unknown {
    return row[field as keyof T];
  }

  trackByRow(_index: number, row: T): T {
    return row;
  }
}