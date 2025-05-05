import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ATSOptimizationSection from '../components/resume/sections/ATSOptimizationSection';
import ResumePreview from '../components/resume/ResumePreview';
import useResumeStore from '../store/resumeStore';
import { FileSpreadsheet, FileText } from 'lucide-react';

const ATSPage: React.FC = () => {
  const { resumes, currentResumeId, setCurrentResumeId, atsAnalysis } = useResumeStore();
  
  // If there's no current resume, use the first one if available
  React.useEffect(() => {
    if (resumes.length > 0 && !currentResumeId) {
      setCurrentResumeId(resumes[0].id);
    }
  }, [resumes, currentResumeId, setCurrentResumeId]);
  
  const currentResume = useResumeStore(state => state.getCurrentResume());
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ATS Optimization</h1>
        <p className="text-gray-600">Check how your resume performs with Applicant Tracking Systems</p>
      </div>
      
      {/* Select Resume Section */}
      {resumes.length > 0 ? (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary-600">
              <FileText size={20} />
              <h2 className="font-medium">Select a Resume to Analyze</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {resumes.map((resume) => {
                const isActive = resume.id === currentResumeId;
                const fullName = resume.personalInfo.firstName && resume.personalInfo.lastName
                  ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
                  : 'Untitled Resume';
                
                return (
                  <button
                    key={resume.id}
                    onClick={() => setCurrentResumeId(resume.id)}
                    className={`block text-left p-4 rounded-lg border ${
                      isActive 
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate mb-1">
                      {fullName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {resume.personalInfo.title || 'No title specified'}
                    </div>
                  </button>
                );
              })}
              
              <Link to="/resume/new" className="block">
                <div className="h-full flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
                  <div className="text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      New Resume
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes to analyze</h3>
          <p className="mt-1 text-sm text-gray-500">Create a resume first to check ATS compatibility.</p>
          <div className="mt-6">
            <Link to="/resume/new">
              <Button variant="primary">
                Create a Resume
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {currentResume && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis Section */}
          <div>
            <ATSOptimizationSection />
          </div>
          
          {/* Preview Section */}
          <div className="sticky top-6">
            <ResumePreview 
              resume={currentResume} 
              atsScore={atsAnalysis?.score || currentResume.atsScore} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSPage;