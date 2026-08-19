import Reveal from '../Reveal';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function HealthcareCTA() {
  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white to-slate-100 relative border-t border-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-navy-dark mb-6 tracking-tight">
            Ready to modernize your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#3b82f6]">hospital's content operations?</span>
          </h2>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Join forward-thinking healthcare networks that are empowering their physicians and standardizing their patient education at scale.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/contact" 
              className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-[#2563eb] text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg">Book a Strategy Call</span>
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
