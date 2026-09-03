import { motion } from 'framer-motion';

const painPoints = [
  { text: "Where do I find time to record?", x: -20, y: 10, delay: 0 },
  { text: "Is this HIPAA compliant?", x: 15, y: -25, delay: 0.2 },
  { text: "I don't know how to edit...", x: -10, y: 35, delay: 0.4 },
  { text: "My phone audio sounds terrible.", x: 25, y: 15, delay: 0.6 },
];

export default function TheProblem() {
  return (
    <section id="problem" className="min-h-screen relative flex items-center justify-center py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Visual / Floating Bubbles */}
        <div className="relative order-2 lg:order-1 h-[500px] lg:h-[600px] flex items-center justify-center">
          
          {/* Main Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 max-w-md mx-auto aspect-[3/4] bg-[var(--color-health-sage)]/30 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[var(--color-health-teal)]/20 rounded-2xl m-4">
              <p className="text-[var(--color-health-teal-dark)]/60 font-health-mono text-sm mb-4">Image Placeholder</p>
              <p className="text-[var(--color-health-teal-dark)]/40 text-xs italic">"Doctor looking at phone with overwhelmed expression, sticky notes and a clipboard on desk..."</p>
            </div>
          </motion.div>

          {/* Floating Bubbles */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ 
                  duration: 0.6, 
                  delay: point.delay,
                  type: "spring",
                  stiffness: 100
                }}
                className="absolute shadow-xl bg-white rounded-2xl p-4 border border-[var(--color-health-sage)]"
                style={{
                  top: `calc(50% + ${point.y}%)`,
                  left: `calc(50% + ${point.x}%)`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '200px'
                }}
              >
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: point.delay 
                  }}
                >
                  <p className="text-[var(--color-health-teal-dark)] text-sm font-medium leading-tight">
                    {point.text}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6"
          >
            The barrier to <br/><span className="text-[var(--color-health-coral)]">patient education.</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-lg text-[var(--color-health-teal-dark)]/70 font-light"
          >
            <p>
              Your physicians are brilliant, but they aren't video producers. Asking them to script, light, shoot, and edit their own content is a recipe for burnout and inconsistent branding.
            </p>
            <p>
              And hiring external agencies for every clinic update or FAQ video? It's too slow and far too expensive.
            </p>
            <div className="pt-6 border-t border-[var(--color-health-sage)]">
              <p className="font-medium text-[var(--color-health-teal)]">
                There has to be a better way to capture their expertise.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
