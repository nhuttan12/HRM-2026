import { Component, signal, viewChild } from '@angular/core';
import { CandidateProfileTableComponent } from './candidate-profile-table/candidate-profile-table.component';
import { LibCandidateProfileHeaderComponent } from './candidate-profile-header/candidate-profile-header.component';
import { LibCanvasComponent } from '../libs/lib-canvas/lib-canvas.component';
import { Candidate } from './candidate-profile-table/candidate-profile-table.model';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    LibCanvasComponent,
    LibCandidateProfileHeaderComponent,
    CandidateProfileTableComponent,
  ],
  templateUrl: './candidate-profile-page.component.html',
  styleUrl: './candidate-profile-page.component.scss',
})
export class CandidateProfilePageComponent {
  readonly canvas = viewChild.required(LibCanvasComponent);

  readonly selectedCandidate = signal<Candidate | null>(null);
  readonly canvasMode = signal<'create' | 'detail'>('create');

  onCandidateClick(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
    this.canvasMode.set('detail');
    this.canvas().open();
  }

  onSearch(keyword: string): void {
    // TODO: Xử lý tìm kiếm ứng viên.
    console.log('Search:', keyword);
  }

  onAdd(): void {
    this.selectedCandidate.set(null);
    this.canvasMode.set('create');
    this.canvas().open();
  }
}