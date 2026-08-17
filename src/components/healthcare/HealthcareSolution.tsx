import Reveal from '../Reveal';
import { FiLayers, FiCheckCircle, FiEdit3 } from 'react-icons/fi';

export default function HealthcareSolution() {
  const features = [
    {
      title: "Enterprise Template Library",
      desc: "Standardized video formats designed specifically for hospital departments and clinic networks. No guesswork required.",
      icon: FiLayers
    },
    {
      title: "Guided Recording Protocols",
      desc: "Physicians follow structured frameworks, ensuring every video is on-message and on-brand, capturing only what is needed.",
      icon: FiCheckCircle
    },
    {
      title: "Centralized Post-Production",
      desc: "Our editing team handles the compliance, branding, and formatting, so your medical staff doesn't have to waste time.",
      icon: FiEdit3
    }
  ];

  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 bg-[#0A0F1C] relative overflow-hidden" id="solution">
      {/* Dark mode glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#0A0F1C] to-transparent pointer-events-none z-20" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Editorial Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="text-blue-400 font-bold text-sm tracking-[0.2em] uppercase">The Platform</span>
              <div className="h-[1px] w-12 bg-blue-400/30" />
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-8 tracking-tight leading-[1.1]">
              Centralized Video <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Operations.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
              We provide the template-driven infrastructure that allows hospitals to centralize their video output. Your medical staff provides the expertise; our platform ensures compliance and scale.
            </p>
          </Reveal>
        </div>

        {/* Massive Hero Image */}
        <Reveal delay={200}>
          <div className="relative w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] border border-white/10 mb-24 lg:mb-32 group bg-white/5">
            <div className="absolute inset-0 bg-[#0A0F1C]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
            <img 
              src="/assets/images/premium_medical_video_ops.jpg" 
              alt="Premium Healthcare Video Dashboard UI"
              className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
            />
          </div>
        </Reveal>

        {/* 3 Column Feature Grid (Dark Mode Editorial) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Reveal key={idx} delay={idx * 150}>
                <div className="flex flex-col group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                    <Icon className="text-slate-400 group-hover:text-white text-3xl transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-heading group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-light text-lg">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
