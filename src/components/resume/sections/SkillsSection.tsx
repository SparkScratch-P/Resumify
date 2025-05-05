import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Badge from '../../ui/Badge';
import { 
  Trash2, 
  Plus,
  Wand2 
} from 'lucide-react';
import useResumeStore from '../../../store/resumeStore';
import type { Skill, SkillLevel } from '../../../types';
import { api } from '../../../lib/api';

const SkillsSection: React.FC = () => {
  const { getCurrentResume, addSkill, updateSkill, deleteSkill, setLoading, loading } = useResumeStore();
  const resume = getCurrentResume();
  
  const [newSkill, setNewSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('intermediate');
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [jobTitle, setJobTitle] = useState('');
  
  if (!resume) return null;
  
  const skillLevels: { value: SkillLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];
  
  const skillCategories = [
    { value: 'Technical', label: 'Technical' },
    { value: 'Soft', label: 'Soft Skills' },
    { value: 'Language', label: 'Languages' },
    { value: 'Tool', label: 'Tools & Software' },
    { value: 'Domain', label: 'Domain Knowledge' }
  ];
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({
        name: newSkill.trim(),
        level: selectedLevel,
        category: selectedCategory
      });
      setNewSkill('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };
  
  const handleSuggestSkills = async () => {
    if (!jobTitle.trim()) return;
    
    setLoading('generatingContent', true);
    
    try {
      const suggestedSkills = await api.suggestSkills(jobTitle);
      
      if (suggestedSkills.length > 0) {
        // Add each suggested skill that doesn't already exist
        const existingSkillNames = new Set(resume.skills.map(skill => skill.name.toLowerCase()));
        
        let category = 'Technical';
        for (const skillName of suggestedSkills) {
          // Skip if the skill already exists in the resume
          if (!existingSkillNames.has(skillName.toLowerCase())) {
            // Alternate between Technical and Soft skills for variety
            if (category === 'Technical') {
              category = 'Soft';
            } else {
              category = 'Technical';
            }
            
            addSkill({
              name: skillName,
              level: 'intermediate',
              category
            });
          }
        }
      }
    } catch (error) {
      console.error('Error suggesting skills:', error);
    } finally {
      setLoading('generatingContent', false);
    }
  };
  
  const getLevelBadgeVariant = (level: SkillLevel) => {
    switch (level) {
      case 'beginner': return 'default';
      case 'intermediate': return 'primary';
      case 'advanced': return 'secondary';
      case 'expert': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
        <p className="text-gray-600 text-sm">
          Add your technical and professional skills. These are important for ATS filtering.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Skill"
          id="new-skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="JavaScript"
          className="col-span-1"
        />
        
        <Select
          label="Level"
          id="skill-level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value as SkillLevel)}
          options={skillLevels}
          className="col-span-1"
        />
        
        <Select
          label="Category"
          id="skill-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={skillCategories}
          className="col-span-1"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddSkill}
        >
          Add Skill
        </Button>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">AI Skill Suggestions</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-end gap-4">
            <Input
              label="Job Title"
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
              helperText="Enter a job title to get relevant skill suggestions"
              className="flex-1"
            />
            
            <Button
              variant="outline"
              size="md"
              icon={<Wand2 size={16} />}
              onClick={handleSuggestSkills}
              isLoading={loading.generatingContent}
              disabled={!jobTitle.trim() || loading.generatingContent}
              className="mb-4"
            >
              Suggest Skills
            </Button>
          </div>
        </div>
      </div>
      
      {resume.skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Your Skills</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {resume.skills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between bg-white rounded-md border border-gray-200 p-2"
              >
                <div className="flex items-center space-x-2">
                  <Badge variant={getLevelBadgeVariant(skill.level)} size="sm">
                    {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                  </Badge>
                  <span className="text-gray-900 font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">{skill.category}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={() => deleteSkill(skill.id)}
                    aria-label={`Remove ${skill.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;