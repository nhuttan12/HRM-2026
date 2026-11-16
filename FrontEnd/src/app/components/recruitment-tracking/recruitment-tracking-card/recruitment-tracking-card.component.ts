import { Component, computed, input, output } from '@angular/core';
import { RecruitmentStatus, TrackingCandidate } from '../recruitment-tracking.model';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruitment-tracking-card',
  standalone: true,
  imports: [LibTextComponent, RouterLink],
  templateUrl: './recruitment-tracking-card.component.html',
})
export class RecruitmentTrackingCardComponent {
  readonly candidate = input.required<TrackingCandidate>();
  readonly detailClick = output<TrackingCandidate>();
  readonly statusClasses: Record<RecruitmentStatus, string> = {
    'Đang chờ duyệt': 'bg-amber-100 text-amber-700',
    'Đã đậu': 'bg-green-100 text-green-700',
    'Đã rớt': 'bg-red-100 text-red-700',
    'Đã bỏ phỏng vấn': 'bg-red-100 text-red-700',
  };
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
