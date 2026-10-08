import { Component } from '@angular/core';
import { CandidateProfileTableComponent } from './candidate-profile-table/candidate-profile-table.component';
import { LibCandidateProfileHeaderComponent } from './candidate-profile-header/candidate-profile-header.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    LibCandidateProfileHeaderComponent,
    CandidateProfileTableComponent,
  ],
  templateUrl: './candidate-profile-page.component.html',
  styleUrl: './candidate-profile-page.component.scss',
})
export class CandidateProfilePageComponent {
  onSearch(keyword: string): void {
    console.log('Search candidate:', keyword);

    // Sau này gọi API search candidate ở đây
  }

  onAdd(): void {
    console.log('Add candidate');

    // Sau này mở dialog / canvas thêm candidate ở đây
  }
}