import { Component, computed, input, output } from '@angular/core';
import { TrackingCandidate } from '../recruitment-tracking.model';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { LibLabelComponent } from '../../libs/lib-label/lib-label.component';
import { recruitmentStatusVariant } from '../recruitment-tracking-status.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruitment-tracking-card',
  standalone: true,
  imports: [LibTextComponent, LibLabelComponent, RouterLink],
  templateUrl: './recruitment-tracking-card.component.html',
})
export class RecruitmentTrackingCardComponent {
  readonly candidate = input.required<TrackingCandidate>();
  readonly detailClick = output<TrackingCandidate>();
  readonly statusVariant = recruitmentStatusVariant;
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
