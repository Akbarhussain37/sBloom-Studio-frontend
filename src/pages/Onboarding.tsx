import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLink, FiMessageSquare, FiVideo, FiMail, FiUser, FiHeart, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  // Default to creator if accessed directly without state, just as a fallback
  const role = location.state?.role || 'creator'; 
  const isKid = role === 'kid';

  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Final submit, navigate to dashboard or main page
      navigate(isKid ? '/kids-zone' : '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-body flex flex-col relative py-20">
      {/* Top Navigation */}
      <div className="w-full px-6 md:px-12 py-6 flex justify-between items-center absolute top-0 left-0">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-brand-red font-bold text-sm tracking-wide hover:opacity-80 transition-opacity uppercase"
        >
          <FiArrowLeft className="text-lg" />
          Back to Home
        </Link>
        <Link to="/" className="font-heading font-bold text-xl tracking-wide text-slate-900">
          <span className="text-brand-red">s</span>Bloom Studio
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[540px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Profile Setup
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Let's set up your profile
            </h2>
            <p className="text-slate-500 text-sm px-4">
              Step {step} of 2 - Tell us a bit more about what you do.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && !isKid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-bold text-slate-800 mb-2">
                    Portfolio / Social Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLink className="text-slate-400 text-lg" />
                    </div>
                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-bold text-slate-800 mb-2">
                    Short Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMessageSquare className="text-slate-400 text-lg" />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                      placeholder="Tell us about your content..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && !isKid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label htmlFor="software" className="block text-sm font-bold text-slate-800 mb-2">
                    Primary Editing Software
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiVideo className="text-slate-400 text-lg" />
                    </div>
                    <select
                      id="software"
                      name="software"
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                    >
                      <option value="premiere">Adobe Premiere Pro</option>
                      <option value="resolve">DaVinci Resolve</option>
                      <option value="finalcut">Final Cut Pro</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && isKid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label htmlFor="parent-email" className="block text-sm font-bold text-slate-800 mb-2">
                    Parent's Email Address <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-slate-400 text-lg" />
                    </div>
                    <input
                      id="parent-email"
                      name="parent-email"
                      type="email"
                      required
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                      placeholder="parent@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="kid-age" className="block text-sm font-bold text-slate-800 mb-2">
                    Kid's Age <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-slate-400 text-lg" />
                    </div>
                    <input
                      id="kid-age"
                      name="kid-age"
                      type="number"
                      min="5"
                      max="16"
                      required
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && isKid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label htmlFor="interests" className="block text-sm font-bold text-slate-800 mb-2">
                    What are they interested in learning?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiHeart className="text-slate-400 text-lg" />
                    </div>
                    <select
                      id="interests"
                      name="interests"
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                    >
                      <option value="vlogging">Vlogging & YouTube</option>
                      <option value="gaming">Gaming Content</option>
                      <option value="animation">Basic Animation</option>
                      <option value="all">A little bit of everything</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-[1] py-4 px-4 border border-slate-200 rounded-xl shadow-sm text-base font-bold text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-[2] flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-red hover:bg-[#F02865] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
              >
                {step === 1 ? (
                  <>Continue <FiArrowRight className="text-lg" /></>
                ) : (
                  <>Complete Setup <FiCheckCircle className="text-lg" /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
