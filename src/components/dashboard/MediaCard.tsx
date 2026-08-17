import { FiVideo, FiMoreVertical, FiPlay, FiDownload, FiTrash2, FiEdit2 } from 'react-icons/fi';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

interface MediaCardProps {
  asset: MediaAsset;
  onPreview?: (asset: MediaAsset) => void;
  onDelete?: (asset: MediaAsset) => void;
  onDownload?: (asset: MediaAsset) => void;
}

export default function MediaCard({ asset, onPreview, onDelete, onDownload }: MediaCardProps) {
  const isVideo = asset.file_type.startsWith('video/');

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-red/30 transition-all duration-300">
      {/* Thumbnail Area */}
      <div 
        className="aspect-video bg-slate-100 relative overflow-hidden cursor-pointer"
        onClick={() => onPreview?.(asset)}
      >
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 group-hover:bg-slate-300 transition-colors">
             {asset.thumbnail_path ? (
               <img src={asset.thumbnail_path} alt="" className="w-full h-full object-cover" />
             ) : (
               <FiVideo className="text-4xl text-slate-400" />
             )}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-red shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                 <FiPlay className="text-xl ml-1" />
               </div>
             </div>
          </div>
        ) : (
          <img 
            src={asset.thumbnail_path || ''} 
            alt={asset.file_name} 
            className="w-full h-full object-cover" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
          {asset.status.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 
            className="text-sm font-bold text-slate-900 truncate mb-1 cursor-pointer hover:text-brand-red transition-colors"
            onClick={() => onPreview?.(asset)}
          >
            {asset.file_name}
          </h4>
          <p className="text-xs font-medium text-slate-500">
            {(asset.file_size / (1024 * 1024)).toFixed(2)} MB • {new Date(asset.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Actions Dropdown (Simulated for now) */}
        <div className="relative group/menu">
          <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <FiMoreVertical />
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-xl rounded-xl py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 origin-top-right transform scale-95 group-hover/menu:scale-100">
            <button onClick={() => onPreview?.(asset)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-red flex items-center gap-2">
              <FiPlay className="text-slate-400" /> Preview
            </button>
            <button onClick={() => onDownload?.(asset)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-red flex items-center gap-2">
              <FiDownload className="text-slate-400" /> Download
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-red flex items-center gap-2">
              <FiEdit2 className="text-slate-400" /> Rename
            </button>
            <div className="h-px bg-slate-100 my-1"></div>
            <button onClick={() => onDelete?.(asset)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <FiTrash2 className="text-red-400" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
