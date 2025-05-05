import React, { useState } from 'react';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Button from '../../ui/Button';
import { 
  Building, 
  Briefcase,
  MapPin,
  Calendar, 
  Trash2, 
  Plus,
  ChevronDown,
  ChevronUp,
  Wand2 
} from 'lucide-react';
import useResumeStore from '../../../store/resumeStore';
import type { WorkExperience } from '../../../types';
import { api } from '../../../lib/api';

const WorkExperienceSection: React.FC = () => {
  const { getCurrentResume, addWorkExperience, updateWorkExperience, deleteWorkExperience, setLoading, loading } = useResumeStore();
  const resume = getCurrentResume();
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [improvingDescription, setImprovingDescription] = useState<string | null>(null);
  
  if (!resume) return null;
  
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleAddExperience = () => {
    const newItemId = addWorkExperience();
    // Expand the new item automatically
    setExpandedItems(prev => ({
      ...prev,
      [newItemId]: true
    }));
  };
  
  const handleChange = (id: string, field: keyof WorkExperience, value: string | boolean | string[]) => {
    updateWorkExperience(id, { [field]: value } as Partial<WorkExperience>);
  };
  
  const handleAddAchievement = (id: string) => {
    const experience = resume.workExperience.find(exp => exp.id === id);
    if (experience) {
      const achievements = [...experience.achievements, ''];
      updateWorkExperience(id, { achievements });
    }
  };
  
  const handleUpdateAchievement = (id: string, index: number, value: string) => {
    const experience = resume.workExperience.find(exp => exp.id === id);
    if (experience) {
      const achievements = [...experience.achievements];
      achievements[index] = value;
      updateWorkExperience(id, { achievements });
    }
  };
  
  const handleRemoveAchievement = (id: string, index: number) => {
    const experience = resume.workExperience.find(exp => exp.id === id);
    if (experience) {
      const achievements = experience.achievements.filter((_, i) => i !== index);
      updateWorkExperience(id, { achievements });
    }
  };
  
  const handleImproveDescription = async (id: string) => {
    const experience = resume.workExperience.find(exp => exp.id === id);
    if (!experience || !experience.description) return;
    
    setImprovingDescription(id);
    setLoading('generatingContent', true);
    
    try {
      const improvedDescription = await api.improveDescription(
        experience.description,
        experience.position,
        experience.company
      );
      
      updateWorkExperience(id, { description: improvedDescription });
    } catch (error) {
      console.error('Error improving description:', error);
    } finally {
      setImprovingDescription(null);
      setLoading('generatingContent', false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
          <p className="text-gray-600 text-sm">
            Add your relevant work history, starting with the most recent position.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddExperience}
        >
          Add Experience
        </Button>
      </div>
      
      {resume.workExperience.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No work experience added</h3>
          <p className="mt-1 text-sm text-gray-500">Add your work history to strengthen your resume.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={handleAddExperience}
            >
              Add Work Experience
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {resume.workExperience.map((experience) => {
            const isExpanded = expandedItems[experience.id] ?? false;
            
            return (
              <div
                key={experience.id}
                className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(experience.id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {experience.position || 'New Position'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {experience.company || 'Company Name'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkExperience(experience.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => toggleExpand(experience.id)}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        id={`position-${experience.id}`}
                        value={experience.position}
                        onChange={(e) => handleChange(experience.id, 'position', e.target.value)}
                        icon={<Briefcase size={16} />}
                        placeholder="Senior Software Engineer"
                        required
                      />
                      
                      <Input
                        label="Company"
                        id={`company-${experience.id}`}
                        value={experience.company}
                        onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                        icon={<Building size={16} />}
                        placeholder="Acme Inc."
                        required
                      />
                    </div>
                    
                    <Input
                      label="Location"
                      id={`location-${experience.id}`}
                      value={experience.location}
                      onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
                      icon={<MapPin size={16} />}
                      placeholder="San Francisco, CA"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        id={`startDate-${experience.id}`}
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => handleChange(experience.id, 'startDate', e.target.value)}
                        icon={<Calendar size={16} />}
                        required
                      />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`current-${experience.id}`}
                            checked={experience.current}
                            onChange={(e) => handleChange(experience.id, 'current', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-${experience.id}`} className="ml-2 block text-sm text-gray-700">
                            I currently work here
                          </label>
                        </div>
                        
                        {!experience.current && (
                          <Input
                            label="End Date"
                            id={`endDate-${experience.id}`}
                            type="month"
                            value={experience.endDate}
                            onChange={(e) => handleChange(experience.id, 'endDate', e.target.value)}
                            icon={<Calendar size={16} />}
                            required
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor={`description-${experience.id}`} className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Wand2 size={16} />}
                          onClick={() => handleImproveDescription(experience.id)}
                          isLoading={improvingDescription === experience.id}
                          disabled={!experience.description || improvingDescription !== null}
                        >
                          Improve
                        </Button>
                      </div>
                      <TextArea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) => handleChange(experience.id, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and accomplishments..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Achievements
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Plus size={16} />}
                          onClick={() => handleAddAchievement(experience.id)}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {experience.achievements.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          Add specific accomplishments to highlight your impact.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {experience.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                id={`achievement-${experience.id}-${index}`}
                                value={achievement}
                                onChange={(e) => handleUpdateAchievement(experience.id, index, e.target.value)}
                                placeholder="Increased revenue by 20% through process optimization"
                                className="flex-1"
                              />
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 p-1"
                                onClick={() => handleRemoveAchievement(experience.id, index)}
                                aria-label="Remove achievement"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {resume.workExperience.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleAddExperience}
          >
            Add Another Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceSection;