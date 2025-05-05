import axios from 'axios';
import type { GeminiAPIResponse, Resume, ATSAnalysis, JobDescription } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
const MODEL = 'models/gemini-1.5-pro';

// Create an axios instance for Gemini API
const geminiApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Helper function to generate a prompt for Gemini
const generatePrompt = (text: string) => {
  return {
    contents: [
      {
        parts: [
          {
            text,
          },
        ],
      },
    ],
  };
};

// API functions
export const api = {
  // Generate resume summary with AI
  generateSummary: async (resume: Partial<Resume>): Promise<string> => {
    try {
      const prompt = `
        Generate a professional resume summary based on the following information:
        Name: ${resume.personalInfo?.firstName} ${resume.personalInfo?.lastName}
        Title: ${resume.personalInfo?.title}
        Work Experience: ${resume.workExperience?.map(work => 
          `${work.position} at ${work.company} (${work.startDate} - ${work.current ? 'Present' : work.endDate})`
        ).join(', ')}
        Skills: ${resume.skills?.map(skill => skill.name).join(', ')}
        Education: ${resume.education?.map(edu => 
          `${edu.degree} in ${edu.field} from ${edu.institution}`
        ).join(', ')}
        
        Make it concise (3-4 sentences), professional, impactful, and optimized for ATS systems.
      `;

      const response = await geminiApi.post<GeminiAPIResponse>(
        `/${MODEL}:generateContent`,
        generatePrompt(prompt)
      );

      return response.data.text || 'Unable to generate summary. Please try again.';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Unable to generate summary. Please try again.';
    }
  },

  // Generate job description-based suggestions
  analyzeJobMatch: async (resume: Resume, jobDescription: JobDescription): Promise<ATSAnalysis> => {
    try {
      const resumeText = `
        ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}
        ${resume.personalInfo.title}
        ${resume.summary}
        
        Work Experience:
        ${resume.workExperience.map(exp => `
          ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
          ${exp.description}
          Achievements: ${exp.achievements.join(', ')}
        `).join('\n')}
        
        Education:
        ${resume.education.map(edu => `
          ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.current ? 'Present' : edu.endDate})
          ${edu.description}
        `).join('\n')}
        
        Skills:
        ${resume.skills.map(skill => skill.name).join(', ')}
        
        Projects:
        ${resume.projects.map(project => `
          ${project.name}: ${project.description}
          Technologies: ${project.technologies.join(', ')}
        `).join('\n')}
        
        Certifications:
        ${resume.certifications.map(cert => `
          ${cert.name} by ${cert.issuer} (${cert.date})
        `).join('\n')}
      `;

      const jobText = `
        Job Title: ${jobDescription.title}
        Company: ${jobDescription.company}
        Description: ${jobDescription.description}
        Required Skills: ${jobDescription.skills.join(', ')}
      `;

      const prompt = `
        You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume for its compatibility with the job description.
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobText}
        
        Provide a detailed analysis in this JSON format:
        {
          "score": [a score from 0-100 representing how well the resume matches the job],
          "missingKeywords": [array of important keywords from the job description that are missing in the resume],
          "suggestions": [array of specific suggestions to improve the resume for this job],
          "keywordMatches": [
            {
              "keyword": [a keyword that appears in both resume and job description],
              "count": [how many times it appears in the resume],
              "importance": [a number from 1-10 indicating how important this keyword is for the job]
            }
          ],
          "sectionFeedback": [
            {
              "section": [name of resume section],
              "score": [a score from 0-100 for this section],
              "feedback": [specific feedback for this section]
            }
          ]
        }
        
        Only return the JSON. No explanations or other text.
      `;

      const response = await geminiApi.post(
        `/${MODEL}:generateContent`,
        generatePrompt(prompt)
      );

      const analysisText = response.data.text || '{}';
      // Extract the JSON part from the text
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                        analysisText.match(/{[\s\S]*}/);
      
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : '{}';
      const analysis = JSON.parse(jsonStr) as ATSAnalysis;

      return {
        score: analysis.score || 0,
        missingKeywords: analysis.missingKeywords || [],
        suggestions: analysis.suggestions || [],
        keywordMatches: analysis.keywordMatches || [],
        sectionFeedback: analysis.sectionFeedback || []
      };
    } catch (error) {
      console.error('Error analyzing job match:', error);
      return {
        score: 0,
        missingKeywords: [],
        suggestions: ['Error analyzing resume. Please try again.'],
        keywordMatches: [],
        sectionFeedback: []
      };
    }
  },

  // Improve work experience description
  improveDescription: async (description: string, position: string, company: string): Promise<string> => {
    try {
      const prompt = `
        Improve the following work experience description for a ${position} position at ${company}. 
        Make it more impactful, quantitative when possible, and optimized for ATS systems.
        Use active voice, focus on achievements, and keep it concise yet comprehensive.
        
        Original Description:
        ${description}
        
        Improved Description (in approximately the same length):
      `;

      const response = await geminiApi.post<GeminiAPIResponse>(
        `/${MODEL}:generateContent`,
        generatePrompt(prompt)
      );

      return response.data.text || description;
    } catch (error) {
      console.error('Error improving description:', error);
      return description;
    }
  },

  // Generate skill suggestions based on job title
  suggestSkills: async (jobTitle: string): Promise<string[]> => {
    try {
      const prompt = `
        Generate a list of 10-15 relevant technical and soft skills for a ${jobTitle} position.
        Consider both technical skills and soft skills that would be valuable for this role.
        Only return the list of skills separated by commas, no other text.
      `;

      const response = await geminiApi.post<GeminiAPIResponse>(
        `/${MODEL}:generateContent`,
        generatePrompt(prompt)
      );

      if (!response.data.text) return [];

      // Parse the comma-separated list
      return response.data.text
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    } catch (error) {
      console.error('Error suggesting skills:', error);
      return [];
    }
  },

  // Extract keywords from job description
  extractKeywords: async (jobDescription: string): Promise<string[]> => {
    try {
      const prompt = `
        Extract the most important keywords from the following job description that 
        should appear in a resume to pass ATS screening. Focus on hard skills, 
        technical competencies, and specific qualifications mentioned.
        
        Job Description:
        ${jobDescription}
        
        Return only a list of 10-15 keywords separated by commas, nothing else.
      `;

      const response = await geminiApi.post<GeminiAPIResponse>(
        `/${MODEL}:generateContent`,
        generatePrompt(prompt)
      );

      if (!response.data.text) return [];

      // Parse the comma-separated list
      return response.data.text
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }
};

export default api;