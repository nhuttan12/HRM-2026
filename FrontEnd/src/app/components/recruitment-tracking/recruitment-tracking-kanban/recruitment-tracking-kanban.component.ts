import { Component, input, output } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { RecruitmentTrackingCardComponent } from '../recruitment-tracking-card/recruitment-tracking-card.component';
import { TrackingCandidate, TrackingStage } from '../recruitment-tracking.model';

@Component({
  selector: 'app-recruitment-tracking-kanban',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDropListGroup, LibTextComponent, RecruitmentTrackingCardComponent],
  templateUrl: './recruitment-tracking-kanban.component.html',
  styleUrl: './recruitment-tracking-kanban.component.css',
})
export class RecruitmentTrackingKanbanComponent {
  readonly stages = input.required<TrackingStage[]>();
  readonly stagesChange = output<TrackingStage[]>();
  readonly addCandidate = output<void>();
  readonly colors: Record<string, { panel: string; dot: string; badge: string }> = {
    new: { panel: 'border-blue-200 bg-blue-50/70', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    screening: { panel: 'border-violet-200 bg-violet-50/70', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700' },
    interview: { panel: 'border-amber-200 bg-amber-50/70', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
    offer: { panel: 'border-sky-200 bg-sky-50/70', dot: 'bg-sky-500', badge: 'bg-sky-100 text-sky-700' },
    hired: { panel: 'border-emerald-200 bg-emerald-50/70', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  };
  readonly defaultColors = { panel: 'border-slate-200 bg-slate-50', dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700' };

  drop(event: CdkDragDrop<TrackingCandidate[]>): void {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) return;
    const stages = this.copyStages();
    const from = stages.find((stage) => stage.id === event.previousContainer.id);
    const to = stages.find((stage) => stage.id === event.container.id);
    if (!from || !to) return;
    if (from === to) moveItemInArray(from.candidates, event.previousIndex, event.currentIndex);
    else transferArrayItem(from.candidates, to.candidates, event.previousIndex, event.currentIndex);
    this.stagesChange.emit(stages);
  }

  private copyStages(): TrackingStage[] {
    return this.stages().map((stage) => ({ ...stage, candidates: [...stage.candidates] }));
  }
}
