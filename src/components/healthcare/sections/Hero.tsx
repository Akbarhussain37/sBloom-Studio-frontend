import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PulsenovaHeroBackground from '../PulsenovaHeroBackground';

export default function Hero() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `00:${mins}:${secs}:00`;
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden py-20 px-6 lg:px-12 bg-[#F4F1EA]">
      
      {/* Pulsenova Ambient Silk Ribbon Background Animation */}
      <PulsenovaHeroBackground />

      {/* Decorative Cross Mark (Bottom Right) */}
      <motion.div 
        className="absolute bottom-10 right-12 text-[var(--color-health-teal)] opacity-50 z-20 pointer-events-none hidden md:block"
        animate={{ rotate: [0, 0.3, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </motion.div>


      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 relative">
        
        {/* Text Content */}
        <div className="z-10 relative">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="relative text-5xl md:text-7xl font-health-display text-[var(--color-health-teal-dark)] leading-[1.1] tracking-tight mb-6"
          >
            <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="block">You Practice Medicine.</motion.span>
            <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="block text-[var(--color-health-teal)]">We Perfect Your <span className="text-brand-red font-health-display italic font-normal">Content.</span></motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[var(--color-health-teal-dark)]/80 max-w-xl mb-8 font-light leading-relaxed"
          >
            Turn your medical expertise into engaging social media videos without the editing hassle. We handle the post-production and strategy so you can focus on your patients while expanding your digital reach.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative inline-block"
          >
            <motion.button 
              className="relative bg-[var(--color-health-coral)] hover:bg-[#d65f37] text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:-translate-y-0.5 overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Inner glow pulse (0% -> 4% -> 0% over 5s) */}
              <motion.div 
                className="absolute inset-0 bg-white mix-blend-screen pointer-events-none rounded-full"
                animate={{ opacity: [0, 0.04, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              />
              <span className="relative z-10">Start Growing Today</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Viewfinder Frame (Hero Portrait) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full max-w-lg mx-auto bg-gradient-to-br from-[var(--color-health-teal)] to-[var(--color-health-teal-dark)] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/50 z-20 pointer-events-none" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/50 z-20 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/50 z-20 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/50 z-20 pointer-events-none" />

          {/* REC Status */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 z-20 pointer-events-none">
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-3 h-3 bg-[var(--color-health-coral)] rounded-full"
            />
            <span className="font-health-mono text-white text-sm font-medium tracking-wider">REC</span>
            <span className="font-health-mono text-white/80 text-sm">{formatTime(time)}</span>
          </div>

          {/* 10 seconds loop video for hero section */}
          <video 
            src="/give_me_a_illustration_animate (4).mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Subtle gradient overlay to simulate studio light */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
        </motion.div>
      </div>
    </section>
  );
}
