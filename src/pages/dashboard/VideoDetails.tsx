import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiTrash2, FiPlay, FiSend } from 'react-icons/fi';
import { getMediaAssetById, getSecureMediaUrl, submitForProduction, deleteMediaAsset } from '../../lib/creatorService';
import ProductionStatusBadge from '../../components/dashboard/ProductionStatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

export default function VideoDetails() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAsset() {
      if (!videoId) return;
      try {
        const data = await getMediaAssetById(videoId);
        setAsset(data);
        
        if (data.file_type.startsWith('video/') || data.file_type.startsWith('image/')) {
           const signedUrl = await getSecureMediaUrl(data.storage_path);
           setUrl(signedUrl);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAsset();
  }, [videoId]);

  const handleSubmit = async () => {
    if (!asset) return;
    if (confirm('Ready to submit? Once submitted, the sBloom Studio production team can begin working on your content.')) {
      setSubmitting(true);
      try {
        await submitForProduction(asset.id);
        setAsset({ ...asset, status: 'SUBMITTED' });
        alert('Submitted successfully!');
      } catch (error) {
        console.error('Submit error:', error);
        alert('Failed to submit');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!asset) return;
    if (confirm(`Are you sure you want to delete ${asset.file_name}?`)) {
      try {
        await deleteMediaAsset(asset.id, asset.storage_path);
        navigate('/dashboard/media');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="w-8 h-8 border-brand-red border-t-transparent" />
      </div>
    );
  }

  if (!asset) {
    return <div className="text-center py-20 text-slate-500">Video not found.</div>;
  }

  const isVideo = asset.file_type.startsWith('video/');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-4"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black rounded-[2rem] overflow-hidden aspect-video flex items-center justify-center relative shadow-lg">
             {url ? (
               isVideo ? (
                 <video src={url} controls className="w-full h-full object-contain" />
               ) : (
                 <img src={url} alt={asset.file_name} className="w-full h-full object-contain" />
               )
             ) : (
               <div className="text-white/50 flex flex-col items-center">
                 <FiPlay className="text-4xl mb-2" />
                 <p>Preview not available</p>
               </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
             <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">{asset.file_name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-semibold">
                   <span>{(asset.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                   <span>•</span>
                   <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>
             </div>
             
             <div className="flex flex-wrap gap-3">
               <button onClick={() => {
                 if(url) {
                   const a = document.createElement('a');
                   a.href = url;
                   a.download = asset.file_name;
                   a.click();
                 }
               }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors tooltip" title="Download">
                 <FiDownload />
               </button>
               <button onClick={handleDelete} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors tooltip" title="Delete">
                 <FiTrash2 />
               </button>
               {asset.status === 'UPLOADED' && (
                 <button 
                   onClick={handleSubmit} 
                   disabled={submitting}
                   className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-[#F02865] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                 >
                   {submitting ? <LoadingSpinner className="w-4 h-4 border-white border-t-transparent"/> : <><FiSend /> Submit for Production</>}
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">Status</h3>
             <ProductionStatusBadge status={asset.status} className="mb-6 text-sm py-1.5 px-3" />
             
             <h4 className="text-sm font-bold text-slate-900 mb-3">Production Timeline</h4>
             <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                
                {/* Timeline Items - simplified for now */}
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-brand-red rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                  <p className="text-sm font-bold text-slate-900">Uploaded</p>
                  <p className="text-xs text-slate-500">{new Date(asset.created_at).toLocaleString()}</p>
                </div>

                {asset.status !== 'DRAFT' && asset.status !== 'UPLOADED' && (
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-brand-red rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                    <p className="text-sm font-bold text-slate-900">Submitted</p>
                    <p className="text-xs text-slate-500">Pending editing</p>
                  </div>
                )}
                
                {['EDITING', 'READY_FOR_REVIEW', 'CHANGES_REQUESTED', 'COMPLETED'].includes(asset.status) && (
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-brand-red rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                    <p className="text-sm font-bold text-slate-900">In Editing</p>
                  </div>
                )}

                {asset.status === 'COMPLETED' && (
                   <div className="relative pl-6">
                     <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white]"></div>
                     <p className="text-sm font-bold text-slate-900">Completed</p>
                   </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
