import { Component, input, output, signal } from '@angular/core';
import { RecruitmentBatch } from '../../recruitment-batch/recruitment-batch.model';
import { InterviewRound, TrackingCandidate } from '../recruitment-tracking.model';
import { CandidateDetailSection } from './recruitment-tracking-candidate-detail.model';
import { RecruitmentTrackingCandidateDetailSidebarComponent } from './recruitment-tracking-candidate-detail-sidebar/recruitment-tracking-candidate-detail-sidebar.component';
import { RecruitmentTrackingCandidateDetailContentComponent } from './recruitment-tracking-candidate-detail-content/recruitment-tracking-candidate-detail-content.component';

@Component({
  selector: 'app-recruitment-tracking-candidate-detail',
  standalone: true,
  imports: [
    RecruitmentTrackingCandidateDetailSidebarComponent,
    RecruitmentTrackingCandidateDetailContentComponent,
  ],
  templateUrl: './recruitment-tracking-candidate-detail.component.html',
})
export class RecruitmentTrackingCandidateDetailComponent {
  readonly candidate = input.required<TrackingCandidate>();
  readonly batch = input.required<RecruitmentBatch>();
  readonly rounds = input.required<InterviewRound[]>();
  readonly roundsChange = output<InterviewRound[]>();
  readonly activeSection = signal<CandidateDetailSection>('interviews');
}
