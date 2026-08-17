import Reveal from '../Reveal';
import { FiClock, FiShield, FiUsers, FiVideo } from 'react-icons/fi';

export default function HealthcareProblem() {
  const problems = [
    {
      title: "Agency Bottlenecks",
      desc: "Traditional video agencies take 6-8 weeks per asset, paralyzing your hospital's marketing velocity.",
      icon: FiClock,
      color: "text-amber-500",
      accent: "bg-gradient-to-r from-amber-400 to-orange-500"
    },
    {
      title: "Physician Frustration",
      desc: "Disorganized, multi-day shoots take doctors away from patients, leading to severe burnout and low participation.",
      icon: FiUsers,
      color: "text-rose-500",
      accent: "bg-gradient-to-r from-rose-400 to-red-500"
    },
    {
      title: "Compliance Nightmares",
      desc: "Fragmented editing across departments leads to severe HIPAA and institutional branding risks.",
      icon: FiShield,
      color: "text-blue-600",
      accent: "bg-gradient-to-r from-blue-500 to-indigo-500"
    },
    {
      title: "Content Silos",
      desc: "Thousands of hours of medical footage sitting unused on hard drives instead of engaging patients.",
      icon: FiVideo,
      color: "text-emerald-500",
      accent: "bg-gradient-to-r from-emerald-400 to-teal-500"
    }
  ];

  return (
    <section className="py-24 lg:py-32 px-6 md:px-12 bg-white" id="problem">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Header Section */}
        <Reveal>
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">The Industry Problem</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-navy-dark leading-[1.1] mb-6 tracking-tight">
              Hospital marketing is paralyzed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">fragmented production.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
              Without a centralized post-production infrastructure, healthcare networks bleed massive budgets on slow agencies, while vital clinical staff grow increasingly frustrated.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Grid: The 4 Pain Points (Premium SaaS Cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {problems.map((problem, idx) => {
              const Icon = problem.icon;
              return (
                <Reveal key={idx} delay={idx * 100} className="h-full">
                  <div className="relative h-full p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-100 transition-all duration-500 flex flex-col group overflow-hidden">
                    
                    {/* Massive Background Number */}
                    <div className="absolute -bottom-6 -right-2 text-[7rem] font-black text-slate-50 group-hover:text-slate-100/50 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                      0{idx + 1}
                    </div>

                    {/* Top Accent Gradient Line */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${problem.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-6">
                        <Icon className={`text-4xl ${problem.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`} strokeWidth={1.5} />
                      </div>
                      <h4 className="text-navy-dark font-bold text-xl mb-3 tracking-tight">{problem.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed flex-grow">{problem.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Right Visual: Massive edge-to-edge image card */}
          <div className="lg:col-span-6 h-full min-h-[400px] lg:min-h-full">
            <Reveal delay={300} className="h-full">
              <div className="relative h-full rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.1)] border border-slate-100 group">
                
                {/* Image */}
                <img 
                  src="/assets/images/disorganized_medical_media.jpg" 
                  alt="Disorganized medical folders and media files"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                
                {/* Overlay Text/Badge on the image to ground it */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl">
                    <h4 className="text-navy-dark font-bold text-lg mb-1">The Reality of Hospital Media</h4>
                    <p className="text-slate-600 text-sm font-medium">Petabytes of valuable clinical knowledge, lost in disorganized departmental silos.</p>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
          
        </div>
      </div>
    </section>
  );
}
