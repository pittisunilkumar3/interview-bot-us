export interface JoinUrlResponse {
  callId: string;
  created: Date;
  ended: Date | null;
  model: string;
  systemPrompt: string;
  temperature: number;
  joinUrl: string;
}

// Enums
export enum RoleEnum {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  TOOL_CALL = "TOOL_CALL",
  TOOL_RESULT = "TOOL_RESULT"
}

export enum ParameterLocation {
  UNSPECIFIED = "PARAMETER_LOCATION_UNSPECIFIED",
  QUERY = "PARAMETER_LOCATION_QUERY",
  PATH = "PARAMETER_LOCATION_PATH",
  HEADER = "PARAMETER_LOCATION_HEADER",
  BODY = "PARAMETER_LOCATION_BODY"
}

export enum KnownParamEnum {
  UNSPECIFIED = "KNOWN_PARAM_UNSPECIFIED",
  CALL_ID = "KNOWN_PARAM_CALL_ID",
  CONVERSATION_HISTORY = "KNOWN_PARAM_CONVERSATION_HISTORY"
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface Transcript {
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface SelectedTool {
  toolId?: string;
  toolName?: string;
  temporaryTool?: BaseToolDefinition;
  nameOverride?: string;
  authTokens?: { [key: string]: string };
  parameterOverrides?: { [key: string]: any };
}

export interface BaseToolDefinition {
  modelToolName?: string;
  description: string;
  dynamicParameters?: DynamicParameter[];
  staticParameters?: StaticParameter[];
  automaticParameters?: AutomaticParameter[];
  requirements?: ToolRequirements;
  http?: BaseHttpToolDetails;
  client?: {};
}

interface DynamicParameter {
  name: string;
  location: ParameterLocation;
  schema: object;
  required?: boolean;
}

interface StaticParameter {
  name: string;
  location: ParameterLocation;
  value: any;
}

interface AutomaticParameter {
  name: string;
  location: ParameterLocation;
  knownValue: KnownParamEnum;
}

interface BaseHttpToolDetails {
  baseUrlPattern: string;
  httpMethod: string;
}

interface ToolRequirements {
  httpSecurityOptions: SecurityOptions;
  requiredParameterOverrides: string[];
}

interface SecurityOptions {
  options: SecurityRequirements[];
}

interface SecurityRequirements {
  requirements: { [key: string]: SecurityRequirement };
}

interface SecurityRequirement {
  queryApiKey?: QueryApiKeyRequirement;
  headerApiKey?: HeaderApiKeyRequirement;
  httpAuth?: HttpAuthRequirement;
}

interface QueryApiKeyRequirement {
  name: string;
}

interface HeaderApiKeyRequirement {
  name: string;
}

interface HttpAuthRequirement {
  scheme: string;
}

export interface CallConfig {
  systemPrompt: string;
  model?: string;
  languageHint?: string;
  selectedTools?: SelectedTool[];
  initialMessages?: Message[];
  voice?: string;
  temperature?: number;
  maxDuration?: string;
  timeExceededMessage?: string;
  callKey?: string;
}

export interface DemoConfig {
  title: string;
  overview: string;
  callConfig: CallConfig;
}

// For our order details component
export interface OrderItem {
  name: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}
export interface OrderDetailsData {
  items: OrderItem[];
  totalAmount: number;
}

// For our job profile component
export interface JobSkill {
  name: string;
  level?: string;
}

export interface JobProfileItem {
  skills: string[];
  experience: string;
  yearsOfExperience: string;
  preferredIndustries: string[];
  preferredRoles: string[];
  locationPreference: string;
  employmentTypes: string[];  // Contract/Full time/Freelance
  remotePreference: string;  // Remote/Hybrid/On-site
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  targetRoles: string[];     // Specific roles planning to apply for
  suggestedRoles: string[];  // AI suggested roles based on experience
  currentStatus: string;     // Actively looking, Open to opportunities, etc.
  additionalNotes: string;
  techStack: string[];       // Specific technologies/frameworks
}

export interface JobProfileData {
  profile: UserProfile;
  matchingSkills?: string[];
  suggestedSkills?: string[];
  careerAdvice?: string;
}

// Job profile types
export interface UserProfile {
  name?: string;
  email?: string;
  currentRole?: string;
  location?: string;
  yearsOfExperience?: number;
  educationLevel?: string;
  educationField?: string;
  programmingLanguages?: string;
  frameworks?: string;
  tools?: string;
  experienceLevel?: string;
  desiredRole?: string;
  preferredIndustry?: string;
  remotePreference?: string;
  companySize?: string;
}

// Job listing types
export interface JobListing {
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

// API response types
export interface JobSearchResponse {
  jobs: JobListing[];
  totalResults: number;
  hasMore: boolean;
  nextPage?: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Application state types
export interface AppState {
  isCallActive: boolean;
  transcripts: Transcript[];
  jobProfile: JobProfileData | null;
  jobListings: JobListing[];
  isLoadingJobs: boolean;
  hasMoreJobs: boolean;
  currentPage: number;
}