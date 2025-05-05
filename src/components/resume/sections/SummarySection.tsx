import React, { useState } from 'react';
import TextArea from '../../ui/TextArea';
import Button from '../../ui/Button';
import { Wand2 } from 'lucide-react';
import useResumeStore from '../../../store/resumeStore';
import { api } from '../../../lib/api';

const SummarySection: React.FC = () => {
  const { getCurrentResume, updateSummary, setLoading, loading } = useResumeStore();
  const resume = getCurrentResume();
  const [localSummary, setLocalSummary] = useState(resume?.summary || '');
  
  if (!resume) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSummary(e.target.value);
  };

  const handleBlur = () => {
    if (localSummary !== resume.summary) {
      updateSummary(localSummary);
    }
  };

  const handleGenerateSummary = async () => {
    if (!resume) return;
    
    setLoading('generatingContent', true);
    
    try {
      const generatedSummary = await api.generateSummary(resume);
      setLocalSummary(generatedSummary);
      updateSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading('generatingContent', false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
          <p className="text-gray-600 text-sm">
            A compelling summary of your qualifications and career highlights.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Wand2 size={16} />}
          onClick={handleGenerateSummary}
          isLoading={loading.generatingContent}
          disabled={loading.generatingContent}
        >
          Generate with AI
        </Button>
      </div>
      
      <TextArea
        label="Summary"
        id="summary"
        value={localSummary}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Write a compelling summary of your professional experience, skills, and achievements..."
        rows={5}
        className="resize-none"
        helperText="Keep your summary concise (3-4 sentences) and focused on your most relevant qualifications."
      />
    </div>
  );
};

export default SummarySection;