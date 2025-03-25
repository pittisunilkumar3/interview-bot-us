import React from 'react';
import Card from './Card';
import Button from './Button';
import { ChevronRight, MapPin, Briefcase, Star } from 'lucide-react';
import { JobListing } from '@/lib/types';

interface JobSuggestionsProps {
  jobs: JobListing[];
  isLoading: boolean;
  title?: string;
  onViewJob: (job: JobListing) => void;
  onViewAllJobs?: () => void;
}

export default function JobSuggestions({
  jobs = [],
  isLoading,
  title = "Recommended Jobs",
  onViewJob,
  onViewAllJobs
}: JobSuggestionsProps) {
  if (isLoading) {
    return (
      <Card variant="elevated" className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card variant="elevated" className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">
          No job suggestions available at the moment.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewAllJobs}
          className="w-full justify-center"
        >
          Browse All Jobs
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div 
            key={index} 
            className="cursor-pointer group"
            onClick={() => onViewJob(job)}
          >
            <div className="flex items-start">
              {job.featured && (
                <Star className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
              )}
              <div className="flex-grow">
                <h4 className="text-base font-medium text-gray-800 group-hover:text-[rgb(var(--primary-blue))] transition-colors">
                  {job.title}
                </h4>
                
                {job.company && (
                  <p className="text-sm text-gray-600 mb-1">
                    {job.company}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  
                  {job.type && (
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{job.type}</span>
                    </div>
                  )}
                </div>
                
                {job.matchScore !== undefined && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-[rgb(var(--primary-blue))] h-1.5 rounded-full" 
                        style={{width: `${job.matchScore}%`}}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.matchScore}% match
                    </p>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[rgb(var(--primary-blue))] transition-colors flex-shrink-0" />
            </div>
            
            {index < jobs.length - 1 && (
              <div className="border-b border-gray-100 mt-4"></div>
            )}
          </div>
        ))}
      </div>
      
      {onViewAllJobs && (
        <div className="mt-4 pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAllJobs}
            className="w-full justify-center"
          >
            View All Jobs
          </Button>
        </div>
      )}
    </Card>
  );
} 