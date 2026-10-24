import { CandidateListSection } from "../candidate-profile-detail.model";

export interface CandidateListRowAddEvent {
  section: CandidateListSection;
  row: Record<string, unknown>;
}
