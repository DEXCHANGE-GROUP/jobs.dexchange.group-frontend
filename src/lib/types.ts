export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  remote: boolean;
  category: string;
  type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  status: 'draft' | 'published' | 'closed' | 'archived';
  salary?: { min?: number; max?: number; currency?: string };
  skills: string[];
  requirements: string[];
  applicationUrl?: string;
  contactEmail?: string;
  views: number;
  applicationsCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  remoteOnly: boolean;
  headline?: string;
  summary?: string;
  resumeUrl?: string;
  skills: string[];
  languages: string[];
  availability: string;
  expectedSalary?: number;
  totalYearsExperience: number;
  score: {
    skills: number;
    experience: number;
    culture: number;
    global: number;
  };
  talentPool: {
    status: string;
    tags: string[];
  };
  isActive: boolean;
  totalApplications: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: string | Job;
  candidateId: string | Candidate;
  status: string;
  source: string;
  coverLetter?: string;
  resumeUrl?: string;
  statusHistory: Array<{
    status: string;
    changedAt: string;
    changedBy?: string;
    comment?: string;
  }>;
  rating?: number;
  hrNotes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'CDI',
  part_time: 'Temps partiel',
  contract: 'CDD',
  freelance: 'Freelance',
  internship: 'Stage',
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  published: 'Publiée',
  closed: 'Fermée',
  archived: 'Archivée',
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  submitted: 'Reçue',
  reviewing: 'En revue',
  shortlisted: 'Présélectionné',
  phone_screen: 'Entretien tél.',
  interview_1: 'Entretien 1',
  interview_2: 'Entretien 2',
  technical: 'Test technique',
  offer_sent: 'Offre envoyée',
  hired: 'Recruté',
  rejected: 'Rejeté',
  withdrawn: 'Retiré',
  on_hold: 'En attente',
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  immediately: 'Immédiate',
  '1_month': 'Sous 1 mois',
  '3_months': 'Sous 3 mois',
  not_looking: 'Ne cherche pas',
};
