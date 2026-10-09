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
  styleUrl: './lib-hrm-table.component.scss',
})
export class LibHrmTableComponent<T> {
  data = input<T[]>([]);
  columns = input<HrmTableColumn<T>[]>([]);
  selectable = input(false);
  
  selectedData = model<T[]>([]);
  selectionChange = output<T[]>();
  readonly rowClick = output<T>();

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  isSelected(row: T): boolean {
    return this.selectedData().includes(row);
  }

  isAllSelected(): boolean {
    const data = this.data();
    const selectedData = this.selectedData();

    return (
      data.length > 0 &&
      data.every((row) => selectedData.includes(row))
    );
  }

  toggleRow(row: T): void {
    const selected = this.isSelected(row);
    const currentSelection = this.selectedData();

    const updatedSelection = selected
      ? currentSelection.filter((item) => item !== row)
      : [...currentSelection, row];

    this.updateSelection(updatedSelection);
  }

  toggleAll(): void {
    const data = this.data();
    const currentSelection = this.selectedData();
    const allSelected = this.isAllSelected();

    const updatedSelection = allSelected
      ? currentSelection.filter((item) => !data.includes(item))
      : [
          ...currentSelection,
          ...data.filter((row) => !currentSelection.includes(row)),
        ];

    this.updateSelection(updatedSelection);
  }

  private updateSelection(selection: T[]): void {
    this.selectedData.set(selection);
    this.selectionChange.emit(selection);
  }

  getCellValue(row: T, field: keyof T | string): unknown {
    return row[field as keyof T];
  }

  trackByRow(index: number, row: T): T {
    return row;
  }
}