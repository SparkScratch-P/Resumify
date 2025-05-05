import React from 'react';
import type { Resume } from '../../types';
import { formatDate } from '../../lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
  atsScore?: number | null;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, atsScore = null }) => {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = resume;

  // Function to get ATS score color
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-primary-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* ATS Score Indicator */}
      {atsScore !== null && (
        <div className={`p-3 flex items-center justify-between ${parseInt(String(atsScore)) >= 70 ? 'bg-success-50' : 'bg-warning-50'}`}>
          <div className="flex items-center">
            {parseInt(String(atsScore)) >= 70 ? (
              <CheckCircle2 className="text-success-600 mr-2" size={18} />
            ) : (
              <AlertCircle className="text-warning-600 mr-2" size={18} />
            )}
            <span className="text-sm font-medium">
              {parseInt(String(atsScore)) >= 70 
                ? 'ATS-Friendly Resume' 
                : 'Resume needs optimization'}
            </span>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(atsScore)}`}>
            {atsScore}/100
          </div>
        </div>
      )}

      <div className="p-6 pt-8">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <div className="text-lg text-gray-700 mt-1">{personalInfo.title}</div>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
            {personalInfo.website && <div>{personalInfo.website}</div>}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((work) => (
                <div key={work.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{work.position}</h3>
                      <div className="text-gray-700">{work.company}{work.location ? `, ${work.location}` : ''}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(work.startDate)} - {work.current ? 'Present' : formatDate(work.endDate)}
                    </div>
                  </div>
                  {work.description && (
                    <p className="mt-2 text-gray-700 text-sm">{work.description}</p>
                  )}
                  {work.achievements.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 pl-2">
                      {work.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <div className="text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.gpa && <div className="mt-1 text-sm text-gray-600">GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <p className="mt-2 text-gray-700 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    {(project.startDate || project.endDate) && (
                      <div className="text-sm text-gray-600">
                        {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate)}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-1 text-gray-700 text-sm">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-sm text-primary-600 hover:underline inline-block"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{cert.name}</div>
                    <div className="text-sm text-gray-700">{cert.issuer}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.date)}
                    {cert.expires && cert.expiryDate && (
                      <> - {formatDate(cert.expiryDate)}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;