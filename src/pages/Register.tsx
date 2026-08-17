import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiMail, FiLock, FiUser, FiUserPlus, 
  FiPhone, FiMapPin, FiInstagram, 
  FiActivity, FiSmile, FiHeart
} from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [role, setRole] = useState<'creator' | 'kid' | 'doctor'>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Creator fields
  const [phone, setPhone] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [category, setCategory] = useState('lifestyle');
  
  // Kid fields
  const [parentPhone, setParentPhone] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [kidGender, setKidGender] = useState('');
  const [interest, setInterest] = useState('vlogging');

  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // If already logged in, redirect them
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (signUpError) throw signUpError;
      
      if (data.user) {
        // Prepare profile payload
        const payload: any = {
          id: data.user.id,
          email: email,
          full_name: name,
          role: role,
          onboarding_completed: true,
        };

        if (role === 'kid') {
          payload.parent_phone = parentPhone;
          payload.location = userLocation;
          payload.kid_age = kidAge ? parseInt(kidAge, 10) : null;
          payload.kid_gender = kidGender;
          payload.interest = interest;
        } else {
          payload.phone_number = phone;
          payload.location = userLocation;
          payload.age = age ? parseInt(age, 10) : null;
          payload.gender = gender;
          payload.portfolio_url = portfolio;
          payload.primary_content_category = category;
        }

        const { error: profileError } = await supabase
          .from('profile_studio')
          // @ts-ignore
          .insert([payload as any]);
          
        if (profileError) {
          console.error("Profile creation notice:", profileError);
          // Let's attempt an update just in case the trigger already inserted the row
          const { error: updateError } = await supabase
            .from('profile_studio')
            // @ts-ignore
            .update(payload as any)
            .eq('id', data.user.id);
            
          if (updateError) {
             console.error("Profile update fallback failed:", updateError);
          }
        }
      }

      // Go straight to their dashboard!
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      
    } catch (err: any) {
      console.error('Registration error:', err.message);
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
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

          {error && <ErrorAlert message={error} />}

          <form className="space-y-6" onSubmit={handleRegister}>
            
            {/* Role Selection Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#F7F9FC] p-1 rounded-xl flex w-full max-w-lg border border-slate-200">
                <button
                  type="button"
                  disabled={loading}
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
                  disabled={loading}
                  onClick={() => setRole('doctor')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    role === 'doctor'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  disabled={loading}
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

            {/* Basic Info Section */}
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Account Details</h3>
            
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info Section (Creator / Doctor) */}
            {(role === 'creator' || role === 'doctor') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Profile Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-800 mb-2">
                      Phone Number <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiPhone className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-bold text-slate-800 mb-2">
                      Location (City, Country)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMapPin className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="e.g. Los Angeles, USA"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-bold text-slate-800 mb-2">
                      Age <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="18"
                        max="100"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="e.g. 24"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-bold text-slate-800 mb-2">
                      Gender <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSmile className="text-slate-400 text-lg" />
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-bold text-slate-800 mb-2">
                      Instagram / Social Handle
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiInstagram className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="portfolio"
                        name="portfolio"
                        type="text"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="@yourhandle"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-bold text-slate-800 mb-2">
                      Primary Content Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiActivity className="text-slate-400 text-lg" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                      >
                        <option value="lifestyle">Lifestyle & Vlog</option>
                        <option value="tech">Tech & Review</option>
                        <option value="beauty">Beauty & Fashion</option>
                        <option value="gaming">Gaming</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment & Comedy</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Info Section (Kid / Parent) */}
            {role === 'kid' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Parent & Child Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="parent-phone" className="block text-sm font-bold text-slate-800 mb-2">
                      Parent's Phone <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiPhone className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="parent-phone"
                        name="parent-phone"
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-bold text-slate-800 mb-2">
                      Location (City, Country)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMapPin className="text-slate-400 text-lg" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="e.g. Los Angeles, USA"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={kidAge}
                        onChange={(e) => setKidAge(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="kid-gender" className="block text-sm font-bold text-slate-800 mb-2">
                      Kid's Gender <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSmile className="text-slate-400 text-lg" />
                      </div>
                      <select
                        id="kid-gender"
                        name="kid-gender"
                        value={kidGender}
                        onChange={(e) => setKidGender(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
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
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        disabled={loading}
                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-[#F7F9FC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red sm:text-sm"
                      >
                        <option value="vlogging">Vlogging & YouTube</option>
                        <option value="gaming">Gaming Content</option>
                        <option value="animation">Basic Animation</option>
                        <option value="all">A little bit of everything</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Options */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  required
                  disabled={loading}
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
                  disabled={loading}
                  className="font-semibold text-brand-red hover:text-[#DE1B54]"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-red hover:bg-[#F02865] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner className="text-white w-6 h-6 border-white" />
                ) : (
                  <>Create Studio Account <FiUserPlus className="text-lg" /></>
                )}
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
