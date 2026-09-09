import { useState, useEffect, useRef } from 'react';
import Reveal from './Reveal';

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePhase, setActivePhase] = useState(1);

  // Use Intersection Observer for perfect, infallible sync with the cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When a card hits the center of the screen, set it as active
            if (entry.target.id === 'roadmap-card-1') setActivePhase(1);
            if (entry.target.id === 'roadmap-card-2') setActivePhase(2);
            if (entry.target.id === 'roadmap-card-3') setActivePhase(3);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px', // Trigger when card is in the middle 20% of screen
        threshold: 0
      }
    );

    const card1 = document.getElementById('roadmap-card-1');
    const card2 = document.getElementById('roadmap-card-2');
    const card3 = document.getElementById('roadmap-card-3');

    if (card1) observer.observe(card1);
    if (card2) observer.observe(card2);
    if (card3) observer.observe(card3);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-32 relative" id="roadmap">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 relative items-start">
          
          {/* Sticky Left Column (Title & Context) */}
          <div className="md:w-[28%] shrink-0 md:sticky md:top-40 relative z-10 mb-12 md:mb-0 pt-4">
            <Reveal>

              
              <h2 className="text-3xl lg:text-[2.5rem] font-heading font-extrabold mb-6 leading-[1.15] tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-navy via-navy to-brand-primary">
                  The 3-Phase<br/>Studio Rollout
                </span>
              </h2>
              
              <p className="text-base text-gray-500 mb-10 leading-relaxed font-light">
                We are building market traction step by step. See what's available now and what's on the horizon.
              </p>
              
              {/* Dynamic Scroll Tracker */}
              <div className="hidden md:flex flex-col gap-8 relative mt-4">
                {/* Connecting Background Line Container (Perfectly centered on the 48px circles) */}
                <div className="absolute left-[23px] top-[24px] bottom-[24px] w-[2px] bg-gray-200 -z-10">
                  {/* Active Progress Line */}
                  <div 
                    className="absolute top-0 left-0 w-full bg-brand-primary transition-all duration-700 ease-in-out"
                    style={{ height: activePhase === 1 ? '0%' : activePhase === 2 ? '50%' : '100%' }}
                  ></div>
                </div>
                
                {/* Step 1 */}
                <div className="flex items-center gap-4 transition-all duration-500">
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold font-heading text-lg transition-all duration-500 ${
                    activePhase === 1 
                      ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(222,27,84,0.4)] ring-4 ring-brand-primary/20' 
                      : 'bg-brand-primary text-white' 
                  }`}>1</div>
                  <div className={`transition-opacity duration-500 ${activePhase > 1 ? 'opacity-40' : 'opacity-100'}`}>
                    <span className={`block font-bold text-[10px] tracking-widest uppercase transition-colors ${activePhase === 1 ? 'text-brand-primary' : 'text-gray-400'}`}>Phase One</span>
                    <span className={`font-heading text-sm font-bold transition-colors ${activePhase === 1 ? 'text-navy' : 'text-gray-500'}`}>The Editing Bay</span>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-4 transition-all duration-500">
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold font-heading text-lg transition-all duration-500 ${
                    activePhase === 2 
                      ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(222,27,84,0.4)] ring-4 ring-brand-primary/20' 
                      : activePhase > 2
                        ? 'bg-brand-primary text-white' 
                        : 'bg-white border-2 border-gray-200 text-gray-400' 
                  }`}>2</div>
                  <div className={`transition-opacity duration-500 ${activePhase < 2 ? 'opacity-40' : activePhase > 2 ? 'opacity-40' : 'opacity-100'}`}>
                    <span className={`block font-bold text-[10px] tracking-widest uppercase transition-colors ${activePhase === 2 ? 'text-brand-primary' : 'text-gray-400'}`}>Phase Two</span>
                    <span className={`font-heading text-sm font-bold transition-colors ${activePhase === 2 ? 'text-navy' : 'text-gray-500'}`}>The Lounge</span>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-4 transition-all duration-500">
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold font-heading text-lg transition-all duration-500 ${
                    activePhase === 3 
                      ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(222,27,84,0.4)] ring-4 ring-brand-primary/20' 
                      : 'bg-white border-2 border-gray-200 text-gray-400' 
                  }`}>3</div>
                  <div className={`transition-opacity duration-500 ${activePhase < 3 ? 'opacity-40' : 'opacity-100'}`}>
                    <span className={`block font-bold text-[10px] tracking-widest uppercase transition-colors ${activePhase === 3 ? 'text-brand-primary' : 'text-gray-400'}`}>Phase Three</span>
                    <span className={`font-heading text-sm font-bold transition-colors ${activePhase === 3 ? 'text-navy' : 'text-gray-500'}`}>Full Studio</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          
          {/* Scrolling Right Column (Cards) */}
          <div className="flex-1 flex flex-col gap-24 md:gap-32 pb-12">
            
            {/* Level 1 */}
            <div id="roadmap-card-1">
              <Reveal delay={0}>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group min-h-[600px] flex flex-col justify-end">
                  {/* Cinematic Background */}
                  <img src="/assets/images/level1.png" alt="The Editing Bay" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#0A0818]"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-8 right-8 bg-brand-primary/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(222,27,84,0.5)] border border-brand-primary/50">
                    Active / Open Now
                  </div>

                  {/* Content Panel */}
                  <div className="relative z-10 p-8 md:p-12 w-full mt-auto">
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight mb-2">Level 1: The Editing Bay</h3>
                    <p className="text-brand-primary font-bold mb-6 text-sm uppercase tracking-[0.15em]">Structural Complete</p>
                    <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light max-w-2xl">
                      A dedicated post-production hub designed to take existing footage and elevate it. The structural work is fully complete, providing a dust-free, professional environment.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                          <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <strong className="block text-white mb-1 font-heading text-lg tracking-wide">In-House Editors</strong>
                          <span className="text-sm text-gray-400 leading-relaxed block">Access to 3 state-of-the-art editing setups.</span>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                          <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <strong className="block text-white mb-1 font-heading text-lg tracking-wide">Frictionless Handoff</strong>
                          <span className="text-sm text-gray-400 leading-relaxed block">Drop off files, walk away with a polished product.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex items-start md:items-center gap-5 transition-all hover:bg-white/10 group/card">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center shrink-0 text-white shadow-lg group-hover/card:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-white block mb-1 font-heading uppercase tracking-widest text-xs">Target Audience</strong> 
                        <span className="text-gray-400 text-sm leading-relaxed block">Creators and businesses with ideas but lacking technical execution.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Level 2 */}
            <div id="roadmap-card-2">
              <Reveal delay={100}>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group min-h-[500px] flex flex-col justify-end opacity-90 transition-opacity hover:opacity-100">
                  {/* Cinematic Background */}
                  <img src="/assets/images/level2.png" alt="Podcast Lounge" loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale-[30%] transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#0A0818]"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md text-white/80 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                    Coming Soon
                  </div>

                  {/* Content Panel */}
                  <div className="relative z-10 p-8 md:p-12 w-full mt-auto">
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight mb-2">Level 2: The Lounge</h3>
                    <p className="text-gray-400 font-bold mb-6 text-sm uppercase tracking-[0.15em]">In Progress</p>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light max-w-2xl">
                      A collaborative space designed for vertical-specific storytelling, idea generation, and high-quality podcast recordings.
                    </p>
                    
                    <ul className="space-y-4">
                      <li className="flex gap-5 items-center p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-colors hover:bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#8B88C8]"></div>
                        <span className="text-gray-300 text-sm md:text-base"><strong className="text-white font-heading tracking-wide">Podcast Studio:</strong> Record professional audio/video.</span>
                      </li>
                      <li className="flex gap-5 items-center p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-colors hover:bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#8B88C8]"></div>
                        <span className="text-gray-300 text-sm md:text-base"><strong className="text-white font-heading tracking-wide">Collaboration Lounge:</strong> Comfortable sofas & digital workstations.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Level 3 */}
            <div id="roadmap-card-3">
              <Reveal delay={100}>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group min-h-[500px] flex flex-col justify-end opacity-70 transition-opacity hover:opacity-100 border border-white/5">
                  {/* Cinematic Background */}
                  <img src="/assets/images/level3.png" alt="Full Studio" loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale-[70%] transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#0A0818]"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md text-white/60 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                    Future Roadmap
                  </div>

                  {/* Content Panel */}
                  <div className="relative z-10 p-8 md:p-12 w-full mt-auto">
                    <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight mb-2">Level 3: Full Studio</h3>
                    <p className="text-gray-500 font-bold mb-6 text-sm uppercase tracking-[0.15em]">Planning Phase</p>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light max-w-2xl">
                      The ultimate end-to-end production environment, combining advanced tech with complete acoustic isolation.
                    </p>
                    
                    <ul className="space-y-4">
                      <li className="flex gap-5 items-center p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-colors hover:bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <span className="text-gray-400 text-sm md:text-base"><strong className="text-white font-heading tracking-wide">Complete Isolation:</strong> Professional dubbing studio.</span>
                      </li>
                      <li className="flex gap-5 items-center p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-colors hover:bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <span className="text-gray-400 text-sm md:text-base"><strong className="text-white font-heading tracking-wide">Reverse Workflow:</strong> Shoot, edit, walk out with a final product.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
