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
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#05050A]" id="hero">
      
      {/* Background Video with Parallax */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[#05050A]"
      >
        <video 
          src="/creator-hero.mp4" 
          className="w-full h-full object-cover opacity-50 mix-blend-screen"
          autoPlay
          loop
          muted
          playsInline
          style={{ transformOrigin: 'center center' }}
        />
        {/* Gradients to blend video into the dark UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/50 to-transparent z-10" />

        {/* Floating Neon Geometry */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
          {/* Cyan Hexagon */}
          <svg className="absolute top-[10%] right-[15%] w-32 h-32 animate-[spin_20s_linear_infinite]" viewBox="0 0 60 68" fill="none">
            <path d="M30 2L58 18V50L30 66L2 50V18L30 2Z" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.8" fill="rgba(0, 240, 255, 0.05)" />
          </svg>
          {/* Magenta Triangle */}
          <svg className="absolute bottom-[20%] left-[10%] w-24 h-24 animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 50 44" fill="none">
            <path d="M25 2L48 42H2L25 2Z" stroke="#FF003C" strokeWidth="1" strokeOpacity="0.8" fill="rgba(255, 0, 60, 0.05)" />
          </svg>
          {/* Glowing Accents */}
          <div className="absolute top-1/4 left-1/3 w-[1px] h-64 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent shadow-[0_0_15px_#00F0FF]" />
          <div className="absolute bottom-1/3 right-1/4 w-[1px] h-40 bg-gradient-to-b from-transparent via-[#FF003C] to-transparent shadow-[0_0_15px_#FF003C]" />
        </div>
      </div>

      {/* Cyberpunk Scanlines overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(rgba(255,255,255,0.02) 50%, transparent 50%)', backgroundSize: '100% 4px', opacity: 0.3 }} />

      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-[25vh] md:pt-[30vh]">
        <Reveal>
          <div className="max-w-4xl relative">
            
            {/* Tech Accent Line */}
            <div className="absolute -left-6 md:-left-12 top-2 bottom-4 w-1 bg-gradient-to-b from-[#00F0FF] via-[#FF003C] to-transparent hidden md:block shadow-[0_0_10px_#00F0FF]"></div>
            
            <div className="text-[#00F0FF] font-mono text-xs md:text-sm tracking-[0.2em] mb-4 uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              SYSTEM.INIT // CONTENT.COMPILE
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-heading text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
              <span className="font-light text-white/90">Transform Your</span> <br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#FF003C]">Raw Footage</span><br />
              <span className="font-light text-white/90">into</span> <span className="font-extrabold text-[#00F0FF] italic pr-4 tracking-tighter drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">Masterpieces.</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 font-mono max-w-xl leading-relaxed font-light border-l-2 border-[#FF003C]/50 pl-5">
              Vizag's premier dedicated space for high-end video editing, professional podcasts, and end-to-end digital storytelling.
            </p>
          </div>
        </Reveal>
      </div>

    </section>
  );
}
