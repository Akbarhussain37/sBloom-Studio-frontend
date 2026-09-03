import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TheTransformation() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const [hasAutoSwept, setHasAutoSwept] = useState(false);

  useEffect(() => {
    if (isInView && !hasAutoSwept) {
      setHasAutoSwept(true);
      // Auto-sweep animation
      setTimeout(() => setSliderPosition(20), 500);
      setTimeout(() => setSliderPosition(80), 1200);
      setTimeout(() => setSliderPosition(50), 1900);
    }
  }, [isInView, hasAutoSwept]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="transformation" className="min-h-screen relative flex flex-col items-center justify-center py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6"
        >
          The <span className="text-[var(--color-health-coral)]">Transformation.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--color-health-teal-dark)]/70 font-light max-w-2xl mx-auto"
        >
          Drag to compare the raw footage captured in the clinic against the polished, branded final asset delivered to you.
        </motion.p>
      </div>

      {/* Comparison Slider */}
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ delay: 0.3 }}
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-[var(--color-health-sage)] select-none"
      >
        {/* Raw Panel (Background) */}
        <div className="absolute inset-0 bg-[var(--color-health-sage)] flex flex-col items-center justify-center p-8 text-center border-4 border-dashed border-[var(--color-health-teal)]/20">
          <p className="text-[var(--color-health-teal-dark)]/60 font-health-mono text-sm mb-4">Raw Unedited Video</p>
          <p className="text-[var(--color-health-teal-dark)]/40 text-xs italic max-w-sm">"Unedited smartphone video still of a doctor mid-sentence, slightly off-center framing, flat lighting"</p>
        </div>
        
        {/* Polished Panel (Foreground, clipped) */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-[var(--color-health-teal-dark)] to-[var(--color-health-teal)] flex flex-col items-center justify-center p-8 text-center"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <p className="text-white/60 font-health-mono text-sm mb-4">Polished & Branded</p>
          <p className="text-white/40 text-xs italic max-w-sm">"Same doctor, professionally color-graded video still, clean lower-third caption bar, branded end card"</p>
          
          {/* Mock Lower Third */}
          <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 text-left hidden sm:block">
            <h4 className="text-white font-health-display text-xl mb-1">Dr. Sarah Jenkins</h4>
            <p className="text-white/70 font-health-mono text-xs uppercase tracking-wider">Chief of Cardiology</p>
          </div>
        </div>

        {/* Custom Range Slider Input */}
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Visual Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none transition-all duration-75 ease-out"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 18L2 12L8 6" stroke="var(--color-health-teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L22 12L16 18" stroke="var(--color-health-teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
