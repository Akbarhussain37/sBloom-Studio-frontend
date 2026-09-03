import { motion } from 'framer-motion';

const youTasks = [
  "Approve topics",
  "Provide the expert (1 hr/mo)",
  "Review final cut",
];

const sbloomTasks = [
  "Scriptwriting & Prompter loading",
  "Lighting & Audio setup",
  "Professional A/B camera recording",
  "Color grading & Sound mixing",
  "Captioning & Branding overlays",
  "Final file delivery (multiple formats)"
];

export default function OwnershipSplit() {
  return (
    <section id="ownership" className="min-h-screen relative flex items-center justify-center py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6">
            A true <span className="text-[var(--color-health-coral)]">partnership.</span>
          </h2>
          <p className="text-lg text-[var(--color-health-teal-dark)]/70 font-light max-w-2xl mx-auto">
            We don't just hand you a camera. We take on the entire production workload so your team doesn't have to.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* You Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="group relative bg-[var(--color-health-paper)] rounded-3xl p-8 lg:p-12 border border-[var(--color-health-sage)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            <h3 className="text-3xl font-health-display text-[var(--color-health-teal-dark)] mb-8 pb-6 border-b border-[var(--color-health-sage)]">
              Your Team
            </h3>
            <ul className="space-y-6">
              {youTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white border border-[var(--color-health-teal)] flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-health-teal)]" />
                  </div>
                  <span className="text-lg text-[var(--color-health-teal-dark)]/80">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* sBLOOM Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.4 }}
            className="group relative bg-[var(--color-health-teal-dark)] rounded-3xl p-8 lg:p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-health-teal)]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            <h3 className="text-3xl font-health-display text-white mb-8 pb-6 border-b border-white/20">
              sBloom Studio
            </h3>
            <ul className="space-y-6">
              {sbloomTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[var(--color-health-coral)] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-lg text-white/90">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
