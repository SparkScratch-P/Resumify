import React from 'react';
import Input from '../../ui/Input';
import { Mail, Phone, MapPin, Linkedin, Globe, User, Briefcase } from 'lucide-react';
import useResumeStore from '../../../store/resumeStore';
import type { PersonalInfo } from '../../../types';

const PersonalInfoSection: React.FC = () => {
  const { getCurrentResume, updatePersonalInfo } = useResumeStore();
  const resume = getCurrentResume();
  
  if (!resume) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value } as Partial<PersonalInfo>);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
      <p className="text-gray-600 text-sm">
        This information will appear at the top of your resume.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          id="firstName"
          name="firstName"
          value={resume.personalInfo.firstName}
          onChange={handleChange}
          icon={<User size={16} />}
          placeholder="John"
          autoComplete="given-name"
          required
        />
        
        <Input
          label="Last Name"
          id="lastName"
          name="lastName"
          value={resume.personalInfo.lastName}
          onChange={handleChange}
          icon={<User size={16} />}
          placeholder="Doe"
          autoComplete="family-name"
          required
        />
      </div>
      
      <Input
        label="Job Title"
        id="title"
        name="title"
        value={resume.personalInfo.title}
        onChange={handleChange}
        icon={<Briefcase size={16} />}
        placeholder="Software Engineer"
        helperText="Your current position or desired role"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={resume.personalInfo.email}
          onChange={handleChange}
          icon={<Mail size={16} />}
          placeholder="john.doe@example.com"
          autoComplete="email"
          required
        />
        
        <Input
          label="Phone"
          id="phone"
          name="phone"
          value={resume.personalInfo.phone}
          onChange={handleChange}
          icon={<Phone size={16} />}
          placeholder="(123) 456-7890"
          autoComplete="tel"
        />
      </div>
      
      <Input
        label="Location"
        id="location"
        name="location"
        value={resume.personalInfo.location}
        onChange={handleChange}
        icon={<MapPin size={16} />}
        placeholder="San Francisco, CA"
        helperText="City, State or City, Country"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LinkedIn"
          id="linkedin"
          name="linkedin"
          value={resume.personalInfo.linkedin}
          onChange={handleChange}
          icon={<Linkedin size={16} />}
          placeholder="linkedin.com/in/johndoe"
          helperText="LinkedIn profile URL or username"
        />
        
        <Input
          label="Website"
          id="website"
          name="website"
          value={resume.personalInfo.website}
          onChange={handleChange}
          icon={<Globe size={16} />}
          placeholder="johndoe.com"
          helperText="Personal website or portfolio URL"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;