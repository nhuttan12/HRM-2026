export const CandidateDetailSections = { overview: 'overview', interviews: 'interviews' } as const;
export type CandidateDetailSection =
  (typeof CandidateDetailSections)[keyof typeof CandidateDetailSections];
