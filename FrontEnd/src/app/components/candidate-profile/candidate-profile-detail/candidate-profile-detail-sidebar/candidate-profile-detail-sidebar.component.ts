
import { Component, input, output, signal } from '@angular/core';
import { candidateProfileSidebarItems } from './candidate-profile-detail-sidebar.config';
import { CandidateProfileSection } from '../candidate-profile-detail.model';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';

@Component({
  selector: 'app-candidate-profile-detail-sidebar',
  standalone: true,
  templateUrl: './candidate-profile-detail-sidebar.component.html',
  imports: [LibTextComponent],
})
export class CandidateProfileDetailSidebarComponent {
  readonly sectionChange = output<CandidateProfileSection>();
  readonly activeSection = signal<CandidateProfileSection>('overview');
  readonly menuItems = candidateProfileSidebarItems;
  readonly candidateCode = input<string | null>(null);

  selectSection(id: CandidateProfileSection): void {
    this.activeSection.set(id);
    this.sectionChange.emit(id);
  }
}
