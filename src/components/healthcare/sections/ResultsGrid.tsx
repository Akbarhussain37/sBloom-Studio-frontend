import { motion } from 'framer-motion';

const topics = [
  "Blood Pressure Basics",
  "Managing Daily Stress",
  "Tour Our New Clinic",
  "Dr. Jenkins Q&A",
  "Heart Health Diet",
  "Pediatric Checkups",
  "Understanding Vaccines",
  "Post-Op Recovery Tips"
];

export default function ResultsGrid() {
  return (
    <section id="results" className="min-h-screen relative py-20 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6">
            Content that <span className="text-[var(--color-health-coral)]">performs.</span>
          </h2>
          <p className="text-lg text-[var(--color-health-teal-dark)]/70 font-light max-w-2xl mx-auto">
            A consistent library of high-quality, patient-first educational videos optimized for social and web.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {topics.map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative aspect-[9/16] bg-[var(--color-health-sage)] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-health-teal-dark)]/90 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-80" />
              
              <div className="absolute inset-0 flex items-center justify-center p-4 z-0">
                 <p className="text-[var(--color-health-teal-dark)]/30 text-[10px] italic text-center leading-tight">
                   "Vertical social video thumbnail, {topic}, doctor mid-talk..."
                 </p>
              </div>

              {/* Bold Caption Overlay */}
              <div className="absolute bottom-6 left-4 right-4 z-20">
                <p className="font-health-display text-white text-xl md:text-2xl leading-tight mb-2">
                  {topic.split(' ').map((word, idx) => (
                    idx === 1 ? <span key={idx} className="text-[var(--color-health-coral)]">{word} </span> : <span key={idx}>{word} </span>
                  ))}
                </p>
                
                {/* Play Button Icon */}
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-[var(--color-health-coral)] group-hover:border-[var(--color-health-coral)] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
