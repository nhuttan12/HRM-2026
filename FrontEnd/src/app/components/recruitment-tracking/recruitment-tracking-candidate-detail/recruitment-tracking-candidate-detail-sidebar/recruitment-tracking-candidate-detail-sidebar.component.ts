import { Component, computed, input, output } from '@angular/core';
import { LibSidebarMenuItemComponent } from '../../../libs/lib-command-button/lib-sidebar-menu-item/lib-sidebar-menu-item.component';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';
import { RecruitmentBatch } from '../../../recruitment-batch/recruitment-batch.model';
import { TrackingCandidate } from '../../recruitment-tracking.model';
import {
  CandidateDetailSection,
  CandidateDetailSections,
} from '../recruitment-tracking-candidate-detail.model';

@Component({
  selector: 'app-recruitment-tracking-candidate-detail-sidebar',
  standalone: true,
  imports: [LibSidebarMenuItemComponent, LibTextComponent],
  templateUrl: './recruitment-tracking-candidate-detail-sidebar.component.html',
})
export class RecruitmentTrackingCandidateDetailSidebarComponent {
  readonly sections = CandidateDetailSections;
  readonly candidate = input.required<TrackingCandidate>();
  readonly batch = input.required<RecruitmentBatch>();
  readonly activeSection = input.required<CandidateDetailSection>();
  readonly sectionChange = output<CandidateDetailSection>();
  readonly initials = computed(() =>
    this.candidate()
      .fullName.trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
  );
}
