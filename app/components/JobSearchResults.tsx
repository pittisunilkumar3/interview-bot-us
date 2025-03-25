import React from 'react';
import { JobMatch } from '../types/perplexity';
import { ExternalLink, Info, MapPin, DollarSign, Building, Calendar, Briefcase, Star, BadgeCheck, Search } from 'lucide-react';
import SearchLoadingAnimation from './SearchLoadingAnimation';
import { JobListing } from '@/lib/types';

type Job = JobMatch | JobListing;

interface JobSearchResultsProps {
  isSearching: boolean;
  results: Job[];
  error?: string | null;
}

export default function JobSearchResults({ isSearching, results, error }: JobSearchResultsProps) {
  // Helper function to format salary
  const formatSalary = (job: Job) => {
    if ('salary' in job && job.salary) {
      return `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}`;
    }
    if ('salaryMin' in job && 'salaryMax' in job && job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryCurrency || 'USD'}`;
    }
    return 'Salary not specified';
  };

  return (
    <div className="mt-6 md:mt-8 animate-section-reveal">
      <div className="glass card transition-all duration-300 border-gray-800/50 hover:border-blue-800/40 shadow-lg">
        <div className="p-4 md:p-5">
          {error ? (
            <div className="text-center py-6 md:py-8 space-y-3 md:space-y-4">
              {error.toLowerCase().includes('profile incomplete') || error.toLowerCase().includes('missing') ? (
                <>
                  <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
                    <Info className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                  </div>
                  <p className="text-base md:text-lg font-medium text-amber-300">Your Profile Needs More Details</p>
                  <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto">
                    {error}
                  </p>
                  <div className="pt-2">
                    <button 
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-300 text-xs md:text-sm transition-colors"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Continue Your Career Conversation
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                    <Info className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                  </div>
                  <p className="text-base md:text-lg font-medium text-red-400">Unable to find matching jobs at the moment</p>
                  <p className="text-xs md:text-sm text-gray-400">Please try again later or update your search preferences</p>
                </>
              )}
            </div>
          ) : isSearching ? (
            <div className="flex flex-col justify-center items-center py-8 md:py-12 space-y-4">
              <SearchLoadingAnimation />
              <p className="text-gray-400 animate-pulse text-sm md:text-base">Finding your dream opportunities...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
                Discovered Opportunities
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {results.map((job, index) => (
                  <a
                    key={`${job.company}-${job.title}-${index}`}
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-light card card-hover group"
                  >
                    <div className="p-4 md:p-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h4 className="text-blue-300 font-semibold text-lg md:text-xl group-hover:text-blue-200 transition-colors">
                              {job.title}
                            </h4>
                            <ExternalLink className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          <div className="flex items-center mt-2">
                            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="ml-2 text-gray-300 font-medium">
                              {job.company}
                            </p>
                          </div>
                          
                          {job.location && (
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <p className="ml-2 text-gray-400">
                                {job.location}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 sm:mt-0 sm:ml-6 flex flex-col items-start sm:items-end">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <p className="ml-1 text-emerald-300 font-medium">
                              {formatSalary(job)}
                            </p>
                          </div>
                          
                          {job.type && (
                            <div className="flex items-center mt-1">
                              <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <p className="ml-1 text-gray-400">
                                {job.type}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {'matchScore' in job && job.matchScore && (
                        <div className="mt-3 flex items-center">
                          <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <p className="ml-1 text-amber-300 text-sm">
                            {Math.round(job.matchScore * 100)}% Match
                          </p>
                        </div>
                      )}
                      
                      {job.description && (
                        <p className="mt-3 text-gray-400 text-sm line-clamp-3">
                          {job.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 space-y-3 md:space-y-4">
              <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-2">
                <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <p className="text-base md:text-lg font-medium text-gray-300">No Jobs Found Yet</p>
              <p className="text-xs md:text-sm text-gray-400">Start your job search to discover matching opportunities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
