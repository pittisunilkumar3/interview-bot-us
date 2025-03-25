import React from 'react';
import { Mic, MicOff, PhoneOff, WifiOff, Wifi, Activity } from 'lucide-react';
import Button from './Button';

interface CallControlPanelProps {
  isCallActive: boolean;
  agentStatus: string;
  onEndCall: () => void;
  connectionQuality?: 'excellent' | 'good' | 'poor' | 'disconnected';
  voiceActivity?: 'active' | 'inactive';
}

export default function CallControlPanel({
  isCallActive,
  agentStatus,
  onEndCall,
  connectionQuality = 'excellent',
  voiceActivity = 'inactive'
}: CallControlPanelProps) {

  if (!isCallActive) return null;

  // Map connection quality to visual indicators
  const getConnectionStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-green-400';
      case 'poor': return 'bg-red-500';
      case 'disconnected': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionQuality) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'poor': return 'Poor';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  const getConnectionIcon = () => {
    if (connectionQuality === 'disconnected') {
      return <WifiOff className="h-4 w-4 mr-2" />;
    }
    return <Wifi className="h-4 w-4 mr-2" />;
  };

  const getVoiceActivityColor = () => {
    return voiceActivity === 'active' ? 'bg-green-500' : 'bg-gray-400';
  };

  const isConnecting = agentStatus === 'connecting' || agentStatus === 'Starting call...';

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-3">
      {/* Main control panel */}
      <div className="glass-light p-4 rounded-xl shadow-md border border-[rgba(var(--accent-sand),0.8)]">
        <div className="flex flex-col gap-3">
          {/* Connection status section */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <span className="mr-2">Voice Interaction</span>
              <span className={`inline-block h-2 w-2 rounded-full ${getConnectionStatusColor()} mr-1`}></span>
              <span className="text-xs">{getConnectionStatusText()}</span>
            </div>
            
            {isConnecting ? (
              <div className="animate-pulse flex items-center text-amber-600 text-xs">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                Connecting...
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="xs" 
                onClick={onEndCall}
                icon={<PhoneOff className="h-3.5 w-3.5" />}
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                End Call
              </Button>
            )}
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center">
              {getConnectionIcon()}
              <span>100ms</span>
              <span className="mx-1">•</span>
              <span>{getConnectionStatusText()}</span>
            </div>
            
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              <span>Voice Activity</span>
              <span className={`ml-2 inline-block h-2 w-2 rounded-full ${getVoiceActivityColor()}`}></span>
              <span className="ml-1">{voiceActivity === 'active' ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual voice activity indicator */}
      {voiceActivity === 'active' && (
        <div className="absolute -left-4 -top-4 w-full h-full rounded-full border-4 border-green-400 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
} 