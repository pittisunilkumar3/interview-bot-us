import React from 'react';
import Image from 'next/image';
import Container from './Container';
import Button from './Button';
import GradientText from './GradientText';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  onStartCallClick: () => void;
  isLoading: boolean;
}

export default function HeroSection({ onStartCallClick, isLoading }: HeroSectionProps) {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-[rgba(var(--accent-cream),0.6)] border border-[rgba(var(--primary-gold),0.2)] rounded-full text-sm font-medium text-[rgb(var(--primary-gold))]">
              <span className="inline-block h-2 w-2 rounded-full bg-[rgb(var(--primary-gold))] mr-2"></span>
              AI-Powered Career Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Find your <GradientText gradient="blue-gold" animation="flow">perfect career</GradientText> with AI assistance
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
              JobeasyO matches your skills and experience with the perfect job opportunities using advanced AI to guide your career journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={onStartCallClick}
                loading={isLoading}
                icon={!isLoading && <Play className="w-4 h-4" />}
                className="shadow-lg"
              >
                Start Voice Conversation
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <Image 
                      src={`https://source.unsplash.com/random/100x100?face&${i}`}
                      alt="User" 
                      width={32} 
                      height={32}
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-[rgb(var(--primary-blue))] font-bold">4.9/5</span> from over 3,000 users
              </div>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 h-[400px] md:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1000&auto=format&fit=crop"
              alt="Career Professional"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.4)]"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[rgb(var(--primary-blue))] text-white flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-medium">AI Career Guidance</h3>
                <p className="text-white/80 text-sm">Interactive voice conversations</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
} 