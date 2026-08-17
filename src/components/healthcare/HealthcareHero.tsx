import { useEffect } from 'react';
import Reveal from '../Reveal';
import { FiArrowRight, FiPlay, FiShield, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function HealthcareHero() {
  return (
    <section className="relative min-h-[100vh] flex items-center bg-white overflow-hidden pt-24 pb-16">
      {/* Abstract Glowing Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-100 blur-[150px] pointer-events-none" />
      
      {/* Refined Grid Pattern for texture */}
      <div 
        className="absolute inset-0 z-0 opacity-40" 
        style={{ 
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)'
        }} 
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 max-w-2xl pt-10">
          <Reveal>

            
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-black text-navy-dark leading-[1.05] tracking-tight mb-8">
              Standardize your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#3b82f6]">
                hospital's video.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 font-body font-light leading-relaxed mb-10 max-w-xl">
              Empower physicians to create compliant, brand-consistent patient education at scale—without relying on slow, expensive external agencies.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-12">
              <Link 
                to="/contact" 
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-navy-dark text-white text-lg font-bold rounded-xl overflow-hidden transition-all hover:scale-105 shadow-lg shadow-navy-dark/20"
              >
                Book a Demo 
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              <a 
                href="#workflow" 
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-navy-dark text-lg font-bold rounded-xl transition-all border border-slate-200 hover:border-blue-600/30 hover:bg-white shadow-sm"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FiPlay className="ml-0.5" />
                </span>
                See Workflow
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><FiShield className="text-blue-600 text-lg" /> HIPAA Compliant</span>
              <span className="flex items-center gap-2"><FiTrendingUp className="text-blue-600 text-lg" /> Scale Production 10x</span>
            </div>
          </Reveal>
        </div>

        {/* Right Visual - Premium Glass Mockup */}
        <div className="flex-1 w-full relative lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
          <Reveal delay={0.2} className="w-full h-full relative">
            {/* Ambient glow behind image */}
            <div className="absolute inset-0 bg-blue-100/50 blur-[100px] rounded-full scale-75" />
            
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[550px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
              <img 
                src="/assets/images/healthcare_doctor_recording.png" 
                alt="Doctor recording video" 
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              
              {/* Floating UI Element */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl z-20 flex items-center justify-between transform translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                    <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-navy-dark font-bold text-base mb-0.5">Recording Active</h4>
                    <p className="text-slate-500 text-xs font-medium">Brand guidelines applied</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider">
                  Compliant
                </div>
              </div>
            </div>
            
            {/* Decorative secondary floating card */}
            <div className="absolute -top-6 -right-6 p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl hidden md:flex items-center gap-3 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500 z-30">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <FiTrendingUp />
              </div>
              <div>
                <p className="text-navy-dark font-bold text-sm">Engagement</p>
                <p className="text-blue-600 text-xs font-bold">+340%</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      
      {/* Bottom fade out to blend with next section (slate-50) */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-50 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
