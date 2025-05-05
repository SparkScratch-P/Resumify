export interface Resume {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  atsScore: number | null;
  templateId: string;
  keywords: string[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  url: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  expires: boolean;
  expiryDate: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  skills: string[];
  keywords: string[];
}

export interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  keywordMatches: {
    keyword: string;
    count: number;
    importance: number;
  }[];
  sectionFeedback: {
    section: string;
    score: number;
    feedback: string;
  }[];
}

export interface GeminiAPIResponse {
  text: string;
  usage: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
}