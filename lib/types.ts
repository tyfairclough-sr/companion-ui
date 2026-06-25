export interface JobPostingCandidate {
  id: string;
  name: string;
  address: string;
  badgeType: string;
  matchScore: number;
  selected: boolean;
}

export interface JobPostingResponse {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  secondaryText: string;
  candidates: JobPostingCandidate[];
}

export interface CandidatesListResponse {
  jobId: string;
  candidates: JobPostingCandidate[];
}

export interface CandidateExperience {
  id: string;
  dateRange: string;
  title: string;
  company: string;
  description: string;
}

export interface CandidateEducation {
  id: string;
  dateRange: string;
  degree: string;
  school: string;
}

export interface CandidateDetailResponse {
  id: string;
  name: string;
  address: string;
  badgeType: string;
  matchScore: number;
  subtitle: string | null;
  experience: CandidateExperience[];
  education: CandidateEducation[];
}
