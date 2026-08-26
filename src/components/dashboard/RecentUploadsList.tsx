import React, { useState } from 'react';
import { FiVideo, FiStar, FiFileText, FiShield, FiX, FiDownload, FiLoader, FiAlertCircle } from 'react-icons/fi';
import MediaPreview from './MediaPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadMediaAsset } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

interface RecentUploadsListProps {
  recentUploads: MediaAsset[];
  role?: string;
  loading?: boolean;
}

export default function RecentUploadsList({ recentUploads, role, loading = false }: RecentUploadsListProps) {
  const [viewingAsset, setViewingAsset] = useState<MediaAsset | null>(null);
  // Track download state per-asset: 'idle' | 'downloading' | 'error'
  const [downloadStates, setDownloadStates] = useState<Record<string, 'idle' | 'downloading' | 'error'>>({});

  const handleAssetClick = (asset: MediaAsset) => {
    if (asset.storage_path) {
      setViewingAsset(asset);
    }
  };

  const handleDownload = async (e: React.MouseEvent, asset: MediaAsset) => {
    e.stopPropagation();
    if (downloadStates[asset.id] === 'downloading') return;

    setDownloadStates(prev => ({ ...prev, [asset.id]: 'downloading' }));
    try {
      await downloadMediaAsset(asset.storage_path, asset.file_name);
      setDownloadStates(prev => ({ ...prev, [asset.id]: 'idle' }));
    } catch {
      setDownloadStates(prev => ({ ...prev, [asset.id]: 'error' }));
      // Reset error state after 3 seconds
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [asset.id]: 'idle' }));
      }, 3000);
    }
  };

  const handleModalDownload = async (asset: MediaAsset) => {
    if (downloadStates[`modal-${asset.id}`] === 'downloading') return;
    setDownloadStates(prev => ({ ...prev, [`modal-${asset.id}`]: 'downloading' }));
    try {
      await downloadMediaAsset(asset.storage_path, asset.file_name);
      setDownloadStates(prev => ({ ...prev, [`modal-${asset.id}`]: 'idle' }));
    } catch {
      setDownloadStates(prev => ({ ...prev, [`modal-${asset.id}`]: 'error' }));
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [`modal-${asset.id}`]: 'idle' }));
      }, 3000);
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

  /** Reusable download button */
  const DownloadButton = ({ asset, modalKey }: { asset: MediaAsset; modalKey?: string }) => {
    const key = modalKey ? `modal-${asset.id}` : asset.id;
    const state = downloadStates[key] ?? 'idle';

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (modalKey) {
            handleModalDownload(asset);
          } else {
            handleDownload(e, asset);
          }
        }}
        disabled={state === 'downloading'}
        title={state === 'error' ? 'Download failed. Try again.' : 'Download file'}
        className={`
          flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg
          transition-all duration-200 select-none
          ${state === 'error'
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : state === 'downloading'
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-sm active:scale-95'}
        `}
      >
        {state === 'downloading' ? (
          <FiLoader className="animate-spin" />
        ) : state === 'error' ? (
          <FiAlertCircle />
        ) : (
          <FiDownload />
        )}
        {state === 'downloading' ? 'Downloading…' : state === 'error' ? 'Failed' : 'Download'}
      </button>
    );
  };

  if (role === 'kid') {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          {recentUploads.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className="bg-white rounded-3xl border-2 border-transparent hover:border-[#FF5E00] shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square relative">
                <MediaPreview
                  storagePath={asset.storage_path}
                  fileType={asset.file_type}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
                  <button className="w-full py-2 bg-[#FFD500] hover:bg-[#FFC000] text-[#FF5E00] font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <FiStar /> Add Magic
                  </button>
                  <button
                    onClick={(e) => handleDownload(e, asset)}
                    className="w-full py-2 bg-white/90 hover:bg-white text-emerald-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                  >
                    <FiDownload /> Download
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
        {renderModal()}
      </>
    );
  }

  if (role === 'doctor') {
    return (
      <>
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          {recentUploads.map((asset, index) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${index !== recentUploads.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors cursor-pointer`}
            >
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
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FiFileText /> Notes
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FiShield /> Protect
                </button>
                <DownloadButton asset={asset} />
              </div>
            </div>
          ))}
        </div>
        {renderModal()}
      </>
    );
  }

  function renderModal() {
    if (!viewingAsset) return null;
    const modalDownloadState = downloadStates[`modal-${viewingAsset.id}`] ?? 'idle';

    return (
      <AnimatePresence>
        {viewingAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          >
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full relative border border-slate-800">
              {/* Modal header bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-slate-800">
                <p className="text-white text-sm font-semibold truncate max-w-[60%]">{viewingAsset.file_name}</p>
                <div className="flex items-center gap-2">
                  {/* Download button in modal */}
                  <button
                    onClick={() => handleModalDownload(viewingAsset)}
                    disabled={modalDownloadState === 'downloading'}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                      ${modalDownloadState === 'error'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : modalDownloadState === 'downloading'
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 active:scale-95'}
                    `}
                  >
                    {modalDownloadState === 'downloading' ? (
                      <FiLoader className="animate-spin" />
                    ) : modalDownloadState === 'error' ? (
                      <FiAlertCircle />
                    ) : (
                      <FiDownload />
                    )}
                    {modalDownloadState === 'downloading' ? 'Downloading…' : modalDownloadState === 'error' ? 'Failed' : 'Download'}
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setViewingAsset(null)}
                    className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <FiX className="text-base" />
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-black w-full flex items-center justify-center">
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
  }

  // Default / Creator view
  return (
    <>
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {recentUploads.map((asset, index) => (
          <div
            key={asset.id}
            onClick={() => handleAssetClick(asset)}
            className={`p-4 flex items-center gap-4 ${index !== recentUploads.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors cursor-pointer group`}
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm relative">
              <MediaPreview
                storagePath={asset.storage_path}
                fileType={asset.file_type}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-red transition-colors">{asset.file_name}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {(asset.file_size / (1024 * 1024)).toFixed(2)} MB •{' '}
                <span className={
                  asset.status === 'COMPLETED'
                    ? 'text-green-600'
                    : asset.status === 'READY_FOR_REVIEW'
                    ? 'text-blue-600'
                    : ''
                }>
                  {asset.status}
                </span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {['COMPLETED', 'READY_FOR_REVIEW'].includes(asset.status) && (
                <div className="px-3 py-1.5 bg-brand-red/10 text-brand-red text-xs font-bold rounded-lg hidden sm:block">
                  View Final Video
                </div>
              )}
              {/* Download button — always visible for any asset with a storage path */}
              {asset.storage_path && (
                <DownloadButton asset={asset} />
              )}
            </div>
          </div>
        ))}
      </div>
      {renderModal()}
    </>
  );
}
