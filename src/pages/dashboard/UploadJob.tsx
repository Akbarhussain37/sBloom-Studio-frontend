import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function UploadJob() {
  const { profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Mock quota - in reality this would be from the profile DB (free_edits_remaining)
  const freeTriesRemaining = profile?.free_edits_remaining ?? 2;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !instructions.trim() || freeTriesRemaining <= 0) return;
    
    // Static mockup behavior
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Job Submitted Successfully!</h2>
          <p className="text-slate-600 mb-8">
            Our team has received your raw footage and instructions. We'll start editing it right away.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setFile(null);
                setInstructions('');
              }}
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Submit Another
            </button>
            <Link 
              to="/dashboard"
              className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight mb-2">
          Request Edit Job
        </h1>
        <p className="text-slate-500">
          Upload your raw footage and tell us exactly how you want it edited.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
      >
        {/* Quota Banner */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiInfo className="text-brand-red" />
            <span className="text-sm font-semibold text-slate-700">Free Trial Quota</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-20"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
            </span>
            <span className="text-sm font-bold text-slate-900">
              {freeTriesRemaining} Free Tries Remaining
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Upload Zone */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              Raw Footage <span className="text-brand-red">*</span>
            </label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                isDragging 
                  ? 'border-brand-red bg-red-50/50' 
                  : file ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-green-100 flex items-center justify-center mb-4 text-green-500">
                    <FiCheckCircle className="text-2xl" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="mt-4 text-xs font-bold text-brand-red hover:underline"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <FiUploadCloud className="text-2xl" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Drag and drop your video here</p>
                  <p className="text-xs text-slate-500 mb-4">Supports MP4, MOV up to 500MB</p>
                  <label className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl cursor-pointer hover:bg-slate-50 shadow-sm transition-all">
                    Browse Files
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm font-bold text-slate-800 mb-3">
              Editing Instructions <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <FiFileText className="text-slate-400 text-lg" />
              </div>
              <textarea
                id="instructions"
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Add bold captions, cut out the pauses, and put a trendy background track..."
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl bg-[#F7F9FC] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red text-sm transition-all resize-none min-h-[150px]"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">
              Be as specific as possible so our editors know exactly what you want.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={!file || !instructions.trim() || freeTriesRemaining <= 0}
              className="px-8 py-3.5 bg-brand-red text-white font-bold rounded-xl hover:bg-[#F02865] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Submit Job <FiCheckCircle />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
