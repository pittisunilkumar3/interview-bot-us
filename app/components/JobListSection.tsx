import React from 'react';
import Container from './Container';
import Card from './Card';
import Badge from './Badge';
import { ArrowUpRight, Building, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { JobListing } from '@/lib/types';
import Button from './Button';

interface JobListSectionProps {
  jobs: JobListing[];
  isLoading: boolean;
  onApply: (job: JobListing) => void;
  onShowMore: () => void;
  hasMoreJobs: boolean;
  loadingMore: boolean;
}

export default function JobListSection({
  jobs,
  isLoading,
  onApply,
  onShowMore,
  hasMoreJobs,
  loadingMore
}: JobListSectionProps) {
  if (isLoading) {
    return (
      <section className="py-10">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Matching Job Opportunities</h2>
            <p className="text-gray-600">
              Finding jobs that match your career profile...
            </p>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} variant="elevated" className="p-6">
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-9 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="py-10">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Matching Job Opportunities</h2>
            <p className="text-gray-600">
              No jobs found matching your profile. Try adjusting your search criteria.
            </p>
          </div>
          <Card variant="elevated" className="p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Job Listings Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any jobs matching your current profile. Try updating your skills or preferences.
            </p>
            <Button variant="secondary" size="md">
              Update Profile
            </Button>
          </Card>
        </Container>
      </section>
    );
  }

  // Format salary range
  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && !max) return `${min.toLocaleString()} ${currency}+`;
    if (!min && max) return `Up to ${max.toLocaleString()} ${currency}`;
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
  };

  // Function to format the post date to relative time (e.g., "2 days ago")
  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <section className="py-10">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Matching Job Opportunities</h2>
          <p className="text-gray-600">
            We found {jobs.length} jobs that match your career profile.
          </p>
        </div>
        
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <Card key={index} variant="elevated" className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 items-center text-gray-600 text-sm mb-3">
                      {job.company && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{job.company}</span>
                        </div>
                      )}
                      
                      {job.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      
                      {job.type && (
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                      )}
                      
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                        </div>
                      )}
                      
                      {job.postDate && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatPostDate(job.postDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills && job.skills.map((skill, i) => (
                        <Badge key={i} variant="subtle">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onApply(job)}
                      className="flex items-center"
                    >
                      Apply Now <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {hasMoreJobs && (
          <div className="mt-8 text-center">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onShowMore} 
              loading={loadingMore}
            >
              Show More Jobs
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
} 