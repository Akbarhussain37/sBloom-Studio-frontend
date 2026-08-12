import Reveal from './Reveal';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden" id="hero">
      
      {/* Background Image with Parallax & Ken Burns */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[#0A0818]"
      >
        <img 
          src="assets/images/hero.png" 
          alt="sBloom Studio"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity animate-slowZoom"
          style={{ transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0818] via-[#0A0818]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0818] via-[#0A0818]/40 to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-[25vh] md:pt-[30vh]">
        <Reveal>
          <div className="max-w-4xl relative">
            
            {/* Minimalist Accent Line */}
            <div className="absolute -left-6 md:-left-12 top-2 bottom-4 w-1 bg-gradient-to-b from-brand-red to-transparent hidden md:block"></div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-heading text-white leading-[1.1] tracking-tight mb-6 mix-blend-screen">
              <span className="font-light text-white/90">Transform Your</span> <br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Raw Footage</span><br />
              <span className="font-light text-white/90">into</span> <span className="font-extrabold text-brand-red italic pr-4 tracking-tighter">Masterpieces.</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 font-body max-w-xl leading-relaxed font-light border-l-2 border-brand-red/50 pl-5">
              Vizag's premier dedicated space for high-end video editing, professional podcasts, and end-to-end digital storytelling.
            </p>
          </div>
        </Reveal>
      </div>



    </section>
  );
}
