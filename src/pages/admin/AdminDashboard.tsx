import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { uploadDocument } from '../../lib/api';
import { FiArrowLeft, FiSearch, FiCheck, FiClock, FiPlayCircle, FiRefreshCw, FiAlertCircle, FiDownload, FiX, FiLogOut, FiMail, FiPhone, FiMapPin, FiFileText, FiImage, FiUploadCloud } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Types for the backend data
interface DocumentData {
  doc_id: string;
  file_name: string;
  file_id: string;
  url: string;
  status: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  instructions?: string;
  user_role?: string;
}

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingMedia, setViewingMedia] = useState<DocumentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const isImage = (filename?: string) => {
    if (!filename) return false;
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  // Redirect non-admins
  useEffect(() => {
    if (!loading && profile?.role !== 'admin') {
      // navigate('/dashboard'); // Temporarily disabled so you can test the UI!
    }
  }, [profile, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const fetchDocuments = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const result = await response.json();
      if (result.success) {
        // Filter out the jobs created by Admin uploads to prevent overlapping duplicates
        const validDocs = (result.data || []).filter((d: any) => d.user_name !== 'Admin Edit');
        setDocuments(validDocs);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the backend server.');
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdateStatus = async (docId: string, status: string) => {
    try {
      // 1. Update local backend
      const response = await fetch(`${API_BASE_URL}/documents/${docId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status on local backend');
      
      // 2. Sync with Supabase so User Dashboard sees it
      const doc = documents.find(d => d.doc_id === docId);
      if (doc) {
        const supabaseStatus = status === 'Completed' ? 'COMPLETED' : status === 'Review' ? 'READY_FOR_REVIEW' : status.toUpperCase();
        
        // Call the backend endpoint that uses the Service Role key to bypass RLS
        await fetch(`${API_BASE_URL}/sync-supabase-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: doc.file_name, status: supabaseStatus })
        });
      }

      setDocuments(prev => prev.map(d => d.doc_id === docId ? { ...d, status } : d));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleAdminUploadClick = (docId: string) => {
    setUploadingDocId(docId);
    fileInputRef.current?.click();
  };

  const handleAdminFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDocId) return;
    
    const doc = documents.find(d => d.doc_id === uploadingDocId);
    if (!doc) return;

    try {
      // 1. Upload the edited file to OneDrive via the backend
      const response = await uploadDocument(file, 'Admin Edit', doc.user_email);
      const newFileId = response.data?.file_id || response.file_id;
      
      if (!newFileId) {
        throw new Error('Failed to retrieve file ID from OneDrive upload.');
      }

      // 2. Use the backend service-role endpoint to update the user's media_assets_studio record.
      //    We CANNOT do this directly from the frontend because Supabase RLS blocks the
      //    admin from modifying another user's rows using the anon key — it silently updates 0 rows.
      const syncResponse = await fetch(`${API_BASE_URL}/admin-sync-edited-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: doc.doc_id,
          fileId: newFileId,
          fileType: file.type,
          fileName: doc.file_name,
          userEmail: doc.user_email,
        }),
      });

      const syncResult = await syncResponse.json();

      if (!syncResponse.ok) {
        // Non-fatal: log the error but don't block the admin — the OneDrive upload succeeded
        const errMsg = typeof syncResult.error === 'string' ? syncResult.error : JSON.stringify(syncResult.error);
        const detailMsg = syncResult.details || '';
        console.warn('Supabase sync warning:', errMsg, detailMsg);
        // Still update the local admin queue status
        await handleUpdateStatus(uploadingDocId, 'Review');
        alert(`Video uploaded to OneDrive!\n\nCould not sync to user's dashboard:\n${errMsg}\n${detailMsg}`);
      } else {
        // 3. Update admin queue status in local backend
        await handleUpdateStatus(uploadingDocId, 'Review');
        alert('Upload complete! The edited video is now visible under "Review Edits" on the user\'s dashboard.');
      }
    } catch (err: any) {
      console.error('Admin upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingDocId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete document');
      
      setDocuments(prev => prev.filter(doc => doc.doc_id !== docId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    }
  };

  // Fetch data on mount
  useEffect(() => {
    // Temporarily fetch for everyone for testing
    // if (profile?.role === 'admin') {
      fetchDocuments();
    // }
  }, [profile]);

  if (loading) return null;

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
             {profile?.full_name || 'Admin'}
           </div>
           <button 
             onClick={handleLogout}
             className="p-2 text-slate-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
             title="Log Out"
           >
             <FiLogOut className="text-lg" />
           </button>
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
          <div className="flex gap-3">
             <button 
               onClick={fetchDocuments}
               disabled={isLoadingData}
               className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none flex items-center gap-2 transition-all disabled:opacity-50"
             >
               <FiRefreshCw className={isLoadingData ? "animate-spin" : ""} /> Refresh
             </button>
             <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search jobs or users..." 
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
             </div>
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
                {isLoadingData ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                       <div className="flex flex-col items-center justify-center gap-2">
                         <FiRefreshCw className="animate-spin text-2xl text-slate-400" />
                         <span className="text-sm">Loading videos...</span>
                       </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                       <div className="flex flex-col items-center justify-center gap-2">
                         <FiAlertCircle className="text-2xl text-red-400" />
                         <span className="text-sm font-medium">{error}</span>
                         <span className="text-xs text-red-400 mt-1">Is the backend running on port 3000?</span>
                       </div>
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                       No video jobs found.
                    </td>
                  </tr>
                ) : documents.map((doc, index) => {
                  const date = doc.created_at ? new Date(doc.created_at).toLocaleString(undefined, { 
                    year: 'numeric', month: 'numeric', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  }) : 'Unknown Date';
                  const serialNumber = `JOB-${String(documents.length - index).padStart(3, '0')}`;
                  
                  // Create some placeholder data for missing fields
                  const user = doc.user_name || 'Unknown User';
                  const role = doc.user_role || 'creator';
                  
                  return (
                    <tr key={doc.doc_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-bold text-slate-900">{serialNumber}</div>
                        <div className="text-xs text-slate-500 mt-1" title={doc.doc_id}>{date}</div>
                        {doc.url && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <button 
                              onClick={() => setViewingMedia(doc)}
                              className={`flex items-center gap-1.5 text-xs font-semibold w-max px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                                isImage(doc.file_name) 
                                ? 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100'
                                : 'text-brand-red bg-red-50 border-red-100 hover:bg-red-100'
                              }`}
                            >
                              {isImage(doc.file_name) ? <><FiImage /> View Image</> : <><FiPlayCircle /> Play Video</>}
                            </button>
                            <a 
                              href={`${API_BASE_URL}/documents/${doc.file_id}/stream`} 
                              download={doc.file_name || 'video.mp4'}
                              className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold bg-slate-100 w-max px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-200 transition-colors"
                            >
                              <FiDownload /> Download
                            </a>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold bg-blue-50 w-max px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                              OneDrive
                            </a>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 align-top min-w-[200px]">
                        <div className="text-sm font-bold text-slate-900 mb-1">{user}</div>
                        <div className="mb-3 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider border bg-purple-50 text-purple-700 border-purple-100">
                          {role}
                        </div>
                        <div className="text-xs text-slate-500 flex flex-col gap-1.5">
                          {doc.user_email && <span className="flex items-center gap-1.5"><FiMail className="text-slate-400 flex-shrink-0" /> <span className="truncate max-w-[150px]">{doc.user_email}</span></span>}
                          {doc.user_phone && <span className="flex items-center gap-1.5"><FiPhone className="text-slate-400 flex-shrink-0" /> <span className="truncate">{doc.user_phone}</span></span>}
                          <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400 flex-shrink-0" /> Location Placeholder</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 align-top max-w-[280px]">
                        <div className="text-sm text-slate-900 font-bold mb-2 flex items-center gap-1.5 truncate">
                           <FiFileText className="text-slate-400 flex-shrink-0" /> {doc.file_name}
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[200px] max-w-[300px]">
                          <p className={`text-sm ${doc.instructions ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                            {doc.instructions || 'No instructions provided.'}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 align-top">
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border w-max
                          ${doc.status?.toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                            doc.status?.toLowerCase() === 'uploaded' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-slate-100 text-slate-700 border-slate-200'}`}
                        >
                          {doc.status?.toLowerCase() === 'completed' ? <FiCheck /> : <FiClock />}
                          <span className="capitalize">{doc.status || 'Unknown'}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center justify-end gap-2">
                            {doc.status !== 'Completed' && (
                              <button 
                                onClick={() => handleUpdateStatus(doc.doc_id, 'Completed')}
                                className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-green-200"
                                title="Mark as Done"
                              >
                                <FiCheck /> Done
                              </button>
                            )}
                            {doc.status !== 'Review' && doc.status !== 'Completed' && (
                              <button 
                                onClick={() => handleUpdateStatus(doc.doc_id, 'Review')}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-blue-200"
                                title="Request Review"
                              >
                                <FiPlayCircle /> Review
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(doc.doc_id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Delete Job"
                            >
                              <FiX />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAdminUploadClick(doc.doc_id)}
                            disabled={uploadingDocId === doc.doc_id}
                            className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            title="Upload Edited Video"
                          >
                            {uploadingDocId === doc.doc_id ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud />} 
                            {uploadingDocId === doc.doc_id ? 'Uploading...' : 'Upload Edit'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Hidden file input for Admin uploads */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*,image/*"
          onChange={handleAdminFileChange}
        />

      </main>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {viewingMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          >
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full relative border border-slate-800">
              <button 
                onClick={() => setViewingMedia(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
              <div className="aspect-video bg-black w-full flex items-center justify-center">
                {isImage(viewingMedia.file_name) ? (
                  <img 
                    src={`${API_BASE_URL}/documents/${viewingMedia.file_id}/stream`}
                    alt={viewingMedia.file_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video 
                    src={`${API_BASE_URL}/documents/${viewingMedia.file_id}/stream`}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
