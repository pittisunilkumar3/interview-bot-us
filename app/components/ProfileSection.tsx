import React, { useState } from 'react';
import Container from './Container';
import Card from './Card';
import { JobProfileData } from '@/lib/types';
import { Briefcase, User, Code, MapPin, Building, AlertCircle } from 'lucide-react';
import Button from './Button';

interface ProfileSectionProps {
  profileData: JobProfileData | null;
  onSearchJobs: () => void;
  isSearching: boolean;
}

export default function ProfileSection({ 
  profileData, 
  onSearchJobs,
  isSearching
}: ProfileSectionProps) {
  if (!profileData || !profileData.profile) return null;
  
  const { profile } = profileData;
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to check if a section has any data
  const hasData = (section: any) => {
    return section && Object.keys(section).some(key => !!section[key]);
  };

  // Create a list of key skills from the profile
  const getSkills = () => {
    const skills = [];
    
    if (profile.programmingLanguages) {
      skills.push(...profile.programmingLanguages.split(',').map(skill => skill.trim()));
    }
    
    if (profile.frameworks) {
      skills.push(...profile.frameworks.split(',').map(skill => skill.trim()));
    }
    
    if (profile.tools) {
      skills.push(...profile.tools.split(',').map(skill => skill.trim()));
    }
    
    return skills.filter(Boolean);
  };

  // Check if profile is complete enough for job search
  const isProfileComplete = () => {
    const hasDesiredRole = !!profile.desiredRole || !!profile.currentRole;
    const hasIndustry = !!profile.preferredIndustry;
    const hasSkills = getSkills().length > 0;
    
    return hasDesiredRole && hasIndustry && hasSkills;
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (isProfileComplete()) {
      onSearchJobs();
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000); // Hide tooltip after 5 seconds
    }
  };

  return (
    <section className="py-10">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Career Profile</h2>
          <p className="text-gray-600">
            Based on our conversation, here's your career profile. Use it to find matching job opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <Card variant="elevated" className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[rgb(var(--primary-blue))]" />
                  Personal Info
                </h3>
              </div>
              
              <div className="flex flex-col space-y-4">
                {profile.name && (
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{profile.name}</p>
                  </div>
                )}
                
                {profile.currentRole && (
                  <div>
                    <p className="text-sm text-gray-500">Current Role</p>
                    <p className="text-gray-800 font-medium">{profile.currentRole}</p>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.yearsOfExperience && (
                  <div>
                    <p className="text-sm text-gray-500">Years of Experience</p>
                    <p className="text-gray-800 font-medium">{profile.yearsOfExperience} years</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Skills */}
          <Card variant="elevated" className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-[rgb(var(--primary-gold))]" />
                  Skills & Technologies
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {getSkills().map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[rgba(var(--accent-sand),0.3)] rounded-full text-sm text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
                
                {getSkills().length === 0 && (
                  <p className="text-gray-500 italic">No skills specified yet</p>
                )}
              </div>
              
              {profile.experienceLevel && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Experience Level</p>
                  <p className="text-gray-800 font-medium">{profile.experienceLevel}</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Job Preferences */}
          <Card variant="elevated" className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-[rgb(var(--primary-blue))]" />
                  Job Preferences
                </h3>
              </div>
              
              <div className="flex flex-col space-y-4">
                {profile.desiredRole && (
                  <div>
                    <p className="text-sm text-gray-500">Desired Role</p>
                    <p className="text-gray-800 font-medium">{profile.desiredRole}</p>
                  </div>
                )}
                
                {profile.preferredIndustry && (
                  <div>
                    <p className="text-sm text-gray-500">Preferred Industry</p>
                    <p className="text-gray-800 font-medium">{profile.preferredIndustry}</p>
                  </div>
                )}
                
                {profile.remotePreference && (
                  <div>
                    <p className="text-sm text-gray-500">Work Preference</p>
                    <p className="text-gray-800 font-medium">{profile.remotePreference}</p>
                  </div>
                )}
                
                {profile.companySize && (
                  <div className="flex items-center text-gray-700">
                    <Building className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{profile.companySize} company</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-8 text-center relative">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleSearchClick} 
            loading={isSearching}
            className={`shadow-md ${!isProfileComplete() ? 'opacity-90' : ''}`}
          >
            Find Matching Jobs
            {!isProfileComplete() && (
              <span className="ml-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </span>
            )}
          </Button>
          
          {showTooltip && !isProfileComplete() && (
            <div className="absolute mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-lg text-left max-w-md mx-auto left-0 right-0 z-10 animate-fade-in">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium text-sm">Profile incomplete</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Please complete your career conversation to provide missing information such as 
                    {!profile.desiredRole && !profile.currentRole ? ' desired role,' : ''}
                    {!profile.preferredIndustry ? ' industry preference,' : ''}
                    {getSkills().length === 0 ? ' skills,' : ''}
                    before searching for jobs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
} 