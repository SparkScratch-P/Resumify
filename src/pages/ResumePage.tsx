import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PersonalInfoSection from '../components/resume/sections/PersonalInfoSection';
import SummarySection from '../components/resume/sections/SummarySection';
import WorkExperienceSection from '../components/resume/sections/WorkExperienceSection';
import EducationSection from '../components/resume/sections/EducationSection';
import SkillsSection from '../components/resume/sections/SkillsSection';
import ATSOptimizationSection from '../components/resume/sections/ATSOptimizationSection';
import ResumePreview from '../components/resume/ResumePreview';
import ExportOptions from '../components/resume/ExportOptions';
import useResumeStore from '../store/resumeStore';
import { calculateCompleteness } from '../lib/utils';
import { ArrowLeft, Eye, Save } from 'lucide-react';

const ResumePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getCurrentResume, 
    createResume, 
    setCurrentResumeId, 
    atsAnalysis 
  } = useResumeStore();
  
  const [activeTab, setActiveTab] = React.useState('personalInfo');
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Handle "new" resume or load existing one
  useEffect(() => {
    if (id === 'new') {
      const newResumeId = createResume();
      navigate(`/resume/${newResumeId}`, { replace: true });
    } else if (id) {
      setCurrentResumeId(id);
    }
  }, [id, createResume, navigate, setCurrentResumeId]);
  
  const resume = getCurrentResume();
  
  // If no resume is found, redirect to dashboard
  useEffect(() => {
    if (!resume && id !== 'new') {
      navigate('/dashboard');
    }
  }, [resume, id, navigate]);
  
  if (!resume) return null;
  
  const completeness = calculateCompleteness(resume);
  
  const tabSections = [
    { id: 'personalInfo', label: 'Personal Info', component: <PersonalInfoSection /> },
    { id: 'summary', label: 'Summary', component: <SummarySection /> },
    { id: 'workExperience', label: 'Experience', component: <WorkExperienceSection /> },
    { id: 'education', label: 'Education', component: <EducationSection /> },
    { id: 'skills', label: 'Skills', component: <SkillsSection /> },
    { id: 'atsOptimization', label: 'ATS Optimization', component: <ATSOptimizationSection /> },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {resume.personalInfo.firstName || resume.personalInfo.lastName 
                ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}'s Resume`
                : 'New Resume'}
            </h1>
            <p className="text-gray-600">
              {resume.personalInfo.title || 'Add your details to get started'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => {
              const previewWindow = window.open('', '_blank');
              if (previewWindow && previewRef.current) {
                previewWindow.document.write(`
                  <html>
                    <head>
                      <title>Resume Preview</title>
                      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                      <style>
                        body { 
                          font-family: 'Inter', sans-serif;
                          margin: 0;
                          padding: 20px;
                          background-color: #f3f4f6;
                        }
                        .container {
                          max-width: 800px;
                          margin: 0 auto;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        ${previewRef.current.outerHTML}
                      </div>
                    </body>
                  </html>
                `);
                previewWindow.document.close();
              }
            }}
          >
            Preview
          </Button>
          <ExportOptions resume={resume} previewRef={previewRef} />
        </div>
      </div>
      
      {/* Completeness Indicator */}
      <Card>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-700">Resume Completeness</h2>
            <span className="text-sm font-medium text-gray-900">{completeness}%</span>
          </div>
          <ProgressBar value={completeness} size="md" />
          <p className="text-xs text-gray-500 mt-1">
            {completeness < 50 ? (
              'Complete more sections to create a stronger resume.'
            ) : completeness < 80 ? (
              'Good progress! Continue adding details to strengthen your resume.'
            ) : (
              'Your resume is looking great! Consider ATS optimization for the final touches.'
            )}
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div>
          <Card>
            <Tabs>
              <TabList variant="underline">
                {tabSections.map((section) => (
                  <TabTrigger
                    key={section.id}
                    value={section.id}
                    isActive={activeTab === section.id}
                    onClick={() => setActiveTab(section.id)}
                  >
                    {section.label}
                  </TabTrigger>
                ))}
              </TabList>
              
              {tabSections.map((section) => (
                <TabContent 
                  key={section.id} 
                  value={section.id} 
                  isActive={activeTab === section.id}
                >
                  {section.component}
                </TabContent>
              ))}
            </Tabs>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="sticky top-6">
          <div ref={previewRef}>
            <ResumePreview 
              resume={resume} 
              atsScore={atsAnalysis?.score || resume.atsScore} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;