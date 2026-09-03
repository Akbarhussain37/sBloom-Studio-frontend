import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function Counter({ from = 0, to, duration = 2, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

export default function ReviewLoop() {
  return (
    <section id="review" className="min-h-screen relative flex flex-col justify-center py-20 px-6 lg:px-12 bg-[var(--color-health-sage)]/30">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6"
          >
            Built for <span className="text-[var(--color-health-coral)]">compliance.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--color-health-teal-dark)]/70 font-light mb-12 max-w-lg"
          >
            Medical content requires strict oversight. Our asynchronous review loop allows your legal and compliance teams to approve content with one click.
          </motion.p>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg text-[var(--color-health-teal)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-health-display text-[var(--color-health-teal-dark)]">
                  <Counter to={48} suffix="h" />
                </p>
                <p className="text-sm text-[var(--color-health-teal-dark)]/60 font-health-mono uppercase tracking-wider">Average Turnaround</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg text-[var(--color-health-coral)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-health-display text-[var(--color-health-teal-dark)]">
                  <Counter to={98} suffix="%" />
                </p>
                <p className="text-sm text-[var(--color-health-teal-dark)]/60 font-health-mono uppercase tracking-wider">First-Draft Approval</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Visual UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="relative bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-[var(--color-health-sage)]"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--color-health-sage)]">
            <div>
              <p className="text-sm font-health-mono text-[var(--color-health-teal-dark)]/50 mb-1">Status</p>
              <div className="flex items-center gap-2 bg-[var(--color-health-sage)]/50 text-[var(--color-health-teal-dark)] px-3 py-1 rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-health-teal)]" />
                Pending Compliance Review
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-health-mono text-[var(--color-health-teal-dark)]/50 mb-1">Version</p>
              <p className="text-sm font-bold text-[var(--color-health-teal-dark)]">v1.0</p>
            </div>
          </div>

          <div className="aspect-video bg-[var(--color-health-sage)]/30 rounded-xl mb-6 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-health-teal-dark)" xmlns="http://www.w3.org/2000/svg">
                 <path d="M5 3L19 12L5 21V3Z" stroke="var(--color-health-teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-[var(--color-health-paper)] text-[var(--color-health-teal-dark)] border border-[var(--color-health-teal-dark)]/20 py-3 rounded-xl font-medium text-sm hover:bg-[var(--color-health-sage)] transition-colors">
              Request Edits
            </button>
            <button className="flex-1 bg-[var(--color-health-teal-dark)] text-white py-3 rounded-xl font-medium text-sm hover:bg-[var(--color-health-teal)] transition-colors shadow-md">
              Approve & Export
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
