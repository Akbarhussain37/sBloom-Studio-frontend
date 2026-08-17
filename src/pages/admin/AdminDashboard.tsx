import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiArrowLeft, FiSearch, FiVideo, FiMoreVertical, FiCheck, FiClock, FiPlayCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MOCK_JOBS = [
  { id: 'JOB-001', user: 'Dr. Sarah Jenkins', role: 'doctor', status: 'pending', instructions: 'Please edit this 60s health tip. Cut out the umms and add bold text for key medical terms.', date: 'Oct 24, 2026' },
  { id: 'JOB-002', user: 'Alex Vlogs', role: 'creator', status: 'in-progress', instructions: 'Fast-paced cuts, trendy background music, and sound effects for my new tech review.', date: 'Oct 23, 2026' },
  { id: 'JOB-003', user: 'Timmy & Mom', role: 'kid', status: 'completed', instructions: 'Toy unboxing. Needs fun animations and star effects when the toy is revealed!', date: 'Oct 22, 2026' },
];

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admins
  useEffect(() => {
    if (!loading && profile?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profile, loading, navigate]);

  if (loading || profile?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-body flex flex-col">
      
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
            <FiArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
                <span className="text-white text-lg font-bold font-heading">A</span>
             </div>
             <h1 className="text-xl font-bold font-heading text-slate-900">Admin Console</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
             {profile.full_name}
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
              Video Edit Queue
            </h2>
            <p className="text-slate-500 text-sm mt-1">Review and process requested edits from users.</p>
          </div>
          <div className="relative">
             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search jobs or users..." 
               className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
             />
          </div>
        </div>

        {/* Data Table */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Job ID / Date</th>
                  <th className="px-6 py-4">User & Role</th>
                  <th className="px-6 py-4">Instructions</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_JOBS.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-slate-900">{job.id}</div>
                      <div className="text-xs text-slate-500 mt-1">{job.date}</div>
                      <div className="mt-3 flex items-center gap-1.5 text-brand-red text-xs font-semibold bg-red-50 w-max px-2 py-1 rounded-md border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                        <FiPlayCircle /> View Source
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-slate-900">{job.user}</div>
                      <div className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-md inline-block capitalize border
                        ${job.role === 'doctor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          job.role === 'creator' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                          'bg-orange-50 text-orange-700 border-orange-100'}`}
                      >
                        {job.role}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 align-top max-w-xs">
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {job.instructions}
                      </p>
                    </td>
                    
                    <td className="px-6 py-4 align-top">
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border w-max
                        ${job.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                          job.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-slate-100 text-slate-700 border-slate-200'}`}
                      >
                        {job.status === 'completed' ? <FiCheck /> : job.status === 'in-progress' ? <FiVideo className="animate-pulse" /> : <FiClock />}
                        <span className="capitalize">{job.status.replace('-', ' ')}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 align-top text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <FiMoreVertical />
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
