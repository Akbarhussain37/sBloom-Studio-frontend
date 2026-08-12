import { useState } from 'react';
import Reveal from './Reveal';
import { createBooking } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

export default function Marketing() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setLoading(true);

    try {
      await createBooking({
        full_name: name,
        email,
        project_type: projectType,
        source: 'creators_page',
        user_id: user?.id || null,
      });

      setStatus('Thanks! Your reservation request has been received. We will contact you soon.');
      setName('');
      setEmail('');
      setProjectType('');
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error('Booking submission error:', err.message);
      setError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[900px] py-32 flex flex-col justify-center overflow-hidden" id="marketing">
      {/* Full-Bleed Cinematic Background - Clear and Visible */}
      <div className="absolute inset-0 z-0 bg-black">
        <img 
          src="assets/images/hero.png" 
          alt="Studio BTS" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Simple, subtle dark gradient just to ensure text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10 pointer-events-none" />
      </div>
      
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 md:px-12 w-full flex flex-col items-center">
        
        {/* Center-Aligned Movie Poster Typography */}
        <Reveal>
          <div className="w-full text-center mb-16 flex flex-col items-center">

            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-extrabold text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
              The "Insta Effect" <br/>BTS Campaign
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Experience the journey. Watch our behind-the-scenes structural build-out and see how we engineered Vizag's most premium production studio.
            </p>
          </div>
        </Reveal>
        
        {/* Floating Glassmorphic Form */}
        <Reveal delay={150}>
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              
              {/* Subtle glow effect behind form */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/10 blur-[60px] pointer-events-none rounded-full"></div>
              
              <div className="relative z-10 text-center mb-10">
                <h3 className="text-sm font-bold text-brand-red uppercase tracking-[0.2em] mb-4">Early-Bird Access</h3>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Reserve Your Spot</h2>
              </div>
              
              <form className="relative z-10 flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
                
                <div className="flex flex-col gap-2 group/input text-left">
                  <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within/input:text-brand-red transition-colors">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your name" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-lg px-5 py-4 placeholder-white/30 focus:outline-none focus:border-brand-red focus:bg-black/40 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2 group/input text-left">
                  <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within/input:text-brand-red transition-colors">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your email" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-lg px-5 py-4 placeholder-white/30 focus:outline-none focus:border-brand-red focus:bg-black/40 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2 group/input text-left">
                  <label htmlFor="projectType" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within/input:text-brand-red transition-colors">Project Type</label>
                  <div className="relative">
                    <select 
                      id="projectType" 
                      required 
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      disabled={loading}
                      className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-lg px-5 py-4 focus:outline-none focus:border-brand-red focus:bg-black/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-navy text-gray-400">Select an option...</option>
                      <option value="editing" className="bg-navy">Video Editing (Level 1)</option>
                      <option value="podcast" className="bg-navy">Podcast Recording (Level 2)</option>
                      <option value="production" className="bg-navy">Full Production (Level 3)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-focus-within/input:text-brand-red transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex justify-center items-center bg-brand-red hover:bg-[#c9184c] text-white font-bold py-5 px-10 rounded-xl uppercase tracking-[0.15em] text-xs transition-all duration-300 shadow-[0_0_20px_rgba(222,27,84,0.3)] hover:shadow-[0_0_30px_rgba(222,27,84,0.5)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <LoadingSpinner className="w-5 h-5 border-white" />
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  
                  {status && (
                    <p className="text-green-400 text-sm mt-4 font-medium tracking-wide animate-pulse">{status}</p>
                  )}
                  {error && (
                    <p className="text-brand-red text-sm mt-4 font-medium tracking-wide animate-pulse">{error}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Reveal>
        
      </div>
    </section>
  );
}
