import { AfterViewInit, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CandidateProfileTableComponent } from './candidate-profile-table/candidate-profile-table.component';
import { LibCandidateProfileHeaderComponent } from './candidate-profile-header/candidate-profile-header.component';
import { LibCanvasComponent } from '../libs/lib-canvas/lib-canvas.component';
import { Candidate } from './candidate-profile-table/candidate-profile-table.model';
import { CandidateProfileDetailComponent } from './candidate-profile-detail/candidate-profile-detail.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    LibCanvasComponent,
    LibCandidateProfileHeaderComponent,
    CandidateProfileTableComponent,
    CandidateProfileDetailComponent,
  ],
  templateUrl: './candidate-profile-page.component.html',
})
export class CandidateProfilePageComponent implements AfterViewInit {
  readonly selectedCandidateCode = signal<string | null>(null);
  readonly canvasOpened = signal(false);
  readonly candidateDetail = viewChild(CandidateProfileDetailComponent);
  readonly isClosing = signal(false);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.syncCanvasWithUrl();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncCanvasWithUrl());
  }

  private resetCandidateState(): void {
    this.selectedCandidateCode.set(null);
  }

  private syncCanvasWithUrl(): void {
    if (this.isClosing()) {
      return;
    }

    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.selectedCandidateCode.set(code);
    }

    this.canvasOpened.set(Boolean(code));
  }

  async onCandidateClick(candidate: Candidate): Promise<void> {
    this.isClosing.set(false);
    this.selectedCandidateCode.set(candidate.candidateCode);
    if (!this.canvasOpened()) {
      this.canvasOpened.set(true);
    }

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { code: candidate.candidateCode },
    });
  }

  async onCanvasClosed(): Promise<void> {
    this.isClosing.set(true);
    this.canvasOpened.set(false);
    this.candidateDetail()?.resetEditState();

    setTimeout(() => {
      this.selectedCandidateCode.set(null);
      this.isClosing.set(false);

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { code: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }, 460);
  }

  onSearch(keyword: string): void {
    console.log('Search:', keyword);
  }

  onAdd(): void {
    this.isClosing.set(false);
    this.resetCandidateState();
    this.canvasOpened.set(true);
  }
}






