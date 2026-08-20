import type { Database } from '../../types/database.types';
import MediaCard from './MediaCard';

type MediaAsset = Database['public']['Tables']['media_assets_studio']['Row'];

interface MediaGridProps {
  assets: MediaAsset[];
  loading: boolean;
  emptyState?: React.ReactNode;
}

export default function MediaGrid({ assets, loading, emptyState }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden flex flex-col animate-pulse h-[320px]">
            <div className="aspect-video bg-slate-200 w-full" />
            <div className="p-5 flex flex-col gap-4">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="h-8 bg-slate-200 rounded" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="w-full">
        {emptyState || (
          <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
            <h4 className="text-lg font-bold text-slate-900 mb-1">No media found</h4>
            <p className="text-slate-500 mb-0 text-sm max-w-sm mx-auto">
              There is no media matching your criteria.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset) => (
        <MediaCard
          key={asset.id}
          asset={asset}
        />
      ))}
    </div>
  );
}
