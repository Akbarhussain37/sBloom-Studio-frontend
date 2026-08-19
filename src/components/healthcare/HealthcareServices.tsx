"use client";
import React, { useRef, useState } from 'react';
import Reveal from '../Reveal';
import { FiLayers, FiMessageSquare, FiFolder, FiCheckCircle, FiShield, FiLock } from 'react-icons/fi';

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[2rem] bg-white group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] transition-all duration-500 hover:-translate-y-1 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.12), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default function HealthcareServices() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#F5F5F7] relative overflow-hidden" id="services">
      
      {/* Super Subtle Background Mesh */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">

            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-[#1D1D1F] leading-[1.05] mb-6 tracking-tight">
              Enterprise post-production <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">muscle.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-[#86868B] font-medium leading-relaxed max-w-2xl mx-auto">
              We act as a seamless extension of your hospital's communications team. Our infrastructure ensures every video is flawless before it's published.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[250px]">
          
          {/* Card 1: Brand Compliance (Large Horizontal) */}
          <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-1">
            <img 
              src="/assets/images/bento_brand.jpg" 
              alt="Brand Compliance Dashboard"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                <FiShield className="text-white text-xl" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3 tracking-tight">Multi-Department <br/>Brand Compliance</h3>
              <p className="text-white/80 font-light text-lg max-w-md">Strict adherence to your hospital network's complex visual guidelines across every single asset.</p>
            </div>
          </div>

          {/* Card 2: HIPAA Security (Tall Vertical) */}
          <div className="md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-1">
            <img 
              src="/assets/images/bento_security.jpg" 
              alt="HIPAA Security Server"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-10">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 backdrop-blur-md flex items-center justify-center mb-6">
                <FiLock className="text-rose-400 text-xl" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-3 tracking-tight">HIPAA-Compliant Media Handling</h3>
              <p className="text-white/80 font-light text-base">Military-grade encrypted servers ensure absolute patient data protection.</p>
            </div>
          </div>

          {/* Card 3: Bulk Formatting (Small Text Card) */}
          <SpotlightCard className="md:col-span-1 md:row-span-1">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-300">
                <FiLayers className="text-violet-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-[#1D1D1F] mb-2">Bulk Formatting</h3>
                <p className="text-[#86868B] font-light text-sm relative z-20">Scale content production infinitely across massive healthcare networks.</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4: ADA Captions (Small Text Card) */}
          <SpotlightCard className="md:col-span-1 md:row-span-1">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <FiMessageSquare className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-[#1D1D1F] mb-2">ADA Compliant</h3>
                <p className="text-[#86868B] font-light text-sm relative z-20">Flawless accessibility and medical-grade closed captioning accuracy.</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 5: Asset Management (Small Text Card) */}
          <SpotlightCard className="md:col-span-1 md:row-span-1">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300">
                <FiFolder className="text-teal-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-[#1D1D1F] mb-2">Asset Management</h3>
                <p className="text-[#86868B] font-light text-sm relative z-20">Centralized, lightning-fast cloud storage for all final deliverables.</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 6: Clinical Review (Large Wide Bottom Card) */}
          <div className="md:col-span-3 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-1">
            <img 
              src="/assets/images/bento_review.jpg" 
              alt="Clinical Review on iPad"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            {/* Soft gradient from left to right for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-y-0 left-0 p-8 md:p-16 flex flex-col justify-center max-w-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8">
                <FiCheckCircle className="text-white text-3xl" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 tracking-tight">Clinical Review <br/>Integration</h3>
              <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed">
                Built-in, frictionless approval workflows designed specifically for busy doctors to ensure 100% medical accuracy before any video goes live.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
