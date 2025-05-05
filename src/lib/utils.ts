import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Resume } from '../types';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Format a date for display (YYYY-MM-DD to Month Year)
export function formatDate(dateString?: string) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

// Create an empty resume with all required fields
export function createEmptyResume(): Resume {
  const id = generateId();
  const now = new Date().toISOString();
  
  return {
    id,
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      title: ''
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    atsScore: null,
    templateId: 'modern',
    keywords: []
  };
}

// Calculate completeness of a resume (percentage)
export function calculateCompleteness(resume: Resume): number {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  // Personal info (8 fields, 2 points each)
  const personalInfoFields = Object.values(resume.personalInfo);
  totalPoints += personalInfoFields.length * 2;
  earnedPoints += personalInfoFields.filter(field => !!field).length * 2;
  
  // Summary (10 points)
  totalPoints += 10;
  if (resume.summary.length > 0) {
    earnedPoints += resume.summary.length > 100 ? 10 : 5;
  }
  
  // Work experience (20 points per entry, max 3 entries)
  const maxWorkEntries = 3;
  totalPoints += maxWorkEntries * 20;
  
  resume.workExperience.slice(0, maxWorkEntries).forEach(work => {
    let entryPoints = 0;
    if (work.company) entryPoints += 3;
    if (work.position) entryPoints += 3;
    if (work.startDate) entryPoints += 2;
    if (work.endDate || work.current) entryPoints += 2;
    if (work.description && work.description.length > 50) entryPoints += 5;
    if (work.achievements && work.achievements.length > 0) entryPoints += 5;
    earnedPoints += entryPoints;
  });
  
  // Education (15 points per entry, max 2 entries)
  const maxEduEntries = 2;
  totalPoints += maxEduEntries * 15;
  
  resume.education.slice(0, maxEduEntries).forEach(edu => {
    let entryPoints = 0;
    if (edu.institution) entryPoints += 3;
    if (edu.degree) entryPoints += 3;
    if (edu.field) entryPoints += 3;
    if (edu.startDate) entryPoints += 2;
    if (edu.endDate || edu.current) entryPoints += 2;
    if (edu.description) entryPoints += 2;
    earnedPoints += entryPoints;
  });
  
  // Skills (2 points per skill, max 15 points)
  totalPoints += 15;
  earnedPoints += Math.min(resume.skills.length * 2, 15);
  
  // Projects (5 points per project, max 2 projects)
  const maxProjects = 2;
  totalPoints += maxProjects * 5;
  
  resume.projects.slice(0, maxProjects).forEach(project => {
    let entryPoints = 0;
    if (project.name) entryPoints += 1;
    if (project.description && project.description.length > 20) entryPoints += 2;
    if (project.technologies && project.technologies.length > 0) entryPoints += 2;
    earnedPoints += entryPoints;
  });
  
  // Certifications (3 points per cert, max 2 certs)
  const maxCerts = 2;
  totalPoints += maxCerts * 3;
  
  resume.certifications.slice(0, maxCerts).forEach(cert => {
    let entryPoints = 0;
    if (cert.name) entryPoints += 1;
    if (cert.issuer) entryPoints += 1;
    if (cert.date) entryPoints += 1;
    earnedPoints += entryPoints;
  });
  
  // Calculate percentage and round to nearest whole number
  const percentage = (earnedPoints / totalPoints) * 100;
  return Math.round(percentage);
}