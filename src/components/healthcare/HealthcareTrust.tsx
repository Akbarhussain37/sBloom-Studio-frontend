import Reveal from '../Reveal';
import { FiShield, FiLock, FiCheckCircle } from 'react-icons/fi';

export default function HealthcareTrust() {
  const pillars = [
    {
      icon: <FiShield className="text-3xl text-blue-400" />,
      title: "HIPAA Compliant Workflows",
      desc: "Strict media handling protocols ensure patient privacy is never compromised during production."
    },
    {
      icon: <FiLock className="text-3xl text-indigo-400" />,
      title: "Governance Friendly",
      desc: "We focus on production quality; we never alter clinical substance without explicit review."
    },
    {
      icon: <FiCheckCircle className="text-3xl text-cyan-400" />,
      title: "Institutional Scale",
      desc: "Designed to manage large-scale reputation and marketing for extensive hospital networks."
    }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#050A15] relative overflow-hidden" id="trust">
      
      {/* Dark Mode Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">


            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white leading-[1.05] mb-6 tracking-tight">
              Institutional trust <br className="hidden md:block" /> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">security.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
              Hospitals require a higher standard of operational security. Our platform is built to integrate securely with your existing communications governance.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          
          {/* Subtle connecting line behind cards (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 z-0" />

          {pillars.map((signal, idx) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="relative z-10 bg-[#0B1120]/60 backdrop-blur-2xl p-10 md:p-12 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(37,99,235,0.08)] h-full flex flex-col group overflow-hidden">
                
                {/* Top glow effect on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full" />

                <div className="w-20 h-20 rounded-3xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-900/40 transition-all duration-500">
                  {signal.icon}
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-white font-heading mb-4 leading-tight group-hover:text-blue-300 transition-colors duration-300">
                  {signal.title}
                </h3>
                
                <p className="text-slate-400 font-light text-lg leading-relaxed">
                  {signal.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
