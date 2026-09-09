import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { uploadDocument } from '../../lib/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const { profile, user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ file: File; progress: number; status: 'idle' | 'uploading' | 'success' | 'error'; error?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, WEBP, MP4, WEBM, MOV are supported.';
    }
    if (file.size > maxSize) {
      return 'File is too large. Maximum size is 5GB.';
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const newFilesArray = Array.from(newFiles).map(file => {
      const error = validateFile(file);
      return {
        file,
        progress: 0,
        status: error ? ('error' as const) : ('idle' as const),
        error: error || undefined,
      };
    });

    setFiles(prev => [...prev, ...newFilesArray]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startUploads = async () => {
    let allSuccess = true;
    const filesToUpload = files.map((f, i) => ({ ...f, index: i })).filter(f => f.status === 'idle' || f.status === 'error');

    for (const f of filesToUpload) {
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[f.index].status = 'uploading';
        newFiles[f.index].progress = 10; // Fake initial progress since Supabase js doesn't support progress well yet
        return newFiles;
      });

      try {
        await uploadDocument(
          f.file, 
          profile?.full_name || 'Unknown User',
          user?.email || profile?.email || '',
          user?.phone || '',
          '',
          profile?.role
        );
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[f.index].status = 'success';
          newFiles[f.index].progress = 100;
          return newFiles;
        });
      } catch (error: any) {
        allSuccess = false;
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[f.index].status = 'error';
          newFiles[f.index].error = error.message || 'Upload failed';
          return newFiles;
        });
      }
    }

    if (allSuccess && filesToUpload.length > 0 && onUploadComplete) {
      setTimeout(() => {
        onUploadComplete();
        onClose();
        setFiles([]);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold font-heading text-slate-900">Upload Content</h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                {/* Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isDragging ? 'bg-brand-primary text-white' : 'bg-white text-slate-400 shadow-sm'
                  }`}>
                    <FiUploadCloud className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Click or drag files here</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Support for MP4, MOV, WEBM, JPG, PNG up to 5GB per file.
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Selected Files</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          file.status === 'error' ? 'bg-red-100 text-red-500' :
                          file.status === 'success' ? 'bg-green-100 text-green-500' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {file.status === 'success' ? <FiCheckCircle /> :
                           file.status === 'error' ? <FiAlertCircle /> : <FiFile />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-semibold text-slate-900 truncate pr-4">{file.file.name}</p>
                            {file.status !== 'uploading' && file.status !== 'success' && (
                              <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <FiX />
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">{(file.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            {file.status === 'error' && <span className="text-xs text-red-500 truncate">{file.error}</span>}
                            {file.status === 'success' && <span className="text-xs text-green-500">Uploaded</span>}
                            {file.status === 'uploading' && <span className="text-xs text-brand-primary">Uploading...</span>}
                          </div>

                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                              <motion.div 
                                className="bg-brand-primary h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-[2rem]">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startUploads}
                  disabled={files.length === 0 || files.every(f => f.status === 'success' || f.status === 'uploading')}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#F02865] rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {files.some(f => f.status === 'uploading') ? (
                    <><LoadingSpinner className="w-4 h-4 text-white border-white" /> Uploading...</>
                  ) : (
                    'Upload Files'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
