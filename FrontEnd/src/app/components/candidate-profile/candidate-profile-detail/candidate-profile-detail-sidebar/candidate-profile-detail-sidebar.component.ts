
import { Component, output, signal } from '@angular/core';
import { candidateProfileSidebarItems } from './candidate-profile-detail-sidebar.config';

@Component({
  selector: 'app-candidate-profile-detail-sidebar',
  standalone: true,
  templateUrl: './candidate-profile-detail-sidebar.component.html',
  styleUrl: './candidate-profile-detail-sidebar.component.scss',
})
export class CandidateProfileDetailSidebarComponent {
  readonly sectionChange = output<string>();
  readonly activeSection = signal('overview');
  readonly menuItems = candidateProfileSidebarItems;

  selectSection(id: string): void {
    this.activeSection.set(id);
    this.sectionChange.emit(id);
  }
}
