import { CandidateListSection } from "../candidate-profile-detail.model";

export interface CandidateListRowSaveEvent {
  section: CandidateListSection;
  row: Record<string, unknown>;
}
