import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';

export default function Register() {
  const [role, setRole] = useState<'creator' | 'kid'>('creator');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding', { state: { role } });
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[700px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Studio Onboarding
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Create Studio Account
            </h2>
            <p className="text-slate-500 text-sm px-4">
              Register your profile for priority bookings and creative resources.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            
            {/* Role Selection Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#F7F9FC] p-1 rounded-xl flex w-full max-w-sm border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    role === 'creator'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Creator
                </button>
                <button
                  type="button"
                  onClick={() => setRole('kid')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    role === 'kid'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Parent / Kid
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-800 mb-2">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-slate-400 text-lg" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-2">
                  Email Address <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-slate-400 text-lg" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-2">
                  Password <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-slate-400 text-lg" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-800 mb-2">
                  Confirm Password <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-slate-400 text-lg" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="agree" className="ml-2 block text-sm text-slate-500 cursor-pointer">
                  I agree to Terms & Policies
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="font-semibold text-brand-red hover:text-[#DE1B54]"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-red hover:bg-[#F02865] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
              >
                Create Studio Account <FiUserPlus className="text-lg" />
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-red hover:text-[#DE1B54]">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
