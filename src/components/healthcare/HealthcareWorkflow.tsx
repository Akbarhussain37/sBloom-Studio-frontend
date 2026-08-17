import { useState } from 'react';
import Reveal from '../Reveal';

export default function HealthcareWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Standardized Capture",
      desc: "Physicians follow department-specific templates using our guided recording workflow. Only 15 minutes required per video.",
      image: "/assets/images/workflow_capture.jpg"
    },
    {
      title: "Institutional Post-Production",
      desc: "Our editing team applies your hospital's specific branding, clinical disclaimers, and accessibility captions.",
      image: "/assets/images/workflow_postproduction.jpg"
    },
    {
      title: "Multi-Channel Distribution",
      desc: "Assets are delivered ready for your hospital's website, internal portals, and social media channels.",
      image: "/assets/images/workflow_distribution.jpg"
    }
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-white relative overflow-hidden" id="workflow">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy-dark leading-[1.1] mb-6 tracking-tight">
              A frictionless process for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">busy staff.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
              We separate the medical expertise from the video production. Your doctors do what they do best, and our platform handles the rest.
            </p>
          </div>
        </Reveal>

        {/* Minimalist Interactive Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Dynamic Cross-Fading Image */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-slate-50 border border-slate-100">
            {steps.map((step, idx) => (
              <img
                key={idx}
                src={step.image}
                alt={step.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  activeStep === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
          </div>

          {/* Right Side: Ultra-Minimalist Text Blocks */}
          <div className="w-full lg:w-1/2 relative py-8">
            
            {/* Sliding Progress Indicator */}
            <div className="absolute left-0 top-10 bottom-10 w-[3px] bg-slate-100 rounded-full hidden md:block">
              <div 
                className="absolute left-0 w-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  height: `${100 / steps.length}%`,
                  top: `${(activeStep * 100) / steps.length}%`
                }}
              />
            </div>

            <div className="flex flex-col gap-12 md:pl-12">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                
                return (
                  <div 
                    key={idx} 
                    className="relative group cursor-pointer transition-all duration-500"
                    onMouseEnter={() => setActiveStep(idx)}
                  >
                    <div className={`transition-all duration-500 ${
                      isActive 
                        ? 'opacity-100 transform translate-x-2 md:translate-x-4' 
                        : 'opacity-40 hover:opacity-70 transform translate-x-0'
                    }`}>
                      <div className="mb-2">
                        <span className={`text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          0{idx + 1}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-navy-dark">
                        {step.title}
                      </h3>
                      
                      <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}>
                        <p className="leading-relaxed text-lg text-slate-600 font-light overflow-hidden">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
