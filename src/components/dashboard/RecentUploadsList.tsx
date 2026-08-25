import React, { useState } from 'react';
import { FiVideo, FiFolder, FiStar, FiFileText, FiShield, FiX } from 'react-icons/fi';
import MediaPreview from './MediaPreview';
import { motion, AnimatePresence } from 'framer-motion';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

interface RecentUploadsListProps {
  recentUploads: MediaAsset[];
  role?: string;
  loading?: boolean;
}

export default function RecentUploadsList({ recentUploads, role, loading = false }: RecentUploadsListProps) {
  const [viewingAsset, setViewingAsset] = useState<MediaAsset | null>(null);

  const handleAssetClick = (asset: MediaAsset) => {
    // Only allow viewing if there is a storage path
    if (asset.storage_path) {
      setViewingAsset(asset);
    }
  };
  if (loading) {
    return <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  if (!recentUploads || recentUploads.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
        <p className="text-slate-500 text-sm">No uploads yet</p>
      </div>
    );
  }

  if (role === 'kid') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {recentUploads.map((asset) => (
          <div key={asset.id} className="bg-white rounded-3xl border-2 border-transparent hover:border-[#FF5E00] shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="aspect-square relative">
              <MediaPreview 
                storagePath={asset.storage_path} 
                fileType={asset.file_type} 
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <button className="w-full py-2 bg-[#FFD500] hover:bg-[#FFC000] text-[#FF5E00] font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                  <FiStar /> Add Magic
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-800 truncate text-sm">{asset.file_name}</p>
              <p className="text-xs font-semibold text-[#FF5E00] mt-1">{asset.status}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (role === 'doctor') {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {recentUploads.map((asset, index) => (
          <div key={asset.id} className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${index !== recentUploads.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors`}>
            <div className="w-24 h-16 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
              <MediaPreview 
                storagePath={asset.storage_path} 
                fileType={asset.file_type} 
                className="w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{asset.file_name}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <span className="bg-slate-100 px-2 py-0.5 rounded-full">{(asset.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                <span>•</span>
                <span className={asset.status === 'COMPLETED' ? 'text-teal-600' : 'text-amber-600'}>{asset.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
              <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                <FiFileText /> Notes
              </button>
              <button className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                <FiShield /> Protect
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
              {/* MediaPreview handles fetching secure URL and playing the video correctly */}
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

  // Default/Admin view
  return (
    <>
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {recentUploads.map((asset, index) => (
          <div 
            key={asset.id} 
            onClick={() => handleAssetClick(asset)}
            className={`p-4 flex items-center gap-4 ${index !== recentUploads.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors cursor-pointer group`}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm relative">
              <MediaPreview 
                storagePath={asset.storage_path} 
                fileType={asset.file_type} 
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-red transition-colors">{asset.file_name}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {(asset.file_size / (1024 * 1024)).toFixed(2)} MB • <span className={asset.status === 'COMPLETED' ? 'text-green-600' : asset.status === 'READY_FOR_REVIEW' ? 'text-blue-600' : ''}>{asset.status}</span>
              </p>
            </div>
            {['COMPLETED', 'READY_FOR_REVIEW'].includes(asset.status) && (
              <div className="px-3 py-1.5 bg-brand-red/10 text-brand-red text-xs font-bold rounded-lg hidden sm:block">
                View Final Video
              </div>
            )}
          </div>
        ))}
      </div>
      {renderModal()}
    </>
  );
}
