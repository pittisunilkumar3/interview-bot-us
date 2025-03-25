import { PerplexityConfig, PerplexityResponse, JobMatch, PerplexityTestResult } from '../types/perplexity';
import { JobProfileItem } from '@/lib/types';

export class PerplexityService {
  private config: PerplexityConfig;
  private apiStatus: { isOperational: boolean; lastChecked: Date | null } = {
    isOperational: false,
    lastChecked: null
  };
  private maxRetries = 2;
  private timeout = 30000; // 30 seconds

  constructor(config: PerplexityConfig) {
    this.config = config;
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async retryFetch(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options, this.timeout);
        if (response.ok || response.status === 401) { // Don't retry auth errors
          return response;
        }
        lastError = new Error(`HTTP error! status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Network request failed');
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        // Only retry on network errors, not timeouts
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw lastError || new Error('Maximum retries exceeded');
  }

  private formatSearchQuery(profile: JobProfileItem): string {
    const queryParts = [];

    // Include both target roles and skills in the query
    if (profile.targetRoles?.length) {
      queryParts.push(`Role: ${profile.targetRoles.join(' or ')}`);
    }
    
    const allSkills = [
      ...(profile.skills || []),
      ...(profile.techStack || [])
    ].filter(Boolean);
    
    if (allSkills.length) {
      queryParts.push(`Required Skills: ${allSkills.join(', ')}`);
    }
    
    if (profile.experience || profile.yearsOfExperience) {
      const years = profile.yearsOfExperience || profile.experience?.match(/(\d+)/)?.[1];
      if (years) {
        queryParts.push(`Experience: ${years} years`);
      }
    }

    if (profile.locationPreference) {
      queryParts.push(`Location: ${profile.locationPreference}`);
    }
    
    if (profile.remotePreference) {
      queryParts.push(`Work Mode: ${profile.remotePreference}`);
    }

    if (profile.preferredIndustries?.length) {
      queryParts.push(`Industries: ${profile.preferredIndustries.join(', ')}`);
    }

    if (profile.salaryRange && (profile.salaryRange.min > 0 || profile.salaryRange.max > 0)) {
      queryParts.push(`Salary Range: $${profile.salaryRange.min}-$${profile.salaryRange.max}`);
    }

    return `
      Find 5 current real job opportunities matching these requirements:
      ${queryParts.join('\n')}

      Additional focus:
      - Python development positions
      - Machine Learning and AI roles
      - Solution Architect positions
      - Banking and Finance industry
      - Texas-based opportunities
      - Roles matching salary range $50,000-$200,000

      Respond ONLY with a valid, parseable JSON array containing job listings. 
      Each job MUST have this exact format:
      [
        {
          "title": "Exact Job Title",
          "company": "Company Name",
          "location": "Job Location",
          "description": "Brief job description",
          "requirements": ["Key requirement 1", "Key requirement 2"],
          "employmentType": "Full-time",
          "salary": "Salary range if available",
          "postedDate": "Job posting date",
          "applyUrl": "Direct application URL"
        }
      ]

      Important instructions:
      1. Format as a valid, parseable JSON ARRAY
      2. Focus on active job postings only
      3. Include ONLY real jobs from real companies
      4. Do not include any text before or after the JSON array
      5. Ensure all URLs are properly formatted
      6. Focus on roles in Texas or remote positions
      7. Prioritize Python, Machine Learning, and Solution Architect roles
      8. Include positions in Banking/Finance sector when available
    `;
  }

  private async parseResponse(response: PerplexityResponse): Promise<JobMatch[]> {
    try {
      if (!response.choices?.[0]?.message?.content) {
        console.warn('Invalid response format:', response);
        return [];
      }

      const content = response.choices[0].message.content;
      console.log('Raw API response content:', content);
      
      let jobs: any[] = [];
      let parsedContent: any;

      try {
        // First try to clean the content by ensuring proper JSON structure
        const cleanedContent = content
          .replace(/}\s*,\s*\]/g, '}]') // Fix trailing commas
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .replace(/([{\[]\s*),/g, '$1') // Remove leading commas
          .replace(/\[\s*,/g, '[') // Remove commas after opening brackets
          .replace(/,\s*\]/g, ']'); // Remove commas before closing brackets
        
        // Try to extract a complete JSON array
        const arrayMatch = cleanedContent.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        if (arrayMatch) {
          try {
            parsedContent = JSON.parse(arrayMatch[0]);
            if (Array.isArray(parsedContent)) {
              jobs = parsedContent;
            }
          } catch (e) {
            console.warn('Failed to parse matched array:', e);
          }
        }

        // If array parsing failed, try to parse individual job objects
        if (jobs.length === 0) {
          const jobObjects = cleanedContent.match(/\{[^{}]*\}/g) || [];
          jobs = jobObjects
            .map(obj => {
              try {
                return JSON.parse(obj);
              } catch (e) {
                return null;
              }
            })
            .filter(job => job !== null);
        }

        // If still no jobs, try the fallback parser
        if (jobs.length === 0) {
          return this.fallbackParser(content);
        }
      } catch (error) {
        console.warn('Error during JSON parsing:', error);
        return this.fallbackParser(content);
      }

      // Clean and validate the jobs
      const validJobs = jobs
        .filter(job => job && typeof job === 'object')
        .map(job => this.validateAndCleanJobEntry(job))
        .filter(job => 
          job.title !== 'Unknown Position' && 
          job.company !== 'Unknown Company' && 
          job.company !== 'Not specified'  // Filter out jobs with unspecified companies
        );

      return validJobs;
    } catch (error) {
      console.error('Error parsing response:', error);
      return [];
    }
  }

  private validateAndCleanJobEntry(job: any): JobMatch {
    const cleanUrl = (url: string, company: string, title: string) => {
      if (typeof url === 'string' && url.startsWith('http')) {
        try {
          new URL(url);
          return url;
        } catch {
          // If URL is invalid, fall through to default
        }
      }
      
      return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}`;
    };

    // Parse salary string into structured format
    const parseSalary = (salaryStr: string) => {
      if (!salaryStr) return undefined;
      
      // Try to extract numbers from the salary string
      const numbers = salaryStr.match(/\d[\d,.]*/g);
      if (!numbers || numbers.length === 0) return undefined;

      // If we have two numbers, assume it's a range
      if (numbers.length >= 2) {
        return {
          min: parseInt(numbers[0].replace(/[,.]/g, '')),
          max: parseInt(numbers[1].replace(/[,.]/g, '')),
          currency: salaryStr.includes('$') ? 'USD' : 'USD' // Default to USD
        };
      }
      
      // If we have one number, use it as both min and max
      const amount = parseInt(numbers[0].replace(/[,.]/g, ''));
      return {
        min: amount,
        max: amount,
        currency: salaryStr.includes('$') ? 'USD' : 'USD'
      };
    };

    // Generate a unique ID for the job
    const generateId = (title: string, company: string) => {
      const str = `${title}-${company}-${Date.now()}`;
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Ensure requirements is an array
    const requirements = Array.isArray(job.requirements) ? 
      job.requirements : 
      typeof job.requirements === 'string' ?
        job.requirements.split(',').map((r: string) => r.trim()) :
        undefined;

    const title = typeof job.title === 'string' ? job.title : 'Unknown Position';
    const company = typeof job.company === 'string' ? job.company : 'Unknown Company';

    return {
      id: job.id || generateId(title, company),
      title,
      company,
      location: typeof job.location === 'string' ? job.location : 'Location not specified',
      description: typeof job.description === 'string' ? job.description : 'No description available',
      requirements,
      employmentType: typeof job.employmentType === 'string' ? job.employmentType : undefined,
      salary: job.salary ? parseSalary(job.salary) : undefined,
      postedDate: typeof job.postedDate === 'string' ? job.postedDate : undefined,
      applyUrl: cleanUrl(job.applyUrl || '', company, title)
    };
  }

  private fallbackParser(content: string): JobMatch[] {
    console.log('Using fallback parser on content:', content.substring(0, 200) + '...');
    
    const jobs: JobMatch[] = [];
    
    // Try to extract job information using various patterns
    const jobPatterns = [
      // Pattern 1: JSON-like format
      /\{\s*"title":\s*"([^"]+)",\s*"company":\s*"([^"]+)"/g,
      // Pattern 2: Key-value format
      /Title:\s*([^\n]+)[\s\S]*?Company:\s*([^\n]+)/g,
      // Pattern 3: Numbered list format
      /\d+\.\s*([^(]+)\s*\(([^)]+)\)/g
    ];

    for (const pattern of jobPatterns) {
      const matches = Array.from(content.matchAll(pattern));
      if (matches.length > 0) {
        for (const match of matches) {
          const title = match[1]?.trim() || 'Unknown Position';
          const company = match[2]?.trim() || 'Unknown Company';
          
          if (title && company && company !== 'Not specified') {
            // Extract location if available
            const locationMatch = content.match(new RegExp(`${title}[\\s\\S]*?location"?:\\s*"([^"\\n]+)"`));
            const location = locationMatch?.[1] || 'Location not specified';

            // Extract description if available
            const descMatch = content.match(new RegExp(`${title}[\\s\\S]*?description"?:\\s*"([^"\\n]+)"`));
            const description = descMatch?.[1] || 'No description available';

            // Extract requirements if available
            const reqMatch = content.match(new RegExp(`${title}[\\s\\S]*?requirements"?:\\s*\\[([^\\]]+)\\]`));
            const requirements = reqMatch ? 
              reqMatch[1].split(',').map(r => r.trim().replace(/"/g, '')) : 
              undefined;

            // Generate a unique ID
            const id = `${title}-${company}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            jobs.push({
              id,
              title,
              company,
              location,
              description,
              requirements,
              employmentType: 'Full-time', // Default value
              salary: undefined,
              postedDate: undefined,
              applyUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}`
            });
          }
        }
        
        // If we found any jobs with this pattern, break the loop
        if (jobs.length > 0) break;
      }
    }

    return jobs;
  }

  public async searchJobs(profile: JobProfileItem): Promise<JobMatch[]> {
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    try {
      const query = this.formatSearchQuery(profile);
      
      const response = await this.retryFetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model || 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a job search expert. Return detailed job listings in JSON format.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: this.config.maxTokens || 4000,
          temperature: this.config.temperature || 0.3,
          top_p: 0.95,
          search_domain_filter: null,
          return_related_questions: false,
          search_recency_filter: 'week'
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });
        
        if (response.status === 401) {
          throw new Error('Invalid API key or authentication failed');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later');
        }
        throw new Error('Job search service is temporarily unavailable');
      }

      const data: PerplexityResponse = await response.json();
      const jobs = await this.parseResponse(data);

      // Log an informational message instead of throwing an error
      if (jobs.length === 0) {
        console.warn('No matching jobs found for the given search criteria');
      }

      this.apiStatus.isOperational = true;
      this.apiStatus.lastChecked = new Date();
      return jobs;

    } catch (error) {
      console.error('Error searching jobs:', error);
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to process job search. Please try again later.');
    }
  }

  public async testConnection(): Promise<PerplexityTestResult> {
    if (!this.config.apiKey) {
      return {
        isOperational: false,
        message: 'API key is required',
        timestamp: new Date()
      };
    }

    try {
      const response = await this.retryFetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model || 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: 'Return a simple JSON response with the key "status" and value "operational"'
            }
          ],
          max_tokens: 100,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.statusText} (${response.status})\n${errorBody}`);
      }

      const data = await response.json();
      
      this.apiStatus.isOperational = true;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: true,
        message: 'Job search service is ready',
        timestamp: new Date(),
        details: data
      };
    } catch (error) {
      console.error('Service test failed:', error);
      
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: false,
        message: error instanceof Error ? error.message : 'Service connectivity test failed',
        timestamp: new Date()
      };
    }
  }

  public getApiStatus() {
    return {
      ...this.apiStatus,
      config: {
        model: this.config.model,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens
      }
    };
  }
}
