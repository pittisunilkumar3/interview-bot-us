import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Upload, FileText } from 'lucide-react';
import Button from './Button';
import { JobListing } from '@/lib/types';

interface ApplicationModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ApplicationFormData) => Promise<boolean>;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile?: File | null;
}

export default function ApplicationModal({
  job,
  isOpen,
  onClose,
  onSubmit
}: ApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeFile: null
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name as keyof ApplicationFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resumeFile: file }));
    // Clear error for this field if it exists
    if (errors.resumeFile) {
      setErrors(prev => ({ ...prev, resumeFile: undefined }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
    let isValid = true;

    if (stepNum === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    }

    if (stepNum === 2) {
      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = 'Cover letter is required';
        isValid = false;
      } else if (formData.coverLetter.trim().length < 50) {
        newErrors.coverLetter = 'Cover letter should be at least 50 characters';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      
      if (success) {
        setIsSuccess(true);
      } else {
        // Handle submission error
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      resumeFile: null
    });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {isSuccess ? 'Application Submitted' : `Apply to ${job.title}`}
          </h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Application Submitted Successfully!</h4>
            <p className="text-gray-600 mb-6">
              Your application for {job.title} at {job.company} has been submitted. You will receive a confirmation email shortly.
            </p>
            <Button variant="secondary" size="lg" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {['Personal Info', 'Cover Letter', 'Resume', 'Review'].map((stepTitle, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step > index + 1 
                        ? 'bg-green-500 text-white' 
                        : step === index + 1 
                          ? 'bg-[rgb(var(--primary-blue))] text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > index + 1 ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${
                      step === index + 1 ? 'text-[rgb(var(--primary-blue))] font-medium' : 'text-gray-500'
                    }`}>
                      {stepTitle}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Your Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-blue))] ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-blue))] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-blue))] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 2: Cover Letter */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Cover Letter</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Tell us why you're interested in this position and how your skills align with the job requirements.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="coverLetter">
                      Cover Letter*
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={8}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary-blue))] ${
                        errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Write your cover letter here..."
                    />
                    {errors.coverLetter && (
                      <p className="mt-1 text-sm text-red-500">{errors.coverLetter}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 3: Resume Upload */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Upload Resume</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your resume or CV. Accepted formats: PDF, DOCX, TXT (Max 5MB)
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="resumeFile"
                      name="resumeFile"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                    />
                    
                    {formData.resumeFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-[rgb(var(--primary-blue))] mb-3" />
                        <p className="text-gray-800 font-medium mb-1">{formData.resumeFile.name}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, resumeFile: null }))}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer" 
                        onClick={() => document.getElementById('resumeFile')?.click()}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-800 font-medium mb-1">Click to upload your resume</p>
                        <p className="text-sm text-gray-500">or drag and drop file here</p>
                      </div>
                    )}
                  </div>
                  {errors.resumeFile && (
                    <p className="mt-1 text-sm text-red-500">{errors.resumeFile}</p>
                  )}
                </div>
              )}
              
              {/* Step 4: Review and Submit */}
              {step === 4 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Review Your Application</h4>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Personal Information</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Cover Letter</h5>
                    <p className="text-sm text-gray-800 whitespace-pre-line">
                      {formData.coverLetter.length > 200 
                        ? `${formData.coverLetter.substring(0, 200)}...` 
                        : formData.coverLetter}
                    </p>
                    {formData.coverLetter.length > 200 && (
                      <p className="text-xs text-gray-500 mt-2">
                        (Cover letter truncated for preview)
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Resume</h5>
                    {formData.resumeFile ? (
                      <div className="flex items-center text-sm">
                        <FileText className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="font-medium">{formData.resumeFile.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No resume uploaded (optional)</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="md" 
                  onClick={handlePrevStep}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 4 ? (
                <Button 
                  type="button" 
                  variant="primary" 
                  size="md" 
                  onClick={handleNextStep}
                  className="flex items-center"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  loading={isSubmitting}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 