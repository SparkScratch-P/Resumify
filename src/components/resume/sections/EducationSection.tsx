import React, { useState } from 'react';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Button from '../../ui/Button';
import { 
  Building, 
  GraduationCap,
  MapPin,
  Calendar, 
  Trash2, 
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useResumeStore from '../../../store/resumeStore';
import type { Education } from '../../../types';

const EducationSection: React.FC = () => {
  const { getCurrentResume, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const resume = getCurrentResume();
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  if (!resume) return null;
  
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleAddEducation = () => {
    const newItemId = addEducation();
    // Expand the new item automatically
    setExpandedItems(prev => ({
      ...prev,
      [newItemId]: true
    }));
  };
  
  const handleChange = (id: string, field: keyof Education, value: string | boolean) => {
    updateEducation(id, { [field]: value } as Partial<Education>);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Education</h2>
          <p className="text-gray-600 text-sm">
            Add your educational background, starting with the most recent degree.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddEducation}
        >
          Add Education
        </Button>
      </div>
      
      {resume.education.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No education added</h3>
          <p className="mt-1 text-sm text-gray-500">Add your degrees and educational background.</p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={handleAddEducation}
            >
              Add Education
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {resume.education.map((education) => {
            const isExpanded = expandedItems[education.id] ?? false;
            
            return (
              <div
                key={education.id}
                className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(education.id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {education.degree || 'New Degree'} {education.field ? `in ${education.field}` : ''}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {education.institution || 'Institution Name'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEducation(education.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => toggleExpand(education.id)}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Degree"
                        id={`degree-${education.id}`}
                        value={education.degree}
                        onChange={(e) => handleChange(education.id, 'degree', e.target.value)}
                        icon={<GraduationCap size={16} />}
                        placeholder="Bachelor of Science"
                        required
                      />
                      
                      <Input
                        label="Field of Study"
                        id={`field-${education.id}`}
                        value={education.field}
                        onChange={(e) => handleChange(education.id, 'field', e.target.value)}
                        icon={<GraduationCap size={16} />}
                        placeholder="Computer Science"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Institution"
                        id={`institution-${education.id}`}
                        value={education.institution}
                        onChange={(e) => handleChange(education.id, 'institution', e.target.value)}
                        icon={<Building size={16} />}
                        placeholder="University of California"
                        required
                      />
                      
                      <Input
                        label="Location"
                        id={`location-${education.id}`}
                        value={education.location}
                        onChange={(e) => handleChange(education.id, 'location', e.target.value)}
                        icon={<MapPin size={16} />}
                        placeholder="Berkeley, CA"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        id={`startDate-${education.id}`}
                        type="month"
                        value={education.startDate}
                        onChange={(e) => handleChange(education.id, 'startDate', e.target.value)}
                        icon={<Calendar size={16} />}
                        required
                      />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`current-${education.id}`}
                            checked={education.current}
                            onChange={(e) => handleChange(education.id, 'current', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-${education.id}`} className="ml-2 block text-sm text-gray-700">
                            I'm currently studying here
                          </label>
                        </div>
                        
                        {!education.current && (
                          <Input
                            label="End Date"
                            id={`endDate-${education.id}`}
                            type="month"
                            value={education.endDate}
                            onChange={(e) => handleChange(education.id, 'endDate', e.target.value)}
                            icon={<Calendar size={16} />}
                            required
                          />
                        )}
                      </div>
                    </div>
                    
                    <Input
                      label="GPA (Optional)"
                      id={`gpa-${education.id}`}
                      value={education.gpa}
                      onChange={(e) => handleChange(education.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                      helperText="Enter your GPA if relevant to your field"
                    />
                    
                    <TextArea
                      label="Description (Optional)"
                      id={`description-${education.id}`}
                      value={education.description}
                      onChange={(e) => handleChange(education.id, 'description', e.target.value)}
                      placeholder="Describe relevant coursework, honors, activities, or research..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {resume.education.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleAddEducation}
          >
            Add Another Education
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationSection;