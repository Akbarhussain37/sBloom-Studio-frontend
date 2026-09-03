import React from 'react';
import HealthcareBackground from './HealthcareBackground';

interface HealthcareScrollytellingWrapperProps {
  children: React.ReactNode;
}

export default function HealthcareScrollytellingWrapper({ children }: HealthcareScrollytellingWrapperProps) {
  return (
    <div className="healthcare-scrollytelling-wrapper relative min-h-screen">
      <HealthcareBackground />
      {/* 
        This div ensures children are rendered above the fixed background,
        creating a new stacking context.
      */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
