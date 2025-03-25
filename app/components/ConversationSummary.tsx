import React from 'react';
import { 
  Briefcase, Code, Building, MapPin,
  Target, Banknote, Network, Monitor,
  Clock, CheckCircle2, Search, AlertCircle
} from 'lucide-react';
import { JobProfileData, JobListing } from '@/lib/types';
import { JobMatch } from '../types/perplexity';
import GradientText from './GradientText';
import JobSearchResults from './JobSearchResults';
import LoadingDots from './LoadingDots';

interface ConversationSummaryProps {
  profile: JobProfileData;
  onSearchJobs?: () => void;
  isSearchingJobs?: boolean;
  jobResults?: (JobListing | JobMatch)[];
  jobSearchError?: string | null;
}

const ConversationSummary: React.FC<ConversationSummaryProps> = ({ 
  profile, 
  onSearchJobs,
  isSearchingJobs = false,
  jobResults = [],
  jobSearchError = null
}) => {
  if (!profile || !profile.profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingDots size={4} color="bg-blue-400" />
        <p className="text-gray-400 mt-4">Loading profile information...</p>
      </div>
    );
  }

  // Check if profile is complete enough for job search
  const isProfileComplete = () => {
    // Check for essential fields
    const hasDesiredRole = !!profile.profile.desiredRole || !!profile.profile.currentRole;
    const hasIndustry = !!profile.profile.preferredIndustry;
    const hasSkills = !!profile.profile.programmingLanguages || 
                     !!profile.profile.frameworks || 
                     !!profile.profile.tools;
    
    return hasDesiredRole && hasIndustry && hasSkills;
  };

  // Get missing fields for message
  const getMissingFields = () => {
    const missing = [];
    
    if (!profile.profile.desiredRole && !profile.profile.currentRole) {
      missing.push('target roles');
    }
    
    if (!profile.profile.preferredIndustry) {
      missing.push('industry preferences');
    }
    
    if (!profile.profile.programmingLanguages && !profile.profile.frameworks && !profile.profile.tools) {
      missing.push('skills or tech stack');
    }
    
    return missing;
  };

  const renderSection = (
    title: string, 
    icon: React.ReactNode, 
    content: React.ReactNode, 
    isEmpty: boolean,
    delay: string = ''
  ) => (
    <div className={`p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-blue-800/30 transition-colors duration-300 fade-in-up ${delay}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-blue-400">{icon}</span>
          <GradientText 
            from="from-blue-400" 
            to="to-indigo-400" 
            className="ml-2 font-medium"
          >
            {title}
          </GradientText>
        </div>
        {!isEmpty && (
          <div className="flex items-center text-green-400">
            <CheckCircle2 size={14} className="mr-1" />
            <span className="text-xs">Captured</span>
          </div>
        )}
      </div>
      <div className="text-gray-300">
        {content}
      </div>
    </div>
  );

  const formatListItems = (items: string[]) => {
    if (!items || items.length === 0) return <span className="text-gray-500 text-sm">None specified</span>;
    
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span 
            key={index} 
            className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-blue-800/40"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const formatSalaryRange = (salary: { min: number; max: number; currency: string }) => {
    if (!salary || (salary.min === 0 && salary.max === 0)) return <span className="text-gray-500 text-sm">Not specified</span>;
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      maximumFractionDigits: 0
    });
    
    return (
      <span className="text-blue-300 text-lg">
        {formatter.format(salary.min)} - {formatter.format(salary.max)} {salary.currency}
      </span>
    );
  };

  // Profile completeness warning
  const ProfileIncompleteWarning = () => {
    const missingFields = getMissingFields();
    if (missingFields.length === 0) return null;
    
    return (
      <div className="p-4 bg-amber-900/30 border border-amber-800/50 rounded-lg mb-6 fade-in-up delay-100">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-amber-400 font-medium mb-1">Your profile is incomplete</h3>
            <p className="text-amber-200/80 text-sm">
              Please add more details to your profile before searching for jobs. Missing information:
              <span className="block mt-2 text-amber-300 font-medium">
                {missingFields.join(', ')}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto fade-in">
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6 mb-6 fade-in-up">
        <h2 className="text-3xl font-bold mb-2">
          <GradientText animate>Career Profile Summary</GradientText>
        </h2>
        <p className="text-gray-400">Based on our conversation, here's your professional profile details.</p>
      </div>

      {/* Profile completeness warning if profile is incomplete */}
      {!isProfileComplete() && <ProfileIncompleteWarning />}

      {/* Get Jobs Button - Top */}
      {onSearchJobs && (
        <div className="mb-8 fade-in-up delay-100">
          <button
            onClick={onSearchJobs}
            disabled={isSearchingJobs || !isProfileComplete()}
            className={`
              w-full px-8 py-4 rounded-xl text-xl font-medium
              transition-all duration-300 group relative
              ${isSearchingJobs
                ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed'
                : !isProfileComplete()
                ? 'bg-gray-700/50 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500'
              }
            `}
          >
            {isSearchingJobs ? (
              <span className="flex items-center justify-center">
                <span className="mr-3">Finding Your Perfect Job Match</span>
                <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
              </span>
            ) : !isProfileComplete() ? (
              <span className="flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
                <span>Complete Your Profile First</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Search className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                <span>Find Matching Jobs</span>
              </span>
            )}
            {!isSearchingJobs && isProfileComplete() && (
              <div className="absolute inset-0 bg-blue-400 rounded-xl animate-pulse opacity-20 group-hover:animate-none"></div>
            )}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Current Status */}
        {renderSection(
          "Current Status",
          <Target size={18} className="mr-2" />,
          <p className="text-blue-300">
            {profile.profile.currentStatus || "Status not specified"}
          </p>,
          !profile.profile.currentStatus,
          'delay-100'
        )}

        {/* Skills & Tech */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSection(
            "Skills",
            <Code size={18} className="mr-2" />,
            <p className="text-blue-300">{profile.profile.programmingLanguages || "No skills specified"}</p>,
            !profile.profile.programmingLanguages,
            'delay-200'
          )}
          {renderSection(
            "Tech Stack",
            <Monitor size={18} className="mr-2" />,
            <p className="text-blue-300">{profile.profile.frameworks || "No tech stack specified"}</p>,
            !profile.profile.frameworks,
            'delay-200'
          )}
        </div>

        {/* Experience */}
        {renderSection(
          "Experience",
          <Briefcase size={18} className="mr-2" />,
          <div className="space-y-2">
            {profile.profile.yearsOfExperience && (
              <div className="flex items-center text-blue-300 mb-2">
                <Clock size={16} className="mr-2" />
                <span>{profile.profile.yearsOfExperience} Years</span>
              </div>
            )}
            <p className="text-blue-300">{profile.profile.experience || "No experience details provided"}</p>
          </div>,
          !profile.profile.experience && !profile.profile.yearsOfExperience,
          'delay-300'
        )}

        {/* Employment & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSection(
            "Employment Types",
            <Network size={18} className="mr-2" />,
            <p className="text-blue-300">{profile.profile.experienceLevel || "No employment types specified"}</p>,
            !profile.profile.experienceLevel,
            'delay-300'
          )}
          {renderSection(
            "Location & Work Mode",
            <MapPin size={18} className="mr-2" />,
            <div className="space-y-2">
              <p className="text-blue-300">
                Location: {profile.profile.location || "Not specified"}
              </p>
              <p className="text-blue-300">
                Work Mode: {profile.profile.remotePreference || "Not specified"}
              </p>
            </div>,
            !profile.profile.location && !profile.profile.remotePreference,
            'delay-300'
          )}
        </div>

        {/* Career Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSection(
            "Preferred Industries",
            <Building size={18} className="mr-2" />,
            <p className="text-blue-300">{profile.profile.preferredIndustry || "No preferred industries specified"}</p>,
            !profile.profile.preferredIndustry,
            'delay-300'
          )}
          {renderSection(
            "Expected Salary",
            <Banknote size={18} className="mr-2" />,
            <p className="text-blue-300">Salary information not available</p>,
            true,
            'delay-300'
          )}
        </div>

        {/* Target Roles */}
        {renderSection(
          "Target Roles",
          <Target size={18} className="mr-2" />,
          <p className="text-blue-300">{profile.profile.desiredRole || "No target roles specified"}</p>,
          !profile.profile.desiredRole,
          'delay-300'
        )}

        {/* Additional Notes */}
        {profile.profile.additionalNotes && renderSection(
          "Additional Notes",
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>,
          <p className="text-blue-300">{profile.profile.additionalNotes}</p>,
          false,
          'delay-300'
        )}
      </div>

      {/* Job Search Results */}
      {onSearchJobs && (
        <div className="mt-8">
          {isSearchingJobs ? (
            <div className="flex flex-col items-center justify-center p-8">
              <LoadingDots size={4} color="bg-blue-400" />
              <p className="text-gray-400 mt-4">Searching for job matches...</p>
            </div>
          ) : jobSearchError ? (
            <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg mb-6 fade-in-up delay-100">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-medium mb-1">Error searching for jobs</h3>
                  <p className="text-red-200/80 text-sm">{jobSearchError}</p>
                </div>
              </div>
            </div>
          ) : (
            <JobSearchResults 
              isSearching={isSearchingJobs} 
              results={jobResults || []} 
              error={jobSearchError} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationSummary;
