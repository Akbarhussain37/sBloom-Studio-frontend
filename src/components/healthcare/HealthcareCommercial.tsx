"use client";
import React, { useRef, useState } from 'react';
import Reveal from '../Reveal';
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TiltCard = ({ children, className = "", spotlightColor = "rgba(255,255,255,0.1)" }: { children: React.ReactNode, className?: string, spotlightColor?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    
    const rotateY = ((x / rect.width) - 0.5) * 10; // Max 5 deg
    const rotateX = ((y / rect.height) - 0.5) * -10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div style={{ perspective: '1200px' }} className="h-full">
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative h-full transition-all duration-300 ease-out overflow-hidden ${className}`}
        style={{
          transform: isHovering 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 z-0"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
          }}
        />
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function HealthcareCommercial() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-[#F4F7FF]" id="pricing">
      
      {/* Animated Light Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[#F4F7FF] z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 blur-[150px] mix-blend-multiply animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-400/10 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">

            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy-dark leading-tight mb-6 tracking-tight">
              Scalable <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enterprise Licensing.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              Predictable budgeting for hospital marketing teams. Replace unpredictable agency retainers with a scalable, flat-fee content engine.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <Reveal delay={100}>
            <TiltCard 
              className="p-10 md:p-14 rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-xl shadow-blue-900/5" 
              spotlightColor="rgba(59,130,246,0.05)"
            >
              <h3 className="text-3xl font-heading font-bold text-navy-dark mb-2">Department Plan</h3>
              <p className="text-slate-500 font-light text-lg mb-10">For single departments or clinics.</p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-navy-dark tracking-tight">Custom</span>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {[
                  "Access to core medical templates",
                  "Standardized editing pipeline",
                  "Dedicated account manager",
                  "Basic compliance checks"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-700">
                    <FiCheck className="text-blue-600 text-xl flex-shrink-0" />
                    <span className="font-medium tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4">
                <Link to="/contact" className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy-dark font-bold text-lg transition-colors border border-slate-200">
                  Contact Sales
                </Link>
              </div>
            </TiltCard>
          </Reveal>

          {/* Plan 2 */}
          <Reveal delay={200}>
            <TiltCard 
              className="p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-navy-dark to-[#0F172A] border border-slate-800 shadow-2xl shadow-blue-900/20"
              spotlightColor="rgba(255,255,255,0.05)"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-blue-600/30">
                  <FiZap className="text-white" /> Recommended
                </span>
              </div>

              <h3 className="text-3xl font-heading font-bold text-white mb-2">Hospital Network</h3>
              <p className="text-slate-300 font-light text-lg mb-10">For multi-location healthcare systems.</p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-white tracking-tight">Enterprise</span>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {[
                  "Unlimited departments & locations",
                  "Custom template engineering",
                  "Enterprise API integration",
                  "Advanced clinical review workflows",
                  "Priority post-production SLAs"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-200">
                    <FiCheck className="text-blue-400 text-xl flex-shrink-0" />
                    <span className="font-medium tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4">
                <Link to="/contact" className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  Build Custom Plan
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>
          </Reveal>

        </div>
      </div>

      {/* Global styles for the animated mesh background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </section>
  );
}
