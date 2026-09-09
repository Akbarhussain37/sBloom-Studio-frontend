import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiFilter, FiUploadCloud, FiX } from 'react-icons/fi';
import MediaGrid from '../../components/dashboard/MediaGrid';
import MediaPreview from '../../components/dashboard/MediaPreview';
import { getMediaAssets, deleteMediaAsset, getSecureMediaUrl } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'image'>('all');
  const [viewingAsset, setViewingAsset] = useState<MediaAsset | null>(null);


  useEffect(() => {
    let isMounted = true;
    
    const loadAssets = async () => {
      try {
        const data = await getMediaAssets();
        if (isMounted) setAssets(data);
      } catch (error) {
        console.error('Error loading media assets:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAssets();
    
    // Listen for upload completion
    const handleUpload = () => loadAssets();
    window.addEventListener('media-uploaded', handleUpload);
    
    // Dynamically sync changes every 5 seconds
    const interval = setInterval(loadAssets, 5000);
    
    return () => {
      isMounted = false;
      window.removeEventListener('media-uploaded', handleUpload);
      clearInterval(interval);
    };
  }, []);

  const handleDelete = async (asset: MediaAsset) => {
    if (confirm(`Are you sure you want to delete ${asset.file_name}?`)) {
      try {
        await deleteMediaAsset(asset.id, asset.storage_path);
        setAssets(prev => prev.filter(a => a.id !== asset.id));
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Failed to delete file.');
      }
    }
  };

  const handleDownload = async (asset: MediaAsset) => {
    try {
      const url = await getSecureMediaUrl(asset.storage_path);
      // Open in new tab or trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error getting download url:', error);
      alert('Failed to start download.');
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true;
    if (filter === 'video') return asset.file_type.startsWith('video/');
    if (filter === 'image') return asset.file_type.startsWith('image/');
    return true;
  });

  const renderModal = () => (
    <AnimatePresence>
      {viewingAsset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
        >
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full relative border border-slate-800">
            <button 
              onClick={() => setViewingAsset(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
            <div className="aspect-video bg-black w-full flex items-center justify-center h-full">
              <MediaPreview 
                storagePath={viewingAsset.storage_path} 
                fileType={viewingAsset.file_type} 
                className="w-full h-full object-contain"
                autoPlay={true}
                controls={true}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Media Library</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            Manage all your videos, images, and production assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('video')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Videos
            </button>
            <button 
              onClick={() => setFilter('image')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Images
            </button>
          </div>
          
          <button className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
            <FiFilter className="text-lg" />
          </button>
        </div>
      </div>

      <MediaGrid 
        assets={filteredAssets} 
        loading={loading}
        onPreview={(asset) => setViewingAsset(asset)}
        onDelete={handleDelete}
        onDownload={handleDownload}
        emptyState={
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FiFolder className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">No media found</h4>
            <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">Upload your first video or image to get started with production.</p>
            <button 
              onClick={() => window.document.querySelector<HTMLButtonElement>('button[title="Upload"]')?.click() /* A bit hacky, but triggers upload modal if we add an ID or trigger via layout */}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors flex items-center justify-center gap-2 mx-auto shadow-sm"
            >
              <FiUploadCloud className="text-lg" /> Upload Content
            </button>
          </div>
        }
      />
      {renderModal()}
    </div>
  );
}
