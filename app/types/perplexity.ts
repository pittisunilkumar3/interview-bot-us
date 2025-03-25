export interface PerplexityConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  matchScore?: number;
  url?: string;
  applyUrl?: string;
  postDate?: string;
  closingDate?: string;
  remote?: boolean;
  featured?: boolean;
  employmentType?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate?: string;
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: any[];
}

export interface JobSearchResultsProps {
  isSearching: boolean;
  results: JobMatch[];
  error?: string | null;
}

export interface PerplexityApiStatus {
  isOperational: boolean;
  lastChecked: Date | null;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface PerplexityTestResult {
  isOperational: boolean;
  message: string;
  timestamp: Date;
  details?: any;
}
