import { AfterViewInit, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { CandidateProfileTableComponent } from './candidate-profile-table/candidate-profile-table.component';
import { LibCandidateProfileHeaderComponent } from './candidate-profile-header/candidate-profile-header.component';
import { LibCanvasComponent } from '../libs/lib-canvas/lib-canvas.component';
import { Candidate } from './candidate-profile-table/candidate-profile-table.model';
import { CandidateProfileDetailComponent } from './candidate-profile-detail/candidate-profile-detail.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    LibCanvasComponent,
    LibCandidateProfileHeaderComponent,
    CandidateProfileTableComponent,
    CandidateProfileDetailComponent
],
  templateUrl: './candidate-profile-page.component.html',
})
export class CandidateProfilePageComponent implements AfterViewInit {
  readonly canvas = viewChild.required(LibCanvasComponent);

  readonly selectedCandidateCode  = signal<string | null>(null);
  readonly canvasMode = signal<'create' | 'detail'>('create');
  readonly openingDetail = signal(false);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.syncCanvasWithUrl();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncCanvasWithUrl());
  }

  private isDetailUrl(): boolean {
    return this.router.url.split('?')[0] ===
      '/candidate-profile/detail';
  }

  private resetCandidateState(): void {
    this.selectedCandidateCode.set(null);
    this.canvasMode.set('create');
  }

  private syncCanvasWithUrl(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.canvasMode.set('detail');
      this.selectedCandidateCode.set(code);

      if (!this.canvas().opened()) {
        this.canvas().open();
      }
    } else {
      if (this.canvas().opened()) {
        this.canvas().close();
      }
    }

    this.openingDetail.set(false);
  }

  async onCandidateClick(candidate: Candidate): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { code: candidate.candidateCode },
    });
  }

  async onCanvasClosed(): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { code: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onSearch(keyword: string): void {
    // TODO: Xử lý tìm kiếm ứng viên.
    console.log('Search:', keyword);
  }

  onAdd(): void {
    if (this.openingDetail()) {
      return;
    }

    this.resetCandidateState();
    this.canvas().open();
  }
}
