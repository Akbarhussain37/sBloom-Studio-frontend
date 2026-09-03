import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FinalCTA() {
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
    <section id="cta" className="min-h-screen relative flex items-center justify-center py-20 px-6 lg:px-12 bg-[var(--color-health-teal-dark)] overflow-hidden">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-health-teal)] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-health-coral)] rounded-full blur-[120px] opacity-10 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="text-4xl md:text-6xl font-health-display text-white leading-[1.1] tracking-tight mb-6"
          >
            Ready to <span className="text-[var(--color-health-coral)]">scale</span> your medical expertise?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-lg mx-auto lg:mx-0 mb-10 font-light"
          >
            Join top hospitals and clinics using sBloom to produce compliant, branded video content without the agency price tag.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button className="bg-[var(--color-health-coral)] hover:bg-[#d65f37] text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(232,113,74,0.3)] hover:shadow-[0_0_30px_rgba(232,113,74,0.5)] hover:-translate-y-0.5">
              Book a Strategy Call
            </button>
            <button className="bg-transparent border border-white/20 hover:border-white/50 hover:bg-white/5 text-white px-8 py-4 rounded-full font-medium transition-all">
              View Pricing
            </button>
          </motion.div>
        </div>

        {/* Viewfinder Frame (CTA Portrait) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 lg:order-2 relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full max-w-lg mx-auto bg-gradient-to-br from-[var(--color-health-teal)] to-black/50 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/50" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/50" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/50" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/50" />

          {/* REC Status */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-3 h-3 bg-[var(--color-health-coral)] rounded-full"
            />
            <span className="font-health-mono text-white text-sm font-medium tracking-wider">REC</span>
            <span className="font-health-mono text-white/80 text-sm">{formatTime(time)}</span>
          </div>

          {/* Placeholder for real image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-[-1]">
            <p className="text-white/60 font-health-mono text-sm mb-4">Image Placeholder</p>
            <p className="text-white/40 text-xs italic">"Doctor smiling directly at camera, confident, warm light, teal backdrop..."</p>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
