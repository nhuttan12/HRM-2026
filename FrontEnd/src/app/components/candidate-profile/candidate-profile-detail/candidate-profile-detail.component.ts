import { Component, effect, inject, input, signal } from '@angular/core';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { CandidateProfileDetail } from './candidate-profile-detail.data';
import { candidateProfileFields } from './candidate-profile-detail.model';
import { CandidateDetailService } from './candidate-profile-detail.service';

@Component({
  selector: 'app-candidate-profile-detail',
  standalone: true,
  templateUrl: './candidate-profile-detail.component.html',
  styleUrl: './candidate-profile-detail.component.scss',
  imports: [LibTextComponent, LibSkeletonComponent],
})
export class CandidateProfileDetailComponent {
  readonly candidateCode = input<string | null>(null);
  readonly candidate = signal<CandidateProfileDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly fields = candidateProfileFields;

  private readonly candidateService = inject(CandidateDetailService);

  constructor() {
    effect((onCleanup) => {
      const code = this.candidateCode();

      this.candidate.set(null);
      this.error.set(null);

      if (!code) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);

      const subscription = this.candidateService.getByCode(code).subscribe({
        next: (data) => {
          this.candidate.set(data);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(
            err instanceof Error
              ? err.message
              : 'Không thể tải thông tin ứng viên.',
          );

          this.loading.set(false);
        },
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (typeof value === 'object') {
      return '—';
    }

    return String(value);
  }
}