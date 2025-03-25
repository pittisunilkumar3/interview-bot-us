import React from 'react';
import Container from './Container';
import Card from './Card';
import GradientText from './GradientText';
import { Mic, Search, BriefcaseBusiness, UserRound, Sparkles, BarChart3 } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Voice-Driven Interaction',
      description: 'Natural conversation with AI to discuss your career goals and aspirations.',
      icon: <Mic />,
      color: 'bg-[rgba(var(--primary-blue),0.1)]',
      textColor: 'text-[rgb(var(--primary-blue))]',
    },
    {
      title: 'Smart Job Matching',
      description: 'Advanced algorithms match your skills with relevant job opportunities.',
      icon: <Search />,
      color: 'bg-[rgba(var(--primary-gold),0.1)]',
      textColor: 'text-[rgb(var(--primary-gold))]',
    },
    {
      title: 'Career Profile Building',
      description: 'Build a comprehensive career profile through natural conversation.',
      icon: <UserRound />,
      color: 'bg-[rgba(var(--accent-warmgray),0.3)]',
      textColor: 'text-gray-700',
    },
    {
      title: 'Job Market Insights',
      description: 'Get real-time insights into industry trends and market demand.',
      icon: <BarChart3 />,
      color: 'bg-[rgba(var(--accent-sand),0.3)]',
      textColor: 'text-gray-700',
    },
    {
      title: 'AI Career Guidance',
      description: 'Personalized career advice and guidance from advanced AI.',
      icon: <Sparkles />,
      color: 'bg-[rgba(var(--primary-blue),0.1)]',
      textColor: 'text-[rgb(var(--primary-blue))]',
    },
    {
      title: 'Job Opportunity Alerts',
      description: 'Get notified of new job opportunities that match your profile.',
      icon: <BriefcaseBusiness />,
      color: 'bg-[rgba(var(--primary-gold),0.1)]',
      textColor: 'text-[rgb(var(--primary-gold))]',
    },
  ];

  return (
    <section className="py-16 bg-[rgb(var(--accent-cream))]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <GradientText gradient="blue-gold" size="3xl">
              Powerful Features
            </GradientText> To Advance Your Career
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how JobeasyO helps you find the perfect career match with these innovative features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="elevated" 
              className="h-full"
              hoverable
            >
              <div className="p-6 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-lg ${feature.color} ${feature.textColor} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
} 