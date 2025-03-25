import React from 'react';
import Container from './Container';
import Card from './Card';
import { Transcript } from 'ultravox-client';
import { MessageSquare, User, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CallSectionProps {
  isCallActive: boolean;
  transcripts: Transcript[] | null;
  containerRef: React.RefObject<HTMLDivElement>;
  showUserTranscripts?: boolean;
}

export default function CallSection({ 
  isCallActive, 
  transcripts, 
  containerRef,
  showUserTranscripts = false 
}: CallSectionProps) {
  if (!isCallActive) return null;

  return (
    <section className="py-10 animate-fade-in">
      <Container>
        <Card variant="glass" className="w-full max-w-3xl mx-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-[rgb(var(--primary-blue))]" />
                Conversation in Progress
              </h2>
              
              <div className="px-3 py-1 bg-[rgb(var(--accent-highlight))] rounded-full text-xs font-medium text-[rgb(var(--primary-gold))]">
                Live Session
              </div>
            </div>

            <div 
              ref={containerRef}
              className="bg-white rounded-lg border border-gray-200 h-96 overflow-y-auto scrollbar-visible p-4"
            >
              {transcripts && transcripts.length > 0 ? (
                <div className="flex flex-col space-y-4">
                  {transcripts.map((transcript, index) => {
                    // Skip user transcripts if showUserTranscripts is false
                    if (!showUserTranscripts && transcript.role === 'USER') return null;
                    
                    const isUser = transcript.role === 'USER';
                    const alignmentClass = isUser ? 'justify-end' : 'justify-start';
                    const bubbleColorClass = isUser 
                      ? 'bg-[rgb(var(--primary-blue))] text-white' 
                      : 'bg-[rgb(var(--accent-cream))] text-gray-800';
                    
                    return (
                      <div key={index} className={`flex ${alignmentClass} w-full`}>
                        <div className={`max-w-[80%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[rgb(var(--primary-blue))]' : 'bg-[rgb(var(--primary-gold))]'} text-white flex-shrink-0`}>
                            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex flex-col">
                            <div className={`${bubbleColorClass} px-4 py-2 rounded-2xl`}>
                              {transcript.text}
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                              {formatDistanceToNow(new Date(transcript.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>The conversation will appear here...</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
} 