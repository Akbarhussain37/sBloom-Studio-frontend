import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Strategy & Scripting",
    desc: "We co-create compliance-approved scripts tailored to your specific patient demographics and service lines."
  },
  {
    num: "02",
    title: "The Studio Kit",
    desc: "We deploy our standardized, easy-to-use recording kit directly to your clinic. No crew required."
  },
  {
    num: "03",
    title: "Hit Record",
    desc: "Your physicians simply read the teleprompter. We capture high-quality video and audio automatically."
  },
  {
    num: "04",
    title: "Post-Production",
    desc: "Our team handles all editing, color grading, captioning, and branding within 48 hours."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="min-h-screen relative py-20 px-6 lg:px-12 bg-[var(--color-health-paper)]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-health-display text-[var(--color-health-teal-dark)] mb-6">
            A frictionless <span className="text-[var(--color-health-coral)]">pipeline.</span>
          </h2>
          <p className="text-lg text-[var(--color-health-teal-dark)]/70 font-light max-w-2xl mx-auto">
            From concept to final export, we handle the heavy lifting so your medical staff can focus on what they do best: care.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Pipeline Steps */}
          <div className="relative space-y-12 pl-4 lg:pl-12">
            {/* Animated Connector Line */}
            <div className="absolute left-[2.5rem] lg:left-[4.5rem] top-8 bottom-8 w-px bg-[var(--color-health-sage)] z-0" />
            <motion.div 
              className="absolute left-[2.5rem] lg:left-[4.5rem] top-8 w-px bg-[var(--color-health-coral)] z-10"
              initial={{ height: 0 }}
              whileInView={{ height: 'calc(100% - 4rem)' }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="relative z-20 flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-health-paper)] border-2 border-[var(--color-health-teal)] rounded-full flex items-center justify-center font-health-mono text-[var(--color-health-teal-dark)] font-bold shadow-[0_0_0_4px_var(--color-health-paper)]">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-health-display text-[var(--color-health-teal-dark)] mb-2">{step.title}</h3>
                  <p className="text-[var(--color-health-teal-dark)]/70 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual Placeholder for Step 3 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[600px] w-full max-w-md mx-auto bg-gradient-to-tr from-[var(--color-health-teal-dark)] to-[var(--color-health-teal)] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/20 rounded-2xl m-4">
              <p className="text-white/60 font-health-mono text-sm mb-4">Process step 3 (record)</p>
              <p className="text-white/40 text-xs italic">"Smartphone on a small tripod facing a doctor in a clinic office, ring light visible..."</p>
            </div>
            
            {/* Simple animation overlay to represent recording */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10">
               <motion.div 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <span className="text-[10px] text-white font-health-mono tracking-wider">RECORDING</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
