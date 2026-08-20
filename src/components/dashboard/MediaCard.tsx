import { FiVideo, FiImage, FiFile, FiClock, FiHardDrive, FiCalendar } from 'react-icons/fi';
import type { Database } from '../../types/database.types';
import ProductionStatusBadge from './ProductionStatusBadge';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

interface MediaCardProps {
  asset: MediaAsset;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MediaCard({ asset }: MediaCardProps) {
  const isVideo = asset.file_type.startsWith('video/');
  const isImage = asset.file_type.startsWith('image/');

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden flex flex-col group">
      {/* Thumbnail Area - Neutral Icons Only */}
      <div className="aspect-video bg-[#F7F9FC] border-b border-slate-100 flex items-center justify-center relative">
        {isVideo ? (
          <FiVideo className="text-4xl text-slate-300" />
        ) : isImage ? (
          <FiImage className="text-4xl text-slate-300" />
        ) : (
          <FiFile className="text-4xl text-slate-300" />
        )}
        
        {asset.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/80 text-white text-xs font-bold rounded-lg flex items-center gap-1 backdrop-blur-sm">
            <FiClock className="text-[10px]" /> {formatDuration(asset.duration)}
          </div>
        )}
      </div>

      {/* Metadata Area */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1 truncate" title={asset.file_name}>
          {asset.file_name}
        </h3>
        
        <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
          <span className="uppercase text-[10px] tracking-wider font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {asset.file_type.split('/')[1] || asset.file_type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
            <FiHardDrive className="text-slate-400" />
            <span className="truncate">{formatBytes(asset.file_size)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
            <FiCalendar className="text-slate-400" />
            <span>{new Date(asset.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <ProductionStatusBadge status={asset.status} />
          {asset.project_id && (
            <span className="text-[10px] font-semibold text-slate-400 px-2 py-1 bg-slate-50 rounded-md truncate max-w-[100px]" title="Associated with a project">
              Linked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
