import { create } from 'zustand';
import { createEmptyResume, generateId } from '../lib/utils';
import type { 
  Resume, PersonalInfo, WorkExperience, 
  Education, Skill, Project, Certification, 
  JobDescription, ATSAnalysis 
} from '../types';

interface ResumeState {
  resumes: Resume[];
  currentResumeId: string | null;
  activeJobDescription: JobDescription | null;
  atsAnalysis: ATSAnalysis | null;
  loading: {
    savingResume: boolean;
    generatingContent: boolean;
    analyzingResume: boolean;
  };

  // Getters
  getCurrentResume: () => Resume | null;
  
  // Actions
  createResume: () => string;
  saveResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
  setCurrentResumeId: (id: string | null) => void;
  
  // Section updaters
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  
  // Work Experience
  addWorkExperience: () => string;
  updateWorkExperience: (id: string, work: Partial<WorkExperience>) => void;
  deleteWorkExperience: (id: string) => void;
  
  // Education
  addEducation: () => string;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => string;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  // Projects
  addProject: () => string;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Certifications
  addCertification: () => string;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  
  // Template
  updateTemplate: (templateId: string) => void;
  
  // Job analysis
  setActiveJobDescription: (jobDescription: JobDescription | null) => void;
  setATSAnalysis: (analysis: ATSAnalysis | null) => void;
  
  // Loading states
  setLoading: (key: keyof ResumeState['loading'], value: boolean) => void;
}

const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResumeId: null,
  activeJobDescription: null,
  atsAnalysis: null,
  loading: {
    savingResume: false,
    generatingContent: false,
    analyzingResume: false,
  },
  
  // Getters
  getCurrentResume: () => {
    const { resumes, currentResumeId } = get();
    if (!currentResumeId) return null;
    return resumes.find(resume => resume.id === currentResumeId) || null;
  },
  
  // Actions
  createResume: () => {
    const emptyResume = createEmptyResume();
    set(state => ({
      resumes: [...state.resumes, emptyResume],
      currentResumeId: emptyResume.id
    }));
    return emptyResume.id;
  },
  
  saveResume: (resume) => {
    set(state => ({
      resumes: state.resumes.map(r => 
        r.id === resume.id 
          ? { ...resume, updatedAt: new Date().toISOString() } 
          : r
      )
    }));
  },
  
  deleteResume: (id) => {
    set(state => ({
      resumes: state.resumes.filter(resume => resume.id !== id),
      currentResumeId: state.currentResumeId === id ? null : state.currentResumeId
    }));
  },
  
  setCurrentResumeId: (id) => {
    set({ currentResumeId: id });
  },
  
  // Section updaters
  updatePersonalInfo: (info) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        ...info
      },
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  updateSummary: (summary) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      summary,
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Work Experience
  addWorkExperience: () => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return '';
    
    const id = generateId();
    const newWorkExperience: WorkExperience = {
      id,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    
    const updatedResume = {
      ...currentResume,
      workExperience: [...currentResume.workExperience, newWorkExperience],
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
    return id;
  },
  
  updateWorkExperience: (id, work) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      workExperience: currentResume.workExperience.map(item => 
        item.id === id ? { ...item, ...work } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  deleteWorkExperience: (id) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      workExperience: currentResume.workExperience.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Education
  addEducation: () => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return '';
    
    const id = generateId();
    const newEducation: Education = {
      id,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    };
    
    const updatedResume = {
      ...currentResume,
      education: [...currentResume.education, newEducation],
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
    return id;
  },
  
  updateEducation: (id, education) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      education: currentResume.education.map(item => 
        item.id === id ? { ...item, ...education } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  deleteEducation: (id) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      education: currentResume.education.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Skills
  addSkill: (skill) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return '';
    
    const id = generateId();
    const newSkill: Skill = {
      id,
      ...skill
    };
    
    const updatedResume = {
      ...currentResume,
      skills: [...currentResume.skills, newSkill],
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
    return id;
  },
  
  updateSkill: (id, skill) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      skills: currentResume.skills.map(item => 
        item.id === id ? { ...item, ...skill } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  deleteSkill: (id) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      skills: currentResume.skills.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Projects
  addProject: () => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return '';
    
    const id = generateId();
    const newProject: Project = {
      id,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      url: '',
      technologies: []
    };
    
    const updatedResume = {
      ...currentResume,
      projects: [...currentResume.projects, newProject],
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
    return id;
  },
  
  updateProject: (id, project) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      projects: currentResume.projects.map(item => 
        item.id === id ? { ...item, ...project } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  deleteProject: (id) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      projects: currentResume.projects.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Certifications
  addCertification: () => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return '';
    
    const id = generateId();
    const newCertification: Certification = {
      id,
      name: '',
      issuer: '',
      date: '',
      url: '',
      expires: false,
      expiryDate: ''
    };
    
    const updatedResume = {
      ...currentResume,
      certifications: [...currentResume.certifications, newCertification],
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
    return id;
  },
  
  updateCertification: (id, certification) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      certifications: currentResume.certifications.map(item => 
        item.id === id ? { ...item, ...certification } : item
      ),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  deleteCertification: (id) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      certifications: currentResume.certifications.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Template
  updateTemplate: (templateId) => {
    const currentResume = get().getCurrentResume();
    if (!currentResume) return;
    
    const updatedResume = {
      ...currentResume,
      templateId,
      updatedAt: new Date().toISOString()
    };
    
    get().saveResume(updatedResume);
  },
  
  // Job analysis
  setActiveJobDescription: (jobDescription) => {
    set({ activeJobDescription: jobDescription });
  },
  
  setATSAnalysis: (analysis) => {
    set({ atsAnalysis: analysis });
  },
  
  // Loading states
  setLoading: (key, value) => {
    set(state => ({
      loading: {
        ...state.loading,
        [key]: value
      }
    }));
  }
}));

export default useResumeStore;