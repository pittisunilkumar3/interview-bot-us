import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Building, MapPin, FileText, ListChecks, CircleDollarSign, Briefcase, AlertCircle } from 'lucide-react';
import GradientText from './GradientText';
import LoadingDots from './LoadingDots';
import type { JobProfileItem, JobProfileData } from '@/lib/types';
import type { JobMatch, PerplexityApiStatus } from '../types/perplexity';
import PerplexityApiTester from './PerplexityApiTester';
import ConversationSummary from './ConversationSummary';

export default function JobProfile() {
  const [profile, setProfile] = useState<Partial<JobProfileItem>>({});
  const profileRef = useRef<Partial<JobProfileItem>>({});
  const lastUpdateTime = useRef<number>(Date.now());
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobMatch[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleJobSearch = async (profile: JobProfileItem) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchResults([]);

      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const results = await response.json();
      console.log('Job search results:', results);
      if (results && results.jobs) {
        setSearchResults(results.jobs);
      } else {
        setSearchError('No job results found');
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred while searching for jobs.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchJobs = useCallback(async () => {
    if (!profileRef.current) {
      setSearchError('Job search is not available at this time.');
      setSearchResults([]);
      return;
    }

    try {
      // Convert partial profile to full profile structure required by PerplexityService
      const fullProfile: JobProfileItem = {
        skills: profileRef.current.skills || [],
        techStack: profileRef.current.techStack || [],
        experience: profileRef.current.experience || '',
        yearsOfExperience: profileRef.current.yearsOfExperience || '',
        preferredIndustries: profileRef.current.preferredIndustries || [],
        preferredRoles: profileRef.current.preferredRoles || [],
        employmentTypes: profileRef.current.employmentTypes || [],
        locationPreference: profileRef.current.locationPreference || '',
        remotePreference: profileRef.current.remotePreference || '',
        salaryRange: profileRef.current.salaryRange || { min: 0, max: 0, currency: 'USD' },
        targetRoles: profileRef.current.targetRoles || [],
        suggestedRoles: profileRef.current.suggestedRoles || [],
        currentStatus: profileRef.current.currentStatus || '',
        additionalNotes: profileRef.current.additionalNotes || ''
      };

      await handleJobSearch(fullProfile);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred while searching for jobs.');
      setSearchResults([]);
    }
  }, []);

  const handleCallEnded = useCallback(() => {
    console.log('Call ended, starting job search...');
    searchJobs();
  }, [searchJobs]);

  // Enhanced profile update handler
  const handleProfileUpdate = useCallback((event: CustomEvent<string>) => {
    try {
      const updatedProfile = JSON.parse(event.detail);
      const currentTime = Date.now();
      
      // Debounce updates that come too quickly (within 500ms)
      if (currentTime - lastUpdateTime.current < 500) {
        return;
      }
      
      lastUpdateTime.current = currentTime;
      console.debug('Received profile update:', updatedProfile);

      // Keep a reference to the latest profile
      profileRef.current = {
        ...profileRef.current,
        ...updatedProfile
      };
      
      // Update state with new data
      setProfile(prevProfile => {
        const newProfile = {
          ...prevProfile,
          ...updatedProfile
        };
        console.debug('Profile state updated:', newProfile);
        return newProfile;
      });
    } catch (error) {
      console.error('Error handling profile update:', error);
    }
  }, []);

  // More frequent profile validation
  useEffect(() => {
    const validateProfile = () => {
      const currentProfile = JSON.stringify(profile);
      const referenceProfile = JSON.stringify(profileRef.current);
      
      if (currentProfile !== referenceProfile) {
        console.debug('Profile sync required - updating state');
        setProfile(profileRef.current);
      }
    };
    
    // Check more frequently (every 500ms) for updates
    const interval = setInterval(validateProfile, 500);
    return () => clearInterval(interval);
  }, [profile]);

  // Enhanced event listener setup
  useEffect(() => {
    console.debug('Setting up profile update listeners');
    window.addEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded);
    
    return () => {
      console.debug('Cleaning up profile update listeners');
      window.removeEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded);
    };
  }, [handleProfileUpdate, handleCallEnded]);

  const formatArray = useCallback((arr?: string[]) => {
    if (!arr || arr.length === 0) return '';
    return arr.join(', ');
  }, []);

  const formatSalaryRange = useCallback((range?: { min: number; max: number; currency: string }) => {
    if (!range) return '';
    if (range.min === 0 && range.max === 0) return '';
    if (range.min && range.max) {
      return `${range.currency}${range.min.toLocaleString()} - ${range.currency}${range.max.toLocaleString()}`;
    }
    return range.min ? `From ${range.currency}${range.min.toLocaleString()}` : `Up to ${range.currency}${range.max.toLocaleString()}`;
  }, []);

  const renderExperienceInfo = () => {
    const hasExperience = profile.experience || profile.yearsOfExperience || (profile.skills && profile.skills.length > 0);
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {hasExperience ? (
          <>
            {(profile.experience || profile.yearsOfExperience) && (
              <div className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                {profile.yearsOfExperience && `${profile.yearsOfExperience} years`} {profile.experience}
              </div>
            )}
            {profile.skills?.map((skill, index) => (
              <div key={index} className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                {skill}
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-400 text-sm">Share your experience and skills...</p>
        )}
      </div>
    );
  };

  const renderLocationInfo = () => {
    if (!profile.locationPreference && !profile.remotePreference) {
      return (
        <p className="text-gray-400 text-sm mt-1">
          Share your location and work mode preferences...
        </p>
      );
    }

    return (
      <p className="text-blue-300 text-sm mt-1">
        {profile.locationPreference} {profile.remotePreference && `(${profile.remotePreference})`}
      </p>
    );
  };

  // Convert profile to JobProfileData format for ConversationSummary
  const jobProfileData: JobProfileData = {
    profile: {
      name: '',
      email: '',
      currentRole: profile.currentStatus || '',
      location: profile.locationPreference || '',
      yearsOfExperience: typeof profile.yearsOfExperience === 'string' ? parseInt(profile.yearsOfExperience, 10) || 0 : 0,
      educationLevel: '',
      educationField: '',
      programmingLanguages: profile.skills?.join(', ') || '',
      frameworks: profile.techStack?.join(', ') || '',
      tools: '',
      experienceLevel: profile.experience || '',
      desiredRole: profile.targetRoles?.join(', ') || '',
      preferredIndustry: profile.preferredIndustries?.join(', ') || '',
      remotePreference: profile.remotePreference || '',
      companySize: ''
    }
  };

  return (
    <>
      <div className="glass card transition-all duration-300 border-gray-800/50 hover:border-blue-800/40 shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            <GradientText>Career Profile</GradientText>
          </h2>

          <div className="space-y-4">
            {/* Experience Section */}
            <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <FileText className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-blue-300">Experience</h4>
                {renderExperienceInfo()}
              </div>
            </div>

            {/* Location Section */}
            <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <MapPin className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-blue-300">Location & Work Mode</h4>
                {renderLocationInfo()}
              </div>
            </div>

            {/* Industry Section */}
            <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <Building className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-blue-300">Target Industries</h4>
                {profile.preferredIndustries && profile.preferredIndustries.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.preferredIndustries.map((industry, index) => (
                      <div key={index} className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {industry}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    What industries interest you...
                  </p>
                )}
              </div>
            </div>

            {/* Target Roles Section */}
            <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <ListChecks className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-blue-300">Target Roles</h4>
                {profile.targetRoles && profile.targetRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.targetRoles.map((role, index) => (
                      <div key={index} className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {role}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    What are your career aspirations...
                  </p>
                )}
              </div>
            </div>

            {/* Salary Section */}
            <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <CircleDollarSign className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-blue-300">Salary Range</h4>
                {formatSalaryRange(profile.salaryRange) ? (
                  <p className="text-blue-300 text-sm mt-1">
                    {formatSalaryRange(profile.salaryRange)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    Expected compensation details...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Status Indicator */}
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 p-3 text-center">
          <LoadingDots size={2} color="bg-blue-400" />
          <p className="text-xs text-gray-400 mt-2">Listening for updates...</p>
        </div>
      </div>

      {/* Job Search Results */}
      <ConversationSummary
        profile={jobProfileData}
        onSearchJobs={searchJobs}
        isSearchingJobs={isSearching}
        jobResults={searchResults}
        jobSearchError={searchError}
      />

      {/* API Tester (for development and testing) */}
      {process.env.NODE_ENV === 'development' && (
        <PerplexityApiTester />
      )}
    </>
  );
}