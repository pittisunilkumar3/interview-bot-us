import React, { useState, useEffect, useCallback } from 'react';
import { toggleMicrophone, muteOutput, unmuteOutput } from '@/lib/callFunctions';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Role } from 'ultravox-client';

interface MicToggleButtonProps {
  isCallActive?: boolean;
  agentStatus?: string;
  showMuteSpeakerButton?: boolean;
  role?: Role;
}

export default function MicToggleButton({ 
  isCallActive = true, 
  agentStatus = 'active', 
  showMuteSpeakerButton = false,
  role
}: MicToggleButtonProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleToggleMic = useCallback(async () => {
    if (!isCallActive || isProcessing) return;
    
    try {
      setIsProcessing(true);
      await toggleMicrophone();
      setIsMicMuted(prev => !prev);
    } catch (error) {
      console.error('Error toggling microphone:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isCallActive, isProcessing]);
  
  const handleToggleSpeaker = useCallback(async () => {
    if (!isCallActive || isProcessing) return;
    
    try {
      setIsProcessing(true);
      if (isSpeakerMuted) {
        await unmuteOutput();
      } else {
        await muteOutput();
      }
      setIsSpeakerMuted(prev => !prev);
    } catch (error) {
      console.error('Error toggling speaker:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isCallActive, isSpeakerMuted, isProcessing]);
  
  // Reset mute state when call starts
  useEffect(() => {
    if (isCallActive) {
      setIsMicMuted(false);
      setIsSpeakerMuted(false);
    }
  }, [isCallActive]);
  
  // Determine if this is a user or agent mic toggle
  const isUserMic = role === Role.USER || !role;
  const isAgentMic = role === Role.AGENT;
  
  if (!isCallActive) return null;
  
  // Render mic or speaker button based on role
  if (isAgentMic) {
    return (
      <button
        onClick={handleToggleSpeaker}
        disabled={!isCallActive || isProcessing}
        className={`
          flex items-center justify-center h-10 px-4 rounded-md
          transition-all duration-300 ease-in-out focus:outline-none
          ${isSpeakerMuted 
            ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 hover:text-gray-300' 
            : 'bg-primary-purple text-white hover:bg-purple-600'}
          ${!isCallActive || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          backdrop-blur-sm glass border border-gray-700/50
        `}
        aria-label={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
        title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSpeakerMuted ? (
          <VolumeX className="w-5 h-5 mr-2" />
        ) : (
          <Volume2 className="w-5 h-5 mr-2" />
        )}
        {isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
      </button>
    );
  }
  
  // User microphone button
  return (
    <button
      onClick={handleToggleMic}
      disabled={!isCallActive || isProcessing || agentStatus === 'connecting'}
      className={`
        flex items-center justify-center h-10 px-4 rounded-md
        transition-all duration-300 ease-in-out focus:outline-none
        ${isMicMuted 
          ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 hover:text-gray-300' 
          : 'bg-primary-blue text-white hover:bg-blue-600'}
        ${!isCallActive || isProcessing || agentStatus === 'connecting' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        backdrop-blur-sm glass border border-gray-700/50
      `}
      aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
      title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isMicMuted ? (
        <MicOff className="w-5 h-5 mr-2" />
      ) : (
        <Mic className="w-5 h-5 mr-2" />
      )}
      {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
    </button>
  );
}
