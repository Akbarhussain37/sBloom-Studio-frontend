import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-body flex flex-col relative">
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
      <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[540px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Studio Portal
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Sign In to Account
            </h2>
            <p className="text-slate-500 text-sm px-4">
              Access studio bookings, equipment rental, and creator tools.
            </p>
          </div>

          <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-2">
                Registered Mail <span className="text-brand-red">*</span>
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
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="font-semibold text-brand-red hover:text-[#DE1B54]"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-red hover:bg-[#F02865] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
              >
                Sign In to Studio Desk <FiArrowRight className="text-lg" />
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-red hover:text-[#DE1B54]">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
