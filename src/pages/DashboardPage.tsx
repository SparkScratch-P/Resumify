import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  FilePlus, 
  FileText, 
  Clock, 
  Edit, 
  Trash2, 
  FileSpreadsheet,
  FileCheck,
  UserRound,
  Briefcase,
  Sparkles
} from 'lucide-react';
import useResumeStore from '../store/resumeStore';
import { calculateCompleteness, formatDate } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { resumes, setCurrentResumeId, deleteResume } = useResumeStore();
  
  // Sort resumes by updatedAt date (most recent first)
  const sortedResumes = [...resumes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your resumes and optimize for job applications</p>
        </div>
        <Link to="/resume/new">
          <Button variant="primary" icon={<FilePlus size={16} />}>
            New Resume
          </Button>
        </Link>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-800">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Resumes</h2>
              <p className="text-2xl font-semibold text-gray-900">{resumes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800">
              <FileCheck size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">ATS Optimized</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {resumes.filter(resume => resume.atsScore !== null && resume.atsScore >= 70).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Last Updated</h2>
              <p className="text-lg font-semibold text-gray-900">
                {resumes.length > 0 
                  ? formatDate(sortedResumes[0].updatedAt)
                  : 'No resumes yet'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Your Resumes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Resumes</h2>
        
        {resumes.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
            <div className="mt-6">
              <Link to="/resume/new">
                <Button variant="primary" size="lg" icon={<FilePlus size={16} />}>
                  Create a Resume
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResumes.map((resume) => {
              const completeness = calculateCompleteness(resume);
              const fullName = resume.personalInfo.firstName && resume.personalInfo.lastName
                ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
                : 'Untitled Resume';
              
              return (
                <Card key={resume.id} className="hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {fullName}
                      </h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setCurrentResumeId(resume.id);
                            window.location.href = `/resume/${resume.id}`;
                          }}
                          className="p-1 text-gray-500 hover:text-primary-600"
                          aria-label="Edit resume"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this resume?')) {
                              deleteResume(resume.id);
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-error-600"
                          aria-label="Delete resume"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <UserRound size={14} className="mr-1" />
                        <span>
                          {resume.personalInfo.title || 'No title specified'}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Briefcase size={14} className="mr-1" />
                        <span>
                          {resume.workExperience.length > 0
                            ? `${resume.workExperience.length} work experience entries`
                            : 'No work experience added'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Sparkles size={14} className="mr-1" />
                        <span>
                          {resume.skills.length > 0
                            ? `${resume.skills.length} skills`
                            : 'No skills added'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completeness</span>
                        <span className="text-sm font-medium text-gray-900">{completeness}%</span>
                      </div>
                      <ProgressBar value={completeness} size="sm" />
                    </div>
                    
                    <div className="pt-2">
                      {resume.atsScore !== null ? (
                        <div className="flex items-center text-sm">
                          <FileSpreadsheet size={14} className="mr-1" />
                          <span>
                            ATS Score: 
                            <span className={`ml-1 font-medium ${
                              resume.atsScore >= 80 ? 'text-success-600' : 
                              resume.atsScore >= 60 ? 'text-primary-600' : 
                              'text-warning-600'
                            }`}>
                              {resume.atsScore}/100
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <FileSpreadsheet size={14} className="mr-1" />
                          <span>Not ATS analyzed yet</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                      <span>Created: {formatDate(resume.createdAt)}</span>
                      <span>Updated: {formatDate(resume.updatedAt)}</span>
                    </div>
                    
                    <div className="pt-2">
                      <Link to={`/resume/${resume.id}`}>
                        <Button variant="outline" fullWidth>
                          Edit Resume
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {/* Create New Resume Card */}
            <Link to="/resume/new" className="block">
              <Card className="border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <FilePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-600" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Create a new resume</h3>
                </div>
              </Card>
            </Link>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center py-6">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-primary-600 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">ATS Analysis</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check how your resume performs with ATS systems
            </p>
            <div className="mt-4">
              <Link to="/ats">
                <Button variant="outline" fullWidth>
                  Analyze Your Resume
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center py-6">
            <Sparkles className="mx-auto h-8 w-8 text-secondary-600 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get AI-powered suggestions for your resume
            </p>
            <div className="mt-4">
              <Link to="/assistant">
                <Button variant="outline" fullWidth>
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center py-6">
            <FilePlus className="mx-auto h-8 w-8 text-accent-600 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">Create Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start building a new ATS-optimized resume
            </p>
            <div className="mt-4">
              <Link to="/resume/new">
                <Button variant="primary" fullWidth>
                  New Resume
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;