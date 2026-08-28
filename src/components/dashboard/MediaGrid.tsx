import type { ReactNode } from 'react';
import type { Database } from '../../types/database.types';
import MediaCard from './MediaCard';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

interface MediaGridProps {
  assets: MediaAsset[];
  loading?: boolean;
  onPreview?: (asset: MediaAsset) => void;
  onDelete?: (asset: MediaAsset) => void;
  onDownload?: (asset: MediaAsset) => void;
  emptyState?: ReactNode;
}

export default function MediaGrid({ assets, loading, onPreview, onDelete, onDownload, emptyState }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-video bg-slate-100 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-slate-50 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (assets.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map(asset => (
        <MediaCard 
          key={asset.id} 
          asset={asset} 
          onPreview={onPreview}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
