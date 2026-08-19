import { useState, useEffect } from 'react';
import Reveal from '../Reveal';
import type { HealthcareTemplateCategory } from '../../data/healthcareTemplates';
import { FiArrowRight } from 'react-icons/fi';

const CATEGORIES: HealthcareTemplateCategory[] = [
  'Introduction',
  'Treatment',
  'Education',
  'Patient Guidance',
  'Trust / Story'
];

export default function HealthcareTemplates() {
  const [activeCategory, setActiveCategory] = useState<HealthcareTemplateCategory>('Introduction');
  const [isHovering, setIsHovering] = useState(false);

  // Auto-cycle categories every 4 seconds unless hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveCategory(current => {
        const currentIndex = CATEGORIES.indexOf(current);
        const nextIndex = (currentIndex + 1) % CATEGORIES.length;
        return CATEGORIES[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const getStyleForState = (imageIndex: number) => {
    const activeIndex = CATEGORIES.indexOf(activeCategory);
    // Calculate the circular offset (0 to 4)
    const offset = (imageIndex - activeIndex + 5) % 5;
    
    switch (offset) {
      case 0: // Active
        return {
          zIndex: 50,
          transform: 'translate(0, 10%) scale(1)',
          opacity: 1,
          filter: 'blur(0px) brightness(1)'
        };
      case 1: // Right 1
        return {
          zIndex: 40,
          transform: `translate(10%, 18%) scale(0.9)`,
          opacity: 0.8,
          filter: 'blur(2px) brightness(0.7)'
        };
      case 2: // Right 2
        return {
          zIndex: 30,
          transform: `translate(20%, -2%) scale(0.75)`,
          opacity: 0.4,
          filter: 'blur(5px) brightness(0.4)'
        };
      case 3: // Left 2
        return {
          zIndex: 30,
          transform: `translate(-20%, 22%) scale(0.75)`,
          opacity: 0.4,
          filter: 'blur(5px) brightness(0.4)'
        };
      case 4: // Left 1
        return {
          zIndex: 40,
          transform: `translate(-10%, 2%) scale(0.9)`,
          opacity: 0.8,
          filter: 'blur(2px) brightness(0.7)'
        };
      default:
        return {
          zIndex: 0,
          opacity: 0
        };
    }
  };

  return (
    <section 
      className="bg-white relative overflow-hidden flex items-center py-16 lg:py-24" 
      id="templates"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      
      {/* Background glow effects (Adapted for light mode) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 xl:px-24 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Column: Typography & Navigation */}
        <div className="w-full lg:w-5/12 flex flex-col pt-10">
          <Reveal>

            
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy-dark leading-[1.1] mb-6 tracking-tight">
              A hospital's video library, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ready to record.</span>
            </h2>
            
            <p className="text-base md:text-lg text-slate-600 font-light leading-relaxed mb-12 max-w-lg">
              Explore our proven formats. Discover script structures, recording guidance, and professional deliverables designed specifically for healthcare.
            </p>
          </Reveal>

          {/* Interactive Vertical Menu */}
          <div className="flex flex-col gap-1 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-200" />
            
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  onMouseEnter={() => setActiveCategory(category)}
                  className={`group relative text-left py-3 pl-6 transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    isActive ? 'text-navy-dark' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {/* Active Indicator Line */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-[2px] bg-blue-600 transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`} 
                  />
                  
                  <span className={`font-heading text-xl md:text-2xl font-bold tracking-tight transition-transform duration-300 ${
                    isActive ? 'translate-x-4' : 'group-hover:translate-x-2'
                  }`}>
                    {category}
                  </span>

                  <FiArrowRight 
                    className={`text-lg transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0 text-blue-600' : 'opacity-0 -translate-x-4'
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Floating Collage */}
        <div className="w-full lg:w-7/12 relative h-[450px] lg:h-[600px] flex items-center justify-center perspective-1000">
          
          {/* Main Floating Container */}
          <div className="relative w-full max-w-[700px] aspect-square lg:aspect-auto lg:h-[500px] flex items-center justify-center transform-style-3d">
            
            {/* 0. Intro Image */}
            <div 
              className="absolute w-[95%] md:w-[90%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
              style={getStyleForState(0)}
            >
              <img src="/assets/images/magnific_intro.jpg" alt="Doctor Introduction" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent flex items-end p-8">
                <div className="text-white font-heading font-bold text-3xl tracking-tight drop-shadow-md">Introduction Formats</div>
              </div>
            </div>

            {/* 1. Treatment Image */}
            <div 
              className="absolute w-[95%] md:w-[90%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
              style={getStyleForState(1)}
            >
              <img src="/assets/images/magnific_treatment.jpg" alt="Treatment Explanation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent flex items-end p-8">
                <div className="text-white font-heading font-bold text-3xl tracking-tight drop-shadow-md">Clinical Procedures</div>
              </div>
            </div>

            {/* 2. Education Image */}
            <div 
              className="absolute w-[95%] md:w-[90%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
              style={getStyleForState(2)}
            >
              <img src="/assets/images/magnific_education.jpg" alt="Patient Education" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent flex items-end p-8">
                <div className="text-white font-heading font-bold text-3xl tracking-tight drop-shadow-md">Educational Content</div>
              </div>
            </div>

            {/* 3. Patient Guidance Image */}
            <div 
              className="absolute w-[95%] md:w-[90%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
              style={getStyleForState(3)}
            >
              <img src="/assets/images/magnific_guidance.jpg" alt="Patient Guidance" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent flex items-end p-8">
                <div className="text-white font-heading font-bold text-3xl tracking-tight drop-shadow-md">Patient Guidance</div>
              </div>
            </div>

            {/* 4. Trust / Story Image */}
            <div 
              className="absolute w-[95%] md:w-[90%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 transition-all duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
              style={getStyleForState(4)}
            >
              <img src="/assets/images/magnific_trust.jpg" alt="Trust and Stories" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent flex items-end p-8">
                <div className="text-white font-heading font-bold text-3xl tracking-tight drop-shadow-md">Trust & Stories</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
