import React from 'react';
import GradientText from './GradientText';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Starting your career journey" }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="text-center max-w-lg px-6">
        <GradientText 
          gradient="blue-purple"
          size="5xl" 
          weight="bold"
          animation="flow"
          className="mb-8"
        >
          JobeasyO
        </GradientText>
        
        {/* Modern loading indicator */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          {/* Outer spinning circle */}
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500/30 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          
          {/* Middle spinning circle */}
          <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-purple-500/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 animate-pulse"></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white shadow-glow"></div>
          </div>
        </div>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <p className="text-lg text-white/80">{message}</p>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full bg-primary-blue animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Loading bar */}
        <div className="w-64 h-1 mx-auto bg-gray-800 rounded-full overflow-hidden">
          <div className="animate-loading-bar h-full rounded-full"></div>
        </div>
        
        <p className="mt-6 text-gray-400 text-sm max-w-md mx-auto">
          We're setting up your AI career assistant to help you find the perfect role that matches your skills and aspirations.
        </p>
      </div>
    </div>
  );
}
