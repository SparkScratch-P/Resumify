import React, { useState } from 'react';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import ProgressBar from '../../ui/ProgressBar';
import useResumeStore from '../../../store/resumeStore';
import { api } from '../../../lib/api';
import { AlertCircle, CheckCircle, ArrowRight, Zap, FileText, SearchCode } from 'lucide-react';
import type { JobDescription } from '../../../types';

const ATSOptimizationSection: React.FC = () => {
  const { 
    getCurrentResume, 
    setATSAnalysis, 
    atsAnalysis, 
    setActiveJobDescription, 
    activeJobDescription,
    setLoading,
    loading
  } = useResumeStore();
  const resume = getCurrentResume();
  
  const [jobTitle, setJobTitle] = useState(activeJobDescription?.title || '');
  const [company, setCompany] = useState(activeJobDescription?.company || '');
  const [jobDescription, setJobDescription] = useState(activeJobDescription?.description || '');
  
  if (!resume) return null;
  
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    
    const job: JobDescription = {
      title: jobTitle.trim() || 'Not specified',
      company: company.trim() || 'Not specified',
      description: jobDescription.trim(),
      skills: [],
      keywords: []
    };
    
    setActiveJobDescription(job);
    setLoading('analyzingResume', true);
    
    try {
      // First, extract keywords from the job description
      const keywords = await api.extractKeywords(jobDescription);
      job.keywords = keywords;
      
      // Then analyze the resume against the job description
      const analysis = await api.analyzeJobMatch(resume, job);
      setATSAnalysis(analysis);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading('analyzingResume', false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">ATS Optimization</h2>
        <p className="text-gray-600 text-sm">
          Check how your resume performs against Applicant Tracking Systems (ATS) for a specific job.
        </p>
      </div>
      
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary-600 mb-2">
            <FileText size={20} />
            <h3 className="font-medium">Job Description Analysis</h3>
          </div>
          
          <p className="text-sm text-gray-600">
            Paste a job description to analyze how well your resume matches. 
            Our AI will identify keywords and provide recommendations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextArea
              label="Job Title (Optional)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Software Engineer"
            />
            
            <TextArea
              label="Company (Optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>
          
          <TextArea
            label="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            required
          />
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              icon={<SearchCode size={16} />}
              onClick={handleAnalyze}
              isLoading={loading.analyzingResume}
              disabled={!jobDescription.trim() || loading.analyzingResume}
            >
              Analyze Resume
            </Button>
          </div>
        </div>
      </Card>
      
      {atsAnalysis && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary-600 mb-2">
                <Zap size={20} />
                <h3 className="font-medium">ATS Score</h3>
              </div>
              
              <ProgressBar
                value={atsAnalysis.score}
                max={100}
                showValue
                size="lg"
              />
              
              <div className="mt-4">
                {atsAnalysis.score >= 80 ? (
                  <div className="flex items-start p-4 bg-success-50 text-success-800 rounded-md">
                    <CheckCircle className="mt-0.5 mr-3 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium">Excellent Match!</p>
                      <p className="text-sm mt-1">Your resume is well-optimized for this position. You have a strong chance of passing ATS screening.</p>
                    </div>
                  </div>
                ) : atsAnalysis.score >= 60 ? (
                  <div className="flex items-start p-4 bg-primary-50 text-primary-800 rounded-md">
                    <CheckCircle className="mt-0.5 mr-3 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium">Good Match</p>
                      <p className="text-sm mt-1">Your resume matches many requirements, but could use some improvements to maximize your chances.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start p-4 bg-warning-50 text-warning-800 rounded-md">
                    <AlertCircle className="mt-0.5 mr-3 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium">Needs Improvement</p>
                      <p className="text-sm mt-1">Your resume may not pass ATS screening for this job. Review the suggestions below to optimize your resume.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <Card>
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Missing Keywords</h3>
                {atsAnalysis.missingKeywords.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      Consider adding these important keywords to your resume:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {atsAnalysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="warning">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Great job! You've covered all the important keywords for this position.
                  </p>
                )}
              </div>
            </Card>
            
            {/* Matched Keywords */}
            <Card>
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Matched Keywords</h3>
                {atsAnalysis.keywordMatches.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      These keywords in your resume match the job requirements:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {atsAnalysis.keywordMatches.map((match, index) => (
                        <Badge 
                          key={index} 
                          variant={match.importance >= 8 ? 'success' : 'primary'}
                        >
                          {match.keyword}
                          {match.count > 1 && <span className="ml-1 text-xs">({match.count})</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No matching keywords found. Try to incorporate keywords from the job description.
                  </p>
                )}
              </div>
            </Card>
          </div>
          
          <Card>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Suggestions</h3>
              <ul className="space-y-3">
                {atsAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="text-primary-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          
          <Card>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Section Feedback</h3>
              <div className="space-y-4">
                {atsAnalysis.sectionFeedback.map((feedback, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{feedback.section}</h4>
                      <span className={`text-sm font-medium ${
                        feedback.score >= 80 ? 'text-success-600' : 
                        feedback.score >= 60 ? 'text-primary-600' : 
                        'text-warning-600'
                      }`}>
                        {feedback.score}/100
                      </span>
                    </div>
                    <ProgressBar
                      value={feedback.score}
                      variant={
                        feedback.score >= 80 ? 'success' : 
                        feedback.score >= 60 ? 'primary' : 
                        'warning'
                      }
                      size="sm"
                    />
                    <p className="text-sm text-gray-600 mt-2">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ATSOptimizationSection;